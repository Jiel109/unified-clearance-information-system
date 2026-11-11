import React, { useState } from "react";
import type { DocumentRequest, UserSession } from "../types";
import { StatusBadge } from "../components/StatusBadge";
import { ConfirmationModal } from "../components/ConfirmationModal";
import { Loader2 } from "lucide-react";

interface Props {
  session: UserSession;
  requests: DocumentRequest[];
  onReschedule: (id: string, date: string, slot: string) => Promise<void>;
  onCloseCollection: (id: string) => Promise<void>;
}

export const SchedulingPage: React.FC<Props> = ({
  session,
  requests,
  onReschedule,
  onCloseCollection,
}) => {
  const isAuthorizedClerk = session.role === "Registrar" || session.role === "Admin";
  
  const eligibleRequests = requests.filter(
    (r) => r.status === "Ready for Pickup" || r.status === "Completed"
  );
  
  const [selectedId, setSelectedId] = useState<string>(eligibleRequests[0]?.id || "");
  const [newDate, setNewDate] = useState<string>("");
  const [newSlot, setNewSlot] = useState<string>("09:00 AM - 10:00 AM");
  const [rescheduleMessage, setRescheduleMessage] = useState<string | null>(null);
  
  // Operation loading state trackers
  const [isRescheduling, setIsRescheduling] = useState<boolean>(false);
  const [releasingId, setReleasingId] = useState<string | null>(null);

  const selectedReq = eligibleRequests.find((r) => r.id === selectedId) ?? eligibleRequests[0] ?? null;

  const handleReschedule = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedId || !newDate) return;

    try {
      setIsRescheduling(true);
      await onReschedule(selectedId, newDate, newSlot);
      
      const readableDate = new Date(`${newDate}T00:00:00`).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });

      setRescheduleMessage(
        `Request Reference: ${selectedId}\nAssigned pick-up date: ${readableDate}\nTime slot: ${newSlot}`
      );
      setNewDate("");
    } catch (err: any) {
      alert(err.message || "Failed to update pick-up schedule.");
    } finally {
      setIsRescheduling(false);
    }
  };

  const handleRelease = async (requestId: string) => {
    const confirmed = window.confirm(
      `Confirm document release for ${requestId}? This marks the clearance request as Completed.`
    );
    if (!confirmed) return;

    try {
      setReleasingId(requestId);
      await onCloseCollection(requestId);
    } catch (err: any) {
      alert(err.message || "Failed to release document.");
    } finally {
      setReleasingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
        <div>
          <h2 className="text-xl font-bold text-[#002d62]">
            Scheduling Subsystem
          </h2>
          <p className="text-sm text-slate-500">
            Manage document release appointments, slot reservations, and final handover verification.
          </p>
        </div>
        <div className="bg-blue-50 border border-blue-200 text-[#002d62] px-3 py-1.5 rounded-lg text-xs font-bold">
          Queue Size: {eligibleRequests.length} Ready/Completed
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Table & Mobile List View */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
          <div className="p-4 bg-slate-50 border-b border-slate-200 font-bold text-sm text-slate-800 flex justify-between items-center">
            <span>Document Collection Schedule</span>
            <span className="text-[11px] text-slate-500 font-normal">
              Click a record to manage appointment
            </span>
          </div>

          {/* Mobile Card Layout */}
          <div className="md:hidden divide-y divide-slate-200">
            {eligibleRequests.map((req) => (
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
                  {req.studentName}
                </div>
                <div className="text-xs text-slate-500">
                  Date: {req.pickupDate || "Unscheduled"} &bull; Time: {req.pickupTimeSlot || "N/A"}
                </div>
                {isAuthorizedClerk && req.status === "Ready for Pickup" && (
                  <div className="pt-2">
                    <button
                      disabled={releasingId === req.id}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRelease(req.id);
                      }}
                      className="w-full text-xs bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold py-2 rounded-lg shadow-sm flex items-center justify-center gap-1.5"
                    >
                      {releasingId === req.id ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : null}
                      <span>{releasingId === req.id ? "Releasing..." : "Mark Released"}</span>
                    </button>
                  </div>
                )}
              </div>
            ))}
            {eligibleRequests.length === 0 && (
              <p className="p-8 text-center text-xs text-slate-400">
                No requests are eligible for collection yet.
              </p>
            )}
          </div>

          {/* Desktop Table */}
          <div className="hidden md:block overflow-x-auto flex-1">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-100 text-slate-600 text-xs uppercase">
                <tr>
                  <th className="py-3 px-4">Request Ref</th>
                  <th className="py-3 px-4">Student Name</th>
                  <th className="py-3 px-4">Document Type</th>
                  <th className="py-3 px-4">Assigned Pick-up</th>
                  <th className="py-3 px-4">Time Window</th>
                  <th className="py-3 px-4">Status</th>
                  {isAuthorizedClerk && (
                    <th className="py-3 px-4 text-right">Handover Action</th>
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {eligibleRequests.map((req) => (
                  <tr
                    key={req.id}
                    onClick={() => setSelectedId(req.id)}
                    className={`cursor-pointer transition hover:bg-blue-50/50 ${
                      selectedReq?.id === req.id ? "bg-blue-50/80 font-medium" : ""
                    }`}
                  >
                    <td className="py-3 px-4 text-[#002d62] font-semibold">
                      {req.id}
                    </td>
                    <td className="py-3 px-4 font-medium text-slate-800">
                      {req.studentName}
                    </td>
                    <td className="py-3 px-4 text-xs text-slate-600">
                      {req.documentType}
                    </td>
                    <td className="py-3 px-4 text-xs font-semibold text-slate-700">
                      {req.pickupDate || "Unscheduled"}
                    </td>
                    <td className="py-3 px-4 text-xs text-slate-500">
                      {req.pickupTimeSlot || "N/A"}
                    </td>
                    <td className="py-3 px-4">
                      <StatusBadge status={req.status} />
                    </td>
                    {isAuthorizedClerk && (
                      <td className="py-3 px-4 text-right whitespace-nowrap">
                        {req.status === "Ready for Pickup" ? (
                          <button
                            disabled={releasingId === req.id}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRelease(req.id);
                            }}
                            className="inline-flex items-center gap-1.5 text-xs bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold px-3 py-1.5 rounded-lg shadow-sm transition"
                          >
                            {releasingId === req.id ? (
                              <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            ) : null}
                            <span>{releasingId === req.id ? "Releasing..." : "Mark Released"}</span>
                          </button>
                        ) : (
                          <span className="text-xs text-slate-400 italic">Dispatched</span>
                        )}
                      </td>
                    )}
                  </tr>
                ))}
                {eligibleRequests.length === 0 && (
                  <tr>
                    <td
                      colSpan={isAuthorizedClerk ? 7 : 6}
                      className="py-12 text-center text-xs text-slate-400"
                    >
                      No cleared documents ready for collection scheduling.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Reschedule Control Card */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 space-y-4 h-fit">
          <h3 className="font-bold text-slate-800 text-sm border-b pb-2">
            Reschedule Pick-up Appointment
          </h3>

          {selectedReq ? (
            <form onSubmit={handleReschedule} className="space-y-4 text-sm">
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs space-y-1">
                <div>
                  <span className="text-slate-500">Target Request:</span>{" "}
                  <span className="font-bold text-[#002d62]">{selectedReq.id}</span>
                </div>
                <div>
                  <span className="text-slate-500">Student:</span>{" "}
                  <span className="font-medium text-slate-700">{selectedReq.studentName}</span>
                </div>
                <div>
                  <span className="text-slate-500">Document:</span>{" "}
                  <span className="font-medium text-slate-700">{selectedReq.documentType}</span>
                </div>
                <div>
                  <span className="text-slate-500">Current Slot:</span>{" "}
                  <span className="font-medium text-slate-700">
                    {selectedReq.pickupDate ? `${selectedReq.pickupDate} (${selectedReq.pickupTimeSlot})` : "None assigned"}
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase mb-1">
                  Pick-up Date
                </label>
                <input
                  type="date"
                  aria-label="Pick-up Date"
                  value={newDate}
                  min={new Date().toISOString().split("T")[0]}
                  onChange={(e) => setNewDate(e.target.value)}
                  className="w-full border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-[#002d62] outline-none text-sm text-slate-800"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase mb-1">
                  Collection Time Window
                </label>
                <select
                  aria-label="Available Slot"
                  value={newSlot}
                  onChange={(e) => setNewSlot(e.target.value)}
                  className="w-full border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-[#002d62] outline-none text-sm font-medium text-slate-800"
                >
                  <option value="09:00 AM - 10:00 AM">09:00 AM - 10:00 AM</option>
                  <option value="10:00 AM - 11:00 AM">10:00 AM - 11:00 AM</option>
                  <option value="01:00 PM - 02:00 PM">01:00 PM - 02:00 PM</option>
                  <option value="03:00 PM - 04:00 PM">03:00 PM - 04:00 PM</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={isRescheduling}
                className="w-full py-2.5 bg-[#002d62] hover:bg-[#001f44] disabled:opacity-50 text-[#fec810] font-bold rounded-lg shadow text-sm transition flex items-center justify-center gap-2"
              >
                {isRescheduling ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : null}
                <span>{isRescheduling ? "Updating Calendar..." : "Confirm Reschedule"}</span>
              </button>
            </form>
          ) : (
            <p className="text-xs text-slate-400">
              Select an eligible request from the table to schedule or adjust pick-up windows.
            </p>
          )}
        </div>
      </div>

      <ConfirmationModal
        isOpen={rescheduleMessage !== null}
        onClose={() => setRescheduleMessage(null)}
        message={rescheduleMessage ?? ""}
      />
    </div>
  );
};