import React, { useState } from 'react';
import API from '../api';

export default function Upload() {
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState('');

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!file) return setStatus('Please select a file');

    const fd = new FormData();
    fd.append('file', file);
    setStatus('Uploading...');

    try {
      const res = await API.post('/upload', fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setStatus('Success! Distributed leads: ' + JSON.stringify(res.data.distribution, null, 2));
    } catch (err) {
      setStatus('Error: ' + (err.response?.data?.message || err.message));
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="bg-white shadow-lg rounded-2xl w-full max-w-md p-8">
        <h2 className="text-2xl font-bold text-center text-blue-700 mb-6">
          Upload CSV / XLSX
        </h2>

        <form onSubmit={onSubmit} className="flex flex-col items-center space-y-4">
          <input
            type="file"
            accept=".csv, .xls, .xlsx"
            onChange={(e) => setFile(e.target.files[0])}
            className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0
                       file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700
                       hover:file:bg-blue-100 cursor-pointer w-full"
          />

          <button
            type="submit"
            className="bg-blue-600 text-white py-3 rounded-xl font-semibold w-full hover:bg-blue-700 transition"
          >
            Upload & Distribute
          </button>
        </form>

        {status && (
          <div className="mt-6 p-4 bg-gray-100 rounded-lg text-gray-800 whitespace-pre-wrap text-sm">
            {status}
          </div>
        )}
      </div>
    </div>
  );
}
