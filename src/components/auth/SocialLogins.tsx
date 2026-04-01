import { useState } from "react";
import { toast } from "sonner";
import { GoogleIcon } from "@/components/icons/GoogleIcon";
import { Button } from "@/components/ui/button";
import { AppleIcon } from "@/components/icons/AppleIcon";
import { Phone, Loader2 } from "lucide-react";
import { lovable } from "@/integrations/lovable/index";
import { PhoneAuthForm } from "./PhoneAuthForm";

interface SocialLoginsProps {
  onPhoneAuth?: () => void;
}

export const SocialLogins = ({ onPhoneAuth }: SocialLoginsProps) => {
  const [loading, setLoading] = useState<string | null>(null);
  const [showPhone, setShowPhone] = useState(false);

  const handleGoogleLogin = async () => {
    setLoading("google");
    try {
      const result = await lovable.auth.signInWithOAuth("google", {
        redirect_uri: window.location.origin,
      });
      if (result.error) {
        toast.error("Google sign-in failed", { description: String(result.error) });
      }
      if (result.redirected) return;
    } catch (e) {
      toast.error("Google sign-in failed");
    } finally {
      setLoading(null);
    }
  };

  const handleAppleLogin = async () => {
    setLoading("apple");
    try {
      const result = await lovable.auth.signInWithOAuth("apple", {
        redirect_uri: window.location.origin,
      });
      if (result.error) {
        toast.error("Apple sign-in failed", { description: String(result.error) });
      }
      if (result.redirected) return;
    } catch (e) {
      toast.error("Apple sign-in failed");
    } finally {
      setLoading(null);
    }
  };

  if (showPhone) {
    return <PhoneAuthForm onBack={() => setShowPhone(false)} />;
  }

  return (
    <>
      <div className="relative my-4">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">or</span>
        </div>
      </div>
      <div className="space-y-2">
        <Button
          variant="outline"
          type="button"
          className="w-full"
          onClick={handleGoogleLogin}
          disabled={!!loading}
        >
          {loading === "google" ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <GoogleIcon className="mr-2 h-4 w-4" />}
          Continue with Google
        </Button>
        <Button
          type="button"
          className="w-full bg-black text-white hover:bg-black/90 dark:bg-white dark:text-black dark:hover:bg-white/90 rounded-full"
          onClick={handleAppleLogin}
          disabled={!!loading}
        >
          {loading === "apple" ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <AppleIcon className="mr-2 h-4 w-4" />}
          Sign in with Apple
        </Button>
        <Button
          variant="outline"
          type="button"
          className="w-full"
          onClick={() => setShowPhone(true)}
          disabled={!!loading}
        >
          <Phone className="mr-2 h-4 w-4" />
          Sign in with Phone
        </Button>
      </div>
    </>
  );
};
