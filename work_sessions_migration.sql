CREATE TABLE IF NOT EXISTS public.work_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    employee_id UUID NOT NULL REFERENCES public.employees(id) ON DELETE CASCADE,
    check_in_time TIMESTAMPTZ NOT NULL DEFAULT now(),
    check_out_time TIMESTAMPTZ,
    session_date DATE NOT NULL DEFAULT CURRENT_DATE
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.work_sessions ENABLE ROW LEVEL SECURITY;

-- Helper Function: Resolves employee UUID for the authenticated user securely without RLS subquery recursion
CREATE OR REPLACE FUNCTION public.get_authenticated_employee_id()
RETURNS UUID
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
    SELECT id FROM public.employees WHERE auth_user_id = auth.uid() LIMIT 1;
$$;

GRANT EXECUTE ON FUNCTION public.get_authenticated_employee_id() TO authenticated;

-- Allow employees to read their own sessions
DROP POLICY IF EXISTS "Employees can view their own work sessions" ON public.work_sessions;
CREATE POLICY "Employees can view their own work sessions"
ON public.work_sessions
FOR SELECT
TO authenticated
USING (
    employee_id = public.get_authenticated_employee_id()
);

-- Allow employees to insert their own sessions
DROP POLICY IF EXISTS "Employees can insert their own work sessions" ON public.work_sessions;
CREATE POLICY "Employees can insert their own work sessions"
ON public.work_sessions
FOR INSERT
TO authenticated
WITH CHECK (
    employee_id = public.get_authenticated_employee_id()
);

-- Allow employees to update their own sessions (e.g., check out)
DROP POLICY IF EXISTS "Employees can update their own work sessions" ON public.work_sessions;
CREATE POLICY "Employees can update their own work sessions"
ON public.work_sessions
FOR UPDATE
TO authenticated
USING (
    employee_id = public.get_authenticated_employee_id()
);

-- Grant table-level DML privileges to authenticated role
GRANT SELECT, INSERT, UPDATE ON public.work_sessions TO authenticated;
