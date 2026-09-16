import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import type { NavItemInput, SiteContent } from "@tpb/contracts";
import { Header, Hero } from "./Hero";

const brand: SiteContent["brand"] = { kicker: "Teknik", name: "TPB", org: "UNU Purwokerto", logoUrl: "" };
const navigation: NavItemInput[] = [
  { label: "Profil", href: "/profil", children: [{ label: "Sejarah", href: "/profil#sejarah" }] },
  { label: "Beranda", href: "/" },
];

const renderHeader = () =>
  render(<Header brand={brand} navigation={navigation} blocks={[]} slug="beranda" onAdmin={vi.fn()} />);

afterEach(() => {
  cleanup();
  window.history.replaceState({}, "", "/");
});

describe("Header — dropdown desktop", () => {
  it("membuka/menutup dropdown dengan klik disertai aria-expanded", () => {
    renderHeader();
    const trigger = screen.getByRole("button", { name: "Profil" });
    expect(trigger).toHaveAttribute("aria-expanded", "false");
    expect(screen.queryByText("Sejarah")).toBeNull();

    fireEvent.click(trigger);
    expect(trigger).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByText("Sejarah")).toBeTruthy();

    fireEvent.click(trigger);
    expect(trigger).toHaveAttribute("aria-expanded", "false");
    expect(screen.queryByText("Sejarah")).toBeNull();
  });

  it("tetap membuka dropdown saat hover dengan mouse", () => {
    renderHeader();
    fireEvent.pointerEnter(screen.getByRole("button", { name: "Profil" }), { pointerType: "mouse" });
    expect(screen.getByText("Sejarah")).toBeTruthy();
  });

  it("tap sentuh membuka dropdown (bukan tertutup oleh event hover semu)", () => {
    renderHeader();
    const trigger = screen.getByRole("button", { name: "Profil" });
    fireEvent.pointerEnter(trigger, { pointerType: "touch" });
    expect(screen.queryByText("Sejarah")).toBeNull();
    fireEvent.click(trigger);
    expect(trigger).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByText("Sejarah")).toBeTruthy();
  });

  it("Escape mengembalikan fokus ke tombol pemicu", () => {
    renderHeader();
    const trigger = screen.getByRole("button", { name: "Profil" });
    fireEvent.click(trigger);
    fireEvent.keyDown(window, { key: "Escape" });
    expect(document.activeElement).toBe(trigger);
  });

  it("menutup dropdown dengan tombol Escape", () => {
    renderHeader();
    fireEvent.click(screen.getByRole("button", { name: "Profil" }));
    fireEvent.keyDown(window, { key: "Escape" });
    expect(screen.queryByText("Sejarah")).toBeNull();
    expect(screen.getByRole("button", { name: "Profil" })).toHaveAttribute("aria-expanded", "false");
  });

  it("klik tautan anak memakai navigasi internal", () => {
    renderHeader();
    fireEvent.click(screen.getByRole("button", { name: "Profil" }));
    const pushSpy = vi.spyOn(window.history, "pushState");
    fireEvent.click(screen.getByText("Sejarah"));
    expect(pushSpy).toHaveBeenCalledWith({}, "", "/profil#sejarah");
    pushSpy.mockRestore();
  });

  it("menu tanpa anak tetap tautan biasa", () => {
    renderHeader();
    const link = screen.getByRole("link", { name: "Beranda" });
    expect(link).toHaveAttribute("href", "/");
    expect(screen.queryByRole("button", { name: "Beranda" })).toBeNull();
  });
});

describe("Hero — banner background responsif", () => {
  const dummyHero: SiteContent["hero"] = {
    badge: "Terakreditasi · UNU Purwokerto",
    line1: "Selamat Datang",
    highlight: "Prodi Teknik",
    line2: "Pertanian & Biosistem",
    subtitle: "Deskripsi program studi",
    primaryLabel: "Jelajahi Program",
    primaryHref: "#akademik",
    secondaryLabel: "Pendaftaran Mahasiswa",
    image: "/images/hero-banner.jpg",
  };

  it("merender banner dengan gambar UNU Purwokerto dan alt deskriptif", () => {
    const { container } = render(<Hero hero={dummyHero} onDaftar={vi.fn()} />);
    const img = container.querySelector("img");
    expect(img).toBeTruthy();
    expect(img?.getAttribute("src")).toBe("/images/hero-banner.jpg");
    expect(img?.getAttribute("alt")).toBe("Gedung Kampus Universitas Nahdlatul Ulama Purwokerto");
    expect(img?.className).toContain("object-cover");
    expect(img?.className).toContain("object-[center_35%]");
  });

  it("memakai gambar bawaan /images/hero-banner.jpg bila hero.image kosong", () => {
    const heroWithoutImage = { ...dummyHero, image: "" };
    const { container } = render(<Hero hero={heroWithoutImage} onDaftar={vi.fn()} />);
    const img = container.querySelector("img");
    expect(img?.getAttribute("src")).toBe("/images/hero-banner.jpg");
  });

  it("merender teks judul, highlight, badge, dan tombol CTA dengan benar", () => {
    const onDaftar = vi.fn();
    render(<Hero hero={dummyHero} onDaftar={onDaftar} />);
    expect(screen.getByText("Terakreditasi · UNU Purwokerto")).toBeTruthy();
    expect(screen.getByText("Prodi Teknik")).toBeTruthy();
    expect(screen.getByText("Deskripsi program studi")).toBeTruthy();

    const btn = screen.getByRole("button", { name: "Jelajahi Program" });
    fireEvent.click(btn);
    expect(onDaftar).toHaveBeenCalledTimes(1);

    const secondary = screen.getByRole("link", { name: "Pendaftaran Mahasiswa" });
    expect(secondary).toBeTruthy();
  });
});

