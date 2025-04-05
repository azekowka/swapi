"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useAuth } from "../lib/auth-context"
import { Button } from "../components/ui/button"
import { LogOut } from "lucide-react"

export function Navbar() {
  const pathname = usePathname()
  const { isAuthenticated, logout } = useAuth()

  const navItems = [
    { name: "People", path: "/people" },
    { name: "Planets", path: "/planets" },
    { name: "Starships", path: "/starships" },
  ]

  return (
    <header className="bg-primary text-primary-foreground shadow">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-1">
            <Link href="/" className="text-xl font-bold">
              Star Wars API
            </Link>
            {isAuthenticated && (
              <div className="hidden md:flex ml-6 space-x-4">
                {navItems.map((item) => (
                  <Link
                    key={item.path}
                    href={item.path}
                    className={`px-3 py-2 rounded-md text-sm font-medium ${
                      pathname === item.path || pathname.startsWith(`${item.path}/`)
                        ? "bg-primary-foreground text-primary"
                        : "hover:bg-primary-foreground/10"
                    }`}
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
            )}
          </div>
          {isAuthenticated && (
            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                size="sm"
                onClick={logout}
                className="text-primary-foreground bg-transparent border-primary-foreground hover:bg-primary-foreground hover:text-primary"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          )}
        </div>
        {isAuthenticated && (
          <div className="md:hidden flex space-x-2 mt-2">
            {navItems.map((item) => (
              <Link
                key={item.path}
                href={item.path}
                className={`px-3 py-2 rounded-md text-sm font-medium flex-1 text-center ${
                  pathname === item.path || pathname.startsWith(`${item.path}/`)
                    ? "bg-primary-foreground text-primary"
                    : "hover:bg-primary-foreground/10"
                }`}
              >
                {item.name}
              </Link>
            ))}
          </div>
        )}
      </div>
    </header>
  )
}

