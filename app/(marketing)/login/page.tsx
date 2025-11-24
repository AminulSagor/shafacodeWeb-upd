'use client';

import { useState } from 'react';

export default function AdminLogin() {
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const form = new FormData(e.currentTarget);
    const res = await fetch('/api/login', {
      method: 'POST',
      body: form,
    });

    if (res.ok) {
      window.location.href = '/admin/dashboard';
    } else {
      setError('Invalid credentials');
    }
  }

  return (
    <div className="p-10 max-w-md mx-auto">
      <h1 className="text-2xl font-semibold mb-6">Admin Login</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && <p className="text-red-500">{error}</p>}
        <input
          name="username"
          placeholder="Username"
          className="border p-2 w-full"
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          className="border p-2 w-full"
        />
        <button className="bg-black text-white px-4 py-2 rounded">Login</button>
      </form>
    </div>
  );
}
