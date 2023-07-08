
import AuthFirebase from "@/firebase/auth"
class AuthService {
  async signup(email: string, password: string) {
    try {
      await AuthFirebase.createUserWithEmailAndPassword(email,password);
    } catch (error) {
      console.log('Erreur d\'inscription:', error);
      throw error;
    }
  }

  async login(email: string, password: string) {
    try {
      await AuthFirebase.signInWithEmailAndPassword(email, password);
    } catch (error) {
      console.log('Erreur de connexion:', error);
      throw error;
    }
  }

  async logout() {
    try {
      await AuthFirebase.signOut();
    } catch (error) {
      console.log('Erreur de déconnexion:', error);
      throw error;
    }
  }

}

export default new AuthService();