import { BrandButton } from "./BrandButton";

type FaqCtaButtonTone = "filled" | "outline";

type FaqCtaButtonProps = {
  children: React.ReactNode;
  href: string;
  tone: FaqCtaButtonTone;
};

export function FaqCtaButton({ children, href, tone }: FaqCtaButtonProps) {
  return (
    <BrandButton asChild className={`faq-cta-card__button faq-cta-card__button--${tone}`}>
      <a href={href}>{children}</a>
    </BrandButton>
  );
}
