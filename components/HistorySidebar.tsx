
import React from 'react';
import { HistoryItem } from '../types';
import { History, Trash2, ExternalLink } from 'lucide-react';

interface HistorySidebarProps {
  history: HistoryItem[];
  onClear: () => void;
  onSelect: (url: string) => void;
}

const HistorySidebar: React.FC<HistorySidebarProps> = ({ history, onClear, onSelect }) => {
  return (
    <div className="hidden lg:flex flex-col w-64 glass-card h-[calc(100vh-120px)] sticky top-24 rounded-2xl p-4 overflow-hidden">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold flex items-center gap-2">
          <History className="w-5 h-5 text-cyan-400" />
          History
        </h3>
        {history.length > 0 && (
          <button 
            onClick={onClear}
            className="text-gray-400 hover:text-red-400 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto space-y-3 pr-2 custom-scrollbar">
        {history.length === 0 ? (
          <p className="text-sm text-gray-500 text-center italic mt-10">No recent activity</p>
        ) : (
          history.map((item) => (
            <div 
              key={item.id}
              onClick={() => onSelect(item.url)}
              className="p-3 rounded-lg bg-slate-800/50 hover:bg-slate-700/50 cursor-pointer transition-all border border-slate-700/50 group"
            >
              <p className="text-xs font-medium truncate mb-1 text-slate-300 group-hover:text-white">
                {item.title || "TikTok Video"}
              </p>
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-gray-500">
                  {new Date(item.date).toLocaleDateString()}
                </span>
                <ExternalLink className="w-3 h-3 text-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default HistorySidebar;
