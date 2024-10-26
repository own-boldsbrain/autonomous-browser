import { ThemeToggle } from "@/components/theme-toggle";
import "./globals.css";
import { ThemeProvider } from "@/providers/theme";

export const metadata = {
  title: "Autonomous Todo",
  description: "Personal AI assistant",
};

export default function RootLayout(props: { children: React.ReactNode }) {
  const { children } = props;
  return (
    <html lang="en">
      <head></head>
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
