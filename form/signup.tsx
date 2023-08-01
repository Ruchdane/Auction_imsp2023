import { useMemo, useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { useToast } from "../ui/use-toast";
import { RegisterDto } from "../domain/dto/register.dto";
import AuthService from "../domain/services/auth.service";
import { Link, useNavigate } from "react-router-dom";
import { ThemeSwitcher, useColor } from "../feature/theme";
import { Label } from "@radix-ui/react-label";

function Signup() {
  const { toast } = useToast();
  const [emailField, setEmailField] = useState("");
  const [nameField, setNameField] = useState("");
  const [passwordField, setPasswordField] = useState("");
  const [repasswordField, setRepasswordField] = useState("");
  const [isEmailValid, setIsEmailValid] = useState(true);

  const navigate = useNavigate();
  const bgColorClass = useColor();

  const [isLoading, setIsloading] = useState(false);
  const disabled = useMemo(() => {
    return (
      emailField === "" ||
      passwordField === "" ||
      repasswordField === "" ||
      passwordField != repasswordField
    );
  }, [emailField, passwordField, repasswordField]);

  function validateEmail(email: string) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  async function handleSubmit(e: any): Promise<void> {
    e.preventDefault();
    setIsloading(() => true);

    const dto: RegisterDto = {
      email: emailField,
      password: passwordField,
      name: nameField,
    };

    if (!validateEmail(e.target.value)) {
      setIsEmailValid(false);
      setTimeout(() => {
        setIsEmailValid(true);
      }, 3000);
      setIsloading(false);
    } else {
      const response = await AuthService.signup(dto);

      if (response.success) {
        toast({
          title: "Success",
          description: `Inscription réussie`,
          variant: "default",
        });
        navigate("/authentification");
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
        <div className={`${bgColorClass} rounded-lg shadow-lg p-8 w-96 h-100`}>
          <div className="text-primary flex flex-col justify-center items-center h-full gap-6 max-w-60">
            <h2 className="text-3xl font-bold">Inscription</h2>
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
                <Label>Nom</Label>
                <Input
                  placeholder="Nom"
                  value={nameField}
                  onChange={(e) => setNameField(e.target.value)}
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
              </div>
              <div className="w-full">
                <Input
                  type="password"
                  placeholder="Confirmer mot de passe"
                  value={repasswordField}
                  onChange={(e) => setRepasswordField(e.target.value)}
                />
                <a className="float-right" href="#">
                  mot de passe oublié?
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
                  S'inscrire
                </Button>
                <span>
                  Vous avez déjà un compte?{" "}
                  <Link className="ml-2" to="/authentification">
                    Se connecter
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

export default Signup;
