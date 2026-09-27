-- Canonical Migration: public.work_sessions & RPC Attendance Functions

-- 1. Table Structure
CREATE TABLE IF NOT EXISTS public.work_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    employee_id UUID NOT NULL REFERENCES public.employees(id) ON DELETE CASCADE,
    check_in_time TIMESTAMPTZ NOT NULL DEFAULT now(),
    check_out_time TIMESTAMPTZ,
    session_date DATE NOT NULL DEFAULT CURRENT_DATE
);

-- Enable Row Level Security
ALTER TABLE public.work_sessions ENABLE ROW LEVEL SECURITY;

-- 2. Unique Partial Index to Prevent Duplicate Active Sessions per Employee
CREATE UNIQUE INDEX IF NOT EXISTS idx_work_sessions_active_employee
ON public.work_sessions (employee_id)
WHERE check_out_time IS NULL;

-- 3. RPC Function: get_active_work_session()
CREATE OR REPLACE FUNCTION public.get_active_work_session()
RETURNS public.work_sessions
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
    v_employee_id UUID;
    v_session public.work_sessions;
BEGIN
    SELECT id INTO v_employee_id
    FROM public.employees
    WHERE auth_user_id = auth.uid()
    LIMIT 1;

    IF v_employee_id IS NULL THEN
        RETURN NULL;
    END IF;

    SELECT * INTO v_session
    FROM public.work_sessions
    WHERE employee_id = v_employee_id
      AND check_out_time IS NULL
    ORDER BY check_in_time DESC
    LIMIT 1;

    RETURN v_session;
END;
$$;

-- 4. RPC Function: check_in()
CREATE OR REPLACE FUNCTION public.check_in()
RETURNS public.work_sessions
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
    v_employee_id UUID;
    v_session public.work_sessions;
BEGIN
    SELECT id INTO v_employee_id
    FROM public.employees
    WHERE auth_user_id = auth.uid()
    LIMIT 1;

    IF v_employee_id IS NULL THEN
        RAISE EXCEPTION 'Authenticated user is not linked to an employee record';
    END IF;

    -- Return existing active session if one already exists
    SELECT * INTO v_session
    FROM public.work_sessions
    WHERE employee_id = v_employee_id
      AND check_out_time IS NULL
    ORDER BY check_in_time DESC
    LIMIT 1;

    IF v_session.id IS NOT NULL THEN
        RETURN v_session;
    END IF;

    -- Insert new work session
    INSERT INTO public.work_sessions (employee_id, check_in_time, session_date)
    VALUES (v_employee_id, now(), CURRENT_DATE)
    RETURNING * INTO v_session;

    RETURN v_session;
END;
$$;

-- 5. RPC Function: check_out()
CREATE OR REPLACE FUNCTION public.check_out()
RETURNS public.work_sessions
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
    v_employee_id UUID;
    v_session public.work_sessions;
BEGIN
    SELECT id INTO v_employee_id
    FROM public.employees
    WHERE auth_user_id = auth.uid()
    LIMIT 1;

    IF v_employee_id IS NULL THEN
        RAISE EXCEPTION 'Authenticated user is not linked to an employee record';
    END IF;

    SELECT * INTO v_session
    FROM public.work_sessions
    WHERE employee_id = v_employee_id
      AND check_out_time IS NULL
    ORDER BY check_in_time DESC
    LIMIT 1;

    IF v_session.id IS NULL THEN
        RAISE EXCEPTION 'No active work session found';
    END IF;

    UPDATE public.work_sessions
    SET check_out_time = now()
    WHERE id = v_session.id
    RETURNING * INTO v_session;

    RETURN v_session;
END;
$$;

-- 6. Function Security & Execution Grants
REVOKE EXECUTE ON FUNCTION public.get_active_work_session() FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.check_in() FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.check_out() FROM PUBLIC, anon;

GRANT EXECUTE ON FUNCTION public.get_active_work_session() TO authenticated;
GRANT EXECUTE ON FUNCTION public.check_in() TO authenticated;
GRANT EXECUTE ON FUNCTION public.check_out() TO authenticated;

-- 7. Table Permissions & RLS Policies
REVOKE INSERT, UPDATE, DELETE ON public.work_sessions FROM authenticated, anon, PUBLIC;
GRANT SELECT ON public.work_sessions TO authenticated;

DROP POLICY IF EXISTS "Employees can view their own work sessions" ON public.work_sessions;
DROP POLICY IF EXISTS "Employees can insert their own work sessions" ON public.work_sessions;
DROP POLICY IF EXISTS "Employees can update their own work sessions" ON public.work_sessions;

CREATE POLICY "Employees can view their own work sessions"
ON public.work_sessions
FOR SELECT
TO authenticated
USING (
    employee_id IN (SELECT id FROM public.employees WHERE auth_user_id = auth.uid())
);
