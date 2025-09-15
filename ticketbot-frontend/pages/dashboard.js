export default function TicketDetail() {
  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Encabezado */}
      <div className="bg-white dark:bg-gray-900 shadow-md rounded-xl p-6 border border-gray-200 dark:border-gray-700">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
          📒 Tickets asignados
          
        </h1>

        <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
          <span className="font-semibold">Categoría:</span> Otro <br />
          <span className="font-semibold">Prioridad:</span>{" "}
          <span className="text-green-600 dark:text-green-400">Baja</span>
        </p>

        <p className="mt-4 text-gray-700 dark:text-gray-300">
          El usuario reporta dolor en la mano.
        </p>
        <p className="text-red-500 font-bold">Hola Tailwind</p>

        <p className="mt-2 text-sm text-gray-500">
          📅 14/9/2025, 21:08:44
        </p>

        <button className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow">
          Ver historial
        </button>
      </div>

      {/* Historial */}
      <div className="bg-white dark:bg-gray-900 shadow-md rounded-xl p-6 border border-gray-200 dark:border-gray-700">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white flex items-center gap-2">
          💬 Historial del ticket
        </h2>

        <div className="mt-4 space-y-3">
          <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-700 dark:text-gray-300">
              <span className="font-semibold">👤 Usuario:</span> Wena - me duele la mano
            </p>
          </div>

          <div className="p-3 bg-blue-50 dark:bg-blue-900/40 rounded-lg border border-blue-200 dark:border-blue-700">
            <p className="text-sm text-gray-700 dark:text-gray-300">
              Hemos recibido tu solicitud y creado el ticket{" "}
              <span className="font-mono font-semibold">07c223ac-90d4-40ab-aff...</span>.
              Fue clasificado en la categoría{" "}
              <span className="font-semibold">otro</span> con prioridad{" "}
              <span className="font-semibold text-green-600 dark:text-green-400">baja</span>{" "}
              y asignado al <span className="font-semibold">agente_general</span>.
            </p>
          </div>

          <div className="p-3 bg-yellow-50 dark:bg-yellow-900/40 rounded-lg border border-yellow-200 dark:border-yellow-700">
            <p className="text-sm text-gray-700 dark:text-gray-300">
              📩 Le enviaremos un correo electrónico con los detalles y nos comunicaremos contigo pronto.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
