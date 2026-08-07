"use client";

import { useState } from "react";

export default function PasswordGenerator() {
  const [length, setLength] = useState(16);
  const [password, setPassword] = useState("");

  function generatePassword() {
    const chars =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=";

    let result = "";

    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }

    setPassword(result);
  }

  function copyPassword() {
    navigator.clipboard.writeText(password);
    alert("Password copied!");
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-6">
      <div className="bg-slate-900 rounded-2xl p-8 w-full max-w-xl shadow-xl">

        <h1 className="text-4xl font-bold mb-3">
          Password Generator
        </h1>

        <p className="text-gray-400 mb-8">
          Generate strong and secure passwords instantly.
        </p>

        <label className="block mb-2">
          Password Length: <b>{length}</b>
        </label>

        <input
          type="range"
          min={6}
          max={64}
          value={length}
          onChange={(e) => setLength(Number(e.target.value))}
          className="w-full mb-8"
        />

        <button
          onClick={generatePassword}
          className="w-full bg-blue-600 hover:bg-blue-700 py-3 rounded-xl font-semibold"
        >
          Generate Password
        </button>

        {password && (
          <div className="mt-8">

            <input
              readOnly
              value={password}
              className="w-full bg-slate-800 p-4 rounded-xl text-green-400"
            />

            <button
              onClick={copyPassword}
              className="w-full mt-4 border border-gray-700 py-3 rounded-xl hover:bg-white/10"
            >
              Copy Password
            </button>

          </div>
        )}

      </div>
    </main>
  );
}