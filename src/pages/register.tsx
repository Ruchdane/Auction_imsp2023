import ThemeProvider from "../../feature/theme/context";
import Signup from "../../form/signup";
import { Toaster } from "../../ui/toaster";

export default function Register(){
    return(
        <ThemeProvider>
        <Signup/>
        <Toaster />
    </ThemeProvider>
    )
}