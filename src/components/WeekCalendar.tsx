import React from 'react';

type Agenda = {
  id: string;
  nome: string;
  data: string; // YYYY-MM-DD
  hora: string; // HH:MM
  observacoes?: string;
};

import { formatDateDisplay } from '../utils/date.js';

export default function WeekCalendar({
  agenda,
  weekStart,
  showOnlyBookedDays,
  onSelectDay,
  onSchedule,
}: {
  agenda: Agenda[];
  weekStart: string; // YYYY-MM-DD for Monday
  showOnlyBookedDays: boolean;
  onSelectDay: (date: string) => void;
  onSchedule: (date: string) => void;
}) {
  const monday = new Date(weekStart);
  const weekDates = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    return d;
  });

  const dateKey = (d: Date) => d.toISOString().slice(0, 10);

  const map = new Map<string, Agenda[]>();
  agenda.forEach(a => {
    const date = a.data;
    if (!map.has(date)) map.set(date, []);
    map.get(date)!.push(a);
  });

  const dayNames = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

  const visibleWeekDates = showOnlyBookedDays
    ? weekDates.filter(d => map.has(dateKey(d)))
    : weekDates;

  const dayItems = visibleWeekDates.map(d => {
    const date = dateKey(d);
    const appointments = map.get(date) || [];
    const sortedAppointments = [...appointments].sort((a, b) => a.hora.localeCompare(b.hora));

    return (
      <div
        key={date}
        onClick={() => onSelectDay(date)}
        className="cursor-pointer w-full text-left rounded-3xl border border-slate-300 bg-white p-5 shadow-sm hover:shadow-lg transition"
      >
        <div className="flex items-center justify-between mb-3">
          <div>
            <div className="text-sm text-gray-500">{dayNames[d.getDay()]}</div>
            <div className="text-lg font-semibold">{formatDateDisplay(date)}</div>
          </div>
          <div className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
            {appointments.length} agend.
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {sortedAppointments.map(app => (
            <div key={app.id} className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2">
              <span className="text-xs font-semibold text-slate-700">{app.hora}</span>
              <span className="h-3 w-3 rounded-sm bg-green-500" />
              <span className="text-xs text-slate-500 truncate max-w-[180px]">{app.nome}</span>
            </div>
          ))}
          {appointments.length === 0 && (
            <div className="text-sm text-slate-500">Sem agendamentos</div>
          )}
        </div>
        <div className="flex justify-end">
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              onSchedule(date);
            }}
            className="rounded bg-blue-600 px-4 py-2 text-white text-sm font-medium hover:bg-blue-700"
          >
            Agendar
          </button>
        </div>
      </div>
    );
  });

  return (
    <div className="w-full flex flex-col gap-4">
      {dayItems}
    </div>
  );
}
