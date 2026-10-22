import React from 'react';

interface Props {
  status: string;
}

export const StatusBadge: React.FC<Props> = ({ status }) => {
  let badgeStyles = 'bg-slate-100 text-slate-800 border-slate-300';

  if (status === 'Approved' || status === 'Ready for Pickup' || status === 'Completed') {
    badgeStyles = 'bg-emerald-50 text-emerald-700 border-emerald-300';
  } else if (status === 'Pending' || status === 'In Clearance') {
    badgeStyles = 'bg-amber-50 text-amber-800 border-amber-300';
  } else if (status === 'On Hold' || status === 'Cancelled') {
    badgeStyles = 'bg-rose-50 text-rose-700 border-rose-300';
  }

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${badgeStyles}`}>
      {status}
    </span>
  );
};