import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { usePageMotion } from "@/hooks/use-page-motion";
import { AnimatedNumber } from "@/components/animated-number";
import { tifinagh } from "@/lib/tifinagh";
import { Button } from "@/components/ui/button";
import {
  Search, AlertTriangle, FileText, Gavel, Newspaper, Compass, PackageSearch,
  ArrowRight, ArrowUpRight, Trash2, Lightbulb, Construction, ScrollText, Trees, MoreHorizontal,
  Download, Phone, Clock, MapPin, Menu, X, Facebook, Instagram, Youtube, Pause, Play,
} from "lucide-react";

import mairie from "@/assets/mairie.jpg";
import statue from "@/assets/statue.jpg";
import genet from "@/assets/genet.png";
import village from "@/assets/tizi_vue.jpg";
import artisanat from "@/assets/artisanat.jpg";
import rue from "@/assets/tizi_centre.jpg";
import sommet from "@/assets/tizi_village.jpg";
import djurdjura from "@/assets/tizi_djurdjura.jpg";
import blason from "@/assets/blason.png";
import pontNuit from "@/assets/pont_nuit.jpg.asset.json";
import monumentSpirale from "@/assets/monument_spirale.jpg.asset.json";
import stade from "@/assets/stade.jpg.asset.json";
import statueNumide from "@/assets/statue_numide_nuit.jpg.asset.json";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "APC de Tizi Ouzou — Site officiel de la commune" },
      { name: "description", content: "Démarches, signalements, actualités, marchés publics et découverte de Tizi Ouzou : le portail officiel de l'APC." },
      { property: "og:title", content: "APC de Tizi Ouzou — Site officiel" },
      { property: "og:description", content: "Bâtir, préserver et partager : le nouveau visage de notre commune. Une commune qui préserve son identité et construit son avenir avec ses citoyens." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

type Lang = "fr" | "ar" | "kab";
const T = {
  fr: { brand: "APC de Tizi Ouzou", nav: ["Démarches", "Marchés publics", "Actualités", "Découvrir"], report: "Signaler un problème", proc: "Faire une démarche",
    kicker: "Assemblée Populaire Communale · ⵜⵉⵣⵉ ⵡⵣⵓ", title1: "Bâtir, préserver et partager :", title2: "le nouveau visage de notre commune.", sub: "Une ville fière de ses racines, tournée vers demain. Ensemble, faisons grandir une Tizi Ouzou plus vivante, plus verte et plus solidaire.", search: "Que cherchez-vous ? Acte de naissance, permis…",
    quick: "Accès rapides", reportT: "Signalez en 2 minutes,", reportT2: "suivez jusqu'à la résolution.", news: "Actualités & agenda", demarches: "Démarches les plus demandées",
    discover: "Que faire à Tizi ?", explore: "Explorer la commune", markets: "Marchés publics", infos: "Infos pratiques" },
  ar: { brand: "بلدية تيزي وزو", nav: ["الإجراءات", "الصفقات العمومية", "الأخبار", "اكتشف"], report: "الإبلاغ عن مشكلة", proc: "القيام بإجراء",
    kicker: "بلدية تيزي وزو · ⵜⵉⵣⵉ ⵡⵣⵓ", title1: "نبني، نحافظ ونشارك :", title2: "الوجه الجديد لبلديتنا.", sub: "مدينة تعتز بجذورها وتتطلع إلى الغد. معًا، نبني تيزي وزو أكثر حيوية وخضرة وتضامنًا.", search: "عمّا تبحث؟ شهادة ميلاد، رخصة…",
    quick: "وصول سريع", reportT: "أبلغ في دقيقتين،", reportT2: "وتابع طلبك حتى الحل.", news: "الأخبار والأجندة", demarches: "الإجراءات الأكثر طلبًا",
    discover: "ماذا تفعل في تيزي؟", explore: "استكشف البلدية", markets: "الصفقات العمومية", infos: "معلومات عملية" },
  kab: { brand: "ⵜⴰⵖⵉⵡⴰⵏⵜ ⵏ ⵜⵉⵣⵉ ⵡⵣⵓ", nav: ["ⵜⵉⴽⵍⵉⵡⵉⵏ", "ⵜⵉⵎⵢⴰⵡⵉⵏ ⵜⵉⵣⵓⵢⴰⵣ", "ⵉⵙⴰⵍⵍⴻⵏ", "ⵉⵙⵙⵉⵏ"], report: "ⵎⵎⴻⵍ ⵓⴳⵓⵔ", proc: "ⴻⴳ ⵜⴰⴽⵍⵉ ⵜⴰⵏⴻⴷⴱⴰⵍⵜ",
    kicker: "ⴰⵙⵇⵇⴰⵎ ⵏ ⵜⵖⵉⵡⴰⵏⵜ · ⵜⵉⵣⵉ ⵡⵣⵓ", title1: "ⵙⴱⴻⴷ, ⵃⵔⴻⵣ, ⴱⴹⵓ :", title2: "ⵓⴷⴻⵎ ⴰⵎⴰⵢⵏⵓ ⵏ ⵜⵖⵉⵡⴰⵏⵜ-ⵏⵏⴻⵖ.", sub: "ⵜⴰⵎⴷⵉⵏⵜ ⵢⴻⵜⵜⵃⴰⵔⴰⴱⴻⵏ ⵖⴻⴼ ⵓⵣⴰⵔ-ⵉⵙ, ⵜⴻⵜⵜⵡⴰⵍⵉ ⵖⴻⵔ ⵓⵣⴻⴽⴽⴰ. ⵙ ⵢⵉⵡⴻⵏ, ⴰⴷ ⵏⴻⵙⵙⴻⵎⵖⴻⵔ ⵜⵉⵣⵉ ⵡⵣⵓ ⵢⴻⵙⵄⴰⵏ ⵜⴰⵎⴻⴷⴷⵓⵔⵜ, ⵜⵉⵣⴻⴳⵣⵉ ⴷ ⵜⵡⵉⵣⵉ.", search: "ⴷ ⴰⵛⵓ ⵜⴻⵜⵜⵏⴰⴷⵉⴹ? ⴰⵔⵔⴰⵜ ⵏ ⵜⵍⴰⵍⵉⵜ, ⵜⵓⵔⴰⴳⵜ…",
    quick: "ⴰⴽⵛⴰⵎ ⵙ ⵜⵖⴰⵡⵍⴰ", reportT: "ⵎⵎⴻⵍ ⵓⴳⵓⵔ ⴷⴻⴳ 2 ⵏ ⵜⵓⵙⴷⵉⴷⵉⵏ,", reportT2: "ⴹⴼⴻⵕ-ⵉⵜ ⴰⵔⵎⴰ ⵢⴻⴼⵔⴰ.", news: "ⵉⵙⴰⵍⵍⴻⵏ ⴷ ⵓⵡⴰⵀⵉⵍ", demarches: "ⵜⵉⴽⵍⵉⵡⵉⵏ ⵜⵉⵏⴻⴷⴱⴰⵍⵉⵏ ⵉ ⵢⴻⵜⵜⵡⴰⵙⵓⵜⵔⴻⵏ ⴰⵟⴰⵙ",
    discover: "ⴷ ⴰⵛⵓ ⴰⵔⴰ ⵜⴻⴳⴳⴻⴹ ⴷⴻⴳ ⵜⵉⵣⵉ?", explore: "ⵉⵙⵙⵉⵏ ⵜⴰⵖⵉⵡⴰⵏⵜ", markets: "ⵜⵉⵎⵢⴰⵡⵉⵏ ⵜⵉⵣⵓⵢⴰⵣ", infos: "ⵜⴰⵍⵖⵓⵜ ⵉⵡⵓⵍⵎⴻⵏ" },
};

const slides = [
  { src: rue, label: "Au cœur de Tizi Ouzou" },
  { src: monumentSpirale.url, label: "Le monument des Martyrs" },
  { src: pontNuit.url, label: "Le pont, jardins allumés" },
  { src: stade.url, label: "Le nouveau stade de Tizi" },
  { src: statueNumide.url, label: "La statue numide, à la nuit tombée" },
];

/** Genêt flower — the site's signature mark */
function Flower({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden>
      <g fill="currentColor"><ellipse cx="32" cy="15" rx="7" ry="12" opacity=".9" transform="rotate(0 32 32)" /><ellipse cx="32" cy="15" rx="7" ry="12" opacity=".9" transform="rotate(72 32 32)" /><ellipse cx="32" cy="15" rx="7" ry="12" opacity=".9" transform="rotate(144 32 32)" /><ellipse cx="32" cy="15" rx="7" ry="12" opacity=".9" transform="rotate(216 32 32)" /><ellipse cx="32" cy="15" rx="7" ry="12" opacity=".9" transform="rotate(288 32 32)" /><circle cx="32" cy="32" r="5" opacity=".55" /></g>
    </svg>
  );
}

function Ornament({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 20" className={className} fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
      <path d="M0 10h40M80 10h40M50 10l10-8 10 8-10 8z" />
      <path d="M44 10l4-4 4 4-4 4zM68 10l4-4 4 4-4 4z" />
    </svg>
  );
}

function SectionTitle({ kicker, title, light }: { kicker: string; title: string; light?: boolean }) {
  return (
    <div className="reveal mb-10">
      <div className={`flex items-center gap-3 text-sm font-semibold uppercase tracking-[0.25em] ${light ? "text-saffron" : "text-clay"}`}>
        <Flower className="h-3 w-3 shrink-0 text-saffron" /> {kicker}
      </div>
      <h2 className={`mt-3 font-display text-4xl font-semibold tracking-tight leading-[1.02] md:text-6xl ${light ? "text-cream" : "text-night"}`}>{title}</h2>
    </div>
  );
}

function Index() {
  const [lang, setLang] = useState<Lang>("fr");
  const [slide, setSlide] = useState(0);
  const [paused, setPaused] = useState(false);
  const { pageRef, scrolled, reducedMotion } = usePageMotion();
  const [menu, setMenu] = useState(false);
  const t = T[lang];
  const tr = (text: string | undefined) => text === undefined ? "" : lang === "kab" ? (tifinagh[text] ?? text) : text;
  useEffect(() => {
    if (paused || reducedMotion) return;
    const id = setInterval(() => {
      if (!document.hidden) setSlide((s) => (s + 1) % slides.length);
    }, 6500);
    return () => clearInterval(id);
  }, [paused, reducedMotion, slide]);
  useEffect(() => {
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
    document.documentElement.lang = lang === "kab" ? "kab-Tfng" : lang;
  }, [lang]);

  return (
    <div ref={pageRef} className="page-motion overflow-x-hidden" data-paused={paused || reducedMotion}>
      <div className="reading-progress" aria-hidden="true" />
      {/* HEADER */}
      <header className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${scrolled ? "bg-cream/90 shadow-[var(--shadow-soft)] backdrop-blur-xl" : "bg-transparent"}`}>
        <div className="mx-auto grid max-w-7xl grid-cols-[minmax(0,1fr)_auto] items-center gap-4 px-5 py-3 sm:flex">
          <a href="#" className="flex min-w-0 items-center gap-3">
            <img src={blason} alt={tr("Blason de Tizi Ouzou")} width={44} height={52} className="h-11 w-auto shrink-0 drop-shadow sm:h-12" />
            <div className={`min-w-0 leading-tight ${scrolled ? "text-night" : "text-cream"}`}>
              <div className="truncate font-display text-lg font-semibold">{t.brand}</div>
              <div className="text-[9px] uppercase opacity-70 sm:text-[11px]">{tr("République Algérienne")}</div>
            </div>
          </a>
          <nav className={`ms-auto hidden items-center gap-7 text-sm font-semibold lg:flex ${scrolled ? "text-night" : "text-cream"}`}>
            {t.nav.map((n) => <a key={n} href="#" className="relative after:absolute after:-bottom-1 after:start-0 after:h-0.5 after:w-0 after:bg-saffron after:transition-all hover:after:w-full">{n}</a>)}
          </nav>
          <div className={`ms-auto hidden items-center rounded-full border p-1 text-xs font-semibold md:flex lg:ms-0 ${scrolled ? "border-border text-night" : "border-cream/40 text-cream"}`}>
            {([["fr", "FR"], ["ar", "العربية"], ["kab", "ⵜⴰⵎⴰⵣⵉⵖⵜ"]] as [Lang, string][]).map(([k, l]) => (
              <button key={k} onClick={() => setLang(k)} className={`rounded-full px-3 py-1.5 transition ${lang === k ? "bg-saffron text-night" : "hover:opacity-70"}`}>{l}</button>
            ))}
          </div>
          <a href="#signaler" className="motion-cta hidden items-center gap-2 rounded-full bg-saffron px-5 py-3 text-sm font-bold text-night transition hover:-translate-y-0.5 hover:shadow-lg sm:flex">
            <AlertTriangle className="h-4 w-4" strokeWidth={1.5} /> {t.report}
          </a>
          <Button variant="ghost" size="icon" onClick={() => setMenu(!menu)} className={`ms-auto shrink-0 hover:bg-cream/10 lg:hidden ${scrolled ? "text-night" : "text-cream"}`} aria-label={tr("Menu")} aria-expanded={menu}>
            {menu ? <X /> : <Menu />}
          </Button>
        </div>
        {menu && (
          <div className="mobile-menu mx-4 mb-4 rounded-2xl bg-cream p-6 shadow-xl lg:hidden">
            {t.nav.map((n) => <a key={n} href="#" className="block border-b border-border py-3 font-display text-xl">{n}</a>)}
            <div className="mt-4 flex gap-2 text-sm">
              {(["fr", "ar", "kab"] as Lang[]).map((k) => <button key={k} onClick={() => setLang(k)} className={`rounded-full px-3 py-2 ${lang === k ? "bg-saffron" : "bg-muted"}`}>{k === "fr" ? "FR" : k === "ar" ? "العربية" : "ⵜⴰⵎⴰⵣⵉⵖⵜ"}</button>)}
            </div>
          </div>
        )}
      </header>

      {/* HERO */}
      <section className="relative overflow-hidden bg-night sm:h-[92svh] sm:min-h-[620px]">
        {slides.map((s, i) => (
          <div key={i} aria-hidden={i !== slide} className={`hero-layer absolute inset-0 transition-opacity duration-[1800ms] ${i === slide ? "opacity-100" : "opacity-0"}`}>
            <img src={s.src} alt={tr(s.label)} key={i === slide ? `on-${slide}` : i} className={`hero-photo h-full w-full object-cover object-top sm:object-center ${i === slide ? "sm:animate-kenburns" : ""}`} width={1920} height={1088} />
          </div>
        ))}
        <div className="absolute inset-0 bg-gradient-to-t from-night via-night/65 to-night/20 sm:via-night/40 sm:to-night/30" />

        <div className="relative z-10 mx-auto flex min-h-[600px] max-w-7xl flex-col justify-end px-5 pt-36 pb-5 sm:h-full sm:min-h-0 sm:pt-28 sm:pb-8">
          <div className="max-w-[280px] animate-rise text-[10px] font-semibold uppercase leading-relaxed text-saffron sm:max-w-none sm:text-xs">{t.kicker}</div>
          <h1 key={`${lang}-${slide}`} className="hero-heading mt-3 max-w-6xl font-display text-[30px] leading-[1.1] text-cream sm:mt-4 sm:text-5xl lg:text-6xl">
            <span className="headline-mask"><span className="headline-line text-balance">{t.title1}</span></span>
            <span className="headline-mask"><span className="headline-line text-balance text-saffron">{t.title2}</span></span>
          </h1>
          <p className="mt-3 max-w-xl animate-rise text-xs leading-relaxed text-cream/85 sm:mt-4 sm:text-base" style={{ animationDelay: ".4s" }}><span className="sm:hidden">{t.sub.split(". ")[0]}.</span><span className="hidden sm:inline">{t.sub}</span></p>
          <div className="mt-5 grid gap-3 animate-rise sm:mt-6 sm:gap-4 lg:grid-cols-[1fr_auto]" style={{ animationDelay: ".5s" }}>
            <label className="flex min-w-0 items-center gap-3 rounded-full bg-cream/95 px-4 py-3 shadow-[var(--shadow-soft)] backdrop-blur focus-within:ring-4 focus-within:ring-saffron/50 sm:px-6 sm:py-4">
              <Search className="h-5 w-5 shrink-0 text-olive" strokeWidth={1.5} />
              <input aria-label={t.search} className="min-w-0 w-full bg-transparent text-base text-night outline-none placeholder:text-muted-foreground" placeholder={t.search} />
            </label>
            <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap sm:gap-3">
              <Button asChild className="motion-cta h-auto min-h-12 whitespace-normal rounded-full bg-saffron px-3 py-2 text-center text-xs font-bold leading-snug text-night hover:bg-saffron/90 sm:px-6 sm:py-4 sm:text-base"><a href="#signaler">{t.report} <ArrowRight className="h-4 w-4 rtl:rotate-180" /></a></Button>
              <Button asChild variant="outline" className="h-auto min-h-12 whitespace-normal rounded-full border-cream/50 bg-transparent px-3 py-2 text-center text-xs font-bold leading-snug text-cream backdrop-blur hover:bg-cream hover:text-night sm:px-6 sm:py-4 sm:text-base"><a href="#demarches">{t.proc}</a></Button>
            </div>
          </div>
          <div className="mt-4 grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 text-cream/80 sm:mt-6 sm:block">
            <div className="flex min-w-0 items-center gap-3 sm:gap-4">
            {slides.map((s, i) => (
              <Button variant="ghost" key={i} onClick={() => setSlide(i)} className="group block h-auto min-w-0 flex-1 rounded-none px-0 py-2 text-start hover:bg-transparent" aria-label={tr(s.label)} aria-pressed={i === slide}>
                <div className="h-0.5 overflow-hidden bg-cream/25">{i === slide && <div key={slide} className="slide-progress h-full bg-saffron" />}</div>
                <div className={`mt-2 hidden text-xs sm:block ${i === slide ? "text-cream" : "opacity-60"}`}>0{i + 1} — {tr(s.label)}</div>
              </Button>
            ))}
            <Button variant="ghost" size="icon" onClick={() => setPaused(!paused)} className="shrink-0 text-cream hover:bg-cream/10 hover:text-cream" aria-label={lang === "kab" ? (paused ? "ⴽⴻⵎⵎⴻⵍ" : "ⵙⴱⴻⴷⴷ") : lang === "ar" ? (paused ? "تشغيل" : "إيقاف مؤقت") : paused ? "Reprendre le diaporama" : "Mettre le diaporama en pause"} aria-pressed={paused} title={lang === "fr" ? (paused ? "Reprendre le diaporama" : "Mettre le diaporama en pause") : undefined}>{paused ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}</Button>
            </div>
            <span className="shrink-0 text-[10px] tabular-nums sm:hidden">0{slide + 1} / 0{slides.length}</span>
          </div>
        </div>
      </section>
      <div className="kabyle-band" />

      {/* QUICK ACCESS – bento */}
      <section className="mx-auto max-w-7xl px-5 py-24">
        <SectionTitle kicker={t.quick} title={tr("Tout ce dont vous avez besoin, en un geste.")} />
        <div className="grid auto-rows-[220px] gap-4 md:grid-cols-4">
          {[
            { t: "Signaler un problème", d: "Voirie, éclairage, propreté", i: AlertTriangle, img: rue, c: "md:col-span-2 md:row-span-2" },
            { t: "Mes démarches", d: "État civil, urbanisme", i: FileText, img: mairie, c: "md:col-span-2" },
            { t: "Marchés publics", d: "Avis & cahiers des charges", i: Gavel, img: null, c: "bg-leaf text-night" },
            { t: "Actualités", d: "La vie de la commune", i: Newspaper, img: null, c: "bg-saffron text-night" },
            { t: "Découvrir Tizi Ouzou", d: "Patrimoine & paysages", i: Compass, img: village, c: "md:col-span-2" },
          ].map((b, k) => (
            <a key={k} href="#" className={`reveal motion-card group relative overflow-hidden rounded-[1.75rem] p-6 ${b.c} ${b.img ? "text-cream" : ""}`} style={{ transitionDelay: `${k * 80}ms` }}>
              {b.img && <><img src={b.img} alt="" loading="lazy" className="absolute inset-0 h-full w-full object-cover transition duration-[1.2s] group-hover:scale-110" /><div className="absolute inset-0 bg-gradient-to-t from-night/90 to-night/10" /></>}
              <div className="relative flex h-full flex-col justify-between">
                <b.i className="h-8 w-8" strokeWidth={1.25} />
                <div>
                  <h3 className="font-display text-2xl md:text-3xl">{tr(b.t)}</h3>
                  <p className="mt-1 text-sm opacity-80">{tr(b.d)}</p>
                </div>
              </div>
              <ArrowUpRight className="absolute end-6 top-6 h-6 w-6 transition group-hover:rotate-45" strokeWidth={1.5} />
            </a>
          ))}
          <div className="reveal relative flex flex-col justify-between overflow-hidden rounded-[1.75rem] bg-night p-6 text-cream md:col-span-2">
            <div className="absolute inset-0 kabyle-dots opacity-20" />
            <PackageSearch className="relative h-8 w-8 text-saffron" strokeWidth={1.25} />
            <div className="relative">
              <h3 className="font-display text-2xl">{tr("Suivre ma demande")}</h3>
              <div className="mt-3 flex gap-2">
                <input placeholder={tr("N° de suivi, ex. TZO-2026-04817")} className="w-full rounded-full bg-cream/10 px-5 py-3 text-sm outline-none ring-1 ring-cream/20 placeholder:text-cream/50 focus:ring-saffron" />
                <button className="rounded-full bg-saffron px-5 font-bold text-night">{tr("OK")}</button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SIGNALER */}
      <section id="signaler" className="relative bg-night py-24 text-cream">
        <div className="mx-auto grid max-w-7xl items-center gap-14 px-5 lg:grid-cols-2">
          <div className="reveal relative">
            <div className="overflow-hidden rounded-t-[12rem] rounded-b-[2rem]">
              <img src={genet} alt={tr("Genêts en fleurs de Kabylie")} loading="lazy" className="aspect-[4/5] w-full object-cover" />
            </div>
            <div className="absolute -bottom-8 -end-4 rounded-3xl bg-saffron p-6 text-night shadow-2xl md:-end-10">
              <div className="font-display text-5xl"><AnimatedNumber value={2} label={tr("2 min")} reducedMotion={reducedMotion} /></div>
              <div className="text-sm font-semibold">{tr("pour signaler")}</div>
            </div>
          </div>
          <div>
            <SectionTitle kicker={t.report} title={`${t.reportT} ${t.reportT2}`} light />
            <div className="grid gap-3 sm:grid-cols-2">
              {[[Trash2, "Propreté"], [Lightbulb, "Éclairage public"], [Construction, "Voirie"], [ScrollText, "État civil"], [Trees, "Espaces verts"], [MoreHorizontal, "Autres"]].map(([I, l], k) => {
                const Icon = I as typeof Trash2;
                return (
                  <button key={k} className="reveal group flex items-center gap-4 rounded-2xl border border-cream/15 p-5 text-start transition hover:border-saffron hover:bg-cream/5" style={{ transitionDelay: `${k * 70}ms` }}>
                    <span className="grid h-12 w-12 place-items-center rounded-full bg-cream/10 transition group-hover:bg-saffron group-hover:text-night"><Icon className="h-5 w-5" strokeWidth={1.5} /></span>
                    <span className="text-lg font-semibold">{tr(l as string)}</span>
                    <ArrowRight className="ms-auto h-4 w-4 opacity-0 transition group-hover:opacity-100 rtl:rotate-180" />
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* MARQUEE */}
      <div className="motion-marquee overflow-hidden border-y border-border bg-cream py-6">
        <div className="flex w-max animate-marquee gap-12 whitespace-nowrap font-display text-4xl font-bold text-night md:text-6xl">
          {Array.from({ length: 2 }).flatMap((_, j) => ["Tizi Ouzou", "✿", "ⵜⵉⵣⵉ ⵡⵣⵓ", "ⵣ", "تيزي وزو", "ⵣ", "Djurdjura", "ⵣ", "Azul fell-awen", "ⵣ"].map((w, i) => <span key={`${j}-${i}`} className={w === "✿" ? "self-center text-lg text-saffron" : w === "ⵣ" ? "text-saffron" : ""}>{tr(w)}</span>))}
        </div>
      </div>

      {/* NEWS */}
      <section className="mx-auto max-w-7xl px-5 py-24">
        <SectionTitle kicker={t.news} title={tr("Ce qui se passe dans votre commune.")} />
        <div className="grid gap-8 lg:grid-cols-[2fr_1fr]">
          <div className="grid gap-6">
            <article className="reveal group relative overflow-hidden rounded-[2rem]">
              <img src={mairie} alt={tr("Hôtel de ville illuminé")} loading="lazy" className="aspect-[16/9] w-full object-cover transition duration-[1.5s] group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-night via-night/30 to-transparent" />
              <div className="relative bg-night p-5 text-cream sm:absolute sm:bottom-0 sm:bg-transparent sm:p-8">
                <span className="rounded-full bg-saffron px-3 py-1 text-xs font-bold text-night">{tr("À la une · 2 nov. 2026")}</span>
                <h3 className="mt-4 max-w-2xl font-display text-2xl sm:text-3xl md:text-5xl">{tr("L'Hôtel de ville s'illumine : la façade historique entièrement restaurée")}</h3>
              </div>
            </article>
            <div className="grid gap-6 sm:grid-cols-2">
              {[{ img: genet, d: "29 oct. 2026", tt: "Campagne de plantation : 2 000 arbres pour les quartiers" }, { img: artisanat, d: "25 oct. 2026", tt: "Salon de l'artisanat kabyle : appel aux exposants" }].map((a, k) => (
                <article key={k} className="reveal group cursor-pointer">
                  <div className="overflow-hidden rounded-[1.5rem]"><img src={a.img} alt="" loading="lazy" className="aspect-[4/3] w-full object-cover transition duration-1000 group-hover:scale-110" /></div>
                  <div className="mt-4 text-xs font-bold uppercase tracking-widest text-clay">{tr(a.d)}</div>
                  <h4 className="mt-1 font-display text-2xl leading-snug group-hover:text-olive">{tr(a.tt)}</h4>
                </article>
              ))}
            </div>
          </div>
          <aside className="reveal rounded-[2rem] bg-secondary p-8">
            <h3 className="font-display text-3xl">{tr("Agenda")}</h3>
            <Flower className="mt-2 h-3 w-3 text-saffron" />
            <ul className="mt-6 divide-y divide-border">
              {[["12", "NOV", "Conseil municipal ouvert au public", "Salle des délibérations"], ["18", "NOV", "Festival de la poterie", "Maison de la culture Mouloud Mammeri"], ["24", "NOV", "Marathon de Tizi Ouzou", "Départ : Stade du 1er Novembre"], ["05", "DÉC", "Journée portes ouvertes de l'état civil", "Hôtel de ville"], ["12", "JAN", "Yennayer 2977 — célébrations", "Place de l'Olivier"]].map(([d, m, tt, l]) => (
                <li key={tt} className="reveal agenda-item group flex gap-5 py-5">
                  <div className="w-14 shrink-0 text-center"><div className="font-display text-4xl leading-none text-clay transition group-hover:text-olive">{d}</div><div className="text-xs font-bold tracking-widest">{tr(m)}</div></div>
                  <div><div className="font-semibold">{tr(tt)}</div><div className="mt-1 flex items-center gap-1 text-sm text-muted-foreground"><MapPin className="h-3.5 w-3.5" strokeWidth={1.5} />{tr(l)}</div></div>
                </li>
              ))}
            </ul>
          </aside>
        </div>
      </section>

      {/* DEMARCHES */}
      <section id="demarches" className="bg-secondary/60 py-24">
        <div className="mx-auto max-w-7xl px-5">
          <SectionTitle kicker={t.proc} title={t.demarches} />
          <div className="grid border-t border-night/15 md:grid-cols-2">
            {["Extrait d'acte de naissance (S12)", "Certificat de résidence", "Fiche familiale d'état civil", "Légalisation de signature", "Permis de construire", "Inscription sur les listes électorales"].map((d, k) => (
              <a key={d} href="#" className="reveal group grid grid-cols-[auto_minmax(0,1fr)] items-center gap-4 border-b border-night/15 py-7 md:odd:pe-10 md:even:ps-10 md:even:border-s">
                <span className="font-display text-xl text-clay">0{k + 1}</span>
                <span className="min-w-0 flex-1 font-display text-2xl transition group-hover:translate-x-2 rtl:group-hover:-translate-x-2">{tr(d)}</span>
                <span className="col-start-2 flex items-center gap-2 text-sm font-bold text-olive">{tr("Voir les étapes")} <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1 rtl:rotate-180" /></span>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* DECOUVRIR */}
      <div className="kabyle-band" />
      <section className="bg-night py-24 text-cream">
        <div className="mx-auto max-w-7xl px-5">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <SectionTitle kicker={tr("Découvrir")} title={t.discover} light />
            <a href="#" className="reveal mb-10 flex items-center gap-2 rounded-full bg-saffron px-6 py-4 font-bold text-night transition hover:-translate-y-1">{t.explore} <ArrowRight className="h-4 w-4 rtl:rotate-180" /></a>
          </div>
          <div className="grid auto-rows-[180px] grid-cols-2 gap-4 md:auto-rows-[220px] md:grid-cols-4">
            {[
              { img: djurdjura, t: "Le Djurdjura", s: "Paysages", c: "col-span-2 row-span-2" },
              { img: statue, t: "Statue monumentale", s: "Monument", c: "row-span-2" },
              { img: mairie, t: "Hôtel de ville", s: "Patrimoine", c: "" },
              { img: artisanat, t: "Poterie & bijoux", s: "Artisanat", c: "row-span-2" },
              { img: sommet, t: "Le Djurdjura au couchant", s: "Montagne", c: "col-span-2 md:col-span-1" },
              { img: genet, t: "Genêts en fleurs", s: "Nature", c: "" },
              { img: rue, t: "Le centre-ville", s: "Vie urbaine", c: "" },
              { img: village, t: "La ville dans sa vallée", s: "Panorama", c: "col-span-2 md:col-span-4" },
            ].map((g, k) => <Tile key={k} {...g} t={tr(g.t)} s={tr(g.s)} delay={k * 60} />)}
          </div>
        </div>
      </section>

      {/* MARCHES */}
      <section className="mx-auto max-w-7xl px-5 py-24">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <SectionTitle kicker={tr("Transparence")} title={t.markets} />
          <a href="#" className="mb-10 font-bold text-olive underline-offset-4 hover:underline">{tr("Voir tous les marchés →")}</a>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {[["AO n°41/2026", "Réhabilitation de l'éclairage public — Nouvelle-Ville", "20 nov. 2026"], ["AO n°39/2026", "Aménagement des espaces verts — Boulevard Stiti", "27 nov. 2026"], ["AO n°38/2026", "Acquisition de bacs de collecte des déchets", "03 déc. 2026"], ["Consultation n°12", "Travaux de voirie — Quartier Les Genêts", "10 déc. 2026"]].map(([n, tt, d], k) => (
            <div key={n} className="reveal group flex items-center gap-5 rounded-[1.5rem] border border-border bg-card p-6 transition hover:-translate-y-1 hover:shadow-[var(--shadow-soft)]" style={{ transitionDelay: `${k * 80}ms` }}>
              <div className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-olive/10 text-olive"><Gavel className="h-6 w-6" strokeWidth={1.25} /></div>
              <div className="min-w-0">
                <div className="text-xs font-bold uppercase tracking-widest text-clay">{tr(n)}</div>
                <div className="mt-1 font-semibold">{tr(tt)}</div>
                <div className="mt-1 text-sm text-muted-foreground">{tr("Date limite :")} {tr(d)}</div>
              </div>
              <button className="ms-auto grid h-12 w-12 shrink-0 place-items-center rounded-full bg-night text-cream transition group-hover:bg-leaf" aria-label={tr("Télécharger")}><Download className="h-5 w-5" strokeWidth={1.5} /></button>
            </div>
          ))}
        </div>
      </section>

      {/* INFOS */}
      <section className="mx-auto max-w-7xl px-5 pb-24">
        <SectionTitle kicker={tr("Contact")} title={t.infos} />
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="reveal space-y-6 rounded-[2rem] bg-leaf p-8 text-night lg:col-span-1">
            <div><div className="flex items-center gap-2 text-night/80 font-bold"><Phone className="h-4 w-4" strokeWidth={1.5} /> {tr("Num\u00e9ros utiles")}</div>
              <ul className="mt-3 space-y-1 text-sm"><li>{tr("Standard APC : 026 21 XX XX")}</li><li>{tr("Protection civile : 14")}</li><li>{tr("Police : 1548")}</li><li>{tr("SAMU : 115")}</li></ul></div>
            <div><div className="flex items-center gap-2 text-night/80 font-bold"><Clock className="h-4 w-4" strokeWidth={1.5} /> {tr("Horaires")}</div>
              <p className="mt-3 text-sm">{tr("Dimanche – Jeudi : 8h00 – 16h30")}<br />{tr("Vendredi & samedi : fermé")}</p></div>
            <div><div className="flex items-center gap-2 text-night/80 font-bold"><MapPin className="h-4 w-4" strokeWidth={1.5} /> {tr("Adresse")}</div>
              <p className="mt-3 text-sm">{tr("Hôtel de ville, Boulevard Abane Ramdane")}<br />{tr("15000 Tizi Ouzou, Algérie")}</p></div>
          </div>
          <div className="reveal overflow-hidden rounded-[2rem] border border-border lg:col-span-2">
            <iframe title={tr("Carte de Tizi Ouzou")} className="h-full min-h-[380px] w-full grayscale-[40%]" loading="lazy" src="https://www.openstreetmap.org/export/embed.html?bbox=4.03%2C36.70%2C4.09%2C36.73&layer=mapnik&marker=36.7169%2C4.0497" />
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-night text-cream">
        <div className="kabyle-band" />
        <div className="mx-auto grid max-w-7xl gap-10 px-5 py-16 md:grid-cols-4">
          <div className="md:col-span-2">
            <div className="flex items-center gap-3"><img src={blason} alt="" className="h-14 w-auto" loading="lazy" /><div className="font-display text-2xl">{t.brand}</div></div>
            <p className="mt-4 max-w-sm text-sm text-cream/70">{tr("Assemblée Populaire Communale de Tizi Ouzou — au service des citoyennes et citoyens.")}</p>
            <div className="mt-6 flex gap-3">{[Facebook, Instagram, Youtube].map((I, k) => <a key={k} href="#" className="social-link grid h-11 w-11 place-items-center rounded-full border border-cream/20 transition hover:bg-saffron hover:text-night"><I className="h-4 w-4" strokeWidth={1.5} /></a>)}</div>
          </div>
          <div><div className="font-semibold text-saffron">{tr("Liens")}</div><ul className="mt-3 space-y-2 text-sm text-cream/80">{t.nav.map((n) => <li key={n}><a href="#" className="hover:text-saffron">{n}</a></li>)}</ul></div>
          <div><div className="font-semibold text-saffron">{tr("Langue")}</div>
            <div className="mt-3 flex flex-wrap gap-2 text-sm">{(["fr", "ar", "kab"] as Lang[]).map((k) => <button key={k} onClick={() => setLang(k)} className={`rounded-full px-3 py-1.5 ${lang === k ? "bg-saffron text-night" : "border border-cream/20"}`}>{k === "fr" ? "FR" : k === "ar" ? "العربية" : "ⵜⴰⵎⴰⵣⵉⵖⵜ"}</button>)}</div>
            <ul className="mt-6 space-y-2 text-sm text-cream/60"><li><a href="#">{tr("Mentions légales")}</a></li><li><a href="#">{tr("Politique de confidentialité")}</a></li></ul>
          </div>
        </div>
        <div className="border-t border-cream/10 py-6 text-center text-xs text-cream/50">{tr("© 2026 APC de Tizi Ouzou · ⵣ")}</div>
      </footer>
    </div>
  );
}

function Tile({ img, t, s, c, delay }: { img: string; t: string; s: string; c: string; delay: number }) {
  return (
    <a href="#" className={`reveal motion-card gallery-tile group relative overflow-hidden rounded-[1.5rem] transition-transform duration-300 ${c}`} style={{ transitionDelay: `${delay}ms` }}>
      <img src={img} alt={t} loading="lazy" className="absolute inset-0 h-full w-full object-cover transition duration-[1.2s] group-hover:scale-110" />
      <div className="absolute inset-0 bg-gradient-to-t from-night/85 via-transparent to-transparent opacity-80 transition group-hover:opacity-100" />
      <div className="gallery-caption absolute bottom-0 p-5">
        <div className="text-[11px] font-bold uppercase tracking-[0.25em] text-saffron">{s}</div>
        <div className="font-display text-xl md:text-2xl">{t}</div>
      </div>
    </a>
  );
}
