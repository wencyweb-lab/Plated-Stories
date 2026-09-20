"use client";
import { useEffect, useState, useRef } from "react";
import { usePathname } from "next/navigation";
import { ReactLenis } from "lenis/react";
import Menu from "@/components/Menu/Menu";

export default function ClientLayout({ children }) {
  const pageRef = useRef();
  const pathname = usePathname();

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 1000);
    };

    checkMobile();

    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Lets the page-transition overlay (useViewTransition) know when the route
  // we just navigated to has actually mounted AND its images/video have
  // loaded, so the reveal is driven by real readiness instead of a fixed
  // guess. Fires on every pathname change, including the first render — that
  // dispatch is harmless since no transition is listening yet at that point.
  useEffect(() => {
    let cancelled = false;
    let rafId2 = null;

    const notifyReady = () => {
      if (!cancelled) window.dispatchEvent(new Event("page-transition:ready"));
    };

    // Wait a couple of frames so the new route's DOM has actually painted
    // before we go looking for its media.
    const rafId1 = requestAnimationFrame(() => {
      rafId2 = requestAnimationFrame(() => {
        if (cancelled) return;

        const container = pageRef.current || document;
        const media = Array.from(container.querySelectorAll("img, video"));
        const pending = media.filter((el) =>
          el.tagName === "IMG" ? !el.complete : el.readyState < 3
        );

        if (pending.length === 0) {
          notifyReady();
          return;
        }

        let remaining = pending.length;
        const onSettle = () => {
          remaining -= 1;
          if (remaining <= 0) notifyReady();
        };

        pending.forEach((el) => {
          const doneEvent = el.tagName === "IMG" ? "load" : "loadeddata";
          el.addEventListener(doneEvent, onSettle, { once: true });
          el.addEventListener("error", onSettle, { once: true });
        });
      });
    });

    return () => {
      cancelled = true;
      cancelAnimationFrame(rafId1);
      if (rafId2) cancelAnimationFrame(rafId2);
    };
  }, [pathname]);

  const scrollSettings = isMobile
    ? {
        duration: 0.8,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        direction: "vertical",
        gestureDirection: "vertical",
        smooth: true,
        smoothTouch: true,
        touchMultiplier: 1.5,
        infinite: false,
        lerp: 0.09,
        wheelMultiplier: 1,
        orientation: "vertical",
        smoothWheel: true,
        syncTouch: true,
      }
    : {
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        direction: "vertical",
        gestureDirection: "vertical",
        smooth: true,
        smoothTouch: false,
        touchMultiplier: 2,
        infinite: false,
        lerp: 0.1,
        wheelMultiplier: 1,
        orientation: "vertical",
        smoothWheel: true,
        syncTouch: true,
      };

  return (
    <ReactLenis root options={scrollSettings}>
      <Menu />

      <div className="page" ref={pageRef}>
        {children}
      </div>
    </ReactLenis>
  );
}
