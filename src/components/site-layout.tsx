import { Link } from "@tanstack/react-router";
import { useState } from "react";
import {
  Menu, X, Lightbulb, Facebook, Instagram, Youtube, Phone, Clock, MapPin, ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePageMotion } from "@/hooks/use-page-motion";
import blason from "@/assets/blason.png";

export const NAV_LINKS = [
  { label: "Démarches", to: "/demarches" },
  { label: "Marchés publics", to: "/marches-publics" },
  { label: "Actualités", to: "/actualites" },
  { label: "Découvrir", to: "/decouvrir" },
];

function SiteHeader({ scrolled }: { scrolled: boolean }) {
  const [menu, setMenu] = useState(false);
  return (
    <header className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${scrolled ? "bg-cream/90 shadow-[var(--shadow-soft)] backdrop-blur-xl" : "bg-cream/95 shadow-[var(--shadow-soft)]"}`}>
      <div className="mx-auto grid max-w-7xl grid-cols-[minmax(0,1fr)_auto] items-center gap-4 px-5 py-3 sm:flex">
        <Link to="/" className="flex min-w-0 items-center gap-3">
          <img src={blason} alt="Blason de Tizi Ouzou" width={44} height={52} className="h-11 w-auto shrink-0 drop-shadow sm:h-12" />
          <div className="min-w-0 leading-tight text-night">
            <div className="truncate font-display text-lg font-semibold">APC de Tizi Ouzou</div>
            <div className="text-[9px] uppercase opacity-70 sm:text-[11px]">République Algérienne</div>
          </div>
        </Link>
        <nav className="ms-auto hidden items-center gap-7 text-sm font-semibold text-night lg:flex">
          {NAV_LINKS.map((n) => (
            <Link key={n.to} to={n.to} className="relative after:absolute after:-bottom-1 after:start-0 after:h-0.5 after:w-0 after:bg-saffron after:transition-all hover:after:w-full">
              {n.label}
            </Link>
          ))}
        </nav>
        <Link to="/signaler" className="motion-cta hidden items-center gap-2 rounded-full bg-saffron px-5 py-3 text-sm font-bold text-night transition hover:-translate-y-0.5 hover:shadow-lg sm:flex">
          <Lightbulb className="h-4 w-4" strokeWidth={1.5} /> Je participe
        </Link>
        <Button variant="ghost" size="icon" onClick={() => setMenu(!menu)} className="ms-auto shrink-0 text-night hover:bg-night/5 lg:hidden" aria-label="Menu" aria-expanded={menu}>
          {menu ? <X /> : <Menu />}
        </Button>
      </div>
      {menu && (
        <div className="mobile-menu mx-4 mb-4 rounded-2xl bg-cream p-6 shadow-xl lg:hidden">
          {NAV_LINKS.map((n) => (
            <Link key={n.to} to={n.to} onClick={() => setMenu(false)} className="block border-b border-border py-3 font-display text-xl text-night">
              {n.label}
            </Link>
          ))}
          <Link to="/signaler" onClick={() => setMenu(false)} className="mt-4 flex items-center gap-2 rounded-full bg-saffron px-5 py-3 text-sm font-bold text-night">
            <Lightbulb className="h-4 w-4" strokeWidth={1.5} /> Signaler un problème
          </Link>
        </div>
      )}
    </header>
  );
}

function SiteFooter() {
  return (
    <footer className="bg-night text-cream">
      <div className="kabyle-band" />
      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-16 md:grid-cols-4">
        <div className="md:col-span-2">
          <div className="flex items-center gap-3">
            <img src={blason} alt="" className="h-14 w-auto" loading="lazy" />
            <div className="font-display text-2xl">APC de Tizi Ouzou</div>
          </div>
          <p className="mt-4 max-w-sm text-sm text-cream/70">Assemblée Populaire Communale de Tizi Ouzou — au service des citoyennes et citoyens.</p>
          <div className="mt-6 flex gap-3">
            {[Facebook, Instagram, Youtube].map((I, k) => (
              <a key={k} href="#" className="social-link grid h-11 w-11 place-items-center rounded-full border border-cream/20 transition hover:bg-saffron hover:text-night">
                <I className="h-4 w-4" strokeWidth={1.5} />
              </a>
            ))}
          </div>
        </div>
        <div>
          <div className="font-semibold text-saffron">Liens</div>
          <ul className="mt-3 space-y-2 text-sm text-cream/80">
            {NAV_LINKS.map((n) => (
              <li key={n.to}><Link to={n.to} className="hover:text-saffron">{n.label}</Link></li>
            ))}
            <li><Link to="/signaler" className="hover:text-saffron">Signaler un problème</Link></li>
            <li><Link to="/suivre" className="hover:text-saffron">Suivre ma demande</Link></li>
          </ul>
        </div>
        <div>
          <div className="font-semibold text-saffron">Contact</div>
          <ul className="mt-3 space-y-3 text-sm text-cream/80">
            <li className="flex items-center gap-2"><Phone className="h-4 w-4" strokeWidth={1.5} /> Standard : 026 21 XX XX</li>
            <li className="flex items-center gap-2"><Clock className="h-4 w-4" strokeWidth={1.5} /> Dim–Jeu : 8h00–16h30</li>
            <li className="flex items-center gap-2"><MapPin className="h-4 w-4" strokeWidth={1.5} /> Bd Abane Ramdane, 15000</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-cream/10 py-6 text-center text-xs text-cream/50">© 2026 APC de Tizi Ouzou · ⵣ</div>
    </footer>
  );
}

export function PageLayout({ children, pageTitle }: { children: React.ReactNode; pageTitle: string }) {
  const { pageRef, scrolled } = usePageMotion();
  return (
    <div ref={pageRef} className="page-motion overflow-x-hidden">
      <div className="reading-progress" aria-hidden="true" />
      <SiteHeader scrolled={scrolled} />
      <main className="min-h-screen pt-20">
        <div className="mx-auto max-w-7xl px-5 pt-12">
          <Link to="/" className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-clay hover:text-olive">
            <ArrowRight className="h-4 w-4 rotate-180" /> Retour à l'accueil
          </Link>
          <h1 className="mb-10 font-display text-4xl font-semibold tracking-tight text-night md:text-6xl">{pageTitle}</h1>
        </div>
        {children}
      </main>
      <SiteFooter />
    </div>
  );
}
