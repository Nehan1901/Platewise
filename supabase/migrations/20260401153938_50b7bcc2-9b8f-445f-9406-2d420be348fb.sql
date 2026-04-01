
-- Create role enum
CREATE TYPE public.app_role AS ENUM ('consumer', 'business');

-- Create user_roles table
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Security definer function to check roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Function to get user role
CREATE OR REPLACE FUNCTION public.get_user_role(_user_id UUID)
RETURNS app_role
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT role
  FROM public.user_roles
  WHERE user_id = _user_id
  LIMIT 1
$$;

-- RLS policies for user_roles
CREATE POLICY "Users can view their own roles" ON public.user_roles
  FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own role" ON public.user_roles
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Create business_profiles table
CREATE TABLE public.business_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  business_name TEXT NOT NULL,
  business_type TEXT NOT NULL DEFAULT 'restaurant',
  description TEXT,
  address TEXT,
  latitude DOUBLE PRECISION,
  longitude DOUBLE PRECISION,
  phone TEXT,
  website TEXT,
  logo_url TEXT,
  hours JSONB DEFAULT '{}',
  is_verified BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.business_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Business owners can view their own profile" ON public.business_profiles
  FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Business owners can insert their own profile" ON public.business_profiles
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Business owners can update their own profile" ON public.business_profiles
  FOR UPDATE TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Anyone can view business profiles" ON public.business_profiles
  FOR SELECT
  USING (true);

-- Create listings table
CREATE TABLE public.listings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID REFERENCES public.business_profiles(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  item_type TEXT NOT NULL DEFAULT 'prepared_food',
  original_price NUMERIC NOT NULL,
  discounted_price NUMERIC NOT NULL,
  quantity_available INTEGER NOT NULL DEFAULT 1,
  quantity_unit TEXT DEFAULT 'servings',
  image_urls TEXT[] DEFAULT '{}',
  pickup_start_time TIMESTAMP WITH TIME ZONE,
  pickup_end_time TIMESTAMP WITH TIME ZONE,
  dietary_info TEXT[] DEFAULT '{}',
  allergen_info TEXT[] DEFAULT '{}',
  is_active BOOLEAN DEFAULT true,
  status TEXT DEFAULT 'available',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.listings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active listings" ON public.listings
  FOR SELECT
  USING (true);

CREATE POLICY "Business owners can insert their own listings" ON public.listings
  FOR INSERT TO authenticated
  WITH CHECK (
    business_id IN (SELECT id FROM public.business_profiles WHERE user_id = auth.uid())
  );

CREATE POLICY "Business owners can update their own listings" ON public.listings
  FOR UPDATE TO authenticated
  USING (
    business_id IN (SELECT id FROM public.business_profiles WHERE user_id = auth.uid())
  );

CREATE POLICY "Business owners can delete their own listings" ON public.listings
  FOR DELETE TO authenticated
  USING (
    business_id IN (SELECT id FROM public.business_profiles WHERE user_id = auth.uid())
  );

-- Add business_id to orders table
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS business_id UUID;

-- Enable realtime on orders
ALTER PUBLICATION supabase_realtime ADD TABLE public.orders;

-- Create listing-images storage bucket
INSERT INTO storage.buckets (id, name, public) VALUES ('listing-images', 'listing-images', true);

-- Storage policy for listing images
CREATE POLICY "Authenticated users can upload listing images"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'listing-images');

CREATE POLICY "Anyone can view listing images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'listing-images');

CREATE POLICY "Users can delete their own listing images"
  ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'listing-images');

-- Trigger for updated_at on new tables
CREATE TRIGGER update_business_profiles_updated_at
  BEFORE UPDATE ON public.business_profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_listings_updated_at
  BEFORE UPDATE ON public.listings
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
