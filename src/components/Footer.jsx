
import React from 'react';
import { Instagram, Facebook, Twitter } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const Footer = () => {
  const { toast } = useToast();

  const handleSocialClick = () => {
    toast({
      title: "🚧 This feature isn't implemented yet—but don't worry! You can request it in your next prompt! 🚀"
    });
  };

  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#2c2c2c] text-white py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div>
            <span className="text-2xl font-light tracking-wider">ARTISAN</span>
            <p className="mt-4 text-white/70 font-light text-sm">
              Handcrafted excellence for modern living
            </p>
          </div>

          <div>
            <span className="text-sm font-light tracking-wider mb-4 block">Shop</span>
            <nav className="space-y-2">
              <a href="#collections" className="block text-sm text-white/70 hover:text-white transition-colors font-light">
                Collections
              </a>
              <a href="#products" className="block text-sm text-white/70 hover:text-white transition-colors font-light">
                Products
              </a>
              <a href="#about" className="block text-sm text-white/70 hover:text-white transition-colors font-light">
                About
              </a>
            </nav>
          </div>

          <div>
            <span className="text-sm font-light tracking-wider mb-4 block">Support</span>
            <nav className="space-y-2">
              <a href="#contact" className="block text-sm text-white/70 hover:text-white transition-colors font-light">
                Contact Us
              </a>
              <span className="block text-sm text-white/70 font-light cursor-not-allowed">
                Shipping Info
              </span>
              <span className="block text-sm text-white/70 font-light cursor-not-allowed">
                Returns
              </span>
            </nav>
          </div>

          <div>
            <span className="text-sm font-light tracking-wider mb-4 block">Follow Us</span>
            <div className="flex space-x-4">
              <button
                onClick={handleSocialClick}
                className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
              >
                <Instagram className="w-5 h-5" />
              </button>
              <button
                onClick={handleSocialClick}
                className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
              >
                <Facebook className="w-5 h-5" />
              </button>
              <button
                onClick={handleSocialClick}
                className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
              >
                <Twitter className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <p className="text-sm text-white/70 font-light">
            © {currentYear} Artisan Collections. All rights reserved.
          </p>
          <div className="flex space-x-6">
            <span className="text-sm text-white/70 font-light cursor-not-allowed">Privacy Policy</span>
            <span className="text-sm text-white/70 font-light cursor-not-allowed">Terms of Service</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
