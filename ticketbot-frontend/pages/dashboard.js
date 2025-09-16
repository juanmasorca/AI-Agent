import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { useRouter } from "next/router";
import "../src/app/globals.css";

export default function Dashboard() {
  const [tickets, setTickets] = useState([]);
  const [agent, setAgent] = useState(null);
  const router = useRouter();

  useEffect(() => {
    async function load() {
      // Obtener sesión
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) {
        window.location.href = "/";
        return;
      }

      // Obtener agente (vinculado con auth.users)
      const { data: agentData } = await supabase
        .from("agents")
        .select("*")
        .eq("user_id", session.user.id)
        .single();

      setAgent(agentData);

      if (!agentData) return;

      let query = supabase
        .from("tickets")
        .select("*")
        .order("created_at", { ascending: false });

      if (agentData.role !== "admin") {
        // Agentes ven solo sus tickets
        query = query.eq("assigned_agent_id", agentData.id);
      }

      const { data: ticketsData } = await query;
      setTickets(ticketsData || []);
    }

    load();
  }, []);

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/"); // redirige al login
  }

  if (!agent) return <p className="text-center mt-10">Cargando...</p>;

  return (
    <div className="min-h-screen bg-gradient-to-r from-green-100 via-white to-green-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Encabezado con logout */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-700 text-center">
            Tickets asignados
          </h1>
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white font-medium px-4 py-2 rounded-lg shadow hover:bg-red-600 transition"
          >
            Cerrar sesión
          </button>
        </div>

        {tickets.length === 0 ? (
          <p className="text-center text-gray-500">
            No tienes tickets asignados.
          </p>
        ) : (
          <ul className="space-y-4">
            {tickets.map((t) => (
              <li
                key={t.id}
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition"
              >
                <div className="flex justify-between items-center">
                  <h2 className="text-lg font-semibold text-gray-800">
                    {t.category} /{" "}
                    <span className="capitalize text-emerald-600">
                      {t.priority}
                    </span>
                  </h2>
                  <span className="text-sm text-gray-400">
                    {new Date(t.created_at).toLocaleString()}
                  </span>
                </div>

                <p className="mt-3 text-gray-600">
                  {t.ai_summary || t.message_text}
                </p>

                <div className="mt-4">
                  <button
                    onClick={() => router.push(`/ticket/${t.id}`)}
                    className="w-full sm:w-auto bg-emerald-500 text-white font-medium px-5 py-2 rounded-lg shadow-md hover:bg-emerald-600 transition"
                  >
                    Ver historial del ticket
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
