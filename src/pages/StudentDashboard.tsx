import React, { useState } from "react";
import type { DocumentRequest } from "../types";
import { StatusBadge } from "../components/StatusBadge";
import { RequestModal } from "../components/RequestModal";
import { ConfirmationModal } from "../components/ConfirmationModal";
import { FilePlus2Icon } from "lucide-react";

interface Props {
  requests: DocumentRequest[];
  onCreateRequest: (docType: DocumentRequest["documentType"]) => void;
  onCancelRequest: (id: string) => void;
}

export const StudentDashboard: React.FC<Props> = ({
  requests,
  onCreateRequest,
  onCancelRequest,
}) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selectedReq, setSelectedReq] = useState<DocumentRequest | null>(
    requests[0] || null,
  );

  const handleSubmitted = (docType: DocumentRequest["documentType"]) => {
    onCreateRequest(docType);
    setConfirmOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <div>
          <h2 className="text-xl font-bold text-[#002d62]">
            Online Document Request Subsystem
          </h2>
        </div>
        <button
          onClick={() => setModalOpen(true)}
          className="bg-[#002d62] hover:bg-[#001d40] text-[#fec810] font-bold px-4 py-2 rounded-lg text-sm shadow transition flex items-center gap-2"
        >
          <FilePlus2Icon size={16} className="shrink-0" />
          <span> Request Document</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-4 bg-slate-50 border-b border-slate-200">
            <h3 className="font-bold text-slate-800 text-sm">
              Dashboard of Request (Past Submissions)
            </h3>
          </div>
          <div className="overflow-x-auto">
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
                    onClick={() => setSelectedReq(req)}
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
                    <td className="py-3 px-4 text-right">
                      {req.status !== "Cancelled" &&
                        req.status !== "Completed" && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onCancelRequest(req.id);
                            }}
                            className="text-xs text-rose-600 hover:text-rose-800 font-semibold"
                          >
                            Cancel
                          </button>
                        )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Real-time Checklist */}
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
              {selectedReq.clearanceItems.map((item) => (
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
              ))}
            </div>
          ) : (
            <p className="text-xs text-slate-400">
              Select a request to inspect checklist.
            </p>
          )}
        </div>
      </div>

      <RequestModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSubmitted}
      />

      <ConfirmationModal
        isOpen={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        message="Request submitted — waiting for department response."
      />
    </div>
  );
};
