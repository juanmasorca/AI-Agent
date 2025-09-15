import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabaseClient'

export default function TicketDetail() {
  const router = useRouter()
  const { id } = router.query
  const [chatHistory, setChatHistory] = useState([])

  useEffect(() => {
    if (!id) return

    async function loadChat() {
      const { data } = await supabase
        .from('chat_history')
        .select('message_text, created_at')
        .eq('ticket_id', id)
        .order('created_at', { ascending: true })

      const parsed = []
      data?.forEach(row => {
        const parts = row.message_text.split(/- (user|agent):/).filter(Boolean)
        for (let i = 0; i < parts.length; i += 2) {
          const sender = parts[i].trim()
          const text = (parts[i + 1] || '').trim()
          if (sender && text) {
            parsed.push({ sender, text, created_at: row.created_at })
          }
        }
      })
      setChatHistory(parsed)
    }

    loadChat()
  }, [id])

  return (
    <div className="max-w-3xl mx-auto mt-10 px-4">
      <button 
        onClick={() => router.back()} 
        className="mb-4 px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 transition"
      >
        ⬅ Volver
      </button>

      <h1 className="text-xl font-bold mb-6">💬 Historial del Ticket</h1>
      
      <div className="space-y-4">
        {chatHistory.map((msg, i) => (
          <div 
            key={i} 
            className={`p-3 rounded-lg max-w-xs ${
              msg.sender === 'user' 
                ? 'bg-gray-200 self-start text-left' 
                : 'bg-blue-500 text-white self-end ml-auto text-right'
            }`}
          >
            <p><strong>{msg.sender === 'user' ? 'Usuario' : 'Agente'}:</strong> {msg.text}</p>
            <small className="block mt-1 text-xs opacity-70">{new Date(msg.created_at).toLocaleString()}</small>
          </div>
        ))}
      </div>
    </div>
  )
}
