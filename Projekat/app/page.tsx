import Link from 'next/link';
import {
  Settings,
  Wrench,
  CheckCircle,
  Clock,
  AlertTriangle,
  MapPin,
  BarChart3,
  ArrowRight,
  Shield,
  Zap,
} from 'lucide-react';

type BadgeVariant = 'hitno' | 'u_toku' | 'zavrseno';

// ─── Nav ──────────────────────────────────────────────────────────────────────

function NavBar() {
  return (
    <nav
      className="sticky top-0 z-40 flex items-center justify-between px-5 py-4 sm:px-8 backdrop-blur-sm"
      style={{
        backgroundColor: 'rgba(242, 230, 216, 0.9)',
        borderBottom: '1px solid rgba(204, 182, 142, 0.3)',
      }}
    >
      <div className="flex items-center gap-2.5">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg" style={{ backgroundColor: '#2C444D' }}>
          <Settings className="h-4 w-4 text-white" />
        </div>
        <span className="text-base font-bold tracking-tight" style={{ color: '#1F2A30' }}>
          InterServ
        </span>
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        <Link
          href="/auth/login"
          className="rounded-xl px-4 py-2 text-sm font-semibold transition-colors duration-200 hover:bg-[#CCB68E]/30"
          style={{ color: '#2C444D' }}
        >
          Prijava
        </Link>
        <Link
          href="/auth/registracija"
          className="rounded-xl bg-[#2C444D] px-4 py-2 text-sm font-semibold text-white transition-colors duration-200 hover:bg-[#5A7C83] sm:px-5"
        >
          Registracija
        </Link>
      </div>
    </nav>
  );
}

// ─── Dashboard illustration ───────────────────────────────────────────────────

function StatusBadge({ variant }: { variant: BadgeVariant }) {
  const CONFIG: Record<BadgeVariant, { label: string; color: string; bg: string }> = {
    hitno:    { label: 'Hitno',    color: '#8B4A2B', bg: 'rgba(139,74,43,0.12)' },
    u_toku:   { label: 'U toku',  color: '#5A7C83', bg: 'rgba(90,124,131,0.12)' },
    zavrseno: { label: 'Završeno',color: '#D4B27F', bg: 'rgba(212,178,127,0.18)' },
  };
  const { label, color, bg } = CONFIG[variant];
  return (
    <span className="rounded-full px-2.5 py-0.5 text-xs font-semibold" style={{ backgroundColor: bg, color }}>
      {label}
    </span>
  );
}

function DashboardIllustration() {
  const tasks: { title: string; technician: string; status: BadgeVariant }[] = [
    { title: 'Električni kvar — Objekat A', technician: 'M. Jovanović', status: 'hitno' },
    { title: 'HVAC servis — Zona 3',        technician: 'L. Torić',     status: 'u_toku' },
    { title: 'Vodoinstalaterski — St. 204', technician: 'R. Patel',     status: 'zavrseno' },
    { title: 'Lift — godišnji pregled',     technician: 'S. Kim',       status: 'zavrseno' },
  ];

  return (
    <div className="relative w-full max-w-[520px]">
      <div
        className="pointer-events-none absolute inset-0 -z-10 rounded-3xl opacity-25 blur-3xl"
        style={{ backgroundColor: '#5A7C83' }}
        aria-hidden
      />
      <div className="overflow-hidden rounded-2xl shadow-card-lg">
        <div className="flex items-center gap-1.5 px-4 py-3" style={{ backgroundColor: '#1F2A30' }}>
          <div className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: '#8B4A2B' }} />
          <div className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: '#D4B27F' }} />
          <div className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: '#5A7C83' }} />
          <div
            className="mx-3 flex-1 rounded px-3 py-1 text-xs"
            style={{ backgroundColor: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.3)' }}
          >
            app.interserv.io/dashboard
          </div>
        </div>
        <div className="p-5" style={{ backgroundColor: '#2C444D' }}>
          <div className="mb-4 grid grid-cols-3 gap-3">
            {[
              { value: '24',  label: 'Aktivnih',  color: '#D4B27F' },
              { value: '8',   label: 'Danas',     color: '#CCB68E' },
              { value: '97%', label: 'Na vrijeme',color: '#5A7C83' },
            ].map((s) => (
              <div key={s.label} className="rounded-xl p-3 text-center" style={{ backgroundColor: 'rgba(255,255,255,0.07)' }}>
                <p className="text-xl font-bold" style={{ color: s.color }}>{s.value}</p>
                <p className="text-xs" style={{ color: 'rgba(242,230,216,0.55)' }}>{s.label}</p>
              </div>
            ))}
          </div>
          <div className="rounded-xl p-4" style={{ backgroundColor: 'rgba(255,255,255,0.06)' }}>
            <p className="mb-3 text-xs font-semibold uppercase tracking-widest" style={{ color: 'rgba(204,182,142,0.65)' }}>
              Intervencije
            </p>
            <div className="flex flex-col gap-2.5">
              {tasks.map((task) => (
                <div key={task.title} className="flex items-center justify-between rounded-lg px-3 py-2.5" style={{ backgroundColor: 'rgba(255,255,255,0.05)' }}>
                  <div>
                    <p className="text-xs font-medium" style={{ color: 'rgba(242,230,216,0.9)' }}>{task.title}</p>
                    <p className="text-xs" style={{ color: 'rgba(242,230,216,0.4)' }}>{task.technician}</p>
                  </div>
                  <StatusBadge variant={task.status} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      {/* Floating cards */}
      <div
        className="absolute -right-4 -top-5 animate-float rounded-xl px-4 py-3 shadow-card sm:-right-6"
        style={{ backgroundColor: '#F2E6D8', border: '1px solid rgba(204,182,142,0.5)' }}
      >
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-full" style={{ backgroundColor: '#2C444D' }}>
            <Wrench className="h-3.5 w-3.5 text-white" />
          </div>
          <div>
            <p className="text-xs font-semibold" style={{ color: '#1F2A30' }}>Novi zadatak dodijeljen</p>
            <p className="text-xs" style={{ color: '#6B7C82' }}>HVAC — Nivo 4</p>
          </div>
        </div>
      </div>
      <div
        className="absolute -bottom-4 -left-4 animate-float rounded-xl px-4 py-2.5 shadow-card"
        style={{ backgroundColor: '#F2E6D8', border: '1px solid rgba(204,182,142,0.5)', animationDelay: '1.2s' }}
      >
        <div className="flex items-center gap-2">
          <CheckCircle className="h-4 w-4" style={{ color: '#D4B27F' }} />
          <span className="text-xs font-semibold" style={{ color: '#1F2A30' }}>3 završena danas</span>
        </div>
      </div>
    </div>
  );
}

// ─── Sections ────────────────────────────────────────────────────────────────

function HeroSection() {
  return (
    <section className="container mx-auto flex flex-col items-center gap-12 px-5 py-16 sm:px-8 sm:py-24 lg:flex-row lg:gap-12">
      <div className="flex max-w-xl flex-col gap-6 lg:flex-1">
        <div
          className="w-fit rounded-full px-4 py-1.5 text-xs font-semibold uppercase tracking-wide"
          style={{ backgroundColor: 'rgba(212,178,127,0.2)', color: '#8B4A2B', border: '1px solid rgba(212,178,127,0.4)' }}
        >
          Platforma za upravljanje servisnim intervencijama
        </div>
        <h1 className="text-4xl font-bold leading-[1.1] tracking-tight sm:text-5xl" style={{ color: '#1F2A30' }}>
          Upravljajte servisnim intervencijama{' '}
          <span style={{ color: '#5A7C83' }}>bez haosa</span>
        </h1>
        <p className="text-lg leading-relaxed" style={{ color: '#6B7C82' }}>
          Dodjeljujte zadatke, pratite servisere na terenu i završite svaki posao na vrijeme.
          Jedno mjesto — potpun uvid.
        </p>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/auth/registracija"
            className="inline-flex items-center gap-2 rounded-xl bg-[#2C444D] px-7 py-3.5 text-base font-semibold text-white shadow-card transition-colors duration-200 hover:bg-[#5A7C83] hover:shadow-card-lg"
          >
            Počnite odmah
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            href="#funkcionalnosti"
            className="inline-flex items-center gap-2 rounded-xl border px-7 py-3.5 text-base font-semibold transition-colors duration-200 hover:border-[#5A7C83]"
            style={{ borderColor: '#CCB68E', color: '#2C444D' }}
          >
            Pogledajte demo
          </Link>
        </div>
        <div className="flex items-center gap-4 pt-2">
          <div className="flex -space-x-2">
            {(['#D4B27F', '#5A7C83', '#8B4A2B', '#CCB68E'] as const).map((bg, i) => (
              <div key={i} className="h-8 w-8 rounded-full border-2 border-[#F2E6D8]" style={{ backgroundColor: bg }} />
            ))}
          </div>
          <p className="text-sm" style={{ color: '#6B7C82' }}>
            <span className="font-semibold" style={{ color: '#1F2A30' }}>1.200+</span>{' '}
            kompanija nam vjeruje
          </p>
        </div>
      </div>
      <div className="flex w-full justify-center lg:flex-1">
        <DashboardIllustration />
      </div>
    </section>
  );
}

function FeaturesSection() {
  const features = [
    { Icon: Zap,      title: 'Brza dodjela',             body: 'Dodijelite intervenciju najbližem slobodnom serviseru za nekoliko sekundi.', color: '#D4B27F' },
    { Icon: MapPin,   title: 'Praćenje na terenu',       body: 'Pratite svakog servisera na karti u realnom vremenu. Bez telefonskih provjera.', color: '#5A7C83' },
    { Icon: BarChart3,title: 'Kompletan audit trag',     body: 'Svaka promjena statusa, napomena i materijal — automatski evidentirano.', color: '#2C444D' },
    { Icon: Shield,   title: 'Pristup po ulogama',       body: 'Prikazi za dispečera, servisera i korisnika — svaki prilagođen potrebama.', color: '#8B4A2B' },
    { Icon: Clock,    title: 'Praćenje SLA',             body: 'Dobijte upozorenje prije nego što istekne rok. Uvijek korak ispred.', color: '#D4B27F' },
    { Icon: Wrench,   title: 'Radni nalozi',             body: 'Strukturirani checklisti i evidencija materijala za svaku intervenciju.', color: '#5A7C83' },
  ];

  return (
    <section id="funkcionalnosti" className="py-20" style={{ backgroundColor: 'rgba(199, 184, 164, 0.18)' }}>
      <div className="container mx-auto px-5 sm:px-8">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold tracking-tight" style={{ color: '#1F2A30' }}>
            Sve što vam treba za upravljanje servisnim operacijama
          </h2>
          <p className="mt-3 text-base" style={{ color: '#6B7C82' }}>
            Napravljeno posebno za servisne kompanije — ne generički alat za projekte.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {features.map(({ Icon, title, body, color }) => (
            <div
              key={title}
              className="rounded-2xl p-6 transition-shadow duration-200 hover:shadow-card"
              style={{ backgroundColor: 'rgba(242, 230, 216, 0.6)', border: '1px solid rgba(204, 182, 142, 0.35)' }}
            >
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl" style={{ backgroundColor: `${color}18` }}>
                <Icon className="h-5 w-5" style={{ color }} />
              </div>
              <h3 className="mb-2 font-semibold" style={{ color: '#1F2A30' }}>{title}</h3>
              <p className="text-sm leading-relaxed" style={{ color: '#6B7C82' }}>{body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function StatsStrip() {
  const stats = [
    { value: '98%',    label: 'Intervencija završenih na vrijeme' },
    { value: '4,2×',   label: 'Brža dodjela u odnosu na ručni proces' },
    { value: '1.200+', label: 'Servisnih kompanija' },
    { value: '40.000+',label: 'Upravljanih intervencija' },
  ];
  return (
    <section className="py-14">
      <div className="container mx-auto grid grid-cols-2 gap-8 px-5 sm:px-8 md:grid-cols-4">
        {stats.map(({ value, label }) => (
          <div key={label} className="text-center">
            <p className="text-4xl font-bold" style={{ color: '#2C444D' }}>{value}</p>
            <p className="mt-1 text-sm" style={{ color: '#6B7C82' }}>{label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function CtaSection() {
  return (
    <section className="py-20">
      <div className="container mx-auto px-5 sm:px-8">
        <div
          className="flex flex-col items-center gap-6 rounded-3xl px-6 py-14 text-center shadow-card-lg sm:px-8 sm:py-16"
          style={{
            backgroundColor: '#2C444D',
            backgroundImage: 'radial-gradient(ellipse at 70% 20%, rgba(90,124,131,0.35) 0%, transparent 60%)',
          }}
        >
          <div className="rounded-full px-4 py-1.5 text-xs font-semibold uppercase tracking-wide" style={{ backgroundColor: 'rgba(212,178,127,0.2)', color: '#D4B27F' }}>
            Počnite danas — bez kreditne kartice
          </div>
          <h2 className="max-w-2xl text-3xl font-bold leading-tight text-white sm:text-4xl">
            Spremni da uvedete red u vaše servisne operacije?
          </h2>
          <p className="max-w-lg text-base" style={{ color: 'rgba(242,230,216,0.7)' }}>
            Pridružite se 1.200+ servisnih kompanija koje su zamijenile tabele i telefonske pozive sa InterServ platformom.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link
              href="/auth/registracija"
              className="inline-flex items-center gap-2 rounded-xl bg-[#D4B27F] px-7 py-3.5 text-base font-semibold text-[#1F2A30] transition-colors duration-200 hover:bg-[#CCB68E]"
            >
              Počnite odmah besplatno
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/auth/login"
              className="inline-flex items-center rounded-xl border px-7 py-3.5 text-base font-semibold transition-colors duration-200 hover:border-white/60"
              style={{ borderColor: 'rgba(255,255,255,0.25)', color: 'rgba(242,230,216,0.85)' }}
            >
              Prijava
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer
      className="border-t py-8 text-center text-sm"
      style={{ borderColor: 'rgba(204,182,142,0.3)', color: '#6B7C82' }}
    >
      © {new Date().getFullYear()} InterServ. Napravljeno za teren.
    </footer>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function LandingPage() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F2E6D8' }}>
      <NavBar />
      <HeroSection />
      <StatsStrip />
      <FeaturesSection />
      <CtaSection />
      <Footer />
    </div>
  );
}
