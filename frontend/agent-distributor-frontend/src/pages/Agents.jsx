import React, { useEffect, useState } from 'react';
import API from '../api';
import { Link } from 'react-router-dom';

export default function Agents() {
  const [agents, setAgents] = useState([]);
  const [err, setErr] = useState('');

  useEffect(() => {
    (async () => {
      try {
        const res = await API.get('/agents');
        setAgents(res.data);
      } catch (err) {
        setErr('Failed to fetch agents');
      }
    })();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-blue-700">Agents</h2>
        <Link
          to="/agents/add"
          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
        >
          Add Agent
        </Link>
      </div>

      {err && (
        <div className="mb-4 p-2 bg-red-100 text-red-700 rounded">{err}</div>
      )}

      <div className="overflow-x-auto bg-white shadow-lg rounded-2xl">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Name</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Email</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Mobile</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">View Leads</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {agents.map((a) => (
              <tr key={a._id} className="hover:bg-gray-50">
                <td className="px-6 py-4">{a.name}</td>
                <td className="px-6 py-4">{a.email}</td>
                <td className="px-6 py-4">{a.mobile}</td>
                <td className="px-6 py-4">
                  <Link
                    to={`/agent/${a._id}`}
                    className="text-blue-600 hover:underline"
                  >
                    View
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
