import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { headers } from "next/headers";
import ProductCard from "@/components/ProductCard";

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
  const title = "CEAT Каталог — Сільськогосподарські шини";
  const description = "Офіційний імпортер шин CEAT в Україні. Каталог шин для тракторів, комбайнів, навантажувачів, обприскувачів та причепів.";
  const canonical = `${baseUrl}/`;
  const ogImage = `${baseUrl}/cstl-logo-eu-as.avif`;

  return {
    title,
    description,
    alternates: { canonical },
    openGraph: {
      title,
      description,
      url: canonical,
      type: "website",
      images: [{ url: ogImage, alt: "CEAT Україна" }],
      siteName: "CEAT Україна",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
  };
}

async function getDiscountedProducts() {
  try {
    // Отримуємо товари напряму з Directus API на сервері
    const directusUrl = process.env.DIRECTUS_URL || 'http://173.212.215.18:8055';
    const directusToken = process.env.DIRECTUS_TOKEN || 'wFd_KOyK9LJEZSe98DEu8Uww5wKGg1qD';
    
    // Запит саме по товарах зі знижкою (discount_price не null і менше за regular_price)
    const url = `${directusUrl}/items/Product?filter[discount_price][_nnull]=true&filter[discount_price][_lt]=regular_price&page=1&limit=100&meta=total_count`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${directusToken}`,
      },
      next: { revalidate: 300 } // Revalidate every 5 minutes
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const discountedProducts: any[] = data.data || [];
    
    // Перемішуємо та беремо перші 20
    const shuffled = discountedProducts.sort(() => Math.random() - 0.5);
    return shuffled.slice(0, 20);
  } catch (error) {
    console.error('Error fetching discounted products:', error);
    return [];
  }
}

export default async function Home() {
  const discountedProducts = await getDiscountedProducts();

  return (
    <section>
      <div className="relative overflow-hidden">
        <video
          className="absolute inset-0 h-full w-full object-cover opacity-70 pointer-events-none"
          src="/website-video-desktop.mp4"
          autoPlay
          muted
          loop
          playsInline
        />
        <div className="absolute inset-0 bg-black/30" />
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-16 pb-20">
          <div className="max-w-2xl relative z-10 text-white">
            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight drop-shadow">
              CEAT — сільськогосподарські шини преміум якості
            </h1>
            <p className="mt-4 text-base sm:text-lg text-white/90">
              Надійність, зчеплення та довговічність для тракторів, комбайнів, навантажувачів,
              обприскувачів і причепів.
            </p>
            <div className="mt-8 flex items-center gap-4">
              <Link href="/products" className="inline-flex h-11 items-center rounded-md bg-[#0054a6] px-6 text-white shadow-sm transition hover:opacity-90">
                Перейти в каталог
              </Link>
              <Link href="/contacts" className="inline-flex h-11 items-center rounded-md border px-6 border-white/30 hover:bg-white/10 transition text-white">
                Консультація
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-2xl font-bold mb-6">Категорії</h2>
        <CategoriesGrid />
      </div>

      {/* Discounted Products Section */}
      {discountedProducts.length > 0 && (
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 bg-foreground/5">
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-2">Товари зі знижкою</h2>
            <p className="text-foreground/70">Спеціальні пропозиції на шини CEAT</p>
          </div>
          
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-6">
            {discountedProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      )}
    </section>
  );
}

function CategoriesGrid() {
  const categories: { title: string; image?: string; href: string }[] = [
    { title: "Шини для тракторів", image: "/tractor-caregory.avif", href: "/categories/High%20Power%20Tractor" },
    { title: "Шини для комбайнів", image: "/harvest-caregory.avif", href: "/categories/Harvester" },
    { title: "Шини для навантажувачів", image: "/loader-caregory.avif", href: "/categories/THL%2FCompact%20Loader" },
    { title: "Шини для обприскувачів", image: "/splayer-caregory.avif", href: "/categories/Sprayer" },
    { title: "Шини для причіпної техніки", image: "/trailer-caregory.avif", href: "/categories/Flotation%2FAgri%20Transport" },
  ];

  const [firstCategory, ...otherCategories] = categories;

  return (
    <div className="space-y-4">
      {/* Мобільна версія: перша категорія на всю ширину, решта по 2 */}
      <div className="lg:hidden space-y-4">
        {/* Перша категорія - на всю ширину на мобільних */}
        <Link
          href={firstCategory.href}
          className="group block rounded-lg border border-black/10 dark:border-white/10 overflow-hidden hover:shadow-md transition-all hover:-translate-y-0.5 bg-white dark:bg-black/20"
        >
          <div className="relative aspect-square w-full">
            {firstCategory.image ? (
              <Image
                src={firstCategory.image}
                alt={firstCategory.title}
                fill
                sizes="100vw"
                className="object-cover"
                priority
              />
            ) : (
              <div className="h-full w-full bg-[#0054a6]/15" />
            )}
          </div>
          <div className="p-4">
            <p className="font-medium group-hover:text-[#0054a6] transition-colors">{firstCategory.title}</p>
          </div>
        </Link>

        {/* Решта категорій - по 2 в ряд на мобільних */}
        <div className="grid grid-cols-2 gap-4">
          {otherCategories.map(({ title, image, href }) => (
            <Link
              key={title}
              href={href}
              className="group rounded-lg border border-black/10 dark:border-white/10 overflow-hidden hover:shadow-md transition-all hover:-translate-y-0.5 bg-white dark:bg-black/20"
            >
              <div className="relative aspect-square w-full">
                {image ? (
                  <Image
                    src={image}
                    alt={title}
                    fill
                    sizes="50vw"
                    className="object-cover"
                    priority
                  />
                ) : (
                  <div className="h-full w-full bg-[#0054a6]/15" />
                )}
              </div>
              <div className="p-4">
                <p className="font-medium group-hover:text-[#0054a6] transition-colors">{title}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Десктопна версія: всі 5 категорій в одному рядку */}
      <div className="hidden lg:grid lg:grid-cols-5 gap-4">
        {categories.map(({ title, image, href }) => (
          <Link
            key={title}
            href={href}
            className="group rounded-lg border border-black/10 dark:border-white/10 overflow-hidden hover:shadow-md transition-all hover:-translate-y-0.5 bg-white dark:bg-black/20"
          >
            <div className="relative aspect-square w-full">
              {image ? (
                <Image
                  src={image}
                  alt={title}
                  fill
                  sizes="18vw"
                  className="object-cover"
                  priority
                />
              ) : (
                <div className="h-full w-full bg-[#0054a6]/15" />
              )}
            </div>
            <div className="p-4">
              <p className="font-medium group-hover:text-[#0054a6] transition-colors">{title}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

