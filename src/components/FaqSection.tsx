import {
  BookOpen,
  ChevronRight,
  Heart,
  MessageCircle,
  Pipette,
  RotateCcw,
  Ruler,
  Sparkles,
  Star,
  Truck,
  type LucideIcon
} from "lucide-react";
import { useEffect, useState } from "react";
import { BrandButton } from "./BrandButton";
import { FaqCtaButton } from "./FaqCtaButton";
import { MobileCarousel } from "./MobileCarousel";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "./ui/accordion";

type FaqTopic = {
  icon: LucideIcon;
  label: string;
  questions: {
    answer: string;
    question: string;
  }[];
};

const faqTopics: FaqTopic[] = [
  {
    icon: Ruler,
    label: "Sizing",
    questions: [
      {
        question: "How do I measure my nails?",
        answer: "Measure the widest part of each natural nail in millimeters, then match each finger to the closest size."
      },
      {
        question: "What if I’m between sizes?",
        answer: "Choose the slightly larger size so the press-on can be gently filed down for a cleaner fit."
      },
      {
        question: "Do you offer sample sizing kits?",
        answer: "Sizing kits are planned for the prototype, so this will become the safest way to confirm your sizes before ordering."
      },
      {
        question: "How do I choose the right shape?",
        answer: "Start with the length you wear comfortably every day, then choose the shape that best matches your natural nail width."
      },
      {
        question: "Can I resize after I place my order?",
        answer: "Message support as soon as possible after ordering. Changes may depend on whether the set has already been started."
      }
    ]
  },
  {
    icon: Pipette,
    label: "Application",
    questions: [
      {
        question: "How do I apply press-on nails?",
        answer: "Prep, size, add glue or tabs, then press each nail firmly for a short hold so it bonds evenly."
      },
      {
        question: "Should I use glue or adhesive tabs?",
        answer: "Use glue for longer wear and adhesive tabs when you want a shorter, gentler wear option."
      },
      {
        question: "How long does application take?",
        answer: "Most applications take about 10 to 15 minutes once your nails are clean, dry, and matched to size."
      },
      {
        question: "How do I prep my nails first?",
        answer: "Wash and dry your hands, push back cuticles, lightly buff, and wipe away oils before applying."
      }
    ]
  },
  {
    icon: Heart,
    label: "Wear & Care",
    questions: [
      {
        question: "How long do press-ons last?",
        answer: "Wear time depends on prep and adhesive choice. Glue usually lasts longer than tabs."
      },
      {
        question: "Can I shower with press-ons?",
        answer: "Yes, but avoid soaking them right after application and keep heavy water exposure limited when possible."
      },
      {
        question: "How do I make them last longer?",
        answer: "Prep carefully, avoid using nails as tools, and wear gloves for cleaning or long water exposure."
      },
      {
        question: "Can I reuse my press-ons?",
        answer: "Many sets can be reused if removed gently and stored cleanly between wears."
      }
    ]
  },
  {
    icon: Truck,
    label: "Shipping",
    questions: [
      {
        question: "When will my order ship?",
        answer: "Shipping timing is still placeholder for this prototype, but order status should be shared after processing."
      },
      {
        question: "How long does processing take?",
        answer: "Current placeholder processing is 3 to 7 business days before the package ships."
      },
      {
        question: "Do you offer tracking?",
        answer: "Tracking is expected once an order ships, but final fulfillment details are not locked yet."
      },
      {
        question: "Do you ship internationally?",
        answer: "International shipping is not finalized in the prototype and should be confirmed before launch."
      }
    ]
  },
  {
    icon: RotateCcw,
    label: "Returns",
    questions: [
      {
        question: "Do you accept returns?",
        answer: "Return policy wording is still being finalized, especially because press-ons are a hygiene-sensitive product."
      },
      {
        question: "Can I cancel my order?",
        answer: "Cancellation rules are not final yet. For now, contact support quickly if something needs to change."
      },
      {
        question: "What if my order arrives damaged?",
        answer: "Contact support with your order details and photos so the issue can be reviewed."
      },
      {
        question: "Can I exchange a sizing kit?",
        answer: "Sizing-kit exchange rules are not final in this prototype and should be confirmed before launch."
      }
    ]
  },
  {
    icon: Sparkles,
    label: "Removal",
    questions: [
      {
        question: "How do I remove press-ons safely?",
        answer: "Soak and loosen them gently instead of forcing them off. Removal should feel slow and careful."
      },
      {
        question: "Will removal damage my nails?",
        answer: "Gentle removal helps protect your natural nails. Avoid pulling or prying."
      },
      {
        question: "Can I reuse nails after removal?",
        answer: "If the nails come off cleanly and keep their shape, store them for another wear."
      },
      {
        question: "What should I avoid during removal?",
        answer: "Avoid ripping, bending, or using harsh tools against the natural nail."
      }
    ]
  },
  {
    icon: Star,
    label: "Custom Orders",
    questions: [
      {
        question: "How do custom sets work?",
        answer: "Custom orders are a future direction, so the exact request flow is still being shaped."
      },
      {
        question: "Can I send inspiration photos?",
        answer: "The planned flow can support inspiration photos, but final custom-order rules are not locked yet."
      },
      {
        question: "How long do custom orders take?",
        answer: "Custom timing will depend on the design, materials, and order queue once that service is active."
      },
      {
        question: "Can I request specific colors or charms?",
        answer: "That is the goal for custom sets, with final options depending on available materials."
      }
    ]
  }
];

function topicSlug(label: string) {
  return label.toLowerCase().replace("&", "and").replace(/\s+/g, "-");
}

export function FaqSection() {
  const [activeTopicIndex, setActiveTopicIndex] = useState(0);
  const [openQuestionValue, setOpenQuestionValue] = useState<string | undefined>(undefined);
  const activeTopic = faqTopics[activeTopicIndex];
  const activeTopicSlug = topicSlug(activeTopic.label);

  useEffect(() => {
    setOpenQuestionValue(undefined);
  }, [activeTopicIndex]);

  return (
    <section className="section-block faq-help-section" id="faq" aria-labelledby="faq-heading">
      <div className="faq-help">
        <div className="faq-help__intro">
          <h2 className="faq-help__heading" id="faq-heading">
            How Can We Help?
          </h2>
        </div>

        <MobileCarousel
          ariaLabel="Choose a help topic"
          className="faq-topic-carousel"
          containerClassName="faq-topic-grid"
          onSelectedIndexChange={setActiveTopicIndex}
          options={{ align: "start", containScroll: "trimSnaps" }}
          showArrows={false}
          slideClassName="faq-topic-slide"
          viewportClassName="faq-topic-carousel__viewport"
          slides={faqTopics.map((topic, index) => {
            const Icon = topic.icon;
            const isActive = index === activeTopicIndex;

            return (
              <button
                aria-pressed={isActive}
                className={`faq-topic-card${isActive ? " faq-topic-card--active" : ""}`}
                key={topic.label}
                onClick={() => setActiveTopicIndex(index)}
                type="button"
              >
                <Icon aria-hidden size={30} strokeWidth={1.8} />
                <span>{topic.label}</span>
              </button>
            );
          })}
        />

        <div className="faq-question-card">
          <div className="faq-question-card__header">
            <h3>Top questions in {activeTopic.label}</h3>
          </div>
          <Accordion
            className="faq-question-list"
            collapsible
            onValueChange={setOpenQuestionValue}
            type="single"
            value={openQuestionValue}
          >
            {activeTopic.questions.map((item, index) => {
              const questionValue = `${activeTopicSlug}-${index}`;

              return (
                <AccordionItem className="faq-question-item" key={item.question} value={questionValue}>
                  <AccordionTrigger className="faq-question-row [&>svg]:hidden">
                    <span>{item.question}</span>
                    <ChevronRight aria-hidden className="faq-question-row__icon" size={20} strokeWidth={1.8} />
                  </AccordionTrigger>
                  <AccordionContent className="faq-question-answer">
                    <p>{item.answer}</p>
                  </AccordionContent>
                </AccordionItem>
              );
            })}
          </Accordion>
          <BrandButton asChild className="faq-question-card__link">
            <a href="#help-center">
              View all {activeTopicSlug} questions <ChevronRight aria-hidden size={16} strokeWidth={2} />
            </a>
          </BrandButton>
        </div>

        <aside className="faq-cta-card faq-cta-card--help" id="help-center" aria-label="Help Center" role="region">
          <span className="faq-cta-card__icon" aria-hidden="true">
            <BookOpen size={28} strokeWidth={1.8} />
          </span>
          <div className="faq-cta-card__copy">
            <h3>Need more detail?</h3>
            <p>Browse our Help Center for full guides and tips.</p>
          </div>
          <FaqCtaButton href="#help-center" tone="outline">
            Visit Help Center
          </FaqCtaButton>
        </aside>

        <aside className="faq-cta-card faq-cta-card--support" aria-label="Contact Support" role="region">
          <span className="faq-cta-card__icon" aria-hidden="true">
            <MessageCircle size={28} strokeWidth={1.8} />
          </span>
          <div className="faq-cta-card__copy">
            <h3>Still need help?</h3>
            <p>Contact our team — we’re here for you!</p>
          </div>
          <FaqCtaButton href="#contact" tone="filled">
            Contact Support
          </FaqCtaButton>
        </aside>
      </div>
    </section>
  );
}
