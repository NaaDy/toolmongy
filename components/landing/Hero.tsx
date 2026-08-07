export default function Hero() {
  return (
    <section className="relative min-h-screen bg-slate-950 text-white overflow-hidden flex items-center justify-center">
      {/* Background Glow */}
      <div className="absolute w-[700px] h-[700px] bg-blue-600/20 blur-[150px] rounded-full" />

      <div className="relative z-10 max-w-6xl mx-auto px-6 text-center">

        <span className="inline-block mb-6 px-4 py-2 rounded-full border border-blue-500/30 bg-blue-500/10 text-blue-400">
          🚀 AI • Developer • Productivity Tools
        </span>

        <h1 className="text-6xl md:text-7xl font-extrabold leading-tight">
          One Platform.
          <br />
          Thousands of Tools.
        </h1>

        <p className="mt-8 text-xl text-gray-400 max-w-3xl mx-auto">
          Access powerful AI tools, developer utilities,
          image generators, PDF tools, SEO solutions,
          APIs and much more — all in one place.
        </p>

        <div className="mt-10 flex justify-center gap-5">
          <button className="px-8 py-4 rounded-xl bg-blue-600 hover:bg-blue-700 font-semibold">
            Explore Tools
          </button>

          <button className="px-8 py-4 rounded-xl border border-gray-700 hover:bg-white/10">
            View Pricing
          </button>
        </div>

        <div className="grid grid-cols-3 gap-6 mt-20">

          <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <h2 className="text-4xl font-bold text-blue-400">1000+</h2>
            <p className="text-gray-400 mt-2">
              Powerful Tools
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <h2 className="text-4xl font-bold text-blue-400">50K+</h2>
            <p className="text-gray-400 mt-2">
              Active Users
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <h2 className="text-4xl font-bold text-blue-400">99.9%</h2>
            <p className="text-gray-400 mt-2">
              Uptime
            </p>
          </div>

        </div>

      </div>
    </section>
  );
}