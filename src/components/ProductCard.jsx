
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useToast } from '@/components/ui/use-toast';

const ProductCard = ({ product, index, isInView }) => {
  const [isHovered, setIsHovered] = useState(false);
  const { toast } = useToast();

  const handleClick = () => {
    toast({
      title: "🚧 This feature isn't implemented yet—but don't worry! You can request it in your next prompt! 🚀"
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleClick}
      className="group cursor-pointer"
    >
      <div className="relative overflow-hidden bg-white rounded-sm mb-4 aspect-square flex items-center justify-center">
        <img 
          alt={product.alt}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
         src="https://images.unsplash.com/photo-1635865165118-917ed9e20936" />
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: isHovered ? 1 : 0 }}
          className="absolute inset-0 bg-black/20 flex items-center justify-center"
        >
          <span className="text-white text-sm font-light tracking-wider">View Details</span>
        </motion.div>
      </div>
      <h3 className="text-lg font-light text-[#2c2c2c] mb-1">{product.name}</h3>
      <p className="text-sm text-[#6b6b6b] font-light">{product.description}</p>
    </motion.div>
  );
};

export default ProductCard;
