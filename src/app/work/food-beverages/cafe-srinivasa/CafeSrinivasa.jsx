"use client";
import "@/components/ProjectPage/ProjectPage.css";
import "@/components/CaseStudy/CaseStudy.css";
import "./cafe-srinivasa.css";
import { useCallback, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import Footer from "@/components/Footer/Footer";
import Copy from "@/components/Copy/Copy";
import Button from "@/components/Button/Button";
import ContentsIndex from "@/components/CaseStudy/ContentsIndex";
import SeriesSection from "@/components/CaseStudy/SeriesSection";
import Lightbox from "@/components/CaseStudy/Lightbox";
import { pad } from "@/components/CaseStudy/media";
import CsShowreel from "./CsShowreel";

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
// project's Drive. Each entry renders its own chapter: the title and copy
// first, then the media underneath. `media` takes stills and reels alike —
// anything ending .mp4 renders as a muted autoplaying video with its own
// controls. A series with no media yet is listed in the contents card but
// has no chapter, so filling one in later is a one-line change here.
const SERIES = [
  {
    name: "Classics",
    // The dishes the cafe is known for — stills and reels on a strip.
    marquee: true,
    copy: `The dishes people come back for ${EM} bisi bele bath, benne dosa, idli, dal vada and the full thali, each shot at the moment it leaves the kitchen.`,
    media: [
      "https://res.cloudinary.com/vaxfpcja/image/upload/v1788374078/1_1.png",
      "https://res.cloudinary.com/vaxfpcja/image/upload/v1788374078/2_1.png",
      "https://res.cloudinary.com/vaxfpcja/video/upload/v1788378603/6._Cult_Favourite.mp4",
      "https://res.cloudinary.com/vaxfpcja/video/upload/v1788378600/7._Idli_Making.mp4",
      "https://res.cloudinary.com/vaxfpcja/video/upload/v1788378596/2._Dal_Vada.mp4",
      "https://res.cloudinary.com/vaxfpcja/video/upload/v1788378572/10._Thali.mp4",
      "https://res.cloudinary.com/vaxfpcja/video/upload/v1788378571/8._Benne_Dosa.mp4",
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
    name: "You & Me",
    // All four on one line.
    columns: 4,
    copy: `Food as an occasion rather than a product ${EM} two orders, one table, shot the way the cafe is actually used.`,
    media: [
      "https://res.cloudinary.com/vaxfpcja/image/upload/v1788376789/123wef.png",
      "https://res.cloudinary.com/vaxfpcja/image/upload/v1788376790/ererter.png",
      "https://res.cloudinary.com/vaxfpcja/image/upload/v1788376790/r3e.png",
      "https://res.cloudinary.com/vaxfpcja/image/upload/v1788376790/ftgr.png",
    ],
  },
];

// Every frame in the case study, in series order — what the showreel cycles.
const ALL_MEDIA = SERIES.flatMap((item) => item.media);

const OUTCOMES = [
  { title: "Deliverables", value: "Content Strategy, Reels & Carousels" },
  { title: "Community", value: "Highly Engaged & Loyal" },
  { title: "Brand Impact", value: "Stronger Recognition & Recall" },
];

const CafeSrinivasa = ({ name, next }) => {
  const pageRef = useRef(null);
  const [viewer, setViewer] = useState({ open: false, section: 0, index: 0 });

  const series = SERIES.filter((item) => item.media.length > 0);

  const openViewer = (section, index) =>
    setViewer({ open: true, section, index });

  const stepViewer = useCallback(
    (direction) => {
      setViewer((current) => {
        const items = series[current.section]?.media ?? [];
        if (!items.length) return current;
        return {
          ...current,
          index: (current.index + direction + items.length) % items.length,
        };
      });
    },
    [series]
  );

  const closeViewer = useCallback(
    () => setViewer((current) => ({ ...current, open: false })),
    []
  );

  // Frames in a grid chapter rise as they cross the fold. A marquee is
  // already moving, so it is left alone — animating a tile inside an
  // animating track only fights it.
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
    { scope: pageRef, dependencies: [series.length] }
  );

  return (
    <div className="sample-project-page case-study cs-case" ref={pageRef}>
      {/* Kept exactly as the shared template renders it. */}
      <section className="project-header">
        <Copy delay={0.75}>
          <p className="lg">Featured Case Study</p>
          <h1>{name}</h1>
        </Copy>
      </section>

      {/* The homepage Showreel frame — same pin, scale and radius — running
          this project's own stills and reels instead of the /showreel
          sequence. */}
      <CsShowreel media={ALL_MEDIA} label={name} />

      {/* --------------------------------------------------------- brief */}
      <section className="cs-brief">
        <div className="container cs-brief-inner">
          <div className="cs-brief-lead">
            <Copy animateOnScroll={true}>
              <p className="sm cs-index">The Brief</p>
            </Copy>

            <Copy animateOnScroll={true}>
              <h2 className="cs-display cs-brief-title">
                {"A kitchen worth "}
                <span className="cs-accent">looking at</span>
              </h2>
            </Copy>

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

          {/* The same contents card Cafe Toh carries: every series, numbered,
              frame-counted and linked to its chapter. */}
          <ContentsIndex items={SERIES} unit="Series" />
        </div>
      </section>

      {/* ------------------------------------------------------ chapters */}
      <div className="cs-chapters">
        {series.map((item, i) => (
          <SeriesSection
            key={item.name}
            item={item}
            index={i}
            dark={i % 2 === 1}
            label="Series"
            onOpen={(index) => openViewer(i, index)}
          />
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

      <Lightbox
        open={viewer.open}
        items={series[viewer.section]?.media ?? []}
        index={viewer.index}
        name={series[viewer.section]?.name ?? name}
        onClose={closeViewer}
        onStep={stepViewer}
      />
    </div>
  );
};

export default CafeSrinivasa;
