"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import ThemeToggle from "@/components/ThemeToggle";
import ContactModal from "@/components/ContactModal";
import Cart from "@/components/Cart";

const navItems = [
  { href: "/", label: "Головна" },
  { href: "/products", label: "Каталог" },
  { href: "/about", label: "Про нас" },
  { href: "/contacts", label: "Контакти" },
];

export default function Header() {
  const [open, setOpen] = useState(false);
  const [contactOpen, setContactOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 w-full bg-[#0054a6] text-white border-b border-black/0 shadow-lg">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <Image 
              src="/cstl-logo-eu-as.avif" 
              alt="CEAT" 
              width={120} 
              height={32} 
              className="h-8 w-auto"
              style={{ width: 'auto', height: 'auto' }}
              priority 
            />
            <span className="sr-only">CEAT Каталог</span>
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm font-medium text-white/90 hover:text-white transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <button
              className="hidden md:inline-flex h-10 items-center rounded-md bg-white/10 hover:bg-white/20 text-white px-4 transition"
              onClick={() => setContactOpen(true)}
            >
              Зворотний зв&apos;язок
            </button>
            <Cart />
            <ThemeToggle />
            <button
              className="md:hidden inline-flex h-10 w-10 items-center justify-center rounded-md border border-white/20 hover:bg-white/10 transition-colors text-white"
              aria-label="Toggle menu"
              onClick={() => setOpen((v) => !v)}
            >
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className={`md:hidden overflow-hidden transition-[max-height,opacity] duration-300 absolute top-full left-0 right-0 bg-[#0054a6] shadow-lg ${open ? "max-h-96 opacity-100" : "max-h-0 opacity-0"}`}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-2 flex flex-col gap-2 bg-[#0054a6] text-white">
          <button
            onClick={() => { setContactOpen(true); setOpen(false); }}
            className="px-3 py-2 rounded-md hover:bg-white/10 text-left"
          >
            Зворотний зв&apos;язок
          </button>
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className="px-3 py-2 rounded-md hover:bg-white/10 transition-colors"
            >
              {item.label}
            </Link>
          ))}
        </div>
      </div>

      <ContactModal open={contactOpen} onClose={() => setContactOpen(false)} />
    </header>
  );
}


