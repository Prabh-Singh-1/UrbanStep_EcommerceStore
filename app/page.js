"use client";
import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Star, Truck, Shield, RefreshCw, Award, ArrowRight, Heart, ShoppingBag } from 'lucide-react';
import Image from 'next/image';
import { redirect } from 'next/navigation';
import { useSession, signIn, signOut } from "next-auth/react"
import Link from 'next/link';

const HomePage = () => {
    const { data: session, status } = useSession();

  const [currentSlide, setCurrentSlide] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  const slides = [
    {
      id: 1,
      title: "Step Into Style",
      subtitle: "Discover Premium Footwear",
      description: "Elevate your wardrobe with our curated collection of luxury shoes",
      image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=1200&h=600&fit=crop",
      cta: "Shop Now",
      gradient: "from-purple-600 to-pink-600"
    },
    {
      id: 2,
      title: "Athletic Excellence",
      subtitle: "Performance Meets Comfort",
      description: "Professional-grade athletic shoes for every sport and lifestyle",
      image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=1200&h=600&fit=crop",
      cta: "Explore Sports",
      gradient: "from-blue-600 to-cyan-600"
    },
    {
      id: 3,
      title: "Casual Comfort",
      subtitle: "Everyday Essentials",
      description: "Perfect blend of style and comfort for your daily adventures",
      image: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=1200&h=600&fit=crop",
      cta: "Shop Casual",
      gradient: "from-green-600 to-teal-600"
    }
  ];


  const categories = [
    {
      name: "Athletic",
      image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=300&fit=crop",
      count: "120+ Products",
      color: "bg-blue-500"
    },
    {
      name: "Casual",
      image: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=400&h=300&fit=crop",
      count: "85+ Products",
      color: "bg-green-500"
    },
    {
      name: "Formal",
      image: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=400&h=300&fit=crop",
      count: "65+ Products",
      color: "bg-purple-500"
    },
    {
      name: "Boots",
      image: "https://images.unsplash.com/photo-1544966503-7cc5ac882d5e?w=400&h=300&fit=crop",
      count: "45+ Products",
      color: "bg-amber-500"
    },
    {
      name: "Sandals",
      image: "https://images.unsplash.com/photo-1571068316344-75bc76f77890?w=400&h=300&fit=crop",
      count: "35+ Products",
      color: "bg-pink-500"
    },
    {
      name: "Heels",
      image: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=400&h=300&fit=crop",
      count: "90+ Products",
      color: "bg-red-500"
    }
  ];

  const featuredProducts = [
    {
      id: 1,
      name: "Ultra Boost 22",
      price: "$180",
      originalPrice: "$220",
      image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=300&h=300&fit=crop",
      rating: 4.8,
      isNew: true
    },
    {
      id: 2,
      name: "Classic Leather",
      price: "$120",
      originalPrice: "$150",
      image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=300&h=300&fit=crop",
      rating: 4.6,
      isHot: true
    },
    {
      id: 3,
      name: "Air Max Pro",
      price: "$160",
      originalPrice: "$200",
      image: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=300&h=300&fit=crop",
      rating: 4.9,
      isNew: true
    },
    {
      id: 4,
      name: "Oxford Classic",
      price: "$250",
      originalPrice: "$300",
      image: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=300&h=300&fit=crop",
      rating: 4.7,
      isHot: true
    }
  ];


  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  return (
    <div className="min-h-screen bg-gray-50">

      <section className="relative h-screen my-auto mx-auto lg:h-[80vh] lg:my-8 lg:mx-5 rounded-none lg:rounded-4xl overflow-hidden">
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-transform duration-700 ease-in-out ${index === currentSlide ? 'translate-x-0' :
                index < currentSlide ? '-translate-x-full' : 'translate-x-full'
              }`}
          >
            <div className="relative h-full">
              <img
                src={slide.image}
                alt={slide.title}
                className="w-full h-full object-cover"
              />
              <div className={`absolute inset-0 bg-gradient-to-r ${slide.gradient} opacity-80`}></div>
              <div className="absolute inset-0 flex items-center justify-center text-white">
                <div className="text-center max-w-4xl px-6">
                  <h1 className={`text-6xl md:text-8xl font-bold mb-4 transform transition-all duration-1000 ${index === currentSlide ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
                    }`}>
                    {slide.title}
                  </h1>
                  <p className={`text-2xl md:text-3xl mb-6 transform transition-all duration-1000 delay-200 ${index === currentSlide ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
                    }`}>
                    {slide.subtitle}
                  </p>
                  <p className={`text-lg md:text-xl mb-8 max-w-2xl mx-auto transform transition-all duration-1000 delay-400 ${index === currentSlide ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
                    }`}>
                    {slide.description}
                  </p>
                  <button className={`bg-white text-gray-900 px-8 py-4 rounded-full font-semibold text-lg hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 ${index === currentSlide ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
                    } transition-all duration-1000 delay-600`}>
                    {slide.cta}
                    <ArrowRight className="inline ml-2 w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}


        <button
          onClick={prevSlide}
          className="absolute lg:block hidden left-6 top-1/2 transform -translate-y-1/2 bg-white/20 backdrop-blur-sm text-white p-3 rounded-full hover:bg-white/30 transition-all duration-300"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <button
          onClick={nextSlide}
          className="absolute lg:block hidden right-6 top-1/2 transform -translate-y-1/2 bg-white/20 backdrop-blur-sm text-white p-3 rounded-full hover:bg-white/30 transition-all duration-300"
        >
          <ChevronRight className="w-6 h-6" />
        </button>


        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-3">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${index === currentSlide ? 'bg-white scale-125' : 'bg-white/50'
                }`}
            />
          ))}
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { icon: Truck, title: "Free Shipping", desc: "On orders over $100" },
              { icon: Shield, title: "Secure Payment", desc: "100% Protected" },
              { icon: RefreshCw, title: "Easy Returns", desc: "30-day guarantee" },
              { icon: Award, title: "Premium Quality", desc: "Authentic products" }
            ].map((item, index) => (
              <div key={index} className="text-center group">
                <div className="bg-gradient-to-br from-blue-500 to-purple-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <item.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-600 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>


      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Shop by Category
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Discover your perfect pair from our carefully curated collections
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {categories.map((category, index) => (
              <div
                key={category.name}
                className={`group relative overflow-hidden rounded-2xl bg-white shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                  }`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <div className="aspect-w-16 aspect-h-12 relative">
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                  <h3 className="text-2xl font-bold mb-2">{category.name}</h3>
                  <p className="text-white/90 mb-4">{category.count}</p>
                  <button className="bg-white text-gray-900 px-6 py-2 rounded-full font-semibold hover:bg-gray-100 transition-colors duration-300 transform group-hover:scale-105">
                    Explore
                  </button>
                </div>
                <div className={`absolute top-4 right-4 w-3 h-3 rounded-full ${category.color} animate-pulse`}></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Featured Products
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Handpicked favorites that are trending right now
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuredProducts.map((product, index) => (
              <div
                key={product.id}
                className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 overflow-hidden"
              >
                <div className="relative overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute top-4 left-4 flex flex-col gap-2">
                    {product.isNew && (
                      <span className="bg-green-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
                        NEW
                      </span>
                    )}
                    {product.isHot && (
                      <span className="bg-red-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
                        HOT
                      </span>
                    )}
                  </div>
                  <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <button className="bg-white/90 backdrop-blur-sm p-2 rounded-full hover:bg-white transition-colors duration-300">
                      <Heart className="w-5 h-5 text-gray-700" />
                    </button>
                  </div>
                  <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <button className="bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition-colors duration-300">
                      <ShoppingBag className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                <div className="p-6">
                  <h3 className="font-bold text-lg text-gray-900 mb-2">{product.name}</h3>
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
                    <span className="text-sm text-gray-600 ml-2">({product.rating})</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl font-bold text-gray-900">{product.price}</span>
                      <span className="text-lg text-gray-500 line-through">{product.originalPrice}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <button onClick={() => { redirect("/allProducts") }} className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-full font-semibold text-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105">
              View All Products
              <ArrowRight className="inline ml-2 w-5 h-5" />
            </button>
          </div>
        </div>
      </section>

      <section className="py-20 bg-gradient-to-r from-gray-900 to-gray-800">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Stay in the Loop
          </h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Be the first to know about new arrivals, exclusive deals, and style tips
          </p>
          <div className="flex justify-center items-center max-w-md mx-auto">
            <button type="button" className="cursor-pointer text-white bg-blue-500 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-4xl text-xl px-8 py-6 text-center me-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 inline-flex items-center">
              <Link href="/SignIn">Get Started</Link>
            </button>
          </div>
          <p className="text-gray-400 text-sm mt-4">
            *No spam, unsubscribe anytime
          </p>
        </div>
      </section>
    </div>
  );
};

export default HomePage;