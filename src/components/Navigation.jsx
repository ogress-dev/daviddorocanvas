
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

const Navigation = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { label: 'Collections', href: '#collections' },
    { label: 'About', href: '#about' },
    { label: 'Craftsmanship', href: '#craftsmanship' },
    { label: 'Contact', href: '#contact' }
  ];

  const handleNavClick = (e, href) => {
    e.preventDefault();
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setIsMobileMenuOpen(false);
    }
  };

  const handleShopClick = () => {
    toast({
      title: "🚧 This feature isn't implemented yet—but don't worry! You can request it in your next prompt! 🚀"
    });
  };

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled ? 'bg-white/95 backdrop-blur-md shadow-md' : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className={`text-2xl font-light tracking-wider ${isScrolled ? 'text-[#2c2c2c]' : 'text-white'}`}>
              ARTISAN
            </div>

            <div className="hidden md:flex items-center space-x-8">
              {navItems.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  onClick={(e) => handleNavClick(e, item.href)}
                  className={`text-sm font-light tracking-wide hover:opacity-70 transition-opacity ${
                    isScrolled ? 'text-[#2c2c2c]' : 'text-white'
                  }`}
                >
                  {item.label}
                </a>
              ))}
              <Button
                onClick={handleShopClick}
                variant="outline"
                className={`${
                  isScrolled 
                    ? 'border-[#2c2c2c] text-[#2c2c2c] hover:bg-[#2c2c2c] hover:text-white' 
                    : 'border-white text-white hover:bg-white hover:text-[#2c2c2c]'
                } transition-all duration-300`}
              >
                Shop
              </Button>
            </div>

            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={`md:hidden ${isScrolled ? 'text-[#2c2c2c]' : 'text-white'}`}
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </motion.nav>

      {isMobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, x: '100%' }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: '100%' }}
          className="fixed inset-0 z-40 bg-white md:hidden"
        >
          <div className="flex flex-col items-center justify-center h-full space-y-8">
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                onClick={(e) => handleNavClick(e, item.href)}
                className="text-2xl font-light text-[#2c2c2c] hover:opacity-70 transition-opacity"
              >
                {item.label}
              </a>
            ))}
            <Button
              onClick={handleShopClick}
              variant="outline"
              className="border-[#2c2c2c] text-[#2c2c2c] hover:bg-[#2c2c2c] hover:text-white"
            >
              Shop
            </Button>
          </div>
        </motion.div>
      )}
    </>
  );
};

export default Navigation;
