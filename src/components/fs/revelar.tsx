import { useEffect, useRef, useState } from 'react'

import { cn } from '@/lib/utils'

// Hace aparecer suavemente su contenido cuando entra en pantalla.
export function Revelar({
  children,
  className,
  retraso = 0,
}: {
  children: React.ReactNode
  className?: string
  retraso?: number
}) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entrada]) => {
        if (entrada.isIntersecting) {
          setVisible(true)
          obs.disconnect()
        }
      },
      { threshold: 0.12 },
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      data-visible={visible}
      className={cn('fs-reveal', className)}
      style={{ transitionDelay: `${retraso}ms` }}
    >
      {children}
    </div>
  )
}

export function Encabezado({
  eyebrow,
  titulo,
  children,
  id,
}: {
  eyebrow: string
  titulo: React.ReactNode
  children?: React.ReactNode
  id?: string
}) {
  return (
    <Revelar className="mx-auto mb-12 max-w-reading text-center">
      <p className="fs-eyebrow mb-4">{eyebrow}</p>
      <h2 id={id} className="fs-title">
        {titulo}
      </h2>
      <div className="fs-divider mx-auto mt-6 max-w-xs" aria-hidden="true">
        <span className="text-xs">✦</span>
      </div>
      {children && <div className="mt-6 text-lg leading-relaxed text-muted-foreground">{children}</div>}
    </Revelar>
  )
}
