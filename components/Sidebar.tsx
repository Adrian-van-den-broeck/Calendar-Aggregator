import React from 'react';
import { Agenda, AgendaType } from '../types';
import { AgendaItem } from './AgendaItem';
import { PlusIcon, UserIcon } from './icons';

interface SidebarProps {
  agendas: Agenda[];
  onToggleVisibility: (agendaId: string) => void;
  onRemoveAgenda: (agendaId: string) => void;
  onAddUserAgenda: () => void;
  onAddFriendAgenda: () => void;
  hasUserAgenda: boolean; // This now represents if any personal agenda (manual, google, microsoft) exists
}

export const Sidebar: React.FC<SidebarProps> = ({
  agendas,
  onToggleVisibility,
  onRemoveAgenda,
  onAddUserAgenda,
  onAddFriendAgenda,
  hasUserAgenda,
}) => {
  return (
    <aside className="w-72 bg-gray-800 text-white p-5 flex flex-col shadow-lg">
      <div className="mb-8">
        <h2 className="text-2xl font-semibold tracking-wide">Agendas</h2>
      </div>

      <div className="space-y-4 mb-8">
        {/* Button to add a user agenda (Google, Microsoft, Manual) is always available if desired, 
            but can be conditionally shown based on `hasUserAgenda` if strict single personal agenda is a rule.
            For now, let's keep it always visible to allow multiple personal agendas.
            If you want to hide "Add My Agenda" once one exists, use: !hasUserAgenda && ( ... )
        */}
        <button
            onClick={onAddUserAgenda}
            className="w-full flex items-center justify-center px-4 py-2.5 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            <UserIcon className="w-5 h-5 mr-2" /> Add My Agenda
        </button>
        <button
          onClick={onAddFriendAgenda}
          className="w-full flex items-center justify-center px-4 py-2.5 bg-green-600 hover:bg-green-700 rounded-lg transition-colors duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-green-400"
        >
          <PlusIcon className="w-5 h-5 mr-2" /> Add Friend's Agenda
        </button>
      </div>

      <nav className="flex-grow overflow-y-auto pr-1 -mr-1"> {/* pr and -mr for scrollbar spacing */}
        {agendas.length === 0 && (
          <p className="text-gray-400 text-sm italic">No agendas added yet.</p>
        )}
        <ul className="space-y-2">
          {agendas.map(agenda => (
            <AgendaItem
              key={agenda.id}
              agenda={agenda}
              onToggleVisibility={onToggleVisibility}
              onRemoveAgenda={onRemoveAgenda}
            />
          ))}
        </ul>
      </nav>
      
      <div className="mt-auto pt-4 border-t border-gray-700">
        <p className="text-xs text-gray-500 text-center">Agenda Aggregator v1.0</p>
      </div>
    </aside>
  );
};