import { Badge } from "@/components/ui/badge";

export function BadgeLost({ text }: { text: string }) {
  return <Badge variant="destructive">{text}</Badge>;
}
