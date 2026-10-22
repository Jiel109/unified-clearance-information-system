import React, { useState } from "react";
import type { DocumentRequest, UserSession } from "../types";
import { StatusBadge } from "../components/StatusBadge";

interface Props {
  session: UserSession;
  requests: DocumentRequest[];
  onReschedule: (id: string, date: string, slot: string) => void;
  onCloseCollection: (id: string) => void;
}

export const SchedulingPage: React.FC<Props> = ({
  session,
  requests,
  onReschedule,
  onCloseCollection,
}) => {
  const eligibleRequests = requests.filter(
    (r) => r.status === "Ready for Pickup" || r.status === "Completed",
  );
  const [selectedId, setSelectedId] = useState(eligibleRequests[0]?.id || "");
  const [newDate, setNewDate] = useState("");
  const [newSlot, setNewSlot] = useState("09:00 AM - 10:00 AM");

  const selectedReq = requests.find((r) => r.id === selectedId);

  const handleReschedule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedId || !newDate) return;
    onReschedule(selectedId, newDate, newSlot);
    alert(`Appointment rescheduled for ${selectedId}`);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <h2 className="text-xl font-bold text-[#002d62]">
          Scheduling Subsystem
        </h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-4 bg-slate-50 border-b border-slate-200 font-bold text-sm text-slate-800">
            Document Collection Schedule
          </div>
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-100 text-slate-600 text-xs uppercase">
              <tr>
                <th className="py-3 px-4">Request ID</th>
                <th className="py-3 px-4">Student</th>
                <th className="py-3 px-4">Assigned Pick-up</th>
                <th className="py-3 px-4">Time Window</th>
                <th className="py-3 px-4">Status</th>
                {session.role === "Registrar" && (
                  <th className="py-3 px-4">Action</th>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {eligibleRequests.map((req) => (
                <tr
                  key={req.id}
                  onClick={() => setSelectedId(req.id)}
                  className={`cursor-pointer hover:bg-blue-50/50 ${selectedId === req.id ? "bg-blue-50 font-semibold" : ""}`}
                >
                  <td className="py-3 px-4 text-[#002d62]">{req.id}</td>
                  <td className="py-3 px-4">{req.studentName}</td>
                  <td className="py-3 px-4">
                    {req.pickupDate || "Unscheduled"}
                  </td>
                  <td className="py-3 px-4 text-xs text-slate-500">
                    {req.pickupTimeSlot || "N/A"}
                  </td>
                  <td className="py-3 px-4">
                    <StatusBadge status={req.status} />
                  </td>
                  {session.role === "Registrar" &&
                    req.status === "Ready for Pickup" && (
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onCloseCollection(req.id);
                          }}
                          className="text-xs bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-2.5 py-1 rounded shadow-sm"
                        >
                          Mark Released
                        </button>
                      </td>
                    )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Reschedule Box */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 space-y-4">
          <h3 className="font-bold text-slate-800 text-sm border-b pb-2">
            Reschedule Pick-up Date
          </h3>
          {selectedReq ? (
            <form onSubmit={handleReschedule} className="space-y-4 text-sm">
              <div className="text-xs text-slate-500">
                Selected:{" "}
                <span className="font-bold text-slate-800">
                  {selectedReq.id}
                </span>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase mb-1">
                  Pick-up Date
                </label>
                <input
                  type="date"
                  aria-label="Pick-up Date"
                  value={newDate}
                  onChange={(e) => setNewDate(e.target.value)}
                  className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-[#002d62] outline-none text-sm"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase mb-1">
                  Available Slot
                </label>
                <select
                  aria-label="Available Slot"
                  value={newSlot}
                  onChange={(e) => setNewSlot(e.target.value)}
                  className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-[#002d62] outline-none text-sm"
                >
                  <option>09:00 AM - 10:00 AM</option>
                  <option>10:00 AM - 11:00 AM</option>
                  <option>01:00 PM - 02:00 PM</option>
                  <option>03:00 PM - 04:00 PM</option>
                </select>
              </div>
              <button
                type="submit"
                className="w-full py-2 bg-[#002d62] hover:bg-[#001f44] text-[#fec810] font-bold rounded-lg shadow text-sm"
              >
                Confirm Reschedule
              </button>
            </form>
          ) : (
            <p className="text-xs text-slate-400">
              Select an eligible request to reschedule.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
