import { useState } from 'react'
import { Eye } from 'lucide-react'

import { cn } from '@/lib/utils'
import { Revelar } from './revelar'

const prensa = { fontFamily: 'var(--font-press)' }
const maquina = { fontFamily: 'var(--font-typewriter)' }

function Tachado({ children }: { children: React.ReactNode }) {
  const [abierto, setAbierto] = useState(false)
  return (
    <button
      type="button"
      onClick={() => setAbierto((v) => !v)}
      data-open={abierto}
      aria-label={abierto ? undefined : 'Desclasificar fragmento'}
      className="fs-redacted box-decoration-clone px-1 text-left"
    >
      {children}
    </button>
  )
}

function Columna({ etiqueta, titulo, children, className }: { etiqueta: string; titulo: string; children: React.ReactNode; className?: string }) {
  return (
    <article className={cn('border-t border-[#d9c7a3]/20 pt-5', className)}>
      <p className="text-[0.65rem] tracking-[0.35em] text-blood uppercase brightness-[1.8]" style={maquina}>
        {etiqueta}
      </p>
      <h3 className="mt-2 text-2xl leading-tight text-[#efe3c8]" style={prensa}>
        {titulo}
      </h3>
      <div className="mt-3 space-y-3 leading-relaxed text-[#cfc1a3]">{children}</div>
    </article>
  )
}

export function Intruders() {
  return (
    <section id="intruders" className="relative px-4 py-24 sm:px-6" aria-labelledby="intruders-titulo">
      <Revelar className="mx-auto max-w-content">
        <div className="fs-paper relative border border-[#d9c7a3]/15 p-5 shadow-[0_40px_80px_-30px_rgba(0,0,0,1)] sm:p-10">
          {/* Cabecera del periódico */}
          <header className="border-y-4 border-double border-[#d9c7a3]/40 py-6 text-center">
            <div className="flex flex-wrap items-center justify-between gap-2 text-[0.65rem] tracking-[0.25em] text-[#a8997b] uppercase" style={maquina}>
              <span>Edición nocturna</span>
              <span className="fs-flicker flex items-center gap-1.5 text-blood brightness-[1.8]">
                <span className="size-1.5 rounded-full bg-current" /> Transmisión no autorizada
              </span>
              <span>Precio: tu silencio</span>
            </div>
            <h2 id="intruders-titulo" className="mt-4 text-5xl leading-none text-[#f3e8cf] sm:text-7xl md:text-8xl" style={prensa}>
              The Intruders
            </h2>
            <p className="mt-3 text-lg text-[#b9a985] italic" style={prensa}>
              “Los Intrusos” · El Periódico Escolar que Fire Space no pudo controlar
            </p>
          </header>

          {/* Noticia principal */}
          <div className="grid gap-8 border-b border-[#d9c7a3]/20 py-8 lg:grid-cols-[1.6fr_1fr]">
            <article>
              <p className="text-[0.65rem] tracking-[0.35em] text-blood uppercase brightness-[1.8]" style={maquina}>
                Primera plana
              </p>
              <h3 className="mt-3 text-4xl leading-[1.05] text-[#f3e8cf] sm:text-5xl" style={prensa}>
                “¿De verdad creen que abandonó la academia?”
              </h3>
              <p className="mt-5 text-lg leading-relaxed text-[#cfc1a3] first-letter:float-left first-letter:mr-2 first-letter:text-6xl first-letter:leading-[0.8] first-letter:text-[#f3e8cf]" style={prensa}>
                Al principio nadie le dio importancia. Era una cuenta, un supuesto medio de noticias estudiantiles que
                comenzó publicando cosas insignificantes: un romance, una discusión, una fotografía, una fiesta. Nada que
                Fire Space no pudiera controlar. Hasta que una publicación apareció: una fotografía, un nombre y una
                frase. Fue suficiente.
              </p>
              <p className="mt-4 leading-relaxed text-[#cfc1a3]">
                Desde entonces, el Periódico Escolar comenzó a publicar información que nadie debería tener:{' '}
                <em>documentos, fotografías, conversaciones demasiado privadas, horarios, nombres y ubicaciones.</em>
              </p>
            </article>
            <aside className="flex flex-col justify-between border border-[#d9c7a3]/25 bg-jet/40 p-5">
              <div>
                <p className="text-[0.65rem] tracking-[0.35em] text-[#a8997b] uppercase" style={maquina}>
                  Expuestos hasta la fecha
                </p>
                <ol className="mt-4 space-y-3" style={prensa}>
                  {['Estudiantes', 'Profesores', 'Miembros de la Élite', 'Fire Space'].map((x, i) => (
                    <li key={x} className="flex items-baseline gap-3 text-xl text-[#efe3c8]">
                      <span className="text-sm text-blood brightness-[1.8]">0{i + 1}</span>
                      <span className={i === 3 ? 'italic underline decoration-blood decoration-2 underline-offset-4' : ''}>{x}</span>
                    </li>
                  ))}
                </ol>
              </div>
              <p className="mt-6 text-sm leading-relaxed text-[#b9a985] italic">
                Y cada vez que la academia negaba una publicación… el Periódico Escolar aparecía con una nueva prueba.
              </p>
            </aside>
          </div>

          {/* Columnas */}
          <div className="grid gap-8 pt-8 md:grid-cols-2 lg:grid-cols-3">
            <Columna etiqueta="Archivo filtrado · 01" titulo="Lo que ocurre detrás de las puertas">
              <p>
                El Intruso ha hablado de los Becados, de los pagos, de las desapariciones, de aquellas habitaciones
                restringidas y de los experimentos.
              </p>
              <p style={maquina} className="text-sm">
                <Tachado>Puertas que siempre permanecen cerradas. Laboratorios que oficialmente no existen.</Tachado>
              </p>
              <p className="flex items-center gap-1.5 text-xs text-[#8f8266] italic">
                <Eye className="size-3" /> Pulsa el texto tachado para desclasificarlo.
              </p>
            </Columna>

            <Columna etiqueta="Chismes de pasillo" titulo="¿Quién está detrás?">
              <p>
                Nadie sabe si se trata de una sola persona. Quizá sea un estudiante, quizá un profesor, quizá un antiguo
                Becado, quizá alguien de la Élite… o quizá incluso alguien que jamás debería haber podido entrar en Fire
                Space.
              </p>
              <p>
                No parece querer dinero, no busca reconocimiento, no quiere convertirse en Élite, no pide nada…{' '}
                <strong className="text-[#efe3c8]">simplemente observa y publica.</strong>
              </p>
            </Columna>

            <Columna etiqueta="Investigación · Dirección" titulo="El precio del silencio">
              <p>
                Cuando alguien amenaza con revelar información, Taehyung interviene. Cuando aparece un rumor peligroso,
                desaparece. Cuando una familia empieza a hacer preguntas, recibe una compensación.
              </p>
              <p>
                Cuando un estudiante intenta hablar con la prensa, alguien se encarga de convencerlo de que no lo haga.
                Y cuando alguien intenta manchar públicamente el nombre de Fire Space…{' '}
                <Tachado>simplemente deja de tener importancia dentro de la academia.</Tachado>
              </p>
            </Columna>

            <Columna etiqueta="Confidencial · Kim Taehyung" titulo="El secreto de Taehyung" className="lg:col-span-2">
              <p>
                Taehyung conoce al Periódico Escolar. No simplemente conoce su existencia: conoce a quienes están detrás,
                sabe quién administra la página, sabe cómo obtienen la información, sabe qué documentos poseen y, sobre
                todo… sabe qué están buscando.
              </p>
              <p>
                Porque existe un secreto que incluso Taehyung ha intentado mantener oculto, algo que conecta a la Élite,
                los Becados, los experimentos, las desapariciones y{' '}
                <Tachado>la propia creación de Fire Space.</Tachado>
              </p>
              <blockquote className="border-l-2 border-blood pl-4 text-xl text-[#efe3c8] italic" style={prensa}>
                Si Taehyung sabe quién está detrás del Periódico Escolar… ¿por qué no lo ha detenido?
              </blockquote>
              <p>
                Algunos creen que no puede, otros creen que tiene miedo, y unos pocos sospechan algo todavía peor:{' '}
                <Tachado>que quizá el Periódico Escolar existe porque Taehyung necesita que exista.</Tachado>
              </p>
            </Columna>

            <Columna etiqueta="Nota del Intruso" titulo="Alguien los está entregando">
              <p>
                El Intruso conoce los secretos de todos y no tiene miedo de utilizarlos, pero cuanto más publica, más
                evidente se vuelve algo:
              </p>
              <p className="text-lg text-[#efe3c8] italic" style={prensa}>
                El Periódico Escolar no está descubriendo los secretos, sino que alguien se los está entregando.
              </p>
            </Columna>

            <Columna etiqueta="Editorial" titulo="La reputación">
              <p>
                Dentro de Fire Space, una reputación puede tardar años en construirse, pero puede desaparecer en un solo
                día.
              </p>
              <p>
                Una publicación puede iniciar una discusión, una fotografía puede destruir una relación, un rumor puede
                provocar una rivalidad, una acusación puede provocar una degradación y una verdad puede destruir una vida
                entera.
              </p>
            </Columna>

            <Columna etiqueta="Vigilancia" titulo="Un juego de vigilancia">
              <p>
                Los Académicos intentan descubrir quién administra el Periódico Escolar, los Artistas comienzan a utilizar
                la información como arma, los Deportistas forman alianzas y los estudiantes con inteligencia Personal
                manipulan rumores y relaciones.
              </p>
              <p>Cualquiera puede ser la próxima publicación.</p>
            </Columna>

            <Columna etiqueta="Última hora" titulo="Nadie está mirando hacia abajo">
              <ul className="space-y-1.5" style={maquina}>
                <li className="text-sm">— Nadie está preguntando por los estudiantes que desaparecieron.</li>
                <li className="text-sm">— Nadie está contando cuántos nombres han sido borrados.</li>
                <li className="text-sm">— Nadie sabe cuántas puertas permanecen cerradas.</li>
              </ul>
              <p className="italic">Excepto el Periódico Escolar.</p>
            </Columna>
          </div>

          <footer className="mt-10 border-t-4 border-double border-[#d9c7a3]/40 pt-6 text-center">
            <p className="text-2xl text-[#f3e8cf] italic sm:text-3xl" style={prensa}>
              “Existe algo que nadie puede controlar: la verdad. Y el Periódico Escolar está decidido a encontrarla.”
            </p>
          </footer>
        </div>
      </Revelar>
    </section>
  )
}
