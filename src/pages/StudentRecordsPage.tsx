import React, { useState } from 'react';
import type { StudentProfile } from '../types';
import { StudentFormModal } from '../components/StudentFormModal';
import { UserPlus } from 'lucide-react';

interface Props {
  profiles: StudentProfile[];
  onCreate: (profile: StudentProfile) => string | null;
  onUpdate: (originalStudentId: string, profile: StudentProfile) => string | null;
  onDelete: (studentId: string) => string | null;
}

export const StudentRecordsPage: React.FC<Props> = ({ profiles, onCreate, onUpdate, onDelete }) => {
  const [search, setSearch] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [editing, setEditing] = useState<StudentProfile | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const query = search.trim().toLowerCase();
  const filtered = profiles.filter((p) =>
    `${p.studentId} ${p.firstName} ${p.lastName} ${p.course} ${p.email}`.toLowerCase().includes(query)
  );

  const handleDelete = (profile: StudentProfile) => {
    const confirmed = window.confirm(
      `Delete ${profile.firstName} ${profile.lastName} (${profile.studentId})? Their document requests will also be removed.`
    );
    if (!confirmed) return;
    setMessage(onDelete(profile.studentId));
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-[#002d62]">Student Records</h2>
          <p className="text-sm text-slate-500">
            Add, view, update, and delete student profiles used by the document request subsystem.
          </p>
        </div>
        <button
          onClick={() => {
            setMessage(null);
            setIsAdding(true);
          }}
          className="bg-[#002d62] hover:bg-[#001d40] text-[#fec810] font-bold px-4 py-2 rounded-lg text-sm shadow transition flex items-center gap-2"
        >
          <UserPlus size={16} className="shrink-0" />
          <span>Add Student</span>
        </button>
      </div>

      {message && (
        <div className="bg-rose-50 border-l-4 border-rose-500 p-3 text-sm text-rose-700">{message}</div>
      )}

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex flex-col sm:flex-row justify-between gap-3">
          <h3 className="font-bold text-slate-800 text-sm">
            Registered Students ({filtered.length})
          </h3>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, ID, course, or email"
            aria-label="Search students"
            className="w-full sm:w-72 px-3 py-1.5 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-[#002d62] outline-none"
          />
        </div>
        <div className="md:hidden divide-y divide-slate-200">
          {filtered.map((p) => (
            <div key={p.studentId} className="p-4 space-y-1">
              <div className="flex justify-between items-start gap-2">
                <span className="font-semibold text-sm text-[#002d62]">
                  {p.firstName} {p.lastName}
                </span>
                <span className="text-xs text-slate-500">{p.studentId}</span>
              </div>
              <div className="text-xs text-slate-700">
                {p.course} &bull; {p.yearLevel}
              </div>
              <div className="text-xs text-slate-500 break-all">{p.email}</div>
              <div className="text-xs text-slate-500">{p.contactNumber}</div>
              <div className="flex gap-2 pt-2">
                <button
                  onClick={() => {
                    setMessage(null);
                    setEditing(p);
                  }}
                  className="text-sm px-3 py-1.5 border border-[#002d62] text-[#002d62] rounded-lg font-semibold"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(p)}
                  className="text-sm px-3 py-1.5 border border-rose-500 text-rose-600 rounded-lg font-semibold"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
          {filtered.length === 0 && (
            <p className="p-4 text-center text-xs text-slate-400">
              No student records found.
            </p>
          )}
        </div>
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-100 text-slate-600 text-xs uppercase">
              <tr>
                <th className="py-3 px-4">Student ID</th>
                <th className="py-3 px-4">Name</th>
                <th className="py-3 px-4">Course</th>
                <th className="py-3 px-4">Year</th>
                <th className="py-3 px-4">Email</th>
                <th className="py-3 px-4">Contact</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filtered.map((p) => (
                <tr key={p.studentId} className="hover:bg-slate-50 transition">
                  <td className="py-3 px-4 font-semibold text-[#002d62]">{p.studentId}</td>
                  <td className="py-3 px-4">
                    {p.firstName} {p.lastName}
                  </td>
                  <td className="py-3 px-4">{p.course}</td>
                  <td className="py-3 px-4">{p.yearLevel}</td>
                  <td className="py-3 px-4 text-xs">{p.email}</td>
                  <td className="py-3 px-4 text-xs">{p.contactNumber}</td>
                  <td className="py-3 px-4 text-right space-x-3 whitespace-nowrap">
                    <button
                      onClick={() => {
                        setMessage(null);
                        setEditing(p);
                      }}
                      className="text-xs text-[#002d62] hover:text-blue-800 font-semibold"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(p)}
                      className="text-xs text-rose-600 hover:text-rose-800 font-semibold"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-6 px-4 text-center text-xs text-slate-400">
                    No student records found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isAdding && <StudentFormModal onClose={() => setIsAdding(false)} onSave={onCreate} />}

      {editing && (
        <StudentFormModal
          key={editing.studentId}
          initial={editing}
          onClose={() => setEditing(null)}
          onSave={(updated) => onUpdate(editing.studentId, updated)}
        />
      )}
    </div>
  );
};
