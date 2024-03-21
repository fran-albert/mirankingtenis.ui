import { Badge } from "@/components/ui/badge";

export function BadgeWin({ text }: { text: string }) {
  return <Badge variant="correct">{text}</Badge>;
}
