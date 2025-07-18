'use client'

import { useEffect, useState, useMemo } from 'react'
import { db } from '../../lib/firebase'
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore'
import { 
  Globe2, 
  User2, 
  CalendarDays, 
  AlertCircle, 
  Shield, 
  TrendingUp, 
  Activity,
  Search,
  Filter,
  Download
} from 'lucide-react'
import { Bar, Doughnut } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js'

ChartJS.register(
  CategoryScale, 
  LinearScale, 
  BarElement, 
  Tooltip, 
  Legend, 
  ArcElement
)

interface Report {
  id: string
  url: string
  reporterEmail?: string
  scamType?: string
  description?: string
  imageUrl?: string
  createdAt?: {
    toDate: () => Date
  }
}

export default function DashboardPage() {
  const [reports, setReports] = useState<Report[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedFilter, setSelectedFilter] = useState('all')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const q = query(collection(db, 'reports'), orderBy('createdAt', 'desc'))
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ 
        id: doc.id, 
        ...doc.data() 
      } as Report))
      setReports(data)
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  // Enhanced analytics
  const analytics = useMemo(() => {
    const totalReports = reports.length
    const scamTypeCounts = reports.reduce((acc: Record<string, number>, report) => {
      const type = report.scamType || 'Unknown'
      acc[type] = (acc[type] || 0) + 1
      return acc
    }, {})

    const last7Days = new Date()
    last7Days.setDate(last7Days.getDate() - 7)
    
    const recentReports = reports.filter(r => 
      r.createdAt?.toDate && r.createdAt.toDate() > last7Days
    ).length

    const topScamType = Object.entries(scamTypeCounts)
      .sort(([,a], [,b]) => b - a)[0]?.[0] || 'None'

    return {
      totalReports,
      scamTypeCounts,
      recentReports,
      topScamType
    }
  }, [reports])

  // Filtered reports
  const filteredReports = useMemo(() => {
    return reports.filter(report => {
      const matchesSearch = 
        report.url.toLowerCase().includes(searchTerm.toLowerCase()) ||
        report.reporterEmail?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        report.description?.toLowerCase().includes(searchTerm.toLowerCase())
      
      const matchesFilter = 
        selectedFilter === 'all' || 
        report.scamType === selectedFilter

      return matchesSearch && matchesFilter
    })
  }, [reports, searchTerm, selectedFilter])

  const chartData = {
    labels: Object.keys(analytics.scamTypeCounts),
    datasets: [
      {
        label: 'Reports by Type',
        data: Object.values(analytics.scamTypeCounts),
        backgroundColor: [
          'rgba(6, 182, 212, 0.8)',   // cyan
          'rgba(251, 146, 60, 0.8)',  // orange
          'rgba(34, 197, 94, 0.8)',   // green
          'rgba(168, 85, 247, 0.8)',  // purple
          'rgba(239, 68, 68, 0.8)',   // red
          'rgba(245, 158, 11, 0.8)',  // yellow
        ],
        borderRadius: 8,
        borderWidth: 2,
        borderColor: 'rgba(255, 255, 255, 0.1)',
      },
    ],
  }

  const doughnutData = {
    labels: Object.keys(analytics.scamTypeCounts),
    datasets: [
      {
        data: Object.values(analytics.scamTypeCounts),
        backgroundColor: [
          'rgba(6, 182, 212, 0.8)',
          'rgba(251, 146, 60, 0.8)',
          'rgba(34, 197, 94, 0.8)',
          'rgba(168, 85, 247, 0.8)',
          'rgba(239, 68, 68, 0.8)',
          'rgba(245, 158, 11, 0.8)',
        ],
        borderWidth: 0,
      },
    ],
  }

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: {
          color: '#fff',
          font: { size: 12 },
          padding: 20,
        },
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#06b6d4',
        bodyColor: '#fff',
        borderColor: '#06b6d4',
        borderWidth: 1,
      },
    },
    scales: {
      x: {
        ticks: { color: '#ccc', font: { size: 11 } },
        grid: { color: 'rgba(255, 255, 255, 0.1)' },
      },
      y: {
        ticks: { color: '#ccc', font: { size: 11 } },
        grid: { color: 'rgba(255, 255, 255, 0.1)' },
      },
    },
  }

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          color: '#fff',
          font: { size: 11 },
          padding: 15,
        },
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#06b6d4',
        bodyColor: '#fff',
      },
    },
  }

  const uniqueScamTypes = ['all', ...Array.from(new Set(reports.map(r => r.scamType).filter(Boolean)))]

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto py-20 px-4">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400"></div>
          <span className="ml-3 text-cyan-400">Loading dashboard...</span>
        </div>
      </div>
    )
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
