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
          <path class="overlay__path" vector-effect="non-scaling-stroke" d="M 0 100 v 0 c 50 0 50 0 100 0 V 100 H 0 Z" />
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
        unfilled: "M 0 100 v 0 c 50 0 50 0 100 0 V 100 H 0 Z",
        inBetween: "M 0 100 v -43 c 55 60 65 -140 100 0 V 100 H 0 Z",
        filled: "M 0 100 v -100 c 50 0 50 0 100 0 V 100 H 0 Z",
      },
      step2: {
        filled: "M 0 0 V 100 c 50 0 50 0 100 0 v -100 H 50 Z",
        inBetween: "M 0 0 V 50 c 43 -28 81 -4 100 0 v -50 H 0 Z",
        unfilled: "M 0 0 V 0 c 50 0 50 0 100 0 v 0 H 0 Z",
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
      .to(
        overlayPath,
        {
          duration: 0.6,
          ease: "power4.in",
          attr: { d: paths.step1.inBetween },
        },
        0
      )
      .to(overlayPath, {
        duration: 0.2,
        ease: "power1",
        attr: { d: paths.step1.filled },
        onComplete: () => {
          router.push(href);

          if (onRouteChange) {
            onRouteChange();
          }
        },
      })
      .to({}, { duration: 0.75 })
      .set(overlayPath, {
        attr: { d: paths.step2.filled },
      })
      .to(overlayPath, {
        duration: 0.15,
        ease: "sine.in",
        attr: { d: paths.step2.inBetween },
      })
      .to(overlayPath, {
        duration: 1,
        ease: "power4",
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
