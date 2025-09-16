import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";


export default function TicketDetail() {
  const router = useRouter();
  const { id } = router.query;
  const [chatHistory, setChatHistory] = useState([]);

  useEffect(() => {
    if (!id) return;

    async function loadChat() {
      const { data, error } = await supabase
        .from("chat_history")
        .select("message_text, created_at")
        .eq("ticket_id", id)
        .order("created_at", { ascending: true });

      if (error) console.error(error);

      // Procesar cada registro y dividirlo en mensajes individuales
      const parsed = [];
      data?.forEach((row) => {
        const parts = row.message_text
          .split(/- (user|agent):/)
          .filter(Boolean);

        for (let i = 0; i < parts.length; i += 2) {
          const sender = parts[i].trim();
          const text = (parts[i + 1] || "").trim();

          if (sender && text) {
            parsed.push({
              sender,
              text,
              created_at: row.created_at,
            });
          }
        }
      });

      setChatHistory(parsed);
    }

    loadChat();
  }, [id]);

  return (
    <div className="min-h-screen bg-gradient-to-r from-green-50 via-white to-green-100 p-6">
      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold text-gray-700">Historial de Chat</h1>
          <button
            onClick={() => router.back()}
            className="px-4 py-2 text-sm bg-emerald-500 text-white rounded-lg shadow hover:bg-emerald-600 transition"
          >
            ⬅ Volver
          </button>
        </div>

        <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
          {chatHistory.length === 0 ? (
            <p className="text-center text-gray-500">
              No hay mensajes en este ticket.
            </p>
          ) : (
            chatHistory.map((msg, i) => (
              <div
                key={i}
                className={`flex ${
                  msg.sender === "user" ? "justify-start" : "justify-end"
                }`}
              >
                <div
                  className={`max-w-[75%] p-3 rounded-lg shadow-sm ${
                    msg.sender === "user"
                      ? "bg-gray-100 text-gray-800"
                      : "bg-emerald-500 text-white"
                  }`}
                >
                  <p className="whitespace-pre-line">{msg.text}</p>
                  <small className="block mt-1 text-xs opacity-70">
                    {msg.sender === "user" ? "Usuario" : "Agente"} ·{" "}
                    {new Date(msg.created_at).toLocaleString()}
                  </small>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
