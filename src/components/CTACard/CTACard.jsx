"use client";
import "./CTACard.css";
import Button from "../Button/Button";
import { MdArticle } from "react-icons/md";
import Copy from "../Copy/Copy";

const CTACard = () => {
  return (
    <section className="cta">
      <div className="container">
        <div className="cta-copy">
          <div className="cta-col">
            <Copy animateOnScroll={true}>
              <p className="sm">What we do</p>
            </Copy>
          </div>

          <div className="cta-col">
            <Copy animateOnScroll={true}>
              <p className="lg">
                Monthly &amp; project-based content curation, creative direction,
                shooting and editing for F&amp;B and lifestyle brands that want
                their content to feel as considered as their craft.
              </p>
            </Copy>

            <Button
              animateOnScroll={true}
              delay={0.25}
              variant="dark"
              href="/contact"
            >
              Start your story
            </Button>
          </div>
        </div>

        <div className="cta-card">
          <div className="cta-card-copy">
            <div className="cta-card-col">
              <Copy animateOnScroll={true}>
                <h3>Why Plated Stories</h3>
              </Copy>
            </div>

            <div className="cta-card-col">
              <Copy animateOnScroll={true}>
                <p>
                  In a world overflowing with content, numbers alone aren&rsquo;t
                  enough. We combine premium production with strategic
                  storytelling to create content that resonates with audiences
                  and aligns with business goals.
                </p>

                <p>
                  We don&rsquo;t create content for the sake of posting. We focus
                  on crafting stories that build communities, strengthen brand
                  identity and drive meaningful engagement.
                </p>
              </Copy>

              <Button
                animateOnScroll={true}
                delay={0.25}
                variant="light"
                icon={MdArticle}
                href="/about"
              >
                About the studio
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTACard;
