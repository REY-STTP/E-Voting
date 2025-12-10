// components/voting/InfoSection.tsx
import React from 'react';

export const InfoSection: React.FC = () => {
  return (
    <div
      className="
        mt-8 rounded-xl p-6
        bg-blue-50 border border-blue-200
        dark:bg-slate-900
        dark:border-slate-700
        shadow-sm dark:shadow-slate-950/40
      "
    >
      <h3 className="font-bold text-blue-800 dark:text-blue-300 mb-2">
        ℹ️ Informasi
      </h3>
      <ul className="text-blue-700 dark:text-slate-300 space-y-1 text-sm">
        <li>• Setiap wallet hanya bisa voting 1 kali</li>
        <li>• Hasil voting tersimpan secara transparan di blockchain</li>
        <li>• Pastikan wallet Anda terhubung ke jaringan yang benar</li>
        <li>• Data voting tersimpan di browser (demo mode)</li>
      </ul>
    </div>
  );
};
