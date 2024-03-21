import { Badge } from "@/components/ui/badge";

export function BadgePending({ text }: { text: string }) {
  return <Badge variant="pending">{text}</Badge>;
}
