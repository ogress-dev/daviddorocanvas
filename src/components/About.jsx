
import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from '@/hooks/useInView';

const About = () => {
  const [ref, isInView] = useInView({ threshold: 0.2 });

  return (
    <section id="about" ref={ref} className="py-24 px-4 bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8 }}
          >
            <img 
              alt="Artisan craftsperson creating pottery"
              className="w-full h-[600px] object-cover rounded-sm"
             src="https://images.unsplash.com/photo-1601135183537-10c09f98902a" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="space-y-6"
          >
            <h2 className="text-4xl md:text-5xl font-light text-[#2c2c2c] tracking-tight">
              Our Story
            </h2>
            <p className="text-lg text-[#6b6b6b] font-light leading-relaxed">
              Founded with a passion for exceptional craftsmanship, we create collections that bring timeless elegance to modern living. Each piece is thoughtfully designed and meticulously crafted by skilled artisans.
            </p>
            <p className="text-lg text-[#6b6b6b] font-light leading-relaxed">
              Our commitment to quality and sustainability drives everything we do. From sourcing premium materials to supporting traditional techniques, we believe in creating products that last generations.
            </p>
            <p className="text-lg text-[#6b6b6b] font-light leading-relaxed">
              Every item in our collection tells a story of dedication, artistry, and the pursuit of perfection.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default About;
