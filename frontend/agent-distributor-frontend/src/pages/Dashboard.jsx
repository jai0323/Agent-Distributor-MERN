import React from 'react';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  const logout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-blue-700">Admin Dashboard</h1>
        <button
          onClick={logout}
          className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"
        >
          Logout
        </button>
      </header>

      {/* Navigation */}
      <nav className="flex space-x-4 mb-6">
        <Link
          to="/agents"
          className="px-4 py-2 rounded-lg bg-blue-100 text-blue-700 hover:bg-blue-200 transition"
        >
          Agents
        </Link>
        <Link
          to="/upload"
          className="px-4 py-2 rounded-lg bg-green-100 text-green-700 hover:bg-green-200 transition"
        >
          Upload CSV/XLSX
        </Link>
      </nav>

      {/* Dashboard content */}
      <div className="bg-white shadow-lg rounded-2xl p-6">
        <p className="text-gray-700">
          Use the menu above to manage agents, upload lists, and view lead distributions.
        </p>
      </div>
    </div>
  );
}
