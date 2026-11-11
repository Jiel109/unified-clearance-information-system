import React, { useState } from "react";
import type { DocumentRequest } from "../types";
import { StatusBadge } from "../components/StatusBadge";
import { RequestModal } from "../components/RequestModal";
import { ConfirmationModal } from "../components/ConfirmationModal";
import { FilePlus2Icon, Loader2 } from "lucide-react";

interface Props {
  requests: DocumentRequest[];
  onCreateRequest: (docType: DocumentRequest["documentType"]) => Promise<void>;
  onCancelRequest: (id: string) => Promise<void>;
  onUpdateRequest: (id: string, docType: DocumentRequest["documentType"]) => Promise<void>;
  onDeleteRequest: (id: string) => Promise<void>;
}

export const StudentDashboard: React.FC<Props> = ({
  requests,
  onCreateRequest,
  onCancelRequest,
  onUpdateRequest,
  onDeleteRequest,
}) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [editReq, setEditReq] = useState<DocumentRequest | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(
    requests[0]?.id ?? null,
  );
  const [processingId, setProcessingId] = useState<string | null>(null);

  // Fallback to the first available request if selected one is deleted
  const selectedReq = requests.find((r) => r.id === selectedId) ?? requests[0] ?? null;

  const handleCreateSubmitted = async (docType: DocumentRequest["documentType"]) => {
    try {
      setProcessingId("new");
      await onCreateRequest(docType);
      setConfirmOpen(true);
    } catch (err: any) {
      alert(err.message || "Failed to submit document request.");
    } finally {
      setProcessingId(null);
    }
  };

  const handleUpdateSubmitted = async (docType: DocumentRequest["documentType"]) => {
    if (!editReq) return;
    try {
      setProcessingId(editReq.id);
      await onUpdateRequest(editReq.id, docType);
      setEditReq(null);
    } catch (err: any) {
      alert(err.message || "Failed to update document request.");
    } finally {
      setProcessingId(null);
    }
  };

  const handleCancel = async (id: string) => {
    const ok = window.confirm(`Cancel document request ${id}?`);
    if (!ok) return;

    try {
      setProcessingId(id);
      await onCancelRequest(id);
    } catch (err: any) {
      alert(err.message || "Failed to cancel request.");
    } finally {
      setProcessingId(null);
    }
  };

  const handleDelete = async (id: string) => {
    const ok = window.confirm(`Permanently delete request ${id}? This cannot be undone.`);
    if (!ok) return;

    try {
      setProcessingId(id);
      await onDeleteRequest(id);
      if (selectedId === id) {
        setSelectedId(null);
      }
    } catch (err: any) {
      alert(err.message || "Failed to delete request.");
    } finally {
      setProcessingId(null);
    }
  };

  const renderActions = (req: DocumentRequest, mobile: boolean) => {
    const isBusy = processingId === req.id;
    const size = mobile
      ? "text-sm px-3 py-1.5 border rounded-lg font-semibold inline-flex items-center gap-1"
      : "text-xs font-semibold inline-flex items-center gap-1";

    if (isBusy) {
      return (
        <span className="text-xs text-slate-400 flex items-center gap-1">
          <Loader2 className="w-3 h-3 animate-spin" /> Updating...
        </span>
      );
    }

    return (
      <div className="flex items-center gap-2">
        {(req.status === "Pending" || req.status === "In Clearance") && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              setEditReq(req);
            }}
            className={`${size} text-[#002d62] hover:text-blue-800 ${
              mobile ? "border-[#002d62]" : ""
            }`}
          >
            Edit
          </button>
        )}

        {req.status !== "Cancelled" && req.status !== "Completed" && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleCancel(req.id);
            }}
            className={`${size} text-amber-600 hover:text-amber-800 ${
              mobile ? "border-amber-500" : ""
            }`}
          >
            Cancel
          </button>
        )}

        {req.status !== "Completed" && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleDelete(req.id);
            }}
            className={`${size} text-rose-600 hover:text-rose-800 ${
              mobile ? "border-rose-500" : ""
            }`}
          >
            Delete
          </button>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <div>
          <h2 className="text-xl font-bold text-[#002d62]">
            Online Document Request Subsystem
          </h2>
          <p className="text-sm text-slate-500">
            Submit document requests and track clearance checklists in real-time.
          </p>
        </div>
        <button
          onClick={() => setModalOpen(true)}
          disabled={processingId === "new"}
          className="bg-[#002d62] hover:bg-[#001d40] text-[#fec810] font-bold px-4 py-2 rounded-lg text-sm shadow transition flex items-center gap-2 disabled:opacity-50"
        >
          {processingId === "new" ? (
            <Loader2 size={16} className="animate-spin shrink-0" />
          ) : (
            <FilePlus2Icon size={16} className="shrink-0" />
          )}
          <span>Request Document</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-4 bg-slate-50 border-b border-slate-200">
            <h3 className="font-bold text-slate-800 text-sm">
              Dashboard of Requests ({requests.length})
            </h3>
          </div>

          {/* Mobile Card List */}
          <div className="md:hidden divide-y divide-slate-200">
            {requests.map((req) => (
              <div
                key={req.id}
                onClick={() => setSelectedId(req.id)}
                className={`p-4 space-y-2 cursor-pointer transition ${
                  selectedReq?.id === req.id ? "bg-blue-50/80" : ""
                }`}
              >
                <div className="flex justify-between items-start gap-2">
                  <span className="font-semibold text-sm text-[#002d62]">
                    {req.id}
                  </span>
                  <StatusBadge status={req.status} />
                </div>
                <div className="text-sm font-medium text-slate-800">
                  {req.documentType}
                </div>
                <div className="text-xs text-slate-500">{req.submittedAt}</div>
                <div className="flex flex-wrap gap-2 pt-1">
                  {renderActions(req, true)}
                </div>
              </div>
            ))}
            {requests.length === 0 && (
              <p className="p-4 text-xs text-slate-400">No requests submitted yet.</p>
            )}
          </div>

          {/* Desktop Table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-100 text-slate-600 text-xs uppercase">
                <tr>
                  <th className="py-3 px-4">Request ID</th>
                  <th className="py-3 px-4">Document Type</th>
                  <th className="py-3 px-4">Date Submitted</th>
                  <th className="py-3 px-4">Overall Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {requests.map((req) => (
                  <tr
                    key={req.id}
                    onClick={() => setSelectedId(req.id)}
                    className={`cursor-pointer transition hover:bg-blue-50/50 ${
                      selectedReq?.id === req.id
                        ? "bg-blue-50/80 font-medium"
                        : ""
                    }`}
                  >
                    <td className="py-3 px-4 text-[#002d62] font-semibold">
                      {req.id}
                    </td>
                    <td className="py-3 px-4">{req.documentType}</td>
                    <td className="py-3 px-4 text-xs text-slate-500">
                      {req.submittedAt}
                    </td>
                    <td className="py-3 px-4">
                      <StatusBadge status={req.status} />
                    </td>
                    <td className="py-3 px-4 text-right space-x-3 whitespace-nowrap">
                      {renderActions(req, false)}
                    </td>
                  </tr>
                ))}
                {requests.length === 0 && (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-xs text-slate-400">
                      No document requests found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Real-time Checklist Panel */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 space-y-4">
          <h3 className="font-bold text-slate-800 text-sm border-b pb-2">
            Clearance Checklist {selectedReq ? `(${selectedReq.id})` : ""}
          </h3>

          {selectedReq ? (
            <div className="space-y-3">
              <div className="text-xs text-slate-500 pb-2">
                Document:{" "}
                <span className="font-semibold text-slate-700">
                  {selectedReq.documentType}
                </span>
              </div>
              {selectedReq.clearanceItems && selectedReq.clearanceItems.length > 0 ? (
                selectedReq.clearanceItems.map((item) => (
                  <div
                    key={item.id}
                    className="p-3 border rounded-lg bg-slate-50/60 flex flex-col gap-1"
                  >
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-xs text-[#002d62]">
                        {item.department}
                      </span>
                      <StatusBadge status={item.status} />
                    </div>
                    <p className="text-xs text-slate-600">
                      <span className="font-medium text-slate-400">
                        Remarks:{" "}
                      </span>
                      {item.remarks || "No notes added"}
                    </p>
                    {item.timestamp && (
                      <span className="text-[10px] text-slate-400 mt-1">
                        Verified: {item.timestamp}
                      </span>
                    )}
                  </div>
                ))
              ) : (
                <p className="text-xs text-slate-400">No clearance items found for this record.</p>
              )}
            </div>
          ) : (
            <p className="text-xs text-slate-400">
              Select a request from the table to inspect clearance items.
            </p>
          )}
        </div>
      </div>

      <RequestModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleCreateSubmitted}
      />

      {editReq && (
        <RequestModal
          key={editReq.id}
          isOpen
          onClose={() => setEditReq(null)}
          onSubmit={handleUpdateSubmitted}
          initialDocType={editReq.documentType}
          title="Edit Document Request"
          submitLabel="Save Changes"
        />
      )}

      <ConfirmationModal
        isOpen={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        message="Request submitted — waiting for department response."
      />
    </div>
  );
};