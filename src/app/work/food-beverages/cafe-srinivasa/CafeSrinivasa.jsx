"use client";
import "@/components/ProjectPage/ProjectPage.css";
import "./cafe-srinivasa.css";
import { useRef, useState } from "react";
import { LuVolumeX, LuVolume, LuPlay, LuPause } from "react-icons/lu";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import Footer from "@/components/Footer/Footer";
import Copy from "@/components/Copy/Copy";
import Button from "@/components/Button/Button";

gsap.registerPlugin(ScrollTrigger, useGSAP);

// Body copy lives in plain string constants rather than inline JSX text:
// GSAP's SplitText rebuilds the text nodes it splits and trims each one's
// leading whitespace, so a sentence broken across `{expr}` boundaries loses
// the spaces around them. One text node, one string.
const EM = "—";
const RSQUO = "’";

const META = [
  { label: "Client", value: "Cafe Srinivasa" },
  { label: "Category", value: "Food & Beverages" },
  { label: "Services", value: "Strategy, Production, Editing" },
];

// The shoot is organised as named series, mirroring the folders in the
// project's Drive. Each entry renders its own section: the title and copy
// first, then the gallery underneath at reading width. `media` takes stills
// and reels alike — anything ending .mp4 renders as a muted autoplaying
// video with its own controls. A series with no media yet is skipped
// entirely, so filling one in later is a one-line change here.
const SERIES = [
  {
    name: "Bissi Belle Bath",
    copy: `The house classic, shot at the moment it leaves the kitchen ${EM} steam, ghee and the deep spice colour that makes the dish read instantly on a feed.`,
    media: [
      "https://res.cloudinary.com/vaxfpcja/image/upload/v1788374078/1_1.png",
      "https://res.cloudinary.com/vaxfpcja/image/upload/v1788374078/2_1.png",
    ],
  },
  {
    name: "Icecreams",
    // All five in a single line rather than wrapping across three columns.
    columns: 5,
    copy: `A cold counterpoint to the kitchen${RSQUO}s heat. Scoops, melt and colour blocking, built as a set that holds together across a grid rather than as five single posts.`,
    media: [
      "https://res.cloudinary.com/vaxfpcja/image/upload/v1788374646/3.png",
      "https://res.cloudinary.com/vaxfpcja/image/upload/v1788374646/4.png",
      "https://res.cloudinary.com/vaxfpcja/image/upload/v1788374646/2.png",
      "https://res.cloudinary.com/vaxfpcja/image/upload/v1788374646/5.png",
      "https://res.cloudinary.com/vaxfpcja/image/upload/v1788374646/1_2.png",
    ],
  },
  {
    name: "Mulbagal",
    // Runs as an auto-scrolling strip instead of a static grid.
    marquee: true,
    copy: `The dosa the town gave its name to, treated as the hero it is ${EM} crisp edge, soft centre and the chutney set staged the way it actually arrives at the table.`,
    media: [
      "https://res.cloudinary.com/vaxfpcja/image/upload/v1788375825/as.png",
      "https://res.cloudinary.com/vaxfpcja/image/upload/v1788375825/er.png",
      "https://res.cloudinary.com/vaxfpcja/image/upload/v1788375825/2d.png",
      "https://res.cloudinary.com/vaxfpcja/image/upload/v1788375825/ws.png",
      "https://res.cloudinary.com/vaxfpcja/image/upload/v1788375826/we.png",
      "https://res.cloudinary.com/vaxfpcja/video/upload/v1788377446/1._Mulbagal_Dosa.mp4",
    ],
  },
  {
    name: "Pairings",
    // Five stills and two reels, running as a strip like Mulbagal.
    marquee: true,
    copy: `What goes with what ${EM} plate and cup framed together so the menu sells the combination, not just the dish.`,
    media: [
      "https://res.cloudinary.com/vaxfpcja/image/upload/v1788376299/gfhgjk.png",
      "https://res.cloudinary.com/vaxfpcja/image/upload/v1788376298/rsedfh.png",
      "https://res.cloudinary.com/vaxfpcja/image/upload/v1788376298/yugy.png",
      "https://res.cloudinary.com/vaxfpcja/image/upload/v1788376298/ghjk.png",
      "https://res.cloudinary.com/vaxfpcja/image/upload/v1788376298/gfcvhjbk.png",
      "https://res.cloudinary.com/vaxfpcja/video/upload/v1788378083/4._Breakfast.mp4",
      "https://res.cloudinary.com/vaxfpcja/video/upload/v1788378092/5._ASMR.mp4",
    ],
  },
  {
    name: "Tadgola",
    // Three stills and the reel, all four on one line.
    columns: 4,
    copy: `The season${RSQUO}s ice apple, shot cold and close ${EM} translucence, water and the short window the fruit is actually on the menu.`,
    media: [
      "https://res.cloudinary.com/vaxfpcja/image/upload/v1788377181/rtey.png",
      "https://res.cloudinary.com/vaxfpcja/image/upload/v1788377184/dfbnlk.png",
      "https://res.cloudinary.com/vaxfpcja/image/upload/v1788377187/dshbk.png",
      "https://res.cloudinary.com/vaxfpcja/video/upload/v1788377897/3._Tadgola_Ice_Cream.mp4",
    ],
  },
  {
    name: "Texture",
    copy: `Detail frames for the grid ${EM} crumb, pour and surface at a distance no diner sees, cut in to break up the wider plate shots.`,
    media: [
      "https://res.cloudinary.com/vaxfpcja/image/upload/v1788377334/cvbnm.png",
      "https://res.cloudinary.com/vaxfpcja/image/upload/v1788377335/dxcfgvhb.png",
    ],
  },
  {
    name: "You & Me",
    copy: `Food as an occasion rather than a product ${EM} two orders, one table, shot the way the cafe is actually used.`,
    media: [
      "https://res.cloudinary.com/vaxfpcja/image/upload/v1788376789/123wef.png",
      "https://res.cloudinary.com/vaxfpcja/image/upload/v1788376790/ererter.png",
      "https://res.cloudinary.com/vaxfpcja/image/upload/v1788376790/r3e.png",
      "https://res.cloudinary.com/vaxfpcja/image/upload/v1788376790/ftgr.png",
    ],
  },
];

const OUTCOMES = [
  { title: "Deliverables", value: "Content Strategy, Reels & Carousels" },
  { title: "Community", value: "Highly Engaged & Loyal" },
  { title: "Brand Impact", value: "Stronger Recognition & Recall" },
];

const slugify = (name) =>
  name
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");

const pad = (n) => String(n).padStart(2, "0");

const isVideo = (src) => /\.(mp4|webm|mov)$/i.test(src);

// A single gallery tile. Stills are plain images; a reel autoplays muted
// (the only way browsers allow it) and carries the same play/mute cluster
// the hero banner uses, revealed on hover or focus.
const Frame = ({ src, label, className = "", hidden = false }) => {
  const videoRef = useRef(null);
  const [isMuted, setIsMuted] = useState(true);
  const [isPlaying, setIsPlaying] = useState(true);

  if (!isVideo(src)) {
    return (
      <div className={`cs-frame ${className}`.trim()} aria-hidden={hidden}>
        <img src={src} alt={hidden ? "" : label} loading="lazy" />
      </div>
    );
  }

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = !video.muted;
    if (!video.muted) video.volume = 1;
  };

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) video.play().catch(() => {});
    else video.pause();
  };

  return (
    <div
      className={`cs-frame cs-frame--video ${className}`.trim()}
      tabIndex={hidden ? -1 : 0}
      aria-hidden={hidden}
    >
      <video
        ref={videoRef}
        src={src}
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        aria-label={label}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onVolumeChange={(e) => setIsMuted(e.currentTarget.muted)}
      />

      <div className="cs-frame-controls">
        <button
          type="button"
          className="cs-frame-btn"
          onClick={togglePlay}
          aria-label={isPlaying ? "Pause video" : "Play video"}
        >
          {isPlaying ? <LuPause size={16} /> : <LuPlay size={16} />}
        </button>
        <button
          type="button"
          className="cs-frame-btn"
          onClick={toggleMute}
          aria-label={isMuted ? "Unmute video" : "Mute video"}
        >
          {isMuted ? <LuVolumeX size={16} /> : <LuVolume size={16} />}
        </button>
      </div>
    </div>
  );
};

const CafeSrinivasa = ({ name, images = [], next }) => {
  const galleryScope = useRef(null);

  const series = SERIES.filter((item) => item.media.length > 0);

  // Stagger each gallery frame in as it crosses the fold.
  useGSAP(
    () => {
      gsap.utils.toArray(".cs-gallery > .cs-frame").forEach((frame) => {
        gsap.fromTo(
          frame,
          { y: 60, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 1.1,
            ease: "power3.out",
            scrollTrigger: { trigger: frame, start: "top 88%", once: true },
          }
        );
      });
    },
    { scope: galleryScope, dependencies: [series.length] }
  );

  return (
    <div className="sample-project-page cs-case">
      {/* Kept exactly as the shared template renders it. */}
      <section className="project-header">
        <Copy delay={0.75}>
          <p className="lg">Featured Case Study</p>
          <h1>{name}</h1>
        </Copy>
      </section>

      <section className="project-banner-img">
        <div className="project-banner-img-wrapper">
          <img src={images[0]} alt={name} />
        </div>
      </section>

      {/* --------------------------------------------------------- brief */}
      <section className="cs-brief">
        <div className="container cs-brief-inner">
          <div className="cs-brief-lead">
            <Copy animateOnScroll={true}>
              <p className="sm cs-index">The Brief</p>
            </Copy>

            <Copy animateOnScroll={true}>
              <h2 className="cs-display cs-brief-title">
                A kitchen worth
                <span className="cs-accent"> looking at</span>
              </h2>
            </Copy>
          </div>

          <div className="cs-brief-body">
            <Copy animateOnScroll={true}>
              <p className="cs-copy">
                {`Cafe Srinivasa had the food and the following, but not the imagery to match ${EM} plates that landed hot on the table and flat on the feed. We rebuilt the visual language series by series, shooting each part of the menu as its own story instead of one catch-all shoot.`}
              </p>
            </Copy>

            <div className="cs-meta">
              {META.map((item) => (
                <div className="cs-meta-item" key={item.label}>
                  <Copy animateOnScroll={true}>
                    <p className="sm cs-index">{item.label}</p>
                  </Copy>
                  <Copy animateOnScroll={true}>
                    <p className="cs-meta-value">{item.value}</p>
                  </Copy>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* -------------------------------------------------- series index */}
      <section className="cs-toc">
        <div className="container">
          <Copy animateOnScroll={true}>
            <p className="sm cs-index">{`The Series / ${pad(series.length)}`}</p>
          </Copy>

          <ul className="cs-toc-list">
            {series.map((item, i) => (
              <li className="cs-toc-item" key={item.name}>
                <a href={`#${slugify(item.name)}`}>
                  <span className="sm cs-index">{pad(i + 1)}</span>
                  <span className="cs-display cs-toc-name">{item.name}</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ----------------------------------------------------- galleries */}
      <div ref={galleryScope}>
        {series.map((item, i) => (
          <section
            className="cs-series"
            id={slugify(item.name)}
            key={item.name}
          >
            <div className="container cs-series-inner">
              <div className="cs-series-head">
                <Copy animateOnScroll={true}>
                  <p className="sm cs-index">{`${pad(i + 1)} / Series`}</p>
                </Copy>

                <Copy animateOnScroll={true}>
                  <h2 className="cs-display cs-series-title">{item.name}</h2>
                </Copy>

                {item.copy ? (
                  <Copy animateOnScroll={true}>
                    <p className="cs-copy">{item.copy}</p>
                  </Copy>
                ) : null}
              </div>

              {item.marquee ? (
                // The track holds the set twice over and slides exactly one
                // set's width before looping, so the seam never shows. CSS
                // owns the motion — see .cs-marquee in the stylesheet — which
                // keeps the pause-on-hover a single declaration rather than a
                // scroll listener.
                <div
                  className="cs-marquee"
                  style={{
                    "--marquee-duration": `${item.media.length * 7}s`,
                  }}
                >
                  <div className="cs-marquee-track">
                    {[...item.media, ...item.media].map((src, j) => (
                      <Frame
                        key={`${src}-${j}`}
                        src={src}
                        label={`${item.name} ${(j % item.media.length) + 1}`}
                        className="cs-marquee-item"
                        hidden={j >= item.media.length}
                      />
                    ))}
                  </div>
                </div>
              ) : (
                <div
                  className="cs-gallery"
                  style={{ "--cols": item.columns ?? 3 }}
                >
                  {item.media.map((src, j) => (
                    <Frame
                      key={src}
                      src={src}
                      label={`${item.name} ${j + 1}`}
                    />
                  ))}
                </div>
              )}
            </div>
          </section>
        ))}
      </div>

      {/* ------------------------------------------------------- outcome */}
      <section className="cs-outcomes">
        <div className="container">
          <Copy animateOnScroll={true}>
            <p className="sm cs-index">The Outcome</p>
          </Copy>

          {OUTCOMES.map((outcome, i) => (
            <div className="cs-outcome" key={outcome.title}>
              <div className="cs-outcome-head">
                <Copy animateOnScroll={true}>
                  <p className="sm cs-index">{pad(i + 1)}</p>
                </Copy>
                <Copy animateOnScroll={true}>
                  <h2 className="cs-display cs-outcome-title">
                    {outcome.title}
                  </h2>
                </Copy>
              </div>

              <div className="cs-outcome-value">
                <Copy animateOnScroll={true}>
                  <p>{outcome.value}</p>
                </Copy>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ------------------------------------------------------- closing */}
      <section className="cs-closing">
        <div className="container cs-closing-inner">
          <Copy animateOnScroll={true}>
            <p className="sm cs-index">Next</p>
          </Copy>

          <Copy animateOnScroll={true}>
            <h2 className="cs-display cs-closing-title">
              {next ? next.name : "Your brand"}
            </h2>
          </Copy>

          <Button
            animateOnScroll={true}
            delay={0.25}
            href={next ? next.href : "/contact"}
          >
            {next ? "View the case study" : "Start your story"}
          </Button>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default CafeSrinivasa;
