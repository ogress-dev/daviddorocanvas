
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useInView } from '@/hooks/useInView';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { Mail, Phone, MapPin } from 'lucide-react';

const Contact = () => {
  const [ref, isInView] = useInView({ threshold: 0.2 });
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    toast({
      title: "🚧 This feature isn't implemented yet—but don't worry! You can request it in your next prompt! 🚀"
    });
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <section id="contact" ref={ref} className="py-24 px-4 bg-[#faf9f7]">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-light text-[#2c2c2c] mb-4 tracking-tight">
            Get in Touch
          </h2>
          <p className="text-lg text-[#6b6b6b] font-light max-w-2xl mx-auto">
            We'd love to hear from you. Reach out with any questions or inquiries.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-12">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 rounded-full bg-[#2c2c2c] flex items-center justify-center flex-shrink-0">
                <Mail className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-light text-[#2c2c2c] mb-1">Email</h3>
                <p className="text-[#6b6b6b] font-light">hello@artisancollections.com</p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 rounded-full bg-[#2c2c2c] flex items-center justify-center flex-shrink-0">
                <Phone className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-light text-[#2c2c2c] mb-1">Phone</h3>
                <p className="text-[#6b6b6b] font-light">+1 (555) 123-4567</p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 rounded-full bg-[#2c2c2c] flex items-center justify-center flex-shrink-0">
                <MapPin className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-light text-[#2c2c2c] mb-1">Address</h3>
                <p className="text-[#6b6b6b] font-light">
                  123 Artisan Lane<br />
                  Portland, OR 97201
                </p>
              </div>
            </div>
          </motion.div>

          <motion.form
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8 }}
            onSubmit={handleSubmit}
            className="space-y-6"
          >
            <div>
              <label htmlFor="name" className="block text-sm font-light text-[#2c2c2c] mb-2">
                Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-white border border-[#e0e0e0] rounded-sm focus:outline-none focus:border-[#2c2c2c] transition-colors font-light"
                required
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-light text-[#2c2c2c] mb-2">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-white border border-[#e0e0e0] rounded-sm focus:outline-none focus:border-[#2c2c2c] transition-colors font-light"
                required
              />
            </div>

            <div>
              <label htmlFor="message" className="block text-sm font-light text-[#2c2c2c] mb-2">
                Message
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows="6"
                className="w-full px-4 py-3 bg-white border border-[#e0e0e0] rounded-sm focus:outline-none focus:border-[#2c2c2c] transition-colors font-light resize-none"
                required
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-[#2c2c2c] text-white hover:bg-[#1a1a1a] py-6 text-base font-light tracking-wider transition-all duration-300"
            >
              Send Message
            </Button>
          </motion.form>
        </div>
      </div>
    </section>
  );
};

export default Contact;
