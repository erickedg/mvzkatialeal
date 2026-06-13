# Nav: contorno unificado + indicador de sección activa Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Eliminar el efecto de "caja dentro de caja" en el nav flotante y agregar un indicador animado (pastilla deslizante) que marque la sección activa mientras el usuario hace scroll.

**Architecture:** Un nuevo hook `useActiveSection` (IntersectionObserver con línea central) reporta qué sección está activa. El componente `Nav` en `src/routes/index.tsx` pierde el `border`/`bg`/`backdrop-blur` de su `<nav>` interno (solo el contenedor exterior conserva el contorno al hacer scroll) y agrega una `<span>` absoluta que se desliza (`left`/`width` vía `getBoundingClientRect`/`offsetLeft`/`offsetWidth`) detrás del link de la sección activa.

**Tech Stack:** React 19, TanStack Router/Start, Tailwind CSS v4, TypeScript (strict). Sin framework de tests (proyecto solo tiene `tsc`/`eslint`); verificación mediante type-check + revisión manual en el navegador con `npm run dev`, según lo definido en el spec.

---

## Referencia del spec

`docs/superpowers/specs/2026-06-13-nav-scroll-spy-design.md`

---

### Task 1: Hook `useActiveSection` (scroll-spy)

**Files:**
- Create: `src/hooks/use-active-section.tsx`

- [ ] **Step 1: Crear el hook**

Crear `src/hooks/use-active-section.tsx` con este contenido completo:

```tsx
import * as React from "react";

export function useActiveSection(ids: string[]) {
  const [active, setActive] = React.useState<string | null>(null);
  const idsKey = ids.join(",");

  React.useEffect(() => {
    const sectionIds = idsKey.split(",");
    const elements = sectionIds
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActive(entry.target.id);
          }
        }
      },
      { rootMargin: "-50% 0px -50% 0px", threshold: 0 },
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [idsKey]);

  return active;
}
```

Notas de diseño (del spec):
- `idsKey = ids.join(",")` evita que el efecto se vuelva a ejecutar si el caller
  pasa un array nuevo en cada render (siempre que el contenido sea el mismo).
- `rootMargin: "-50% 0px -50% 0px"` crea una línea de intersección de altura 0 en
  el centro vertical del viewport. La sección que la cruza queda "activa".
- Devuelve `null` mientras ninguna sección ha cruzado esa línea (p. ej. en el Hero).

- [ ] **Step 2: Type-check**

Run: `npx tsc -p tsconfig.json --noEmit`
Expected: sin errores (exit code 0).

- [ ] **Step 3: Commit**

```bash
git add src/hooks/use-active-section.tsx
git commit -m "feat: add useActiveSection scroll-spy hook"
```

---

### Task 2: Nav — contorno unificado + pastilla deslizante

**Files:**
- Modify: `src/routes/index.tsx:1-21` (imports)
- Modify: `src/routes/index.tsx:41-46` (constante `NAV_LINKS`, agregar `SECTION_IDS`)
- Modify: `src/routes/index.tsx:118-159` (componente `Nav`)

- [ ] **Step 1: Agregar imports**

En `src/routes/index.tsx`, la primera línea del archivo es:

```tsx
import { createFileRoute } from "@tanstack/react-router";
```

Cambiar a:

```tsx
import * as React from "react";
import { createFileRoute } from "@tanstack/react-router";
```

Y al final del bloque de imports (después de la línea `import { useScrolled } from "@/hooks/use-scrolled";`), agregar:

```tsx
import { useActiveSection } from "@/hooks/use-active-section";
```

- [ ] **Step 2: Derivar `SECTION_IDS` de `NAV_LINKS`**

Justo después de la definición de `NAV_LINKS`:

```tsx
const NAV_LINKS = [
  { href: "#servicios", label: "Servicios" },
  { href: "#proceso", label: "Cómo funciona" },
  { href: "#cobertura", label: "Cobertura" },
  { href: "#contacto", label: "Contacto" },
];
```

agregar inmediatamente después:

```tsx

const SECTION_IDS = NAV_LINKS.map((l) => l.href.slice(1));
```

- [ ] **Step 3: Reescribir el componente `Nav`**

Reemplazar el componente `Nav` completo (actualmente `src/routes/index.tsx:118-159`):

```tsx
function Nav() {
  const scrolled = useScrolled();

  return (
    <header className="fixed top-4 left-0 right-0 z-50 px-4 nav-in">
      <div
        className={`mx-auto max-w-7xl flex items-center justify-between rounded-full transition-all duration-300 ${
          scrolled
            ? "bg-surface/80 backdrop-blur-md border border-border shadow-lg shadow-black/20 px-2 py-2"
            : "border border-transparent px-0 py-0"
        }`}
      >
        <a href="#" className="flex items-center gap-2 px-4 py-2">
          <Leaf className="size-5 text-accent" strokeWidth={1.75} />
          <span className="font-display text-lg tracking-tight">Katia Leal<span className="text-accent">.</span></span>
        </a>

        <nav className="hidden md:flex items-center gap-1 rounded-full bg-surface/70 backdrop-blur-md border border-border px-2 py-2">
          {NAV_LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="px-4 py-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors rounded-full"
            >
              {l.label}
            </a>
          ))}
        </nav>

        <a
          href={WHATSAPP_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-full bg-primary text-primary-foreground px-5 py-2.5 text-sm font-medium hover:opacity-90 transition flex items-center gap-2"
        >
          <MessageCircle className="size-4" />
          <span className="hidden sm:inline">Agendar</span>
        </a>
      </div>
    </header>
  );
}
```

por:

```tsx
function Nav() {
  const scrolled = useScrolled();
  const activeSection = useActiveSection(SECTION_IDS);
  const linkRefs = React.useRef<(HTMLAnchorElement | null)[]>([]);
  const [indicator, setIndicator] = React.useState<{ left: number; width: number } | null>(null);

  React.useLayoutEffect(() => {
    const activeIndex = SECTION_IDS.indexOf(activeSection ?? "");
    const el = linkRefs.current[activeIndex];
    if (!el) {
      setIndicator(null);
      return;
    }

    const update = () => setIndicator({ left: el.offsetLeft, width: el.offsetWidth });
    update();

    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, [activeSection]);

  return (
    <header className="fixed top-4 left-0 right-0 z-50 px-4 nav-in">
      <div
        className={`mx-auto max-w-7xl flex items-center justify-between rounded-full transition-all duration-300 ${
          scrolled
            ? "bg-surface/80 backdrop-blur-md border border-border shadow-lg shadow-black/20 px-2 py-2"
            : "border border-transparent px-0 py-0"
        }`}
      >
        <a href="#" className="flex items-center gap-2 px-4 py-2">
          <Leaf className="size-5 text-accent" strokeWidth={1.75} />
          <span className="font-display text-lg tracking-tight">Katia Leal<span className="text-accent">.</span></span>
        </a>

        <nav className="hidden md:flex items-center gap-1 relative px-1 py-1">
          <span
            aria-hidden="true"
            className="absolute inset-y-0 rounded-full bg-surface transition-all duration-300 ease-[cubic-bezier(0.22,0.61,0.36,1)]"
            style={
              indicator
                ? { left: indicator.left, width: indicator.width, opacity: 1 }
                : { left: 0, width: 0, opacity: 0 }
            }
          />
          {NAV_LINKS.map((l, i) => (
            <a
              key={l.href}
              ref={(el) => {
                linkRefs.current[i] = el;
              }}
              href={l.href}
              className={`relative z-10 px-4 py-1.5 text-sm transition-colors rounded-full ${
                activeSection === SECTION_IDS[i]
                  ? "text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {l.label}
            </a>
          ))}
        </nav>

        <a
          href={WHATSAPP_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-full bg-primary text-primary-foreground px-5 py-2.5 text-sm font-medium hover:opacity-90 transition flex items-center gap-2"
        >
          <MessageCircle className="size-4" />
          <span className="hidden sm:inline">Agendar</span>
        </a>
      </div>
    </header>
  );
}
```

Cambios clave respecto al original:
- El `<nav>` interno pasa de `rounded-full bg-surface/70 backdrop-blur-md border border-border px-2 py-2` a `relative px-1 py-1` (sin fondo/borde propios → ya no hay "caja dentro de caja").
- Se agrega la `<span>` absoluta que actúa como pastilla deslizante (`bg-surface`, `rounded-full`, transición de `left`/`width`/`opacity`).
- Cada link ahora es `relative z-10` (para quedar por encima de la pastilla) y cambia entre `text-foreground` (activo) y `text-muted-foreground hover:text-foreground` (inactivo).

- [ ] **Step 4: Type-check**

Run: `npx tsc -p tsconfig.json --noEmit`
Expected: sin errores (exit code 0).

- [ ] **Step 5: Lint**

Run: `npm run lint`
Expected: sin errores nuevos relacionados a `src/routes/index.tsx` ni `src/hooks/use-active-section.tsx`.

- [ ] **Step 6: Verificación manual en navegador**

Run: `npm run dev` (deja el servidor corriendo) y abrir la URL indicada (por defecto `http://localhost:3000`).

Verificar con la página cargada:
1. **Sin scroll:** el nav no muestra ningún borde/fondo visible alrededor de los links (ni "pastilla" estática rodeando "Servicios / Cómo funciona / Cobertura / Contacto"); solo el botón "Agendar" mantiene su pastilla sólida.
2. **Con scroll (>8px):** aparece un único contorno translúcido alrededor de todo el nav (logo + links + botón). No debe verse un segundo contorno/fondo alrededor solo de los links.
3. **Indicador activo:** al hacer scroll lentamente por la página, la pastilla (`bg-surface`) se desliza suavemente para quedar detrás de "Servicios" cuando esa sección está centrada en el viewport, luego "Cómo funciona", luego "Cobertura", y finalmente "Contacto". El texto del link activo se ve más claro (`text-foreground`) que los demás (`text-muted-foreground`).
4. **Hero:** mientras la sección Hero (antes de "Servicios") está en el centro del viewport, ningún link está resaltado y la pastilla no es visible.
5. **Resize:** con la página haciendo scroll en una sección intermedia (p. ej. "Cobertura" activa), cambiar el ancho de la ventana del navegador — la pastilla debe permanecer alineada con el link "Cobertura" tras el resize.
6. **Click directo:** hacer click en "Contacto" desde el Hero — la página hace scroll suave hasta `#contacto` y la pastilla se desliza hasta ese link al llegar.

Si algo no coincide, ajustar el código del Step 3 antes de continuar.

- [ ] **Step 7: Commit**

```bash
git add src/routes/index.tsx
git commit -m "feat: unify nav outline and add scroll-spy active indicator"
```
