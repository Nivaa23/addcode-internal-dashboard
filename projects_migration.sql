-- Projects Table Security & RLS Policy Migration

-- 1. Ensure Row Level Security (RLS) is enabled on public.projects
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

-- 2. Grant SELECT privilege to the authenticated role
GRANT SELECT ON public.projects TO authenticated;

-- 3. Create SELECT policy for authenticated users
DROP POLICY IF EXISTS "Authenticated users can view projects" ON public.projects;
CREATE POLICY "Authenticated users can view projects"
ON public.projects
FOR SELECT
TO authenticated
USING (true);
