"use client";
import "@/components/ProjectPage/ProjectPage.css";
import "./cafe-srinivasa.css";
import { useRef } from "react";
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
// first, then the gallery underneath at reading width;
// a series with no `images` yet is skipped entirely, so filling one in later
// is a one-line change here and nothing else.
const SERIES = [
  {
    name: "Bissi Belle Bath",
    copy: `The house classic, shot at the moment it leaves the kitchen ${EM} steam, ghee and the deep spice colour that makes the dish read instantly on a feed.`,
    images: [
      "https://res.cloudinary.com/vaxfpcja/image/upload/v1788374078/1_1.png",
      "https://res.cloudinary.com/vaxfpcja/image/upload/v1788374078/2_1.png",
    ],
  },
  {
    name: "Icecreams",
    copy: `A cold counterpoint to the kitchen${RSQUO}s heat. Scoops, melt and colour blocking, built as a set that holds together across a grid rather than as five single posts.`,
    images: [
      "https://res.cloudinary.com/vaxfpcja/image/upload/v1788374646/3.png",
      "https://res.cloudinary.com/vaxfpcja/image/upload/v1788374646/4.png",
      "https://res.cloudinary.com/vaxfpcja/image/upload/v1788374646/2.png",
      "https://res.cloudinary.com/vaxfpcja/image/upload/v1788374646/5.png",
      "https://res.cloudinary.com/vaxfpcja/image/upload/v1788374646/1_2.png",
    ],
  },
  {
    name: "Mulbagal",
    copy: `The dosa the town gave its name to, treated as the hero it is ${EM} crisp edge, soft centre and the chutney set staged the way it actually arrives at the table.`,
    images: [
      "https://res.cloudinary.com/vaxfpcja/image/upload/v1788375825/as.png",
      "https://res.cloudinary.com/vaxfpcja/image/upload/v1788375825/er.png",
      "https://res.cloudinary.com/vaxfpcja/image/upload/v1788375825/2d.png",
      "https://res.cloudinary.com/vaxfpcja/image/upload/v1788375825/ws.png",
      "https://res.cloudinary.com/vaxfpcja/image/upload/v1788375826/we.png",
    ],
  },
  {
    name: "Pairings",
    copy: `What goes with what ${EM} plate and cup framed together so the menu sells the combination, not just the dish.`,
    images: [
      "https://res.cloudinary.com/vaxfpcja/image/upload/v1788376299/gfhgjk.png",
      "https://res.cloudinary.com/vaxfpcja/image/upload/v1788376298/rsedfh.png",
      "https://res.cloudinary.com/vaxfpcja/image/upload/v1788376298/yugy.png",
      "https://res.cloudinary.com/vaxfpcja/image/upload/v1788376298/ghjk.png",
      "https://res.cloudinary.com/vaxfpcja/image/upload/v1788376298/gfcvhjbk.png",
    ],
  },
  // Awaiting media — each section appears the moment its links land.
  { name: "Tadgola", copy: "", images: [] },
  { name: "Texture", copy: "", images: [] },
  {
    name: "You & Me",
    copy: `Food as an occasion rather than a product ${EM} two orders, one table, shot the way the cafe is actually used.`,
    images: [
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

const CafeSrinivasa = ({ name, images = [], next }) => {
  const galleryScope = useRef(null);

  const series = SERIES.filter((item) => item.images.length > 0);

  // Stagger each gallery frame in as it crosses the fold.
  useGSAP(
    () => {
      gsap.utils.toArray(".cs-frame").forEach((frame) => {
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

              <div className="cs-gallery">
                {item.images.map((src, j) => (
                  <div className="cs-frame" key={src}>
                    <img
                      src={src}
                      alt={`${item.name} ${j + 1}`}
                      loading="lazy"
                    />
                  </div>
                ))}
              </div>
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
