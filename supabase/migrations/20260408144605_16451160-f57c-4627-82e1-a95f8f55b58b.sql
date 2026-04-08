
-- Allow business owners to view orders for their business
CREATE POLICY "Business owners can view their orders"
ON public.orders
FOR SELECT
TO authenticated
USING (business_id IN (
  SELECT id FROM public.business_profiles WHERE user_id = auth.uid()
));

-- Allow business owners to update orders for their business
CREATE POLICY "Business owners can update their orders"
ON public.orders
FOR UPDATE
TO authenticated
USING (business_id IN (
  SELECT id FROM public.business_profiles WHERE user_id = auth.uid()
));
