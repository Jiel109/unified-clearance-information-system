import React, { useState } from 'react';
import type { DocumentRequest, DepartmentName, ClearanceStatus, UserSession } from '../types';
import { StatusBadge } from '../components/StatusBadge';

interface Props {
  session: UserSession;
  requests: DocumentRequest[];
  onUpdateStatus: (
    requestId: string,
    department: DepartmentName,
    status: ClearanceStatus,
    remarks: string,
    approverId: string
  ) => void;
}

export const DepartmentClearancePage: React.FC<Props> = ({ session, requests, onUpdateStatus }) => {
  const currentDept = session.role as DepartmentName;
  const [selectedReqId, setSelectedReqId] = useState<string>(requests[0]?.id || '');
  const [status, setStatus] = useState<ClearanceStatus>('Approved');
  const [remarks, setRemarks] = useState('');

  const activeReq = requests.find(r => r.id === selectedReqId);
  const activeItem = activeReq?.clearanceItems.find(c => c.department === currentDept);

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedReqId) return;
    onUpdateStatus(selectedReqId, currentDept, status, remarks, session.identifier);
    setRemarks('');
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
        <div>
          <h2 className="text-xl font-bold text-[#002d62]">{currentDept} Clearance Review</h2>
          <p className="text-sm text-slate-500">
            Clear or hold student clearances on behalf of the {currentDept} office.
          </p>
        </div>
        <div className="bg-yellow-50 border border-yellow-200 text-[#002d62] px-3 py-1.5 rounded-lg text-xs font-bold">
          Logged Approver: {session.identifier}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-4 bg-slate-50 border-b border-slate-200 font-bold text-sm text-slate-800">
            Incoming Clearance Queue for {currentDept}
          </div>
          <div className="md:hidden divide-y divide-slate-200">
            {requests.map(req => {
              const item = req.clearanceItems.find(c => c.department === currentDept);
              return (
                <div
                  key={req.id}
                  onClick={() => setSelectedReqId(req.id)}
                  className={`p-4 space-y-2 cursor-pointer ${selectedReqId === req.id ? 'bg-blue-50/80' : ''}`}
                >
                  <div className="flex justify-between items-start gap-2">
                    <span className="font-semibold text-sm text-[#002d62]">{req.id}</span>
                    <StatusBadge status={item?.status || 'Pending'} />
                  </div>
                  <div className="text-sm font-medium text-slate-800">{req.studentName}</div>
                  <div className="text-xs text-slate-500">{req.documentType}</div>
                </div>
              );
            })}
          </div>
          <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-100 text-slate-600 text-xs uppercase">
              <tr>
                <th className="py-3 px-4">Request ID</th>
                <th className="py-3 px-4">Student</th>
                <th className="py-3 px-4">Document</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {requests.map(req => {
                const item = req.clearanceItems.find(c => c.department === currentDept);
                return (
                  <tr
                    key={req.id}
                    onClick={() => setSelectedReqId(req.id)}
                    className={`cursor-pointer hover:bg-blue-50/40 ${
                      selectedReqId === req.id ? 'bg-blue-50/80 font-medium' : ''
                    }`}
                  >
                    <td className="py-3 px-4 text-[#002d62] font-semibold">{req.id}</td>
                    <td className="py-3 px-4">{req.studentName}</td>
                    <td className="py-3 px-4">{req.documentType}</td>
                    <td className="py-3 px-4">
                      <StatusBadge status={item?.status || 'Pending'} />
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button className="text-xs text-[#002d62] hover:underline font-bold">
                        Select
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          </div>
        </div>

        {/* Action Panel */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
          <h3 className="font-bold text-slate-800 text-sm border-b pb-2 mb-4">
            Evaluate Clearance Status
          </h3>

          {activeReq ? (
            <form onSubmit={handleUpdate} className="space-y-4 text-sm">
              <div className="text-xs text-slate-500">
                Evaluating: <span className="font-bold text-slate-800">{activeReq.id}</span> ({activeReq.studentName})
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Clearance Decision</label>
                <select
                  aria-label="Clearance Decision"
                  value={status}
                  onChange={(e) => setStatus(e.target.value as ClearanceStatus)}
                  className="w-full border rounded-lg p-2 font-medium focus:ring-2 focus:ring-[#002d62] outline-none"
                >
                  <option value="Approved">Approved (Clear Obligations)</option>
                  <option value="On Hold">On Hold (Needs Resolution)</option>
                  <option value="Pending">Pending Evaluation</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Remarks / Obligations</label>
                <textarea
                  rows={3}
                  value={remarks}
                  placeholder={activeItem?.remarks || 'e.g. Cleared / Overdue book fee paid'}
                  onChange={(e) => setRemarks(e.target.value)}
                  className="w-full border rounded-lg p-2 text-xs focus:ring-2 focus:ring-[#002d62] outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-[#002d62] hover:bg-[#001f44] text-[#fec810] font-bold rounded-lg shadow transition"
              >
                Submit Department Sign-off
              </button>
            </form>
          ) : (
            <p className="text-xs text-slate-400">Select a record to evaluate.</p>
          )}
        </div>
      </div>
    </div>
  );
};