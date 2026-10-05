import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

async function inspectEmployees() {
  console.log('Testing auth login...');
  const { data: authData, error: authErr } = await supabase.auth.signInWithPassword({
    email: 'elena.rostova@addcode.engineering',
    password: 'password123'
  });

  if (authErr) {
    console.log('Login failed:', authErr.message);
  } else {
    console.log('Logged in as:', authData.user.email);
  }

  const { data, error } = await supabase
    .from('employees')
    .select('id, full_name, employee_id, employment_status, designation, email, auth_user_id');

  console.log('Employees query error:', error);
  console.log('Employees row count:', data?.length);
  console.log('Employees rows:', JSON.stringify(data, null, 2));
}

inspectEmployees();
