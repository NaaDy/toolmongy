export default function Navbar() {
  return (
    <header className="fixed top-0 left-0 w-full border-b border-white/10 bg-slate-950/80 backdrop-blur-md z-50">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">

        <h1 className="text-2xl font-bold text-white">
          Scalable<span className="text-blue-500">Tools</span>
        </h1>

        <nav className="hidden md:flex items-center gap-8 text-gray-300">
          <a href="#" className="hover:text-white transition">Home</a>
          <a href="#" className="hover:text-white transition">Tools</a>
          <a href="#" className="hover:text-white transition">Pricing</a>
          <a href="#" className="hover:text-white transition">About</a>
          <a href="#" className="hover:text-white transition">Contact</a>
        </nav>

        <div className="flex items-center gap-3">
          <button className="text-white hover:text-blue-400 transition">
            Login
          </button>

          <button className="bg-blue-600 hover:bg-blue-700 px-5 py-2 rounded-xl text-white font-semibold transition">
            Get Started
          </button>
        </div>

      </div>
    </header>
  );
}