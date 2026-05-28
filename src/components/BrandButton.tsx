import { Button } from "@/components/ui/button";

type BrandButtonProps = React.ComponentProps<typeof Button>;

export function BrandButton({ size = "brandSafe", variant = "brandSafe", ...props }: BrandButtonProps) {
  return <Button size={size} variant={variant} {...props} />;
}
