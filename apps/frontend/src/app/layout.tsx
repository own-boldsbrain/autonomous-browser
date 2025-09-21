import "./globals.css";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { ThemeProvider } from "@/providers/theme";
import { AppSidebar } from "@/components/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

export const metadata = {
  title: "Yello Solar Hub",
  description: "One Stop Solar Shop - Marketplace completo de equipamentos solares",
};

export default function RootLayout(props: { children: React.ReactNode }) {
  const { children } = props;
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <head></head>
      <body 
        className={`${GeistSans.variable} ${GeistMono.variable} font-sans antialiased bg-[var(--geist-bg)] text-[var(--geist-fg)]`}
        suppressHydrationWarning={true}
      >
        <ThemeProvider
          attribute="data-theme"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <SidebarProvider defaultOpen={true}>
            <AppSidebar />
            <SidebarInset>{children}</SidebarInset>
          </SidebarProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
