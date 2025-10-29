"use client";
import Link from "next/link";
import Image from "next/image";
import { useI18n } from "@/providers/I18nProvider";

export default function Footer() {
  const { t } = useI18n();
  return (
    <footer className="bg-[#008e4ed3] text-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="text-sm leading-6">
          <Link href="#" aria-label={t("brand.name")}> 
            <Image
              src="/logotype_en_white-1.png"
              alt={t("brand.name")}
              width={180}
              height={40}
              className="h-10 w-auto"
              style={{ width: 'auto', height: 'auto' }}
              priority
            />
          </Link>
          <p className="mt-3">{t("brand.name")}</p>
        </div>

        <div className="text-sm">
          <p className="font-semibold mb-3">{t("footer.quickLinks")}</p>
          <ul className="space-y-2">
            <li><Link href="/products" className="hover:underline">{t("nav.shop")}</Link></li>
            <li><Link href="/about" className="hover:underline">{t("nav.about")}</Link></li>
            <li><Link href="/news" className="hover:underline">{t("nav.news")}</Link></li>
            <li><Link href="/contacts" className="hover:underline">{t("nav.contacts")}</Link></li>
          </ul>
        </div>

        <div className="text-sm">
          <p className="font-semibold mb-3">{t("footer.categories")}</p>
          <ul className="space-y-2">
            <li><Link href="/categories/High%20Power%20Tractor" className="hover:underline">{t("cat.tractor")}</Link></li>
            <li><Link href="/categories/Harvester" className="hover:underline">{t("cat.combine")}</Link></li>
            <li><Link href="/categories/THL%2FCompact%20Loader" className="hover:underline">{t("cat.loader")}</Link></li>
            <li><Link href="/categories/Sprayer" className="hover:underline">{t("cat.sprayer")}</Link></li>
            <li><Link href="/categories/Flotation%2FAgri%20Transport" className="hover:underline">{t("cat.trailer")}</Link></li>
          </ul>
        </div>

        <div className="text-sm">
          <p className="font-semibold mb-3">{t("footer.contacts")}</p>
          <p>
            {t("contacts.address")}
          </p>
          <p className="mt-2">
            <a href={`tel:${t("contacts.phone.value")}`} className="hover:underline">{t("contacts.phone.value")} ({t("contacts.name")})</a>
          </p>
        </div>
      </div>
      <div className="bg-[#008E4E] py-4 text-center text-xs text-white/80">
        {t("footer.copyright").replace("{year}", String(new Date().getFullYear()))}
      </div>
    </footer>
  );
}


