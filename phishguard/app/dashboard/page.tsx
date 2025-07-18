'use client'

import { useEffect, useState } from 'react'
import { db } from '../../lib/firebase'
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore'
import { Globe2, User2, CalendarDays, AlertCircle } from 'lucide-react'
import { Bar } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from 'chart.js'

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend)

export default function DashboardPage() {
  const [reports, setReports] = useState<any[]>([])

  useEffect(() => {
    const q = query(collection(db, 'reports'), orderBy('createdAt', 'desc'))
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
      setReports(data)
    })

    return () => unsubscribe()
  }, [])

  // Count scam types for chart
  const scamTypeCounts = reports.reduce((acc: Record<string, number>, report) => {
    const type = report.scamType || 'Unknown'
    acc[type] = (acc[type] || 0) + 1
    return acc
  }, {})

  const chartData = {
    labels: Object.keys(scamTypeCounts),
    datasets: [
      {
        label: 'Reports per Scam Type',
        data: Object.values(scamTypeCounts),
        backgroundColor: 'rgba(6, 182, 212, 0.8)', // cyan
        borderRadius: 6,
      },
    ],
  }

  const chartOptions = {
    plugins: {
      legend: {
        labels: {
          color: '#fff',
        },
      },
    },
    scales: {
      x: {
        ticks: { color: '#ccc' },
        grid: { color: '#333' },
      },
      y: {
        ticks: { color: '#ccc' },
        grid: { color: '#333' },
      },
    },
  }

  return (
    <div className="max-w-6xl mx-auto py-20 px-4">
      <h2 className="text-4xl font-bold text-center text-cyan-400 mb-10 tracking-tight">
        ⚠️ Real-Time Scam Reports
      </h2>

      {/* Chart */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6 mb-12">
        <Bar data={chartData} options={chartOptions} />
      </div>

      {/* Reports */}
      <div className="grid gap-6">
        {reports.map((r) => (
          <div
            key={r.id}
            className="bg-zinc-900 border border-zinc-800 rounded-lg p-6 shadow-md hover:shadow-cyan-500/20 transition-all duration-200 transform hover:scale-[1.01]"
          >
            {/* URL */}
            <div className="flex items-center gap-2 text-cyan-400 font-semibold mb-2">
              <Globe2 className="w-4 h-4" />
              <span className="truncate">{r.url}</span>
            </div>

            {/* Reporter Email */}
            <div className="flex items-center gap-2 text-zinc-300 mb-1">
              <User2 className="w-4 h-4 text-cyan-500" />
              <span>{r.reporterEmail || 'Anonymous'}</span>
            </div>

            {/* Date */}
            <div className="flex items-center gap-2 text-zinc-400 text-sm mb-1">
              <CalendarDays className="w-4 h-4 text-cyan-500" />
              <span>
                {r.createdAt?.toDate
                  ? new Date(r.createdAt.toDate()).toLocaleString()
                  : 'Unknown'}
              </span>
            </div>

            {/* Scam Type */}
            {r.scamType && (
              <div className="flex items-center gap-2 text-orange-400 text-sm mb-1">
                <AlertCircle className="w-4 h-4" />
                <span>{r.scamType}</span>
              </div>
            )}

            {/* Description */}
            {r.description && (
              <div className="mt-2 text-zinc-300 text-sm">
                <p className="italic">“{r.description}”</p>
              </div>
            )}

            {/* Image Preview */}
            {r.imageUrl && (
              <div className="mt-4">
                <img
                  src={r.imageUrl}
                  alt="Reported screenshot"
                  className="w-full max-h-64 object-cover rounded border border-zinc-800 shadow"
                />
              </div>
            )}
          </div>
        ))}
      </div>

      {reports.length === 0 && (
        <p className="text-center text-zinc-500 mt-10 animate-pulse">
          No scam reports yet... you're safe for now 🛡️
        </p>
      )}
    </div>
  )
}
