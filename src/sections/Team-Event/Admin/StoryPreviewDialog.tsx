"use client";
import { useRef, useState } from "react";
import { toPng } from "html-to-image";
import { toast } from "sonner";
import { Download, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { TeamEventSeries } from "@/types/Team-Event/TeamEvent";
import { MatchStoryCard } from "./MatchStoryCard";

interface StoryPreviewDialogProps {
  series: TeamEventSeries | null;
  onClose: () => void;
}

export function StoryPreviewDialog({
  series,
  onClose,
}: StoryPreviewDialogProps) {
  const storyRef = useRef<HTMLDivElement>(null);
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    if (!storyRef.current || !series) return;
    setIsExporting(true);
    try {
      const dataUrl = await toPng(storyRef.current, {
        width: 1080,
        height: 1920,
        pixelRatio: 1,
        cacheBust: true,
        fetchRequestInit: { mode: "cors" },
      });
      const homeName = series.homeTeam?.name ?? "Local";
      const awayName = series.awayTeam?.name ?? "Visitante";
      const link = document.createElement("a");
      link.download = `story-${homeName}-vs-${awayName}.png`;
      link.href = dataUrl;
      link.click();
    } catch {
      toast.error("Error al exportar la imagen");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <Dialog open={!!series} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Vista previa — Instagram Story</DialogTitle>
        </DialogHeader>

        {series && (
          <>
            {/* Scaled preview container */}
            <div
              style={{
                width: "100%",
                height: 672,
                overflow: "hidden",
                borderRadius: 8,
                position: "relative",
              }}
            >
              <div
                style={{
                  transform: "scale(0.35)",
                  transformOrigin: "top center",
                  position: "absolute",
                  left: "50%",
                  marginLeft: -540,
                }}
              >
                <MatchStoryCard ref={storyRef} series={series} />
              </div>
            </div>

            <Button
              className="w-full"
              onClick={handleExport}
              disabled={isExporting}
            >
              {isExporting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Exportando...
                </>
              ) : (
                <>
                  <Download className="h-4 w-4 mr-2" />
                  Descargar PNG
                </>
              )}
            </Button>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
