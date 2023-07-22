
import AuthFirebase from "@/firebase/auth"
import { RegisterDto } from "@/dto/register.dto";
import { LoginDto } from "@/dto/login.dto";
class AuthService {
  async signup(dto: RegisterDto) {
    try {
      return await AuthFirebase.createUserWithEmailAndPassword(dto.email,dto.password);
    } catch (error) {
      console.log('Erreur d\'inscription:', error);
      throw error;
    }
  }

  async login(dto: LoginDto) {
    try {
      return await AuthFirebase.signInWithEmailAndPassword(dto.email, dto.password);
    } catch (error) {
      console.log('Erreur de connexion:', error);
      throw error;
    }
  }

  async logout() {
    try {
      return await AuthFirebase.signOut();
    } catch (error) {
      console.log('Erreur de déconnexion:', error);
      throw error;
    }
  }

}

export default new AuthService();