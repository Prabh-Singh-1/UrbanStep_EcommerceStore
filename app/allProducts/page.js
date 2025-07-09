"use client"
import React, { useState, useEffect } from 'react';
import { Search, Filter, Grid, List, Star, Heart, ShoppingBag, ChevronDown, SlidersHorizontal, ArrowUpDown } from 'lucide-react';

const ProductsPage = () => {
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
    const [showFilters, setShowFilters] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [productsPerPage] = useState(12);

    // Filter states
    const [filters, setFilters] = useState({
        category: '',
        priceRange: '',
        brand: '',
        rating: '',
        size: '',
        color: '',
        sortBy: 'newest'
    });

    const [searchQuery, setSearchQuery] = useState('');

    // Mock data (replace with API call)
    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000));

            const mockProducts = [
                {
                    id: 1,
                    name: "Nike Air Max 270",
                    price: 150,
                    originalPrice: 180,
                    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop",
                    category: "Athletic",
                    brand: "Nike",
                    rating: 4.8,
                    reviewCount: 245,
                    colors: ["Black", "White", "Red"],
                    sizes: [7, 8, 9, 10, 11, 12],
                    isNew: true,
                    isSale: true,
                    description: "Premium athletic shoes with superior comfort and style"
                },
                {
                    id: 2,
                    name: "Adidas Ultraboost 22",
                    price: 180,
                    originalPrice: 220,
                    image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=400&fit=crop",
                    category: "Athletic",
                    brand: "Adidas",
                    rating: 4.9,
                    reviewCount: 189,
                    colors: ["Black", "White", "Blue"],
                    sizes: [7, 8, 9, 10, 11],
                    isNew: false,
                    isSale: true,
                    description: "Revolutionary energy return technology for maximum performance"
                },
                {
                    id: 3,
                    name: "Converse Chuck Taylor",
                    price: 65,
                    originalPrice: 80,
                    image: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=400&h=400&fit=crop",
                    category: "Casual",
                    brand: "Converse",
                    rating: 4.6,
                    reviewCount: 324,
                    colors: ["Black", "White", "Red", "Blue"],
                    sizes: [6, 7, 8, 9, 10, 11, 12],
                    isNew: false,
                    isSale: false,
                    description: "Classic canvas shoes that never go out of style"
                },
                {
                    id: 4,
                    name: "Dr. Martens 1460",
                    price: 170,
                    originalPrice: 200,
                    image: "https://images.unsplash.com/photo-1544966503-7cc5ac882d5e?w=400&h=400&fit=crop",
                    category: "Boots",
                    brand: "Dr. Martens",
                    rating: 4.7,
                    reviewCount: 156,
                    colors: ["Black", "Brown"],
                    sizes: [7, 8, 9, 10, 11, 12],
                    isNew: false,
                    isSale: true,
                    description: "Iconic leather boots built to last a lifetime"
                },
                {
                    id: 5,
                    name: "Vans Old Skool",
                    price: 60,
                    originalPrice: 75,
                    image: "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=400&h=400&fit=crop",
                    category: "Casual",
                    brand: "Vans",
                    rating: 4.5,
                    reviewCount: 278,
                    colors: ["Black", "White", "Blue", "Red"],
                    sizes: [6, 7, 8, 9, 10, 11, 12],
                    isNew: false,
                    isSale: false,
                    description: "Timeless skate shoes with signature side stripe"
                },
                {
                    id: 6,
                    name: "Puma RS-X",
                    price: 110,
                    originalPrice: 130,
                    image: "https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?w=400&h=400&fit=crop",
                    category: "Athletic",
                    brand: "Puma",
                    rating: 4.4,
                    reviewCount: 167,
                    colors: ["Black", "White", "Yellow"],
                    sizes: [7, 8, 9, 10, 11, 12],
                    isNew: true,
                    isSale: true,
                    description: "Retro-inspired running shoes with modern comfort"
                }
            ];

            // Duplicate products to show pagination
            const allProducts = [...mockProducts, ...mockProducts.map(p => ({ ...p, id: p.id + 6 }))];
            setProducts(allProducts);
            setFilteredProducts(allProducts);
            setLoading(false);
        };

        fetchProducts();
    }, []);

    // Filter and search logic
    useEffect(() => {
        let filtered = products.filter(product => {
            const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                product.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
                product.category.toLowerCase().includes(searchQuery.toLowerCase());

            const matchesCategory = !filters.category || product.category === filters.category;
            const matchesBrand = !filters.brand || product.brand === filters.brand;
            const matchesRating = !filters.rating || product.rating >= parseFloat(filters.rating);

            let matchesPrice = true;
            if (filters.priceRange) {
                const [min, max] = filters.priceRange.split('-').map(Number);
                matchesPrice = product.price >= min && (max ? product.price <= max : true);
            }

            return matchesSearch && matchesCategory && matchesBrand && matchesRating && matchesPrice;
        });

        // Sort products
        filtered.sort((a, b) => {
            switch (filters.sortBy) {
                case 'price-low':
                    return a.price - b.price;
                case 'price-high':
                    return b.price - a.price;
                case 'rating':
                    return b.rating - a.rating;
                case 'name':
                    return a.name.localeCompare(b.name);
                default:
                    return b.id - a.id; // newest first
            }
        });

        setFilteredProducts(filtered);
        setCurrentPage(1);
    }, [products, searchQuery, filters]);

    // Pagination
    const indexOfLastProduct = currentPage * productsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
    const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);
    const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

    const handleFilterChange = (filterType, value) => {
        setFilters(prev => ({ ...prev, [filterType]: value }));
    };

    const clearFilters = () => {
        setFilters({
            category: '',
            priceRange: '',
            brand: '',
            rating: '',
            size: '',
            color: '',
            sortBy: 'newest'
        });
        setSearchQuery('');
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white shadow-sm border-b">
                <div className="max-w-7xl mx-auto px-6 py-8">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                        <div>
                            <h1 className="text-4xl font-bold text-gray-900 mb-2">All Products</h1>
                            <p className="text-gray-600">Discover your perfect pair from {filteredProducts.length} amazing shoes</p>
                        </div>
                        <div className="flex items-center gap-4 mt-4 md:mt-0">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <input
                                    type="text"
                                    placeholder="Search shoes..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                            <button
                                onClick={() => setShowFilters(!showFilters)}
                                className="flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors"
                            >
                                <SlidersHorizontal className="w-5 h-5" />
                                Filters
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 py-8">
                <div className="flex gap-8">
                    {/* Filters Sidebar */}
                    <div className={`${showFilters ? 'block' : 'hidden'} flex-wrap justify-center items-center lg:block w-80 flex-shrink-0`}>
                        <div className="bg-white rounded-lg shadow-sm p-6 sticky top-6">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
                                <button
                                    onClick={clearFilters}
                                    className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                                >
                                    Clear All
                                </button>
                            </div>

                            {/* Category Filter */}
                            <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-700 mb-3">Category</label>
                                <select
                                    value={filters.category}
                                    onChange={(e) => handleFilterChange('category', e.target.value)}
                                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="">All Categories</option>
                                    <option value="Athletic">Athletic</option>
                                    <option value="Casual">Casual</option>
                                    <option value="Formal">Formal</option>
                                    <option value="Boots">Boots</option>
                                </select>
                            </div>

                            {/* Brand Filter */}
                            <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-700 mb-3">Brand</label>
                                <select
                                    value={filters.brand}
                                    onChange={(e) => handleFilterChange('brand', e.target.value)}
                                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="">All Brands</option>
                                    <option value="Nike">Nike</option>
                                    <option value="Adidas">Adidas</option>
                                    <option value="Converse">Converse</option>
                                    <option value="Dr. Martens">Dr. Martens</option>
                                    <option value="Vans">Vans</option>
                                    <option value="Puma">Puma</option>
                                </select>
                            </div>

                            {/* Price Range Filter */}
                            <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-700 mb-3">Price Range</label>
                                <select
                                    value={filters.priceRange}
                                    onChange={(e) => handleFilterChange('priceRange', e.target.value)}
                                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="">All Prices</option>
                                    <option value="0-50">$0 - $50</option>
                                    <option value="50-100">$50 - $100</option>
                                    <option value="100-150">$100 - $150</option>
                                    <option value="150-200">$150 - $200</option>
                                    <option value="200-">$200+</option>
                                </select>
                            </div>

                            {/* Rating Filter */}
                            <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-700 mb-3">Minimum Rating</label>
                                <select
                                    value={filters.rating}
                                    onChange={(e) => handleFilterChange('rating', e.target.value)}
                                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="">All Ratings</option>
                                    <option value="4.5">4.5★ & up</option>
                                    <option value="4.0">4.0★ & up</option>
                                    <option value="3.5">3.5★ & up</option>
                                    <option value="3.0">3.0★ & up</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Products Grid */}
                    <div className="flex-1">
                        {/* Toolbar */}
                        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
                            <div className="flex items-center justify-between">
                                <p className="text-gray-600">
                                    Showing {indexOfFirstProduct + 1}-{Math.min(indexOfLastProduct, filteredProducts.length)} of {filteredProducts.length} products
                                </p>
                                <div className="flex items-center gap-4">
                                    <select
                                        value={filters.sortBy}
                                        onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                                        className="p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="newest">Newest First</option>
                                        <option value="price-low">Price: Low to High</option>
                                        <option value="price-high">Price: High to Low</option>
                                        <option value="rating">Highest Rated</option>
                                        <option value="name">Name A-Z</option>
                                    </select>
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => setViewMode('grid')}
                                            className={`p-2 rounded ${viewMode === 'grid' ? 'bg-blue-100 text-blue-600' : 'text-gray-400'}`}
                                        >
                                            <Grid className="w-5 h-5" />
                                        </button>
                                        <button
                                            onClick={() => setViewMode('list')}
                                            className={`p-2 rounded ${viewMode === 'list' ? 'bg-blue-100 text-blue-600' : 'text-gray-400'}`}
                                        >
                                            <List className="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Products */}
                        {currentProducts.length === 0 ? (
                            <div className="text-center py-12">
                                <p className="text-gray-500 text-lg">No products found matching your criteria.</p>
                                <button
                                    onClick={clearFilters}
                                    className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                                >
                                    Clear Filters
                                </button>
                            </div>
                        ) : (
                            <div className={`grid gap-6 ${viewMode === 'grid'
                                    ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
                                    : 'grid-cols-1'
                                }`}>
                                {currentProducts.map((product) => (
                                    <div
                                        key={product.id}
                                        className={`bg-white rounded-lg shadow-sm hover:shadow-lg transition-all duration-300 group ${viewMode === 'list' ? 'flex gap-6 p-6' : 'overflow-hidden'
                                            }`}
                                    >
                                        <div className={`relative ${viewMode === 'list' ? 'w-48 h-48 flex-shrink-0' : 'w-full h-64'} overflow-hidden ${viewMode === 'grid' ? 'rounded-t-lg' : 'rounded-lg'}`}>
                                            <img
                                                src={product.image}
                                                alt={product.name}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                            />
                                            <div className="absolute top-3 left-3 flex flex-col gap-2">
                                                {product.isNew && (
                                                    <span className="bg-green-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
                                                        NEW
                                                    </span>
                                                )}
                                                {product.isSale && (
                                                    <span className="bg-red-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
                                                        SALE
                                                    </span>
                                                )}
                                            </div>
                                            <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                                <button className="bg-white/90 backdrop-blur-sm p-2 rounded-full hover:bg-white transition-colors">
                                                    <Heart className="w-4 h-4 text-gray-700" />
                                                </button>
                                            </div>
                                        </div>

                                        <div className={`${viewMode === 'grid' ? 'p-4' : 'flex-1'}`}>
                                            <div className="flex items-start justify-between mb-2">
                                                <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                                                    {product.name}
                                                </h3>
                                                <button className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                                    <ShoppingBag className="w-5 h-5 text-blue-600" />
                                                </button>
                                            </div>

                                            <p className="text-gray-600 text-sm mb-2">{product.brand}</p>

                                            {viewMode === 'list' && (
                                                <p className="text-gray-600 text-sm mb-3">{product.description}</p>
                                            )}

                                            <div className="flex items-center mb-3">
                                                <div className="flex items-center">
                                                    {[...Array(5)].map((_, i) => (
                                                        <Star
                                                            key={i}
                                                            className={`w-4 h-4 ${i < Math.floor(product.rating)
                                                                    ? 'text-yellow-400 fill-current'
                                                                    : 'text-gray-300'
                                                                }`}
                                                        />
                                                    ))}
                                                </div>
                                                <span className="text-sm text-gray-600 ml-2">
                                                    {product.rating} ({product.reviewCount})
                                                </span>
                                            </div>

                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-xl font-bold text-gray-900">${product.price}</span>
                                                    {product.originalPrice > product.price && (
                                                        <span className="text-sm text-gray-500 line-through">
                                                            ${product.originalPrice}
                                                        </span>
                                                    )}
                                                </div>
                                                {viewMode === 'grid' && (
                                                    <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors opacity-0 group-hover:opacity-100">
                                                        Add to Cart
                                                    </button>
                                                )}
                                            </div>

                                            {viewMode === 'list' && (
                                                <button className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                                                    Add to Cart
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="flex justify-center items-center gap-2 mt-8">
                                <button
                                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                    disabled={currentPage === 1}
                                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Previous
                                </button>

                                {[...Array(totalPages)].map((_, index) => {
                                    const page = index + 1;
                                    return (
                                        <button
                                            key={page}
                                            onClick={() => setCurrentPage(page)}
                                            className={`px-4 py-2 rounded-lg ${currentPage === page
                                                    ? 'bg-blue-600 text-white'
                                                    : 'border border-gray-300 hover:bg-gray-50'
                                                }`}
                                        >
                                            {page}
                                        </button>
                                    );
                                })}

                                <button
                                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                    disabled={currentPage === totalPages}
                                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Next
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductsPage;
