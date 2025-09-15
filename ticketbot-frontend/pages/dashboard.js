import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

export default function Dashboard() {
  const [tickets, setTickets] = useState([]);
  const [agent, setAgent] = useState(null);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [chatHistory, setChatHistory] = useState([]);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    async function load() {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        window.location.href = "/login";
        return;
      }

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
        query = query.eq("assigned_agent_id", agentData.id);
      }

      const { data: ticketsData } = await query;
      setTickets(ticketsData || []);
    }

    load();
  }, []);

  async function openChat(ticketId) {
    const { data } = await supabase
      .from("chat_history")
      .select("message_text")
      .eq("ticket_id", ticketId)
      .order("created_at", { ascending: true });

    setChatHistory(data || []);
    setSelectedTicket(ticketId);
    setShowModal(true);
  }

  if (!agent) return <p className="text-center mt-10">Cargando...</p>;

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">🎫 Tickets asignados</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {tickets.map((t) => (
          <div
            key={t.id}
            className="bg-white shadow-md rounded-xl p-5 border border-gray-200 flex flex-col justify-between"
          >
            <div>
              <h2 className="text-lg font-semibold text-gray-800">
                {t.category} / {t.priority}
              </h2>
              <p className="text-gray-600 mt-2">
                {t.ai_summary || t.message_text}
              </p>
              <p className="text-xs text-gray-400 mt-2">
                {new Date(t.created_at).toLocaleString()}
              </p>
            </div>

            <button
              onClick={() => openChat(t.id)}
              className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition"
            >
              Ver historial
            </button>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white w-full max-w-2xl rounded-xl shadow-lg p-6 relative">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
            >
              ✕
            </button>
            <h2 className="text-xl font-bold mb-4">💬 Historial del ticket</h2>
            <div className="h-80 overflow-y-auto space-y-3">
              {chatHistory.map((c, i) => {
                const isAgent = c.message_text.startsWith("- agent:");
                return (
                  <div
                    key={i}
                    className={`p-3 rounded-lg max-w-[80%] ${
                      isAgent
                        ? "bg-blue-100 self-end ml-auto"
                        : "bg-gray-100 self-start mr-auto"
                    }`}
                  >
                    <p className="text-sm">
                      <span className="font-semibold">
                        {isAgent ? "👨‍💼 Agente: " : "🧑 Usuario: "}
                      </span>
                      {c.message_text.replace("- agent:", "").replace("- user:", "")}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
