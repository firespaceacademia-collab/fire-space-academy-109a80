import { useState } from 'react'
import { ArrowRight, CheckCircle2, Hourglass, XCircle } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import type { Estado } from '@/lib/academia'
import { consultarOficina } from '@/lib/academia.functions'
import { cn } from '@/lib/utils'
import { CodigoDialog, type PeticionCodigo } from './codigo-dialog'
import { Emblema } from './emblema'
import { Revelar } from './revelar'

type Resultado = { nombre: string; estado: Estado; enlace: string | null }

const AVISOS: Record<Estado, { icono: typeof CheckCircle2; titulo: string; texto: string; tono: string }> = {
  aceptada: {
    icono: CheckCircle2,
    titulo: '¡Felicidades, Aspirante!',
    texto:
      "Tu ficha de ingreso a Fire Space Academy ha sido evaluada y ACEPTADA correctamente. Mantén la cautela, respeta los reglamentos internos y vigila tus espaldas dentro del campus. Presiona el botón de 'Siguiente' para dirigirte a la Recepción Central.",
    tono: 'border-emerald/70 text-[#8fd694] bg-emerald/10',
  },
  rechazada: {
    icono: XCircle,
    titulo: 'Solicitud rechazada',
    texto:
      'Agradecemos tu interés en ingresar a Fire Space Academy. Tras evaluar tu expediente, informamos que tu solicitud ha sido RECHAZADA por el Consejo de Admisiones en esta convocatoria. Agradecemos tu tiempo y te invitamos a postularte nuevamente en futuras aperturas.',
    tono: 'border-blood/70 text-[#f0a3a3] bg-blood/15',
  },
  en_proceso: {
    icono: Hourglass,
    titulo: 'Expediente en revisión',
    texto:
      'Tu ficha de ingreso aún se encuentra EN PROCESO de revisión por la administración. Por favor, sé paciente y vuelve a consultar más tarde. Los expedientes son analizados meticulosamente antes de otorgar el acceso.',
    tono: 'border-gold/60 text-gold bg-gold/10',
  },
}

export function Oficina() {
  const [peticion, setPeticion] = useState<PeticionCodigo | null>(null)
  const [resultado, setResultado] = useState<Resultado | null>(null)

  function abrir() {
    setPeticion({
      titulo: 'Oficina de Admisiones',
      descripcion: 'Introduce el código único de registro que recibiste al enviar tu ficha de admisión.',
      etiqueta: 'Código único de estudiante',
      boton: 'Consultar',
      enviar: async (codigo) => {
        const r = await consultarOficina({ data: { codigo } })
        if (!r.ok) return r.error
        setResultado({ nombre: r.nombre, estado: r.estado, enlace: r.enlace })
        return null
      },
    })
  }

  const aviso = resultado ? AVISOS[resultado.estado] : null

  return (
    <section id="oficina" className="relative px-4 pt-8 pb-24 sm:px-6" aria-labelledby="oficina-titulo">
      <Revelar className="mx-auto flex max-w-2xl flex-col items-center text-center">
        <button
          type="button"
          onClick={abrir}
          className="group relative flex flex-col items-center gap-5 px-10 py-10 focus-visible:ring-2 focus-visible:ring-gold focus-visible:outline-none"
        >
          <span className="absolute inset-0 rounded-full bg-[radial-gradient(circle,rgba(139,0,0,0.45),transparent_65%)] opacity-60 blur-xl transition-opacity duration-700 group-hover:opacity-100" />
          <Emblema className="relative h-28 w-24 transition-transform duration-700 group-hover:scale-110 group-hover:drop-shadow-[0_0_25px_rgba(212,175,55,0.5)]" />
          <span className="relative">
            <span id="oficina-titulo" className="block font-display text-xl tracking-[0.3em] text-foreground uppercase">
              Oficina de Admisiones
            </span>
            <span className="mt-2 block text-sm text-muted-foreground italic">
              Recepción Central · Acceso solo con código de registro
            </span>
          </span>
        </button>
      </Revelar>

      <CodigoDialog peticion={peticion} onClose={() => setPeticion(null)} />

      <Dialog open={!!resultado} onOpenChange={(o) => !o && setResultado(null)}>
        <DialogContent className="border-gold/30 bg-jet text-center sm:max-w-lg">
          {resultado && aviso && (
            <>
              <DialogHeader>
                <div className={cn('mx-auto mb-3 flex size-14 items-center justify-center rounded-full border', aviso.tono)}>
                  <aviso.icono className="size-6" />
                </div>
                <p className="fs-eyebrow text-center">Expediente · {resultado.nombre}</p>
                <DialogTitle className="text-center font-display text-2xl tracking-[0.1em] uppercase">{aviso.titulo}</DialogTitle>
                <DialogDescription className="pt-2 text-center text-base leading-relaxed text-foreground/85">
                  {aviso.texto}
                </DialogDescription>
              </DialogHeader>
              <DialogFooter className="gap-2 sm:justify-center">
                {resultado.estado === 'aceptada' && resultado.enlace ? (
                  <Button asChild size="lg" className="border border-gold/40 font-display tracking-[0.15em] uppercase">
                    <a href={resultado.enlace} target="_blank" rel="noopener noreferrer">
                      Siguiente / Ir a la Recepción <ArrowRight />
                    </a>
                  </Button>
                ) : (
                  <Button
                    variant="outline"
                    onClick={() => {
                      setResultado(null)
                      if (resultado.estado === 'rechazada') window.location.hash = 'inicio'
                    }}
                  >
                    Cerrar
                  </Button>
                )}
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </section>
  )
}
