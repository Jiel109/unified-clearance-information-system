import { supabase } from "./auth_service";

export const scheduleService = {
  // Reschedule or set a collection date and time window.
  async reschedulePickup(
    requestId: string,
    date: string,
    timeSlot: string
  ): Promise<void> {
    const { error } = await supabase.rpc("reschedule_pickup", {
      p_request_id: requestId,
      p_date: date,
      p_slot: timeSlot,
    });

    if (error) {
      throw new Error(error.message || "Failed to update appointment slot.");
    }
  },

  // Mark a document collection request as completed.
  async closeCollection(requestId: string): Promise<void> {
    const { error } = await supabase.rpc("close_document_collection", {
      p_request_id: requestId,
    });

    if (error) {
      throw new Error(error.message || "Failed to confirm document release.");
    }
  },
};