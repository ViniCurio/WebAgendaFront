import React from 'react';
import { formatDateDisplay } from '../utils/date.js';

type Agenda = {
  id: string;
  nome: string;
  data: string;
  hora: string;
  observacoes?: string;
};

export default function DayPage({
  date,
  agenda,
  onBack,
  onDelete,
}: {
  date: string;
  agenda: Agenda[];
  onBack: () => void;
  onDelete: (id: string) => void;
}) {
  return (
    <div className="p-4 bg-white rounded">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-medium">Agendamentos de {formatDateDisplay(date)}</h2>
        <button className="bg-gray-500 text-white px-3 py-1 rounded" onClick={onBack}>Voltar</button>
      </div>

      {agenda.length === 0 ? (
        <p className="text-gray-600">Nenhum agendamento neste dia.</p>
      ) : (
        <ul className="flex flex-col gap-3">
          {agenda.map(a => (
            <li key={a.id} className="p-3 border rounded bg-slate-50">
              <p><span className="font-medium">Nome:</span> {a.nome}</p>
              <p><span className="font-medium">Data:</span> {formatDateDisplay(a.data)}</p>
              <p><span className="font-medium">Hora:</span> {a.hora}</p>
              <p><span className="font-medium">Observações:</span> {a.observacoes}</p>
              <div className="mt-2">
                <button className="bg-red-500 text-white px-2 py-1 rounded" onClick={() => onDelete(a.id)}>Excluir</button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
