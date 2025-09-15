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
      const { data, error } = await supabase
        .from('chat_history')
        .select('message_text, created_at')
        .eq('ticket_id', id)
        .order('created_at', { ascending: true })

      if (error) console.error(error)

      // Procesar cada registro y dividirlo en mensajes individuales
      const parsed = []
      data?.forEach(row => {
        const parts = row.message_text.split(/- (user|agent):/).filter(Boolean)
        for (let i = 0; i < parts.length; i += 2) {
          const sender = parts[i].trim()
          const text = (parts[i + 1] || '').trim()
          if (sender && text) {
            parsed.push({
              sender,
              text,
              created_at: row.created_at
            })
          }
        }
      })

      setChatHistory(parsed)
    }

    loadChat()
  }, [id])

  return (
    <div style={{ maxWidth: 800, margin: '20px auto' }}>
      <h1>Historial de Chat</h1>
      <button onClick={() => router.back()}>⬅ Volver</button>
      <div style={{ marginTop: 20 }}>
        {chatHistory.map((msg, i) => (
          <div key={i} style={{ borderBottom: '1px solid #ddd', padding: '10px 0' }}>
            {msg.sender === 'user' ? (
              <p><strong>Usuario:</strong> {msg.text}</p>
            ) : (
              <p style={{ color: 'blue' }}><strong>Agente:</strong> {msg.text}</p>
            )}
            <small>{new Date(msg.created_at).toLocaleString()}</small>
          </div>
        ))}
      </div>
    </div>
  )
}
