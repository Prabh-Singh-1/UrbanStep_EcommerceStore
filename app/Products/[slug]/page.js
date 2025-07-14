'use client'

import React, { useContext, useState, useEffect } from 'react'
import { useParams } from 'next/navigation';
import { FaShoppingBag } from "react-icons/fa";
import { CartContext } from '../../cartContext.js';
import Loader from '@/app/Components/Loader/page.js';
import Image from 'next/image.js';
import { useRouter } from 'next/navigation';


const Page = () => {
  const params = useParams();
  const ProductName = decodeURIComponent(params.slug);
  const [product, setProduct] = useState(null);
  const [variants, setVariants] = useState([]);
  const [availableSizes, setAvailableSizes] = useState([]);
  const [availableColors, setAvailableColors] = useState([]);
  const [productImage, setProductImage] = useState('');
  const { cart, setcart } = useContext(CartContext);
  const { cartDot, setcartDot } = useContext(CartContext);
  const { subtotal, setsubtotal } = useContext(CartContext);
  const [selectedVariantQty, setSelectedVariantQty] = useState(0);
  const router = useRouter();

  const [size, setsize] = useState('')

  useEffect(() => {
    async function fetchProduct() {
      const res = await fetch(`/api/product?title=${encodeURIComponent(ProductName)}`);
      const data = await res.json();
      const firstKey = Object.keys(data)[0];
      const productData = data[firstKey];

      if (productData) {
        // Fetch all variants of this product
        const variantRes = await fetch(`/api/getProductByTitle?title=${encodeURIComponent(productData.title)}`);
        const variantData = await variantRes.json();

        const colors = [...new Set(variantData.map(v => v.color))];
        const sizes = [...new Set(variantData.map(v => v.size))];

        setProduct({
          ...productData,
          color: colors,
          size: sizes,
        });
      } else {
        console.error('Product not found');
      }
    }

    fetchProduct();
  }, [ProductName]);

  useEffect(() => {

    console.log('Product data: ', product);
  }, [product])

  useEffect(() => {
    if (availableSizes.length) {
      const newSize = availableSizes.includes(size) ? size : availableSizes[0];
      handleSize({ target: { value: newSize } });
    }
  }, [availableSizes]);


  const [productColor, setproductColor] = useState(product ? product.color : '');

  useEffect(() => {
    if (!product?.title) return;

    const fetchVariants = async () => {
      const res = await fetch(`/api/getProductByTitle?title=${encodeURIComponent(product.title)}`);
      const data = await res.json();
      setVariants(data);

      const defaultColor = data[0]?.color || '';
      setproductColor(defaultColor);
    };

    fetchVariants();
  }, [product]);

  useEffect(() => {
    if (!variants.length || !productColor) return;

    console.log('Variants: ', variants);

    // Filter sizes for selected color
    const filteredSizes = variants
      .filter(v => v.color === productColor && v.availableqty > 0)
      .map(v => v.size);

    const sortedSizes = [...filteredSizes].sort((a, b) => parseInt(a) - parseInt(b));
    setAvailableSizes(sortedSizes);

    // Filter available colors
    const filteredColors = [
      ...new Set(
        variants
          .filter(v => v.availableqty > 0)
          .map(v => v.color)
      ),
    ];
    setAvailableColors(filteredColors);

    // Auto-select size
    if (!size || !sortedSizes.includes(size)) {
      const newSize = sortedSizes[0] || '';
      setsize(newSize);

      const matchedVariant = variants.find(v => v.size === newSize && v.color === productColor);
      setSelectedVariantQty(matchedVariant?.availableqty || 0);
    }

    const variantImg = variants.find(v => v.color === productColor)?.img || '';
    setProductImage(variantImg);

  }, [productColor, variants, size]);


  useEffect(() => {
    if (!size || !productColor || !variants.length) return;

    const matchedVariant = variants.find(
      v => v.size === size && v.color === productColor
    );
    setSelectedVariantQty(matchedVariant?.availableqty || 0);
  }, [size, productColor, variants]);

  const saveCart = (mycart, cartDot, subtot) => {
    localStorage.setItem('cart', JSON.stringify(mycart));
    localStorage.setItem('cartDot', JSON.stringify(cartDot));
    localStorage.setItem('subTotal', JSON.stringify(subtot));
  };

  const handleSize = (e) => {
    console.log('Selected size: ', e.target.value);
    setsize(e.target.value)
  }

  const handleColor = (selectedColor) => {
    console.log('Selected color: ', selectedColor);
    setproductColor(selectedColor);
  };

  useEffect(() => {
    console.log('Filtered Sizes based on', productColor, ':', availableSizes);
  }, [availableSizes, productColor]);

  const addTocart = (itemCode, qty, price, name, size, variant, category) => {

    let myCart = { ...cart };
    const numericQty = parseInt(qty);
    const numericPrice = parseFloat(price);
    let itemFound = false;
    let addedPrice = numericPrice * numericQty;

    for (const code in myCart) {
      const item = myCart[code];
      if (
        item.name === name &&
        item.size === size &&
        item.variant === variant &&
        item.unitPrice === numericPrice
      ) {
        item.qty += numericQty;
        item.price = item.unitPrice * item.qty;
        addedPrice = numericPrice * numericQty;
        itemFound = true;
        break;
      }
    }


    if (!itemFound) {
      const newCode = itemCode;
      myCart[newCode] = {
        qty: numericQty,
        unitPrice: numericPrice,
        price: numericPrice * numericQty,
        name,
        size,
        variant,
        category,
      };
    }

    console.log('myCart: ', myCart);
    const newSubtotal = subtotal + addedPrice;
    const newCartDot = cartDot + numericQty;

    setsubtotal(newSubtotal);
    setcartDot(newCartDot);
    setcart(myCart);
    saveCart(myCart, newCartDot, newSubtotal);
  };

  const handleBuyNow = (itemcode, qty, price, name, size, variant, category) => {

    addTocart(itemcode, qty, price, name, size, variant, category)
    router.push('/Checkout');
  }

  const slugify = str =>
    str
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-]/g, '')
      .replace(/-+/g, '-');


  if (!product) return <div className="text-center p-10">
    <Loader />
  </div>;
  return (
    <>
      <section className="min-h-screen text-gray-600 body-font overflow-hidden">
        <div className="container px-5 py-4 mx-auto">
          <div className="lg:w-4/5 mx-auto justify-center items-center flex flex-wrap">
            <Image height={300} width={600} alt="ecommerce" className="lg:w-1/3 w-full lg:h-auto h-full p-6 object-contain object-center rounded" src={productImage || product.img} />
            <div className="lg:w-1/2 object-center w-full lg:pl-10 lg:py-6 mt-6 lg:mt-0">
              <h2 className="text-sm title-font text-gray-500 tracking-widest">{product.category}</h2>
              <h1 className="text-gray-900 text-3xl title-font font-medium mb-1">{product.title}</h1>

              <p className='leading-relaxed'>
                {product.desc}
              </p>
              <div className="flex mt-6 items-center pb-5 border-b-2 border-gray-100 mb-5">
                <div className="flex">
                  <span className="mr-3">Color</span>

                  {availableColors.map((clr, idx) => (
                    <button
                      key={idx}
                      className={`border-2 ml-1 rounded-full w-6 h-6 focus:outline-none cursor-pointer
                                    ${productColor === clr ? `ring-2 ring-${clr}-500` : ''}
                                    ${clr === 'White' ? 'bg-white border-gray-300' :
                          clr === 'White' ? 'bg-white' :
                            clr === 'Blue' ? 'bg-blue-700 border-gray-300' :
                              clr === 'Red' ? 'bg-red-500 border-gray-300' :
                                clr === 'Black' ? 'bg-black border-gray-300' :
                                  'bg-gray-200 border-gray-300'}`
                      }
                      onClick={() => handleColor(clr)}
                      title={clr}
                    ></button>
                  ))}
                </div>
                <div className="flex ml-6 items-center">
                  <span className="mr-3">Size</span>
                  <div className="relative">
                    <select onChange={handleSize} value={size} className="rounded border appearance-none border-gray-300 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500 text-base pl-3 pr-10">
                      {availableSizes.map(sz => (
                        <option key={sz} value={sz}>{sz}</option>
                      ))}
                    </select>
                    <span className="absolute right-0 top-0 h-full w-10 text-center text-gray-600 pointer-events-none flex items-center justify-center">
                      <svg fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="w-4 h-4" viewBox="0 0 24 24">
                        <path d="M6 9l6 6 6-6"></path>
                      </svg>
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex gap-3">
                {selectedVariantQty > 0 ? (
                  <span className="title-font font-medium text-2xl text-gray-900">
                    ₹{product.price}
                  </span>
                ) : (
                  <span className="title-font font-medium text-2xl text-red-500">
                    Currently unavailable!
                  </span>
                )}
                <button disabled={selectedVariantQty <= 0} onClick={() => { const baseSlug = slugify(product.title); const fullSlug = `${baseSlug}-${size}-${productColor.toLowerCase()}`; handleBuyNow(fullSlug, 1, product.price, product.title, size, productColor, product.category) }} className="flex  text-white bg-indigo-500 border-0 py-2 px-6 focus:outline-none hover:bg-indigo-600 rounded">Buy Now</button>
                <button disabled={selectedVariantQty <= 0} onClick={() => { const baseSlug = slugify(product.title); const fullSlug = `${baseSlug}-${size}-${productColor.toLowerCase()}`; addTocart(fullSlug, 1, product.price, product.title, size, productColor, product.category) }} className="flex justify-center items-center gap-1.5 text-white bg-indigo-500 border-0 py-2 px-6 focus:outline-none hover:bg-indigo-600 rounded"><FaShoppingBag />Add to Cart</button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

export default Page