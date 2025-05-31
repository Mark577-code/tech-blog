"use client"

import Link from "next/link"
import { useTheme } from "@/contexts/theme-context"
import { useLanguage } from "@/contexts/language-context"
import { Moon, Sun, Languages } from "lucide-react"
import SearchBar from "./SearchBar"

const Navbar = () => {
  const { theme, toggleTheme } = useTheme()
  const { t, toggleLanguage } = useLanguage()

  return (
    <nav className="fixed top-0 left-0 right-0 z-20">
      <div className="container mx-auto flex justify-between items-center p-4 gradient-window">
        <Link href="/" className="text-2xl font-bold ml-12 md:ml-0">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">Tech Blog</span>
        </Link>

        <ul className="hidden md:flex space-x-6">
          <li>
            <Link href="/" className="hover:text-primary transition-colors">
              {t("nav.home")}
            </Link>
          </li>
          <li>
            <Link href="/articles" className="hover:text-primary transition-colors">
              {t("nav.articles")}
            </Link>
          </li>
          <li>
            <Link href="/portfolio" className="hover:text-primary transition-colors">
              {t("nav.portfolio")}
            </Link>
          </li>
        </ul>

        <div className="flex items-center gap-4">
          <div className="hidden md:block">
            <SearchBar />
          </div>

          <button
            onClick={toggleTheme}
            className="p-2 hover:bg-background/50 rounded-full"
            aria-label={t("theme.toggle")}
          >
            {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </button>

          <button
            onClick={toggleLanguage}
            className="p-2 hover:bg-background/50 rounded-full"
            aria-label={t("language.toggle")}
          >
            <Languages className="h-5 w-5" />
          </button>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
