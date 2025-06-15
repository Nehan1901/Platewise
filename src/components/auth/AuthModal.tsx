
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { LoginFormComponent } from "./LoginFormComponent";
import { SignupFormComponent } from "./SignupFormComponent";

interface AuthModalProps {
  children: React.ReactNode;
  mode: "login" | "signup";
}

export const AuthModal = ({ children, mode: initialMode }: AuthModalProps) => {
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState(initialMode);

  const handleSuccess = () => {
    setOpen(false);
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
          {mode === "login" ? (
            <LoginFormComponent onSuccess={handleSuccess} />
          ) : (
            <SignupFormComponent onSuccess={handleSuccess} />
          )}
        </div>
        <div className="text-center text-sm">
          {mode === "login" ? "Don't have an account?" : "Already have an account?"}{" "}
          <Button
            variant="link"
            onClick={() => {
              setMode(mode === "login" ? "signup" : "login");
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
