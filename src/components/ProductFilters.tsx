'use client';

import { useState, useEffect } from 'react';
import { Filter, X } from 'lucide-react';
import { Product } from '@/lib/api';

interface ProductFiltersProps {
  products: Product[];
  onFiltersChange: (filteredProducts: Product[]) => void;
}

export default function ProductFilters({ products, onFiltersChange }: ProductFiltersProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedSegments, setSelectedSegments] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  const [warehouseFilter, setWarehouseFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Get unique categories and segments
  const categories = [...new Set(products.map(p => p.Category))].sort();
  const segments = [...new Set(products.map(p => p.Segment))].sort();

  // Apply filters
  useEffect(() => {
    let filtered = [...products];

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(product =>
        product.product_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.model.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.sku.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Category filter
    if (selectedCategories.length > 0) {
      filtered = filtered.filter(product => selectedCategories.includes(product.Category));
    }

    // Segment filter
    if (selectedSegments.length > 0) {
      filtered = filtered.filter(product => selectedSegments.includes(product.Segment));
    }

    // Price range filter
    if (priceRange.min) {
      filtered = filtered.filter(product => parseFloat(product.regular_price) >= parseFloat(priceRange.min));
    }
    if (priceRange.max) {
      filtered = filtered.filter(product => parseFloat(product.regular_price) <= parseFloat(priceRange.max));
    }

    // Warehouse filter
    if (warehouseFilter !== 'all') {
      filtered = filtered.filter(product => product.warehouse.toLowerCase() === warehouseFilter);
    }

    onFiltersChange(filtered);
  }, [products, selectedCategories, selectedSegments, priceRange, warehouseFilter, searchQuery, onFiltersChange]);

  const clearFilters = () => {
    setSelectedCategories([]);
    setSelectedSegments([]);
    setPriceRange({ min: '', max: '' });
    setWarehouseFilter('all');
    setSearchQuery('');
  };

  const toggleCategory = (category: string) => {
    setSelectedCategories(prev =>
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const toggleSegment = (segment: string) => {
    setSelectedSegments(prev =>
      prev.includes(segment)
        ? prev.filter(s => s !== segment)
        : [...prev, segment]
    );
  };

  const activeFiltersCount = selectedCategories.length + selectedSegments.length + 
    (priceRange.min || priceRange.max ? 1 : 0) + (warehouseFilter !== 'all' ? 1 : 0);

  return (
    <div className="mb-6">
      {/* Mobile Filter Toggle */}
      <div className="lg:hidden mb-4">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 bg-[#0054a6] border border-white/20 rounded-lg px-4 py-2 text-sm font-medium text-white hover:bg-[#0054a6]/90"
        >
          <Filter className="w-4 h-4" />
          Фільтри
          {activeFiltersCount > 0 && (
            <span className="bg-white text-[#0054a6] text-xs rounded-full px-2 py-1">
              {activeFiltersCount}
            </span>
          )}
        </button>
      </div>

      {/* Filters Panel */}
      <div className={`lg:block ${isOpen ? 'block' : 'hidden'}`}>
        <div className="bg-[#0054a6] text-white border border-white/20 rounded-lg p-4 lg:p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">Фільтри</h3>
            {activeFiltersCount > 0 && (
              <button
                onClick={clearFilters}
                className="text-sm text-white/90 hover:text-white font-medium"
              >
                Очистити всі
              </button>
            )}
          </div>

          {/* Search */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-white/90 mb-2">
              Пошук
            </label>
            <input
              type="text"
              placeholder="Назва, модель або SKU..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-3 py-2 border border-white/20 rounded-lg bg-white/10 text-white placeholder-white/70 focus:ring-2 focus:ring-white/50 focus:border-transparent"
            />
          </div>

          {/* Categories */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-white/90 mb-3">
              Категорії
            </label>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {categories.map((category) => (
                <label key={category} className="flex items-center text-white/90">
                  <input
                    type="checkbox"
                    checked={selectedCategories.includes(category)}
                    onChange={() => toggleCategory(category)}
                    className="rounded border-white/40 text-white focus:ring-white/50"
                  />
                  <span className="ml-2 text-sm">{category}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Segments */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-white/90 mb-3">
              Сегменти
            </label>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {segments.map((segment) => (
                <label key={segment} className="flex items-center text-white/90">
                  <input
                    type="checkbox"
                    checked={selectedSegments.includes(segment)}
                    onChange={() => toggleSegment(segment)}
                    className="rounded border-white/40 text-white focus:ring-white/50"
                  />
                  <span className="ml-2 text-sm">{segment}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Price Range */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-white/90 mb-3">
              Діапазон цін (грн)
            </label>
            <div className="grid grid-cols-2 gap-3">
              <input
                type="number"
                placeholder="Від"
                value={priceRange.min}
                onChange={(e) => setPriceRange(prev => ({ ...prev, min: e.target.value }))}
                className="px-3 py-2 border border-white/20 rounded-lg bg-white/10 text-white placeholder-white/70 focus:ring-2 focus:ring-white/50 focus:border-transparent"
              />
              <input
                type="number"
                placeholder="До"
                value={priceRange.max}
                onChange={(e) => setPriceRange(prev => ({ ...prev, max: e.target.value }))}
                className="px-3 py-2 border border-white/20 rounded-lg bg-white/10 text-white placeholder-white/70 focus:ring-2 focus:ring-white/50 focus:border-transparent"
              />
            </div>
          </div>

          {/* Warehouse Status */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-white/90 mb-3">
              Наявність
            </label>
            <select
              value={warehouseFilter}
              onChange={(e) => setWarehouseFilter(e.target.value)}
              className="w-full px-3 py-2 border border-white/20 rounded-lg bg-white/10 text-white placeholder-white/70 focus:ring-2 focus:ring-white/50 focus:border-transparent"
            >
              <option value="all" className="text-black">Всі товари</option>
              <option value="in stock" className="text-black">В наявності</option>
              <option value="on order" className="text-black">Під замовлення</option>
              <option value="out of stock" className="text-black">Немає в наявності</option>
            </select>
          </div>

          {/* Active Filters Display */}
          {activeFiltersCount > 0 && (
            <div className="pt-4 border-t border-white/20">
              <div className="flex flex-wrap gap-2">
                {selectedCategories.map((category) => (
                  <span
                    key={category}
                    className="inline-flex items-center gap-1 bg-white/10 text-white text-xs px-2 py-1 rounded-full"
                  >
                    {category}
                    <button
                      onClick={() => toggleCategory(category)}
                      className="hover:bg-white/20 rounded-full p-0.5"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
                {selectedSegments.map((segment) => (
                  <span
                    key={segment}
                    className="inline-flex items-center gap-1 bg-white/10 text-white text-xs px-2 py-1 rounded-full"
                  >
                    {segment}
                    <button
                      onClick={() => toggleSegment(segment)}
                      className="hover:bg-white/20 rounded-full p-0.5"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
                {(priceRange.min || priceRange.max) && (
                  <span className="inline-flex items-center gap-1 bg-white/10 text-white text-xs px-2 py-1 rounded-full">
                    Ціна: {priceRange.min || '0'} - {priceRange.max || '∞'} грн
                    <button
                      onClick={() => setPriceRange({ min: '', max: '' })}
                      className="hover:bg-white/20 rounded-full p-0.5"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
                {warehouseFilter !== 'all' && (
                  <span className="inline-flex items-center gap-1 bg-white/10 text-white text-xs px-2 py-1 rounded-full">
                    {warehouseFilter === 'in stock' ? 'В наявності' : 
                     warehouseFilter === 'on order' ? 'Під замовлення' : 'Немає в наявності'}
                    <button
                      onClick={() => setWarehouseFilter('all')}
                      className="hover:bg-white/20 rounded-full p-0.5"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
