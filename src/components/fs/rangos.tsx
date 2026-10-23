import { useState } from 'react'

import { cn } from '@/lib/utils'
import { Encabezado, Revelar } from './revelar'

// Ordenados de la cima hacia abajo.
const RANGOS = [
  {
    nombre: 'Élite',
    grado: 'Rango Superior',
    ancho: 'max-w-[18rem]',
    tono: 'from-gold/40 via-gold/15 to-gold/40 border-gold/70 text-gold',
    resumen: 'La cima de Fire Space.',
    texto: [
      'El grupo que todos conocen, el grupo que muchos desean integrar. Los Élite poseen privilegios que los demás estudiantes no tienen: participan en decisiones, supervisan actividades, colaboran con la administración y tienen influencia sobre el funcionamiento de la academia.',
      'Son presentados como el ejemplo perfecto de lo que un estudiante de Fire Space puede llegar a convertirse, pero ellos conocen cosas que los demás no: tienen acceso a lugares restringidos, conocen determinados procedimientos y algunos han descubierto que el verdadero funcionamiento de Fire Space está muy lejos de lo que aparece en los folletos.',
      'No todos los Élite son monstruos, y ese es precisamente el problema: algunos no saben nada, otros sospechan, algunos participan porque creen que forman parte de un programa legítimo, y otros saben exactamente lo que ocurre y han decidido guardar silencio o recibir dinero a cambio de colaborar.',
    ],
  },
  {
    nombre: 'Avanzados',
    grado: 'Grado 10',
    ancho: 'max-w-[24rem]',
    tono: 'from-blood/60 via-blood/25 to-blood/60 border-blood text-foreground',
    resumen: 'Los estudiantes más reconocidos.',
    texto: [
      'Aquí se encuentran algunos de los estudiantes más reconocidos. Estos son referentes: sus nombres son conocidos, sus opiniones tienen peso y sus logros son utilizados como ejemplos.',
      'Pero como todo, la fama tiene un precio, y cuanto más alto llega un estudiante, más personas quieren verlo caer, pues cada error puede costarle mucho más que a los demás.',
    ],
  },
  {
    nombre: 'Destacados',
    grado: 'Grado 6',
    ancho: 'max-w-[30rem]',
    tono: 'from-wine/50 via-wine/20 to-wine/50 border-wine text-foreground',
    resumen: 'No llegaron a Fire Space por casualidad.',
    texto: [
      'Son aquellos que ya han demostrado que no llegaron a Fire Space por casualidad, pues poseen experiencia, reconocimiento y una presencia más fuerte dentro de la academia.',
      'Comienzan a formar alianzas, aparecen en actividades importantes, son constantemente observados por los rangos superiores y empiezan a descubrir que subir resulta mucho más sencillo que mantenerse arriba.',
    ],
  },
  {
    nombre: 'Aspirantes',
    grado: 'Grado 3',
    ancho: 'max-w-[36rem]',
    tono: 'from-coal via-[#2a1414] to-coal border-border text-foreground',
    resumen: 'Los recién llegados.',
    texto: [
      'Son los recién llegados, aquellos estudiantes que todavía no han construido una reputación y que deben demostrar qué pueden aportar, pues para ellos cada actividad representa una oportunidad: una oportunidad para destacar, para ser reconocidos, para comenzar a ascender.',
      'Pero también una oportunidad para convertirse en objetivo, porque cuanto antes alguien demuestra sus capacidades, antes comienza a llamar la atención.',
    ],
  },
  {
    nombre: 'Candidatos',
    grado: 'Grado 2',
    ancho: 'max-w-[42rem]',
    tono: 'from-coal via-[#1f1515] to-coal border-border/80 text-foreground/85',
    resumen: 'Por debajo de los Aspirantes, por encima de los Becados.',
    texto: [
      'Rango de Grado 2, ubicado estratégicamente por debajo de los Aspirantes y por encima de los Becados.',
      'Todos comienzan desde abajo y deben demostrar su valor para avanzar.',
    ],
  },
  {
    nombre: 'Becados',
    grado: 'El último lugar',
    ancho: 'max-w-[48rem]',
    tono: 'from-jet via-[#140c0c] to-jet border-blood/40 text-muted-foreground',
    resumen: 'El lugar del que casi nadie quiere hablar.',
    texto: [
      'Oficialmente, son estudiantes que han perdido suficientes puntos, prestigio o privilegios como para descender por debajo de los rangos establecidos. La academia insiste en que se trata de una etapa temporal, un castigo, una oportunidad para comenzar de nuevo.',
      'Los Becados reciben alojamiento, alimentación y una pequeña remuneración: lo suficiente para mantenerse dentro de la institución, para no abandonar y para sobrevivir, pero no lo suficiente para vivir realmente. Sus privilegios desaparecen, sus opiniones dejan de tener importancia, sus nombres dejan de aparecer en determinados eventos. Y, poco a poco, dejan de ser considerados estudiantes: se convierten en números, recursos, herramientas.',
    ],
    regla: 'Un Becado puede ser utilizado para cosas que un estudiante de rango superior jamás aceptaría.',
  },
]

const CRITERIOS = ['Participación', 'Reputación', 'Logros', 'Conducta', 'Influencia', 'Presencia']

export function Rangos() {
  const [activo, setActivo] = useState(3)
  const sel = RANGOS[activo]

  return (
    <section id="jerarquia" className="relative px-4 py-24 sm:px-6" aria-labelledby="jerarquia-titulo">
      <div className="mx-auto max-w-content">
        <Encabezado id="jerarquia-titulo" eyebrow="El Sistema" titulo="Jerarquía de Rangos">
          <p>
            Fire Space necesita una manera de medir el éxito; por eso existen los rangos. A simple vista el sistema
            parece sencillo, pues <span className="text-foreground">todos comienzan desde abajo</span> y deben
            demostrar su valor para avanzar, pero el rango no depende únicamente de las calificaciones.
          </p>
        </Encabezado>

        <Revelar className="mb-12 flex flex-wrap justify-center gap-2">
          {CRITERIOS.map((c) => (
            <span key={c} className="border border-gold/25 px-3 py-1.5 font-display text-[0.65rem] tracking-[0.2em] text-gold/80 uppercase">
              {c}
            </span>
          ))}
        </Revelar>

        <div className="grid items-start gap-10 lg:grid-cols-[1fr_1fr]">
          <Revelar>
            <ol className="flex flex-col items-center gap-2" aria-label="Rangos de mayor a menor">
              {RANGOS.map((r, i) => (
                <li key={r.nombre} className={cn('w-full', r.ancho)}>
                  <button
                    type="button"
                    onClick={() => setActivo(i)}
                    aria-pressed={activo === i}
                    className={cn(
                      'group flex w-full items-center justify-between border bg-gradient-to-r px-5 py-4 transition-all duration-500 motion-reduce:transition-none',
                      r.tono,
                      activo === i
                        ? 'scale-[1.03] shadow-[0_0_35px_-8px_rgba(212,175,55,0.45)] ring-1 ring-gold/60'
                        : 'opacity-80 hover:opacity-100',
                    )}
                  >
                    <span className="font-display text-sm tracking-[0.25em] uppercase sm:text-base">{r.nombre}</span>
                    <span className="font-display text-[0.6rem] tracking-[0.2em] uppercase opacity-80">{r.grado}</span>
                  </button>
                </li>
              ))}
            </ol>
            <p className="mt-4 text-center text-sm text-muted-foreground italic">Selecciona un rango para leer su expediente.</p>
          </Revelar>

          <div key={sel.nombre} className="fs-panel fs-frame animate-in p-6 duration-500 fade-in-0 slide-in-from-right-4 sm:p-10">
            <p className="fs-eyebrow">{sel.grado}</p>
            <h3 className="mt-3 font-display text-3xl tracking-[0.12em] uppercase">Los {sel.nombre}</h3>
            <p className="mt-2 text-lg text-gold/80 italic">{sel.resumen}</p>
            <div className="mt-6 space-y-4 text-lg leading-relaxed text-foreground/85">
              {sel.texto.map((t) => (
                <p key={t.slice(0, 24)}>{t}</p>
              ))}
            </div>
            {sel.regla && (
              <div className="mt-6 border border-blood/60 bg-blood/10 p-4">
                <p className="font-display text-[0.6rem] tracking-[0.3em] text-blood uppercase brightness-150">
                  La regla que nunca fue escrita
                </p>
                <p className="mt-2 text-base text-foreground" style={{ fontFamily: 'var(--font-typewriter)' }}>
                  “{sel.regla}”
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
