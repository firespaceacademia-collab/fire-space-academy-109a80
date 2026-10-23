# Fire Space Academy · Roleplay

Sitio oficial del roleplay **Fire Space Academy**: una academia privada de élite, oscura e imponente, "donde la excelencia exige el máximo sacrificio". Todo el contenido narrativo sigue estrictamente el lore oficial.

## Secciones

- **Inicio**: portada con el emblema de la academia y el mensaje de bienvenida del Director Kim Taehyung.
- **Historia & Lore**: la imagen pública de Fire Space y la rivalidad entre grupos.
- **Las 4 Inteligencias**: Académica, Artística, Deportiva y Personal (esta última reservada al Rango 4).
- **Jerarquía de Rangos**: Élite, Avanzados (G10), Destacados (G6), Aspirantes (G3), Candidatos (G2) y Becados.
- **Zonas Restringidas / Demostraciones**: rumores desclasificables y teorías.
- **Figuras de Fire Space**: muro de personajes clave.
- **Directorio de Estudiantes**: filtros por inteligencia, rango y nombre; expediente con puntos acumulados y lore completo.
- **The Intruders**: el periódico escolar clandestino.
- **Admisiones**: ficha de ingreso con código único (FS-XXXX) y panel de Solicitudes Pendientes.
- **Oficina de Admisiones**: comprueba el estado de la ficha con el código y, si está aceptada, abre la Recepción Central (WhatsApp).

## Editar contenido a mano (sin IA)

| Qué quieres cambiar | Archivo |
| --- | --- |
| Estudiantes del directorio (nombre, edad, inteligencia, rango, puntos, estado, lore, imagen) | `data/estudiantes.json` |
| Figuras del Muro de Destacados | `data/destacados.json` |
| Enlace de WhatsApp de la Recepción | `data/link.json` |

Cada archivo incluye instrucciones (`_LEEME`) y una `_PLANTILLA` para copiar y pegar. Al guardar los cambios en el repositorio, Netlify vuelve a publicar el sitio.

### Añadir una imagen a un expediente

1. Sube la foto a `public/img/estudiantes/` (por ejemplo `sakuya.jpg`).
2. En `data/estudiantes.json`, escribe `"imagen": "/img/estudiantes/sakuya.jpg"`.
3. También puedes pegar un enlace directo a una imagen: `"imagen": "https://…/foto.jpg"`.

Las imágenes locales se optimizan automáticamente con Netlify Image CDN. Si `imagen` está vacío, se muestra el emblema de la academia.

### Códigos

- Cada postulante recibe un **código único de registro** (ej. `FS-8492`) al enviar su ficha. Lo usa para retirar su solicitud y para entrar en la Oficina de Admisiones.
- El **código de administrador** es `FS-2110`. Sirve para ver fichas completas, aceptar o rechazar. Se valida en el servidor y puede cambiarse sin tocar el código definiendo la variable de entorno `FS_ADMIN_CODE` en Netlify.
- Las fichas rechazadas se eliminan automáticamente 24 horas después.

## Tecnología

- TanStack Start (React 19) con Tailwind CSS 4 y componentes shadcn/ui
- Netlify Database (Postgres) con Drizzle ORM para las solicitudes de admisión
- Netlify Image CDN para las imágenes

## Desarrollo local

```bash
pnpm install
netlify dev
```

Las migraciones de la base de datos están en `netlify/database/migrations/` y Netlify las aplica automáticamente al publicar.
