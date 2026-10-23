import { createServerFn } from '@tanstack/react-start'
import { and, eq, isNotNull, lt } from 'drizzle-orm'
import { z } from 'zod'

import { db } from '../../db/index.js'
import { solicitudes } from '../../db/schema.js'
import registro from '../../data/estudiantes.json'
import destacados from '../../data/destacados.json'
import enlace from '../../data/link.json'
import {
  INTELIGENCIAS_POSTULANTE,
  OCUPACIONES,
  claveNombre,
  type Estado,
  type Estudiante,
  type Figura,
  type Resultado,
  type SolicitudCompleta,
  type SolicitudPublica,
} from './academia'

// Código de administrador. Puede sobrescribirse con la variable de entorno FS_ADMIN_CODE.
const codigoAdmin = () => (process.env.FS_ADMIN_CODE || 'FS-2110').trim().toUpperCase()
const normalizarCodigo = (c: string) => c.trim().toUpperCase()
const VEINTICUATRO_HORAS = 24 * 60 * 60 * 1000

type EstudianteJson = Partial<Estudiante> & { edadOff?: string; codigo?: string }
const estudiantesJson = (registro.estudiantes as unknown as EstudianteJson[]).filter((e) => e.nombre)

// Solo devuelve campos públicos: la Edad Off y el código nunca salen del servidor.
export const obtenerAcademia = createServerFn({ method: 'GET' }).handler(async () => {
  const estudiantes: Estudiante[] = estudiantesJson.map((e, i) => ({
    id: e.id || `estudiante-${i}`,
    nombre: e.nombre ?? '',
    edadOn: e.edadOn ?? '',
    inteligencia: e.inteligencia ?? '',
    rango: e.rango ?? '',
    puntos: Number(e.puntos) || 0,
    estado: (e.estado as Estado) || 'aceptada',
    descripcion: e.descripcion ?? '',
    loreCompleto: e.loreCompleto ?? '',
    documento: e.documento ?? '',
    imagen: e.imagen ?? '',
    destacado: Boolean(e.destacado),
  }))
  return { estudiantes, figuras: destacados.figuras as unknown as Figura[] }
})

async function limpiarRechazadas() {
  await db
    .delete(solicitudes)
    .where(
      and(
        eq(solicitudes.estado, 'rechazada'),
        isNotNull(solicitudes.rechazadaEn),
        lt(solicitudes.rechazadaEn, new Date(Date.now() - VEINTICUATRO_HORAS)),
      ),
    )
}

function aPublica(s: typeof solicitudes.$inferSelect): SolicitudPublica {
  return {
    id: s.id,
    nombre: s.nombre,
    estado: s.estado as Estado,
    creadaEn: s.creadaEn.toISOString(),
    rechazadaEn: s.rechazadaEn ? s.rechazadaEn.toISOString() : null,
  }
}

export const listarSolicitudes = createServerFn({ method: 'GET' }).handler(
  async (): Promise<SolicitudPublica[]> => {
    await limpiarRechazadas()
    const filas = await db.select().from(solicitudes).orderBy(solicitudes.creadaEn)
    return filas.reverse().map(aPublica)
  },
)

const fichaInput = z.object({
  nombre: z.string().trim().min(2).max(60),
  edadOn: z.number().int().min(17).max(19),
  edadOff: z.string().trim().min(1).max(20),
  inteligencia: z.enum(INTELIGENCIAS_POSTULANTE),
  ocupacion: z.enum(OCUPACIONES),
  talentos: z.string().trim().min(3).max(2000),
})

function generarCodigo() {
  return `FS-${Math.floor(1000 + Math.random() * 9000)}`
}

export const enviarSolicitud = createServerFn({ method: 'POST' })
  .validator(fichaInput)
  .handler(async ({ data }): Promise<Resultado<{ codigo: string; nombre: string }>> => {
    const clave = claveNombre(data.nombre)
    const ocupadoEnRegistro = estudiantesJson.some((e) => claveNombre(e.nombre ?? '') === clave)
    if (ocupadoEnRegistro) return { ok: false, error: 'Este personaje ya está ocupado/solicitado' }

    await limpiarRechazadas()
    const [existente] = await db
      .select({ id: solicitudes.id })
      .from(solicitudes)
      .where(eq(solicitudes.nombreClave, clave))
    if (existente) return { ok: false, error: 'Este personaje ya está ocupado/solicitado' }

    const codigosReservados = new Set([
      codigoAdmin(),
      ...estudiantesJson.map((e) => normalizarCodigo(e.codigo ?? '')).filter(Boolean),
    ])

    // Reintenta si el código coincide con uno existente (la columna es única).
    for (let intento = 0; intento < 12; intento++) {
      const codigo = generarCodigo()
      if (codigosReservados.has(codigo)) continue
      try {
        await db.insert(solicitudes).values({
          codigo,
          nombre: data.nombre,
          nombreClave: clave,
          edadOn: data.edadOn,
          edadOff: data.edadOff,
          inteligencia: data.inteligencia,
          ocupacion: data.ocupacion,
          talentos: data.talentos,
        })
        return { ok: true, codigo, nombre: data.nombre }
      } catch (err) {
        const [otro] = await db
          .select({ id: solicitudes.id })
          .from(solicitudes)
          .where(eq(solicitudes.nombreClave, clave))
        if (otro) return { ok: false, error: 'Este personaje ya está ocupado/solicitado' }
        const yaUsado = await db
          .select({ id: solicitudes.id })
          .from(solicitudes)
          .where(eq(solicitudes.codigo, codigo))
        if (yaUsado.length === 0) {
          console.error('Error al guardar la solicitud', err)
          return { ok: false, error: 'No se pudo registrar la ficha. Inténtalo de nuevo.' }
        }
      }
    }
    return { ok: false, error: 'No se pudo generar un código único. Inténtalo de nuevo.' }
  })

export const verFichaAdmin = createServerFn({ method: 'POST' })
  .validator(z.object({ id: z.number().int(), codigoAdmin: z.string().max(40) }))
  .handler(async ({ data }): Promise<Resultado<{ ficha: SolicitudCompleta }>> => {
    if (normalizarCodigo(data.codigoAdmin) !== codigoAdmin())
      return { ok: false, error: 'Acceso denegado: código de administrador inválido.' }
    const [s] = await db.select().from(solicitudes).where(eq(solicitudes.id, data.id))
    if (!s) return { ok: false, error: 'La solicitud ya no existe.' }
    return {
      ok: true,
      ficha: {
        ...aPublica(s),
        codigo: s.codigo,
        edadOn: s.edadOn,
        edadOff: s.edadOff,
        inteligencia: s.inteligencia,
        ocupacion: s.ocupacion,
        talentos: s.talentos,
      },
    }
  })

export const eliminarSolicitud = createServerFn({ method: 'POST' })
  .validator(z.object({ id: z.number().int(), codigo: z.string().max(40) }))
  .handler(async ({ data }): Promise<Resultado> => {
    const [s] = await db.select().from(solicitudes).where(eq(solicitudes.id, data.id))
    if (!s) return { ok: false, error: 'La solicitud ya no existe.' }
    const codigo = normalizarCodigo(data.codigo)
    if (codigo !== s.codigo && codigo !== codigoAdmin())
      return { ok: false, error: 'Código de autorización inválido' }
    await db.delete(solicitudes).where(eq(solicitudes.id, data.id))
    return { ok: true }
  })

export const cambiarEstado = createServerFn({ method: 'POST' })
  .validator(
    z.object({
      id: z.number().int(),
      estado: z.enum(['aceptada', 'rechazada']),
      codigoAdmin: z.string().max(40),
    }),
  )
  .handler(async ({ data }): Promise<Resultado> => {
    if (normalizarCodigo(data.codigoAdmin) !== codigoAdmin())
      return { ok: false, error: 'Acción rechazada: no tienes permisos de administrador.' }
    const actualizadas = await db
      .update(solicitudes)
      .set({ estado: data.estado, rechazadaEn: data.estado === 'rechazada' ? new Date() : null })
      .where(eq(solicitudes.id, data.id))
      .returning({ id: solicitudes.id })
    if (actualizadas.length === 0) return { ok: false, error: 'La solicitud ya no existe.' }
    return { ok: true }
  })

// Oficina de Admisiones: consulta el estado de una ficha por su código único.
export const consultarOficina = createServerFn({ method: 'POST' })
  .validator(z.object({ codigo: z.string().trim().min(1).max(40) }))
  .handler(
    async ({ data }): Promise<Resultado<{ nombre: string; estado: Estado; enlace: string | null }>> => {
      const codigo = normalizarCodigo(data.codigo)
      await limpiarRechazadas()
      const [s] = await db.select().from(solicitudes).where(eq(solicitudes.codigo, codigo))
      let nombre: string | undefined = s?.nombre
      let estado = s?.estado as Estado | undefined
      if (!s) {
        const e = estudiantesJson.find((x) => x.codigo && normalizarCodigo(x.codigo) === codigo)
        nombre = e?.nombre
        estado = (e?.estado as Estado) || (e ? 'aceptada' : undefined)
      }
      if (!nombre || !estado)
        return { ok: false, error: 'No existe ningún expediente con ese código de registro.' }
      return { ok: true, nombre, estado, enlace: estado === 'aceptada' ? enlace.whatsapp : null }
    },
  )
