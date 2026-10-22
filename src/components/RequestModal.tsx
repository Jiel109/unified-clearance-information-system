import React, { useState } from 'react';
import type { DocumentRequest } from '../types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (docType: DocumentRequest['documentType']) => void;
}

export const RequestModal: React.FC<Props> = ({ isOpen, onClose, onSubmit }) => {
  const [docType, setDocType] = useState<DocumentRequest['documentType']>('Transcript of Records (TOR)');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(docType);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md border border-slate-200 overflow-hidden">
        <div className="bg-[#002d62] text-white px-6 py-4 flex justify-between items-center border-b-2 border-[#fec810]">
          <h3 className="font-bold text-lg">Select Document to Request</h3>
          <button onClick={onClose} className="text-yellow-400 hover:text-white text-xl">✕</button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-600 uppercase mb-1">
              Select Document
            </label>
            <select
              aria-label="Select Document"
              value={docType}
              onChange={(e) => setDocType(e.target.value as DocumentRequest['documentType'])}
              className="w-full px-3 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#002d62] outline-none text-sm font-medium"
            >
              <option value="Transcript of Records (TOR)">Transcript of Records (TOR)</option>
              <option value="Certificate of Good Moral">Certificate of Good Moral</option>
              <option value="Registration Form / Cert of Enrollment">Registration Form / Cert of Enrollment</option>
              <option value="Diploma Reissue">Diploma Reissue</option>
            </select>
          </div>

          <div className="bg-blue-50 border-l-4 border-[#002d62] p-3 text-xs text-[#002d62] leading-relaxed">
            Submitting this request will automatically forward your record across 5 clearing departments: Library, Accounting, Guidance, MIS, and Student Affairs.
          </div>

          <div className="pt-4 flex justify-end gap-3 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-slate-300 rounded-lg text-sm text-slate-600 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-[#002d62] text-[#fec810] font-bold rounded-lg text-sm hover:bg-[#001f44] transition shadow"
            >
              Request
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};