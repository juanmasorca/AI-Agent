import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabaseClient'

export default function TicketDetail() {
  const router = useRouter()
  const { id } = router.query
  const [ticket, setTicket] = useState(null)

  useEffect(() => {
    if (!id) return

    async function loadTicket() {
      const { data, error } = await supabase
        .from('tickets')
        .select('*')
        .eq('id', id)
        .single()

      if (!error) setTicket(data)
    }

    loadTicket()
  }, [id])

  if (!ticket) return <p className="text-center text-gray-500">Cargando...</p>

  return (
    <div className="max-w-2xl mx-auto p-6">
      <button
        onClick={() => router.back()}
        className="mb-4 text-sm text-gray-500 hover:text-gray-700"
      >
        ← Volver
      </button>

      <h1 className="text-2xl font-bold text-gray-800 mb-4">📄 Detalle del Ticket</h1>

      <div className="bg-white shadow rounded-lg p-4 space-y-3 border border-gray-200">
        <p><strong>Categoría:</strong> {ticket.category}</p>
        <p><strong>Prioridad:</strong> {ticket.priority}</p>
        <p><strong>Mensaje:</strong> {ticket.ai_summary || ticket.message_text}</p>
        <p className="text-sm text-gray-400">
          Creado: {new Date(ticket.created_at).toLocaleString()}
        </p>
      </div>

      <div className="mt-6">
        <a
          href={`/ticket/${ticket.id}/history`}
          className="inline-block px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition"
        >
          Ver detalle →
        </a>
      </div>
    </div>
  )
}
