'use client';

import { useState, useEffect, useRef } from 'react';
import { Search, X, Loader2 } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { Product } from '@/lib/api';

interface SearchResult {
  type: 'product' | 'category' | 'news';
  id: number;
  title: string;
  description?: string;
  url: string;
  image?: string;
}

export default function SearchBar() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (query.length < 2) {
      setResults([]);
      setShowResults(false);
      return;
    }

    const searchProducts = async () => {
      setIsSearching(true);
      try {
        // Пошук по товарах
        const response = await fetch(`/api/products?search=${encodeURIComponent(query)}&limit=50`);
        const data = await response.json();
        
        const searchResults: SearchResult[] = [];
        
        // Додаємо товари
        if (data.products) {
          data.products.forEach((product: Product) => {
            searchResults.push({
              type: 'product',
              id: product.id,
              title: product.product_name,
              description: `${product.model} - ${product.size}`,
              url: `/products/${product.id}`,
              image: product.product_image || undefined
            });
          });
        }

        // Додаємо категорії (якщо є)
        const categories = [
          'Шини для тракторів',
          'Шини для комбайнів', 
          'Шини для навантажувачів',
          'Шини для обприскувачів',
          'Шини для причіпної техніки'
        ];

        categories.forEach(category => {
          if (category.toLowerCase().includes(query.toLowerCase())) {
            searchResults.push({
              type: 'category',
              id: searchResults.length + 1,
              title: category,
              description: 'Категорія товарів',
              url: `/categories/${encodeURIComponent(category)}`
            });
          }
        });

        // Додаємо новини (якщо є)
        if (query.toLowerCase().includes('новини') || query.toLowerCase().includes('news')) {
          searchResults.push({
            type: 'news',
            id: searchResults.length + 1,
            title: 'Новини та оновлення',
            description: 'Останні новини про продукцію CEAT',
            url: '/news'
          });
        }

        setResults(searchResults);
        setShowResults(true);
      } catch (error) {
        console.error('Помилка пошуку:', error);
        setResults([]);
      } finally {
        setIsSearching(false);
      }
    };

    const debounceTimer = setTimeout(searchProducts, 300);
    return () => clearTimeout(debounceTimer);
  }, [query]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      setShowResults(true);
    }
  };

  const clearSearch = () => {
    setQuery('');
    setResults([]);
    setShowResults(false);
  };

  return (
    <div className="relative" ref={searchRef}>
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Пошук товарів, категорій..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => query.length >= 2 && setShowResults(true)}
            className="w-64 pl-10 pr-10 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-white/50 transition-all"
          />
          {query && (
            <button
              type="button"
              onClick={clearSearch}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/70 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </form>

      {/* Search Results Dropdown */}
      {showResults && (query.length >= 2) && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-neutral-800 rounded-lg shadow-xl border border-gray-200 dark:border-neutral-700 max-h-96 overflow-y-auto z-50">
          {isSearching ? (
            <div className="p-4 text-center text-gray-500">
              <Loader2 className="w-5 h-5 animate-spin mx-auto mb-2" />
              <p>Пошук...</p>
            </div>
          ) : results.length === 0 ? (
            <div className="p-4 text-center text-gray-500">
              <p>Нічого не знайдено</p>
              <p className="text-sm">Спробуйте змінити пошуковий запит</p>
            </div>
          ) : (
            <div className="py-2">
              {results.map((result) => (
                <Link
                  key={`${result.type}-${result.id}`}
                  href={result.url}
                  onClick={() => {
                    setShowResults(false);
                    setQuery('');
                  }}
                  className="block px-4 py-3 hover:bg-gray-50 dark:hover:bg-neutral-700 transition-colors"
                >
                  <div className="flex items-start gap-3">
                    {result.image && (
                      <div className="w-12 h-12 bg-gray-100 dark:bg-neutral-600 rounded-lg overflow-hidden flex-shrink-0 relative">
                        <Image
                          src={result.image}
                          alt={result.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                          {result.title}
                        </span>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          result.type === 'product' 
                            ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                            : result.type === 'category'
                            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                            : 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
                        }`}>
                          {result.type === 'product' ? 'Товар' : result.type === 'category' ? 'Категорія' : 'Новини'}
                        </span>
                      </div>
                      {result.description && (
                        <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                          {result.description}
                        </p>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
