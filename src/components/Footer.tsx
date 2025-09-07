import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="bg-[#0054a6] text-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="text-sm leading-6">
          <Image
            src="/logotype_en_white-1.png"
            alt="ТОВ Агро-Солар — офіційний імпортер CEAT"
            width={180}
            height={40}
            className="h-10 w-auto"
            style={{ width: 'auto', height: 'auto' }}
            priority
          />
          <p className="mt-3">офіційний імпортер шин CEAT для сільськогосподарської техніки в Україні.</p>
        </div>

        <div className="text-sm">
          <p className="font-semibold mb-3">Швидкі посилання</p>
          <ul className="space-y-2">
            <li><Link href="/products" className="hover:underline">Магазин</Link></li>
            <li><Link href="/about" className="hover:underline">Про нас</Link></li>
            <li><Link href="/news" className="hover:underline">Статті</Link></li>
            <li><Link href="/contacts" className="hover:underline">Контакти</Link></li>
          </ul>
        </div>

        <div className="text-sm">
          <p className="font-semibold mb-3">Категорії</p>
          <ul className="space-y-2">
            <li><Link href="/categories/High%20Power%20Tractor" className="hover:underline">Шини для тракторів</Link></li>
            <li><Link href="/categories/Harvester" className="hover:underline">Шини для комбайнів</Link></li>
            <li><Link href="/categories/THL%2FCompact%20Loader" className="hover:underline">Шини для навантажувачів</Link></li>
            <li><Link href="/categories/Sprayer" className="hover:underline">Шини для обприскувачів</Link></li>
            <li><Link href="/categories/Flotation%2FAgri%20Transport" className="hover:underline">Шини для причіпної техніки</Link></li>
          </ul>
        </div>

        <div className="text-sm">
          <p className="font-semibold mb-3">Контакти</p>
          <p>Україна, Київська обл. смт. Глеваха, вул. Сулими, 11</p>
          <p className="mt-2"><a href="tel:+380504249510" className="hover:underline">+38 050 424 95 10 (Сергій)</a></p>
          <p className="mt-1"><a href="mailto:s.kostrov@agrosolar.com.ua" className="hover:underline">s.kostrov@agrosolar.com.ua</a></p>
        </div>
      </div>
      <div className="bg-[#004a93] py-4 text-center text-xs text-white/80">
        © {new Date().getFullYear()} ТОВ &ldquo;Агро-Солар&rdquo; офіційний імпортер шин CEAT в Україні. Всі права захищені.
      </div>
    </footer>
  );
}


