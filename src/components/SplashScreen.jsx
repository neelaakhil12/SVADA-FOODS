import React, { useEffect, useState } from 'react';

export default function SplashScreen({ onComplete }) {
  const [isMounted, setIsMounted] = useState(false);
  const [isRevealed, setIsRevealed] = useState(false);
  const [isFadingOut, setIsFadingOut] = useState(false);

  useEffect(() => {
    // 1. Gently fade in and scale up the white logo (almost instant)
    const mountTimer = setTimeout(() => {
      setIsMounted(true);
    }, 10);

    // 2. Start the elegant left-to-right wipe animation to reveal the colorful logo
    const revealTimer = setTimeout(() => {
      setIsRevealed(true);
    }, 200);

    // 3. Start fading out the entire splash screen
    const fadeTimer = setTimeout(() => {
      setIsFadingOut(true);
    }, 1000);

    // 4. Unmount the splash screen and notify parent
    const completeTimer = setTimeout(() => {
      onComplete();
    }, 1400);

    // Disable body scroll when splash screen is active
    document.body.style.overflow = 'hidden';

    return () => {
      clearTimeout(mountTimer);
      clearTimeout(revealTimer);
      clearTimeout(fadeTimer);
      clearTimeout(completeTimer);
      // Restore scroll
      document.body.style.overflow = '';
    };
  }, [onComplete]);

  return (
    <div
      className={`fixed inset-0 z-[9999] flex items-center justify-center bg-secondary transition-all duration-[400ms] ease-out ${
        isFadingOut ? 'opacity-0 scale-105 pointer-events-none' : 'opacity-100 scale-100'
      }`}
      style={{
        backgroundColor: '#F4A300', // Explicit fallback matching --color-secondary (logo yellow)
      }}
    >
      <div
        className={`relative w-72 h-72 md:w-96 md:h-96 transition-all duration-500 ease-out transform ${
          isMounted ? 'opacity-100 scale-100' : 'opacity-0 scale-90'
        }`}
      >
        {/* 1. Colorful Brand Logo (Bottom Layer) */}
        <img
          src="/logo.png"
          alt="SVADA Foods Logo"
          className="w-full h-full object-contain filter drop-shadow-[0_8px_30px_rgba(217,79,4,0.08)]"
        />

        {/* 2. Solid White Logo (Top Layer with wipe effect) */}
        <img
          src="/logo.png"
          alt="SVADA Foods Logo Cover"
          className="absolute inset-0 w-full h-full object-contain select-none pointer-events-none filter brightness-0 invert drop-shadow-[0_8px_30px_rgba(255,255,255,0.4)]"
          style={{
            clipPath: isRevealed ? 'inset(0 0 0 100%)' : 'inset(0 0 0 0%)',
            transition: 'clip-path 700ms cubic-bezier(0.76, 0, 0.24, 1)',
            willChange: 'clip-path',
          }}
        />
      </div>
    </div>
  );
}
