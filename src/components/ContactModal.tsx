"use client";

import { useEffect } from "react";

type Props = {
  open: boolean;
  onClose: () => void;
};

export default function ContactModal({ open, onClose }: Props) {
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, onClose]);

  if (!open) return null;

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    onClose();
    // Here you can integrate API or mail service later
  }

  return (
    <div className="fixed inset-0 z-[60]">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="absolute inset-0 flex items-center justify-center p-4">
        <div className="w-full max-w-lg rounded-xl bg-white dark:bg-neutral-900 text-foreground shadow-xl border border-black/10 dark:border-white/10">
          <div className="px-6 py-4 border-b border-black/10 dark:border-white/10 flex items-center justify-between">
            <h3 className="text-lg font-semibold">Зворотний зв’язок</h3>
            <button
              type="button"
              onClick={onClose}
              className="h-8 px-3 rounded-md bg-[#0054a6] text-white hover:opacity-90"
            >
              Закрити
            </button>
          </div>
          <form className="px-6 py-5 grid gap-4" onSubmit={handleSubmit}>
            <div className="grid gap-1">
              <label htmlFor="name" className="text-sm">Ім’я</label>
              <input id="name" name="name" required className="h-11 rounded-md border border-black/15 dark:border-white/15 bg-white dark:bg-neutral-950 px-3" />
            </div>
            <div className="grid gap-1">
              <label htmlFor="phone" className="text-sm">Телефон</label>
              <input id="phone" name="phone" required className="h-11 rounded-md border border-black/15 dark:border-white/15 bg-white dark:bg-neutral-950 px-3" />
            </div>
            <div className="grid gap-1">
              <label htmlFor="email" className="text-sm">Email</label>
              <input id="email" name="email" type="email" className="h-11 rounded-md border border-black/15 dark:border-white/15 bg-white dark:bg-neutral-950 px-3" />
            </div>
            <div className="grid gap-1">
              <label htmlFor="message" className="text-sm">Повідомлення</label>
              <textarea id="message" name="message" rows={4} className="rounded-md border border-black/15 dark:border-white/15 bg-white dark:bg-neutral-950 px-3 py-2" />
            </div>
            <div className="pt-2 flex justify-end gap-2">
              <button type="button" onClick={onClose} className="h-11 px-5 rounded-md border border-black/15 dark:border-white/15 hover:bg-black/5 dark:hover:bg-white/10">Скасувати</button>
              <button type="submit" className="h-11 px-5 rounded-md bg-[#0054a6] text-white hover:opacity-90">Надіслати</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}





