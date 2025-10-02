// src/components/Dashboard.jsx
import React, { Suspense, useState } from 'react';
const Analytics = React.lazy(() => import('../components/Analytics'));

const ChartBarIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm8-12V5a2 2 0 00-2-2h-2a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2zM9 5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2V5z" />
  </svg>
);

const UsersIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M15 21a6 6 0 00-9-5.197M15 14.25a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
  </svg>
);

const EditIcon = () => (
  <svg xmlns="http://www.w3.org/200/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.5L15.232 5.232z" />
  </svg>
);

const MetricCard = ({ title, value, icon }) => (
  <div className="bg-white p-6 rounded-xl shadow-md flex items-center space-x-4 transition-transform transform hover:-translate-y-1">
    <div className="bg-gray-100 rounded-full p-3">{icon}</div>
    <div>
      <p className="text-sm text-gray-500">{title}</p>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
    </div>
  </div>
);

const StatusBadge = ({ status }) => (
  <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full capitalize ${status === 'active' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
    {status}
  </span>
);

export default function Dashboard({ onEditAgent }) {
  const [agents] = useState([
    { id: 1, name: 'Support Assistant', status: 'active' },
    { id: 2, name: 'Sales Bot', status: 'paused' },
    { id: 3, name: 'HR Helper', status: 'active' },
  ]);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-sm text-gray-500 mt-1">Welcome back, here's a simple overview.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <MetricCard title="Metric A" value="0" icon={<ChartBarIcon />} />
          <MetricCard title="Metric B" value="0" icon={<UsersIcon />} />
          <MetricCard title="Metric C" value="0" icon={<ChartBarIcon />} />
          <MetricCard title="Metric D" value="0" icon={<UsersIcon />} />
        </div>

        <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-white rounded-xl shadow-md overflow-hidden">
            <div className="p-6">
              <h2 className="text-lg font-semibold text-gray-900">Analytics</h2>
            </div>
            <div className="p-6 border-t border-gray-100">
              <Suspense fallback={<div className="text-center text-gray-500">Loading analytics...</div>}>
                <Analytics />
              </Suspense>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md">
            <div className="p-6">
              <h2 className="text-lg font-semibold text-gray-900">Your Agents</h2>
            </div>
            <div className="border-t border-gray-100">
              {agents.length === 0 ? (
                <p className="text-sm text-gray-500 p-6">No agents created yet.</p>
              ) : (
                <ul className="divide-y divide-gray-100">
                  {agents.map((agent) => (
                    <li key={agent.id} className="p-4 flex items-center justify-between">
                      <div className="flex flex-col">
                        <span className="font-medium text-gray-800">{agent.name}</span>
                      </div>
                      <div className="flex items-center space-x-4">
                        <StatusBadge status={agent.status} />
                        <button
                          onClick={() => onEditAgent?.(agent)}
                          className="p-2 text-gray-500 hover:text-indigo-600 hover:bg-indigo-100 rounded-full transition-colors"
                        >
                          <EditIcon />
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
