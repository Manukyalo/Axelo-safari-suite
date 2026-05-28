import dynamic from 'next/dynamic';

// Dynamic imports of sections with ssr: false to prevent SSR conflicts 
// with GSAP, Lenis, and Framer Motion, optimizing initial load performance.
const Nav = dynamic(() => import('@/components/Nav'), { ssr: false });
const Hero = dynamic(() => import('@/sections/Hero'), { ssr: false });
const TrustBar = dynamic(() => import('@/sections/TrustBar'), { ssr: false });
const Features = dynamic(() => import('@/sections/Features'), { ssr: false });
const FeatureSpotlight = dynamic(() => import('@/sections/FeatureSpotlight'), { ssr: false });
const ScreenshotGallery = dynamic(() => import('@/sections/ScreenshotGallery'), { ssr: false });
const Pricing = dynamic(() => import('@/sections/Pricing'), { ssr: false });
const CTA = dynamic(() => import('@/sections/CTA'), { ssr: false });
const Footer = dynamic(() => import('@/sections/Footer'), { ssr: false });

export default function Home() {
  return (
    <>
      {/* Cinematic Navigation bar */}
      <Nav />

      {/* Assembly of Marketing Web Sections */}
      <Hero />
      <TrustBar />
      <Features />
      <FeatureSpotlight />
      
      {/* Interactive Screenshot sandbox explorer */}
      <ScreenshotGallery />

      <Pricing />
      <CTA />
      
      {/* Brand Footer */}
      <Footer />
    </>
  );
}
