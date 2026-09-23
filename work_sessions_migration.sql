CREATE TABLE public.work_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    employee_id UUID NOT NULL REFERENCES public.employees(id) ON DELETE CASCADE,
    check_in_time TIMESTAMPTZ NOT NULL DEFAULT now(),
    check_out_time TIMESTAMPTZ,
    session_date DATE NOT NULL DEFAULT CURRENT_DATE
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.work_sessions ENABLE ROW LEVEL SECURITY;

-- Allow employees to read their own sessions
CREATE POLICY "Employees can view their own work sessions"
ON public.work_sessions
FOR SELECT
TO authenticated
USING (
    employee_id = (SELECT id FROM public.employees WHERE auth_user_id = auth.uid())
);

-- Allow employees to insert their own sessions
CREATE POLICY "Employees can insert their own work sessions"
ON public.work_sessions
FOR INSERT
TO authenticated
WITH CHECK (
    employee_id = (SELECT id FROM public.employees WHERE auth_user_id = auth.uid())
);

-- Allow employees to update their own sessions (e.g., check out)
CREATE POLICY "Employees can update their own work sessions"
ON public.work_sessions
FOR UPDATE
TO authenticated
USING (
    employee_id = (SELECT id FROM public.employees WHERE auth_user_id = auth.uid())
);
