import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { Apple, Facebook, Eye, EyeOff } from "lucide-react";
import { GoogleIcon } from "@/components/icons/GoogleIcon";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

const loginSchema = z.object({
  email: z.string().email({ message: "Invalid email address." }),
  password: z.string().min(8, { message: "Password must be at least 8 characters." }),
});

const signupSchema = z.object({
  firstName: z.string().min(2, { message: "First name is required." }),
  lastName: z.string().min(2, { message: "Last name is required." }),
  email: z.string().email({ message: "Invalid email address." }),
  password: z.string().min(8, { message: "Password must be at least 8 characters." }),
});

interface AuthModalProps {
  children: React.ReactNode;
  mode: "login" | "signup";
}

export const AuthModal = ({ children, mode: initialMode }: AuthModalProps) => {
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState(initialMode);
  const [showPassword, setShowPassword] = useState(false);

  const handleSocialLogin = (provider: string) => {
    toast.info(`${provider} login is a demo feature.`, {
      description: "This is for demonstration purposes only.",
    });
  };

  const SocialLogins = () => (
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

  const LoginFormComponent = () => {
    const form = useForm<z.infer<typeof loginSchema>>({
      resolver: zodResolver(loginSchema),
      defaultValues: { email: "", password: "" },
    });
    function onSubmit(values: z.infer<typeof loginSchema>) {
      console.log(values);
      toast.success("Logged In!", {
        description: "Welcome back to PlateWise! (This is a demo)",
      });
      setOpen(false);
    }
    return (
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="john.doe@example.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      {...field}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 text-muted-foreground hover:text-foreground"
                      onClick={() => setShowPassword((prev) => !prev)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                      <span className="sr-only">
                        {showPassword ? "Hide password" : "Show password"}
                      </span>
                    </Button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="w-full">
            Log In
          </Button>
        </form>
        <SocialLogins />
      </Form>
    );
  };

  const SignupFormComponent = () => {
    const form = useForm<z.infer<typeof signupSchema>>({
      resolver: zodResolver(signupSchema),
      defaultValues: { firstName: "", lastName: "", email: "", password: "" },
    });
    function onSubmit(values: z.infer<typeof signupSchema>) {
      console.log(values);
      toast.success("Signed Up!", {
        description: "Welcome to PlateWise! (This is a demo)",
      });
      setOpen(false);
    }
    return (
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>First Name</FormLabel>
                  <FormControl>
                    <Input placeholder="John" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Last Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Doe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="john.doe@example.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      {...field}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 text-muted-foreground hover:text-foreground"
                      onClick={() => setShowPassword((prev) => !prev)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                      <span className="sr-only">
                        {showPassword ? "Hide password" : "Show password"}
                      </span>
                    </Button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="w-full">
            Create Account
          </Button>
        </form>
        <SocialLogins />
      </Form>
    );
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{mode === "login" ? "Log In" : "Sign Up"}</DialogTitle>
          <DialogDescription>
            {mode === "login"
              ? "Enter your credentials to access your account."
              : "Create an account to start saving food."}
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          {mode === "login" ? <LoginFormComponent /> : <SignupFormComponent />}
        </div>
        <div className="text-center text-sm">
          {mode === "login" ? "Don't have an account?" : "Already have an account?"}{" "}
          <Button
            variant="link"
            onClick={() => {
              setMode(mode === "login" ? "signup" : "login");
              setShowPassword(false);
            }}
            className="p-0 h-auto"
          >
            {mode === "login" ? "Sign up" : "Log in"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
