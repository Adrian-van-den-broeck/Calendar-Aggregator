import React from 'react';
import { Agenda } from '../types';
import { EyeIcon, EyeSlashIcon, TrashIcon, UserCircleIcon, UsersIcon, GoogleIcon, MicrosoftIcon } from './icons';

interface AgendaItemProps {
  agenda: Agenda;
  onToggleVisibility: (agendaId: string) => void;
  onRemoveAgenda: (agendaId: string) => void;
}

export const AgendaItem: React.FC<AgendaItemProps> = ({ agenda, onToggleVisibility, onRemoveAgenda }) => {
  
  let IconComponent;
  if (agenda.ownerType === 'user') {
    if (agenda.source === 'google') {
      IconComponent = GoogleIcon;
    } else if (agenda.source === 'microsoft') {
      IconComponent = MicrosoftIcon;
    } else { // manual user agenda
      IconComponent = UserCircleIcon;
    }
  } else { // friend's agenda
    IconComponent = UsersIcon;
  }


  return (
    <li 
      className="flex items-center justify-between p-3 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors duration-150 ease-in-out group"
    >
      <div className="flex items-center overflow-hidden">
        <span
          className="w-3 h-3 rounded-full mr-3 flex-shrink-0"
          style={{ backgroundColor: agenda.color }}
          title={`Color for ${agenda.name}`}
        ></span>
        <IconComponent className="w-5 h-5 mr-2 text-gray-400 group-hover:text-white flex-shrink-0" />
        <span className="font-medium text-sm truncate" title={agenda.name}>
          {agenda.name}
        </span>
      </div>
      <div className="flex items-center space-x-2 flex-shrink-0">
        <button
          onClick={() => onToggleVisibility(agenda.id)}
          className="text-gray-400 hover:text-white focus:outline-none"
          aria-label={agenda.isVisible ? "Hide agenda" : "Show agenda"}
        >
          {agenda.isVisible ? <EyeIcon className="w-5 h-5" /> : <EyeSlashIcon className="w-5 h-5" />}
        </button>
        <button
          onClick={() => onRemoveAgenda(agenda.id)}
          className="text-gray-400 hover:text-red-500 focus:outline-none"
          aria-label={`Remove ${agenda.name}`}
        >
          <TrashIcon className="w-5 h-5" />
        </button>
      </div>
    </li>
  );
};