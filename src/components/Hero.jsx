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

  // State for the custom "View Reset" message visibility
  const [showResetMessage, setShowResetMessage] = useState(false);

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
    {
      id: 1,
      name: "Muso",
      description: 'Brand, Strategy, Web & Product Design',
      image: '/muso.jpg',
      bucketFolder: "Muso",
      x: '-5%',
      xMobile: '-90%',
      y: '15%',
      yMobile: '35%',
      width: '270px',
      height: '270px',
      rotation: -15
    },
    {
      id: 2,
      name: "ApCollective",
      description: 'Portfolio',
      image: '/apcollective.png',
      bucketFolder: "ApCollective",
      x: '30%',
      xMobile: '-10%',
      y: '20%',
      yMobile: '24%',
      rotation: -30,
      width: '120px',
      height: '170px'
    },
    {
      id: 3,
      name: "Abaco",
      description: 'Product Design',
      image: '/abaco.jpg',
      bucketFolder: "Abaco",
      x: '60%',
      xMobile: '60%',
      y: '20%',
      yMobile: '25%',
      rotation: 30,
      width: '170px',
      height: '170px'
    },
    {
      id: 4,
      name: "Albed Price Book",
      description: 'Strategy & Editorial Design',
      image: '/albed.jpg',
      bucketFolder: "Muso",
      x: '85%',
      xMobile: '120%',
      y: '15%',
      yMobile: '-3%',
      width: '270px',
      height: '270px',
      rotation: 30
    },
    {
      id: 5,
      name: "Empathy Design",
      description: 'Logo & Set Design',
      image: '/checked.png',
      bucketFolder: "Empathy-Design",
      x: '-10%',
      xMobile: '-70%',
      y: '50%',
      yMobile: '58%',
      rotation: -30,
      width: '160px',
      height: '160px'
    },
    {
      id: 6,
      name: "Syform",
      description: 'Set & Graphic Design',
      image: '/checked.png',
      bucketFolder: "Syform",
      x: '5%',
      xMobile: '-40%',
      y: '65%',
      yMobile: '75%',
      width: '160px',
      height: '160px',
      rotation: -30
    },

    {
      id: 7,
      name: "Grillwise",
      description: 'Brand & Web Design',
      image: 'grillwise.jpg',
      bucketFolder: "Grillwise",
      x: '75%',
      xMobile: '50%',
      y: '50%',
      yMobile: '65%',
      width: '288px',
      height: '160px',
      rotation: 30
    },
    {
      id: 8,
      name: "The Social Fablab",
      description: 'Speculative & Brand Design',
      image: '/fablab.jpg',
      bucketFolder: "The-Social-Fablab",
      x: '55%',
      xMobile:'85%',
      y: '68%',
      yMobile: '85%',
      rotation: 30,
      width: '178px',
      height: '96px'
    },
    {
      id: 9,
      name: "Diversa",
      description: 'Strategy & Brand Design',
      image: '/checked.png',
      bucketFolder: "Diversa",
      x: '75%',
      xMobile:'120%',
      y: '65%',
      yMobile: '50%',
      width: '160px',
      height: '160px',
      rotation: 30,
      aspectRatio: 'aspect-video'
    },
    {
      id: 10,
      name: "Upcoming",
      bucketFolder: "Culto-della-Luce",
      image: '/checked.png',
      x: '25%',
      xMobile: '16%',
      y: '68%',
      yMobile: '85%',
      rotation: -15,
      width: '160',
      height: '208px'
    },
    {
      id: 11,
      x: '25%',
      xMobile: '55%', // Center on mobile (swapped with lorem ipsum)
      y: '49%',
      yMobile: '45%',
      image: '/home.jpg',
      size: 'w-48 md:w-60',
      width: '96px',
      height: '96px',
      rotation: -30
    },
    {
      id: 12,
      name: '????',
      x: '105%',
      xMobile: '150%',
      image: 'checked.png',
      y: '45%',
      yMobile: '30%',
      size: 'w-48 md:w-60',
      width: '96px',
      height: '96px',
      rotation: 45
    },




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

    // Show the custom centered "View Reset" message
    setShowResetMessage(true);
    setTimeout(() => {
      setShowResetMessage(false);
    }, 1500); // Message disappears after 1.5 seconds
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
    const canvasWidth = 1500;
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
            left: -Math.max(1000, Math.abs(1500 - window.innerWidth) * 3.5),
            right: Math.max(1000, Math.abs(1500 - window.innerWidth) * 3.5),
            // Vertical boundaries (independent - adjust verticalBoundaryFactor above)
            top: -Math.max(300, Math.abs(1603 - window.innerHeight) * 0.8),
            bottom: Math.max(300, Math.abs(1603 - window.innerHeight) * 0.8)
          }}
          dragElastic={0.05}
          dragTransition={{ bounceStiffness: 300, bounceDamping: 20, power: 0.2 }}
          style={{
            width: '1500px',
            height: '1603px',
            x,
            y
          }}
          className="relative"
        >
          {/* Centered Text */}
          <div className="absolute top-1/2 md:left-1/2 left-[25%] -translate-x-1/2 -translate-y-1/2 text-start pointer-events-none max-w-2xl px-4">
            <p className="text-black text-[16px] leading-relaxed font-bold w-[159px] sm:w-full">
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
      <div className="absolute bottom-8 left-0 right-0 px-6 md:px-12 flex items-end justify-between pointer-events-none z-50">

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