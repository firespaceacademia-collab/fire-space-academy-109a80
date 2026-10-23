import { useEffect, useMemo, useState } from 'react'
import { AlertCircle, Check, CheckCircle2, Copy, Eye, Loader2, MoreHorizontal, ScrollText, Trash2, XCircle } from 'lucide-react'
import { toast } from 'sonner'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Textarea } from '@/components/ui/textarea'
import {
  ESTADO_ETIQUETA,
  INTELIGENCIAS_POSTULANTE,
  OCUPACIONES,
  claveNombre,
  type Estado,
  type Estudiante,
  type SolicitudCompleta,
  type SolicitudPublica,
} from '@/lib/academia'
import { cambiarEstado, eliminarSolicitud, enviarSolicitud, verFichaAdmin } from '@/lib/academia.functions'
import { cn } from '@/lib/utils'
import { CodigoDialog, type PeticionCodigo } from './codigo-dialog'
import { Encabezado, Revelar } from './revelar'

const NOMBRE_OCUPADO = 'Este personaje ya está ocupado/solicitado'

export const ESTILO_ESTADO: Record<Estado, string> = {
  en_proceso: 'border-gold/50 bg-gold/10 text-gold',
  aceptada: 'border-emerald/70 bg-emerald/15 text-[#8fd694]',
  rechazada: 'border-blood/70 bg-blood/20 text-[#f0a3a3]',
}

type Formulario = {
  nombre: string
  edadOn: string
  edadOff: string
  inteligencia: string
  ocupacion: string
  talentos: string
}
const VACIO: Formulario = { nombre: '', edadOn: '', edadOff: '', inteligencia: '', ocupacion: '', talentos: '' }

function useMontado() {
  const [m, setM] = useState(false)
  useEffect(() => setM(true), [])
  return m
}

export function Admisiones({
  estudiantes,
  solicitudes,
  errorCarga,
  recargar,
}: {
  estudiantes: Estudiante[]
  solicitudes: SolicitudPublica[]
  errorCarga: boolean
  recargar: () => Promise<void>
}) {
  const [pestana, setPestana] = useState('ficha')
  const [form, setForm] = useState<Formulario>(VACIO)
  const [enviando, setEnviando] = useState(false)
  const [errorEnvio, setErrorEnvio] = useState<string | null>(null)
  const [registro, setRegistro] = useState<{ codigo: string; nombre: string } | null>(null)
  const [peticion, setPeticion] = useState<PeticionCodigo | null>(null)
  const [ficha, setFicha] = useState<SolicitudCompleta | null>(null)

  const nombresOcupados = useMemo(
    () => new Set([...estudiantes.map((e) => claveNombre(e.nombre)), ...solicitudes.map((s) => claveNombre(s.nombre))]),
    [estudiantes, solicitudes],
  )
  const nombreOcupado = form.nombre.trim().length > 0 && nombresOcupados.has(claveNombre(form.nombre))
  const completo =
    form.nombre.trim().length >= 2 &&
    form.edadOn &&
    form.edadOff.trim() &&
    form.inteligencia &&
    form.ocupacion &&
    form.talentos.trim().length >= 3

  const campo = (k: keyof Formulario) => (v: string) => setForm((f) => ({ ...f, [k]: v }))

  async function enviar(e: React.FormEvent) {
    e.preventDefault()
    if (nombreOcupado) return setErrorEnvio(NOMBRE_OCUPADO)
    if (!completo) return setErrorEnvio('Completa todos los campos de la ficha.')
    setEnviando(true)
    setErrorEnvio(null)
    try {
      const r = await enviarSolicitud({
        data: {
          nombre: form.nombre.trim(),
          edadOn: Number(form.edadOn),
          edadOff: form.edadOff.trim(),
          inteligencia: form.inteligencia as (typeof INTELIGENCIAS_POSTULANTE)[number],
          ocupacion: form.ocupacion as (typeof OCUPACIONES)[number],
          talentos: form.talentos.trim(),
        },
      })
      if (!r.ok) {
        setErrorEnvio(r.error)
        if (r.error === NOMBRE_OCUPADO) await recargar()
        return
      }
      setRegistro({ codigo: r.codigo, nombre: r.nombre })
      setForm(VACIO)
      await recargar()
    } catch {
      setErrorEnvio('No se pudo enviar la ficha. Revisa los datos e inténtalo de nuevo.')
    } finally {
      setEnviando(false)
    }
  }

  async function copiar(codigo: string) {
    try {
      await navigator.clipboard.writeText(codigo)
      toast.success('Código copiado', { description: 'Guárdalo en un lugar seguro.' })
    } catch {
      toast.error('No se pudo copiar. Anota el código manualmente.')
    }
  }

  function pedirEliminar(s: SolicitudPublica) {
    setPeticion({
      titulo: 'Eliminar solicitud',
      descripcion: `Introduce el código único de registro asignado a ${s.nombre} para retirar su ficha.`,
      etiqueta: 'Código único de registro',
      boton: 'Eliminar',
      peligro: true,
      enviar: async (codigo) => {
        const r = await eliminarSolicitud({ data: { id: s.id, codigo } })
        if (!r.ok) return r.error
        toast.success('Solicitud eliminada', { description: `La ficha de ${s.nombre} ha sido retirada.` })
        await recargar()
        return null
      },
    })
  }

  function pedirEstado(s: SolicitudPublica, estado: 'aceptada' | 'rechazada') {
    setPeticion({
      titulo: estado === 'aceptada' ? 'Aceptar ficha' : 'Rechazar ficha',
      descripcion:
        estado === 'aceptada'
          ? `Confirma con el código de administrador para aceptar la ficha de ${s.nombre}.`
          : `Confirma con el código de administrador para rechazar la ficha de ${s.nombre}. Será eliminada automáticamente en 24 horas.`,
      etiqueta: 'Código único de administrador',
      boton: estado === 'aceptada' ? 'Aceptar' : 'Rechazar',
      peligro: estado === 'rechazada',
      enviar: async (codigoAdmin) => {
        const r = await cambiarEstado({ data: { id: s.id, estado, codigoAdmin } })
        if (!r.ok) return r.error
        toast.success(estado === 'aceptada' ? 'Ficha Aceptada' : 'Ficha Rechazada', { description: s.nombre })
        await recargar()
        return null
      },
    })
  }

  function pedirVerFicha(s: SolicitudPublica) {
    setPeticion({
      titulo: 'Acceso restringido',
      descripcion: `La información de ${s.nombre} solo es visible para la administración.`,
      etiqueta: 'Código único de administrador',
      boton: 'Ver ficha',
      enviar: async (codigoAdmin) => {
        const r = await verFichaAdmin({ data: { id: s.id, codigoAdmin } })
        if (!r.ok) return r.error
        setFicha(r.ficha)
        return null
      },
    })
  }

  return (
    <section id="admisiones" className="relative px-4 py-24 sm:px-6" aria-labelledby="admisiones-titulo">
      <div className="mx-auto max-w-content">
        <Encabezado id="admisiones-titulo" eyebrow="Portal de Admisiones" titulo="Así que entra">
          <p>
            Quizá entres para conseguir una beca, quizá quieras convertirte en Élite, quizá quieras demostrar que tu
            inteligencia es superior, quizá quieras vengarte de alguien, quizá quieras encontrar a una persona, quizá
            simplemente quieras sobrevivir.
          </p>
        </Encabezado>

        <Revelar className="mb-10 flex flex-wrap justify-center gap-x-6 gap-y-2 font-display text-[0.7rem] tracking-[0.25em] text-foreground/70 uppercase">
          {['Elige tu inteligencia', 'Construye tu reputación', 'Haz aliados', 'Crea enemigos', 'Participa', 'Compite', 'Asciende'].map((t) => (
            <span key={t} className="flex items-center gap-2">
              <span className="text-gold">✱</span> {t}
            </span>
          ))}
        </Revelar>

        <Tabs value={pestana} onValueChange={setPestana} className="gap-6">
          <TabsList className="mx-auto h-auto w-full max-w-lg border border-gold/20 bg-jet p-1">
            <TabsTrigger value="ficha" className="py-2.5 font-display text-[0.7rem] tracking-[0.18em] uppercase data-[state=active]:bg-blood data-[state=active]:text-foreground">
              Ficha de Admisión
            </TabsTrigger>
            <TabsTrigger value="pendientes" className="py-2.5 font-display text-[0.7rem] tracking-[0.18em] uppercase data-[state=active]:bg-blood data-[state=active]:text-foreground">
              Solicitudes Pendientes
              <span className="ml-1 rounded-full bg-gold/20 px-1.5 text-[0.6rem] text-gold">{solicitudes.length}</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="ficha">
            <form onSubmit={enviar} noValidate className="fs-panel fs-frame mx-auto max-w-3xl p-6 sm:p-10">
              <div className="mb-8 flex items-center gap-3">
                <ScrollText className="size-6 text-gold" />
                <div>
                  <h3 className="font-display text-xl tracking-[0.12em] uppercase">Ficha de ingreso</h3>
                  <p className="text-sm text-muted-foreground">Al enviarla recibirás tu código único de registro.</p>
                </div>
              </div>

              <div className="grid gap-6 sm:grid-cols-2">
                <div className="grid gap-2 sm:col-span-2">
                  <Label htmlFor="f-nombre" className="fs-label">Nombre del personaje</Label>
                  <Input
                    id="f-nombre"
                    value={form.nombre}
                    onChange={(e) => campo('nombre')(e.target.value)}
                    maxLength={60}
                    placeholder="Ej. nombre artístico o real del personaje"
                    aria-invalid={nombreOcupado}
                    aria-describedby="f-nombre-estado"
                    className="h-11 bg-jet"
                  />
                  <p id="f-nombre-estado" aria-live="polite" className="min-h-5 text-sm">
                    {nombreOcupado ? (
                      <span className="flex items-center gap-1.5 text-destructive brightness-150">
                        <XCircle className="size-4" /> {NOMBRE_OCUPADO}
                      </span>
                    ) : form.nombre.trim().length >= 2 ? (
                      <span className="flex items-center gap-1.5 text-[#8fd694]">
                        <CheckCircle2 className="size-4" /> Nombre disponible
                      </span>
                    ) : null}
                  </p>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="f-edad-on" className="fs-label">Edad On</Label>
                  <Select value={form.edadOn} onValueChange={campo('edadOn')}>
                    <SelectTrigger id="f-edad-on" className="h-11 w-full bg-jet" aria-describedby="f-edad-nota">
                      <SelectValue placeholder="17 – 19 años" />
                    </SelectTrigger>
                    <SelectContent>
                      {[17, 18, 19].map((n) => (
                        <SelectItem key={n} value={String(n)}>{n} años</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p id="f-edad-nota" className="text-xs leading-relaxed text-muted-foreground">
                    En caso de que su personaje tenga más de 19 años, modificar la edad. No se permiten personajes
                    menores de 17 años.
                  </p>
                </div>

                <div className="grid content-start gap-2">
                  <Label htmlFor="f-edad-off" className="fs-label">Edad Off</Label>
                  <Input id="f-edad-off" value={form.edadOff} onChange={(e) => campo('edadOff')(e.target.value)} maxLength={20} inputMode="numeric" placeholder="Tu edad real" className="h-11 bg-jet" />
                  <p className="text-xs text-muted-foreground">Solo la administración puede verla.</p>
                </div>

                <div className="grid content-start gap-2">
                  <Label htmlFor="f-inteligencia" className="fs-label">Tipo de inteligencia</Label>
                  <Select value={form.inteligencia} onValueChange={campo('inteligencia')}>
                    <SelectTrigger id="f-inteligencia" className="h-11 w-full bg-jet">
                      <SelectValue placeholder="Selecciona" />
                    </SelectTrigger>
                    <SelectContent>
                      {INTELIGENCIAS_POSTULANTE.map((i) => (
                        <SelectItem key={i} value={i}>{i}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground">La inteligencia Personal se reserva al Rango 4.</p>
                </div>

                <div className="grid content-start gap-2">
                  <Label htmlFor="f-ocupacion" className="fs-label">¿Idol, actor, influencer, grupo u otro?</Label>
                  <Select value={form.ocupacion} onValueChange={campo('ocupacion')}>
                    <SelectTrigger id="f-ocupacion" className="h-11 w-full bg-jet">
                      <SelectValue placeholder="Selecciona" />
                    </SelectTrigger>
                    <SelectContent>
                      {OCUPACIONES.map((o) => (
                        <SelectItem key={o} value={o}>{o}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid gap-2 sm:col-span-2">
                  <Label htmlFor="f-talentos" className="fs-label">Talentos y habilidades</Label>
                  <Textarea
                    id="f-talentos"
                    value={form.talentos}
                    onChange={(e) => campo('talentos')(e.target.value)}
                    maxLength={2000}
                    rows={5}
                    placeholder="¿Qué puede aportar tu personaje a Fire Space?"
                    className="bg-jet"
                  />
                </div>
              </div>

              {errorEnvio && (
                <p role="alert" className="mt-6 flex items-center gap-2 border border-destructive/60 bg-destructive/10 px-4 py-3 text-sm text-[#f0a3a3]">
                  <AlertCircle className="size-4 shrink-0" /> {errorEnvio}
                </p>
              )}

              <Button
                type="submit"
                size="lg"
                disabled={enviando || nombreOcupado || !completo}
                className="mt-8 w-full border border-gold/40 font-display tracking-[0.25em] uppercase shadow-[0_0_30px_-8px_rgba(139,0,0,1)]"
              >
                {enviando && <Loader2 className="animate-spin" />}
                Enviar solicitud de ingreso
              </Button>
            </form>
          </TabsContent>

          <TabsContent value="pendientes">
            <Pendientes
              solicitudes={solicitudes}
              errorCarga={errorCarga}
              onVer={pedirVerFicha}
              onEliminar={pedirEliminar}
              onEstado={pedirEstado}
              onNueva={() => setPestana('ficha')}
            />
          </TabsContent>
        </Tabs>
      </div>

      <Dialog open={!!registro} onOpenChange={(o) => !o && setRegistro(null)}>
        <DialogContent className="border-gold/40 bg-jet text-center sm:max-w-md">
          {registro && (
            <>
              <DialogHeader>
                <p className="fs-eyebrow text-center">Solicitud registrada</p>
                <DialogTitle className="text-center font-display text-2xl tracking-[0.1em] uppercase">{registro.nombre}</DialogTitle>
                <DialogDescription className="text-center">
                  Tu ficha fue enviada a Solicitudes Pendientes con el estado “Ficha en proceso de evaluación”.
                </DialogDescription>
              </DialogHeader>
              <div className="my-2 border border-gold/50 bg-gradient-to-b from-blood/30 to-transparent px-4 py-6">
                <p className="font-display text-[0.6rem] tracking-[0.35em] text-muted-foreground uppercase">Código único de registro</p>
                <p className="fs-gold-text mt-2 font-display text-5xl font-bold tracking-[0.2em]">{registro.codigo}</p>
              </div>
              <p className="text-sm text-muted-foreground">
                Consérvalo: lo necesitarás para retirar tu solicitud y para entrar en la Oficina de Admisiones. No
                podrá recuperarse.
              </p>
              <DialogFooter className="gap-2 sm:justify-center">
                <Button variant="outline" onClick={() => copiar(registro.codigo)} className="border-gold/40 text-gold">
                  <Copy /> Copiar código
                </Button>
                <Button onClick={() => { setRegistro(null); setPestana('pendientes') }}>
                  Ver solicitudes
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={!!ficha} onOpenChange={(o) => !o && setFicha(null)}>
        <DialogContent className="max-h-[90svh] overflow-y-auto border-gold/30 bg-jet sm:max-w-lg">
          {ficha && (
            <>
              <DialogHeader>
                <p className="fs-eyebrow">Ficha de admisión · Solo administración</p>
                <DialogTitle className="font-display text-2xl tracking-[0.1em] uppercase">{ficha.nombre}</DialogTitle>
                <DialogDescription>
                  <Badge variant="outline" className={cn('mt-1', ESTILO_ESTADO[ficha.estado])}>{ESTADO_ETIQUETA[ficha.estado]}</Badge>
                </DialogDescription>
              </DialogHeader>
              <dl className="grid grid-cols-2 gap-3">
                {[
                  ['Código de registro', ficha.codigo],
                  ['Edad On', `${ficha.edadOn} años`],
                  ['Edad Off', ficha.edadOff],
                  ['Inteligencia', ficha.inteligencia],
                  ['Perfil', ficha.ocupacion],
                ].map(([k, v]) => (
                  <div key={k} className="border border-border bg-card px-3 py-2">
                    <dt className="font-display text-[0.55rem] tracking-[0.25em] text-muted-foreground uppercase">{k}</dt>
                    <dd className="mt-1 text-foreground">{v}</dd>
                  </div>
                ))}
              </dl>
              <div>
                <p className="font-display text-[0.6rem] tracking-[0.25em] text-gold uppercase">Talentos y habilidades</p>
                <p className="mt-2 leading-relaxed whitespace-pre-line text-foreground/85">{ficha.talentos}</p>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      <CodigoDialog peticion={peticion} onClose={() => setPeticion(null)} />
    </section>
  )
}

function Pendientes({
  solicitudes,
  errorCarga,
  onVer,
  onEliminar,
  onEstado,
  onNueva,
}: {
  solicitudes: SolicitudPublica[]
  errorCarga: boolean
  onVer: (s: SolicitudPublica) => void
  onEliminar: (s: SolicitudPublica) => void
  onEstado: (s: SolicitudPublica, e: 'aceptada' | 'rechazada') => void
  onNueva: () => void
}) {
  const montado = useMontado()

  if (errorCarga) {
    return (
      <div className="mx-auto flex max-w-xl flex-col items-center border border-destructive/40 px-6 py-14 text-center">
        <AlertCircle className="size-8 text-destructive brightness-150" />
        <p className="mt-4 font-display tracking-[0.15em] uppercase">Archivo no disponible</p>
        <p className="mt-2 text-muted-foreground">No se pudieron cargar las solicitudes. Recarga la página en unos minutos.</p>
      </div>
    )
  }

  if (solicitudes.length === 0) {
    return (
      <div className="mx-auto flex max-w-xl flex-col items-center border border-dashed border-gold/25 px-6 py-14 text-center">
        <ScrollText className="size-8 text-gold/50" />
        <p className="mt-4 font-display tracking-[0.15em] uppercase">Sin solicitudes pendientes</p>
        <p className="mt-2 text-muted-foreground">Fire Space te está esperando.</p>
        <Button variant="outline" onClick={onNueva} className="mt-6 border-gold/40 text-gold">
          Enviar una ficha
        </Button>
      </div>
    )
  }

  return (
    <div>
      <p className="mb-6 text-center text-sm text-muted-foreground">
        Por privacidad solo se muestra el nombre del postulante. La ficha completa requiere el código de administrador.
      </p>
      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {solicitudes.map((s) => {
          const horasRestantes = s.rechazadaEn
            ? Math.max(0, Math.ceil((new Date(s.rechazadaEn).getTime() + 86_400_000 - Date.now()) / 3_600_000))
            : null
          return (
            <li key={s.id} className="fs-panel flex flex-col p-5 transition-colors hover:border-gold/30">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="font-display text-[0.55rem] tracking-[0.3em] text-muted-foreground uppercase">Postulante</p>
                  <h4 className="mt-1 truncate font-display text-xl tracking-[0.08em] uppercase">{s.nombre}</h4>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon-sm" aria-label={`Opciones de la solicitud de ${s.nombre}`} className="shrink-0 text-gold">
                      <MoreHorizontal />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56 border-gold/20 bg-jet">
                    <DropdownMenuLabel className="font-display text-[0.6rem] tracking-[0.25em] text-muted-foreground uppercase">
                      Cambiar estado · Admin
                    </DropdownMenuLabel>
                    <DropdownMenuItem onSelect={() => onEstado(s, 'aceptada')} disabled={s.estado === 'aceptada'}>
                      <Check className="text-[#8fd694]" /> Aceptar ficha
                    </DropdownMenuItem>
                    <DropdownMenuItem onSelect={() => onEstado(s, 'rechazada')} disabled={s.estado === 'rechazada'}>
                      <XCircle className="text-[#f0a3a3]" /> Rechazar ficha
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onSelect={() => onEliminar(s)} variant="destructive">
                      <Trash2 /> Eliminar solicitud
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <Badge variant="outline" className={cn('mt-4 w-fit whitespace-normal', ESTILO_ESTADO[s.estado])}>
                {ESTADO_ETIQUETA[s.estado]}
              </Badge>
              <p className="mt-3 min-h-5 text-xs text-muted-foreground">
                {montado &&
                  (horasRestantes !== null
                    ? `Se eliminará en ${horasRestantes} h`
                    : `Recibida el ${new Date(s.creadaEn).toLocaleDateString('es', { day: 'numeric', month: 'long' })}`)}
              </p>
              <Button variant="outline" size="sm" onClick={() => onVer(s)} className="mt-4 border-border text-foreground/80">
                <Eye /> Ver ficha (admin)
              </Button>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
