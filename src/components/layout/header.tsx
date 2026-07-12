'use client'

import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetHeader, SheetClose } from '@/components/ui/sheet'
import { ThemeToggle } from './theme-toggle'
import { Menu, User, LogOut, Settings, BookOpen, Bookmark } from 'lucide-react'

export function Header() {
  const { data: session } = useSession()

  const navigation = [
    { name: 'Home', href: '/' },
    { name: 'Subjects', href: '/subjects' },
    { name: 'Proofs', href: '/proofs' },
    { name: 'Leaderboard', href: '/leaderboard' },
    { name: 'Submit', href: '/submit' },
  ]

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/70 backdrop-blur-xl supports-[backdrop-filter]:bg-background/50">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8" aria-label="Main navigation">
        <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-2 font-display text-xl font-bold tracking-wide text-foreground" aria-label="Medora Home">
            <BookOpen className="h-5 w-5" />
            <span className="hidden sm:block">Medora</span>
          </Link>

          <div className="hidden md:flex md:gap-5">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-sm font-medium text-muted-foreground/80 transition-colors hover:text-foreground"
              >
                {item.name}
              </Link>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden sm:flex sm:items-center sm:gap-2">
            <ThemeToggle />
          </div>

          {session ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                  <Avatar className="h-9 w-9">
                    <AvatarImage src={session.user?.image || undefined} alt={session.user?.name || 'User'} />
                    <AvatarFallback>{session.user?.name?.[0] || 'U'}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <div className="px-2 py-3 border-b">
                  <p className="text-sm font-medium">{session.user?.name}</p>
                  <p className="text-xs text-muted-foreground truncate">{session.user?.email}</p>
                </div>
                <DropdownMenuItem asChild>
                  <Link href="/dashboard" className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Dashboard
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/dashboard/submissions" className="flex items-center gap-2">
                    <BookOpen className="h-4 w-4" />
                    My Submissions
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/dashboard/saved" className="flex items-center gap-2">
                    <Bookmark className="h-4 w-4" />
                    Saved
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/dashboard/settings" className="flex items-center gap-2">
                    <Settings className="h-4 w-4" />
                    Settings
                  </Link>
                </DropdownMenuItem>
                {session.user.role === 'ADMIN' || session.user.role === 'MODERATOR' ? (
                  <DropdownMenuItem asChild>
                    <Link href="/admin" className="flex items-center gap-2">
                      <Settings className="h-4 w-4" />
                      Admin Panel
                    </Link>
                  </DropdownMenuItem>
                ) : null}
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <button onClick={() => signOut()} className="flex w-full items-center gap-2">
                    <LogOut className="h-4 w-4" />
                    Sign out
                  </button>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="hidden sm:flex sm:items-center sm:gap-2">
              <Link href="/auth/signin">
                <Button variant="ghost" size="sm">Sign in</Button>
              </Link>
              <Link href="/auth/register">
                <Button size="sm">Get Started</Button>
              </Link>
            </div>
          )}

          <Sheet>
            <SheetTrigger className="md:hidden inline-flex items-center justify-center rounded-md p-2 text-sm font-medium ring-offset-background transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
              <Menu className="h-6 w-6" />
            </SheetTrigger>
            <SheetContent side="right" className="w-72">
              <SheetHeader>
                <SheetTitle>Menu</SheetTitle>
              </SheetHeader>
              <nav className="flex flex-col gap-2">
                {navigation.map((item) => (
                  <SheetClose asChild key={item.name}>
                    <Link
                      href={item.href}
                      className="px-3 py-2 text-left text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent rounded-md"
                    >
                      {item.name}
                    </Link>
                  </SheetClose>
                ))}
                <div className="border-t my-2" />
                {session ? (
                  <>
                    <SheetClose asChild>
                      <Link
                        href="/dashboard"
                        className="px-3 py-2 text-left text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent rounded-md"
                      >
                        Dashboard
                      </Link>
                    </SheetClose>
                    <SheetClose asChild>
                      <Link
                        href="/dashboard/submissions"
                        className="px-3 py-2 text-left text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent rounded-md"
                      >
                        My Submissions
                      </Link>
                    </SheetClose>
                    <SheetClose asChild>
                      <Link
                        href="/dashboard/saved"
                        className="px-3 py-2 text-left text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent rounded-md"
                      >
                        Saved
                      </Link>
                    </SheetClose>
                    {(session.user.role === 'ADMIN' || session.user.role === 'MODERATOR') && (
                      <SheetClose asChild>
                        <Link
                          href="/admin"
                          className="px-3 py-2 text-left text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent rounded-md"
                        >
                          Admin Panel
                        </Link>
                      </SheetClose>
                    )}
                    <button
                      onClick={() => signOut()}
                      className="px-3 py-2 text-left text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent rounded-md"
                    >
                      Sign out
                    </button>
                  </>
                ) : (
                  <div className="flex flex-col gap-2 px-3 pt-2">
                    <SheetClose asChild>
                      <Link href="/auth/signin">
                        <Button variant="outline" className="w-full">Sign in</Button>
                      </Link>
                    </SheetClose>
                    <SheetClose asChild>
                      <Link href="/auth/register">
                        <Button className="w-full">Get Started</Button>
                      </Link>
                    </SheetClose>
                  </div>
                )}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </nav>
    </header>
  )
}