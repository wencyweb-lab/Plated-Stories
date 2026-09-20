"use client";
import "./HeroVisual.css";
import React, { useRef } from "react";
import gsap from "gsap";
import CustomEase from "gsap/CustomEase";
import { useGSAP } from "@gsap/react";
import { isInitialLoad } from "@/components/Preloader/Preloader";
import OptimizedVideo from "@/components/OptimizedVideo/OptimizedVideo";

gsap.registerPlugin(useGSAP, CustomEase);
CustomEase.create("hop", "0.9, 0, 0.1, 1");

// The landed hero composition: a central image the preloader zooms into,
// flanked by two tilted photos that fan out around it.
export default function HeroVisual() {
  const containerRef = useRef(null);

  useGSAP(
    () => {
      const center = containerRef.current?.querySelector(".hero-visual-center");
      const banners = gsap.utils.toArray(".hero-visual-banner");

      // Time the reveal to the moment the preloader clears on first load.
      const delay = isInitialLoad ? 5.5 : 0.5;

      if (center) {
        gsap.set(center, { scale: 1.1, opacity: 0 });
        gsap.to(center, {
          scale: 1,
          opacity: 1,
          duration: 0.45,
          ease: "power3.out",
          delay,
        });
      }

      if (banners.length) {
        gsap.set(banners, { scale: 0 });
        gsap.to(banners, {
          scale: 1,
          duration: 0.5,
          stagger: 0.07,
          ease: "back.out(1.6)",
          delay: delay + 0.1,
        });
      }
    },
    { scope: containerRef }
  );

  return (
    <div className="hero-visual" ref={containerRef} aria-hidden="true">
      <div className="hero-visual-banner hero-visual-banner-1">
        <OptimizedVideo
          src="/videos/Anklet.mp4"
          autoPlay
          muted
          loop
          playsInline
          loadDelay={isInitialLoad ? 7500 : 2200}
        />
      </div>
      <div className="hero-visual-banner hero-visual-banner-2">
        <OptimizedVideo
          src="/videos/Cocktail.mp4"
          autoPlay
          muted
          loop
          playsInline
          loadDelay={isInitialLoad ? 6500 : 1200}
        />
      </div>
      <div className="hero-visual-center">
        <OptimizedVideo src="/videos/Matilda.mp4" autoPlay muted loop playsInline eager />
      </div>
    </div>
  );
}
