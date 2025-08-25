

export default function SafeApp() {
  return (
    <main className="relative min-h-screen bg-black flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-white mb-8">🎯 Safe Mode</h1>
        <p className="text-xl text-cyan-300 mb-4">Testing minimal app shell</p>
        <div className="text-sm text-gray-400">
          <p>• No complex components</p>
          <p>• No store integration</p>
          <p>• No FX or audio</p>
          <p>• Just basic layout</p>
        </div>
      </div>
    </main>
  );
}
