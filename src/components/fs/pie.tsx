import { Emblema } from './emblema'

export function Pie() {
  return (
    <footer className="border-t border-gold/15 bg-jet px-4 py-12 sm:px-6">
      <div className="mx-auto flex max-w-content flex-col items-center gap-6 text-center">
        <Emblema className="h-12 w-10 opacity-80" />
        <p className="max-w-xl text-sm leading-relaxed text-blood brightness-[1.7] italic">
          Propiedad de la Administración de Fire Space. Los infractores serán sancionados por la Dirección.
        </p>
        <div className="fs-divider w-full max-w-sm" aria-hidden="true">
          <span className="text-xs">✦</span>
        </div>
        <p className="font-display text-[0.65rem] tracking-[0.3em] text-muted-foreground uppercase">
          © {new Date().getFullYear()} Fire Space Academy Roleplay · Todos los derechos reservados
        </p>
      </div>
    </footer>
  )
}
