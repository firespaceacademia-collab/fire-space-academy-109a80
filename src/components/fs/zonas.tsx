import { useState } from 'react'
import { DoorClosed, Eye, EyeOff, FlaskConical, KeyRound, ScanEye, ShieldAlert, Users } from 'lucide-react'

import { cn } from '@/lib/utils'
import { Encabezado, Revelar } from './revelar'

const PUERTAS = [
  { icono: DoorClosed, texto: 'Puertas que siempre permanecen cerradas' },
  { icono: KeyRound, texto: 'Ascensores que requieren una autorización especial' },
  { icono: ScanEye, texto: 'Pasillos donde las cámaras son diferentes' },
  { icono: ShieldAlert, texto: 'Habitaciones sin nombre' },
  { icono: FlaskConical, texto: 'Laboratorios que oficialmente no existen' },
  { icono: Users, texto: 'Salas donde algunos miembros de la Élite realizan actividades que jamás deberían formar parte de una academia' },
]

const ACTIVIDADES = [
  'Experimentos',
  'Pruebas',
  'Simulaciones',
  'Métodos de castigo',
  'Evaluaciones psicológicas',
  'Pruebas de resistencia',
  'Estudios sobre comportamiento',
]

const RUMORES = [
  { titulo: 'Rumor I', texto: 'Un estudiante de rango superior comenta que los Becados reciben “entrenamientos especiales”.' },
  { titulo: 'Rumor II', texto: 'Otro asegura haber visto a uno entrar a una habitación del edificio administrativo de la que nunca había escuchado hablar.' },
  { titulo: 'Rumor III', texto: 'Alguien dice que existen castigos internos; otro habla de pruebas psicológicas. Y después aparecen historias sobre demostraciones.' },
]

const TEORIAS = [
  'Que se trata de un programa destinado a estudiar los límites humanos.',
  'Que la academia intenta descubrir cuál de los cuatro tipos de inteligencia produce individuos más capaces.',
  'Que Fire Space no está intentando educar a sus estudiantes, sino seleccionarlos.',
]

export function Zonas() {
  const [abiertas, setAbiertas] = useState<Record<number, boolean>>({})

  return (
    <section className="relative overflow-hidden px-4 py-24 sm:px-6" aria-labelledby="zonas-titulo">
      <div className="pointer-events-none absolute inset-0 bg-[repeating-linear-gradient(135deg,transparent_0_40px,rgba(139,0,0,0.035)_40px_80px)]" aria-hidden="true" />
      <div className="relative mx-auto max-w-content">
        <Encabezado id="zonas-titulo" eyebrow="Acceso no autorizado" titulo="Zonas Restringidas">
          <p>Hay lugares dentro de Fire Space que no aparecen en los recorridos para nuevos estudiantes.</p>
        </Encabezado>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {PUERTAS.map((p, i) => (
            <Revelar key={p.texto} retraso={i * 80}>
              <div className="fs-panel group flex h-full items-start gap-4 p-5 transition-colors hover:border-blood/70">
                <p.icono className="mt-0.5 size-6 shrink-0 text-blood brightness-150 transition-transform group-hover:scale-110" />
                <p className="leading-relaxed text-foreground/85">{p.texto}</p>
              </div>
            </Revelar>
          ))}
        </div>

        <Revelar className="mt-8 flex flex-wrap justify-center gap-2">
          {ACTIVIDADES.map((a) => (
            <span key={a} className="bg-blood/15 px-3 py-1.5 font-display text-[0.65rem] tracking-[0.2em] text-foreground/80 uppercase">
              {a}
            </span>
          ))}
        </Revelar>
        <p className="mt-4 text-center text-muted-foreground italic">…y nadie sabe exactamente cuál es el propósito final.</p>

        <div className="mt-20 grid gap-10 lg:grid-cols-2">
          <Revelar>
            <p className="fs-eyebrow">Las demostraciones</p>
            <h3 className="mt-3 font-display text-2xl tracking-[0.1em] uppercase">Al principio son simples rumores</h3>
            <p className="mt-4 text-sm text-muted-foreground">Pulsa cada archivo para desclasificarlo.</p>
            <div className="mt-6 space-y-3">
              {RUMORES.map((r, i) => (
                <button
                  key={r.titulo}
                  type="button"
                  onClick={() => setAbiertas((s) => ({ ...s, [i]: !s[i] }))}
                  aria-expanded={!!abiertas[i]}
                  className="fs-panel flex w-full items-start gap-4 p-5 text-left transition-colors hover:border-gold/40"
                >
                  {abiertas[i] ? <Eye className="mt-1 size-4 shrink-0 text-gold" /> : <EyeOff className="mt-1 size-4 shrink-0 text-muted-foreground" />}
                  <span>
                    <span className="font-display text-[0.65rem] tracking-[0.3em] text-gold uppercase">{r.titulo}</span>
                    <span className="mt-2 block leading-relaxed" style={{ fontFamily: 'var(--font-typewriter)' }}>
                      <span data-open={!!abiertas[i]} className="fs-redacted box-decoration-clone px-1">
                        {r.texto}
                      </span>
                    </span>
                  </span>
                </button>
              ))}
            </div>
            <p className="mt-6 leading-relaxed text-foreground/85">
              Actividades en las que un Becado debe soportar situaciones diseñadas para demostrar algo ante los
              estudiantes de rangos superiores: <em className="text-gold">disciplina, resistencia, obediencia y control.</em>{' '}
              Los nombres cambian dependiendo de quién lo cuente: evaluaciones especiales, programas experimentales,
              pruebas de conducta.
            </p>
          </Revelar>

          <Revelar retraso={150}>
            <div className="fs-panel fs-frame h-full p-6 sm:p-8">
              <p className="fs-eyebrow">Respuesta oficial</p>
              <ul className="mt-5 space-y-2" style={{ fontFamily: 'var(--font-typewriter)' }}>
                {['“Ellos abandonaron el lugar.”', '“Fueron expulsados.”', '“Decidieron marcharse.”'].map((t) => (
                  <li key={t} className="text-lg text-foreground/90">{t}</li>
                ))}
              </ul>
              <p className="mt-6 leading-relaxed text-foreground/85">
                La academia siempre tiene una explicación y nadie puede demostrar lo contrario,{' '}
                <strong className="text-foreground">hasta que un Becado desaparece, después otro y luego otro.</strong>{' '}
                Algunos de esos estudiantes nunca regresan a sus hogares. Sus pertenencias permanecen en Fire Space, sus
                habitaciones siguen ocupadas en los registros y sus nombres desaparecen lentamente de los archivos
                públicos, como si nunca hubieran estado allí.
              </p>
              <div className="mt-8 border-t border-border pt-6">
                <p className="fs-eyebrow text-blood brightness-150">Teorías</p>
                <p className="mt-2 text-sm text-muted-foreground">Quizá ni siquiera todos los Élite lo saben. Algunos creen…</p>
                <ol className="mt-4 space-y-3">
                  {TEORIAS.map((t, i) => (
                    <li key={t} className={cn('flex gap-3 leading-relaxed', i === 2 ? 'text-foreground' : 'text-foreground/80')}>
                      <span className="font-display text-gold">{['I', 'II', 'III'][i]}.</span>
                      <span>{t}</span>
                    </li>
                  ))}
                </ol>
                <p className="mt-5 leading-relaxed text-muted-foreground">
                  Encontrar a los más útiles, los más obedientes, los más inteligentes, los más resistentes.{' '}
                  <span className="text-foreground">Los Becados son los sujetos perfectos,</span> pues nadie los busca,
                  nadie escucha sus quejas y si alguno desaparece… siempre existe una explicación.
                </p>
              </div>
            </div>
          </Revelar>
        </div>
      </div>
    </section>
  )
}
