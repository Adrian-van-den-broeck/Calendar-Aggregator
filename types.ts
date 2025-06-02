export enum AgendaType {
  USER = 'user',
  FRIEND = 'friend',
}

export type AgendaSource = 'google' | 'microsoft' | 'manual' | 'friend_link';

export interface Appointment {
  id: string;
  title: string;
  start: Date;
  end: Date;
  description?: string;
  agendaId: string; 
  agendaName?: string; // For display in CalendarView
  agendaColor?: string; // For display in CalendarView
}

export interface Agenda {
  id: string;
  name: string;
  ownerType: AgendaType;
  source: AgendaSource;
  color: string;
  isVisible: boolean;
  appointments: Appointment[];
  privateLink?: string; // Only for friend's agenda (simulated)
}

export type ViewMode = 'day' | 'week' | 'month';