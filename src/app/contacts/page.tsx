import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Контакти — CEAT Україна",
  description: "Адреса, телефон та email офіційного імпортера шин CEAT в Україні.",
};

export default function ContactsPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-center mb-8">Контакти</h1>

      <div className="text-center space-y-4">
        <p className="text-lg">Продажа шин до с/г техніки в родріб та оптом.</p>
        <p className="text-lg">
          тел.: <a href="tel:+380504249510" className="text-[#0054a6] hover:underline font-semibold">+38 050 424 95 10</a> Сергій
        </p>
        <p className="text-lg">
          Для замовлення пишіть на пошту
          <br />
          <a href="mailto:s.kostrov@agrosolar.com.ua" className="text-[#0054a6] hover:underline font-semibold">s.kostrov@agrosolar.com.ua</a>
        </p>
      </div>

      <div className="mt-10 text-center">
        <h2 className="text-2xl font-bold mb-4">Наші адреси</h2>
        <div className="space-y-6 text-lg">
          <div>
            <p className="font-semibold">Центральний склад, Київська область</p>
            <p>смт Глеваха, вул. Сулими, 11</p>
          </div>
          <div>
            <p className="font-semibold">Склад, м. Хмельницький</p>
            <p>вул. Романа Шухевича, 123</p>
          </div>
        </div>
      </div>

      {/* Full-bleed map */}
      <div className="mt-10 relative left-1/2 right-1/2 -mx-[50vw] w-screen">
        <iframe
          src="/map/map.html"
          title="Карта складів CEAT"
          className="block w-screen"
          style={{ height: 520 }}
        />
      </div>
    </div>
  );
}





