import { ReactNode } from "react"
import ThemeProvider from "../feature/theme/context"

interface LayoutProps {
	children: ReactNode;
}
export default function(props: LayoutProps) {
	return <ThemeProvider>
		{props.children}
	</ThemeProvider>

}
