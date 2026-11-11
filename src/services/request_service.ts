import { supabase } from "./auth_service";
import type {
  DocumentRequest,
  DepartmentName,
  ClearanceStatus,
} from "../types";

export const requestService = {
  // Fetch document requests along with their nested clearance checklists.
  async getRequests(): Promise<DocumentRequest[]> {
    const { data, error } = await supabase.rpc("get_document_requests");

    if (error) {
      throw new Error(`Failed to load requests: ${error.message}`);
    }

    return (data as DocumentRequest[]) || [];
  },

  // Submit a new document request, creating checklists across the 5 offices.
  async createRequest(
    docType: DocumentRequest["documentType"],
  ): Promise<string> {
    const { data, error } = await supabase.rpc("create_document_request", {
      p_document_type: docType,
    });

    if (error) {
      throw new Error(error.message || "Failed to submit document request.");
    }

    return data as string;
  },

  // Edit the document type for pending or active clearance requests.
  async updateRequestDocType(
    requestId: string,
    docType: DocumentRequest["documentType"],
  ): Promise<void> {
    const { error } = await supabase
      .from("document_requests")
      .update({ document_type: docType, updated_at: new Date().toISOString() })
      .eq("id", requestId);

    if (error) {
      throw new Error(`Failed to update request: ${error.message}`);
    }
  },

  // Cancel an in-progress request.
  async cancelRequest(requestId: string): Promise<void> {
    const { error } = await supabase
      .from("document_requests")
      .update({ status: "Cancelled", updated_at: new Date().toISOString() })
      .eq("id", requestId);

    if (error) {
      throw new Error(`Failed to cancel request: ${error.message}`);
    }
  },

  // Delete a request record.
  async deleteRequest(requestId: string): Promise<void> {
    const { error } = await supabase
      .from("document_requests")
      .delete()
      .eq("id", requestId);

    if (error) {
      throw new Error(`Failed to delete request: ${error.message}`);
    }
  },

  // Department staff sign-off or hold action.
  async updateDepartmentStatus(
    requestId: string,
    department: DepartmentName,
    status: ClearanceStatus,
    remarks: string,
  ): Promise<void> {
    const { error } = await supabase.rpc("update_department_clearance", {
      p_request_id: requestId,
      p_department: department,
      p_status: status,
      p_remarks: remarks,
    });

    if (error) {
      throw new Error(
        error.message || "Failed to record department clearance.",
      );
    }
  },
};
