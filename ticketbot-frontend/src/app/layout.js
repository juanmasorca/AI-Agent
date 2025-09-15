export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} bg-[var(--background)] text-[var(--foreground)] antialiased`}
      >
        <div className="min-h-screen flex flex-col">
          <header className="w-full shadow-md p-4 bg-[var(--primary)] text-white">
            <h1 className="text-2xl font-bold">🚀 Ticket System</h1>
          </header>

          <main className="flex-1 container mx-auto px-4 py-6">
            {children}
          </main>

          <footer className="w-full p-4 text-center text-sm text-[var(--secondary)]">
            © {new Date().getFullYear()} Ticket System
          </footer>
        </div>
      </body>
    </html>
  );
}



