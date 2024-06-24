import React from "react";
import { Card, CardContent } from "@/components/ui/card";
function PlayOffCards() {
  return (
    <section className="w-full py-12 md:py-16 lg:py-20">
      <div className="grid gap-8">
        <div className="text-center">
          <h1 className="text-2xl text-center font-medium">Eliminatorias</h1>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardContent className="grid gap-4 mt-4">
              <div className="flex items-center justify-between">
                <div className="font-semibold">Cuartos de Final</div>
                <div className="text-sm text-muted-foreground">
                  13 de Julio, 2024
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div>CF1</div>
                  <div>-</div>
                  <div>Abel Ianni</div>
                  <div className="text-muted-foreground">vs.</div>
                  <div>3° A</div>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div>CF2</div>
                  <div>-</div>
                  <div>1° A</div>
                  <div className="text-muted-foreground">vs.</div>
                  <div>2° B</div>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div>CF2</div>
                  <div>-</div>
                  <div>1° B</div>
                  <div className="text-muted-foreground">vs.</div>
                  <div>2° A</div>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div>CF4</div>
                  <div>-</div>
                  <div>Nicolas DAngelo</div>
                  <div className="text-muted-foreground">vs.</div>
                  <div>3° B</div>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="grid gap-4 mt-4">
              <div className="flex items-center justify-between">
                <div className="font-semibold">Semifinal</div>
                <div className="text-sm text-muted-foreground">
                  20 de Julio, 2024
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div>SF1</div>
                  <div>-</div>
                  <div>Ganador CF1</div>
                  <div className="text-muted-foreground">vs.</div>
                  <div>Ganador CF2</div>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div>SF2</div>
                  <div>-</div>
                  <div>Ganador CF3</div>
                  <div className="text-muted-foreground">vs.</div>
                  <div>Ganador CF4</div>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="grid gap-4 mt-4">
              <div className="flex items-center justify-between">
                <div className="font-semibold">Final</div>
                <div className="text-sm text-muted-foreground">
                  27 de Julio, 2024
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div>Ganador SF1</div>
                  <div className="text-muted-foreground">vs.</div>
                  <div>Ganador SF2</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}

export default PlayOffCards;
