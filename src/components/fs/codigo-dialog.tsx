import { useEffect, useState } from 'react'
import { KeyRound, Loader2 } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export type PeticionCodigo = {
  titulo: string
  descripcion: string
  etiqueta: string
  boton: string
  peligro?: boolean
  // Devuelve un mensaje de error, o null si el código fue aceptado.
  enviar: (codigo: string) => Promise<string | null>
}

export function CodigoDialog({ peticion, onClose }: { peticion: PeticionCodigo | null; onClose: () => void }) {
  const [codigo, setCodigo] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [enviando, setEnviando] = useState(false)

  useEffect(() => {
    setCodigo('')
    setError(null)
  }, [peticion])

  async function confirmar(e: React.FormEvent) {
    e.preventDefault()
    if (!peticion || !codigo.trim()) return
    setEnviando(true)
    setError(null)
    try {
      const err = await peticion.enviar(codigo.trim())
      if (err) setError(err)
      else onClose()
    } catch {
      setError('No se pudo conectar con la administración. Inténtalo de nuevo.')
    } finally {
      setEnviando(false)
    }
  }

  return (
    <Dialog open={!!peticion} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="border-gold/30 bg-jet sm:max-w-md">
        {peticion && (
          <form onSubmit={confirmar} className="grid gap-5">
            <DialogHeader>
              <div className="mx-auto mb-2 flex size-12 items-center justify-center rounded-full border border-gold/40 bg-blood/20">
                <KeyRound className="size-5 text-gold" />
              </div>
              <DialogTitle className="text-center font-display tracking-[0.12em] uppercase">{peticion.titulo}</DialogTitle>
              <DialogDescription className="text-center">{peticion.descripcion}</DialogDescription>
            </DialogHeader>
            <div className="grid gap-2">
              <Label htmlFor="codigo-autorizacion" className="font-display text-[0.65rem] tracking-[0.25em] text-gold uppercase">
                {peticion.etiqueta}
              </Label>
              <Input
                id="codigo-autorizacion"
                value={codigo}
                onChange={(e) => setCodigo(e.target.value.toUpperCase())}
                placeholder="FS-0000"
                autoComplete="off"
                autoFocus
                aria-invalid={!!error}
                aria-describedby={error ? 'codigo-error' : undefined}
                className="h-12 bg-card text-center font-display text-xl tracking-[0.35em]"
              />
              {error && (
                <p id="codigo-error" role="alert" className="text-center text-sm text-destructive brightness-150">
                  {error}
                </p>
              )}
            </div>
            <DialogFooter className="gap-2 sm:justify-center">
              <Button type="button" variant="ghost" onClick={onClose}>
                Cancelar
              </Button>
              <Button type="submit" disabled={enviando || !codigo.trim()} variant={peticion.peligro ? 'destructive' : 'default'} className="min-w-36 font-display tracking-[0.15em] uppercase">
                {enviando && <Loader2 className="animate-spin" />}
                {peticion.boton}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}
