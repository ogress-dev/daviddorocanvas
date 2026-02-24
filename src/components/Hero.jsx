import React, { useState, useRef, useEffect } from 'react';
import { motion, useMotionValue, animate, AnimatePresence } from 'framer-motion';
import { Plus, Minus, Move } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { useNavigate }
from 'react-router-dom';
import { supabase } from '@/lib/customSupabaseClient';

// Custom Hexagon Info Icon
const HexagonInfoIcon = ({ className }) => (
  <svg 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    {/* Pointy-topped hexagon path */}
    <path d="M12 2L20.66 7L20.66 17L12 22L3.34 17L3.34 7Z" />
    {/* Letter 'i' */}
    <line x1="12" y1="16" x2="12" y2="12" />
    <line x1="12" y1="8" x2="12.01" y2="8" />
  </svg>
);

const Hero = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const containerRef = useRef(null);
  const aboutButtonRef = useRef(null);

  // Motion Values for direct control (smoother, no spring lag)
  const scale = useMotionValue(1.25);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // State to toggle drag vs zoom behavior
  const [isZooming, setIsZooming] = useState(false);
  // State for the custom "View Reset" message visibility
  const [showResetMessage, setShowResetMessage] = useState(false);

  // Animation states for About transition
  const [isExpandingAbout, setIsExpandingAbout] = useState(false);
  const [aboutButtonRect, setAboutButtonRect] = useState(null);

  // Refs for pinch-to-zoom logic
  const lastTouch = useRef({
    dist: 0,
    center: { x: 0, y: 0 }
  });

  // Ref for double-tap detection on touch devices
  const lastTap = useRef(0);

  // Ref for distinguishing single click vs double click on items
  const clickTimeout = useRef(null);

  // State for project images
  const [projectImages, setProjectImages] = useState({});

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (clickTimeout.current) {
        clearTimeout(clickTimeout.current);
      }
    };
  }, []);

  // State for items
  const [items, setItems] = useState([
    {
      id: 1,
      name: "Albed Price list",
      bucketFolder: "Albed-Price-list",
      x: '25%',
      y: '21%',
      size: 'w-64 md:w-80',
      rotation: 15
    }, 
    {
      id: 2,
      name: "Muso",
      bucketFolder: "Muso",
      x: '54%',
      y: '32%',
      size: 'w-40 md:w-52',
      rotation: -10
    }, 
    {
      id: 3,
      name: "Abaco",
      bucketFolder: "Abaco",
      x: '68%',
      y: '23%',
      size: 'w-72 md:w-96',
      rotation: 45
    }, 
    {
      id: 4,
      name: "The Social Fablab",
      bucketFolder: "The-Social-Fablab",
      x: '40%',
      y: '54%',
      size: 'w-32 md:w-36',
      rotation: -45
    }, 
    {
      id: 5,
      name: "Diversa",
      bucketFolder: "Diversa",
      x: '53%',
      y: '53%',
      size: 'w-64 md:w-80',
      rotation: 5,
      aspectRatio: 'aspect-video'
    }, 
    {
      id: 6,
      name: "Culto della Luce",
      bucketFolder: "Culto-della-Luce",
      x: '68%',
      y: '68%',
      size: 'w-48 md:w-60',
      rotation: 30
    }, 
    {
      id: 7,
      name: "Empathy Design",
      bucketFolder: "Empathy-Design",
      x: '28%', 
      y: '63%', 
      size: 'w-52 md:w-64',
      rotation: -15
    }, 
    {
      id: 8,
      name: "ApCollective",
      bucketFolder: "ApCollective",
      x: '42%',
      y: '38%',
      size: 'w-28 md:w-32',
      rotation: 30
    },
    {
      id: 9,
      name: "Grillwise",
      bucketFolder: "Grillwise",
      x: '13%', 
      y: '53%',
      size: 'w-64 md:w-80',
      rotation: -12
    },
    {
      id: 10,
      name: "Syform",
      bucketFolder: "Syform",
      x: '77%',
      y: '52%',
      size: 'w-52 md:w-64',
      rotation: 8
    }
  ]);

  // Fetch project images from Supabase
  useEffect(() => {
    const fetchImages = async () => {
      const images = {};
      for (const item of items) {
        try {
          const { data, error } = await supabase.storage.from('product-images').list(item.bucketFolder);
          if (error) {
            console.error('Error fetching images for', item.bucketFolder, error);
            continue;
          }
          const imageUrls = data
            .filter(file => file.name.match(/\.(jpg|jpeg|png|gif|webp)$/i)) // Only image files
            .map(file => supabase.storage.from('product-images').getPublicUrl(`${item.bucketFolder}/${file.name}`).data.publicUrl);
          images[item.id] = imageUrls;
        } catch (err) {
          console.error('Error fetching images for', item.bucketFolder, err);
        }
      }
      setProjectImages(images);
    };
    fetchImages();
  }, [items]);

  // Handle About Button Click (Expansion Animation)
  const handleAboutClick = () => {
    if (aboutButtonRef.current) {
      const rect = aboutButtonRef.current.getBoundingClientRect();
      setAboutButtonRect({
        top: rect.top,
        left: rect.left,
        width: rect.width,
        height: rect.height
      });
      setIsExpandingAbout(true);
      
      // Navigate after animation
      setTimeout(() => {
        navigate('/about');
      }, 600); // Matches the duration of the expansion animation
    } else {
      navigate('/about');
    }
  };

  // Reset View Logic (Double Click)
  const handleResetView = () => {
    animate(scale, 1.25, {
      duration: 0.5,
      ease: "easeInOut"
    });
    animate(x, 0, {
      duration: 0.5,
      ease: "easeInOut"
    });
    animate(y, 0, {
      duration: 0.5,
      ease: "easeInOut"
    });
    
    // Show the custom centered "View Reset" message
    setShowResetMessage(true);
    setTimeout(() => {
      setShowResetMessage(false);
    }, 1500); // Message disappears after 1.5 seconds
  };

  // Button Zoom (Still animated for smoothness)
  const handleButtonZoom = direction => {
    const currentScale = scale.get();
    const step = 0.4; // Larger step for buttons
    const targetScale = direction === 'in' ? currentScale + step : currentScale - step;
    const clampedScale = Math.min(Math.max(targetScale, 0.5), 4.0);

    // Zoom to center (0,0 relative pointer)
    const ratio = clampedScale / currentScale;

    // Animate scale, x, and y
    animate(scale, clampedScale, {
      duration: 0.3
    });
    animate(x, x.get() * ratio, {
      duration: 0.3
    });
    animate(y, y.get() * ratio, {
      duration: 0.3
    });
  };
  const showToast = feature => {
    toast({
      title: "Coming Soon",
      description: `The ${feature} feature isn't implemented yet—but don't worry! You can request it in your next prompt! 🚀`
    });
  };

  // Mouse Wheel Zoom Logic (Zoom to Cursor)
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const onWheel = e => {
      e.preventDefault();
      const currentScale = scale.get();
      // Increased sensitivity X2 from previous (0.0013 -> 0.0026)
      const delta = -e.deltaY * 0.0026;
      const newScale = Math.min(Math.max(currentScale + delta, 0.5), 4.0);
      const ratio = newScale / currentScale;

      // Calculate mouse position relative to viewport center
      // Since container covers window, window center is our origin
      const rect = container.getBoundingClientRect();
      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;
      const pointerX = e.clientX - centerX;
      const pointerY = e.clientY - centerY;

      // Calculate new position to keep pointer stationary relative to content
      // T_new = P - (P - T_old) * ratio
      const currentX = x.get();
      const currentY = y.get();
      const newX = pointerX - (pointerX - currentX) * ratio;
      const newY = pointerY - (pointerY - currentY) * ratio;

      // Direct update for instant response (no spring lag)
      scale.set(newScale);
      x.set(newX);
      y.set(newY);
    };
    container.addEventListener('wheel', onWheel, {
      passive: false
    });
    return () => container.removeEventListener('wheel', onWheel);
  }, [scale, x, y]);

  // Touch Logic (Pinch to Zoom + Pan)
  const handleTouchStart = e => {
    if (e.touches.length === 2) {
      setIsZooming(true); // Disable drag

      const touch1 = e.touches[0];
      const touch2 = e.touches[1];
      const dist = Math.hypot(touch1.clientX - touch2.clientX, touch1.clientY - touch2.clientY);
      const centerX = (touch1.clientX + touch2.clientX) / 2;
      const centerY = (touch1.clientY + touch2.clientY) / 2;
      lastTouch.current = {
        dist,
        center: {
          x: centerX,
          y: centerY
        }
      };
    } else if (e.touches.length === 1) {
      // Double tap detection
      const now = Date.now();
      if (now - lastTap.current < 300) {
        handleResetView();
      }
      lastTap.current = now;
    }
  };
  const handleTouchMove = e => {
    if (e.touches.length === 2) {
      e.preventDefault(); // Stop browser zoom

      const touch1 = e.touches[0];
      const touch2 = e.touches[1];
      const dist = Math.hypot(touch1.clientX - touch2.clientX, touch1.clientY - touch2.clientY);
      const centerX = (touch1.clientX + touch2.clientX) / 2;
      const centerY = (touch1.clientY + touch2.clientY) / 2;
      if (lastTouch.current.dist > 0) {
        const currentScale = scale.get();
        const currentX = x.get();
        const currentY = y.get();

        // Calculate zoom ratio
        const rawRatio = dist / lastTouch.current.dist;

        // Amplify zoom speed (Sensitivity X2)
        // effectiveRatio = 1 + (change * multiplier)
        const speedFactor = 2.6; // Increased speed
        const effectiveRatio = 1 + (rawRatio - 1) * speedFactor;
        const newScale = Math.min(Math.max(currentScale * effectiveRatio, 0.5), 4.0);
        const ratio = newScale / currentScale;

        // Zoom centered on the pinch midpoint
        const windowCenterX = window.innerWidth / 2;
        const windowCenterY = window.innerHeight / 2;
        const pointerX = centerX - windowCenterX;
        const pointerY = centerY - windowCenterY;

        // Apply Zoom Translation
        let newX = pointerX - (pointerX - currentX) * ratio;
        let newY = pointerY - (pointerY - currentY) * ratio;

        // Apply Pan Translation (following the pinch center movement)
        newX += centerX - lastTouch.current.center.x;
        newY += centerY - lastTouch.current.center.y;
        scale.set(newScale);
        x.set(newX);
        y.set(newY);
      }
      lastTouch.current = {
        dist,
        center: {
          x: centerX,
          y: centerY
        }
      };
    }
  };
  const handleTouchEnd = e => {
    if (e.touches.length < 2) {
      setIsZooming(false); // Re-enable drag
    }
  };

  // Handle click on product with delay to differentiate from double click
  const handleProductClick = item => {
    // Disable click for ID 4 (Minimalist)
    if (item.id === 4) return;

    // If a timer exists, this is a double click
    if (clickTimeout.current) {
      clearTimeout(clickTimeout.current);
      clickTimeout.current = null;
      handleResetView();
    } else {
      // First click - wait 250ms to see if it's a double click
      clickTimeout.current = setTimeout(() => {
        // NAVIGATE to project page instead of setting state
        navigate(`/project/${item.id}`);
        clickTimeout.current = null;
      }, 250);
    }
  };

  return (
    <motion.section 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      // Prevent fade out if we are expanding into the About page to avoid white flash
      exit={isExpandingAbout ? { opacity: 1 } : { opacity: 0, scale: 0.95, transition: { duration: 0.4 } }}
      className="relative w-screen h-screen overflow-hidden bg-[#FFFFFF]"
    >

      {/* Expanding Overlay for About Page Transition */}
      {isExpandingAbout && aboutButtonRect && (
        <motion.div
          initial={{
            position: 'fixed',
            top: aboutButtonRect.top,
            left: aboutButtonRect.left,
            width: aboutButtonRect.width,
            height: aboutButtonRect.height,
            borderRadius: '12px', // Matches button rounded-xl
            backgroundColor: '#1E1E1D',
            zIndex: 100
          }}
          animate={{
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            borderRadius: '0px'
          }}
          transition={{
            duration: 0.6,
            ease: [0.22, 1, 0.36, 1] // Custom easing for smooth "material" expansion
          }}
        />
      )}

      {/* Top Bar */}
      <div className="absolute top-0 left-0 right-0 z-50 px-6 md:px-12 pt-6 md:pt-8 flex justify-between items-start pointer-events-none">
        <div className="pointer-events-auto cursor-pointer">
          <img src="https://horizons-cdn.hostinger.com/38ec5550-5152-446c-bb9a-73388eb1666a/193d5ef86fe7049670fde3909cd2cc58.png" alt="Orodavid Logo" className="h-8 md:h-10 w-auto object-contain" />
        </div>
      </div>

      {/* Draggable Canvas Area */}
      <motion.div 
        ref={containerRef} 
        className="w-full h-full cursor-grab active:cursor-grabbing touch-none" 
        style={{ touchAction: 'none' }} 
        onTouchStart={handleTouchStart} 
        onTouchMove={handleTouchMove} 
        onTouchEnd={handleTouchEnd} 
        onDoubleClick={handleResetView}
      >
        <motion.div 
          drag={!isZooming} // Disable drag when pinching to avoid conflict
          dragConstraints={{
            left: -2500,
            right: 2500,
            top: -2000,
            bottom: 2000
          }} 
          dragElastic={0.1} 
          dragMomentum={true} 
          style={{
            scale,
            x,
            y
          }} // Controlled via MotionValues
          className="relative w-[200vw] h-[200vh] -ml-[50vw] -mt-[50vh] origin-center bg-[#FFFFFF]"
        >
          {/* Grid pattern */}
          <div 
            className="absolute inset-0 opacity-[0.03] pointer-events-none" 
            style={{
              backgroundImage: 'radial-gradient(#1E1E1D 1px, transparent 1px)',
              backgroundSize: '40px 40px'
            }} 
          />

          {items.map(item => {
            const isClickable = item.id !== 4;
            return (
              <motion.div 
                key={item.id} 
                drag={false} // Items are not individually draggable, canvas is
                whileHover={isClickable ? {
                  scale: 1.05,
                  zIndex: 50,
                  rotate: item.rotation
                } : {}}
                onTap={() => handleProductClick(item)} 
                initial={{ opacity: 0, scale: 0.8 }} 
                animate={{ opacity: 1, scale: 1 }} 
                transition={{ duration: 0.8 }} 
                style={{
                  left: item.x,
                  top: item.y,
                  rotate: item.rotation
                }} 
                className={`absolute ${item.size} ${isClickable ? 'cursor-pointer' : ''} group`}
              >
                <div className={`relative ${item.aspectRatio || 'aspect-square'} rounded-[24px] overflow-hidden bg-white shadow-lg transition-shadow duration-500 ${isClickable ? 'group-hover:shadow-2xl' : ''} flex items-center justify-center`}>
                  
                  {/* Dynamic Image from Supabase */}
                  {projectImages[item.id] && projectImages[item.id][0] ? (
                    <img src={projectImages[item.id][0]} alt={item.name} className="w-full h-full object-cover" />
                  ) : (
                    // Fallback images if no Supabase images
                    <>
                      {item.id === 1 && <img src="https://lqxywygswhflpdvndund.supabase.co/storage/v1/object/public/product-images/Abaco/download.jpeg" alt="Deep blue ceramic bowl" className="w-full h-full object-cover" />}
                      {item.id === 2 && <img src="https://horizons-cdn.hostinger.com/38ec5550-5152-446c-bb9a-73388eb1666a/2024-05-02-NIYvw.webp" alt="Small espresso cup" className="w-full h-full object-cover" />}
                      {item.id === 3 && <img src="https://images.unsplash.com/photo-1567763745030-bfe9c51bec27?q=80&w=1000&auto=format&fit=crop" alt="Dark glazed dinner plate" className="w-full h-full object-cover" />}
                      {/* UPDATED: Removed grayscale effect from Minimalist Teacup (ID 4) */}
                      {item.id === 4 && <img src="https://horizons-cdn.hostinger.com/38ec5550-5152-446c-bb9a-73388eb1666a/dd_homepage_hero-Yw657.jpg" alt="Minimalist teacup" className="w-full h-full object-cover" />}
                      {item.id === 5 && <img src="https://horizons-cdn.hostinger.com/38ec5550-5152-446c-bb9a-73388eb1666a/70d3ecacf11e47cb3d7e2ba293cd4057.jpg" alt="Grillwise" className="w-full h-full object-cover" />}
                      {item.id === 6 && <img src="https://images.unsplash.com/photo-1605206352486-133527a0df47?q=80&w=1000&auto=format&fit=crop" alt="Pink speckled bowl" className="w-full h-full object-cover" />}
                      {item.id === 7 && <img src="https://images.unsplash.com/photo-1533037805260-25e89a1a0d47?q=80&w=1000&auto=format&fit=crop" alt="Rustic side plate" className="w-full h-full object-cover" />}
                      {item.id === 8 && <img src="https://images.unsplash.com/photo-1622378875508-d2105da1c83a?q=80&w=1000&auto=format&fit=crop" alt="Sauce dish" className="w-full h-full object-cover" />}
                      {item.id === 9 && <img src="https://images.unsplash.com/photo-1610701596007-11502861dcfa?q=80&w=1000&auto=format&fit=crop" alt="Ceramic Vase" className="w-full h-full object-cover" />}
                      {item.id === 10 && <img src="https://images.unsplash.com/photo-1590409852230-b3c66f777e4b?q=80&w=1000&auto=format&fit=crop" alt="Serving Platter" className="w-full h-full object-cover" />}
                      {item.id === 11 && <img src="https://images.unsplash.com/photo-1596541571550-201594e976db?q=80&w=1000&auto=format&fit=crop" alt="Table Set" className="w-full h-full object-cover" />}
                    </>
                  )}

                  {/* View Label - Only show for clickable items */}
                  {isClickable && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }} 
                      whileHover={{ opacity: 1, y: 0 }} 
                      className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-[#1E1E1D] text-white px-4 py-2 shadow-lg rounded-[24px] whitespace-nowrap z-40 pointer-events-none"
                    >
                      <span className="text-xs font-medium tracking-wide">View Product</span>
                    </motion.div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </motion.div>

      {/* Bottom Controls Bar */}
      <div className="absolute bottom-8 left-0 right-0 px-6 md:px-12 flex items-end justify-between pointer-events-none z-50">
        
        <div className="flex items-center gap-3 pointer-events-auto">
          <motion.button 
            ref={aboutButtonRef}
            whileHover={{ y: -2 }} 
            onClick={handleAboutClick} 
            className="h-[52px] flex items-center justify-center bg-[#1E1E1D] text-white pl-5 pr-6 rounded-xl shadow-lg hover:bg-black transition-colors gap-2"
          >
            {/* Replaced standard Info icon with custom Hexagon Info */}
            <HexagonInfoIcon className="w-5 h-5" /> 
            <span className="text-sm font-medium">About</span>
          </motion.button>
        </div>

        <div className="flex items-center gap-6 pointer-events-auto">
          <div className="hidden md:flex items-center gap-2 text-[#888] select-none">
            <Move className="w-4 h-4" />
            <span className="text-sm font-light tracking-wide">Drag to explore</span>
          </div>

          <div className="flex items-center bg-[#f4f4f5] border border-transparent rounded-2xl p-1 shadow-md h-[52px]"> 
            <button 
              onClick={() => handleButtonZoom('out')} 
              className="w-10 h-full flex items-center justify-center rounded-xl hover:bg-white text-[#1E1E1D] transition-colors"
              aria-label="Zoom out"
            >
              <Minus className="w-5 h-5" />
            </button>
            <div className="w-px h-4 bg-[#ddd)" />
            <button 
              onClick={() => handleButtonZoom('in')} 
              className="w-10 h-full flex items-center justify-center rounded-xl hover:bg-white text-[#1E1E1D] transition-colors"
              aria-label="Zoom in"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Custom Centered "View Reset" Message */}
      <AnimatePresence>
        {showResetMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 flex items-center justify-center pointer-events-none z-[100]"
          >
            <div className="bg-white text-[#1E1E1D] px-6 py-3 rounded-xl shadow-lg text-lg font-medium text-center">
              <div>Back to the projects</div>
              <h3 className="text-sm font-light text-gray-500 mt-1">Hope you'll find the one you're looking for</h3>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </motion.section>
  );
};

export default Hero;