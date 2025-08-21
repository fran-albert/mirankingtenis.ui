import { deleteDoubleMatch } from "@/api/Doubles-Express/delete";
import { updateShiftForDoubleMatch } from "@/api/Shift/update-double-match";
import { shiftForMatch } from "@/api/Shift/shift-for-match";
import { updateShift } from "@/api/Shift/update-shift";
import { deleteShift } from "@/api/Shift/delete-shift";
import { UpdateShiftRequest, Shift } from "@/types/Shift/Shift";
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

    const shiftForMatchMutation = useMutation({
        mutationFn: ({ shift, idMatch }: { shift: { idCourt: number; startHour: string }; idMatch: number }) => shiftForMatch(shift, idMatch),
        onSuccess: (shift, variables, context) => {
            queryClient.invalidateQueries({ queryKey: ['shifts'] });
            queryClient.invalidateQueries({ queryKey: ['matches'] });
            console.log("Shift created for match", shift, variables, context);
        },
        onError: (error: any, variables, context) => {
            console.log("Error creating shift for match:", error.response?.data || error.message, variables, context);
        },
    });

    const updateShiftMutation = useMutation({
        mutationFn: ({ newShift, idShift }: { newShift: Shift; idShift: number }) => updateShift(newShift, idShift),
        onSuccess: (shift, variables, context) => {
            queryClient.invalidateQueries({ queryKey: ['shifts'] });
            queryClient.invalidateQueries({ queryKey: ['matches'] });
            console.log("Shift updated", shift, variables, context);
        },
        onError: (error: any, variables, context) => {
            console.log("Error updating shift:", error.response?.data || error.message, variables, context);
        },
    });

    const deleteShiftMutation = useMutation({
        mutationFn: (idShift: number) => deleteShift(idShift),
        onSuccess: (result, idShift, context) => {
            queryClient.invalidateQueries({ queryKey: ['shifts'] });
            queryClient.invalidateQueries({ queryKey: ['matches'] });
            console.log("Shift deleted", idShift, context);
        },
        onError: (error: any, variables, context) => {
            console.log("Error deleting shift:", error.response?.data || error.message, variables, context);
        },
    });

    return { 
        updateShiftDoubleMatch,
        shiftForMatchMutation,
        updateShiftMutation,
        deleteShiftMutation
    };
};
