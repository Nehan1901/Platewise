import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: {
      ...corsHeaders,
      "Content-Type": "application/json",
    },
  });

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return json({ error: "Unauthorized" }, 401);
    }

    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } },
    );

    const token = authHeader.replace("Bearer ", "");
    const { data: authData, error: authError } = await supabaseAdmin.auth.getUser(token);

    if (authError || !authData.user) {
      return json({ error: "Unauthorized" }, 401);
    }

    const body = await req.json();
    const businessName = typeof body.businessName === "string" ? body.businessName.trim() : "";
    const businessType = typeof body.businessType === "string" ? body.businessType : "restaurant";
    const address = typeof body.address === "string" ? body.address.trim() : "";
    const phone = typeof body.phone === "string" ? body.phone.trim() : "";
    const description = typeof body.description === "string" ? body.description.trim() : "";
    const website = typeof body.website === "string" ? body.website.trim() : "";
    const logoUrl = typeof body.logoUrl === "string" ? body.logoUrl.trim() : "";

    if (businessName.length < 2) {
      return json({ error: "Business name must be at least 2 characters." }, 400);
    }

    if (address.length < 5) {
      return json({ error: "Address is required." }, 400);
    }

    if (phone.length < 10) {
      return json({ error: "A valid phone number is required." }, 400);
    }

    const { data: profile, error: profileError } = await supabaseAdmin
      .from("business_profiles")
      .upsert(
        {
          user_id: authData.user.id,
          business_name: businessName,
          business_type: businessType,
          description: description || null,
          address,
          phone,
          website: website || null,
          logo_url: logoUrl || null,
        },
        { onConflict: "user_id" },
      )
      .select("*")
      .single();

    if (profileError) {
      throw profileError;
    }

    try {
      await supabaseAdmin.from("user_roles").delete().eq("user_id", authData.user.id);
      await supabaseAdmin.from("user_roles").insert({
        user_id: authData.user.id,
        role: "business",
      });
    } catch (roleError) {
      console.error("Role sync error", roleError);
    }

    return json({ profile });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to save business profile.";
    console.error("SAVE_BUSINESS_PROFILE_ERROR", message);
    return json({ error: message }, 500);
  }
});