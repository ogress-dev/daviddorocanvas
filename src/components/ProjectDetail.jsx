import React, { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/customSupabaseClient';
const ProjectDetail = () => {
  const {
    id
  } = useParams();
  const navigate = useNavigate();
  const containerRef = useRef(null);

  // Convert ID to number safely
  const productId = parseInt(id, 10) || 1;
  const getProductTitle = id => {
    switch (id) {
      case 1:
        return "Albed Price list";
      case 2:
        return "Muso";
      case 3:
        return "Abaco";
      case 4:
        return "The Social Fablab";
      case 5:
        return "Diversa";
      case 6:
        return "Culto della Luce";
      case 7:
        return "Empathy Design";
      case 8:
        return "ApCollective";
      case 9:
        return "Grillwise";
      case 10:
        return "Syform";
      default:
        return "Collection 2026";
    }
  };

  const getBucketFolder = id => {
    switch (id) {
      case 1:
        return "Albed-Price-list";
      case 2:
        return "Muso";
      case 3:
        return "Abaco";
      case 4:
        return "The-Social-Fablab";
      case 5:
        return "Diversa";
      case 6:
        return "Culto-della-Luce";
      case 7:
        return "Empathy-Design";
      case 8:
        return "ApCollective";
      case 9:
        return "Grillwise";
      case 10:
        return "Syform";
      default:
        return "";
    }
  };

  // State for editable title
  const [editableTitle, setEditableTitle] = useState(getProductTitle(productId));

  // State for project images
  const [projectImages, setProjectImages] = useState([]);

  // Update title when product changes
  useEffect(() => {
    setEditableTitle(getProductTitle(productId));
  }, [productId]);

  // Fetch project images from Supabase
  useEffect(() => {
    const fetchImages = async () => {
      const bucketFolder = getBucketFolder(productId);
      if (!bucketFolder) return;
      try {
        const { data, error } = await supabase.storage.from('product-images').list(bucketFolder);
        if (error) {
          console.error('Error fetching images for', bucketFolder, error);
          return;
        }
        const imageUrls = data
          .filter(file => file.name.match(/\.(jpg|jpeg|png|gif|webp)$/i))
          .map(file => supabase.storage.from('product-images').getPublicUrl(`${bucketFolder}/${file.name}`).data.publicUrl);
        setProjectImages(imageUrls);
      } catch (err) {
        console.error('Error fetching images for', bucketFolder, err);
      }
    };
    fetchImages();
  }, [productId]);

  // Physics state for smooth scrolling
  const scrollState = useRef({
    target: 0,
    current: 0,
    isScrolling: false
  });
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Animation Loop for Smooth Inertia Scroll (Desktop)
    let animationFrameId;
    const updateScroll = () => {
      // Only run physics on desktop where we hijack the scroll to be horizontal
      if (window.innerWidth >= 768) {
        const state = scrollState.current;

        // Linear Interpolation (Lerp) for fluid inertia
        // Formula: current = current + (target - current) * factor
        const diff = state.target - state.current;
        const delta = diff * 0.08; // 0.08 provides a high-end "weighty" feel

        if (Math.abs(diff) > 0.5) {
          state.current += delta;
          container.scrollLeft = state.current;
          animationFrameId = requestAnimationFrame(updateScroll);
          state.isScrolling = true;
        } else {
          // Snap to exact position when close enough to stop micro-calculations
          state.current = state.target;
          container.scrollLeft = state.current;
          state.isScrolling = false;
        }
      }
    };
    const handleWheel = e => {
      if (window.innerWidth >= 768) {
        e.preventDefault();
        const state = scrollState.current;
        const maxScroll = container.scrollWidth - container.clientWidth;

        // Accumulate deltaY into our target. 
        // Multiplier 1.5 accelerates the scroll slightly for better responsiveness
        state.target += e.deltaY * 1.5;

        // Clamp target to bounds [0, maxScroll]
        state.target = Math.max(0, Math.min(state.target, maxScroll));

        // Start animation loop if not already running
        if (!state.isScrolling) {
          // Sync current to actual scroll position (in case of window resize or touch)
          state.current = container.scrollLeft;
          updateScroll();
        }
      }
    };

    // Initial setup
    scrollState.current.target = container.scrollLeft;
    scrollState.current.current = container.scrollLeft;

    // We use passive: false to allow preventDefault()
    container.addEventListener('wheel', handleWheel, {
      passive: false
    });
    return () => {
      container.removeEventListener('wheel', handleWheel);
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
    };
  }, []);

  // Assets
  const logoUrl = "https://horizons-cdn.hostinger.com/38ec5550-5152-446c-bb9a-73388eb1666a/2e4bb3b0129f32c64a6d4db826afbca6.png";
  const fallbackImages = [
    "https://horizons-cdn.hostinger.com/38ec5550-5152-446c-bb9a-73388eb1666a/28eeef3a9cf0871a1a2bee8b7a4d75a0.jpg",
    "https://horizons-cdn.hostinger.com/38ec5550-5152-446c-bb9a-73388eb1666a/20aefb5a45a9df8a3655778d16003257.jpg",
    "https://horizons-cdn.hostinger.com/38ec5550-5152-446c-bb9a-73388eb1666a/318be5339e647d9619f809f4efe92695.jpg",
    "https://horizons-cdn.hostinger.com/38ec5550-5152-446c-bb9a-73388eb1666a/c3482573111cc00bed9df726134b3ffe.jpg",
    "https://horizons-cdn.hostinger.com/38ec5550-5152-446c-bb9a-73388eb1666a/d31e634b326074fc1749aa30d51e5285.jpg"
  ];
  return <motion.div initial={{
    opacity: 0,
    scale: 0.8
  }} animate={{
    opacity: 1,
    scale: 1
  }} exit={{
    opacity: 0,
    scale: 0.8
  }} transition={{
    duration: 0.6,
    ease: [0.22, 1, 0.36, 1]
  }} className="relative w-screen h-screen bg-white text-[#1E1E1D] overflow-hidden">
      {/* Navigation Controls */}
      <div className="absolute top-0 left-0 w-full p-6 md:p-12 flex justify-between items-start z-50 pointer-events-none">
        <button onClick={() => navigate('/')} className="pointer-events-auto p-2 md:p-3 bg-white/80 hover:bg-white rounded-full shadow-sm hover:shadow-md transition-all duration-300 backdrop-blur-sm" aria-label="Back to collection">
          <ArrowLeft className="w-5 h-5 md:w-6 md:h-6" />
        </button>
        <div className="pointer-events-auto">
             <button onClick={() => navigate('/')} className="focus:outline-none">
                 <img alt="Orodavid Logo" className="h-8 md:h-10 w-auto object-contain cursor-pointer" src={logoUrl} />
             </button>
        </div>
      </div>

      {/* 
          Main Scroll Container 
          - Mobile: overflow-y-auto + snap-y snap-mandatory (App-like vertical feel)
          - Desktop: no-scrollbar (hidden) + custom JS inertia scroll (Premium horizontal feel)
       */}
      <div ref={containerRef} className="
            w-full h-full 
            flex flex-col md:flex-row 
            overflow-y-auto md:overflow-y-hidden md:overflow-x-auto 
            snap-y snap-mandatory md:snap-none 
            no-scrollbar
        ">
        {/* Section 1: Introduction (Text Block) */}
        <div className="w-full md:w-[45vw] lg:w-[40vw] min-h-screen md:h-screen shrink-0 snap-start flex flex-col justify-center p-8 md:p-16 lg:p-20 bg-[#F8F8F7]"> {/* Reduced vertical padding */}
             <motion.div initial={{
          y: 30,
          opacity: 0
        }} animate={{
          y: 0,
          opacity: 1
        }} transition={{
          delay: 0.3,
          duration: 0.8,
          ease: "easeOut"
        }}>
                {/* Editable Text Area replacing H1 */}
                <textarea value={editableTitle} onChange={e => setEditableTitle(e.target.value)} className="w-full bg-transparent border-none focus:outline-none resize-none p-0 text-5xl md:text-7xl lg:text-8xl font-light mb-6 md:mb-8 tracking-tight leading-[0.95] text-[#1E1E1D] placeholder:text-gray-300 block" rows={2} spellCheck="false" />

                {/* Description Text */}
                <div className="text-lg md:text-xl font-light text-gray-600 max-w-md leading-relaxed space-y-4 mb-12"> {/* Reduced space-y and mb */}
                    <p>Deceptively strong porcelain speckled in calming glazes. This collection combines understated beauty with lasting durability, making every moment at home feel indulgent. Hi Ogres</p>
                    <p>
                        Designed for the modern table, rooted in traditional craftsmanship.
                    </p>
                </div>
                
                {/* Updated Details Section (Dettagli) */}
                <div className="mt-8 md:mt-16 bg-white/50 backdrop-blur-sm rounded-xl p-4 border border-gray-200"> {/* Reduced mt and p */}
                    {/* <h3 className="text-xl md:text-2xl font-medium text-[#1E1E1D] mb-3">Dettagli</h3> Removed title */}
                    <div className="flex flex-col">
                        {/* Row 1 */}
                        <div className="flex items-center justify-between py-2 border-b border-[#1E1E1D]/50"> {/* Reduced py */}
                            <h3 className="text-sm font-normal uppercase tracking-widest text-gray-500">CLIENTE</h3> {/* Changed to h3 */}
                            <span className="text-base font-light text-[#1E1E1D]">Orodavid</span> {/* Adjusted font size */}
                        </div>
                        {/* Row 2 */}
                        <div className="flex items-center justify-between py-2 border-b border-[#1E1E1D]/50"> {/* Reduced py */}
                            <h3 className="text-sm font-normal uppercase tracking-widest text-gray-500">CATEGORIA</h3> {/* Changed to h3 */}
                            <span className="text-base font-light text-[#1E1E1D]">Design</span> {/* Adjusted font size */}
                        </div>
                        {/* Row 3 */}
                        <div className="flex items-center justify-between py-2"> {/* Removed border-b */}
                            <h3 className="text-sm font-normal uppercase tracking-widest text-gray-500">ANNO</h3> {/* Changed to h3 */}
                            <span className="text-base font-light text-[#1E1E1D]">2026</span> {/* Adjusted font size */}
                        </div>
                    </div>
                </div>
             </motion.div>
        </div>

        {/* Section 2: Full Screen Hero Image (Text Removed) */}
        <div className="w-full md:w-screen h-[60vh] md:h-screen shrink-0 snap-center relative overflow-hidden group">
             <div className="w-full h-full overflow-hidden relative">
                <img className="w-full h-full object-cover transition-transform duration-[2s] ease-out group-hover:scale-105" alt="Collection Hero - Minimalist ceramic dining set" src={projectImages[0] || "https://tcxhdhzcqagieclvmvjm.supabase.co/storage/v1/object/public/product-images/Grillwise-046-Modifica.jpg"} />
                
                {/* Optional subtle overlay for image depth, but text is removed */}
                <div className="absolute inset-0 bg-black/10 pointer-events-none" />
             </div>
        </div>

        {/* Section 3: 2x2 Grid */}
        <div className="w-full md:w-screen h-auto md:h-screen shrink-0 snap-center grid grid-cols-1 md:grid-cols-2 md:grid-rows-2">
            <div className="relative aspect-square md:aspect-auto border-b md:border-b md:border-r border-white/20">
                 <img src={projectImages[1] || fallbackImages[1]} className="w-full h-full object-cover" alt="Detail view" />
            </div>
            <div className="relative aspect-square md:aspect-auto border-b md:border-white/20 bg-[#EBEBE9] flex items-center justify-center p-12">
                 <div className="max-w-xs text-center">
                    <h3 className="text-3xl font-light mb-4">Texture</h3>
                    <p className="text-gray-500 leading-relaxed">Smooth finishes with organic, reactive edges that catch the light.</p>
                 </div>
            </div>
            <div className="relative aspect-square md:aspect-auto border-b md:border-b-0 md:border-r border-white/20 bg-[#1E1E1D] text-white flex items-center justify-center p-12">
                 <div className="max-w-xs text-center">
                    <h3 className="text-3xl font-400 mb-4">Form</h3>
                    <p className="text-gray-400 leading-relaxed">Minimalist silhouettes designed for stacking and daily use.</p>
                 </div>
            </div>
            <div className="relative aspect-square md:aspect-auto">
                 <img src={projectImages[4] || fallbackImages[4]} className="w-full h-full object-cover" alt="Collage detail" />
            </div>
        </div>

        {/* Section 4: Vertical Image + Text split */}
        <div className="w-full md:w-[70vw] h-auto md:h-screen shrink-0 snap-center flex flex-col md:flex-row bg-white">
             <div className="w-full md:w-1/2 h-[50vh] md:h-full relative">
                <img src={projectImages[3] || fallbackImages[3]} className="w-full h-full object-cover" alt="Books stack" />
             </div>
             <div className="w-full md:w-1/2 flex items-center justify-center p-12 md:p-20">
                 <div className="max-w-md">
                    <span className="text-sm font-bold uppercase tracking-widest text-gray-400 mb-6 block">Philosophy</span>
                    <h2 className="text-3xl md:text-5xl font-light mb-8 leading-tight">From old to gold.</h2>
                    <p className="text-gray-600 leading-relaxed mb-8 text-lg">
                        We repurpose traditional techniques for contemporary living. 
                        Each piece tells a story of transformation, where raw earth becomes 
                        an object of refined beauty.
                    </p>
                    <button className="group flex items-center gap-4 text-sm font-bold uppercase tracking-widest hover:text-gray-600 transition-colors">
                        Read the story
                        <span className="block w-8 h-[1px] bg-black group-hover:bg-gray-600 transition-colors"></span>
                    </button>
                 </div>
             </div>
        </div>

        {/* Section 5: Full Screen Graphic */}
        <div className="w-full md:w-[60vw] h-[50vh] md:h-screen shrink-0 snap-center bg-black relative flex items-center justify-center overflow-hidden">
             <div className="absolute inset-0 opacity-80">
                <img src={projectImages[2] || fallbackImages[2]} className="w-full h-full object-cover grayscale opacity-70" alt="Data visualization" />
             </div>
             <div className="relative z-10 text-center text-white p-8">
                 <h2 className="text-6xl md:text-9xl font-bold tracking-tighter mb-4">45.8%</h2>
                 <p className="text-xl font-light tracking-wide text-gray-300">Sustainable Materials</p>
             </div>
        </div>

        {/* Section 6: Full Screen End */}
        <div className="w-full md:w-screen h-[80vh] md:h-screen shrink-0 snap-center relative">
             <img src={projectImages[1] || "https://tcxhdhzcqagieclvmvjm.supabase.co/storage/v1/object/public/product-images/Grillwise-046-Modifica.jpg"} className="w-full h-full object-cover" alt="Collection End" />
             <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                {/* Removed "Shop Collection" button */}
             </div>
        </div>
      </div>
    </motion.div>;
};
export default ProjectDetail;