"use client";

import { forwardRef, useEffect, useRef, useState } from "react";
import { optimizeVideoUrl } from "@/lib/media-delivery";

const setForwardedRef = (ref, value) => {
  if (typeof ref === "function") ref(value);
  else if (ref) ref.current = value;
};

const OptimizedVideo = forwardRef(function OptimizedVideo(
  {
    src,
    width = 1280,
    eager = false,
    loadDelay = 0,
    rootMargin = "500px 0px",
    autoPlay = false,
    preload = "metadata",
    ...props
  },
  forwardedRef
) {
  const localRef = useRef(null);
  const [shouldLoad, setShouldLoad] = useState(eager);

  useEffect(() => {
    const video = localRef.current;
    let delayId;
    if (!video || eager || typeof IntersectionObserver === "undefined") {
      setShouldLoad(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          if (loadDelay > 0) delayId = setTimeout(() => setShouldLoad(true), loadDelay);
          else setShouldLoad(true);
          observer.disconnect();
        }
      },
      { rootMargin }
    );

    observer.observe(video);
    return () => {
      observer.disconnect();
      clearTimeout(delayId);
    };
  }, [eager, loadDelay, rootMargin]);

  useEffect(() => {
    const video = localRef.current;
    if (!video || !shouldLoad || !autoPlay || typeof IntersectionObserver === "undefined") {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) video.play().catch(() => {});
        else video.pause();
      },
      { threshold: 0.05 }
    );

    observer.observe(video);
    return () => observer.disconnect();
  }, [autoPlay, shouldLoad]);

  return (
    <video
      {...props}
      ref={(node) => {
        localRef.current = node;
        setForwardedRef(forwardedRef, node);
      }}
      src={shouldLoad ? optimizeVideoUrl(src, width) : undefined}
      autoPlay={autoPlay}
      preload={shouldLoad ? preload : "none"}
    />
  );
});

export default OptimizedVideo;
