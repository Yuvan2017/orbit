export default function Login() {
  return (
    <main className="min-h-screen bg-slate-950 flex items-center justify-center">
      <div className="bg-slate-900 p-8 rounded-xl w-96 shadow-xl">
        <h1 className="text-3xl font-bold text-white mb-6 text-center">
          Login to Orbit
        </h1>

        <input
          type="email"
          placeholder="Email"
          className="w-full p-3 rounded bg-slate-800 text-white mb-4"
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full p-3 rounded bg-slate-800 text-white mb-6"
        />

        <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg">
          Login
        </button>
      </div>
    </main>
  );
}