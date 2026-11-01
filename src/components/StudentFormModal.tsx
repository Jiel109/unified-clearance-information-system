import React, { useState } from 'react';
import type { StudentProfile } from '../types';

interface Props {
  onClose: () => void;
  initial?: StudentProfile;
  onSave: (profile: StudentProfile) => string | null;
}

const YEAR_LEVELS = ['1st Year', '2nd Year', '3rd Year', '4th Year'];

const EMPTY: StudentProfile = {
  studentId: '',
  firstName: '',
  lastName: '',
  course: '',
  yearLevel: '1st Year',
  contactNumber: '',
  email: ''
};

const inputClass =
  'w-full mt-1 px-3 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#002d62] focus:border-[#002d62] outline-none text-sm text-slate-800';
const labelClass = 'block text-xs font-bold text-[#002d62] uppercase';

export const StudentFormModal: React.FC<Props> = ({ onClose, initial, onSave }) => {
  const [formData, setFormData] = useState<StudentProfile>(initial ?? EMPTY);
  const [error, setError] = useState<string | null>(null);

  const setField = (field: keyof StudentProfile, value: string) =>
    setFormData({ ...formData, [field]: value });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const result = onSave({
      ...formData,
      studentId: formData.studentId.trim(),
      firstName: formData.firstName.trim(),
      lastName: formData.lastName.trim(),
      course: formData.course.trim(),
      contactNumber: formData.contactNumber.trim(),
      email: formData.email.trim()
    });
    if (result) {
      setError(result);
      return;
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg border border-slate-200 overflow-hidden">
        <div className="bg-[#002d62] text-white px-6 py-4 flex justify-between items-center border-b-2 border-[#fec810]">
          <h3 className="font-bold text-lg">
            {initial ? 'Edit Student Record' : 'Add Student Record'}
          </h3>
          <button onClick={onClose} className="text-yellow-400 hover:text-white text-xl">
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[85vh] overflow-y-auto">
          {error && (
            <div className="bg-rose-50 border-l-4 border-rose-500 p-3 text-xs text-rose-700">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>First Name</label>
              <input
                type="text"
                required
                value={formData.firstName}
                onChange={(e) => setField('firstName', e.target.value)}
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Last Name</label>
              <input
                type="text"
                required
                value={formData.lastName}
                onChange={(e) => setField('lastName', e.target.value)}
                className={inputClass}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Student ID</label>
              <input
                type="text"
                required
                value={formData.studentId}
                onChange={(e) => setField('studentId', e.target.value)}
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Year Level</label>
              <select
                aria-label="Year Level"
                value={formData.yearLevel}
                onChange={(e) => setField('yearLevel', e.target.value)}
                className={inputClass}
              >
                {YEAR_LEVELS.map((level) => (
                  <option key={level} value={level}>
                    {level}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className={labelClass}>Course / Program</label>
            <input
              type="text"
              required
              value={formData.course}
              onChange={(e) => setField('course', e.target.value)}
              className={inputClass}
            />
          </div>

          <div>
            <label className={labelClass}>Email Address</label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setField('email', e.target.value)}
              className={inputClass}
            />
          </div>

          <div>
            <label className={labelClass}>Contact Number</label>
            <input
              type="text"
              required
              value={formData.contactNumber}
              onChange={(e) => setField('contactNumber', e.target.value)}
              className={inputClass}
            />
          </div>

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
              className="px-5 py-2 bg-[#002d62] text-[#fec810] font-bold rounded-lg text-sm hover:bg-[#00224b] transition shadow"
            >
              {initial ? 'Save Changes' : 'Add Student'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
