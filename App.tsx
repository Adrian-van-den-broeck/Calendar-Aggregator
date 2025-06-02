
import React, { useState, useCallback, useMemo } from 'react';
import { Sidebar } from './components/Sidebar';
import { CalendarView } from './components/CalendarView';
import { Modal } from './components/Modal';
import { AddAgendaForm } from './components/AddAgendaForm';
import { Agenda, Appointment, AgendaType, ViewMode, AgendaSource } from './types';
import { generateMockAppointments, AGENDA_COLORS } from './utils/mockData';
import { PlusIcon, UserIcon, UsersIcon } from './components/icons';
import { getStartOfWeek } from './utils/dateUtils';


const App: React.FC = () => {
  const [agendas, setAgendas] = useState<Agenda[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<AgendaType | null>(null); // Updated type
  const [nextColorIndex, setNextColorIndex] = useState(0);

  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<ViewMode>('week');

  const getNextColor = useCallback(() => {
    const color = AGENDA_COLORS[nextColorIndex % AGENDA_COLORS.length];
    setNextColorIndex(prevIndex => prevIndex + 1);
    return color;
  }, [nextColorIndex]);

  const handleAddAgenda = useCallback((name: string, type: AgendaType, source: AgendaSource, link?: string) => {
    let agendaName = name;
    if (type === AgendaType.USER && !name && source === 'manual') {
      agendaName = 'My Agenda';
    } else if (!name && (source === 'google' || source === 'microsoft')) {
      // Name is pre-defined by the connect button, e.g., "My Google Calendar"
      // This case is handled by the name parameter already.
    }
    
    const newAgenda: Agenda = {
      id: `agenda-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name: agendaName,
      ownerType: type,
      source: source,
      color: getNextColor(),
      isVisible: true,
      appointments: generateMockAppointments(type === AgendaType.USER, currentDate),
      privateLink: type === AgendaType.FRIEND ? link : undefined,
    };
    setAgendas(prevAgendas => [...prevAgendas, newAgenda]);
    setIsModalOpen(false);
    setModalType(null);
  }, [getNextColor, currentDate]);

  const handleToggleAgendaVisibility = useCallback((agendaId: string) => {
    setAgendas(prevAgendas =>
      prevAgendas.map(agenda =>
        agenda.id === agendaId ? { ...agenda, isVisible: !agenda.isVisible } : agenda
      )
    );
  }, []);

  const handleRemoveAgenda = useCallback((agendaId: string) => {
    setAgendas(prevAgendas => prevAgendas.filter(agenda => agenda.id !== agendaId));
  }, []);

  const openAddAgendaModal = (type: AgendaType) => { // Updated parameter type
    setModalType(type);
    setIsModalOpen(true);
  };

  const visibleAppointments = useMemo(() => {
    return agendas
      .filter(agenda => agenda.isVisible)
      .flatMap(agenda => 
        agenda.appointments.map(appointment => ({
          ...appointment,
          agendaId: agenda.id,
          agendaName: agenda.name,
          agendaColor: agenda.color,
        }))
      );
  }, [agendas]);
  
  // Check if any user agenda of type 'manual', 'google', or 'microsoft' exists.
  // This is to guide users if they haven't added their primary agenda yet.
  const hasPersonalAgenda = useMemo(() => 
    agendas.some(a => a.ownerType === AgendaType.USER && (a.source === 'manual' || a.source === 'google' || a.source === 'microsoft')), 
    [agendas]
  );
  
  const displayDate = useMemo(() => {
    if (viewMode === 'week') {
      return getStartOfWeek(currentDate);
    }
    return currentDate;
  }, [currentDate, viewMode]);

  return (
    <div className="flex h-screen font-sans antialiased">
      <Sidebar
        agendas={agendas}
        onToggleVisibility={handleToggleAgendaVisibility}
        onRemoveAgenda={handleRemoveAgenda}
        onAddUserAgenda={() => openAddAgendaModal(AgendaType.USER)} // Updated call
        onAddFriendAgenda={() => openAddAgendaModal(AgendaType.FRIEND)} // Updated call
        hasUserAgenda={hasPersonalAgenda} 
      />
      <main className="flex-1 flex flex-col bg-gray-100 overflow-hidden">
        <header className="p-4 sm:p-6 border-b border-gray-200 bg-white">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Aggregated Agenda</h1>
          <p className="text-sm text-gray-600">View all your important events in one place.</p>
        </header>
        
        <div className="flex-1 p-3 sm:p-6 overflow-y-auto">
          {agendas.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center text-gray-500">
              <UsersIcon className="w-24 h-24 mb-4 text-gray-400" />
              <h2 className="text-2xl font-semibold mb-2">Your agenda space is empty</h2>
              <p className="mb-4">Start by adding your own agenda or linking a friend's agenda.</p>
              <div className="flex space-x-4">
                <button
                    onClick={() => openAddAgendaModal(AgendaType.USER)} // Updated call
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition duration-150 ease-in-out flex items-center"
                  >
                    <UserIcon className="w-5 h-5 mr-2" /> Add My Agenda
                  </button>
                <button
                  onClick={() => openAddAgendaModal(AgendaType.FRIEND)} // Updated call
                  className="px-6 py-3 bg-green-600 text-white rounded-lg shadow-md hover:bg-green-700 transition duration-150 ease-in-out flex items-center"
                >
                  <PlusIcon className="w-5 h-5 mr-2" /> Add Friend's Agenda
                </button>
              </div>
            </div>
          ) : (
            <CalendarView
              appointments={visibleAppointments}
              currentDate={displayDate}
              viewMode={viewMode}
              onDateChange={setCurrentDate}
              onViewModeChange={setViewMode}
            />
          )}
        </div>
      </main>
      {isModalOpen && modalType && (
        <Modal 
            onClose={() => { setIsModalOpen(false); setModalType(null); }} 
            title={
                modalType === AgendaType.USER // Comparison with enum
                ? "Add Your Agenda" 
                : "Add Friend's Agenda"
            }
        >
          <AddAgendaForm
            agendaType={modalType} // modalType is now AgendaType here
            onSubmit={handleAddAgenda}
            onCancel={() => { setIsModalOpen(false); setModalType(null); }}
          />
        </Modal>
      )}
    </div>
  );
};

export default App;
