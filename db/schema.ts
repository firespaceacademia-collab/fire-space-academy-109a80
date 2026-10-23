import { integer, pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core'

// Solicitudes de admisión enviadas desde el Portal de Admisiones.
export const solicitudes = pgTable('solicitudes', {
  id: serial().primaryKey(),
  // Código único de registro entregado al postulante (ej. FS-8492).
  codigo: text().notNull().unique(),
  nombre: text().notNull(),
  // Nombre normalizado (minúsculas, sin acentos) para impedir duplicados.
  nombreClave: text('nombre_clave').notNull().unique(),
  edadOn: integer('edad_on').notNull(),
  edadOff: text('edad_off').notNull(),
  inteligencia: text().notNull(),
  ocupacion: text().notNull(),
  talentos: text().notNull(),
  // 'en_proceso' | 'aceptada' | 'rechazada'
  estado: text().notNull().default('en_proceso'),
  rechazadaEn: timestamp('rechazada_en', { withTimezone: true }),
  creadaEn: timestamp('creada_en', { withTimezone: true }).notNull().defaultNow(),
})
