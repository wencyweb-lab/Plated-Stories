"use client";
import "./Spotlight.css";
import { useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import SplitType from "split-type";
import { optimizeImageUrl } from "@/lib/media-delivery";

const SpotlightImage = ({ number }) => (
  <img
    src={optimizeImageUrl(`/spotlight/spotlight-${number}.jpg`, 640)}
    alt=""
    loading="lazy"
    decoding="async"
  />
);

gsap.registerPlugin(useGSAP, ScrollTrigger);

const Spotlight = () => {
  const spotlightRef = useRef(null);

  useGSAP(
    () => {
      const scrollTriggerInstances = [];

      const initSpotlight = () => {
        new SplitType(".marquee-text-item h1", { types: "chars" });

        document
          .querySelectorAll(".marquee-container")
          .forEach((container, index) => {
            const marquee = container.querySelector(".marquee");
            const chars = container.querySelectorAll(".char");

            const marqueeTrigger = gsap.to(marquee, {
              x: index % 2 === 0 ? "5%" : "-15%",
              scrollTrigger: {
                trigger: container,
                start: "top bottom",
                end: "150% top",
                scrub: true,
              },
              force3D: true,
            });

            const charsTrigger = gsap.fromTo(
              chars,
              { fontWeight: 100 },
              {
                fontWeight: 900,
                duration: 1,
                ease: "none",
                stagger: {
                  each: 0.35,
                  from: index % 2 === 0 ? "end" : "start",
                  ease: "linear",
                },
                scrollTrigger: {
                  trigger: container,
                  start: "50% bottom",
                  end: "top top",
                  scrub: true,
                },
              }
            );

            if (marqueeTrigger.scrollTrigger) {
              scrollTriggerInstances.push(marqueeTrigger.scrollTrigger);
            }
            if (charsTrigger.scrollTrigger) {
              scrollTriggerInstances.push(charsTrigger.scrollTrigger);
            }
          });

        ScrollTrigger.refresh();
      };

      const waitForOtherTriggers = () => {
        const existingTriggers = ScrollTrigger.getAll();
        const hasPinnedTrigger = existingTriggers.some(
          (trigger) => trigger.vars && trigger.vars.pin
        );

        if (hasPinnedTrigger || existingTriggers.length > 0) {
          setTimeout(initSpotlight, 300);
        } else {
          initSpotlight();
        }
      };

      setTimeout(waitForOtherTriggers, 100);

      return () => {
        scrollTriggerInstances.forEach((trigger) => trigger.kill());
      };
    },
    { scope: spotlightRef }
  );

  return (
    <section className="spotlight" ref={spotlightRef}>
      <div className="marquees">
        <div className="marquee-container" id="marquee-1">
          <div className="marquee">
            <div className="marquee-img-item">
              <SpotlightImage number={1} />
            </div>
            <div className="marquee-img-item marquee-text-item">
              <h1>Curation</h1>
            </div>
            <div className="marquee-img-item">
              <SpotlightImage number={2} />
            </div>
            <div className="marquee-img-item">
              <SpotlightImage number={3} />
            </div>
            <div className="marquee-img-item">
              <SpotlightImage number={4} />
            </div>
          </div>
        </div>

        <div className="marquee-container" id="marquee-2">
          <div className="marquee">
            <div className="marquee-img-item">
              <SpotlightImage number={5} />
            </div>
            <div className="marquee-img-item">
              <SpotlightImage number={6} />
            </div>
            <div className="marquee-img-item">
              <SpotlightImage number={7} />
            </div>
            <div className="marquee-img-item marquee-text-item">
              <h1>Direction</h1>
            </div>
            <div className="marquee-img-item">
              <SpotlightImage number={8} />
            </div>
          </div>
        </div>

        <div className="marquee-container" id="marquee-3">
          <div className="marquee">
            <div className="marquee-img-item">
              <SpotlightImage number={9} />
            </div>
            <div className="marquee-img-item marquee-text-item">
              <h1>Shooting</h1>
            </div>
            <div className="marquee-img-item">
              <SpotlightImage number={10} />
            </div>
            <div className="marquee-img-item">
              <SpotlightImage number={11} />
            </div>
            <div className="marquee-img-item">
              <SpotlightImage number={12} />
            </div>
          </div>
        </div>

        <div className="marquee-container" id="marquee-4">
          <div className="marquee">
            <div className="marquee-img-item">
              <SpotlightImage number={13} />
            </div>
            <div className="marquee-img-item">
              <SpotlightImage number={14} />
            </div>
            <div className="marquee-img-item">
              <SpotlightImage number={15} />
            </div>
            <div className="marquee-img-item marquee-text-item">
              <h1>Editing</h1>
            </div>
            <div className="marquee-img-item">
              <SpotlightImage number={16} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Spotlight;
