import { useEffect, useState, useMemo } from "react";
import { supabase } from "../lib/supabaseClient";
import { useRouter } from "next/router";
import "../src/app/globals.css";

export default function Dashboard() {
  const [tickets, setTickets] = useState([]);
  const [agent, setAgent] = useState(null);
  const [filter, setFilter] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: "created_at", direction: "desc" });
  const router = useRouter();

  useEffect(() => {
    async function load() {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) {
        router.push("/");
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
  }, [router]);

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/");
  }

  const filteredTickets = useMemo(() => {
    return tickets.filter((t) => {
      const search = filter.toLowerCase();
      return (
        t.category?.toLowerCase().includes(search) ||
        t.priority?.toLowerCase().includes(search) ||
        t.ai_summary?.toLowerCase().includes(search) ||
        t.message_text?.toLowerCase().includes(search)
      );
    });
  }, [tickets, filter]);

  const sortedTickets = useMemo(() => {
    const sortable = [...filteredTickets];
    if (sortConfig) {
      sortable.sort((a, b) => {
        const aValue = a[sortConfig.key] || "";
        const bValue = b[sortConfig.key] || "";
        if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
        if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
        return 0;
      });
    }
    return sortable;
  }, [filteredTickets, sortConfig]);

  const requestSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  if (!agent) return <p className="text-center mt-10 text-gray-800">Cargando...</p>;

return (
  <div className="min-h-screen bg-gradient-to-r from-green-100 via-white to-green-50 p-6">
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900 text-center">
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
        <p className="text-center text-gray-600">No tienes tickets asignados.</p>
      ) : (
        <>
          <input
            type="text"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            placeholder="Buscar tickets..."
            className="mb-4 w-full p-2 border rounded-lg shadow-sm text-gray-800"
          />

          <table className="min-w-full bg-white rounded-xl shadow-sm border border-gray-200">
  <thead className="bg-gray-100">
    <tr>
      {["category", "priority", "ai_summary", "created_at"].map((col) => (
        <th
          key={col}
          onClick={() => requestSort(col)}
          className="text-center px-4 py-2 border-b border-gray-200 cursor-pointer text-gray-800"
        >
          {col.replace("_", " ").toUpperCase()}
          {sortConfig.key === col ? (sortConfig.direction === "asc" ? " 🔼" : " 🔽") : ""}
        </th>
      ))}
      <th className="text-center px-4 py-2 border-b border-gray-200 text-gray-800">Acciones</th>
    </tr>
  </thead>
  <tbody>
    {sortedTickets.map((t) => (
      <tr key={t.id} className="hover:bg-green-50 transition">
        <td className="px-4 py-2 border-b border-gray-200 text-gray-700 text-center">{t.category}</td>
        <td
          className={`px-4 py-2 border-b border-gray-200 capitalize text-center ${
            t.priority === "alta"
              ? "text-red-600"
              : t.priority === "media"
              ? "text-yellow-600"
              : "text-green-600"
          }`}
        >
          {t.priority}
        </td>
        <td className="px-4 py-2 border-b border-gray-200 text-gray-700 text-center">{t.ai_summary || "—"}</td>
        <td className="px-4 py-2 border-b border-gray-200 text-gray-700 text-center">{new Date(t.created_at).toLocaleString()}</td>
        <td className="px-4 py-2 border-b border-gray-200 text-center">
          <button
            onClick={() => router.push(`/ticket/${t.id}`)}
            className="bg-emerald-500 text-white px-3 py-1 rounded hover:bg-emerald-600 transition"
          >
            Ver historial
          </button>
        </td>
      </tr>
    ))}
  </tbody>
</table>


        </>
      )}
    </div>
  </div>
);  
}
