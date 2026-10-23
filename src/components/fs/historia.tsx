import { Camera, Newspaper, Building2, Swords } from 'lucide-react'

import { Encabezado, Revelar } from './revelar'

const PILARES = [
  {
    icono: Building2,
    titulo: 'Una institución impecable',
    texto:
      'Una academia privada considerada durante años como una de las instituciones educativas más prestigiosas de la ciudad: instalaciones impecables, profesores cuidadosamente seleccionados y estudiantes que son los más prometedores y ejemplares de su generación.',
  },
  {
    icono: Camera,
    titulo: 'Las fotografías',
    texto:
      'Las fotografías de Fire Space muestran pasillos impecables, ceremonias, competencias, presentaciones y estudiantes sonrientes.',
  },
  {
    icono: Newspaper,
    titulo: 'La imagen pública',
    texto:
      'Los periódicos hablan de sus éxitos, las familias sueñan con conseguir una plaza, las empresas buscan relacionarse con sus alumnos y los antiguos estudiantes presumen de haber formado parte de ella.',
  },
  {
    icono: Swords,
    titulo: 'Una guerra silenciosa',
    texto:
      'La rivalidad comenzó como una simple competencia, luego se convirtió en orgullo y finalmente en una guerra silenciosa donde cada grupo quiere demostrar que su inteligencia es la más importante.',
  },
]

export function Historia() {
  return (
    <section id="historia" className="relative px-4 py-24 sm:px-6" aria-labelledby="historia-titulo">
      <div className="mx-auto max-w-content">
        <Encabezado id="historia-titulo" eyebrow="Historia & Lore" titulo="Ese lugar es Fire Space">
          <p>
            Fire Space es, aparentemente, una institución perfecta. Sin embargo,{' '}
            <span className="text-foreground">hay algo que nadie menciona cuando habla de ella.</span>
          </p>
        </Encabezado>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {PILARES.map((p, i) => (
            <Revelar key={p.titulo} retraso={i * 110}>
              <article className="fs-panel group h-full p-6 transition-colors duration-500 hover:border-gold/40">
                <p.icono className="size-7 text-gold transition-transform duration-500 group-hover:-translate-y-1" />
                <h3 className="mt-5 font-display text-base tracking-[0.12em] uppercase">{p.titulo}</h3>
                <p className="mt-3 leading-relaxed text-muted-foreground">{p.texto}</p>
              </article>
            </Revelar>
          ))}
        </div>

        <Revelar className="mx-auto mt-16 max-w-reading text-center">
          <p className="text-xl leading-relaxed text-foreground/85 italic sm:text-2xl">
            “En la Academia no basta con entrar, hay que demostrar que mereces permanecer y, una vez dentro,
            descubrirás que no todos ocupan el mismo lugar.”
          </p>
          <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
            Una competencia deportiva puede aumentar una reputación, una presentación artística puede cambiar la
            percepción de toda la academia, una calificación perfecta puede convertir a alguien en referente, una
            negociación exitosa puede demostrar que la inteligencia personal puede superar incluso a quienes poseen
            los mejores expedientes. Así, poco a poco, la academia convirtió la inteligencia en una competición:{' '}
            <strong className="font-semibold text-gold">no basta con ser bueno, hay que ser mejor que alguien.</strong>
          </p>
        </Revelar>
      </div>
    </section>
  )
}
