'use client';

import { useState, useEffect, useCallback } from 'react';
import { Filter, X } from 'lucide-react';
import { Product, fetchFilteredProducts, FilterOptions, PaginationInfo } from '@/lib/api';

interface ProductFiltersProps {
  onFiltersChange: (filteredProducts: Product[], pagination?: PaginationInfo) => void;
  onLoadingChange?: (loading: boolean) => void;
  currentCategory?: string;
  currentSize?: string;
}

export default function ProductFilters({ onFiltersChange, onLoadingChange, currentCategory, currentSize }: ProductFiltersProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedDiameter, setSelectedDiameter] = useState<string>('');
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [warehouseFilter, setWarehouseFilter] = useState<string>('all');
  const [allCategories, setAllCategories] = useState<string[]>([]);
  const [allDiameters, setAllDiameters] = useState<string[]>([]);
  const [availableCategories, setAvailableCategories] = useState<string[]>([]);
  const [availableDiameters, setAvailableDiameters] = useState<string[]>([]);
  const [availableSizes, setAvailableSizes] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  // Load all categories and diameters from API
  useEffect(() => {
    const loadFilterOptions = async () => {
      try {
        setLoading(true);
        const [categoriesResponse, productsResponse] = await Promise.all([
          fetch('/api/categories'),
          fetch('/api/products?limit=1000') // Get all products to extract diameters
        ]);

        if (categoriesResponse.ok && productsResponse.ok) {
          const [categoriesData, productsData] = await Promise.all([
            categoriesResponse.json(),
            productsResponse.json()
          ]);
          
          setAllCategories(categoriesData.categories || []);
          setAvailableCategories(categoriesData.categories || []);
          
          // Extract unique diameters from products
          const diameters = [...new Set(productsData.data.map((product: Product) => product.diameter).filter(Boolean))] as string[];
          const sortedDiameters = diameters.sort((a, b) => parseFloat(a) - parseFloat(b));
          setAllDiameters(sortedDiameters);
          setAvailableDiameters(sortedDiameters);
        }
      } catch (error) {
        console.error('Error loading filter options:', error);
        setAllCategories([]);
        setAllDiameters([]);
      } finally {
        setLoading(false);
      }
    };

    loadFilterOptions();
  }, []);

  // Initialize filters based on current category and size
  useEffect(() => {
    if (currentCategory) {
      setSelectedCategory(currentCategory);
    }
    if (currentSize) {
      setSelectedSize(currentSize);
      // Extract diameter from size (e.g., "710/70R42" -> "42")
      const diameterMatch = currentSize.match(/R(\d+)/);
      if (diameterMatch) {
        setSelectedDiameter(diameterMatch[1]);
      }
    }
  }, [currentCategory, currentSize]);

  // Update available options based on selected filters
  useEffect(() => {
    const updateAvailableOptions = async () => {
      if (!selectedCategory && !selectedDiameter) {
        // No filters selected, show all options
        setAvailableCategories(allCategories);
        setAvailableDiameters(allDiameters);
        setAvailableSizes([]);
        return;
      }

      try {
        const filters: FilterOptions = {
          page: 1,
          limit: 1000,
        };

        if (selectedCategory) {
          filters.categories = [selectedCategory];
        }

        const response = await fetchFilteredProducts(filters);
        const products = response.data;

        // Get unique categories, diameters, and sizes from filtered products
        const uniqueCategories = [...new Set(products.map(p => p.Category))];
        const uniqueDiameters = [...new Set(products.map(p => p.diameter).filter(Boolean))];
        const sortedDiameters = uniqueDiameters.sort((a, b) => parseFloat(a) - parseFloat(b));

        if (selectedCategory) {
          // If category is selected, show only diameters that exist with this category
          setAvailableDiameters(sortedDiameters);
          setAvailableCategories(allCategories); // Keep all categories available
          setAvailableSizes([]); // Clear sizes
        } else if (selectedDiameter) {
          // If diameter is selected, show only categories and sizes that exist with this diameter
          setAvailableCategories(uniqueCategories);
          setAvailableDiameters(allDiameters); // Keep all diameters available
          
          // Get sizes for selected diameter
          const diameterProducts = products.filter(p => p.diameter === selectedDiameter);
          const uniqueSizes = [...new Set(diameterProducts.map(p => p.size).filter(Boolean))];
          setAvailableSizes(uniqueSizes);
        }
      } catch (error) {
        console.error('Error updating available options:', error);
        setAvailableCategories(allCategories);
        setAvailableDiameters(allDiameters);
        setAvailableSizes([]);
      }
    };

    updateAvailableOptions();
  }, [selectedCategory, selectedDiameter, allCategories, allDiameters]);

  // Apply filters function (called manually)
  const applyFilters = useCallback(async () => {
    // If only category is selected and we're not already on that category page, navigate to category page
    if (selectedCategory && !selectedDiameter && !selectedSize && warehouseFilter === 'all' && selectedCategory !== currentCategory) {
      window.location.href = `/categories/${encodeURIComponent(selectedCategory)}`;
      return;
    }

    // If size is selected, navigate to size page (but not if we're already on that page)
    if (selectedSize && selectedDiameter && selectedSize !== currentSize) {
      window.location.href = `/sizes/${encodeURIComponent(selectedSize)}`;
      return;
    }

    // For any other combination, use client-side filtering
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

      if (warehouseFilter !== 'all') {
        filters.warehouse = warehouseFilter;
      }

      const response = await fetchFilteredProducts(filters);
      let filteredProducts = response.data;

      // Apply diameter filter on client side since it's not in the API
      if (selectedDiameter) {
        filteredProducts = filteredProducts.filter(product => product.diameter === selectedDiameter);
      }

      // Apply size filter on client side
      if (selectedSize) {
        filteredProducts = filteredProducts.filter(product => product.size === selectedSize);
      }

      onFiltersChange(filteredProducts, response.pagination);
    } catch (error) {
      console.error('Error applying filters:', error);
      onFiltersChange([]);
    } finally {
      if (onLoadingChange) {
        onLoadingChange(false);
      }
    }
  }, [selectedCategory, selectedDiameter, selectedSize, warehouseFilter, currentCategory, currentSize, onFiltersChange, onLoadingChange]);


  const clearFilters = () => {
    setSelectedCategory('');
    setSelectedDiameter('');
    setSelectedSize('');
    setWarehouseFilter('all');
    
    // If we're on a category or size page, navigate back to products page
    if (currentCategory || currentSize) {
      window.location.href = '/products';
    }
  };

  const handleWarehouseChange = (value: string) => {
    setWarehouseFilter(value);
  };

  const handleCategoryChange = (value: string) => {
    setSelectedCategory(value);
    // If diameter is selected and not compatible with new category, clear it
    if (value && selectedDiameter && !availableDiameters.includes(selectedDiameter)) {
      setSelectedDiameter('');
      setSelectedSize(''); // Also clear size
    }
  };

  const handleDiameterChange = (value: string) => {
    setSelectedDiameter(value);
    setSelectedSize(''); // Clear size when diameter changes
    // If category is selected and not compatible with new diameter, clear it
    if (value && selectedCategory && !availableCategories.includes(selectedCategory)) {
      setSelectedCategory('');
    }
  };

  const handleSizeChange = (value: string) => {
    setSelectedSize(value);
  };

  const activeFiltersCount = (selectedCategory ? 1 : 0) + (selectedDiameter ? 1 : 0) + 
    (selectedSize ? 1 : 0) + (warehouseFilter !== 'all' ? 1 : 0);

  const formatDiameterLabel = (value: string) => {
    const num = parseFloat(value);
    if (Number.isNaN(num)) return value + '"';
    return num.toString() + '"';
  };

  return (
    <div className="lg:sticky lg:top-4 lg:h-fit">
      {/* Mobile Filter Toggle */}
      <div className="lg:hidden mb-4">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 bg-[#008e4ed3] border border-white/20 rounded-lg px-4 py-2 text-sm font-medium text-white hover:bg-[#008e4ed3]/90"
        >
          <Filter className="w-4 h-4" />
          Фільтри
          {activeFiltersCount > 0 && (
            <span className="bg-white text-[#008e4ed3] text-xs rounded-full px-2 py-1">
              {activeFiltersCount}
            </span>
          )}
        </button>
      </div>

      {/* Filters Panel */}
      <div className={`lg:block ${isOpen ? 'block' : 'hidden'}`}>
        <div className="bg-[#008e4ed3] text-white border border-white/20 rounded-lg p-4 lg:p-6">
          {/* Header */}
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-white">Фільтри</h3>
          </div>

          {/* Diameter */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-white/90 mb-3">
              Діаметр
            </label>
            <select
              value={selectedDiameter}
              onChange={(e) => handleDiameterChange(e.target.value)}
              className="w-full px-3 py-2 border border-white/20 rounded-lg bg-white/10 text-white placeholder-white/70 focus:ring-2 focus:ring-white/50 focus:border-transparent"
            >
              <option value="" className="text-black">Всі діаметри</option>
              {loading ? (
                <option value="" className="text-black">Завантаження...</option>
              ) : (
                availableDiameters.map((diameter) => (
                  <option key={diameter} value={diameter} className="text-black">
                    {formatDiameterLabel(diameter)}
                  </option>
                ))
              )}
            </select>
          </div>

          {/* Size */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-white/90 mb-3">
              Розмір шини
            </label>
            <select
              value={selectedSize}
              onChange={(e) => handleSizeChange(e.target.value)}
              disabled={!selectedDiameter}
              className={`w-full px-3 py-2 border border-white/20 rounded-lg bg-white/10 text-white placeholder-white/70 focus:ring-2 focus:ring-white/50 focus:border-transparent ${
                !selectedDiameter ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              <option value="" className="text-black">
                {!selectedDiameter ? 'Виберіть діаметр' : 'Всі розміри'}
              </option>
              {loading ? (
                <option value="" className="text-black">Завантаження...</option>
              ) : (
                availableSizes.map((size) => (
                  <option key={size} value={size} className="text-black">
                    {size}
                  </option>
                ))
              )}
            </select>
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
                availableCategories.map((category) => (
                  <option key={category} value={category} className="text-black">
                    {category}
                  </option>
                ))
              )}
            </select>
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
                {selectedDiameter && (
                  <span className="inline-flex items-center gap-2 bg-[#008E4E]/20 text-white text-sm px-3 py-2 rounded-lg border border-[#008E4E]/30">
                    <span className="font-medium">Діаметр:</span>
                    <span>{formatDiameterLabel(selectedDiameter)}</span>
                    <button
                      onClick={() => {
                        setSelectedDiameter('');
                        setSelectedSize('');
                      }}
                      className="hover:bg-[#008E4E]/30 rounded-full p-1 transition-colors"
                      title="Видалити фільтр"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </span>
                )}
                {selectedSize && (
                  <span className="inline-flex items-center gap-2 bg-[#008E4E]/20 text-white text-sm px-3 py-2 rounded-lg border border-[#008E4E]/30">
                    <span className="font-medium">Розмір:</span>
                    <span>{selectedSize}</span>
                    <button
                      onClick={() => setSelectedSize('')}
                      className="hover:bg-[#008E4E]/30 rounded-full p-1 transition-colors"
                      title="Видалити фільтр"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </span>
                )}
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
