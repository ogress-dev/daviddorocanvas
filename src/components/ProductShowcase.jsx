
import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from '@/hooks/useInView';
import ProductCard from '@/components/ProductCard';

const ProductShowcase = () => {
  const [ref, isInView] = useInView({ threshold: 0.1 });

  const products = [
    {
      name: 'Classic Dinner Set',
      description: 'Elegant 16-piece collection',
      image: 'Elegant white ceramic dinner plates and bowls arranged on a marble surface',
      alt: 'Classic dinner set collection'
    },
    {
      name: 'Artisan Bowls',
      description: 'Handcrafted ceramic bowls',
      image: 'Beautiful handcrafted ceramic bowls with organic shapes and natural glaze',
      alt: 'Artisan ceramic bowls'
    },
    {
      name: 'Modern Flatware',
      description: 'Contemporary stainless steel',
      image: 'Modern minimalist flatware set with matte black finish on linen',
      alt: 'Modern flatware collection'
    },
    {
      name: 'Porcelain Mugs',
      description: 'Refined coffee collection',
      image: 'Elegant porcelain coffee mugs with subtle textured patterns',
      alt: 'Porcelain coffee mugs'
    }
  ];

  return (
    <section id="products" ref={ref} className="py-24 px-4 bg-[#faf9f7]">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-light text-[#2c2c2c] mb-4 tracking-tight">
            Featured Products
          </h2>
          <p className="text-lg text-[#6b6b6b] font-light max-w-2xl mx-auto">
            Discover our carefully curated selection of handcrafted pieces
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.map((product, index) => (
            <ProductCard key={index} product={product} index={index} isInView={isInView} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProductShowcase;
