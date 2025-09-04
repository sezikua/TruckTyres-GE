import Image from "next/image";
import Link from "next/link";

export default function Home() {
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
    </section>
  );
}

function CategoriesGrid() {
  const categories: { title: string; image?: string }[] = [
    { title: "Шини для тракторів", image: "/tractor-caregory.avif" },
    { title: "Шини для комбайнів", image: "/harvest-caregory.avif" },
    { title: "Шини для навантажувачів", image: "/loader-caregory.avif" },
    { title: "Шини для обприскувачів", image: "/splayer-caregory.avif" },
    { title: "Шини для причіпної техніки", image: "/trailer-caregory.avif" },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
      {categories.map(({ title, image }) => (
        <Link
          key={title}
          href="/products"
          className="group rounded-lg border border-black/10 dark:border-white/10 overflow-hidden hover:shadow-md transition-all hover:-translate-y-0.5 bg-white dark:bg-black/20"
        >
          <div className="relative aspect-square w-full">
            {image ? (
              <Image
                src={image}
                alt={title}
                fill
                sizes="(max-width: 1024px) 50vw, 18vw"
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
  );
}

