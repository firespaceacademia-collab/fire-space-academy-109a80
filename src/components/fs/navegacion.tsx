import { useEffect, useState } from 'react'
import { Menu } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { cn } from '@/lib/utils'
import { Emblema } from './emblema'

const ENLACES = [
  { href: '#inicio', label: 'Inicio' },
  { href: '#historia', label: 'Historia & Lore' },
  { href: '#jerarquia', label: 'Jerarquía' },
  { href: '#directorio', label: 'Directorio de Estudiantes' },
  { href: '#intruders', label: 'The Intruders' },
  { href: '#admisiones', label: 'Admisiones' },
]

export function Navegacion() {
  const [compacta, setCompacta] = useState(false)

  useEffect(() => {
    const onScroll = () => setCompacta(window.scrollY > 40)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={cn(
        'fixed inset-x-0 top-0 z-40 transition-all duration-500 motion-reduce:transition-none',
        compacta
          ? 'border-b border-gold/15 bg-jet/90 py-2 backdrop-blur-md'
          : 'bg-gradient-to-b from-jet/90 to-transparent py-4',
      )}
    >
      <nav className="mx-auto flex max-w-content items-center justify-between gap-4 px-4 sm:px-6" aria-label="Principal">
        <a href="#inicio" className="group flex items-center gap-3">
          <Emblema className="h-10 w-9 transition-transform duration-500 group-hover:scale-105" />
          <span className="leading-none">
            <span className="block font-display text-sm font-bold tracking-[0.3em] text-foreground">FIRE SPACE</span>
            <span className="mt-1 block font-display text-[0.6rem] tracking-[0.5em] text-gold/80">ACADEMY</span>
          </span>
        </a>

        <ul className="hidden items-center gap-1 lg:flex">
          {ENLACES.map((e) => (
            <li key={e.href}>
              <a
                href={e.href}
                className="relative px-3 py-2 font-display text-[0.7rem] tracking-[0.18em] text-foreground/75 uppercase transition-colors hover:text-gold after:absolute after:inset-x-3 after:bottom-1 after:h-px after:origin-left after:scale-x-0 after:bg-gold after:transition-transform hover:after:scale-x-100"
              >
                {e.label}
              </a>
            </li>
          ))}
        </ul>

        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="text-gold lg:hidden" aria-label="Abrir menú">
              <Menu className="size-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-72 border-gold/20 bg-jet">
            <SheetTitle className="flex items-center gap-3 px-6 pt-6 font-display tracking-[0.25em] text-gold">
              <Emblema className="h-9 w-8" /> FIRE SPACE
            </SheetTitle>
            <SheetDescription className="sr-only">Navegación de la academia</SheetDescription>
            <ul className="mt-6 flex flex-col px-4">
              {ENLACES.map((e) => (
                <li key={e.href}>
                  <SheetClose asChild>
                    <a
                      href={e.href}
                      className="block border-b border-border/60 px-2 py-4 font-display text-sm tracking-[0.15em] text-foreground/85 uppercase hover:text-gold"
                    >
                      {e.label}
                    </a>
                  </SheetClose>
                </li>
              ))}
            </ul>
          </SheetContent>
        </Sheet>
      </nav>
    </header>
  )
}
