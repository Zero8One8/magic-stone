
-- Allow authenticated users to read contact requests
CREATE POLICY "Authenticated users can view contact requests"
ON public.contact_requests
FOR SELECT
TO authenticated
USING (true);

-- Allow authenticated users to update contact requests (change status, etc.)
CREATE POLICY "Authenticated users can update contact requests"
ON public.contact_requests
FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

-- Allow authenticated users to delete contact requests
CREATE POLICY "Authenticated users can delete contact requests"
ON public.contact_requests
FOR DELETE
TO authenticated
USING (true);
