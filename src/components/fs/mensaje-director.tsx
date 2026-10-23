import { Emblema } from './emblema'
import { Revelar } from './revelar'

export function MensajeDirector() {
  return (
    <section id="mensaje" className="relative px-4 py-24 sm:px-6" aria-labelledby="mensaje-titulo">
      <Revelar className="mx-auto max-w-3xl">
        <article className="fs-panel fs-frame px-6 py-12 sm:px-14 sm:py-16">
          <div className="absolute -top-7 left-1/2 -translate-x-1/2 bg-jet px-4">
            <Emblema className="h-14 w-12" />
          </div>
          <p className="fs-eyebrow text-center">Comunicado oficial de la Dirección</p>
          <h2 id="mensaje-titulo" className="mt-4 text-center font-display text-2xl tracking-[0.12em] sm:text-3xl">
            Bienvenido a Fire Space
          </h2>
          <div className="mt-10 space-y-6 text-lg leading-relaxed text-foreground/85 sm:text-xl">
            <p className="first-letter:float-left first-letter:mr-3 first-letter:font-display first-letter:text-6xl first-letter:leading-none first-letter:text-gold">
              Dicen que existe un lugar donde los mejores estudiantes de la ciudad terminan reuniéndose, aquel lugar
              reservado para aquellos que han conseguido destacar por encima de los demás, independientemente de la
              manera en la que hayan decidido hacerlo.
            </p>
            <p>
              Algunos llegan gracias a sus calificaciones, otros por sus habilidades artísticas, otros por su
              rendimiento deportivo. Y pocos simplemente porque poseen algo que resulta imposible de enseñar:{' '}
              <em className="text-gold/90">
                la capacidad de comprender a las personas, influir sobre ellas y abrirse camino incluso en las
                situaciones más difíciles.
              </em>
            </p>
            <p>
              En esta Academia no basta con entrar, hay que demostrar que mereces permanecer. Aquí, tu inteligencia
              puede llevarte a la cima. Tu reputación puede mantenerte allí.
            </p>
            <p className="border-l-2 border-blood pl-5 italic text-foreground">
              La pregunta no es si podrás llegar a la cima. La pregunta es qué estarás dispuesto a perder para
              permanecer en ella.
            </p>
          </div>
          <footer className="mt-12 flex flex-col items-end">
            <span className="text-3xl text-gold/90 italic" style={{ fontFamily: 'var(--font-press)' }}>
              Kim Taehyung
            </span>
            <span className="mt-1 h-px w-48 bg-gradient-to-l from-gold/60 to-transparent" />
            <span className="mt-2 font-display text-[0.65rem] tracking-[0.35em] text-muted-foreground uppercase">
              Director de Fire Space Academy
            </span>
          </footer>
        </article>
      </Revelar>
    </section>
  )
}
