import { useState } from 'react'
import { BookOpen, Crown, Feather, Flame, Lock } from 'lucide-react'

import { cn } from '@/lib/utils'
import { Encabezado, Revelar } from './revelar'

const INTELIGENCIAS = [
  {
    numero: 'I',
    nombre: 'Académica',
    sub: 'Científica · Lógica',
    icono: BookOpen,
    areas: ['Conocimiento', 'Calificaciones', 'Lógica', 'Investigación', 'Memoria', 'Resolución de problemas'],
    texto:
      'Relacionada con el conocimiento, las calificaciones, la lógica, la investigación, la memoria y la capacidad para resolver problemas.',
    credo: 'Los académicos creen que el conocimiento es la base de todo.',
  },
  {
    numero: 'II',
    nombre: 'Artística',
    sub: 'Expresión creativa',
    icono: Feather,
    areas: ['Música', 'Danza', 'Actuación', 'Escritura', 'Pintura', 'Expresión creativa'],
    texto:
      'Representada por la música, la danza, la actuación, la escritura, la pintura y cualquier otra forma de expresión creativa.',
    credo: 'Los artistas consideran que la capacidad de crear es una forma de inteligencia que ningún examen puede medir.',
  },
  {
    numero: 'III',
    nombre: 'Deportiva',
    sub: 'Corporal · Táctica',
    icono: Flame,
    areas: ['Rendimiento físico', 'Resistencia', 'Disciplina', 'Coordinación', 'Estrategia', 'Superar límites'],
    texto:
      'Relacionada con el rendimiento físico, la resistencia, la disciplina, la coordinación, la estrategia y la capacidad de superar los propios límites.',
    credo:
      'Los deportistas defienden que la disciplina y la capacidad de levantarse después de una derrota requieren una inteligencia que las aulas jamás podrán enseñar.',
  },
  {
    numero: 'IV',
    nombre: 'Personal',
    sub: 'Estratégica · Social',
    icono: Crown,
    areas: ['Liderazgo', 'Comunicación', 'Empatía', 'Persuasión', 'Negociación', 'Comprender intenciones'],
    texto:
      'La más completa y peligrosa, quizá la más difícil de medir: relacionada con el liderazgo, la comunicación, la empatía, la persuasión, la negociación y la capacidad de comprender las intenciones de los demás.',
    credo:
      'Quienes destacan personalmente saben que, en un lugar como Fire Space, comprender a las personas puede ser mucho más útil que cualquier calificación.',
    reservada: true,
  },
]

export function Inteligencias() {
  const [activa, setActiva] = useState(0)
  const sel = INTELIGENCIAS[activa]

  return (
    <section className="relative px-4 py-24 sm:px-6" aria-labelledby="inteligencias-titulo">
      <div className="mx-auto max-w-content">
        <Encabezado id="inteligencias-titulo" eyebrow="La Inteligencia" titulo="Las 4 Inteligencias">
          <p>
            Desde el primer día, cada estudiante aprende una de las reglas fundamentales de Fire Space:{' '}
            <em className="text-foreground">no existe una única forma de ser inteligente.</em>
          </p>
        </Encabezado>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {INTELIGENCIAS.map((int, i) => (
            <Revelar key={int.nombre} retraso={i * 100}>
              <button
                type="button"
                aria-pressed={activa === i}
                onClick={() => setActiva(i)}
                className={cn(
                  'fs-panel group relative flex h-full w-full flex-col items-start overflow-hidden p-6 text-left transition-all duration-500 motion-reduce:transition-none',
                  activa === i ? 'border-gold/60 bg-blood/15' : 'hover:border-gold/30',
                )}
              >
                <span className="pointer-events-none absolute -top-4 -right-2 font-display text-8xl font-bold text-gold/[0.06]">
                  {int.numero}
                </span>
                <int.icono className={cn('size-8 transition-colors', activa === i ? 'text-gold' : 'text-gold/60')} />
                <span className="mt-5 font-display text-xl tracking-[0.12em] uppercase">{int.nombre}</span>
                <span className="mt-1 text-sm tracking-wide text-muted-foreground italic">{int.sub}</span>
                {int.reservada && (
                  <span className="mt-4 inline-flex items-center gap-1.5 border border-gold/40 bg-jet/60 px-2 py-1 font-display text-[0.6rem] tracking-[0.2em] text-gold uppercase">
                    <Lock className="size-3" /> Solo Rango 4
                  </span>
                )}
                <span
                  className={cn(
                    'absolute inset-x-0 bottom-0 h-0.5 origin-left bg-gradient-to-r from-blood via-gold to-blood transition-transform duration-500',
                    activa === i ? 'scale-x-100' : 'scale-x-0',
                  )}
                />
              </button>
            </Revelar>
          ))}
        </div>

        <div key={sel.nombre} className="fs-panel fs-frame mt-6 grid animate-in gap-8 p-6 duration-500 fade-in-0 sm:p-10 md:grid-cols-[1.3fr_1fr]">
          <div>
            <p className="fs-eyebrow">Inteligencia {sel.numero}</p>
            <h3 className="mt-3 font-display text-3xl tracking-[0.1em]">La {sel.nombre}</h3>
            <p className="mt-5 text-lg leading-relaxed text-foreground/85">{sel.texto}</p>
            <blockquote className="mt-6 border-l-2 border-blood pl-5 text-lg text-muted-foreground italic">
              {sel.credo}
            </blockquote>
            {sel.reservada && (
              <p className="mt-6 flex items-start gap-3 border border-gold/40 bg-gold/5 p-4 text-foreground">
                <Lock className="mt-1 size-4 shrink-0 text-gold" />
                <span>
                  <strong className="font-display text-sm tracking-[0.15em] text-gold uppercase">Acceso restringido.</strong>{' '}
                  Este tipo de inteligencia está reservada únicamente para los estudiantes que alcanzan el{' '}
                  <strong className="text-gold">Rango 4</strong>. No puede elegirse en la ficha de admisión.
                </span>
              </p>
            )}
          </div>
          <ul className="grid grid-cols-2 content-start gap-2">
            {sel.areas.map((a) => (
              <li key={a} className="border border-border bg-jet/50 px-3 py-3 text-center font-display text-[0.7rem] tracking-[0.15em] text-foreground/80 uppercase">
                {a}
              </li>
            ))}
          </ul>
        </div>

        <Revelar className="mx-auto mt-14 max-w-reading text-center text-lg leading-relaxed text-muted-foreground">
          Oficialmente, Fire Space asegura que las cuatro poseen el mismo valor, que ninguna inteligencia es superior a
          otra y que cada estudiante tiene la posibilidad de encontrar su propio camino.{' '}
          <span className="text-foreground">Pero los estudiantes no parecen estar de acuerdo.</span> Con el paso del
          tiempo, estas cuatro categorías han dejado de ser simples áreas de desarrollo para convertirse en{' '}
          <em className="text-gold">verdaderos grupos.</em>
        </Revelar>
      </div>
    </section>
  )
}
