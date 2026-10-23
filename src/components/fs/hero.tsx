import { ChevronDown } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Emblema } from './emblema'

// Posiciones fijas para que el render del servidor y del navegador coincidan.
const BRASAS = Array.from({ length: 22 }, (_, i) => ({
  left: `${(i * 37) % 100}%`,
  delay: `${(i * 1.3) % 9}s`,
  duration: `${9 + ((i * 7) % 8)}s`,
  drift: `${((i * 23) % 60) - 30}px`,
}))

export function Hero() {
  return (
    <section id="inicio" className="relative flex min-h-[100svh] items-center justify-center overflow-hidden">
      <div className="absolute inset-0" aria-hidden="true">
        <img
          src="/.netlify/images?url=/img/corredor.png&w=1920&fm=webp&q=70"
          srcSet="/.netlify/images?url=/img/corredor.png&w=800&fm=webp&q=70 800w, /.netlify/images?url=/img/corredor.png&w=1400&fm=webp&q=70 1400w, /.netlify/images?url=/img/corredor.png&w=1920&fm=webp&q=70 1920w"
          sizes="100vw"
          alt=""
          className="fs-slow-zoom h-full w-full object-cover opacity-60"
          fetchPriority="high"
        />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_10%,#0d0d0d_75%)]" />
        <div className="absolute inset-0 bg-gradient-to-b from-jet/70 via-blood/10 to-jet" />
        {BRASAS.map((b, i) => (
          <span
            key={i}
            className="fs-ember"
            style={
              {
                left: b.left,
                animationDelay: b.delay,
                animationDuration: b.duration,
                '--drift': b.drift,
              } as React.CSSProperties
            }
          />
        ))}
      </div>

      <div className="relative z-10 mx-auto max-w-4xl px-4 pt-24 pb-16 text-center sm:px-6">
        <Emblema className="mx-auto mb-8 h-24 w-20 drop-shadow-[0_0_30px_rgba(139,0,0,0.8)] sm:h-28 sm:w-24" />
        <p className="fs-eyebrow mb-6">Academia Privada · Institución de Excelencia</p>
        <h1 className="font-display text-5xl leading-[0.95] font-bold tracking-[0.12em] sm:text-7xl md:text-8xl">
          <span className="fs-gold-text block">FIRE SPACE</span>
          <span className="mt-2 block text-2xl tracking-[0.6em] text-foreground/90 sm:text-3xl md:text-4xl">
            ACADEMY
          </span>
        </h1>
        <div className="fs-divider mx-auto my-8 max-w-md" aria-hidden="true">
          <span className="text-sm">✦</span>
        </div>
        <p className="mx-auto max-w-2xl text-xl text-foreground/85 italic sm:text-2xl">
          Donde la excelencia exige el máximo sacrificio.
        </p>
        <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Button asChild size="lg" className="min-w-56 border border-gold/40 font-display tracking-[0.2em] uppercase shadow-[0_0_30px_-5px_rgba(139,0,0,0.9)]">
            <a href="#admisiones">Solicitar Admisión</a>
          </Button>
          <Button
            asChild
            size="lg"
            variant="outline"
            className="min-w-56 border-gold/30 bg-jet/40 font-display tracking-[0.2em] text-gold uppercase hover:bg-gold/10 hover:text-gold"
          >
            <a href="#mensaje">Mensaje del Director</a>
          </Button>
        </div>
        <p className="mt-12 font-display text-[0.65rem] tracking-[0.5em] text-muted-foreground uppercase">
          Fire Space te está esperando
        </p>
      </div>

      <a
        href="#mensaje"
        aria-label="Bajar al mensaje del director"
        className="absolute bottom-6 left-1/2 z-10 -translate-x-1/2 animate-bounce text-gold/70 motion-reduce:animate-none"
      >
        <ChevronDown className="size-6" />
      </a>
    </section>
  )
}
