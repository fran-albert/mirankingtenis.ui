import { deleteDoubleMatch } from "@/api/Doubles-Express/delete";
import { updateShiftForDoubleMatch } from "@/api/Shift/update-double-match";
import { UpdateShiftRequest } from "@/types/Shift/Shift";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useShiftMutation = () => {
    const queryClient = useQueryClient();

    const updateShiftDoubleMatch = useMutation({
        mutationFn: ({ matchId, body }: { matchId: number; body: UpdateShiftRequest }) => updateShiftForDoubleMatch(matchId, body),
        onSuccess: (doublesMatches, variables, context) => {
            queryClient.invalidateQueries({ queryKey: ['doublesMatches'] });
            console.log("doublesMatches created", doublesMatches, variables, context);
        },

        onError: (error: any, variables, context) => {
            console.log("Error details:", error.response?.data || error.message, variables, context);
        },
    });



    return { updateShiftDoubleMatch };
};
