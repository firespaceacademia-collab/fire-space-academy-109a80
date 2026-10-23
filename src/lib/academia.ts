// Tipos y utilidades compartidas entre el navegador y el servidor.

export const INTELIGENCIAS = ['Académica', 'Artística', 'Deportiva', 'Personal'] as const
// Inteligencias que un postulante puede elegir (la Personal se alcanza en el Rango 4).
export const INTELIGENCIAS_POSTULANTE = ['Artística', 'Académica', 'Deportiva'] as const
export const RANGOS = ['Élite', 'Avanzado', 'Destacado', 'Aspirante', 'Candidato', 'Becado'] as const
export const OCUPACIONES = ['Idol', 'Actor / Actriz', 'Influencer', 'Pertenece a un grupo', 'Otro'] as const

export type Estado = 'en_proceso' | 'aceptada' | 'rechazada'

export const ESTADO_ETIQUETA: Record<Estado, string> = {
  en_proceso: 'Ficha en proceso de evaluación',
  aceptada: 'Ficha Aceptada',
  rechazada: 'Ficha Rechazada',
}

export type Estudiante = {
  id: string
  nombre: string
  edadOn: string
  inteligencia: string
  rango: string
  puntos: number
  estado: Estado
  descripcion: string
  loreCompleto: string
  documento: string
  imagen: string
  destacado: boolean
}

export type Figura = {
  nombre: string
  titulo: string
  cita: string
  descripcion: string
  imagen: string
}

export type SolicitudPublica = {
  id: number
  nombre: string
  estado: Estado
  creadaEn: string
  rechazadaEn: string | null
}

export type SolicitudCompleta = SolicitudPublica & {
  codigo: string
  edadOn: number
  edadOff: string
  inteligencia: string
  ocupacion: string
  talentos: string
}

export type Resultado<T = object> = ({ ok: true } & T) | { ok: false; error: string }

// "Sakuya", "  sákuya " y "SAKUYA" cuentan como el mismo personaje.
export function claveNombre(nombre: string) {
  return nombre
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase()
    .trim()
    .replace(/\s+/g, ' ')
}

export function formatoPuntos(puntos: number) {
  return `${String(Math.max(0, Math.trunc(puntos))).padStart(2, '0')} pts`
}

// Las imágenes locales pasan por el Image CDN de Netlify; los enlaces externos se usan tal cual.
export function urlImagen(src: string, ancho: number) {
  if (!src) return ''
  if (src.startsWith('/')) return `/.netlify/images?url=${encodeURIComponent(src)}&w=${ancho}&fm=webp`
  return src
}
