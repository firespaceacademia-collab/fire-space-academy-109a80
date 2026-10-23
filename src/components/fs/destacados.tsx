import { useRef } from 'react'
import { ChevronLeft, ChevronRight, Quote } from 'lucide-react'

import { Button } from '@/components/ui/button'
import type { Estudiante, Figura } from '@/lib/academia'
import { Retrato } from './expediente'
import { Encabezado, Revelar } from './revelar'

export function Destacados({
  figuras,
  estudiantes,
  onVer,
}: {
  figuras: Figura[]
  estudiantes: Estudiante[]
  onVer: (e: Estudiante) => void
}) {
  const pista = useRef<HTMLDivElement>(null)
  const destacados = estudiantes.filter((e) => e.destacado)
  const mover = (dir: number) => pista.current?.scrollBy({ left: dir * 320, behavior: 'smooth' })

  return (
    <section className="relative px-4 py-24 sm:px-6" aria-labelledby="destacados-titulo">
      <div className="mx-auto max-w-content">
        <Encabezado id="destacados-titulo" eyebrow="Muro de Honor" titulo="Figuras de Fire Space">
          <p>Los nombres que todos conocen. Los rostros que todos observan… y los ojos que observan a todos.</p>
        </Encabezado>

        <div className="mb-4 flex justify-end gap-2">
          <Button variant="outline" size="icon" onClick={() => mover(-1)} aria-label="Anterior" className="border-gold/30 text-gold">
            <ChevronLeft />
          </Button>
          <Button variant="outline" size="icon" onClick={() => mover(1)} aria-label="Siguiente" className="border-gold/30 text-gold">
            <ChevronRight />
          </Button>
        </div>

        <Revelar>
          <div ref={pista} className="flex snap-x snap-mandatory gap-5 overflow-x-auto pb-6 [scrollbar-width:thin]">
            {figuras.map((f) => (
              <article key={f.nombre} className="fs-panel fs-frame group w-[19rem] shrink-0 snap-start overflow-hidden sm:w-[22rem]">
                <div className="relative overflow-hidden">
                  <Retrato src={f.imagen} nombre={f.nombre} ancho={700} className="aspect-[4/3] w-full transition-transform duration-700 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent" />
                </div>
                <div className="p-6">
                  <p className="fs-eyebrow">{f.titulo}</p>
                  <h3 className="mt-2 font-display text-2xl tracking-[0.1em] uppercase">{f.nombre}</h3>
                  <p className="mt-4 flex gap-2 text-gold/90 italic">
                    <Quote className="size-4 shrink-0 rotate-180" /> {f.cita}
                  </p>
                  <p className="mt-3 leading-relaxed text-muted-foreground">{f.descripcion}</p>
                </div>
              </article>
            ))}

            {destacados.map((e) => (
              <article key={e.id} className="fs-panel fs-frame group w-[19rem] shrink-0 snap-start overflow-hidden sm:w-[22rem]">
                <Retrato src={e.imagen} nombre={e.nombre} ancho={700} className="aspect-[4/3] w-full" />
                <div className="p-6">
                  <p className="fs-eyebrow">{e.rango} · {e.inteligencia}</p>
                  <h3 className="mt-2 font-display text-2xl tracking-[0.1em] uppercase">{e.nombre}</h3>
                  <p className="mt-3 line-clamp-3 leading-relaxed text-muted-foreground">{e.descripcion}</p>
                  <Button variant="link" className="mt-2 px-0 text-gold" onClick={() => onVer(e)}>
                    Ver expediente →
                  </Button>
                </div>
              </article>
            ))}

            {Array.from({ length: Math.max(0, 3 - destacados.length) }).map((_, i) => (
              <div
                key={`vacante-${i}`}
                className="flex w-[19rem] shrink-0 snap-start flex-col items-center justify-center border border-dashed border-gold/20 bg-jet/40 p-8 text-center sm:w-[22rem]"
              >
                <span className="font-display text-5xl text-gold/20">?</span>
                <p className="mt-4 font-display text-xs tracking-[0.3em] text-muted-foreground uppercase">Lugar reservado</p>
                <p className="mt-2 text-sm text-muted-foreground/80 italic">
                  Cuanto más alto llega un estudiante, más personas quieren verlo caer.
                </p>
              </div>
            ))}
          </div>
        </Revelar>
      </div>
    </section>
  )
}
