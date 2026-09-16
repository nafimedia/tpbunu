import { useEffect, useState } from "react";
import { DriveImage } from "../DriveImage";
import type { Post, SiteContent } from "@tpb/contracts";
import { api } from "../../lib/api";
import { CollectionState, formatDate } from "./ui";
import { useSystemTexts } from "../../lib/systemTexts";

export function News({ news, anchor = "berita" }: { news: SiteContent["news"]; anchor?: string }) {
  const texts = useSystemTexts();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [active, setActive] = useState<Post | null>(null);
  const [tab, setTab] = useState("all");

  useEffect(() => {
    let alive = true;
    api.listPublic()
      .then((items) => alive && setPosts(items))
      .catch((e: Error) => alive && setError(e.message))
      .finally(() => alive && setLoading(false));
    return () => { alive = false; };
  }, []);

  const categories = ["all", ...Array.from(new Set(posts.map((post) => post.category)))];
  const shown = tab === "all" ? posts : posts.filter((post) => post.category === tab);

  return (
    <section id={anchor} className="scroll-mt-24 bg-cream py-14 sm:py-24">
      <div className="mx-auto max-w-[1360px] px-4 sm:px-5 lg:px-10">
        <div className="reveal flex flex-wrap items-end justify-between gap-4 sm:gap-6">
          <div>
            <span className="font-mono text-[10px] sm:text-[11px] uppercase tracking-[0.2em] sm:tracking-[0.3em] text-leaf-600 block">{news.kicker}</span>
            <h2 className="mt-2.5 sm:mt-4 font-display text-2xl sm:text-4xl lg:text-5xl font-extrabold leading-tight text-midnight break-words">{news.title}</h2>
          </div>
          <div className="flex flex-wrap gap-1.5 sm:gap-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setTab(category)}
                className={`rounded-full px-3.5 py-1.5 sm:px-5 sm:py-2.5 text-xs sm:text-[13px] font-bold capitalize transition ${
                  tab === category ? "bg-midnight text-white" : "border border-midnight/12 text-midnight/60 hover:bg-midnight/5"
                }`}
              >
                {category === "all" ? texts.newsAllTab : category}
              </button>
            ))}
          </div>
        </div>

        <CollectionState loading={loading} error={error} empty={!shown.length}>
          <div className="mt-8 sm:mt-12 grid gap-5 sm:gap-7 md:grid-cols-2 lg:grid-cols-3">
            {shown.map((post) => (
              <article
                key={post.id}
                onClick={() => setActive(post)}
                className="reveal group flex cursor-pointer flex-col overflow-hidden rounded-2xl sm:rounded-3xl border border-midnight/8 bg-white transition hover:-translate-y-1.5"
              >
                <div className="relative h-44 sm:h-52 overflow-hidden bg-midnight/10">
                  {post.image && (
                    <DriveImage src={post.image} alt={post.title} className="h-full w-full object-cover transition duration-700 group-hover:scale-105" />
                  )}
                  <span className="absolute left-3 top-3 sm:left-4 sm:top-4 rounded-full bg-gold px-2.5 py-0.5 sm:px-3 sm:py-1 font-mono text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-midnight">
                    {post.category}
                  </span>
                </div>
                <div className="flex flex-1 flex-col p-5 sm:p-6">
                  <div className="font-mono text-[10px] sm:text-[11px] uppercase tracking-wider text-midnight/45">
                    {formatDate(post.date)} · {post.readTime}
                  </div>
                  <h3 className="mt-2.5 sm:mt-3 flex-1 font-display text-lg sm:text-xl font-bold leading-snug text-midnight break-words">{post.title}</h3>
                  <span className="mt-4 sm:mt-5 text-xs sm:text-[13px] font-bold text-midnight/70 group-hover:text-midnight">Selengkapnya →</span>
                </div>
              </article>
            ))}
          </div>
        </CollectionState>
      </div>

      {active && (
        <div onClick={() => setActive(null)} className="fixed inset-0 z-[90] grid place-items-center bg-midnight/70 p-4 backdrop-blur-sm">
          <div onClick={(event) => event.stopPropagation()} className="max-h-[90vh] w-full max-w-2xl overflow-auto rounded-2xl sm:rounded-3xl bg-white p-5 sm:p-8 shadow-2xl">
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0 flex-1">
                <span className="font-mono text-[10px] sm:text-[11px] uppercase tracking-wider text-leaf-600 block">{active.category}</span>
                <h3 className="mt-2 font-display text-xl sm:text-3xl font-extrabold text-midnight break-words">{active.title}</h3>
                <p className="mt-1.5 sm:mt-2 text-xs text-midnight/50">{formatDate(active.date)} · {active.readTime}</p>
              </div>
              <button onClick={() => setActive(null)} aria-label="Tutup" className="rounded-full bg-midnight/5 px-3 py-1 text-sm font-bold text-midnight hover:bg-midnight/10 shrink-0">✕</button>
            </div>
            {active.image && (
              <div className="mt-4 sm:mt-6 overflow-hidden rounded-xl sm:rounded-2xl">
                <DriveImage src={active.image} alt={active.title} className="max-h-60 sm:max-h-72 w-full object-cover" />
              </div>
            )}
            <p className="mt-4 sm:mt-6 whitespace-pre-line text-xs sm:text-sm leading-relaxed text-midnight/75 break-words">{active.content || active.excerpt}</p>
          </div>
        </div>
      )}
    </section>
  );
}

export function CTA({ cta, onDaftar, anchor }: { cta: SiteContent["cta"]; onDaftar: () => void; anchor?: string }) {
  return (
    <section id={anchor} className="scroll-mt-24 bg-cream pb-16 sm:pb-24">
      <div className="mx-auto max-w-[1360px] px-4 sm:px-5 lg:px-10">
        <div className="reveal relative overflow-hidden rounded-3xl sm:rounded-[2.5rem] bg-gradient-to-br from-leaf-600 via-leaf to-leaf-600 px-5 py-12 sm:px-8 sm:py-16 text-center lg:px-20">
          <h2 className="relative mx-auto max-w-2xl font-display text-2xl sm:text-4xl lg:text-5xl font-extrabold leading-tight text-white break-words">{cta.title}</h2>
          <p className="relative mx-auto mt-3.5 sm:mt-5 max-w-xl text-sm sm:text-[16px] leading-relaxed text-white/85 break-words">{cta.body}</p>
          <div className="relative mt-7 sm:mt-9 flex flex-wrap justify-center gap-3 sm:gap-4">
            <button onClick={onDaftar} className="rounded-full bg-white px-6 py-3 sm:px-8 sm:py-4 text-xs sm:text-sm font-extrabold text-leaf-600 shadow-md transition hover:scale-105 active:scale-95">
              {cta.primary}
            </button>
            {cta.secondaryHref && (
              <a href={cta.secondaryHref} className="rounded-full border border-white/50 px-6 py-3 sm:px-8 sm:py-4 text-xs sm:text-sm font-bold text-white transition hover:bg-white/10 active:scale-95">
                {cta.secondary}
              </a>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

export function Footer({ footer }: { footer: SiteContent["footer"] }) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  const subscribe = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!email.trim()) return;
    setStatus("sending");
    try {
      await api.subscribe(email);
      setEmail("");
      setStatus("sent");
    } catch {
      setStatus("error");
    }
  };

  const socials = [
    footer.socials.facebook ? { label: "Facebook", href: footer.socials.facebook } : null,
    footer.socials.twitter ? { label: "Twitter", href: footer.socials.twitter } : null,
    footer.socials.youtube ? { label: "YouTube", href: footer.socials.youtube } : null,
    footer.socials.linkedin ? { label: "LinkedIn", href: footer.socials.linkedin } : null,
  ].filter(Boolean) as { label: string; href: string }[];

  return (
    <footer className="relative bg-midnight text-white">
      <div className="mx-auto grid max-w-[1360px] gap-10 sm:gap-14 px-4 py-14 sm:px-5 sm:py-20 lg:grid-cols-[1.6fr_1fr_1fr] lg:px-10">
        <div>
          <h3 className="font-display text-2xl sm:text-3xl font-extrabold leading-tight break-words">{footer.newsletterTitle}</h3>
          <form onSubmit={subscribe} className="mt-5 sm:mt-7 flex flex-col sm:flex-row max-w-md items-stretch sm:items-center gap-2 sm:gap-0 rounded-2xl sm:rounded-full border border-white/15 bg-white/5 p-1.5">
            <input
              type="email"
              required
              aria-label="Alamat email untuk berlangganan"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="flex-1 bg-transparent px-4 py-2 text-sm text-white placeholder:text-white/40 focus:outline-none min-w-0"
              placeholder="Alamat email Anda..."
            />
            <button
              disabled={status === "sending"}
              className="rounded-full bg-gold px-5 py-2.5 text-xs font-extrabold text-midnight transition hover:bg-gold-light active:scale-95 shrink-0"
            >
              {status === "sending" ? "…" : status === "sent" ? "Terkirim ✓" : status === "error" ? "Gagal ✕" : footer.submitLabel}
            </button>
          </form>
          {socials.length > 0 && (
            <div className="mt-5 flex flex-wrap gap-4 text-xs sm:text-sm text-white/70">
              {socials.map((s) => (
                <a key={s.href} href={s.href} target="_blank" rel="noreferrer" className="hover:text-white transition">
                  {s.label}
                </a>
              ))}
            </div>
          )}
          <p className="mt-7 sm:mt-9 text-[11px] sm:text-xs font-bold uppercase tracking-[0.16em] sm:tracking-[0.2em] text-white/55 break-words">
            {footer.tagline}
          </p>
        </div>

        <div>
          <h4 className="font-display text-lg sm:text-xl font-bold">{footer.infoTitle}</h4>
          <ul className="mt-4 sm:mt-6 space-y-3 sm:space-y-4 text-xs sm:text-sm text-white/70 break-words">
            <li>
              {footer.contact.phoneHref ? (
                <a href={footer.contact.phoneHref} target="_blank" rel="noreferrer" className="hover:text-white">
                  {footer.contact.phone}
                </a>
              ) : (
                footer.contact.phone
              )}
            </li>
            <li className="break-all">{footer.contact.email}</li>
            <li className="leading-relaxed">{footer.contact.address}</li>
          </ul>
        </div>

        <div>
          <h4 className="font-display text-lg sm:text-xl font-bold">{footer.quickLinksTitle}</h4>
          <ul className="mt-4 sm:mt-6 space-y-2.5 sm:space-y-3.5 text-xs sm:text-sm text-white/70">
            {footer.quickLinks.map((link) => (
              <li key={`${link.label}-${link.href}`}>
                <a href={link.href} className="hover:text-white transition">
                  {link.label}
                </a>
              </li>
            ))}
            <li className="text-white/60 text-xs mt-4 pt-2 border-t border-white/10">{footer.copyright}</li>
          </ul>
        </div>
      </div>
    </footer>
  );
}

export function BackToTop() { const [show, setShow] = useState(false); useEffect(() => { const onScroll = () => setShow(window.scrollY > 600); window.addEventListener("scroll", onScroll, { passive: true }); return () => window.removeEventListener("scroll", onScroll); }, []); return <button onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} aria-label="Kembali ke atas" className={`fixed bottom-7 right-7 z-40 grid h-12 w-12 place-items-center rounded-full bg-gold text-midnight transition-all ${show ? "opacity-100" : "pointer-events-none opacity-0"}`}>↑</button>; }
