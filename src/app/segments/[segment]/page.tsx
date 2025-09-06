'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { fetchProductsBySegment, Product } from '@/lib/api';
import ProductCard from '@/components/ProductCard';
import ProductFilters from '@/components/ProductFilters';
import { Loader2, Package, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function SegmentPage() {
  const params = useParams();
  const [, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadProducts = async () => {
      if (!params.segment) return;
      
      try {
        setLoading(true);
        const segment = decodeURIComponent(params.segment as string);
        const data = await fetchProductsBySegment(segment);
        setProducts(data.data);
        setFilteredProducts(data.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Помилка завантаження товарів');
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, [params.segment]);

  const handleFiltersChange = (filtered: Product[]) => {
    setFilteredProducts(filtered);
  };

  const handleLoadingChange = (loading: boolean) => {
    setLoading(loading);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-foreground/70">Завантаження товарів...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <Package className="w-16 h-16 mx-auto mb-4 text-red-500" />
          <h2 className="text-xl font-semibold text-foreground mb-2">Помилка завантаження</h2>
          <p className="text-foreground/70 mb-4">{error}</p>
          <Link
            href="/products"
            className="bg-primary text-background px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors"
          >
            Повернутися до каталогу
          </Link>
        </div>
      </div>
    );
  }

  const segmentName = decodeURIComponent(params.segment as string);

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <nav className="mb-4">
            <Link
              href="/products"
              className="inline-flex items-center text-sm text-foreground/70 hover:text-foreground transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Повернутися до каталогу
            </Link>
          </nav>
          
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Сегмент: {segmentName}
          </h1>
          <p className="text-foreground/70">
            Знайдено {filteredProducts.length} товарів у сегменті &ldquo;{segmentName}&rdquo;
          </p>
        </div>

        <div className="lg:grid lg:grid-cols-4 lg:gap-8">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <ProductFilters 
              onFiltersChange={handleFiltersChange}
              onLoadingChange={handleLoadingChange}
            />
          </div>

          {/* Products Grid */}
          <div className="lg:col-span-3">
            {filteredProducts.length === 0 ? (
              <div className="text-center py-12">
                <Package className="w-16 h-16 mx-auto mb-4 text-foreground/40" />
                <h3 className="text-lg font-medium text-foreground mb-2">Товари не знайдено</h3>
                <p className="text-foreground/70">
                  У цьому сегменті поки немає товарів
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
