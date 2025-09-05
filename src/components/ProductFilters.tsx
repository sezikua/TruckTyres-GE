'use client';

import { useState, useEffect, useCallback } from 'react';
import { Filter, X } from 'lucide-react';
import { Product, fetchFilteredProducts, FilterOptions, PaginationInfo } from '@/lib/api';

interface ProductFiltersProps {
  onFiltersChange: (filteredProducts: Product[], pagination?: PaginationInfo) => void;
  onLoadingChange?: (loading: boolean) => void;
}

export default function ProductFilters({ onFiltersChange, onLoadingChange }: ProductFiltersProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedSegment, setSelectedSegment] = useState<string>('');
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  const [warehouseFilter, setWarehouseFilter] = useState<string>('all');
  const [allCategories, setAllCategories] = useState<string[]>([]);
  const [allSegments, setAllSegments] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  // Load all categories and segments from API
  useEffect(() => {
    const loadFilterOptions = async () => {
      try {
        setLoading(true);
        const [categoriesResponse, segmentsResponse] = await Promise.all([
          fetch('/api/categories'),
          fetch('/api/segments')
        ]);

        if (categoriesResponse.ok && segmentsResponse.ok) {
          const [categoriesData, segmentsData] = await Promise.all([
            categoriesResponse.json(),
            segmentsResponse.json()
          ]);
          
          setAllCategories(categoriesData.categories || []);
          setAllSegments(segmentsData.segments || []);
        }
      } catch (error) {
        console.error('Error loading filter options:', error);
        setAllCategories([]);
        setAllSegments([]);
      } finally {
        setLoading(false);
      }
    };

    loadFilterOptions();
  }, []);

  // Apply filters function (called manually)
  const applyFilters = useCallback(async () => {
    try {
      if (onLoadingChange) {
        onLoadingChange(true);
      }

      const filters: FilterOptions = {
        page: 1,
        limit: 1000, // Get more products for filtering
      };

      if (selectedCategory) {
        filters.categories = [selectedCategory];
      }

      if (selectedSegment) {
        filters.segments = [selectedSegment];
      }


      if (priceRange.min) {
        filters.minPrice = priceRange.min;
      }

      if (priceRange.max) {
        filters.maxPrice = priceRange.max;
      }

      if (warehouseFilter !== 'all') {
        filters.warehouse = warehouseFilter;
      }

      const response = await fetchFilteredProducts(filters);
      onFiltersChange(response.data, response.pagination);
    } catch (error) {
      console.error('Error applying filters:', error);
      onFiltersChange([]);
    } finally {
      if (onLoadingChange) {
        onLoadingChange(false);
      }
    }
  }, [selectedCategory, selectedSegment, priceRange, warehouseFilter, onFiltersChange, onLoadingChange]);


  const clearFilters = () => {
    setSelectedCategory('');
    setSelectedSegment('');
    setPriceRange({ min: '', max: '' });
    setWarehouseFilter('all');
  };

  const handlePriceChange = (field: 'min' | 'max', value: string) => {
    setPriceRange(prev => ({ ...prev, [field]: value }));
  };

  const handleWarehouseChange = (value: string) => {
    setWarehouseFilter(value);
  };

  const handleCategoryChange = (value: string) => {
    setSelectedCategory(value);
  };

  const handleSegmentChange = (value: string) => {
    setSelectedSegment(value);
  };

  const activeFiltersCount = (selectedCategory ? 1 : 0) + (selectedSegment ? 1 : 0) + 
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
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-white">Фільтри</h3>
          </div>


          {/* Categories */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-white/90 mb-3">
              Категорія
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => handleCategoryChange(e.target.value)}
              className="w-full px-3 py-2 border border-white/20 rounded-lg bg-white/10 text-white placeholder-white/70 focus:ring-2 focus:ring-white/50 focus:border-transparent"
            >
              <option value="" className="text-black">Всі категорії</option>
              {loading ? (
                <option value="" className="text-black">Завантаження...</option>
              ) : (
                allCategories.map((category) => (
                  <option key={category} value={category} className="text-black">
                    {category}
                  </option>
                ))
              )}
            </select>
          </div>

          {/* Segments */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-white/90 mb-3">
              Сегмент
            </label>
            <select
              value={selectedSegment}
              onChange={(e) => handleSegmentChange(e.target.value)}
              className="w-full px-3 py-2 border border-white/20 rounded-lg bg-white/10 text-white placeholder-white/70 focus:ring-2 focus:ring-white/50 focus:border-transparent"
            >
              <option value="" className="text-black">Всі сегменти</option>
              {loading ? (
                <option value="" className="text-black">Завантаження...</option>
              ) : (
                allSegments.map((segment) => (
                  <option key={segment} value={segment} className="text-black">
                    {segment}
                  </option>
                ))
              )}
            </select>
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
                onChange={(e) => handlePriceChange('min', e.target.value)}
                className="px-3 py-2 border border-white/20 rounded-lg bg-white/10 text-white placeholder-white/70 focus:ring-2 focus:ring-white/50 focus:border-transparent"
              />
              <input
                type="number"
                placeholder="До"
                value={priceRange.max}
                onChange={(e) => handlePriceChange('max', e.target.value)}
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
              onChange={(e) => handleWarehouseChange(e.target.value)}
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
            <div className="mb-6 p-4 bg-white/5 rounded-lg border border-white/10">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-semibold text-white">
                  Застосовані фільтри ({activeFiltersCount})
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {selectedCategory && (
                  <span className="inline-flex items-center gap-2 bg-[#008E4E]/20 text-white text-sm px-3 py-2 rounded-lg border border-[#008E4E]/30">
                    <span className="font-medium">Категорія:</span>
                    <span>{selectedCategory}</span>
                    <button
                      onClick={() => setSelectedCategory('')}
                      className="hover:bg-[#008E4E]/30 rounded-full p-1 transition-colors"
                      title="Видалити фільтр"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </span>
                )}
                {selectedSegment && (
                  <span className="inline-flex items-center gap-2 bg-[#008E4E]/20 text-white text-sm px-3 py-2 rounded-lg border border-[#008E4E]/30">
                    <span className="font-medium">Сегмент:</span>
                    <span>{selectedSegment}</span>
                    <button
                      onClick={() => setSelectedSegment('')}
                      className="hover:bg-[#008E4E]/30 rounded-full p-1 transition-colors"
                      title="Видалити фільтр"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </span>
                )}
                {(priceRange.min || priceRange.max) && (
                  <span className="inline-flex items-center gap-2 bg-[#008E4E]/20 text-white text-sm px-3 py-2 rounded-lg border border-[#008E4E]/30">
                    <span className="font-medium">Ціна:</span>
                    <span>{priceRange.min || '0'} - {priceRange.max || '∞'} грн</span>
                    <button
                      onClick={() => setPriceRange({ min: '', max: '' })}
                      className="hover:bg-[#008E4E]/30 rounded-full p-1 transition-colors"
                      title="Видалити фільтр"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </span>
                )}
                {warehouseFilter !== 'all' && (
                  <span className="inline-flex items-center gap-2 bg-[#008E4E]/20 text-white text-sm px-3 py-2 rounded-lg border border-[#008E4E]/30">
                    <span className="font-medium">Наявність:</span>
                    <span>
                      {warehouseFilter === 'in stock' ? 'В наявності' : 
                       warehouseFilter === 'on order' ? 'Під замовлення' : 'Немає в наявності'}
                    </span>
                    <button
                      onClick={() => setWarehouseFilter('all')}
                      className="hover:bg-[#008E4E]/30 rounded-full p-1 transition-colors"
                      title="Видалити фільтр"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="pt-4 border-t border-white/20 mt-6">
            <div className="space-y-3">
              <button
                onClick={applyFilters}
                className="w-full bg-[#008E4E] hover:bg-[#007A42] text-white px-4 py-3 rounded-lg font-medium transition-colors"
              >
                Застосувати фільтри
              </button>
              <button
                onClick={clearFilters}
                className={`w-full px-4 py-3 rounded-lg font-medium transition-colors ${
                  activeFiltersCount > 0 
                    ? 'bg-white/10 hover:bg-white/20 text-white' 
                    : 'bg-white/5 text-white/50 cursor-not-allowed'
                }`}
                disabled={activeFiltersCount === 0}
              >
                Скинути фільтри {activeFiltersCount > 0 && `(${activeFiltersCount})`}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
