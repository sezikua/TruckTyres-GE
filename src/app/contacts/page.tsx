import type { Metadata } from "next";
import { headers, cookies } from "next/headers";
import { getDictionary } from "@/i18n";

// Метадані формуються динамічно через generateMetadata нижче

async function getBaseUrl(): Promise<string> {
  const envUrl = process.env.NEXT_PUBLIC_SITE_URL;
  if (envUrl) return envUrl.replace(/\/$/, "");
  const h = await headers();
  const host = h.get("x-forwarded-host") || h.get("host");
  const proto = h.get("x-forwarded-proto") || "https";
  return `${proto}://${host}`;
}

export async function generateMetadata(): Promise<Metadata> {
  const baseUrl = await getBaseUrl();
  const canonical = `${baseUrl}/contacts`;
  return {
    title: "Контакты — Грузовые шины Грузии",
    description: "Адрес и телефон. Грузовые шины Грузии — надежные шины и сервис.",
    alternates: { canonical },
    openGraph: {
      title: "Контакты — Грузовые шины Грузии",
      description: "Адрес и телефон. Грузовые шины Грузии — надежные шины и сервис.",
      url: canonical,
      type: "website",
      siteName: "Грузовые шины Грузии",
    },
    twitter: {
      card: "summary_large_image",
      title: "Контакты — Грузовые шины Грузии",
      description: "Адрес и телефон. Грузовые шины Грузии — надежные шины и сервис.",
    },
  };
}

export default async function ContactsPage() {
  const lang = (await cookies()).get("lang")?.value === "ka" ? "ka" : "ru";
  const t = await getDictionary(lang);
  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-center mb-8">{t["contacts.title"]}</h1>

      <div className="text-center space-y-4">
        <p className="text-lg">{t["contacts.address.title"]}: {t["contacts.address"]}</p>
        <p className="text-lg">
          {t["contacts.phone"]}: <a href={`tel:${t["contacts.phone.value"]}`} className="text-[#008e4ed3] hover:underline font-semibold">{t["contacts.phone.value"]}</a> {t["contacts.name"]}
        </p>
      </div>

    </div>
  );
}





