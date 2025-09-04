'use client';

import { useState, useEffect } from 'react';
import { fetchProducts, Product } from '@/lib/api';
import Link from 'next/link';
import { Package, Tractor, Construction, Car, Truck } from 'lucide-react';

interface CategoryStats {
  name: string;
  count: number;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
}

export default function CategoryGrid() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const data = await fetchProducts();
        setProducts(data);
      } catch (error) {
        console.error('Error loading products for categories:', error);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  const getCategoryStats = (): CategoryStats[] => {
    if (loading) return [];

    const categoryCounts = products.reduce((acc, product) => {
      acc[product.Category] = (acc[product.Category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const getCategoryIcon = (category: string) => {
      switch (category.toLowerCase()) {
        case 'agriculture':
        case 'high power tractor':
        case 'tractor r1':
        case 'fronts & implements':
          return <Tractor className="w-8 h-8" />;
        case 'construction':
        case 'compactor':
        case 'loader':
        case 'excavator':
          return <Construction className="w-8 h-8" />;
        case 'passenger car':
        case 'light truck':
          return <Car className="w-8 h-8" />;
        case 'truck':
        case 'bus':
          return <Truck className="w-8 h-8" />;
        default:
          return <Package className="w-8 h-8" />;
      }
    };

    const getCategoryColor = (category: string) => {
      switch (category.toLowerCase()) {
        case 'agriculture':
        case 'high power tractor':
        case 'tractor r1':
        case 'fronts & implements':
          return { text: 'text-green-600', bg: 'bg-green-50' };
        case 'construction':
        case 'compactor':
        case 'loader':
        case 'excavator':
          return { text: 'text-orange-600', bg: 'bg-orange-50' };
        case 'passenger car':
        case 'light truck':
          return { text: 'text-blue-600', bg: 'bg-blue-50' };
        case 'truck':
        case 'bus':
          return { text: 'text-purple-600', bg: 'bg-purple-50' };
        default:
          return { text: 'text-gray-600', bg: 'bg-gray-50' };
      }
    };

    return Object.entries(categoryCounts)
      .map(([name, count]) => {
        const colors = getCategoryColor(name);
        return {
          name,
          count,
          icon: getCategoryIcon(name),
          color: colors.text,
          bgColor: colors.bg,
        };
      })
      .sort((a, b) => b.count - a.count)
      .slice(0, 8); // Show top 8 categories
  };

  const categoryStats = getCategoryStats();

  if (loading) {
    return (
      <div className="py-12">
        <div className="animate-pulse">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-gray-200 h-32 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Популярні категорії
          </h2>
          <p className="text-lg text-gray-600">
            Оберіть категорію товарів, яка вас цікавить
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {categoryStats.map((category) => (
            <Link
              key={category.name}
              href={`/categories/${encodeURIComponent(category.name)}`}
              className={`group p-6 rounded-xl border-2 border-transparent hover:border-blue-200 transition-all duration-300 ${category.bgColor} hover:shadow-lg`}
            >
              <div className="text-center">
                <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full bg-white shadow-sm mb-4 group-hover:scale-110 transition-transform duration-300 ${category.color}`}>
                  {category.icon}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                  {category.name}
                </h3>
                <p className="text-sm text-gray-600">
                  {category.count} товарів
                </p>
              </div>
            </Link>
          ))}
        </div>

        <div className="text-center mt-8">
          <Link
            href="/products"
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors"
          >
            Переглянути всі товари
            <Package className="ml-2 w-5 h-5" />
          </Link>
        </div>
      </div>
    </section>
  );
}

