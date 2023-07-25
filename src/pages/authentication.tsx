import ThemeProvider from "../../feature/theme/context";
import Login from "../../form/login";
import { Toaster } from "../../ui/toaster";

export default function Authentication(){
    return(
        <ThemeProvider>
        <Login/>
        <Toaster />
    </ThemeProvider>
    )
}