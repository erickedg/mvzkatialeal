import * as React from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  MessageCircle,
  ArrowRight,
  Stethoscope,
  Sparkles,
  Scissors,
  HeartPulse,
  FlaskConical,
  Microscope,
  ShieldCheck,
  MapPin,
  Mail,
  Instagram,
  PawPrint,
} from "lucide-react";
import { ShinyButton } from "@/components/ui/shiny-button";
import heroVet from "@/assets/hero-vet.jpg";
import coverageCat from "@/assets/coverage-cat.jpg";
import logo from "@/assets/logo.svg";
import { useInView } from "@/hooks/use-in-view";
import { useScrolled } from "@/hooks/use-scrolled";
import { useActiveSection } from "@/hooks/use-active-section";

const WHATSAPP_URL =
  "https://wa.me/5216561234567?text=Hola%20Dra.%20Katia%2C%20me%20gustar%C3%ADa%20agendar%20una%20visita%20a%20domicilio";
const INSTAGRAM_URL = "https://instagram.com/";
const EMAIL = "contacto@katialealvet.com";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "MVZ. Katia Leal — Veterinaria a Domicilio en Ciudad Juárez" },
      {
        name: "description",
        content:
          "Consultas veterinarias a domicilio para perros y gatos en Ciudad Juárez. Medicina preventiva, dermatología, esterilizaciones, laboratorio y diagnóstico.",
      },
    ],
  }),
  component: Landing,
});

const NAV_LINKS = [
  { href: "#servicios", label: "Servicios" },
  { href: "#proceso", label: "Cómo funciona" },
  { href: "#cobertura", label: "Cobertura" },
  { href: "#contacto", label: "Contacto" },
];

const SECTION_IDS = NAV_LINKS.map((l) => l.href.slice(1));

const SERVICES = [
  {
    icon: ShieldCheck,
    title: "Medicina preventiva",
    desc: "Vacunación, desparasitación y planes de salud anuales para mantener a tu mascota protegida.",
  },
  {
    icon: Stethoscope,
    title: "Consultas generales",
    desc: "Valoración clínica completa en la comodidad de tu hogar, sin estrés ni traslados.",
  },
  {
    icon: Sparkles,
    title: "Consulta dermatológica",
    desc: "Diagnóstico y tratamiento de problemas de piel, alergias y afecciones del pelaje.",
  },
  {
    icon: Scissors,
    title: "Esterilizaciones",
    desc: "Procedimientos quirúrgicos seguros con protocolo de anestesia y seguimiento postoperatorio.",
  },
  {
    icon: HeartPulse,
    title: "Profilaxis dental",
    desc: "Limpieza dental profesional para prevenir enfermedades periodontales y mal aliento.",
  },
  {
    icon: FlaskConical,
    title: "Exámenes de laboratorio",
    desc: "Toma de muestras a domicilio: hematología, química sanguínea, urianálisis y más.",
  },
  {
    icon: Microscope,
    title: "Pruebas diagnósticas",
    desc: "Estudios complementarios para llegar a un diagnóstico preciso y oportuno.",
  },
];

const STEPS = [
  {
    n: "01",
    title: "Escríbeme por WhatsApp",
    desc: "Cuéntame sobre tu mascota, sus síntomas o el motivo de la consulta. Te respondo personalmente.",
  },
  {
    n: "02",
    title: "Agendamos fecha y hora",
    desc: "Coordinamos una visita que se acomode a tu rutina. La agenda se reserva con anticipación.",
  },
  {
    n: "03",
    title: "Atiendo a tu mascota en casa",
    desc: "Llego con el equipo necesario para brindar una consulta tranquila, profesional y sin estrés.",
  },
];

// Decorative line-art doodles echoing the squiggle/contour motifs from the
// brand's business cards. Purely ornamental, kept out of the reading order.
function DoodleWave({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 600 220"
      fill="none"
      aria-hidden="true"
      className={`text-doodle blur-[3px] ${className ?? ""}`}
    >
      <path
        d="M-10,150 C 60,40 130,0 200,60 C 260,110 300,150 360,100 C 430,40 500,10 560,70 C 590,100 605,125 620,115"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

function DoodleArcs({ cx, cy, className }: { cx: number; cy: number; className?: string }) {
  const radii = [40, 75, 110, 145, 180, 215, 250];
  return (
    <svg
      viewBox="0 0 300 300"
      fill="none"
      aria-hidden="true"
      className={`text-doodle blur-[3px] ${className ?? ""}`}
    >
      {radii.map((r) => (
        <circle key={r} cx={cx} cy={cy} r={r} stroke="currentColor" strokeWidth="1" />
      ))}
    </svg>
  );
}

function Landing() {
  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <Nav />
      <Hero />
      <Services />
      <Process />
      <Coverage />
      <Contact />
      <Footer />
    </div>
  );
}

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
        className={`mx-auto max-w-7xl flex items-center justify-between rounded-full transition-all duration-500 ${
          scrolled
            ? "bg-background/60 backdrop-blur-xl backdrop-saturate-200 border border-olive/15 shadow-xl shadow-black/8 px-2 py-2"
            : "border border-transparent px-0 py-0"
        }`}
      >
        <a href="#" className="flex items-center px-4 py-2">
          <img src={logo} alt="MVZ. Katia Leal — Veterinaria a Domicilio" className="size-11" />
        </a>

        <nav className="hidden md:flex items-center gap-1 relative px-1 py-1">
          <span
            aria-hidden="true"
            className="absolute inset-y-0 rounded-full bg-olive/25 transition-all duration-300 ease-[cubic-bezier(0.22,0.61,0.36,1)]"
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
          className="rounded-full bg-olive text-primary-foreground px-5 py-2.5 text-sm font-medium hover:opacity-90 transition flex items-center gap-2"
        >
          <MessageCircle className="size-4" />
          <span className="hidden sm:inline">Agendar</span>
        </a>
      </div>
    </header>
  );
}

function HeroOrb() {
  return (
    <div className="relative size-[600px]">
      <svg
        viewBox="0 0 420 420"
        fill="none"
        aria-hidden="true"
        className="absolute inset-0 size-full"
      >
        <defs>
          <linearGradient id="rg-a" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#5f6b2d" />
            <stop offset="50%" stopColor="#8db59c" />
            <stop offset="100%" stopColor="#5f6b2d" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="rg-b" x1="100%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#8db59c" />
            <stop offset="55%" stopColor="#5f6b2d" />
            <stop offset="100%" stopColor="#8db59c" stopOpacity="0" />
          </linearGradient>
        </defs>
        <circle
          className="ring-outer"
          cx="210"
          cy="210"
          r="205"
          stroke="url(#rg-a)"
          strokeWidth="4"
          strokeDasharray="901 387"
          strokeLinecap="round"
        />
        <circle
          className="ring-mid"
          cx="210"
          cy="210"
          r="187"
          stroke="url(#rg-b)"
          strokeWidth="2.5"
          strokeDasharray="646 529"
          strokeLinecap="round"
        />
        <circle
          className="ring-inner"
          cx="210"
          cy="210"
          r="167"
          stroke="url(#rg-a)"
          strokeWidth="1.5"
          strokeDasharray="472 577"
          strokeLinecap="round"
        />
      </svg>
      <div className="absolute inset-[62px] rounded-full overflow-hidden shadow-2xl ring-4 ring-background">
        <img
          src={heroVet}
          alt="MVZ. Katia Leal atendiendo a una mascota"
          className="size-full object-cover object-top"
        />
      </div>
    </div>
  );
}

function Hero() {
  return (
    <section className="relative min-h-screen pt-32 pb-24 overflow-hidden">
      <DoodleWave className="absolute -top-4 left-0 w-[420px] md:w-[560px] opacity-70" />
      <DoodleArcs cx={0} cy={300} className="absolute bottom-0 left-0 w-64 md:w-80 opacity-60" />

      <div className="relative mx-auto max-w-7xl px-6 grid lg:grid-cols-2 gap-8 items-center min-h-[80vh]">
        <div className="relative z-10 max-w-xl">
          <span className="chip hero-in-left" style={{ animationDelay: "0s" }}>
            <span className="size-1.5 rounded-full bg-accent" />
            Veterinaria a domicilio
          </span>

          <h1
            className="mt-8 font-display text-6xl md:text-7xl lg:text-8xl text-foreground hero-in-left"
            style={{ animationDelay: "0.08s" }}
          >
            Medicina
            <br />
            <span className="font-editorial text-olive">a domicilio.</span>
          </h1>

          <p
            className="mt-8 text-base md:text-lg text-muted-foreground max-w-md leading-relaxed hero-in-left"
            style={{ animationDelay: "0.16s" }}
          >
            Soy la <span className="text-foreground">MVZ. Katia Leal</span>. Brindo atención
            veterinaria para perros y gatos en la tranquilidad de tu hogar — desde medicina
            preventiva hasta dermatología y diagnóstico.
          </p>

          <div
            className="mt-10 flex flex-wrap items-center gap-3 hero-in-left"
            style={{ animationDelay: "0.24s" }}
          >
            <ShinyButton href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer">
              <MessageCircle className="size-4" /> Agendar por WhatsApp
            </ShinyButton>
            <a href="#servicios" className="btn-ghost">
              Ver servicios <ArrowRight className="size-4" />
            </a>
          </div>

          <div
            className="mt-12 flex items-center gap-2 text-sm text-muted-foreground hero-in-left"
            style={{ animationDelay: "0.32s" }}
          >
            <MapPin className="size-4 text-accent" />
            Ciudad Juárez, Chihuahua
          </div>
        </div>

        <div className="hidden lg:flex items-center justify-center hero-in-right">
          <HeroOrb />
        </div>
      </div>
    </section>
  );
}

const ICON_HOVER =
  "transition-transform duration-[350ms] ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover:rotate-[10deg] group-hover:scale-[1.18]";

function Services() {
  const { ref, isInView } = useInView<HTMLDivElement>();
  const visible = isInView ? "is-visible" : "";

  return (
    <section id="servicios" className="relative py-28 md:py-40 px-6">
      <div ref={ref} className="mx-auto max-w-7xl">
        <div className={`grid lg:grid-cols-2 gap-12 items-end mb-16 reveal-item ${visible}`}>
          <div>
            <span className="chip">Servicios</span>
            <h2 className="mt-6 font-display text-5xl md:text-6xl lg:text-7xl">
              Cuidado integral
              <br />
              <span className="font-editorial text-olive">para tu compañero.</span>
            </h2>
          </div>
          <p className="text-muted-foreground text-lg max-w-md lg:justify-self-end leading-relaxed">
            Cada visita está pensada para reducir el estrés de tu mascota y ofrecerte la misma
            calidad de un consultorio, en casa.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-px bg-border rounded-3xl overflow-hidden border border-border">
          {SERVICES.map((s, i) => (
            <article
              key={s.title}
              className={`bg-background p-8 md:p-10 hover:bg-surface/60 transition-colors group reveal-item ${visible}`}
              style={{ animationDelay: `${0.15 + i * 0.13}s` }}
            >
              <s.icon className={`size-7 text-olive ${ICON_HOVER}`} strokeWidth={1.5} />
              <h3 className="mt-8 font-display text-2xl">{s.title}</h3>
              <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{s.desc}</p>
            </article>
          ))}
          {/* Filler card to balance the 7th item */}
          <article
            className={`bg-background p-8 md:p-10 flex flex-col justify-between group reveal-item ${visible}`}
            style={{ animationDelay: `${0.15 + SERVICES.length * 0.13}s` }}
          >
            <PawPrint className={`size-7 text-olive ${ICON_HOVER}`} strokeWidth={1.5} />
            <div>
              <h3 className="font-display text-2xl">¿Necesitas algo más?</h3>
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 inline-flex items-center gap-2 text-sm text-foreground hover:text-olive transition-colors"
              >
                Pregúntame <ArrowRight className="size-4" />
              </a>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}

function Process() {
  const { ref, isInView } = useInView<HTMLDivElement>();
  const visible = isInView ? "is-visible" : "";

  return (
    <section id="proceso" className="relative py-28 md:py-40 px-6 bg-surface/40">
      <div ref={ref} className="mx-auto max-w-7xl">
        <div className={`max-w-2xl mb-20 reveal-item ${visible}`}>
          <span className="chip">Cómo funciona</span>
          <h2 className="mt-6 font-display text-5xl md:text-6xl lg:text-7xl">
            Tres pasos
            <br />
            <span className="font-editorial text-olive">sin complicaciones.</span>
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-10 md:gap-6">
          {STEPS.map((step, i) => (
            <div
              key={step.n}
              className={`relative reveal-item ${visible}`}
              style={{ animationDelay: `${0.15 + i * 0.13}s` }}
            >
              <div className="flex items-baseline gap-4">
                <span
                  className={`font-editorial text-5xl text-accent reveal-num ${visible}`}
                  style={{ animationDelay: `${0.15 + i * 0.13}s` }}
                >
                  {step.n}
                </span>
                {i < STEPS.length - 1 && (
                  <span
                    className={`hidden md:block flex-1 h-px bg-border reveal-line ${visible}`}
                    style={{ animationDelay: `${0.65 + i * 0.4}s` }}
                  />
                )}
              </div>
              <h3 className="mt-8 font-display text-2xl md:text-3xl">{step.title}</h3>
              <p className="mt-3 text-muted-foreground leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Coverage() {
  const { ref, isInView } = useInView<HTMLDivElement>();
  const visible = isInView ? "is-visible" : "";

  return (
    <section id="cobertura" className="relative py-28 md:py-40 px-6">
      <div ref={ref} className="mx-auto max-w-7xl grid lg:grid-cols-2 gap-16 items-center">
        <div
          className={`relative aspect-[4/3] rounded-3xl overflow-hidden border border-border reveal-left ${visible}`}
        >
          <img
            src={coverageCat}
            alt="Gato siendo atendido a domicilio"
            loading="lazy"
            className="size-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background/60 to-transparent" />
        </div>

        <div>
          <span className={`chip reveal-right ${visible}`}>Cobertura</span>
          <h2
            className={`mt-6 font-display text-5xl md:text-6xl lg:text-7xl reveal-right ${visible}`}
            style={{ animationDelay: "0.08s" }}
          >
            Toda Ciudad Juárez,
            <br />
            <span className="font-editorial text-olive">a tu puerta.</span>
          </h2>
          <p
            className={`mt-8 text-muted-foreground text-lg leading-relaxed max-w-md reveal-right ${visible}`}
            style={{ animationDelay: "0.16s" }}
          >
            Atiendo perros y gatos en toda la ciudad. La agenda se reserva con anticipación para
            garantizar el tiempo y la calidad que tu mascota merece.
          </p>

          <ul className="mt-10 space-y-4">
            {[
              "Servicio en toda Ciudad Juárez, Chihuahua",
              "Agenda anticipada para cada visita",
              "Atención exclusiva para perros y gatos",
            ].map((item, i) => (
              <li
                key={item}
                className={`flex items-start gap-3 text-foreground reveal-right ${visible}`}
                style={{ animationDelay: `${0.24 + i * 0.1}s` }}
              >
                <span
                  className={`mt-2 size-1.5 rounded-full bg-accent shrink-0 reveal-dot ${visible}`}
                  style={{ animationDelay: `${0.32 + i * 0.1}s` }}
                />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

function Contact() {
  const { ref, isInView } = useInView<HTMLDivElement>();
  const visible = isInView ? "is-visible" : "";

  return (
    <section id="contacto" className="relative py-28 md:py-40 px-6 bg-surface/40">
      <div ref={ref} className="mx-auto max-w-7xl">
        <div className={`max-w-3xl mb-16 reveal-item ${visible}`}>
          <span className="chip">Contacto</span>
          <h2 className="mt-6 font-display text-5xl md:text-6xl lg:text-7xl">
            Agenda la visita
            <br />
            <span className="font-editorial text-olive">de tu mascota.</span>
          </h2>
        </div>

        <div className="grid lg:grid-cols-5 gap-6">
          {/* WhatsApp + QR */}
          <div
            className={`lg:col-span-3 rounded-3xl border border-border bg-background p-10 md:p-14 flex flex-col md:flex-row items-center gap-10 reveal-item ${visible}`}
            style={{ animationDelay: "0.15s" }}
          >
            <div className="flex-1">
              <h3 className="font-display text-3xl md:text-4xl">WhatsApp</h3>
              <p className="mt-4 text-muted-foreground leading-relaxed">
                La forma más rápida de agendar. Escanea el código o toca el botón para empezar la
                conversación.
              </p>
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-olive mt-8"
              >
                <MessageCircle className="size-4" /> Iniciar conversación
              </a>
            </div>
            <div
              className={`shrink-0 rounded-2xl bg-olive p-4 reveal-pop ${visible}`}
              style={{ animationDelay: "0.4s" }}
            >
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=240x240&margin=0&color=605d33&bgcolor=f6f2e5&data=${encodeURIComponent(WHATSAPP_URL)}`}
                alt="Código QR de WhatsApp"
                width={200}
                height={200}
                loading="lazy"
                className="size-44 md:size-48"
              />
            </div>
          </div>

          {/* Email + Instagram */}
          <div className="lg:col-span-2 grid gap-6">
            <a
              href={`mailto:${EMAIL}`}
              className={`rounded-3xl border border-border bg-background p-8 hover:bg-surface/60 transition-colors group reveal-item ${visible}`}
              style={{ animationDelay: "0.28s" }}
            >
              <Mail className={`size-6 text-olive ${ICON_HOVER}`} strokeWidth={1.5} />
              <div className="mt-6 text-sm text-muted-foreground uppercase tracking-widest">
                Correo
              </div>
              <div className="mt-2 font-display text-xl break-all">{EMAIL}</div>
              <div className="mt-4 inline-flex items-center gap-2 text-sm group-hover:text-olive transition-colors">
                Enviar correo <ArrowRight className="size-4" />
              </div>
            </a>

            <a
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className={`rounded-3xl border border-border bg-background p-8 hover:bg-surface/60 transition-colors group reveal-item ${visible}`}
              style={{ animationDelay: "0.41s" }}
            >
              <Instagram className={`size-6 text-olive ${ICON_HOVER}`} strokeWidth={1.5} />
              <div className="mt-6 text-sm text-muted-foreground uppercase tracking-widest">
                Instagram
              </div>
              <div className="mt-2 font-display text-xl">@katialeal.vet</div>
              <div className="mt-4 inline-flex items-center gap-2 text-sm group-hover:text-olive transition-colors">
                Ver perfil <ArrowRight className="size-4" />
              </div>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="relative px-6 py-16 border-t border-border overflow-hidden">
      <DoodleArcs cx={300} cy={0} className="absolute top-0 right-0 w-56 md:w-72 opacity-50" />

      <div className="relative mx-auto max-w-7xl flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
        <div className="flex items-center gap-5">
          <img src={logo} alt="" className="size-12 shrink-0" />
          <span className="h-12 w-px bg-sage shrink-0" aria-hidden="true" />
          <div>
            <p className="font-serif text-2xl md:text-3xl border-b border-accent/50 pb-1 inline-block">
              MVZ. Katia Leal
            </p>
            <p className="mt-2 font-editorial text-olive">Veterinaria a Domicilio</p>
          </div>
        </div>
        <div className="text-sm text-muted-foreground md:text-right">
          <p>Ciudad Juárez, Chihuahua</p>
          <p className="mt-1">
            © {new Date().getFullYear()} MVZ. Katia Leal. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}
