import React from 'react';

type Agenda = {
  id: string;
  nome: string;
  data: string;
  hora: string;
  observacoes?: string;
};

export default function DayDetails({ date, agenda }: { date: string; agenda: Agenda[] }) {
  if (!date) return <div className="p-4 bg-white rounded">Selecione um dia no calendário para ver os detalhes.</div>;

  return (
    <div className="p-4 bg-white rounded">
      <h3 className="font-medium mb-2">Detalhes de {date}</h3>
      {agenda.length === 0 ? (
        <p className="text-gray-600">Vazio</p>
      ) : (
        <ul className="flex flex-col gap-3">
          {agenda.map(a => (
            <li key={a.id} className="p-2 border rounded bg-slate-50">
              <p><span className="font-medium">Nome:</span> {a.nome}</p>
              <p><span className="font-medium">Hora:</span> {a.hora}</p>
              <p><span className="font-medium">Observações:</span> {a.observacoes}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
