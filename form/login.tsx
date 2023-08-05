import { useMemo, useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { useToast } from "../ui/use-toast";
import { LoginDto } from "../domain/dto/login.dto";
import { Label } from "@radix-ui/react-label";

import { Link, useLocation, useNavigate } from "react-router-dom";
import authService from "../domain/services/auth.service";
import { ThemeSwitcher, useColor } from "../feature/theme";

function Login() {
  const { toast } = useToast();
  const [emailField, setEmailField] = useState("");
  const [passwordField, setPasswordField] = useState("");
  const [isEmailValid, setIsEmailValid] = useState(true);

  const navigate = useNavigate();
  const location = useLocation();
  const bgColorClass = useColor();

  const [isLoading, setIsloading] = useState(false);
  const disabled = useMemo(() => {
    return emailField === "" || passwordField === "";
  }, [emailField, passwordField]);

  function validateEmail(email: string) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  async function handleSubmit(e: any): Promise<void> {
    e.preventDefault();
    setIsloading(() => true);

    const dto: LoginDto = {
      email: emailField,
      password: passwordField,
    };

    const response = await authService.login(dto);

    if (!validateEmail(emailField)) {
      setIsEmailValid(false);
      setTimeout(() => {
        setIsEmailValid(true);
      }, 3000);
      setIsloading(false);
    } else {
      if (response.success) {
        toast({
          title: "Success",
          description: `Connexion réussie`,
          variant: "default",
        });
        if (location.state && location.state.from) {
          navigate(location.state.from);
        } else {
          navigate("/");
        }
      } else {
        toast({
          title: "Error",
          description: `${response.message}`,
          variant: "destructive",
        });
      }
      setIsloading(false);
    }
  }

  return (
    <>
      <div className="flex justify-end fixed bottom-4 right-4 z-50">
        <ThemeSwitcher />
      </div>

      <div className="flex flex-col justify-center items-center h-screen ">
        <div className={`${bgColorClass} rounded-lg shadow-lg p-8 w-96 h-96`}>
          <div className="text-primary flex flex-col justify-center items-center h-full gap-6 max-w-60">
            <h2 className="text-3xl font-bold">Se connecter</h2>
            <div className="flex flex-col items-center gap-4">
              <div className="w-full">
                <Label>Email</Label>
                {!isEmailValid && (
                  <p
                    style={{ color: "red", margin: "4px 0", fontSize: "14px" }}
                  >
                    Veuillez saisir une adresse email valide.
                  </p>
                )}
                <Input
                  type="email"
                  placeholder="nom_utilisateur@domaine.extension"
                  value={emailField}
                  onChange={(e) => {
                    setEmailField(e.target.value);
                  }}
                />
              </div>
              <div className="w-full">
                <Label>Mot de passe</Label>
                <Input
                  type="password"
                  placeholder="Mot de passe"
                  value={passwordField}
                  onChange={(e) => setPasswordField(e.target.value)}
                />
                <a className="float-right" href="#">
                  mot de passe oublié ?
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
                  Se connecter
                </Button>
                <span>
                  Vous n'avez pas de compte ?{" "}
                  <Link className="ml-2" to="/inscription">
                    S'inscrire
                  </Link>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Login;
