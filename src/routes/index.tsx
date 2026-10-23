import { useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'

import { Admisiones } from '@/components/fs/admisiones'
import { Destacados } from '@/components/fs/destacados'
import { Directorio } from '@/components/fs/directorio'
import { Expediente } from '@/components/fs/expediente'
import { Hero } from '@/components/fs/hero'
import { Historia } from '@/components/fs/historia'
import { Inteligencias } from '@/components/fs/inteligencias'
import { Intruders } from '@/components/fs/intruders'
import { MensajeDirector } from '@/components/fs/mensaje-director'
import { Navegacion } from '@/components/fs/navegacion'
import { Oficina } from '@/components/fs/oficina'
import { Pie } from '@/components/fs/pie'
import { Rangos } from '@/components/fs/rangos'
import { Zonas } from '@/components/fs/zonas'
import type { Estudiante, SolicitudPublica } from '@/lib/academia'
import { listarSolicitudes, obtenerAcademia } from '@/lib/academia.functions'

async function cargarSolicitudes() {
  try {
    return { solicitudes: await listarSolicitudes(), errorCarga: false }
  } catch (err) {
    console.error('No se pudieron cargar las solicitudes', err)
    return { solicitudes: [] as SolicitudPublica[], errorCarga: true }
  }
}

export const Route = createFileRoute('/')({
  loader: async () => {
    const [academia, pendientes] = await Promise.all([obtenerAcademia(), cargarSolicitudes()])
    return { ...academia, ...pendientes }
  },
  component: Home,
})

function Home() {
  const datos = Route.useLoaderData()
  const [pendientes, setPendientes] = useState({ solicitudes: datos.solicitudes, errorCarga: datos.errorCarga })
  const [expediente, setExpediente] = useState<Estudiante | null>(null)

  async function recargar() {
    setPendientes(await cargarSolicitudes())
  }

  return (
    <>
      <Navegacion />
      <main>
        <Hero />
        <MensajeDirector />
        <Historia />
        <Inteligencias />
        <Rangos />
        <Zonas />
        <Destacados figuras={datos.figuras} estudiantes={datos.estudiantes} onVer={setExpediente} />
        <Directorio estudiantes={datos.estudiantes} onVer={setExpediente} />
        <Intruders />
        <Admisiones
          estudiantes={datos.estudiantes}
          solicitudes={pendientes.solicitudes}
          errorCarga={pendientes.errorCarga}
          recargar={recargar}
        />
        <Oficina />
      </main>
      <Pie />
      <Expediente estudiante={expediente} onClose={() => setExpediente(null)} />
    </>
  )
}
