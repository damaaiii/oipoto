import React from 'react';
import { WifiOff } from 'lucide-react';
import { useOnlineStatus } from '../hooks/useOnlineStatus';

export const OfflineIndicator: React.FC = () => {
  const isOnline = useOnlineStatus();

  if (isOnline) return null;

  return (
    <div
      role="status"
      className="fixed bottom-20 md:bottom-5 left-4 right-4 md:left-auto md:right-5 z-50 flex items-center gap-2.5 rounded-2xl bg-[#4A3740] text-[#FFF6EC] px-4 py-2.5 text-xs font-medium shadow-lg border border-[#D9B6C5]/40 max-w-md"
    >
      <WifiOff className="w-4 h-4 text-[#F6CAD8] shrink-0" />
      <span>
        Offline Mode — Cached studio & local gallery active. Live camera depends on browser support.
      </span>
    </div>
  );
};
