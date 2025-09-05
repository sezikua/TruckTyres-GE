import type { Metadata } from "next";
import { headers } from "next/headers";

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
  const canonical = `${baseUrl}/about`;
  return {
    title: "Про нас — CEAT Україна",
    description:
      "CEAT Україна: 15+ років досвіду, 500+ позицій шин на складі, інвестиції >2 млн євро в асортимент, 200 фахівців сервісу.",
    alternates: { canonical },
    openGraph: {
      title: "Про нас — CEAT Україна",
      description:
        "CEAT Україна: 15+ років досвіду, 500+ позицій шин на складі, інвестиції >2 млн євро в асортимент, 200 фахівців сервісу.",
      url: canonical,
      type: "website",
      siteName: "CEAT Україна",
    },
    twitter: {
      card: "summary_large_image",
      title: "Про нас — CEAT Україна",
      description:
        "CEAT Україна: 15+ років досвіду, 500+ позицій шин на складі, інвестиції >2 млн євро в асортимент, 200 фахівців сервісу.",
    },
  };
}

export default function AboutPage() {
  return (
    <div className="bg-background">
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[#0054a6]/10" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight">Про нас</h1>
          <p className="mt-4 max-w-2xl text-foreground/80">
            Ми забезпечуємо аграріїв України надійними шинами CEAT для будь-якої сільськогосподарської техніки — зі складу та під замовлення.
          </p>
          <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard value="500+" text="Ваш вибір без компромісів: наш склад налічує понад 500 найменувань с/г шин, що дозволяє швидко підібрати ідеальне рішення для будь-якої техніки." />
            <StatCard value="2 000 000€" text="Гарантія якості та асортименту: більше 2 000 000 євро інвестицій у розширення асортименту шин — це наше зобов'язання перед вами щодо наявності найкращих пропозицій." />
            <StatCard value="15+" text="Досвід, що вимірюється роками: 15+ років на ринку сільгоспшин – це тисячі задоволених клієнтів та успішних сезонів." />
            <StatCard value="200" text="Сила нашої команди: 200 відданих своїй справі співробітників — від консультантів до логістів — готові забезпечити першокласний сервіс." />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="rounded-2xl border border-black/10 dark:border-white/10 p-6 md:p-10 bg-white dark:bg-black/20">
          <h2 className="text-xl font-semibold">Наш підхід</h2>
          <p className="mt-3 text-foreground/80">
            Ми працюємо у партнерстві з фермерами та дилерами, пропонуючи підбір, доставку та післяпродажну підтримку. Наш пріоритет — надійність і економічність рішень.
          </p>
        </div>
      </section>
    </div>
  );
}

function StatCard({ value, text }: { value: string; text: string }) {
  return (
    <div className="rounded-xl border border-black/10 dark:border-white/10 bg-white dark:bg-black/20 p-6">
      <div className="flex items-start gap-3">
        <div className="h-10 w-10 rounded-md bg-[#0054a6] text-white flex items-center justify-center text-sm font-semibold">i</div>
        <div>
          <div className="text-3xl font-extrabold tracking-tight">{value}</div>
          <p className="mt-2 text-sm text-foreground/80">{text}</p>
        </div>
      </div>
    </div>
  );
}





