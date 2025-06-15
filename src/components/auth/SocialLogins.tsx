
import { toast } from "sonner";
import { Facebook, Apple } from "lucide-react";
import { GoogleIcon } from "@/components/icons/GoogleIcon";
import { Button } from "@/components/ui/button";

const handleSocialLogin = (provider: string) => {
  toast.info(`${provider} login is a demo feature.`, {
    description: "This is for demonstration purposes only.",
  });
};

export const SocialLogins = () => (
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
        onClick={() => handleSocialLogin("Google")}
      >
        <GoogleIcon className="mr-2 h-4 w-4" />
        Continue with Google
      </Button>
      <Button
        variant="outline"
        type="button"
        className="w-full"
        onClick={() => handleSocialLogin("Facebook")}
      >
        <Facebook className="mr-2 h-4 w-4 fill-current" />
        Continue with Facebook
      </Button>
      <Button
        variant="outline"
        type="button"
        className="w-full"
        onClick={() => handleSocialLogin("Apple")}
      >
        <Apple className="mr-2 h-4 w-4 fill-current" />
        Continue with Apple
      </Button>
    </div>
  </>
);

