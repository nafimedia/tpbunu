import { useEffect, useRef, useState } from "react";
import type { Block, NavItemInput, SiteContent } from "@tpb/contracts";
import { Crest } from "./ui";
import { SearchButton } from "./Search";
import { DriveImage } from "../DriveImage";
import { imageSrcSet } from "../../lib/drive";
import { navigate } from "../../lib/router";

function handleInternal(href: string) {
  if (href.startsWith("/")) {
    navigate(href);
    return true;
  }
  return false;
}

export function Header({
  brand,
  navigation,
  blocks,
  slug,
  onAdmin,
  onDaftar,
}: {
  brand: SiteContent["brand"];
  navigation: NavItemInput[];
  blocks: Block[];
  slug: string;
  onAdmin: () => void;
  onDaftar?: () => void;
}) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState<string | null>(null);
  const [mobile, setMobile] = useState(false);
  const [logoFailed, setLogoFailed] = useState(false);
  const triggers = useRef(new Map<string, HTMLButtonElement>());
  useEffect(() => setLogoFailed(false), [brand.logoUrl]);
  useEffect(() => { const onScroll = () => setScrolled(window.scrollY > 24); onScroll(); window.addEventListener("scroll", onScroll, { passive: true }); return () => window.removeEventListener("scroll", onScroll); }, []);
  useEffect(() => {
    if (open === null) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      triggers.current.get(open)?.focus();
      setOpen(null);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open]);

  const linkClass = "rounded-full px-3.5 py-2 text-[13px] font-semibold text-white/85 transition hover:bg-white/10 hover:text-white active:scale-95";

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <div className={`transition-all duration-300 ${scrolled ? "bg-midnight/95 backdrop-blur-2xl shadow-[0_10px_40px_-15px_rgba(0,0,0,0.8)] border-b border-white/10" : "bg-midnight/80 backdrop-blur-xl border-b border-white/10 shadow-sm"}`}>
        <div className="mx-auto flex max-w-[1360px] items-center justify-between gap-3 px-4 py-2.5 sm:px-5 sm:py-3 lg:px-10">
          <a href="/" onClick={(event) => { if (handleInternal("/")) event.preventDefault(); }} className="group flex min-w-0 items-center gap-2.5 sm:gap-3">
            {brand.logoUrl && !logoFailed ? (
              <DriveImage src={brand.logoUrl} alt={`${brand.name} logo`} className="h-9 w-9 sm:h-11 sm:w-11 shrink-0 object-contain drop-shadow-sm transition group-hover:scale-105" onError={() => setLogoFailed(true)} />
            ) : (
              <Crest className="h-9 w-9 sm:h-11 sm:w-11 shrink-0 drop-shadow-sm transition group-hover:scale-105" />
            )}
            <span className="min-w-0 leading-none">
              <span className="block truncate font-mono text-[8.5px] sm:text-[9.5px] font-bold uppercase tracking-[0.2em] sm:tracking-[0.25em] text-gold">{brand.kicker}</span>
              <span className="block truncate font-display text-[14px] sm:text-[16px] font-extrabold leading-tight text-white transition group-hover:text-gold-light">{brand.name}</span>
              <span className="block truncate text-[9px] sm:text-[10px] font-medium uppercase tracking-[0.14em] sm:tracking-[0.18em] text-white/70">{brand.org}</span>
            </span>
          </a>

          <nav className="ml-auto hidden items-center gap-1 xl:flex" onMouseLeave={() => setOpen(null)}>
            {navigation.map((item) => (
              <div key={`${item.label}-${item.href}`} className="relative" onPointerEnter={(event) => { if (event.pointerType !== "touch") setOpen(item.label); }}>
                {item.children?.length ? (
                  <button
                    ref={(node) => { if (node) triggers.current.set(item.label, node); else triggers.current.delete(item.label); }}
                    type="button"
                    aria-expanded={open === item.label}
                    onClick={() => setOpen((current) => (current === item.label ? null : item.label))}
                    className={`${linkClass} ${open === item.label ? "bg-white/10 text-white" : ""}`}
                  >
                    {item.label}
                    <span className="ml-1 text-[10px] opacity-70" aria-hidden="true">▾</span>
                  </button>
                ) : (
                  <a href={item.href} onClick={(event) => { if (handleInternal(item.href)) event.preventDefault(); }} className={linkClass}>{item.label}</a>
                )}
                {item.children?.length && open === item.label ? (
                  <div className="absolute left-1/2 top-full mt-2 w-56 -translate-x-1/2 rounded-2xl border border-white/15 bg-midnight/95 backdrop-blur-2xl p-2 shadow-2xl">
                    {item.children.map((child) => (
                      <div key={`${child.label}-${child.href}`}>
                        <a href={child.href} target={child.openInNewTab ? "_blank" : undefined} rel={child.openInNewTab ? "noopener noreferrer" : undefined} onClick={(event) => { if (handleInternal(child.href)) event.preventDefault(); }} className="block rounded-xl px-3.5 py-2 text-sm text-white/80 hover:bg-white/10 hover:text-white">{child.label}</a>
                        {child.children?.length ? <div className="ml-3 border-l border-white/15 pl-2">{child.children.map((grand) => <a key={`${grand.label}-${grand.href}`} href={grand.href} target={grand.openInNewTab ? "_blank" : undefined} rel={grand.openInNewTab ? "noopener noreferrer" : undefined} onClick={(event) => { if (handleInternal(grand.href)) event.preventDefault(); }} className="block rounded-lg px-3 py-1.5 text-xs text-white/60 hover:bg-white/10 hover:text-white">{grand.label}</a>)}</div> : null}
                      </div>
                    ))}
                  </div>
                ) : null}
              </div>
            ))}
            <div className="ml-1.5 flex items-center gap-2">
              <SearchButton blocks={blocks} navigation={navigation} slug={slug} />
              {onDaftar && (
                <button onClick={onDaftar} className="rounded-full bg-gold px-4 py-2 text-[12px] font-extrabold text-midnight transition hover:bg-gold-light active:scale-95 shadow-sm">
                  Daftar PMB
                </button>
              )}
              <button onClick={onAdmin} title="Panel Admin" className="rounded-full border border-white/20 bg-white/5 px-3 py-1.5 text-[11px] font-medium text-white/70 transition hover:bg-white/15 hover:text-white">
                Admin
              </button>
            </div>
          </nav>

          <div className="ml-auto flex shrink-0 items-center gap-1.5 sm:gap-2 xl:hidden">
            <SearchButton blocks={blocks} navigation={navigation} slug={slug} compact />
            {onDaftar && (
              <button onClick={onDaftar} className="rounded-full bg-gold px-3 py-1.5 text-[11px] font-extrabold text-midnight transition hover:bg-gold-light active:scale-95 shadow-sm">
                PMB
              </button>
            )}
            <button onClick={() => setMobile((v) => !v)} aria-label="Menu" aria-expanded={mobile} className="rounded-full border border-white/20 bg-white/10 backdrop-blur-md px-3 py-1.5 text-xs font-bold text-white shadow-sm hover:bg-white/20 transition">
              ☰
            </button>
          </div>
        </div>

        {mobile && (
          <div className="mx-4 mb-3 max-h-[calc(100vh-80px)] overflow-y-auto rounded-2xl border border-white/15 bg-midnight/95 backdrop-blur-2xl p-4 shadow-2xl xl:hidden">
            {navigation.map((item) => (
              <div key={`${item.label}-${item.href}`} className="border-b border-white/5 last:border-0 py-1">
                <a href={item.href} onClick={(event) => { setMobile(false); if (handleInternal(item.href)) event.preventDefault(); }} className="block rounded-xl px-3 py-2 text-sm font-bold text-white/90 hover:bg-white/10">{item.label}</a>
                {item.children?.map((child) => (
                  <a key={`${child.label}-${child.href}`} href={child.href} onClick={(event) => { setMobile(false); if (handleInternal(child.href)) event.preventDefault(); }} className="block rounded-xl px-6 py-1.5 text-xs text-white/65 hover:bg-white/10 hover:text-white">{child.label}</a>
                ))}
              </div>
            ))}
            {onDaftar && (
              <button onClick={() => { setMobile(false); onDaftar(); }} className="mt-3 w-full rounded-xl bg-gold py-2.5 text-sm font-extrabold text-midnight hover:bg-gold-light transition active:scale-95">
                Pendaftaran PMB
              </button>
            )}
            <button onClick={() => { setMobile(false); onAdmin(); }} className="mt-2 w-full rounded-xl border border-white/15 bg-white/5 py-2 text-xs font-semibold text-white/70 hover:bg-white/10">
              Panel Admin
            </button>
          </div>
        )}
      </div>
    </header>
  );
}

export function Hero({ hero, onDaftar, anchor = "top" }: { hero: SiteContent["hero"]; onDaftar: () => void; anchor?: string }) {
  const bgImage = hero.image || "/images/hero-banner.jpg";
  return (
    <section id={anchor} className="relative min-h-[100svh] min-h-screen scroll-mt-24 overflow-hidden bg-midnight">
      <div className="absolute inset-0">
        <DriveImage
          src={bgImage}
          alt="Gedung Kampus Universitas Nahdlatul Ulama Purwokerto"
          className="h-full w-full object-cover object-[center_35%] sm:object-center opacity-45 sm:opacity-50 transition-opacity duration-700"
          loading="eager"
          fetchPriority="high"
          sizes="100vw"
          srcSet={bgImage ? imageSrcSet(bgImage) : undefined}
          width={1920}
          height={1080}
        />
        {/* Layer gradien responsif: vertikal pada layar HP/tablet, horizontal pada layar desktop besar */}
        <div className="absolute inset-0 bg-gradient-to-t from-midnight via-midnight/80 to-midnight/60 lg:bg-gradient-to-r lg:from-midnight lg:via-midnight/80 lg:to-midnight/25" />
      </div>
      <div className="relative mx-auto flex min-h-[100svh] min-h-screen max-w-[1360px] items-center px-4 pb-14 pt-24 sm:px-5 sm:pb-20 sm:pt-32 lg:px-10">
        <div className="max-w-3xl text-white">
          <span className="reveal inline-flex max-w-full rounded-full border border-gold/50 bg-gold/10 px-3 py-1.5 sm:px-3.5 font-mono text-[10px] sm:text-xs uppercase tracking-[0.16em] sm:tracking-[0.22em] text-gold backdrop-blur-sm">
            <span className="truncate">{hero.badge}</span>
          </span>
          <h1 className="reveal mt-4 sm:mt-7 font-display text-3xl sm:text-5xl md:text-6xl lg:text-8xl font-extrabold leading-[1.08] sm:leading-[0.95] break-words">
            {hero.line1}<br />
            <span className="text-gold">{hero.highlight}</span><br />
            {hero.line2}
          </h1>
          <p className="reveal mt-4 sm:mt-7 max-w-xl text-sm sm:text-base leading-relaxed text-white/80 lg:text-lg break-words">
            {hero.subtitle}
          </p>
          <div className="reveal mt-7 sm:mt-9 flex flex-wrap gap-2.5 sm:gap-3">
            <button
              onClick={onDaftar}
              className="rounded-full bg-gold px-5 py-3 sm:px-7 sm:py-3.5 text-xs sm:text-sm font-extrabold text-midnight shadow-lg shadow-gold/20 transition hover:-translate-y-0.5 active:translate-y-0"
            >
              {hero.primaryLabel}
            </button>
            {hero.secondaryLabel && (
              <a
                href={hero.secondaryHref || hero.primaryHref || "#top"}
                className="rounded-full border border-white/30 bg-white/5 backdrop-blur-sm px-5 py-3 sm:px-7 sm:py-3.5 text-xs sm:text-sm font-bold text-white transition hover:bg-white/15 hover:border-white/50 active:translate-y-0"
              >
                {hero.secondaryLabel}
              </a>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

export function Marquee({ items, anchor }: { items: string[]; anchor?: string }) { return <div id={anchor} className="scroll-mt-24 overflow-hidden bg-gold py-3 text-midnight"><div className="marquee-track flex min-w-max gap-8 font-mono text-xs font-bold uppercase tracking-[0.2em]">{[...items, ...items].map((item, index) => <span key={`${item}-${index}`} className="flex items-center gap-8">{item}<span>✦</span></span>)}</div></div>; }
