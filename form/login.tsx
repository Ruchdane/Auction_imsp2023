import { useMemo, useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { useToast } from "../ui/use-toast";

function Login() {
  const { toast } = useToast();
  const [emailField, setEmailField] = useState("");
  const [passwordField, setPasswordField] = useState("");
  const toastType = ["Error", "Warning", "Info"];

  const [isLoading, setIsloading] = useState(false);
  const disabled = useMemo(() => {
    return emailField === "" || passwordField === "";
  }, [emailField, passwordField]);

  function handleSubmit(e: any): void {
    e.preventDefault();
    setIsloading(() => true);
    setTimeout(() => {
      setIsloading(() => false);
      toast({
        title: toastType[0],
        description: `${""}`,
      });
    }, 1000);
  }

  return (
    <div className="text-primary flex flex-col justify-center items-center h-full gap-6 max-w-60">
      <h2 className="text-3xl font-bold">Sign in</h2>
      <div className="flex flex-col items-center gap-4">
        <div>
          <Input
            placeholder="Email"
            value={emailField}
            onChange={(e) => setEmailField(e.target.value)}
          />
        </div>
        <div>
          <Input
            placeholder="Password"
            value={passwordField}
            onChange={(e) => setPasswordField(e.target.value)}
          />
          <a className="float-right" href="#">
            Forgot password?
          </a>
        </div>

        <div className="flex flex-col items-center gap-2">
          <Button
            isLoading={isLoading}
            disabled={disabled}
            onClick={handleSubmit}
            type="submit"
            className="w-2/3"
          >
            Sign In
          </Button>
          <span>
            Don't have an account?{" "}
            <a className="ml-2" href="#">
              Signup
            </a>
          </span>
        </div>
      </div>
    </div>
  );
}

export default Login;
