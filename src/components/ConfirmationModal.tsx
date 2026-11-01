import React from 'react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  message?: string;
  title?: string;
}

export const ConfirmationModal: React.FC<Props> = ({
  isOpen,
  onClose,
  message = 'Request submitted — waiting for department response.',
  title = 'Request Registered'
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm border border-slate-200 text-center p-6 space-y-4 animate-in fade-in zoom-in-95 duration-150">
        <div className="w-16 h-16 rounded-full bg-blue-50 border-4 border-[#fec810] text-[#002d62] flex items-center justify-center mx-auto text-2xl font-bold">
          ✓
        </div>
        <h4 className="font-bold text-slate-800 text-base">{title}</h4>
        <p className="text-xs text-slate-600 leading-relaxed whitespace-pre-line">{message}</p>
        <button
          onClick={onClose}
          className="w-full py-2 bg-[#002d62] hover:bg-[#001f44] text-[#fec810] font-bold rounded-lg text-sm transition"
        >
          OK
        </button>
      </div>
    </div>
  );
};