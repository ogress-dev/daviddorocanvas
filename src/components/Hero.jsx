import React, { useState, useRef, useEffect } from 'react';
import { motion, useMotionValue, animate, AnimatePresence } from 'framer-motion';
import { Move } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { useNavigate } from 'react-router-dom';
import Logo from '@/components/Logo';

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

  // Motion Values for panning
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Center the canvas on mount
  useEffect(() => {
    // Calculate offset to center the main content (row 2 projects from 0px to 1280px)
    // Center point of main content: 640px
    // Offset needed: (viewport width / 2) - 640px
    const centerOffset = (window.innerWidth / 2) - 640;
    x.set(centerOffset);
  }, []);



  // Animation states for About transition
  const [isExpandingAbout, setIsExpandingAbout] = useState(false);
  const [aboutButtonRect, setAboutButtonRect] = useState(null);

  // Ref for double-tap detection on touch devices
  const lastTap = useRef(0);

  // Ref for distinguishing single click vs double click on items
  const clickTimeout = useRef(null);

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


  ]);

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
    animate(x, 0, {
      duration: 0.5,
      ease: "easeInOut"
    });
    animate(y, 0, {
      duration: 0.5,
      ease: "easeInOut"
    });
  };
  const showToast = feature => {
    toast({
      title: "Coming Soon",
      description: `The ${feature} feature isn't implemented yet—but don't worry! You can request it in your next prompt! 🚀`
    });
  };

  // Mouse Wheel Scroll Logic (Horizontal and Vertical) with Boundaries
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Calculate boundaries based on canvas and viewport dimensions
    const canvasWidth = 1920;
    const canvasHeight = 1603;
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    // Independent boundary factors for horizontal and vertical
    const horizontalBoundaryFactor = 3.5; // Increased for much more horizontal range
    const verticalBoundaryFactor = 0.8;

    // Calculate max scroll distances independently
    // Ensure minimum scroll range even on large viewports
    const maxScrollX = Math.max(1000, Math.abs(canvasWidth - viewportWidth) * horizontalBoundaryFactor);
    const maxScrollY = Math.max(300, Math.abs(canvasHeight - viewportHeight) * verticalBoundaryFactor);

    // Debug: log the calculated boundaries
    console.log('Scroll Boundaries:', {
      viewportWidth,
      viewportHeight,
      canvasWidth,
      canvasHeight,
      maxScrollX,
      maxScrollY
    });

    const onWheel = e => {
      e.preventDefault();

      const currentX = x.get();
      const currentY = y.get();

      // Scroll sensitivity
      const scrollSpeed = 1.5;

      // Support both vertical and horizontal scrolling
      // Shift + wheel for horizontal, normal wheel for vertical
      if (e.shiftKey) {
        // Horizontal scroll when holding shift
        const newX = currentX - e.deltaY * scrollSpeed;
        // Clamp to boundaries
        const clampedX = Math.max(-maxScrollX, Math.min(maxScrollX, newX));
        x.set(clampedX);
      } else {
        // Vertical scroll (primary)
        const newY = currentY - e.deltaY * scrollSpeed;
        // Clamp to boundaries
        const clampedY = Math.max(-maxScrollY, Math.min(maxScrollY, newY));
        y.set(clampedY);

        // Also support horizontal scroll with deltaX (for trackpads)
        if (e.deltaX !== 0) {
          const newX = currentX - e.deltaX * scrollSpeed;
          const clampedX = Math.max(-maxScrollX, Math.min(maxScrollX, newX));
          x.set(clampedX);
        }
      }
    };
    container.addEventListener('wheel', onWheel, {
      passive: false
    });
    return () => container.removeEventListener('wheel', onWheel);
  }, [x, y]);

  // Touch Logic (Double tap to reset)
  const handleTouchStart = e => {
    if (e.touches.length === 1) {
      // Double tap detection
      const now = Date.now();
      if (now - lastTap.current < 300) {
        handleResetView();
      }
      lastTap.current = now;
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
          <Logo />
        </div>

        {/* Drag to explore hint */}
        <div className="flex items-center gap-2 text-[#888] select-none pointer-events-auto hidden sm:flex">
          <Move className="w-4 h-4" />
          <span className="text-sm font-light tracking-wide">Drag to explore</span>
        </div>
      </div>

      {/* Draggable Canvas Area */}
      <motion.div
        ref={containerRef}
        className="w-full h-full cursor-grab active:cursor-grabbing flex items-center justify-center"
        onTouchStart={handleTouchStart}
        onDoubleClick={handleResetView}
      >
        <motion.div
          drag
          dragConstraints={{
            // Horizontal boundaries (independent - adjust horizontalBoundaryFactor above)
            left: -Math.max(1000, Math.abs(1920 - window.innerWidth) * 3.5),
            right: Math.max(1000, Math.abs(1920 - window.innerWidth) * 3.5),
            // Vertical boundaries (independent - adjust verticalBoundaryFactor above)
            top: -Math.max(300, Math.abs(1603 - window.innerHeight) * 0.8),
            bottom: Math.max(300, Math.abs(1603 - window.innerHeight) * 0.8)
          }}
          dragElastic={0.05}
          dragTransition={{ bounceStiffness: 300, bounceDamping: 20, power: 0.2 }}
          style={{
            width: '1920px',
            height: '1603px',
            x,
            y,
            backgroundImage: `
              linear-gradient(to right, rgba(0, 0, 0, 0.1) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(0, 0, 0, 0.1) 1px, transparent 1px)
            `,
            backgroundSize: '320px 320px',
            backgroundPosition: '320px 0px'
          }}
          className="relative"
        >
          {/* First row - Empty cells */}
          <div
            className="absolute bg-gray-50"
            style={{
              left: '-320px',
              top: '0px',
              width: '320px',
              height: '320px'
            }}
          />

          <div
            className="absolute bg-blue-100"
            style={{
              left: '0px',
              top: '0px',
              width: '320px',
              height: '320px'
            }}
          />

          <div
            className="absolute bg-gray-50"
            style={{
              left: '320px',
              top: '0px',
              width: '320px',
              height: '320px'
            }}
          />

          <div
            className="absolute bg-gray-50"
            style={{
              left: '640px',
              top: '0px',
              width: '320px',
              height: '320px'
            }}
          />

          <div
            className="absolute bg-gray-50"
            style={{
              left: '960px',
              top: '0px',
              width: '320px',
              height: '320px'
            }}
          />

          <div
            className="absolute bg-gray-50"
            style={{
              left: '1280px',
              top: '0px',
              width: '320px',
              height: '320px'
            }}
          />

          <div
            className="absolute bg-gray-50"
            style={{
              left: '1600px',
              top: '0px',
              width: '320px',
              height: '320px'
            }}
          />

          {/* Second row - Empty cell before Muso */}
          <div
            className="absolute bg-gray-50"
            style={{
              left: '-320px',
              top: '320px',
              width: '320px',
              height: '320px'
            }}
          />

          {/* Second row, first column - Muso cell */}
          <div
            className="absolute bg-blue-200 flex items-center justify-center"
            style={{
              left: '0px',
              top: '320px',
              width: '320px',
              height: '320px'
            }}
          >
            {/* Muso Project inside this cell */}
            <motion.div
              drag={false}
              whileHover={{
                scale: 1.05,
                zIndex: 50,
                rotate: -15
              }}
              onTap={() => {
                const clickTimeout = setTimeout(() => {
                  navigate(`/project/1`);
                }, 250);
              }}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              style={{
                rotate: -15,
                width: '270px',
                height: '270px'
              }}
              className="cursor-pointer group"
            >
              <div
                className="relative rounded-[16px] overflow-hidden bg-white shadow-lg transition-shadow duration-500 group-hover:shadow-2xl flex items-center justify-center"
                style={{
                  width: '100%',
                  height: '100%'
                }}
              >
                <img src="/muso.jpg" alt="Muso" className="w-full h-full object-cover" />

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  whileHover={{ opacity: 1, y: 0 }}
                  className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-[#1E1E1D] text-white px-4 py-2 shadow-lg rounded-[24px] whitespace-nowrap z-40 pointer-events-none"
                >
                  <span className="text-xs font-medium tracking-wide">View Product</span>
                </motion.div>
              </div>

              <div className="mt-3 pointer-events-none hidden sm:block">
                <h3 className="text-[14px] font-bold text-black">Muso</h3>
                <p className="text-[12px] text-black text-left mt-1">Brand, Strategy, Web & Product Design</p>
              </div>
            </motion.div>
          </div>

          {/* Second row, second column - ApCollective cell */}
          <div
            className="absolute bg-blue-300 flex items-start md:items-center justify-center pt-6 md:pt-0"
            style={{
              left: '320px',
              top: '320px',
              width: '320px',
              height: '320px'
            }}
          >
            {/* ApCollective Project inside this cell */}
            <motion.div
              drag={false}
              whileHover={{
                scale: 1.05,
                zIndex: 50,
                rotate: -30
              }}
              onTap={() => {
                const clickTimeout = setTimeout(() => {
                  navigate(`/project/2`);
                }, 250);
              }}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              style={{
                rotate: -30,
                width: '120px',
                height: '170px'
              }}
              className="cursor-pointer group"
            >
              <div
                className="relative rounded-[16px] overflow-hidden bg-white shadow-lg transition-shadow duration-500 group-hover:shadow-2xl flex items-center justify-center"
                style={{
                  width: '100%',
                  height: '100%'
                }}
              >
                <img src="/apcollective.png" alt="ApCollective" className="w-full h-full object-cover" />

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  whileHover={{ opacity: 1, y: 0 }}
                  className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-[#1E1E1D] text-white px-4 py-2 shadow-lg rounded-[24px] whitespace-nowrap z-40 pointer-events-none"
                >
                  <span className="text-xs font-medium tracking-wide">View Product</span>
                </motion.div>
              </div>

              <div className="mt-3 pointer-events-none hidden sm:block">
                <h3 className="text-[14px] font-bold text-black">ApCollective</h3>
                <p className="text-[12px] text-black text-left mt-1">Portfolio</p>
              </div>
            </motion.div>
          </div>

          {/* Second row, third column - Abaco cell */}
          <div
            className="absolute bg-blue-400 flex items-start md:items-center justify-center pt-6 md:pt-0"
            style={{
              left: '640px',
              top: '320px',
              width: '320px',
              height: '320px'
            }}
          >
            {/* Abaco Project inside this cell */}
            <motion.div
              drag={false}
              whileHover={{
                scale: 1.05,
                zIndex: 50,
                rotate: 30
              }}
              onTap={() => {
                const clickTimeout = setTimeout(() => {
                  navigate(`/project/3`);
                }, 250);
              }}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              style={{
                rotate: 30,
                width: '170px',
                height: '170px'
              }}
              className="cursor-pointer group"
            >
              <div
                className="relative rounded-[16px] overflow-hidden bg-white shadow-lg transition-shadow duration-500 group-hover:shadow-2xl flex items-center justify-center"
                style={{
                  width: '100%',
                  height: '100%'
                }}
              >
                <img src="/abaco.jpg" alt="Abaco" className="w-full h-full object-cover" />

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  whileHover={{ opacity: 1, y: 0 }}
                  className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-[#1E1E1D] text-white px-4 py-2 shadow-lg rounded-[24px] whitespace-nowrap z-40 pointer-events-none"
                >
                  <span className="text-xs font-medium tracking-wide">View Product</span>
                </motion.div>
              </div>

              <div className="mt-3 pointer-events-none hidden sm:block">
                <h3 className="text-[14px] font-bold text-black">Abaco</h3>
                <p className="text-[12px] text-black text-left mt-1">Product Design</p>
              </div>
            </motion.div>
          </div>

          {/* Second row, fourth column - Albed Price Book cell */}
          <div
            className="absolute bg-blue-500 flex items-center justify-center"
            style={{
              left: '960px',
              top: '320px',
              width: '320px',
              height: '320px'
            }}
          >
            {/* Albed Price Book Project inside this cell */}
            <motion.div
              drag={false}
              whileHover={{
                scale: 1.05,
                zIndex: 50,
                rotate: 15
              }}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              style={{
                rotate: 15,
                width: '270px',
                height: '270px'
              }}
              className="group"
            >
              <div
                className="relative rounded-[16px] overflow-hidden bg-white shadow-lg transition-shadow duration-500 flex items-center justify-center"
                style={{
                  width: '100%',
                  height: '100%'
                }}
              >
                <img src="/albed.jpg" alt="Albed Price Book" className="w-full h-full object-cover" />
              </div>

              <div className="mt-3 pointer-events-none hidden sm:block">
                <h3 className="text-[14px] font-bold text-black">Albed Price Book</h3>
                <p className="text-[12px] text-black text-left mt-1">Strategy & Editorial Design</p>
              </div>
            </motion.div>
          </div>

          {/* Second row, fifth column - Empty cell */}
          <div
            className="absolute bg-gray-50"
            style={{
              left: '1280px',
              top: '320px',
              width: '320px',
              height: '320px'
            }}
          />

          {/* Second row, sixth column - Empty cell */}
          <div
            className="absolute bg-gray-50"
            style={{
              left: '1600px',
              top: '320px',
              width: '320px',
              height: '320px'
            }}
          />

          {/* Third row, first column - Empty cell */}
          <div
            className="absolute bg-gray-50"
            style={{
              left: '0px',
              top: '640px',
              width: '320px',
              height: '320px'
            }}
          />

          {/* Third row, column -1 - Empathy Design cell (shifted left on desktop, first column on mobile) */}
          <div
            className="absolute bg-green-200 flex items-center justify-center"
            style={{
              left: typeof window !== 'undefined' && window.innerWidth < 768 ? '0px' : '-320px',
              top: '640px',
              width: '320px',
              height: '320px'
            }}
          >
            {/* Empathy Design Project inside this cell */}
            <motion.div
              drag={false}
              whileHover={{
                scale: 1.05,
                zIndex: 50,
                rotate: -30
              }}
              onTap={() => {
                const clickTimeout = setTimeout(() => {
                  navigate(`/project/5`);
                }, 250);
              }}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              style={{
                rotate: -30,
                width: '160px',
                height: '160px'
              }}
              className="cursor-pointer group"
            >
              <div
                className="relative rounded-[16px] overflow-hidden bg-white shadow-lg transition-shadow duration-500 group-hover:shadow-2xl flex items-center justify-center"
                style={{
                  width: '100%',
                  height: '100%'
                }}
              >
                <img src="/checked.png" alt="Empathy Design" className="w-full h-full object-cover" />

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  whileHover={{ opacity: 1, y: 0 }}
                  className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-[#1E1E1D] text-white px-4 py-2 shadow-lg rounded-[24px] whitespace-nowrap z-40 pointer-events-none"
                >
                  <span className="text-xs font-medium tracking-wide">View Product</span>
                </motion.div>
              </div>

              <div className="mt-3 pointer-events-none hidden sm:block">
                <h3 className="text-[14px] font-bold text-black">Empathy Design</h3>
                <p className="text-[12px] text-black text-left mt-1">Logo & Set Design</p>
              </div>
            </motion.div>
          </div>

          {/* Third row, fourth column - Grillwise cell (below Albed on desktop, below id 11 on mobile) */}
          <div
            className="absolute bg-purple-200 flex items-end md:items-center justify-center pb-6 md:pb-0"
            style={{
              left: typeof window !== 'undefined' && window.innerWidth < 768 ? '640px' : '960px',
              top: typeof window !== 'undefined' && window.innerWidth < 768 ? '740px' : '640px',
              width: '320px',
              height: '320px'
            }}
          >
            {/* Grillwise Project inside this cell */}
            <motion.div
              drag={false}
              whileHover={{
                scale: 1.05,
                zIndex: 50,
                rotate: 15
              }}
              onTap={() => {
                const clickTimeout = setTimeout(() => {
                  navigate(`/project/7`);
                }, 250);
              }}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              style={{
                rotate: 15,
                width: '288px',
                height: '160px'
              }}
              className="cursor-pointer group"
            >
              <div
                className="relative rounded-[16px] overflow-hidden bg-white shadow-lg transition-shadow duration-500 group-hover:shadow-2xl flex items-center justify-center"
                style={{
                  width: '100%',
                  height: '100%'
                }}
              >
                <img src="/grillwise.jpg" alt="Grillwise" className="w-full h-full object-cover" />

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  whileHover={{ opacity: 1, y: 0 }}
                  className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-[#1E1E1D] text-white px-4 py-2 shadow-lg rounded-[24px] whitespace-nowrap z-40 pointer-events-none"
                >
                  <span className="text-xs font-medium tracking-wide">View Product</span>
                </motion.div>
              </div>

              <div className="mt-3 pointer-events-none hidden sm:block">
                <h3 className="text-[14px] font-bold text-black">Grillwise</h3>
                <p className="text-[12px] text-black text-left mt-1">Brand & Web Design</p>
              </div>
            </motion.div>
          </div>

          {/* Third row, fifth column - ??? cell (beside Grillwise on desktop, moves left on mobile) */}
          <div
            className="absolute bg-purple-300 flex items-center justify-center"
            style={{
              left: typeof window !== 'undefined' && window.innerWidth < 768 ? '960px' : '1280px',
              top: '640px',
              width: '320px',
              height: '320px'
            }}
          >
            {/* ??? Project inside this cell */}
            <motion.div
              drag={false}
              whileHover={{
                scale: 1.05,
                zIndex: 50,
                rotate: 45
              }}
              onTap={() => {
                const clickTimeout = setTimeout(() => {
                  navigate(`/project/12`);
                }, 250);
              }}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              style={{
                rotate: 45,
                width: '96px',
                height: '96px'
              }}
              className="cursor-pointer group"
            >
              <div
                className="relative rounded-[16px] overflow-hidden bg-white shadow-lg transition-shadow duration-500 group-hover:shadow-2xl flex items-center justify-center"
                style={{
                  width: '100%',
                  height: '100%'
                }}
              >
                <img src="/checked.png" alt="????" className="w-full h-full object-cover" />

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  whileHover={{ opacity: 1, y: 0 }}
                  className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-[#1E1E1D] text-white px-4 py-2 shadow-lg rounded-[24px] whitespace-nowrap z-40 pointer-events-none"
                >
                  <span className="text-xs font-medium tracking-wide">View Product</span>
                </motion.div>
              </div>

              <div className="mt-3 pointer-events-none hidden sm:block">
                <h3 className="text-[14px] font-bold text-black">????</h3>
              </div>
            </motion.div>
          </div>

          {/* Third row, fifth column - Empty cell (only visible on mobile, to the right of ???) */}
          <div
            className="absolute bg-gray-50 md:hidden"
            style={{
              left: '1280px',
              top: '640px',
              width: '320px',
              height: '320px'
            }}
          />

          {/* Third row, sixth column - Empty cell */}
          <div
            className="absolute bg-gray-50"
            style={{
              left: '1600px',
              top: '640px',
              width: '320px',
              height: '320px'
            }}
          />

          {/* Fourth row, -1 column - Empty cell */}
          <div
            className="absolute bg-gray-50"
            style={{
              left: '-320px',
              top: '960px',
              width: '320px',
              height: '320px'
            }}
          />
          <div
            className="absolute bg-green-300 flex items-center justify-center"
            style={{
              left: '0px',
              top: '960px',
              width: '320px',
              height: '320px'
            }}
          >
            {/* Syform Project inside this cell */}
            <motion.div
              drag={false}
              whileHover={{
                scale: 1.05,
                zIndex: 50,
                rotate: -30
              }}
              onTap={() => {
                const clickTimeout = setTimeout(() => {
                  navigate(`/project/6`);
                }, 250);
              }}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              style={{
                rotate: -30,
                width: '160px',
                height: '160px'
              }}
              className="cursor-pointer group"
            >
              <div
                className="relative rounded-[16px] overflow-hidden bg-white shadow-lg transition-shadow duration-500 group-hover:shadow-2xl flex items-center justify-center"
                style={{
                  width: '100%',
                  height: '100%'
                }}
              >
                <img src="/checked.png" alt="Syform" className="w-full h-full object-cover" />

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  whileHover={{ opacity: 1, y: 0 }}
                  className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-[#1E1E1D] text-white px-4 py-2 shadow-lg rounded-[24px] whitespace-nowrap z-40 pointer-events-none"
                >
                  <span className="text-xs font-medium tracking-wide">View Product</span>
                </motion.div>
              </div>

              <div className="mt-3 pointer-events-none hidden sm:block">
                <h3 className="text-[14px] font-bold text-black">Syform</h3>
                <p className="text-[12px] text-black text-left mt-1">Set & Graphic Design</p>
              </div>
            </motion.div>
          </div>

          {/* Fourth row, second column - Upcoming cell (to the right of Syform) */}
          <div
            className="absolute bg-green-400 flex items-end md:items-center justify-center pb-6 md:pb-0"
            style={{
              left: '320px',
              top: '960px',
              width: '320px',
              height: '320px'
            }}
          >
            {/* Upcoming Project inside this cell */}
            <motion.div
              drag={false}
              whileHover={{
                scale: 1.05,
                zIndex: 50,
                rotate: -15
              }}
              onTap={() => {
                const clickTimeout = setTimeout(() => {
                  navigate(`/project/10`);
                }, 250);
              }}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              style={{
                rotate: -15,
                width: '160px',
                height: '208px'
              }}
              className="cursor-pointer group"
            >
              <div
                className="relative rounded-[16px] overflow-hidden bg-white shadow-lg transition-shadow duration-500 group-hover:shadow-2xl flex items-center justify-center"
                style={{
                  width: '100%',
                  height: '100%'
                }}
              >
                <img src="/checked.png" alt="Upcoming" className="w-full h-full object-cover" />

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  whileHover={{ opacity: 1, y: 0 }}
                  className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-[#1E1E1D] text-white px-4 py-2 shadow-lg rounded-[24px] whitespace-nowrap z-40 pointer-events-none"
                >
                  <span className="text-xs font-medium tracking-wide">View Product</span>
                </motion.div>
              </div>

              <div className="mt-3 pointer-events-none hidden sm:block">
                <h3 className="text-[14px] font-bold text-black">Upcoming</h3>
              </div>
            </motion.div>
          </div>

          {/* Fourth row, third column - The Social Fablab cell (next to Upcoming) */}
          <div
            className="absolute  flex items-end md:items-center justify-center pb-6 md:pb-0"
            style={{
              left: '640px',
              top: '960px',
              width: '320px',
              height: '320px'
            }}
          >
            {/* The Social Fablab Project inside this cell */}
            <motion.div
              drag={false}
              whileHover={{
                scale: 1.05,
                zIndex: 50,
                rotate: 15
              }}
              onTap={() => {
                const clickTimeout = setTimeout(() => {
                  navigate(`/project/8`);
                }, 250);
              }}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              style={{
                rotate: 15,
                width: '178px',
                height: '96px'
              }}
              className="cursor-pointer group"
            >
              <div
                className="relative rounded-[16px] overflow-hidden bg-white shadow-lg transition-shadow duration-500 group-hover:shadow-2xl flex items-center justify-center"
                style={{
                  width: '100%',
                  height: '100%'
                }}
              >
                <img src="/fablab.jpg" alt="The Social Fablab" className="w-full h-full object-cover" />

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  whileHover={{ opacity: 1, y: 0 }}
                  className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-[#1E1E1D] text-white px-4 py-2 shadow-lg rounded-[24px] whitespace-nowrap z-40 pointer-events-none"
                >
                  <span className="text-xs font-medium tracking-wide">View Product</span>
                </motion.div>
              </div>

              <div className="mt-3 pointer-events-none hidden sm:block">
                <h3 className="text-[14px] font-bold text-black">The Social Fablab</h3>
                <p className="text-[12px] text-black text-left mt-1">Speculative & Brand Design</p>
              </div>
            </motion.div>
          </div>

          {/* Fourth row, fourth column - Diversa cell (next to Social Fablab) */}
          <div
            className="absolute bg-green-600 flex items-center justify-center"
            style={{
              left: '960px',
              top: '960px',
              width: '320px',
              height: '320px'
            }}
          >
            {/* Diversa Project inside this cell */}
            <motion.div
              drag={false}
              whileHover={{
                scale: 1.05,
                zIndex: 50,
                rotate: 30
              }}
              onTap={() => {
                const clickTimeout = setTimeout(() => {
                  navigate(`/project/9`);
                }, 250);
              }}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              style={{
                rotate: 30,
                width: '160px',
                height: '160px'
              }}
              className="cursor-pointer group"
            >
              <div
                className="relative rounded-[16px] overflow-hidden bg-white shadow-lg transition-shadow duration-500 group-hover:shadow-2xl flex items-center justify-center"
                style={{
                  width: '100%',
                  height: '100%'
                }}
              >
                <img src="/checked.png" alt="Diversa" className="w-full h-full object-cover" />

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  whileHover={{ opacity: 1, y: 0 }}
                  className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-[#1E1E1D] text-white px-4 py-2 shadow-lg rounded-[24px] whitespace-nowrap z-40 pointer-events-none"
                >
                  <span className="text-xs font-medium tracking-wide">View Product</span>
                </motion.div>
              </div>

              <div className="mt-3 pointer-events-none hidden sm:block">
                <h3 className="text-[14px] font-bold text-black">Diversa</h3>
                <p className="text-[12px] text-black text-left mt-1">Strategy & Brand Design</p>
              </div>
            </motion.div>
          </div>

          {/* Fourth row, fifth column - Empty cell */}
          <div
            className="absolute bg-gray-50"
            style={{
              left: '1280px',
              top: '960px',
              width: '320px',
              height: '320px'
            }}
          />

          {/* Fourth row, sixth column - Empty cell */}
          <div
            className="absolute bg-gray-50"
            style={{
              left: '1600px',
              top: '960px',
              width: '320px',
              height: '320px'
            }}
          />

          {/* Fifth row - Empty cells */}
          <div
            className="absolute bg-gray-50"
            style={{
              left: '-320px',
              top: '1280px',
              width: '320px',
              height: '320px'
            }}
          />

          <div
            className="absolute bg-gray-50"
            style={{
              left: '0px',
              top: '1280px',
              width: '320px',
              height: '320px'
            }}
          />

          <div
            className="absolute bg-gray-50"
            style={{
              left: '320px',
              top: '1280px',
              width: '320px',
              height: '320px'
            }}
          />

          <div
            className="absolute bg-gray-50"
            style={{
              left: '640px',
              top: '1280px',
              width: '320px',
              height: '320px'
            }}
          />

          <div
            className="absolute bg-gray-50"
            style={{
              left: '960px',
              top: '1280px',
              width: '320px',
              height: '320px'
            }}
          />

          <div
            className="absolute bg-gray-50"
            style={{
              left: '1280px',
              top: '1280px',
              width: '320px',
              height: '320px'
            }}
          />

          <div
            className="absolute bg-gray-50"
            style={{
              left: '1600px',
              top: '1280px',
              width: '320px',
              height: '320px'
            }}
          />
          <div
            className="absolute flex items-start md:items-center justify-start md:justify-center pl-6 md:pl-0 pt-6 md:pt-0"
            style={{
              left: typeof window !== 'undefined' && window.innerWidth < 768 ? '640px' : '320px',
              top: '640px',
              width: '320px',
              height: typeof window !== 'undefined' && window.innerWidth < 768 ? '100px' : '320px'
            }}
          >
            {/* id 11 Project inside this cell */}
            <motion.div
              drag={false}
              whileHover={{
                scale: 1.05,
                zIndex: 50,
                rotate: -15
              }}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              style={{
                rotate: -15,
                width: typeof window !== 'undefined' && window.innerWidth < 768 ? '96px' : '140px',
                height: typeof window !== 'undefined' && window.innerWidth < 768 ? '96px' : '140px'
              }}
              className="group"
            >
              <div
                className="relative rounded-[16px] overflow-hidden bg-white shadow-lg transition-shadow duration-500 flex items-center justify-center"
                style={{
                  width: '100%',
                  height: '100%'
                }}
              >
                <img src="/home.jpg" alt="Home" className="w-full h-full object-cover" />
              </div>
            </motion.div>
          </div>

          {/* Third row, third column - Lorem ipsum text cell (right of id 11 on desktop, left on mobile) */}
          <div
            className="absolute flex items-start md:items-center justify-end md:justify-start pr-6 md:pr-0 md:pl-6 md:pt-0"
            style={{
              left: typeof window !== 'undefined' && window.innerWidth < 768 ? '320px' : '640px',
              top: '640px',
              width: '320px',
              height: typeof window !== 'undefined' && window.innerWidth < 768 ? '420px' : '320px'
            }}
          >
            <p className="text-black text-[21px] md:text-[18px] leading-relaxed font-bold w-[147px] md:w-auto">
              Lorem ipsum dolor sit amet <br />consectetur adipiscing elit Ut et <br />massa mi. Aliquam in hendrerit <br />urna. Pellentesque sit amet
            </p>
          </div>

          {items.map(item => {
            const isClickable = item.id !== 4;
            // Use mobile position if available and on mobile viewport
            const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
            const itemX = isMobile && item.xMobile ? item.xMobile : item.x;
            const itemY = isMobile && item.yMobile ? item.yMobile : item.y;

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
                  left: itemX,
                  top: itemY,
                  rotate: item.rotation,
                  width: item.width || undefined,
                  height: item.height || undefined
                }}
                className={`absolute ${!item.width ? item.size : ''} ${isClickable ? 'cursor-pointer' : ''} group`}
              >
                <div
                  className={`relative ${!item.width && !item.height ? (item.aspectRatio || 'aspect-square') : ''} rounded-[16px] overflow-hidden bg-white shadow-lg transition-shadow duration-500 ${isClickable ? 'group-hover:shadow-2xl' : ''} flex items-center justify-center`}
                  style={{
                    width: item.width ? '100%' : undefined,
                    height: item.height ? '100%' : undefined
                  }}
                >

                  {/* Custom image or fallback */}
                  {item.image ? (
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  ) : (
                    // Fallback placeholder if no image specified
                    <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-400">
                      <span className="text-sm">No image</span>
                    </div>
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

                {/* Name and Description below the image */}
                <div className="mt-3 pointer-events-none hidden sm:block">
                  <h3 className="text-[14px] font-bold text-black">{item.name}</h3>
                  {item.description && (
                    <p className="text-[12px] text-black text-left mt-1">{item.description}</p>
                  )}
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </motion.div>

      {/* Bottom Controls Bar */}
      <div className="absolute bottom-20 md:bottom-8 left-0 right-0 px-6 md:px-12 flex items-end justify-between pointer-events-none z-50">

        <div className="flex items-center justify-center gap-3 pointer-events-auto w-full md:w-auto">
          <motion.button
            ref={aboutButtonRef}
            whileHover={{ y: -2 }}
            onClick={handleAboutClick}
            className="h-[52px] w-full md:w-auto flex items-center justify-center bg-[#1E1E1D] text-white px-6 rounded-xl shadow-lg hover:bg-black transition-colors gap-2"
          >
            {/* Replaced standard Info icon with custom Hexagon Info */}
            <HexagonInfoIcon className="w-5 h-5 flex-shrink-0" />
            <span className="text-sm font-medium">About</span>
          </motion.button>
        </div>

        {/* Info Section with white background - Bottom right */}
        <div className="sm:flex hidden items-center gap-6 bg-white text-black rounded-[16px] px-6 py-3 shadow-lg pointer-events-auto">
          <div className="text-[15px] font-semibold">
            <div>Shaping sense through</div>
            <div>Brand and Product Design</div>
          </div>

          <div className="text-[15px] font-semibold">
            <div>hello@dorodavid.com</div>
            <div>+39 3456366497</div>
          </div>

          <div className="text-[15px] font-semibold">
            <div>San Zeno, 31100</div>
            <div>Treviso, Italia.</div>
          </div>
        </div>
      </div>

    </motion.section>
  );
};

export default Hero;