import { cn } from '@/lib/utils'

// Emblema de Fire Space: escudo con llama y las iniciales FS.
export function Emblema({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 72" className={cn('shrink-0', className)} aria-hidden="true">
      <defs>
        <linearGradient id="fs-oro" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="#f3dc8a" />
          <stop offset="0.5" stopColor="#d4af37" />
          <stop offset="1" stopColor="#7d5f19" />
        </linearGradient>
        <linearGradient id="fs-tinto" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="#a30d0d" />
          <stop offset="1" stopColor="#3d0000" />
        </linearGradient>
      </defs>
      <path
        d="M32 2 L60 12 V36 C60 52 47 63 32 70 C17 63 4 52 4 36 V12 Z"
        fill="url(#fs-tinto)"
        stroke="url(#fs-oro)"
        strokeWidth="2"
      />
      <path
        d="M32 8 L54 16 V36 C54 48 44 57 32 63 C20 57 10 48 10 36 V16 Z"
        fill="none"
        stroke="url(#fs-oro)"
        strokeWidth="0.75"
        opacity="0.6"
      />
      <path
        d="M32 15 C36 22 41 25 40 32 C39.5 36 37 38 35 39 C36 35 34.5 32 32 30 C31.5 34 28 35.5 28 39.5 C25 38 23.5 35 24 31.5 C24.8 25.5 30 22 32 15 Z"
        fill="url(#fs-oro)"
      />
      <text
        x="32"
        y="55"
        textAnchor="middle"
        fontFamily="Cinzel, Georgia, serif"
        fontSize="11"
        fontWeight="700"
        letterSpacing="1.5"
        fill="url(#fs-oro)"
      >
        FS
      </text>
    </svg>
  )
}
