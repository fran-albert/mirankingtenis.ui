"use client";
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAllTournaments } from "@/hooks/Tournament/useTournaments";
import { useDefaultTournaments } from "@/hooks/AppConfig/useDefaultTournaments";
import { useUpdateConfig } from "@/hooks/AppConfig/useAppConfig";
import { toast } from "sonner";
import { Loader2, Settings, Save } from "lucide-react";
import { Tournament } from "@/types/Tournament/Tournament";

function ConfigurationSection() {
  const [masterTournamentId, setMasterTournamentId] = useState<string>("");
  const [leagueTournamentId, setLeagueTournamentId] = useState<string>("");

  // Obtener todos los torneos
  const { tournaments, isLoading: isLoadingTournaments } = useAllTournaments();

  // Obtener configuración actual
  const { defaults, isLoading: isLoadingDefaults } = useDefaultTournaments();

  // Mutation para actualizar
  const updateConfigMutation = useUpdateConfig();

  // Filtrar torneos por tipo
  const masterTournaments = tournaments.filter((t: Tournament) => t.type === "master");
  const leagueTournaments = tournaments.filter((t: Tournament) => t.type === "league");

  // Cargar valores actuales cuando se obtienen los defaults
  useEffect(() => {
    if (defaults) {
      if (defaults.defaultMasterTournament) {
        setMasterTournamentId(String(defaults.defaultMasterTournament));
      }
      if (defaults.defaultLeagueTournament) {
        setLeagueTournamentId(String(defaults.defaultLeagueTournament));
      }
    }
  }, [defaults]);

  const handleSave = async () => {
    try {
      // Guardar ambas configuraciones
      if (masterTournamentId) {
        await updateConfigMutation.mutateAsync({
          key: "defaultMasterTournament",
          value: masterTournamentId,
        });
      }
      if (leagueTournamentId) {
        await updateConfigMutation.mutateAsync({
          key: "defaultLeagueTournament",
          value: leagueTournamentId,
        });
      }
      toast.success("Configuracion guardada correctamente");
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Error al guardar la configuracion");
    }
  };

  const isLoading = isLoadingTournaments || isLoadingDefaults;

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      <div className="flex items-center gap-2 mb-6">
        <Settings className="h-6 w-6 text-primary" />
        <h1 className="text-2xl font-bold">Configuracion General</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Torneos por Defecto</CardTitle>
          <CardDescription>
            Configura que torneos apareceran preseleccionados en las paginas publicas de Master y Partidos.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Torneo Master por defecto */}
          <div className="space-y-2">
            <label className="text-sm font-medium">
              Torneo Master por defecto (pagina /master)
            </label>
            <Select
              value={masterTournamentId}
              onValueChange={setMasterTournamentId}
            >
              <SelectTrigger className="w-full md:w-96">
                <SelectValue placeholder="Selecciona un torneo Master..." />
              </SelectTrigger>
              <SelectContent>
                {masterTournaments.map((tournament: Tournament) => (
                  <SelectItem key={tournament.id} value={String(tournament.id)}>
                    {tournament.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {masterTournaments.length === 0 && (
              <p className="text-sm text-muted-foreground">
                No hay torneos de tipo Master disponibles
              </p>
            )}
          </div>

          {/* Torneo Liga por defecto */}
          <div className="space-y-2">
            <label className="text-sm font-medium">
              Torneo Liga por defecto (pagina /partidos)
            </label>
            <Select
              value={leagueTournamentId}
              onValueChange={setLeagueTournamentId}
            >
              <SelectTrigger className="w-full md:w-96">
                <SelectValue placeholder="Selecciona un torneo de Liga..." />
              </SelectTrigger>
              <SelectContent>
                {leagueTournaments.map((tournament: Tournament) => (
                  <SelectItem key={tournament.id} value={String(tournament.id)}>
                    {tournament.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {leagueTournaments.length === 0 && (
              <p className="text-sm text-muted-foreground">
                No hay torneos de tipo Liga disponibles
              </p>
            )}
          </div>

          {/* Boton guardar */}
          <div className="pt-4">
            <Button
              onClick={handleSave}
              disabled={updateConfigMutation.isPending}
            >
              {updateConfigMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Guardando...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Guardar Configuracion
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default ConfigurationSection;
