import { DriveImage } from "../DriveImage";
import type { SiteContent } from "@tpb/contracts";
import { Band } from "./ui";

type Metric = { v: string; l: string };

export function MetricList({ items }: { items: Metric[] }) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-4">
      {items.map((item) => (
        <div key={`${item.v}-${item.l}`} className="reveal rounded-xl sm:rounded-2xl border border-midnight/10 bg-white p-3.5 sm:p-5">
          <p className="font-display text-2xl sm:text-3xl font-extrabold text-leaf-600 break-words">{item.v}</p>
          <p className="mt-1 text-[11px] sm:text-xs text-midnight/55 break-words">{item.l}</p>
        </div>
      ))}
    </div>
  );
}

export function TagList({ items }: { items: string[] }) {
  return (
    <div className="flex flex-wrap gap-2 sm:gap-3">
      {items.map((item) => (
        <span key={item} className="reveal rounded-full border border-midnight/15 bg-white px-3.5 py-1.5 sm:px-5 sm:py-3 text-xs sm:text-sm text-midnight/70 break-words">
          {item}
        </span>
      ))}
    </div>
  );
}

export function TimelineList({ items }: { items: { year: string; text: string }[] }) {
  return (
    <div className="grid gap-3.5 sm:gap-4 md:grid-cols-2">
      {items.map((item) => (
        <div key={`${item.year}-${item.text}`} className="reveal rounded-xl sm:rounded-2xl border border-midnight/10 bg-white p-4 sm:p-5">
          <span className="font-mono text-xs sm:text-sm text-leaf-600 block">{item.year}</span>
          <p className="mt-1.5 sm:mt-2 text-xs sm:text-sm leading-relaxed text-midnight/70 break-words">{item.text}</p>
        </div>
      ))}
    </div>
  );
}

export function PeopleGrid({ items }: { items: { name: string; role: string; photo?: string | null; details?: string[] }[] }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {items.map((item) => (
        <div key={`${item.name}-${item.role}`} className="reveal rounded-2xl border border-midnight/10 bg-cream p-4 sm:p-5 flex flex-col">
          {item.photo && (
            <div className="mb-3.5 sm:mb-4 overflow-hidden rounded-xl bg-midnight/10">
              <DriveImage src={item.photo} alt={item.name} className="h-40 w-full object-cover" />
            </div>
          )}
          <p className="font-display text-lg sm:text-xl font-bold text-midnight break-words">{item.name}</p>
          <p className="mt-1.5 sm:mt-2 text-xs sm:text-sm text-midnight/55 break-words">{item.role}</p>
          {item.details && item.details.length > 0 && (
            <ul className="mt-3 space-y-1 text-xs text-midnight/60 break-words border-t border-midnight/10 pt-2">
              {item.details.map((edu) => (
                <li key={edu} className="flex items-start gap-1">
                  <span className="shrink-0">🎓</span>
                  <span>{edu}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      ))}
    </div>
  );
}

export function CardList({ items }: { items: { title: string; body: string; note?: string }[] }) {
  return (
    <div className="grid gap-3.5 sm:gap-4 md:grid-cols-2">
      {items.map((item) => (
        <article key={`${item.title}-${item.body}`} className="reveal rounded-xl sm:rounded-2xl border border-midnight/10 bg-white p-4 sm:p-6 flex flex-col">
          <h3 className="font-display text-lg sm:text-xl font-bold text-midnight break-words">{item.title}</h3>
          <p className="mt-2 sm:mt-3 text-xs sm:text-sm leading-relaxed text-midnight/65 break-words flex-1">{item.body}</p>
          {item.note && <p className="mt-3 font-mono text-xs text-leaf-600 break-words">{item.note}</p>}
        </article>
      ))}
    </div>
  );
}

const kick = (data: { kicker: string; title: string }, anchor?: string, tone?: "cream" | "white", intro?: string) => ({ id: anchor ?? "", tone, kicker: data.kicker, title: data.title, intro });

export function TimelineSection({ data, anchor }: { data: SiteContent["profil"]["sejarah"]; anchor?: string }) {
  return <Band {...kick(data, anchor ?? "sejarah", "white")} intro={data.intro}><TimelineList items={data.timeline} /></Band>;
}

export function VisiMisiSection({ data, anchor }: { data: SiteContent["profil"]["visiMisi"]; anchor?: string }) {
  const cols = data.tujuan && data.tujuan.length > 0 ? "lg:grid-cols-3" : "lg:grid-cols-2";
  return (
    <Band {...kick(data, anchor ?? "visi-misi")}>
      <div className={`grid gap-4 sm:gap-5 ${cols}`}>
        <div className="reveal rounded-2xl sm:rounded-3xl bg-midnight p-5 sm:p-7 text-white">
          <span className="font-mono text-xs uppercase tracking-wider text-gold">Visi</span>
          <p className="mt-3 sm:mt-4 font-display text-xl sm:text-2xl font-bold break-words">{data.visi}</p>
        </div>
        <div className="reveal rounded-2xl sm:rounded-3xl bg-leaf-600 p-5 sm:p-7 text-white">
          <span className="font-mono text-xs uppercase tracking-wider text-gold">Misi</span>
          <ul className="mt-3 sm:mt-4 space-y-2.5 sm:space-y-3 text-xs sm:text-sm leading-relaxed">
            {data.misi.map((item) => (
              <li key={item} className="flex items-start gap-2">
                <span className="text-gold shrink-0">✦</span>
                <span className="break-words">{item}</span>
              </li>
            ))}
          </ul>
        </div>
        {data.tujuan && data.tujuan.length > 0 && (
          <div className="reveal rounded-2xl sm:rounded-3xl bg-gold p-5 sm:p-7 text-midnight">
            <span className="font-mono text-xs uppercase tracking-wider">Tujuan</span>
            <ul className="mt-3 sm:mt-4 space-y-2.5 sm:space-y-3 text-xs sm:text-sm leading-relaxed">
              {data.tujuan.map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <span className="shrink-0">➤</span>
                  <span className="break-words">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </Band>
  );
}

export function StrukturSection({ data, anchor }: { data: SiteContent["profil"]["struktur"]; anchor?: string }) {
  return (
    <Band {...kick(data, anchor ?? "struktur", "white")}>
      <div className="grid gap-3 sm:gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {data.people.map((person) => (
          <div key={`${person.role}-${person.name}`} className="reveal rounded-xl sm:rounded-2xl border border-midnight/10 bg-cream p-4 sm:p-5">
            <p className="text-[11px] sm:text-xs uppercase tracking-wider text-leaf-600">{person.role}</p>
            <p className="mt-1.5 sm:mt-2 font-display text-lg sm:text-xl font-bold text-midnight break-words">{person.name}</p>
          </div>
        ))}
      </div>
    </Band>
  );
}

export function QuoteSection({ data, anchor }: { data: SiteContent["profil"]["sambutan"]; anchor?: string }) {
  return (
    <Band {...kick(data, anchor ?? "sambutan")}>
      <div className="grid gap-6 sm:gap-8 lg:grid-cols-[260px_1fr] lg:items-center">
        <div className="reveal overflow-hidden rounded-2xl sm:rounded-3xl">
          <DriveImage src={data.image} alt={data.name} className="h-56 sm:h-64 w-full object-cover" />
        </div>
        <div className="reveal">
          <p className="font-display text-xl sm:text-2xl italic leading-relaxed text-midnight break-words">“{data.quote}”</p>
          <p className="mt-4 sm:mt-5 font-bold text-midnight break-words">{data.name}</p>
          <p className="text-xs sm:text-sm text-midnight/55 break-words">{data.role}</p>
        </div>
      </div>
    </Band>
  );
}

export function KurikulumSection({ data, anchor }: { data: SiteContent["akademik"]["kurikulum"]; anchor?: string }) {
  return <Band {...kick(data, anchor ?? "kurikulum", "white")} intro={data.intro}><MetricList items={data.sks} /><TagList items={data.clusters} /></Band>;
}

export function KalenderSection({ data, anchor }: { data: SiteContent["akademik"]["kalender"]; anchor?: string }) {
  return <Band {...kick(data, anchor ?? "kalender")}><TimelineList items={data.items.map((x) => ({ year: x.d, text: x.e }))} /></Band>;
}

export function DosenSection({ data, anchor }: { data: SiteContent["akademik"]["dosen"]; anchor?: string }) {
  return <Band {...kick(data, anchor ?? "dosen", "white")} intro={data.intro}><PeopleGrid items={data.people.map((x) => ({ name: x.name, role: x.field, photo: x.photo, details: x.details }))} /></Band>;
}

export function LaboratoriumSection({ data, anchor }: { data: SiteContent["akademik"]["laboratorium"]; anchor?: string }) {
  return <Band {...kick(data, anchor ?? "laboratorium")}><CardList items={data.labs.map((x) => ({ title: x.name, body: x.desc }))} /></Band>;
}

export function PublikasiSection({ data, anchor }: { data: SiteContent["penelitian"]["publikasi"]; anchor?: string }) {
  return <Band {...kick(data, anchor ?? "publikasi", "white")}><CardList items={data.pubs.map((x) => ({ title: x.title, body: `${x.venue} · ${x.year}` }))} /></Band>;
}

export function JurnalSection({ data, anchor }: { data: SiteContent["penelitian"]["jurnal"]; anchor?: string }) {
  return <Band {...kick(data, anchor ?? "jurnal")} intro={data.intro}><CardList items={data.cards.map((x) => ({ title: x.title, body: x.body, note: x.note }))} /></Band>;
}

export function KolaborasiSection({ data, anchor }: { data: SiteContent["penelitian"]["kolaborasi"]; anchor?: string }) {
  return <Band {...kick(data, anchor ?? "kolaborasi", "white")} intro={data.intro}><TagList items={data.partners} /></Band>;
}

export function ProgramDesaSection({ data, anchor }: { data: SiteContent["pengabdian"]["programDesa"]; anchor?: string }) {
  return <Band {...kick(data, anchor ?? "program-desa")}><CardList items={data.desa.map((x) => ({ title: x.name, body: x.body }))} /></Band>;
}

export function KemitraanSection({ data, anchor }: { data: SiteContent["pengabdian"]["kemitraan"]; anchor?: string }) {
  return <Band {...kick(data, anchor ?? "kemitraan", "white")}><TagList items={data.mitra} /></Band>;
}

export function KegiatanSection({ data, anchor }: { data: SiteContent["pengabdian"]["kegiatan"]; anchor?: string }) {
  return <Band {...kick(data, anchor ?? "kegiatan")}><TimelineList items={data.items.map((x) => ({ year: x.t, text: x.d }))} /></Band>;
}

export function HimpunanSection({ data, anchor }: { data: SiteContent["kemahasiswaan"]["himpunan"]; anchor?: string }) {
  return <Band {...kick(data, anchor ?? "himpunan", "white")} intro={data.intro}><TagList items={data.divisi} /></Band>;
}

export function BeasiswaSection({ data, anchor }: { data: SiteContent["kemahasiswaan"]["beasiswa"]; anchor?: string }) {
  return <Band {...kick(data, anchor ?? "beasiswa")}><CardList items={data.items.map((x) => ({ title: x.name, body: x.body }))} /></Band>;
}

export function PrestasiSection({ data, anchor }: { data: SiteContent["kemahasiswaan"]["prestasi"]; anchor?: string }) {
  return <Band {...kick(data, anchor ?? "prestasi", "white")}><TagList items={data.items} /></Band>;
}

export function AlumniSection({ data, anchor }: { data: SiteContent["kemahasiswaan"]["alumni"]; anchor?: string }) {
  return <Band {...kick(data, anchor ?? "alumni")}><div className="grid gap-5 lg:grid-cols-2"><blockquote className="reveal rounded-3xl bg-midnight p-7 font-display text-2xl italic text-white">“{data.quote}”<footer className="mt-5 font-sans text-sm not-italic text-white/60">{data.name} · {data.role}</footer></blockquote><MetricList items={data.stats} /></div></Band>;
}
