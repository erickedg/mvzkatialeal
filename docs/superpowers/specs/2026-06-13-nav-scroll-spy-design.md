# Nav: contorno unificado + indicador de sección activa

## Contexto

El landing de MVZ. Katia Leal tiene un nav flotante (`Nav` en `src/routes/index.tsx`)
que, al hacer scroll, muestra un contenedor exterior con borde/fondo translúcido
(`bg-surface/80 backdrop-blur-md border border-border`). El `<nav>` interno que
agrupa los links (Servicios, Cómo funciona, Cobertura, Contacto) también tiene su
propio `bg-surface/70 backdrop-blur-md border border-border rounded-full`, lo que
produce un efecto de "caja dentro de caja" al hacer scroll.

Además, los links de navegación no indican en qué sección de la página está el
usuario mientras hace scroll.

## Objetivos

1. Eliminar el efecto de "caja dentro de caja": un solo contorno visible en el nav,
   tanto con scroll como sin él.
2. Mientras el usuario hace scroll por las secciones (`#servicios`, `#proceso`,
   `#cobertura`, `#contacto`), el link correspondiente en el nav se marca como
   activo con una animación de "pastilla deslizante" detrás del texto.

## No-objetivos

- No se modifica el nav móvil (los links solo son visibles en `md:` y superiores,
  sin cambios aquí).
- No se introducen nuevos colores; se reutiliza la paleta existente
  (`--surface`, `--foreground`, `--muted-foreground`).
- No se toca el botón "Agendar" (CTA con `bg-primary`), que mantiene su estilo
  actual de pastilla sólida.

## Diseño

### 1. Nav unificado

El `<nav>` interno (`src/routes/index.tsx`, componente `Nav`) deja de tener
`bg-surface/70`, `border border-border` y `backdrop-blur-md`. Pasa a ser un
contenedor `relative flex items-center gap-1` sin fondo ni borde propios.

El contenedor exterior (`<div>` con `rounded-full` y estilos condicionados por
`scrolled`) sigue siendo el único que muestra borde/fondo translúcido al hacer
scroll. Resultado: un solo contorno visible en ambos estados de scroll.

### 2. Hook `useActiveSection` (scroll-spy)

Nuevo archivo `src/hooks/use-active-section.tsx`:

- Firma: `useActiveSection(ids: string[]): string | null`
- Para cada id, resuelve el elemento con `document.getElementById(id)`.
- Usa un único `IntersectionObserver` con `rootMargin: "-50% 0px -50% 0px"` y
  `threshold: 0` — una línea imaginaria en el centro vertical del viewport.
- Cuando una sección cruza esa línea (`entry.isIntersecting`), su `id` se guarda
  como sección activa.
- Devuelve `null` mientras ninguna sección ha cruzado la línea (p. ej. estando en
  el Hero, antes de `#servicios`).
- Los ids se derivan de `NAV_LINKS` como constante a nivel de módulo
  (`NAV_LINKS.map(l => l.href.slice(1))`) para mantener una referencia estable
  entre renders.

### 3. Pastilla deslizante

Dentro del `<nav>` (ahora `relative`):

- Cada link (`<a>`) guarda una ref en un array (`linkRefs`).
- Un `<span>` con posicionamiento absoluto (`bg-surface`, `rounded-full`,
  `inset-y-0`) actúa como indicador. Su `left` y `width` se calculan en un
  `useLayoutEffect` a partir de `getBoundingClientRect()` del link activo
  relativo al contenedor `<nav>`.
- Transición vía `transition-all duration-300 ease-[cubic-bezier(0.22,0.61,0.36,1)]`,
  el mismo easing usado en las animaciones `reveal-*` de `styles.css`.
- El link activo cambia su clase de texto de `text-muted-foreground` a
  `text-foreground`; el resto no cambia.
- Si `useActiveSection` devuelve `null`, el indicador se oculta con `opacity-0`
  (sin desplazarse a una posición residual).
- Se recalcula `left`/`width` también en el evento `resize` de `window`, para
  cubrir cambios de layout.

## Edge cases

- **Antes de `#servicios` (Hero visible):** ninguna pastilla visible, ningún link
  resaltado.
- **Resize de ventana:** la pastilla recalcula su posición para no quedar
  desalineada del link activo.
- **Click directo en un link del nav:** el scroll suave (`scroll-behavior: smooth`,
  ya activo en `styles.css`) lleva a la sección; cuando esa sección cruza la línea
  central, la pastilla se desliza hacia ese link de forma animada.

## Testing

- Verificación manual en navegador (dev server): comprobar que
  - el nav no muestra doble contorno con y sin scroll,
  - la pastilla se desliza correctamente entre los 4 links al hacer scroll por
    cada sección,
  - la pastilla desaparece en el Hero y reaparece al llegar a "Servicios",
  - el comportamiento es estable al cambiar el tamaño de la ventana.
