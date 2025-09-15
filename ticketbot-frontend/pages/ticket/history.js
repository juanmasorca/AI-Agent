import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { supabase } from '../../../lib/supabaseClient'

export default function TicketHistory() {
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
    <div className="max-w-2xl mx-auto p-6">
      <button
        onClick={() => router.push(`/ticket/${id}`)}
        className="mb-4 text-sm text-gray-500 hover:text-gray-700"
      >
        ← Volver al Ticket
      </button>
      
      <h1 className="text-2xl font-bold mb-6 text-gray-800">💬 Historial de Chat</h1>

      <div className="space-y-4">
        {chatHistory.map((msg, i) => (
          <div
            key={i}
            className={`flex ${msg.sender === 'user' ? 'justify-start' : 'justify-end'}`}
          >
            <div
              className={`max-w-xs p-3 rounded-lg shadow 
                ${msg.sender === 'user'
                  ? 'bg-gray-100 text-gray-800'
                  : 'bg-blue-500 text-white'
                }`}
            >
              <p className="text-sm">{msg.text}</p>
              <small className="block mt-1 text-xs opacity-70">
                {new Date(msg.created_at).toLocaleTimeString()}
              </small>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
