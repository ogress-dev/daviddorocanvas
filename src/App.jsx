import React from 'react';
import { Helmet } from 'react-helmet';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Hero from '@/components/Hero';
import ProjectDetail from '@/components/ProjectDetail';
import AboutPage from '@/components/AboutPage'; // Import the new page
import { Toaster } from '@/components/ui/toaster';

const AnimatedRoutes = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Hero />} />
        <Route path="/project/:id" element={<ProjectDetail />} />
        <Route path="/about" element={<AboutPage />} />
      </Routes>
    </AnimatePresence>
  );
};

function App() {
  return (
    <BrowserRouter>
      <Helmet>
        <title>dorodavid - Visual and Product Design</title>
        <meta name="description" content="Shaping sense through Visual and Product Design" />
        
        {/* 
          CRITICAL: META TAGS FOR LIGHT THEME ENFORCEMENT 
          "light only" is a non-standard but widely supported hint for mobile browsers
          to completely disable their automatic dark mode transformation.
        */}
        <meta name="color-scheme" content="light only" />
        <meta name="supported-color-schemes" content="light" />
        <meta name="theme-color" content="#FFFFFF" />
        <meta name="msapplication-navbutton-color" content="#FFFFFF" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        
        {/* Disable format detection to prevent auto-styling of phone numbers etc. */}
        <meta name="format-detection" content="telephone=no" />
        
        {/* Force third-party widgets (like Twitter) to render in light mode */}
        <meta name="twitter:widgets:theme" content="light" />
      </Helmet>
      
      {/* 
        Global Application Wrapper
        - Explicitly forces white background with inline styles for maximum specificity.
        - Uses the same gradient hack as index.css to ensure this container isn't inverted.
      */}
      <div 
        className="h-screen w-screen overflow-hidden bg-[#FFFFFF] text-[#1E1E1D]"
        style={{ 
          backgroundColor: '#FFFFFF',
          backgroundImage: 'linear-gradient(to bottom, #FFFFFF, #FFFFFF)',
          color: '#1E1E1D',
          colorScheme: 'light only'
        }}
      >
        <AnimatedRoutes />
        <Toaster />
      </div>
    </BrowserRouter>
  );
}

export default App;