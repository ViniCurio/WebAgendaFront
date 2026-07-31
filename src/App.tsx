import { useEffect, useState, useRef } from 'react';
import type { FormEvent } from 'react';
import { FiTrash } from 'react-icons/fi';
import { api } from './services/api.js';
import logo from './images/logo.png';
import WeekCalendar from './components/WeekCalendar.js';
import DayPage from './components/DayPage.js';
import { formatDateDisplay } from './utils/date.js';


interface AgendaProps {
    id: string;
    nome: string;
    data: string;
    hora: string;
    observacoes: string;
}

export default function App() {
  const [agenda, setAgenda] = useState<AgendaProps[]>([]);
  const [page, setPage] = useState<'home' | 'agendamentos' | 'dia'>('home');
  const [weekStart, setWeekStart] = useState<string>(() => {
    const today = new Date();
    const day = today.getDay();
    const diffToMonday = (day + 6) % 7;
    const monday = new Date(today);
    monday.setDate(today.getDate() - diffToMonday);
    return monday.toISOString().slice(0,10);
  });
  const [selectedDay, setSelectedDay] = useState<string>('');
  const [prefilledDate, setPrefilledDate] = useState<string>('');
  const [showOnlyBookedDays, setShowOnlyBookedDays] = useState(true);
  const sortedAgenda = [...agenda].sort((a, b) => a.data.localeCompare(b.data));
  const nomeRef = useRef<HTMLInputElement | null>(null);
  const dataRef = useRef<HTMLInputElement | null>(null);
  const horaRef = useRef<HTMLInputElement | null>(null);
  const observRef = useRef<HTMLTextAreaElement | null>(null);

  const getLocalToday = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  useEffect(() => {
    hundleAgenda();
  }, []);

  useEffect(() => {
    if (page === 'home' && prefilledDate && dataRef.current) {
      dataRef.current.value = prefilledDate;
    }
  }, [page, prefilledDate]);

  useEffect(() => {
    if (agenda.length > 0) {
      cleanupOldAppointments(agenda);
    }
  }, [agenda]);

  async function hundleAgenda() {
    const response = await api.get("/agenda");
    const fetched = response.data;
    setAgenda(fetched);
    cleanupOldAppointments(fetched);
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();

    if(!nomeRef.current?.value || !dataRef.current?.value || !horaRef.current?.value) {
      alert("Complete os campos necessários");
      return;
    }

    const requestedDate = dataRef.current.value;
    const requestedTime = horaRef.current.value;
    const todayDate = getLocalToday();

    if (requestedDate < todayDate) {
      alert("Não é possível agendar para uma data anterior à data atual.");
      return;
    }

    if (requestedTime < '07:00' || requestedTime > '23:00') {
      alert('O horário deve ser entre 07:00 e 23:00.');
      return;
    }

    const duplicate = agenda.some((item) => item.data === requestedDate && item.hora === requestedTime);

    if (duplicate) {
      alert("Este horário já possui um agendamento. Escolha outro horário.");
      return;
    }

    try {
      const response = await api.post("/agendamento", {
        nome: nomeRef.current.value,
        data: dataRef.current.value,
        hora: horaRef.current.value,
        observacoes: observRef.current?.value
      });

      setAgenda(allAgenda => [...allAgenda, response.data]);

      nomeRef.current.value = "";
      dataRef.current.value = "";
      horaRef.current.value = "";
      observRef.current!.value = "";
    } catch (err) {
      console.error("Erro ao salvar agendamento:", err);
    }
  }

  async function handleDelete(id: string) {
    try {
      await api.delete("/agenda", {
        params: {
          id: id,
        }
      });

      const allAgendamentos = agenda.filter((agendamentos) => agendamentos.id !== id);
      setAgenda(allAgendamentos);

    } catch (err) {
      console.log(err);
    }
  }

  async function cleanupOldAppointments(items: AgendaProps[]) {
    const now = new Date();
    const expirationThreshold = new Date(now.getTime() - 48 * 60 * 60 * 1000);
    const expired = items.filter((item) => {
      const appointmentDateTime = new Date(`${item.data}T${item.hora}:00`);
      return appointmentDateTime < expirationThreshold;
    });

    if (expired.length === 0) return;

    try {
      await Promise.all(
        expired.map((item) =>
          api.delete("/agenda", { params: { id: item.id } })
        )
      );
      setAgenda((current) =>
        current.filter(
          (item) => !expired.some((expiredItem) => expiredItem.id === item.id)
        )
      );
    } catch (err) {
      console.error("Erro ao apagar agendamentos expirados:", err);
    }
  }

  const today = getLocalToday();
  const todayAgenda = sortedAgenda.filter(a => a.data === today);
  const weekAgenda = applyWeekFilter(sortedAgenda, weekStart);

  function applyWeekFilter(list: AgendaProps[], mondayISO: string) {
    const monday = new Date(mondayISO);
    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);
    const mondayStr = monday.toISOString().slice(0,10);
    const sundayStr = sunday.toISOString().slice(0,10);
    return list.filter(a => a.data >= mondayStr && a.data <= sundayStr);
  }

  function goNextWeek() {
    const monday = new Date(weekStart);
    monday.setDate(monday.getDate() + 7);
    setWeekStart(monday.toISOString().slice(0,10));
  }

  function goPrevWeek() {
    const monday = new Date(weekStart);
    monday.setDate(monday.getDate() - 7);
    setWeekStart(monday.toISOString().slice(0,10));
  }

  return (
    <div className="w-full min-h-screen bg-slate-100 flex justify-center px-2">
      <main className="relative my-8 w-full bg-slate-300 border-2 mt-2 border-slate-400 rounded p-12 md:max-w-2xl">
        <div className="absolute right-5 top-5 z-10 flex items-center gap-2 rounded-lg bg-slate-100/95 px-3 py-2 shadow ring-1 ring-slate-200 text-slate-800 text-sm font-light">
          <button
            className={`rounded px-3 py-1 transition ${page === 'home' ? 'bg-slate-300' : 'bg-slate-200 hover:bg-slate-300'}`}
            onClick={() => setPage('home')}
            type="button"
          >
            Home
          </button>
          <button
            className={`rounded px-3 py-1 transition ${page === 'agendamentos' ? 'bg-slate-300' : 'bg-slate-200 hover:bg-slate-300'}`}
            onClick={() => setPage('agendamentos')}
            type="button"
          >
            Agendamentos
          </button>
        </div>
        <div className="mb-4">
          <h1 className="text-4xl font-medium -mt-8 text-black">
            <img src={logo} alt="Logo" className="h-72 w-auto -mt-20 -ml-12 -mb-20" />
          </h1>

        </div>

        {page === 'home' ? (
          <>
            <form className="flex flex-col mt-0" onSubmit={handleSubmit}>
              <label className="font-light text-black">Nome</label>
              <input
                type="text"
                placeholder="Digite o nome do cliente"
                className="w-full mb-5 p-2 rounded border-b-2 border-gray-500"
                ref={nomeRef}
              />
              <label className="font-light text-black">Data</label>
              <input
                type="date"
                min={today}
                className="w-full mb-5 text-gray-400 p-2 rounded border-b-2 border-gray-500 cursor-pointer"
                ref={dataRef}
              />
              <label className="font-light text-black">Hora</label>
              <input
                type="time"
                min="07:00"
                max="23:00"
                className="w-full mb-5 text-gray-400 p-2 rounded border-b-2 border-gray-500 cursor-pointer"
                ref={horaRef}
              />
              <label className="font-light text-black">Observações</label>
              <textarea
                className="w-full min-h-28 p-2 rounded border-b-2 border-gray-500 resize-none mb-2"
                ref={observRef}
              />
              <input
                type="submit"
                value="CONFIRMAR"
                className="cursor-pointer w-28 text-slate-100 bg-green-500 p-2 rounded font-medium 
                  hover:bg-green-600 active:scale-95 transition" />
            </form>

            <section className="flex flex-col gap-4">
              {todayAgenda.map((ag) => (
                <article key={ag.id} className="w-full bg-slate-200 
                      rounded p-2 relative hover:scale-110 duration-300 border-2  
                      border-gray-700">
                <p><span className="font-medium">Nome:</span> {ag.nome} </p>
                <p><span className="font-medium">Data:</span> {formatDateDisplay(ag.data)} </p>
                <p><span className="font-medium">Hora:</span> {ag.hora} </p>
                <p><span className="font-medium">Observações:</span> {ag.observacoes} </p>

                <button 
                  className="bg-red-500 w-7 h-7 flex items-center 
                    justify-center rounded-lg absolute right-1 -top-2 active:scale-95 hover:scale-110"
                  onClick={() => handleDelete(ag.id)}
                >
                  <FiTrash size={18} color="#FFF" /> 
                </button>
              </article>
              ))}
              {todayAgenda.length === 0 && (
                <p className="text-center text-gray-600">Nenhum agendamento para hoje.</p>
              )}
            </section>
          </>
        ) : page === 'agendamentos' ? (
          <>
            <div className="flex flex-wrap items-center justify-start gap-2 mb-3 pl-2">
              <button className="rounded bg-blue-600 px-2 py-1 text-sm font-semibold text-white hover:bg-blue-700" onClick={() => setShowOnlyBookedDays(prev => !prev)}>
                {showOnlyBookedDays ? 'Mostrar todos os dias' : 'Mostrar só dias agendados'}
              </button>
              <button className="rounded bg-slate-200 px-2 py-1 text-sm font-semibold text-slate-900 hover:bg-slate-300" onClick={goPrevWeek}>Semana anterior</button>
              <button className="rounded bg-slate-200 px-2 py-1 text-sm font-semibold text-slate-900 hover:bg-slate-300" onClick={goNextWeek}>Próxima semana</button>
            </div>
            <section className="flex flex-col gap-4">
              <WeekCalendar
                agenda={weekAgenda}
                weekStart={weekStart}
                showOnlyBookedDays={showOnlyBookedDays}
                onSelectDay={(d) => { setSelectedDay(d); setPage('dia'); }}
                onSchedule={(d) => {
                  setPrefilledDate(d);
                  setPage('home');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              />
            </section>
          </>
        ) : (
          <>
            <DayPage
              date={selectedDay}
              agenda={sortedAgenda.filter(a => a.data === selectedDay)}
              onBack={() => setPage('agendamentos')}
              onDelete={(id) => { handleDelete(id); }}
            />
          </>
        )}
      </main>
    </div>
  );
}

