import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

/**
 * Generates a unique, secure temporary password meeting Supabase Auth requirements.
 * Guaranteed to contain uppercase, lowercase, numbers, and special symbols.
 */
function generateTemporaryPassword(): string {
  const upper = "ABCDEFGHJKLMNPQRSTUVWXYZ";
  const lower = "abcdefghijkmnopqrstuvwxyz";
  const numbers = "23456789";
  const symbols = "!@#$%^&*";

  const getRandomChar = (set: string) => set[Math.floor(Math.random() * set.length)];

  // Ensure at least one character from each required set
  const pwdChars = [
    getRandomChar(upper),
    getRandomChar(lower),
    getRandomChar(numbers),
    getRandomChar(symbols),
  ];

  const allChars = upper + lower + numbers + symbols;
  for (let i = 0; i < 8; i++) {
    pwdChars.push(getRandomChar(allChars));
  }

  // Shuffle using Fisher-Yates algorithm
  for (let i = pwdChars.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pwdChars[i], pwdChars[j]] = [pwdChars[j], pwdChars[i]];
  }

  return pwdChars.join("");
}

serve(async (req: Request) => {
  // 1. Handle CORS Preflight OPTIONS request
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  // 2. Enforce HTTP POST method
  if (req.method !== "POST") {
    return new Response(
      JSON.stringify({ error: "Method not allowed. Only POST requests are accepted." }),
      { status: 405, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }

  try {
    // 3. Extract Authorization Header
    const authHeader = req.headers.get("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return new Response(
        JSON.stringify({ error: "Unauthorized. Missing or invalid Authorization header." }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    const token = authHeader.replace("Bearer ", "").trim();

    // 4. Validate Environment Configuration
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!supabaseUrl || !serviceRoleKey) {
      return new Response(
        JSON.stringify({
          error: "Server configuration error: Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY environment variables.",
        }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // 5. Initialize Privileged Supabase Admin Client
    const adminClient = createClient(supabaseUrl, serviceRoleKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });

    // 6. Verify Caller Authenticated Supabase Session
    const { data: { user: callerAuthUser }, error: callerAuthErr } = await adminClient.auth.getUser(token);
    if (callerAuthErr || !callerAuthUser) {
      return new Response(
        JSON.stringify({ error: "Unauthorized session or expired authentication token." }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // 7. Verify Caller Role in public.employees table
    const { data: callerEmployee, error: callerEmpErr } = await adminClient
      .from("employees")
      .select("id, full_name, role, employee_id")
      .eq("auth_user_id", callerAuthUser.id)
      .single();

    if (callerEmpErr || !callerEmployee) {
      return new Response(
        JSON.stringify({ error: "Forbidden. Caller is not associated with an active employee record." }),
        { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const callerRole = (callerEmployee.role || "").toLowerCase();
    if (callerRole !== "super_admin" && callerRole !== "hr") {
      return new Response(
        JSON.stringify({
          error: `Forbidden. Only Super Admin or HR roles can provision employee accounts. Current caller role: '${callerEmployee.role || "none"}'.`,
        }),
        { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // 8. Parse and Validate Request Body
    let body: { target_employee_id?: string } = {};
    try {
      body = await req.json();
    } catch {
      return new Response(
        JSON.stringify({ error: "Invalid JSON request body." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const targetEmployeeId = body.target_employee_id;
    if (!targetEmployeeId || typeof targetEmployeeId !== "string") {
      return new Response(
        JSON.stringify({ error: "Bad Request. Missing required parameter: target_employee_id." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // 9. Fetch and Validate Target Employee
    const { data: targetEmployee, error: targetEmpErr } = await adminClient
      .from("employees")
      .select("id, employee_id, full_name, email, auth_user_id, employment_status")
      .eq("id", targetEmployeeId)
      .single();

    if (targetEmpErr || !targetEmployee) {
      return new Response(
        JSON.stringify({ error: `Target employee with ID '${targetEmployeeId}' was not found.` }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // STRICT EXCLUSION: Employee ID 169 (Sandip Padhiyar) must NOT be provisioned
    if (String(targetEmployee.employee_id).trim() === "169") {
      return new Response(
        JSON.stringify({
          error: "Provisioning denied. Employee ID 169 (Sandip Padhiyar) is excluded from dashboard account provisioning.",
        }),
        { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Validate corporate email presence
    if (!targetEmployee.email || !targetEmployee.email.trim() || !targetEmployee.email.includes("@")) {
      return new Response(
        JSON.stringify({
          error: `Provisioning failed. Target employee '${targetEmployee.full_name}' does not have a valid email address.`,
        }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Reject if employee already has an Auth account linked
    if (targetEmployee.auth_user_id) {
      return new Response(
        JSON.stringify({
          error: `Provisioning failed. Employee '${targetEmployee.full_name}' (ID: ${targetEmployee.employee_id}) already has a linked Auth account.`,
        }),
        { status: 409, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // 10. Generate Server-Side Temporary Password
    const tempPassword = generateTemporaryPassword();

    // 11. Create Supabase Auth User via Admin API
    const { data: newAuthData, error: createAuthErr } = await adminClient.auth.admin.createUser({
      email: targetEmployee.email.trim(),
      password: tempPassword,
      email_confirm: true,
      user_metadata: {
        full_name: targetEmployee.full_name,
        employee_id: targetEmployee.employee_id,
        employee_uuid: targetEmployee.id,
      },
    });

    if (createAuthErr || !newAuthData?.user) {
      return new Response(
        JSON.stringify({
          error: `Failed to create Supabase Auth user: ${createAuthErr?.message || "Unknown error"}`,
        }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const newAuthUserId = newAuthData.user.id;

    // 12. Link Auth User ID & Set must_change_password = true in public.employees
    const { error: dbUpdateErr } = await adminClient
      .from("employees")
      .update({
        auth_user_id: newAuthUserId,
        must_change_password: true,
        updated_at: new Date().toISOString(),
      })
      .eq("id", targetEmployee.id);

    if (dbUpdateErr) {
      // ROLLBACK: Delete newly created Auth user to prevent orphaned Auth account
      console.error(
        `Database linking failed for employee '${targetEmployee.id}'. Rolling back created Auth user '${newAuthUserId}'...`,
        dbUpdateErr
      );
      await adminClient.auth.admin.deleteUser(newAuthUserId);

      return new Response(
        JSON.stringify({
          error: `Failed to link Auth user to employee record. Auth account creation was rolled back. Details: ${dbUpdateErr.message}`,
        }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // 13. Return Success Response for UI consumption
    return new Response(
      JSON.stringify({
        success: true,
        employee_id: targetEmployee.employee_id,
        full_name: targetEmployee.full_name,
        email: targetEmployee.email,
        auth_user_id: newAuthUserId,
        temporary_password: tempPassword,
        must_change_password: true,
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err: any) {
    console.error("Unhandled error in provision-employee-account function:", err);
    return new Response(
      JSON.stringify({ error: err.message || "An unexpected server error occurred during provisioning." }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
