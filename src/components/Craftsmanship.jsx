
import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from '@/hooks/useInView';
import { Sparkles, Heart, Award } from 'lucide-react';

const Craftsmanship = () => {
  const [ref, isInView] = useInView({ threshold: 0.2 });

  const values = [
    {
      icon: Sparkles,
      title: 'Artisan Quality',
      description: 'Every piece is crafted by skilled artisans using time-honored techniques'
    },
    {
      icon: Heart,
      title: 'Sustainable Materials',
      description: 'We source premium, eco-friendly materials with minimal environmental impact'
    },
    {
      icon: Award,
      title: 'Lifetime Quality',
      description: 'Built to last generations with proper care and attention'
    }
  ];

  return (
    <section id="craftsmanship" ref={ref} className="py-24 px-4 bg-[#2c2c2c]">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-light text-white mb-4 tracking-tight">
            Craftsmanship
          </h2>
          <p className="text-lg text-white/70 font-light max-w-2xl mx-auto">
            Our commitment to excellence in every detail
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-12 mb-20">
          {values.map((value, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              className="text-center space-y-4"
            >
              <div className="flex justify-center">
                <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center">
                  <value.icon className="w-8 h-8 text-white" />
                </div>
              </div>
              <h3 className="text-xl font-light text-white">{value.title}</h3>
              <p className="text-white/70 font-light leading-relaxed">{value.description}</p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="relative h-[400px] md:h-[600px] rounded-sm overflow-hidden"
        >
          <img 
            alt="Artisan workshop with craftspeople at work"
            className="w-full h-full object-cover"
           src="https://images.unsplash.com/photo-1698256179114-30758b66f70d" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        </motion.div>
      </div>
    </section>
  );
};

export default Craftsmanship;
