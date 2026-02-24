
import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from '@/hooks/useInView';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

const Collections = () => {
  const [ref, isInView] = useInView({ threshold: 0.2 });
  const { toast } = useToast();

  const collections = [
    {
      name: 'Heritage Collection',
      description: 'Timeless designs inspired by classical traditions',
      image: 'Traditional heritage dinnerware collection with ornate patterns on elegant table',
      alt: 'Heritage collection dinnerware'
    },
    {
      name: 'Modern Minimalist',
      description: 'Clean lines and contemporary aesthetics',
      image: 'Modern minimalist white dinnerware set with simple clean lines and geometric shapes',
      alt: 'Modern minimalist collection'
    },
    {
      name: 'Rustic Charm',
      description: 'Natural textures and earthy tones',
      image: 'Rustic ceramic dinnerware with natural textures and warm earth tones on wooden table',
      alt: 'Rustic charm collection'
    }
  ];

  const handleViewCollection = () => {
    toast({
      title: "🚧 This feature isn't implemented yet—but don't worry! You can request it in your next prompt! 🚀"
    });
  };

  return (
    <section id="collections" ref={ref} className="py-24 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-light text-[#2c2c2c] mb-4 tracking-tight">
            Our Collections
          </h2>
          <p className="text-lg text-[#6b6b6b] font-light max-w-2xl mx-auto">
            Explore distinct styles that complement any aesthetic
          </p>
        </motion.div>

        <div className="space-y-24">
          {collections.map((collection, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: index * 0.2 }}
              className={`grid md:grid-cols-2 gap-12 items-center ${
                index % 2 === 1 ? 'md:grid-flow-dense' : ''
              }`}
            >
              <div className={index % 2 === 1 ? 'md:col-start-2' : ''}>
                <img 
                  alt={collection.alt}
                  className="w-full h-[500px] object-cover rounded-sm"
                 src="https://images.unsplash.com/photo-1553767149-9d196eec5c66" />
              </div>

              <div className={`space-y-6 ${index % 2 === 1 ? 'md:col-start-1 md:row-start-1' : ''}`}>
                <h3 className="text-3xl md:text-4xl font-light text-[#2c2c2c] tracking-tight">
                  {collection.name}
                </h3>
                <p className="text-lg text-[#6b6b6b] font-light leading-relaxed">
                  {collection.description}
                </p>
                <Button
                  onClick={handleViewCollection}
                  variant="outline"
                  className="border-[#2c2c2c] text-[#2c2c2c] hover:bg-[#2c2c2c] hover:text-white transition-all duration-300"
                >
                  View Collection
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Collections;
