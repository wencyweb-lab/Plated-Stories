"use client";
import { useRouter } from "next/navigation";
import { gsap } from "gsap";

// The page transition is driven entirely by the GSAP overlay below — we do NOT
// use the browser's View Transition API here. Layering the two (this timeline
// plus next-view-transitions' `document.startViewTransition`) meant every
// navigation raced a transition the router could not finish in time, which
// surfaced as "Transition was aborted because of timeout in DOM update" /
// InvalidStateError unhandled rejections and, worse, a swallowed `router.push`
// so the overlay played but the route never changed.

// Guards against a second click while a transition is mid-flight — otherwise
// two timelines fight over the same overlay node and one of them removes it
// out from under the other.
let activeTimeline = null;

export const useViewTransition = () => {
  const router = useRouter();

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

  function removeOverlay() {
    const overlay = document.querySelector(".page-transition-overlay");
    if (overlay && overlay.parentNode) {
      overlay.parentNode.removeChild(overlay);
    }
  }

  function slideInOut(href, onRouteChange) {
    const overlay = createSVGOverlay();
    const overlayPath = overlay.querySelector(".overlay__path");

    // No overlay to animate — still navigate rather than dropping the click.
    if (!overlayPath) {
      router.push(href);
      if (onRouteChange) onRouteChange();
      return;
    }

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
        activeTimeline = null;
        removeOverlay();
      },
    });

    activeTimeline = timeline;

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
          // Screen is fully covered — safe to swap the route.
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

  // `href` is authored decoded (see workCategories.js) while
  // `window.location.pathname` comes back percent-encoded, so both sides are
  // decoded before the same-page check — otherwise "/a b" never matches
  // "/a%20b" and we'd replay the whole transition onto the current page.
  const samePath = (a, b) => {
    const decode = (value) => {
      try {
        return decodeURIComponent(value);
      } catch {
        return value;
      }
    };
    return decode(a).replace(/\/$/, "") === decode(b).replace(/\/$/, "");
  };

  const navigateWithTransition = (href, onRouteChange, options = {}) => {
    if (!href) return;

    const [path] = href.split("#");
    if (samePath(window.location.pathname, path)) {
      if (onRouteChange) onRouteChange();
      return;
    }

    // A transition is already running; ignore the extra click instead of
    // stacking a second overlay on top of it.
    if (activeTimeline && activeTimeline.isActive()) return;

    slideInOut(href, onRouteChange);
  };

  return { navigateWithTransition, router };
};
