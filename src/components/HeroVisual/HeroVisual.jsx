"use client";
import "./HeroVisual.css";
import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import CustomEase from "gsap/CustomEase";
import { useGSAP } from "@gsap/react";
import { isInitialLoad } from "@/components/Preloader/Preloader";
import { optimizeImageUrl, optimizeVideoUrl } from "@/lib/media-delivery";

gsap.registerPlugin(useGSAP, CustomEase);
CustomEase.create("hop", "0.9, 0, 0.1, 1");
CustomEase.create("heroFlow", "0.76, 0, 0.24, 1");

const HERO_SEQUENCES = [
  [
    "/loader/loader-2.jpg",
    "https://res.cloudinary.com/vaxfpcja/video/upload/v1788378603/6._Cult_Favourite.mp4",
    "/loader/loader-14.jpg",
    "https://res.cloudinary.com/vaxfpcja/video/upload/v1788413984/eyi.mp4",
    "/loader/loader-26.jpg",
    "https://res.cloudinary.com/vaxfpcja/video/upload/v1789114078/1._Hamper.mp4",
  ],
  [
    "/loader/loader-1.jpg",
    "https://res.cloudinary.com/vaxfpcja/video/upload/v1789021541/1._Conners_of_hive.mp4",
    "/loader/loader-13.jpg",
    "https://res.cloudinary.com/vaxfpcja/video/upload/v1788365967/1._Monsoon_Vibe.mp4",
    "/loader/loader-25.jpg",
    "https://res.cloudinary.com/vaxfpcja/video/upload/v1788378571/8._Benne_Dosa.mp4",
  ],
  [
    "/loader/loader-8.jpg",
    "https://res.cloudinary.com/vaxfpcja/video/upload/v1788413980/eiruo.mp4",
    "/loader/loader-20.jpg",
    "https://res.cloudinary.com/vaxfpcja/video/upload/v1789021540/2._Serving_Now.mov",
    "/loader/loader-32.jpg",
    "https://res.cloudinary.com/vaxfpcja/video/upload/v1789114071/1._DIY.mp4",
  ],
];

const FRAME_COUNT = HERO_SEQUENCES[0].length;
const FRAME_DURATION = 4800;
const isVideo = (src) => /\.(mp4|mov|webm)(?:$|\?)/i.test(src);

const frameDistance = (a, b) => {
  const forward = (a - b + FRAME_COUNT) % FRAME_COUNT;
  const backward = (b - a + FRAME_COUNT) % FRAME_COUNT;
  return Math.min(forward, backward);
};

export default function HeroVisual() {
  const containerRef = useRef(null);
  const videoRefs = useRef(new Map());
  const hasAnimatedFrame = useRef(false);
  const firstCycle = useRef(true);
  const [activeFrame, setActiveFrame] = useState(0);
  const [inView, setInView] = useState(true);
  const previousFrame = (activeFrame - 1 + FRAME_COUNT) % FRAME_COUNT;

  useEffect(() => {
    const container = containerRef.current;
    if (!container || typeof IntersectionObserver === "undefined") return;

    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold: 0.15 }
    );

    observer.observe(container);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!inView) return;

    const delay = firstCycle.current && isInitialLoad ? 7000 : FRAME_DURATION;
    const id = setTimeout(() => {
      firstCycle.current = false;
      setActiveFrame((frame) => (frame + 1) % FRAME_COUNT);
    }, delay);

    return () => clearTimeout(id);
  }, [activeFrame, inView]);

  useGSAP(
    () => {
      const center = containerRef.current?.querySelector(".hero-visual-center");
      const banners = gsap.utils.toArray(".hero-visual-banner");
      const delay = isInitialLoad ? 5.5 : 0.5;

      if (center) {
        gsap.set(center, { scale: 1.1, opacity: 0 });
        gsap.to(center, {
          scale: 1,
          opacity: 1,
          duration: 0.7,
          ease: "power3.out",
          delay,
        });
      }

      if (banners.length) {
        gsap.set(banners, { scale: 0 });
        gsap.to(banners, {
          scale: 1,
          duration: 0.75,
          stagger: 0.08,
          ease: "back.out(1.45)",
          delay: delay + 0.12,
        });
      }
    },
    { scope: containerRef }
  );

  useGSAP(
    () => {
      if (!hasAnimatedFrame.current) {
        hasAnimatedFrame.current = true;
        return;
      }

      const panels = gsap.utils.toArray(".hero-visual-panel");
      const timeline = gsap.timeline();

      panels.forEach((panel, staggerIndex) => {
        const panelIndex = Number(panel.dataset.panel);
        const incoming = panel.querySelector(`[data-frame="${activeFrame}"]`);
        const outgoing = panel.querySelector(`[data-frame="${previousFrame}"]`);
        if (!incoming || !outgoing) return;

        const direction = panelIndex === 0 ? -1 : panelIndex === 2 ? 1 : 0;
        const start = staggerIndex * 0.09;
        const incomingMedia = incoming.querySelector("img, video");
        const outgoingMedia = outgoing.querySelector("img, video");
        const activeVideo = videoRefs.current.get(`${panelIndex}-${activeFrame}`);

        if (activeVideo) {
          activeVideo.currentTime = 0;
          activeVideo.play().catch(() => {});
        }

        timeline
          .set(
            outgoing,
            { autoAlpha: 1, zIndex: 1, clipPath: "inset(0% round 0.75rem)" },
            start
          )
          .set(
            incoming,
            {
              autoAlpha: 1,
              zIndex: 2,
              clipPath: "inset(100% 0% 0% 0% round 0.75rem)",
            },
            start
          )
          .fromTo(
            incoming,
            { xPercent: direction * 7, scale: 1.08, filter: "blur(8px)" },
            {
              xPercent: 0,
              scale: 1,
              filter: "blur(0px)",
              clipPath: "inset(0% 0% 0% 0% round 0.75rem)",
              duration: 1.35,
              ease: "heroFlow",
            },
            start
          )
          .fromTo(
            incomingMedia,
            { scale: 1.16, yPercent: 5 },
            { scale: 1, yPercent: 0, duration: 1.55, ease: "heroFlow" },
            start
          )
          .to(
            outgoing,
            {
              autoAlpha: 0,
              scale: 0.95,
              xPercent: direction * -5,
              filter: "blur(6px)",
              duration: 1.05,
              ease: "power3.inOut",
            },
            start
          )
          .to(
            outgoingMedia,
            { scale: 1.08, duration: 1.05, ease: "power3.inOut" },
            start
          )
          .set(outgoing, {
            zIndex: 0,
            xPercent: 0,
            scale: 1,
            filter: "none",
          });
      });

      return () => timeline.kill();
    },
    { scope: containerRef, dependencies: [activeFrame, previousFrame] }
  );

  useEffect(() => {
    videoRefs.current.forEach((video, key) => {
      const frame = Number(key.split("-").at(-1));
      if (inView && frame === activeFrame) video.play().catch(() => {});
      else video.pause();
    });
  }, [activeFrame, inView]);

  const renderPanel = (sequence, panelIndex, className) => (
    <div className={`${className} hero-visual-panel`} data-panel={panelIndex}>
      {sequence.map((src, frame) => {
        const isActive = frame === activeFrame;
        const shouldPrime = frameDistance(frame, activeFrame) <= 1;
        const mediaWidth = panelIndex === 1 ? 960 : 720;

        return (
          <div
            className={`hero-media-layer${isActive ? " is-active" : ""}`}
            data-frame={frame}
            key={src}
          >
            {isVideo(src) ? (
              <video
                ref={(node) => {
                  const key = `${panelIndex}-${frame}`;
                  if (node) videoRefs.current.set(key, node);
                  else videoRefs.current.delete(key);
                }}
                src={shouldPrime ? optimizeVideoUrl(src, mediaWidth) : undefined}
                muted
                loop
                playsInline
                preload={shouldPrime ? "metadata" : "none"}
              />
            ) : (
              <img
                src={shouldPrime ? optimizeImageUrl(src, mediaWidth) : undefined}
                alt=""
                decoding="async"
              />
            )}
          </div>
        );
      })}
    </div>
  );

  return (
    <div className="hero-visual" ref={containerRef} aria-hidden="true">
      {renderPanel(
        HERO_SEQUENCES[0],
        0,
        "hero-visual-banner hero-visual-banner-1"
      )}
      {renderPanel(
        HERO_SEQUENCES[2],
        2,
        "hero-visual-banner hero-visual-banner-2"
      )}
      {renderPanel(HERO_SEQUENCES[1], 1, "hero-visual-center")}
    </div>
  );
}
