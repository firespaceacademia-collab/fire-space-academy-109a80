import { useMemo, useState } from 'react'
import { FolderOpen, Search } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { INTELIGENCIAS, RANGOS, claveNombre, formatoPuntos, type Estudiante } from '@/lib/academia'
import { Retrato } from './expediente'
import { Encabezado, Revelar } from './revelar'

const TODOS = 'todos'

// "Aspirante" y "Aspirantes" se tratan igual al filtrar.
const mismoRango = (a: string, b: string) => claveNombre(a).replace(/s$/, '') === claveNombre(b).replace(/s$/, '')

export function Directorio({ estudiantes, onVer }: { estudiantes: Estudiante[]; onVer: (e: Estudiante) => void }) {
  const [inteligencia, setInteligencia] = useState(TODOS)
  const [rango, setRango] = useState(TODOS)
  const [busqueda, setBusqueda] = useState('')

  const filtrados = useMemo(
    () =>
      estudiantes.filter(
        (e) =>
          (inteligencia === TODOS || claveNombre(e.inteligencia) === claveNombre(inteligencia)) &&
          (rango === TODOS || mismoRango(e.rango, rango)) &&
          (!busqueda || claveNombre(e.nombre).includes(claveNombre(busqueda))),
      ),
    [estudiantes, inteligencia, rango, busqueda],
  )

  return (
    <section id="directorio" className="relative px-4 py-24 sm:px-6" aria-labelledby="directorio-titulo">
      <div className="mx-auto max-w-content">
        <Encabezado id="directorio-titulo" eyebrow="Archivo Central" titulo="Directorio de Estudiantes">
          <p>Registro oficial de los estudiantes inscritos en Fire Space Academy.</p>
        </Encabezado>

        <Revelar className="mb-8 flex items-center justify-center gap-3 border border-gold/25 bg-gold/5 px-4 py-3 text-center text-sm">
          <span className="relative flex size-2">
            <span className="absolute inline-flex size-full animate-ping rounded-full bg-gold/70 motion-reduce:animate-none" />
            <span className="relative inline-flex size-2 rounded-full bg-gold" />
          </span>
          <span className="font-display tracking-[0.2em] text-gold uppercase">Expedientes en actualización</span>
          <span className="hidden text-muted-foreground sm:inline">· La lista completa de la comunidad estudiantil se añadirá próximamente.</span>
        </Revelar>

        <div className="fs-panel mb-8 grid gap-3 p-4 sm:grid-cols-3">
          <label className="relative">
            <span className="sr-only">Buscar por nombre</span>
            <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input value={busqueda} onChange={(e) => setBusqueda(e.target.value)} placeholder="Buscar por nombre…" className="h-10 bg-jet pl-9" />
          </label>
          <Select value={inteligencia} onValueChange={setInteligencia}>
            <SelectTrigger className="h-10 w-full bg-jet" aria-label="Filtrar por inteligencia">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={TODOS}>Todas las inteligencias</SelectItem>
              {INTELIGENCIAS.map((i) => (
                <SelectItem key={i} value={i}>{i}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={rango} onValueChange={setRango}>
            <SelectTrigger className="h-10 w-full bg-jet" aria-label="Filtrar por rango">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={TODOS}>Todos los rangos</SelectItem>
              {RANGOS.map((r) => (
                <SelectItem key={r} value={r}>{r}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <p className="mb-4 font-display text-[0.65rem] tracking-[0.3em] text-muted-foreground uppercase">
          {filtrados.length} {filtrados.length === 1 ? 'expediente' : 'expedientes'}
        </p>

        {filtrados.length === 0 ? (
          <div className="flex flex-col items-center border border-dashed border-border px-6 py-16 text-center">
            <FolderOpen className="size-10 text-gold/40" />
            <p className="mt-4 font-display tracking-[0.15em] uppercase">Sin expedientes</p>
            <p className="mt-2 text-muted-foreground">
              Ningún estudiante coincide con estos filtros. Sus nombres desaparecen lentamente de los archivos públicos…
            </p>
          </div>
        ) : (
          <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {filtrados.map((e, i) => (
              <li key={e.id}>
                <Revelar retraso={(i % 3) * 90} className="h-full">
                  <article className="fs-panel group flex h-full flex-col overflow-hidden transition-colors duration-500 hover:border-gold/40">
                    <div className="relative overflow-hidden">
                      <Retrato src={e.imagen} nombre={e.nombre} ancho={640} className="aspect-[4/3] w-full transition-transform duration-700 group-hover:scale-105" />
                      <span className="absolute top-3 left-3 border border-gold/50 bg-jet/80 px-2 py-1 font-display text-[0.6rem] tracking-[0.25em] text-gold uppercase backdrop-blur">
                        {e.rango}
                      </span>
                      <span className="absolute top-3 right-3 bg-blood/90 px-2 py-1 font-display text-[0.65rem] tracking-[0.1em] text-foreground">
                        {formatoPuntos(e.puntos)}
                      </span>
                    </div>
                    <div className="flex flex-1 flex-col p-5">
                      <p className="font-display text-[0.6rem] tracking-[0.3em] text-muted-foreground uppercase">
                        Inteligencia {e.inteligencia}
                      </p>
                      <h3 className="mt-2 font-display text-2xl tracking-[0.1em] uppercase">{e.nombre}</h3>
                      <p className="mt-3 line-clamp-3 flex-1 leading-relaxed text-muted-foreground">{e.descripcion}</p>
                      <Button
                        onClick={() => onVer(e)}
                        variant="outline"
                        className="mt-5 border-gold/40 font-display text-[0.7rem] tracking-[0.18em] text-gold uppercase hover:bg-gold/10 hover:text-gold"
                      >
                        Ver Expediente / Lore Completo
                      </Button>
                    </div>
                  </article>
                </Revelar>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  )
}
