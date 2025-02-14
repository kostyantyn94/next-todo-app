import { Geist } from "next/font/google";
import "./globals.css";
import HeaderLogo from "@/components/ui/header-logo";
import { Providers } from "./providers";
import {ThemeProvider} from "next-themes";
import {hasEnvVars} from "@/utils/supabase/check-env-vars";
import {EnvVarWarning} from "@/components/env-var-warning";
import AuthButton from "@/components/header-auth";
import {ThemeSwitcher} from "@/components/theme-switcher";
const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: "ToDo App",
  description: "ToDo App designed and made by Kostyantyn Karimov",
};

const geistSans = Geist({
  display: "swap",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
      <html lang="en" className={geistSans.className} suppressHydrationWarning>

      <body className="bg-background text-foreground">
      <Providers>
      <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
      >
        <main className="min-h-screen flex flex-col items-center">
          <div className="flex-1 w-full flex flex-col gap-20 items-center justify-between">
            <nav className="w-full flex justify-center border-b border-b-foreground/10 h-16">
              <div className="w-full max-w-5xl flex justify-between items-center p-3 px-5 text-sm">
                <div className="flex gap-5">
                  <HeaderLogo />
                </div>
                {!hasEnvVars ? <EnvVarWarning /> : <AuthButton />}
              </div>
            </nav>

            <div className="flex flex-col gap-20 max-w-5xl p-5">
              {children}
            </div>

            <footer className="w-full flex items-center justify-center border-t mx-auto text-center text-xs gap-8 py-4">
              <p>
                Made by{" "}
                <a
                    href="https://github.com/kostyantyn94"
                    target="_blank"
                    className="font-bold hover:underline"
                    rel="noreferrer"
                >
                  Kostyantyn Karimov
                </a>
              </p>
              <ThemeSwitcher />
            </footer>
          </div>
        </main>
      </ThemeProvider>
      </Providers>
      </body>
      </html>
  )

}


