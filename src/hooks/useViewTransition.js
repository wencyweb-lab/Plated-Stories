"use client";
import { useTransitionRouter } from "next-view-transitions";
import { gsap } from "gsap";

export const useViewTransition = () => {
  const router = useTransitionRouter();

  function createSVGOverlay() {
    let overlay = document.querySelector(".page-transition-overlay");
    if (!overlay) {
      overlay = document.createElement("div");
      overlay.className = "page-transition-overlay";
      overlay.innerHTML = `
        <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
          <path class="overlay__path" vector-effect="non-scaling-stroke" d="M 0 100 V 100 C 18 100 32 100 50 100 C 68 100 82 100 100 100 V 100 H 0 Z" />
        </svg>
      `;
      document.body.appendChild(overlay);
    }
    return overlay;
  }

  function slideInOut(href, onRouteChange) {
    const overlay = createSVGOverlay();
    const overlayPath = overlay.querySelector(".overlay__path");

    if (!overlayPath) return;

    const paths = {
      step1: {
        unfilled: "M 0 100 V 100 C 18 100 32 100 50 100 C 68 100 82 100 100 100 V 100 H 0 Z",
        inBetween: "M 0 100 V 66 C 16 66 34 16 54 16 C 74 16 88 60 100 60 V 100 H 0 Z",
        filled: "M 0 100 V 0 C 18 0 32 0 50 0 C 68 0 82 0 100 0 V 100 H 0 Z",
      },
      step2: {
        filled: "M 0 0 V 100 C 18 100 32 100 50 100 C 68 100 82 100 100 100 V 0 H 0 Z",
        inBetween: "M 0 0 V 58 C 16 58 30 14 46 14 C 66 14 86 50 100 50 V 0 H 0 Z",
        unfilled: "M 0 0 V 0 C 18 0 32 0 50 0 C 68 0 82 0 100 0 V 0 H 0 Z",
      },
    };

    const timeline = gsap.timeline({
      onComplete: () => {
        if (overlay && overlay.parentNode) {
          overlay.parentNode.removeChild(overlay);
        }
      },
    });

    timeline
      .set(overlayPath, {
        attr: { d: paths.step1.unfilled },
      })
      // Cover: accelerate away from rest, then decelerate into the flat top.
      // power2.in -> power2.out hands off at a matched velocity, so the two
      // tweens read as one continuous ease rather than two with a kink.
      .to(overlayPath, {
        duration: 0.5,
        ease: "power2.in",
        attr: { d: paths.step1.inBetween },
      })
      .to(overlayPath, {
        duration: 0.35,
        ease: "power2.out",
        attr: { d: paths.step1.filled },
        onComplete: () => {
          router.push(href);

          if (onRouteChange) {
            onRouteChange();
          }
        },
      })
      // Hold while the next route mounts and paints.
      .to({}, { duration: 0.65 })
      .set(overlayPath, {
        attr: { d: paths.step2.filled },
      })
      // Reveal: short pickup, then a long power3 settle off the top edge.
      .to(overlayPath, {
        duration: 0.3,
        ease: "power2.in",
        attr: { d: paths.step2.inBetween },
      })
      .to(overlayPath, {
        duration: 0.85,
        ease: "power3.out",
        attr: { d: paths.step2.unfilled },
      });
  }

  const navigateWithTransition = (href, onRouteChange, options = {}) => {
    const currentPath = window.location.pathname;
    if (currentPath === href) {
      return;
    }

    slideInOut(href, onRouteChange);
  };

  return { navigateWithTransition, router };
};
