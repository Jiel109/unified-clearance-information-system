import React, { useState } from "react";
import type { StudentProfile } from "../types";
import { Edit } from "lucide-react";

// Extended locally to support the new optional description field
interface ExtendedStudentProfile extends StudentProfile {
  description?: string;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  profile: ExtendedStudentProfile;
  onSave: (updated: ExtendedStudentProfile) => void;
}

export const ProfileModal: React.FC<Props> = ({
  isOpen,
  onClose,
  profile,
  onSave,
}) => {
  const [formData, setFormData] = useState<ExtendedStudentProfile>(profile);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg border border-slate-200 overflow-hidden">
        <div className="bg-[#002d62] text-white px-6 py-4 flex justify-between items-center border-b-2 border-[#fec810]">
          <h3 className="font-bold text-lg">Manage Student Profile</h3>
          <button
            onClick={onClose}
            className="text-yellow-400 hover:text-white text-xl"
          >
            ✕
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="p-6 space-y-4 max-h-[85vh] overflow-y-auto"
        >
          {/* Read-Only: Name */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase">
                First Name
              </label>
              <input
                type="text"
                value={formData.firstName}
                disabled
                className="w-full mt-1 px-3 py-2 bg-slate-100 border border-slate-200 rounded-lg text-sm text-slate-500 cursor-not-allowed"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase">
                Last Name
              </label>
              <input
                type="text"
                value={formData.lastName}
                disabled
                className="w-full mt-1 px-3 py-2 bg-slate-100 border border-slate-200 rounded-lg text-sm text-slate-500 cursor-not-allowed"
              />
            </div>
          </div>

          {/* Read-Only: Student ID & Year Level */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase">
                Student ID
              </label>
              <input
                type="text"
                value={formData.studentId}
                disabled
                className="w-full mt-1 px-3 py-2 bg-slate-100 border border-slate-200 rounded-lg text-sm text-slate-500 cursor-not-allowed font-medium"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase">
                Year Level
              </label>
              <input
                type="text"
                value={formData.yearLevel}
                disabled
                className="w-full mt-1 px-3 py-2 bg-slate-100 border border-slate-200 rounded-lg text-sm text-slate-500 cursor-not-allowed"
              />
            </div>
          </div>

          {/* Read-Only: Course */}
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase">
              Course / Program
            </label>
            <input
              type="text"
              disabled
              value={formData.course}
              className="w-full mt-1 px-3 py-2 bg-slate-100 border border-slate-200 rounded-lg text-sm text-slate-500 cursor-not-allowed"
            />
          </div>

          {/* Read-Only: Email */}
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase">
              Email Address
            </label>
            <input
              type="email"
              value={formData.email}
              disabled
              className="w-full mt-1 px-3 py-2 bg-slate-100 border border-slate-200 rounded-lg text-xs sm:text-sm text-slate-600 cursor-not-allowed font-mono text-left tracking-tight"
            />
          </div>

          {/* Editable: Contact Number */}
          <div>
            <label className="block text-xs font-bold text-[#002d62] uppercase">
              Contact Number <span className="text-amber-500">*</span>
            </label>
            <input
              type="text"
              value={formData.contactNumber}
              onChange={(e) =>
                setFormData({ ...formData, contactNumber: e.target.value })
              }
              className="w-full mt-1 px-3 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#002d62] focus:border-[#002d62] outline-none text-sm font-medium text-slate-800"
              required
            />
          </div>

          {/* Editable: Description / Notes */}
          <div>
            <label className="block text-xs font-bold text-[#002d62] uppercase">
              Description / Student Notes
            </label>
            <textarea
              rows={3}
              value={formData.description || ""}
              placeholder="Add personal notes, active concerns, or remarks regarding your document requests..."
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              className="w-full mt-1 px-3 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#002d62] focus:border-[#002d62] outline-none text-sm text-slate-800 resize-none"
            />
          </div>

          {/* Action Buttons */}
          <div className="pt-4 flex justify-end gap-3 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-slate-300 rounded-lg text-sm text-slate-600 hover:bg-slate-50 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-[#002d62] text-[#fec810] font-bold rounded-lg text-sm hover:bg-[#00224b] transition shadow"
            >
              <Edit size={16} className="shrink-0" />
              <span>Update Profile</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
