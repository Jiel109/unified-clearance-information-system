import React from "react";
import type { DocumentRequest } from "../types";
import { StatusBadge } from "../components/StatusBadge";
import { FileDown } from "lucide-react";

interface Props {
  requests: DocumentRequest[];
}

export const RegistrarDashboard: React.FC<Props> = ({ requests }) => {
  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-[#002d62]">
            Registrar Audit View
          </h2>
          <p className="text-sm text-slate-500">
            Consolidated clearance statuses from departments
            preserving record integrity.
          </p>
        </div>
        <button
          onClick={() => window.print()}
          className="border border-[#002d62] text-[#002d62] hover:bg-blue-50 font-semibold px-4 py-1.5 rounded-lg text-xs flex items-center gap-2"
        >
          <FileDown className="shrink-0" />
          <span>Export / Print Report</span>
        </button>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#002d62] text-white uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">Request Ref</th>
                <th className="py-3 px-4">Student Name</th>
                <th className="py-3 px-4">Document</th>
                <th className="py-3 px-4 text-center">Library</th>
                <th className="py-3 px-4 text-center">Accounting</th>
                <th className="py-3 px-4 text-center">Guidance</th>
                <th className="py-3 px-4 text-center">MIS</th>
                <th className="py-3 px-4 text-center">Student Affairs</th>
                <th className="py-3 px-4">Overall Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {requests.map((req) => {
                const getStatus = (dept: string) =>
                  req.clearanceItems.find((c) => c.department.includes(dept))
                    ?.status || "Pending";

                return (
                  <tr key={req.id} className="hover:bg-slate-50 transition">
                    <td className="py-3 px-4 font-bold text-[#002d62]">
                      {req.id}
                    </td>
                    <td className="py-3 px-4 font-medium">{req.studentName}</td>
                    <td className="py-3 px-4">{req.documentType}</td>
                    <td className="py-3 px-4 text-center">
                      <StatusBadge status={getStatus("Library")} />
                    </td>
                    <td className="py-3 px-4 text-center">
                      <StatusBadge status={getStatus("Accounting")} />
                    </td>
                    <td className="py-3 px-4 text-center">
                      <StatusBadge status={getStatus("Guidance")} />
                    </td>
                    <td className="py-3 px-4 text-center">
                      <StatusBadge status={getStatus("MIS")} />
                    </td>
                    <td className="py-3 px-4 text-center">
                      <StatusBadge status={getStatus("Affairs")} />
                    </td>
                    <td className="py-3 px-4">
                      <StatusBadge status={req.status} />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
