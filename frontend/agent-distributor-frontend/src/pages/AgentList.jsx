import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import API from '../api';

export default function AgentList() {
  const { id } = useParams();
  const [leads, setLeads] = useState([]);
  const [err, setErr] = useState('');

  useEffect(() => {
    (async () => {
      try {
        const res = await API.get(`/upload/agent/${id}`);
        setLeads(res.data.leads);
      } catch (err) {
        setErr('Failed to load leads');
      }
    })();
  }, [id]);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h2 className="text-2xl font-bold text-blue-700 mb-4">Agent Leads</h2>

      {err && (
        <div className="mb-4 p-2 bg-red-100 text-red-700 rounded">{err}</div>
      )}

      <div className="overflow-x-auto bg-white shadow-lg rounded-2xl">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                First Name
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                Phone
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                Notes
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {leads.map((l) => (
              <tr key={l._id} className="hover:bg-gray-50">
                <td className="px-6 py-4">{l.firstName}</td>
                <td className="px-6 py-4">{l.phone}</td>
                <td className="px-6 py-4">{l.notes}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
