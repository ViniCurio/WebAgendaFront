import { useEffect, useState, useRef } from 'react';
import type { FormEvent } from 'react';
import { FiTrash } from 'react-icons/fi';
import { api } from './services/api.js';
import logo from './images/logo.png';


interface AgendaProps {
    id: string;
    nome: string;
    data: string;
    hora: string;
    observacoes: string;
}

export default function App() {

  const [agenda, setAgenda] = useState<AgendaProps[]>([]);
  const sortedAgenda = [...agenda].sort((a, b) => a.data.localeCompare(b.data));
  const nomeRef = useRef<HTMLInputElement | null>(null);
  const dataRef = useRef<HTMLInputElement | null>(null);
  const horaRef = useRef<HTMLInputElement | null>(null);
  const observRef = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    hundleAgenda();
  }, []);

  async function hundleAgenda() {
    const response = await api.get("/agenda");
    setAgenda(response.data);
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();

    if(!nomeRef.current?.value || !dataRef.current?.value || !horaRef.current?.value) {
       alert("Complete os campos necessários");
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

  return (
    <div className="w-full min-h-screen bg-slate-100 flex justify-center px-2">
      <main className="my-8 w-full bg-slate-300 border-2 border-slate-400 rounded p-12 md:max-w-2xl">
        <h1 className="text-4xl font-medium -mt-8 text-black">
          <img src={logo} alt="Logo" className="h-64 w-96 -mt-24 -ml-12 -mb-24" />
        </h1>

          <form className="flex flex-col my-6" onSubmit={handleSubmit}>
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
              className="w-full mb-5 text-gray-400 p-2 rounded border-b-2 border-gray-500 cursor-pointer"
              ref={dataRef}
            /> 
            <label className="font-light text-black">Hora</label>
            <input
              type="time"
              className="w-full mb-5 text-gray-400 p-2 rounded border-b-2 border-gray-500 cursor-pointer"
              ref={horaRef}
            /> 
            <label className="font-light text-black">Observações</label>
            <textarea
              className="w-full min-h-28 p-2 rounded border-b-2 border-gray-500 resize-none mb-3"
              ref={observRef}
            />
            <input 
              type="submit" 
              value="CONFIRMAR" 
              className="cursor-pointer w-28 text-slate-100 bg-green-500 p-2 rounded font-medium 
                hover:bg-green-600 active:scale-95 transition" />
          </form>

          <section className="flex flex-col gap-4">
            {sortedAgenda.map((agenda) => (
              <article key={agenda.id} className="w-full bg-slate-200 
                    rounded p-2 relative hover:scale-110 duration-300 border-2  
                    border-gray-700">
              <p><span className="font-medium">Nome:</span> {agenda.nome} </p>
              <p><span className="font-medium">Data:</span> {agenda.data} </p>
              <p><span className="font-medium">Hora:</span> {agenda.hora} </p>
              <p><span className="font-medium">Obervações:</span> {agenda.observacoes} </p>
            
              <button 
                className="bg-red-500 w-7 h-7 flex items-center 
                  justify-center rounded-lg absolute right-1 -top-2 active:scale-95 hover:scale-110"
                onClick={() => handleDelete(agenda.id)}
              >
                <FiTrash size={18} color="#FFF" /> 
              </button>
            
            </article>
            ))}
          </section>

      </main>
    </div>
  );
}

