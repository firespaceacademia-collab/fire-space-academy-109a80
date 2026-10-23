import { ExternalLink, FileText } from 'lucide-react'

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { ESTADO_ETIQUETA, formatoPuntos, urlImagen, type Estudiante } from '@/lib/academia'
import { Emblema } from './emblema'

export function Retrato({ src, nombre, ancho, className }: { src: string; nombre: string; ancho: number; className?: string }) {
  if (!src) {
    return (
      <div className={`flex items-center justify-center bg-[radial-gradient(circle_at_50%_40%,rgba(139,0,0,0.35),#0d0d0d_70%)] ${className ?? ''}`}>
        <Emblema className="h-1/2 max-h-28 w-auto opacity-80" />
      </div>
    )
  }
  return <img src={urlImagen(src, ancho)} alt={`Retrato de ${nombre}`} loading="lazy" className={`object-cover ${className ?? ''}`} />
}

export function Expediente({ estudiante, onClose }: { estudiante: Estudiante | null; onClose: () => void }) {
  const e = estudiante
  const lore = e ? (e.loreCompleto || e.descripcion).split(/\n\s*\n/) : []

  return (
    <Dialog open={!!e} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-h-[92svh] overflow-y-auto border-gold/30 bg-jet p-0 sm:max-w-3xl">
        {e && (
          <>
            <div className="grid sm:grid-cols-[15rem_1fr]">
              <Retrato src={e.imagen} nombre={e.nombre} ancho={480} className="aspect-[3/4] w-full sm:h-full" />
              <div className="p-6 sm:p-8">
                <DialogHeader>
                  <p className="fs-eyebrow">Expediente estudiantil · Confidencial</p>
                  <DialogTitle className="font-display text-3xl tracking-[0.12em] uppercase">{e.nombre}</DialogTitle>
                  <DialogDescription className="text-muted-foreground italic">{ESTADO_ETIQUETA[e.estado]}</DialogDescription>
                </DialogHeader>

                <div className="mt-6 border border-gold/40 bg-gradient-to-r from-blood/30 to-transparent p-4">
                  <p className="font-display text-[0.6rem] tracking-[0.35em] text-gold uppercase">Puntos acumulados</p>
                  <p className="mt-1 font-display text-4xl font-bold text-foreground">{formatoPuntos(e.puntos)}</p>
                </div>

                <dl className="mt-5 grid grid-cols-3 gap-3 text-center">
                  {[
                    ['Edad', e.edadOn || '—'],
                    ['Inteligencia', e.inteligencia],
                    ['Rango', e.rango],
                  ].map(([k, v]) => (
                    <div key={k} className="border border-border bg-card px-2 py-3">
                      <dt className="font-display text-[0.55rem] tracking-[0.25em] text-muted-foreground uppercase">{k}</dt>
                      <dd className="mt-1 font-display text-sm text-gold">{v}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            </div>

            <div className="border-t border-border px-6 py-8 sm:px-10">
              <h3 className="flex items-center gap-2 font-display text-sm tracking-[0.25em] text-gold uppercase">
                <FileText className="size-4" /> Historia · Lore completo
              </h3>
              <div className="mt-4 space-y-4 text-lg leading-relaxed whitespace-pre-line text-foreground/85">
                {lore.map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>
              {e.documento && (
                <a
                  href={e.documento}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-6 inline-flex items-center gap-2 border border-gold/40 px-4 py-2 font-display text-xs tracking-[0.2em] text-gold uppercase transition-colors hover:bg-gold/10"
                >
                  <ExternalLink className="size-4" /> Abrir ficha / documento
                </a>
              )}
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
