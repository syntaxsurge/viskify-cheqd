'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

import { ChevronDown, LayoutDashboard, LogOut, Settings } from 'lucide-react'

import { signOut } from '@/app/(auth)/actions'
import { ModeToggle } from '@/components/theme-toggle'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card'
import { useUser } from '@/lib/auth'
import { cn } from '@/lib/utils'

import { Button } from './ui/button'
import UserAvatar from './ui/user-avatar'

/* -------------------------------------------------------------------------- */
/*                               NAVIGATION DATA                              */
/* -------------------------------------------------------------------------- */

const LEARN_SECTIONS = [
  { id: 'overview', label: 'Overview' },
  { id: 'demo', label: 'See Viskify in Action' },
  { id: 'features', label: 'Features' },
  { id: 'deep-dive', label: 'What You Get' },
  { id: 'workflow', label: 'Workflow' },
  { id: 'pricing', label: 'Pricing' },
] as const

const TOOLS_MENU = [
  { href: '/jobs', label: 'Job Openings' },
  { href: '/candidates', label: 'Candidates' },
  { href: '/issuers', label: 'Issuers' },
  { href: '/verify', label: 'Verify' },
] as const

/* -------------------------------------------------------------------------- */
/*                                  HEADER                                    */
/* -------------------------------------------------------------------------- */

export default function SiteHeader() {
  const router = useRouter()
  const { userPromise } = useUser()
  const [user, setCurrentUser] = useState<Awaited<typeof userPromise> | null>(null)

  /* Mobile state */
  const [mobileOpen, setMobileOpen] = useState(false)
  const [learnMobileOpen, setLearnMobileOpen] = useState(false)
  const [toolsMobileOpen, setToolsMobileOpen] = useState(false)

  /* Reset sub-menus whenever the hamburger closes */
  useEffect(() => {
    if (!mobileOpen) {
      setLearnMobileOpen(false)
      setToolsMobileOpen(false)
    }
  }, [mobileOpen])

  /* Resolve the user promise exactly once per render cycle */
  useEffect(() => {
    let mounted = true
    const maybe = userPromise as unknown
    if (maybe && typeof maybe === 'object' && typeof (maybe as any).then === 'function') {
      ;(maybe as Promise<any>).then(
        (u) => mounted && setCurrentUser(u),
        () => mounted && setCurrentUser(null),
      )
    } else {
      setCurrentUser(maybe as Awaited<typeof userPromise>)
    }
    return () => {
      mounted = false
    }
  }, [userPromise])

  /* Close hamburger after navigation */
  function handleNav() {
    setMobileOpen(false)
  }

  async function handleSignOut() {
    await signOut()
    router.refresh()
    router.push('/')
  }

  return (
    <>
      <header className='border-border/60 bg-background/80 supports-[backdrop-filter]:bg-background/60 sticky top-0 z-40 w-full border-b shadow-sm backdrop-blur'>
        <div className='mx-auto grid h-16 max-w-7xl grid-cols-[auto_1fr_auto] items-center gap-6 px-4 md:px-6'>
          {/* Brand ------------------------------------------------------------------ */}
          <Link
            href='/'
            className='text-foreground flex items-center gap-2 text-lg font-extrabold tracking-tight whitespace-nowrap'
            onClick={handleNav}
          >
            <Image
              src='/images/viskify-logo.png'
              alt='Viskify logo'
              width={40}
              height={40}
              priority
              className='h-10 w-auto md:h-8'
            />
            <span className='hidden md:inline'>Viskify</span>
          </Link>

          {/* Desktop nav ------------------------------------------------------------ */}
          <nav className='hidden justify-center gap-6 md:flex'>
            <Link
              href='/'
              className='text-foreground/80 hover:text-foreground text-sm font-medium transition-colors'
            >
              Home
            </Link>

            {/* Learn dropdown */}
            <HoverCard openDelay={100} closeDelay={100}>
              <HoverCardTrigger asChild>
                <span className='text-foreground/80 hover:text-foreground flex cursor-pointer items-center gap-1 text-sm font-medium transition-colors'>
                  Learn
                  <ChevronDown className='mt-0.5 h-3 w-3' />
                </span>
              </HoverCardTrigger>
              <HoverCardContent side='bottom' align='start' className='w-40 rounded-lg p-2'>
                <ul className='space-y-1'>
                  {LEARN_SECTIONS.map((s) => (
                    <li key={s.id}>
                      <Link
                        href={`/#${s.id}`}
                        className='hover:bg-muted block rounded px-2 py-1 text-sm'
                      >
                        {s.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </HoverCardContent>
            </HoverCard>

            {/* Tools dropdown */}
            <HoverCard openDelay={100} closeDelay={100}>
              <HoverCardTrigger asChild>
                <span className='text-foreground/80 hover:text-foreground flex cursor-pointer items-center gap-1 text-sm font-medium transition-colors'>
                  Tools
                  <ChevronDown className='mt-0.5 h-3 w-3' />
                </span>
              </HoverCardTrigger>
              <HoverCardContent side='bottom' align='start' className='w-40 rounded-lg p-2'>
                <ul className='space-y-1'>
                  {TOOLS_MENU.map((t) => (
                    <li key={t.href}>
                      <Link
                        href={t.href}
                        className='hover:bg-muted block rounded px-2 py-1 text-sm'
                      >
                        {t.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </HoverCardContent>
            </HoverCard>

            <Link
              href='/pricing'
              className='text-foreground/80 hover:text-foreground text-sm font-medium transition-colors'
            >
              Pricing
            </Link>

            <Link
              href='/dashboard'
              className='text-foreground/80 hover:text-foreground text-sm font-medium transition-colors'
            >
              Dashboard
            </Link>
          </nav>

          {/* Right-aligned controls */}
          <div className='flex items-center justify-end gap-3'>
            <ModeToggle />

            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <UserAvatar
                    src={(user as any)?.image ?? undefined}
                    name={(user as any)?.name ?? null}
                    email={(user as any)?.email ?? null}
                    className='cursor-pointer'
                  />
                </DropdownMenuTrigger>

                <DropdownMenuContent
                  align='end'
                  className='data-[state=open]:animate-in data-[state=closed]:animate-out w-56 max-w-[90vw] rounded-lg p-1 shadow-lg sm:w-64'
                >
                  {/* User card */}
                  <DropdownMenuItem
                    asChild
                    className='data-[highlighted]:bg-muted data-[highlighted]:text-foreground flex flex-col items-start gap-1 rounded-md px-3 py-2 text-left select-none'
                  >
                    <Link href='/settings/team' className='w-full'>
                      <p className='truncate text-sm font-medium'>
                        {user.name || user.email || 'Unnamed User'}
                      </p>
                      {user.email && (
                        <p className='text-muted-foreground truncate text-xs break-all'>
                          {user.email}
                        </p>
                      )}
                      <span className='bg-muted text-muted-foreground inline-block rounded px-2 py-0.5 text-[10px] font-semibold tracking-wider uppercase'>
                        {user.role}
                      </span>
                    </Link>
                  </DropdownMenuItem>

                  <DropdownMenuSeparator />

                  <DropdownMenuItem
                    asChild
                    className='data-[highlighted]:bg-muted data-[highlighted]:text-foreground flex items-center gap-2 rounded-md px-3 py-2'
                  >
                    <Link href='/dashboard' className='flex items-center gap-2'>
                      <LayoutDashboard className='h-4 w-4' />
                      <span className='text-sm'>Dashboard</span>
                    </Link>
                  </DropdownMenuItem>

                  <DropdownMenuItem
                    asChild
                    className='data-[highlighted]:bg-muted data-[highlighted]:text-foreground flex items-center gap-2 rounded-md px-3 py-2'
                  >
                    <Link href='/settings/general' className='flex items-center gap-2'>
                      <Settings className='h-4 w-4' />
                      <span className='text-sm'>Settings</span>
                    </Link>
                  </DropdownMenuItem>

                  <DropdownMenuSeparator />

                  <form action={handleSignOut} className='w-full'>
                    <button type='submit' className='w-full'>
                      <DropdownMenuItem className='data-[highlighted]:bg-muted data-[highlighted]:text-foreground flex items-center gap-2 rounded-md px-3 py-2'>
                        <LogOut className='h-4 w-4' />
                        <span className='text-sm'>Sign out</span>
                      </DropdownMenuItem>
                    </button>
                  </form>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Link href='/sign-in' className='shrink-0'>
                  <Button variant='ghost' size='sm'>
                    Sign in
                  </Button>
                </Link>
                <Link href='/sign-up' className='shrink-0'>
                  <Button size='sm'>Get started</Button>
                </Link>
              </>
            )}
          </div>
        </div>

        {/* Mobile slide-down menu --------------------------------------------------- */}
        {mobileOpen && (
          <div className='bg-background/95 absolute inset-x-0 top-16 z-40 shadow-lg backdrop-blur md:hidden'>
            <nav className='flex flex-col gap-4 px-4 py-6'>
              {/* Home */}
              <Link href='/' onClick={handleNav} className='text-sm font-medium'>
                Home
              </Link>

              {/* Learn (collapsible) */}
              <div>
                <button
                  type='button'
                  onClick={() => setLearnMobileOpen((o) => !o)}
                  className='flex items-center gap-1 text-sm font-medium'
                >
                  Learn
                  <ChevronDown
                    className={cn('h-3 w-3 transition-transform', learnMobileOpen && 'rotate-180')}
                  />
                </button>
                {learnMobileOpen && (
                  <ul className='mt-2 flex flex-col gap-2 pl-4'>
                    {LEARN_SECTIONS.map((s) => (
                      <li key={s.id}>
                        <Link href={`/#${s.id}`} onClick={handleNav} className='text-sm'>
                          {s.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {/* Tools (collapsible) */}
              <div>
                <button
                  type='button'
                  onClick={() => setToolsMobileOpen((o) => !o)}
                  className='flex items-center gap-1 text-sm font-medium'
                >
                  Tools
                  <ChevronDown
                    className={cn('h-3 w-3 transition-transform', toolsMobileOpen && 'rotate-180')}
                  />
                </button>
                {toolsMobileOpen && (
                  <ul className='mt-2 flex flex-col gap-2 pl-4'>
                    {TOOLS_MENU.map((t) => (
                      <li key={t.href}>
                        <Link href={t.href} onClick={handleNav} className='text-sm'>
                          {t.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {/* Static links */}
              <Link href='/pricing' onClick={handleNav} className='text-sm font-medium'>
                Pricing
              </Link>
              <Link href='/dashboard' onClick={handleNav} className='text-sm font-medium'>
                Dashboard
              </Link>

              {/* Theme toggle at bottom */}
              <ModeToggle />
            </nav>
          </div>
        )}
      </header>
    </>
  )
}
