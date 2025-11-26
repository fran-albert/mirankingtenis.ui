import { createManualBracket } from "@/api/Playoff/create-manual-bracket";
import { ManualBracketRequest } from "@/types/Tournament-Category/TournamentCategory";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useManualBracketMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: createManualBracket,
        onSuccess: (result, variables) => {
            // Invalidar queries relevantes
            queryClient.invalidateQueries({
                queryKey: ['playoffs', variables.tournamentId, variables.categoryId]
            });
            queryClient.invalidateQueries({
                queryKey: ['round-of-16', variables.tournamentId, variables.categoryId]
            });
            queryClient.invalidateQueries({
                queryKey: ['quarter-finals', variables.tournamentId, variables.categoryId]
            });
            queryClient.invalidateQueries({
                queryKey: ['semi-finals', variables.tournamentId, variables.categoryId]
            });
            queryClient.invalidateQueries({
                queryKey: ['finals', variables.tournamentId, variables.categoryId]
            });
            queryClient.invalidateQueries({
                queryKey: ['tournament-categories', variables.tournamentId]
            });
            // CRITICAL: Invalidate playoff status so DirectPlayoffCard updates
            queryClient.invalidateQueries({
                queryKey: ['playoff-stage-status', variables.tournamentId, variables.categoryId]
            });
        },
    });
};
