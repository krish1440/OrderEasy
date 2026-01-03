import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { CurrentMonthMetrics, DashboardSummary } from '../types';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  AreaChart,
  Area
} from 'recharts';
import { ArrowUpRight, CheckCircle, Clock, Package, DollarSign } from 'lucide-react';
import DashboardSkeleton from '../components/skeletons/DashboardSkeleton';

const StatCard = ({ title, value, subtext, icon: Icon, color }: any) => (
  <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group">
    <div className="flex justify-between items-start">
      <div>
        <p className="text-sm font-medium text-slate-500">{title}</p>
        <h3 className="text-2xl font-bold text-slate-800 mt-2">{value}</h3>
      </div>
      <div className={`p-3 rounded-lg ${color} transition-transform duration-300 group-hover:scale-110`}>
        <Icon className="w-6 h-6 text-white" />
      </div>
    </div>
    {subtext && <p className="text-xs text-slate-400 mt-4">{subtext}</p>}
  </div>
);

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [currentMonth, setCurrentMonth] = useState<CurrentMonthMetrics | null>(null);
  const [revenueData, setRevenueData] = useState<any[]>([]);
  const [statusDist, setStatusDist] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [sumRes, monthRes, revRes, statusRes] = await Promise.all([
          api.get<DashboardSummary>('/analytics/summary'),
          api.get<CurrentMonthMetrics>('/analytics/dashboard/current-month'),
          api.get<Record<string, number>>('/analytics/revenue/monthly'),
          api.get<Record<string, number>>('/analytics/orders/status-distribution')
        ]);

        setSummary(sumRes);
        setCurrentMonth(monthRes);

        // Transform Revenue Map to Array
        const revArray = Object.entries(revRes).map(([date, amount]) => ({
          name: date,
          amount: amount
        }));
        setRevenueData(revArray);

        // Transform Status Map to Array
        const statusArray = Object.entries(statusRes).map(([status, count]) => ({
          name: status,
          value: count
        }));
        setStatusDist(statusArray);

      } catch (error) {
        console.error("Dashboard fetch error", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);



  if (loading) return <DashboardSkeleton />;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Dashboard Overview</h1>
        <p className="text-slate-500">Welcome back, here's what's happening with your orders.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-fade-in-up delay-200">
        <StatCard
          title="Total Orders"
          value={summary?.total_orders}
          subtext={`${currentMonth?.total_orders} this month`}
          icon={Package}
          color="bg-indigo-500"
        />
        <StatCard
          title="Completed"
          value={summary?.completed_orders}
          subtext={`${currentMonth?.completed_orders} this month`}
          icon={CheckCircle}
          color="bg-emerald-500"
        />
        <StatCard
          title="Pending"
          value={summary?.pending_orders}
          subtext={`${currentMonth?.pending_orders} this month`}
          icon={Clock}
          color="bg-amber-500"
        />
        <StatCard
          title="Units Delivered"
          value={summary?.total_units_delivered}
          subtext={`${currentMonth?.units_delivered} this month`}
          icon={ArrowUpRight}
          color="bg-brand-500"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-fade-in-up delay-300">
        {/* Revenue Trend - Takes up 2 columns */}
        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-bold text-slate-800">Revenue Trend</h2>
            <button
              className="text-sm text-brand-600 font-medium hover:text-brand-700"
              onClick={() => navigate('/analytics')}
            >
              View Report
            </button>
          </div>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueData}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#7c3aed" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#7c3aed" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b' }} />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#64748b' }}
                  tickFormatter={(value) => {
                    if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
                    if (value >= 1000) return `${(value / 1000).toFixed(0)}k`;
                    return value;
                  }}
                  width={60}
                />
                <Tooltip
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Area type="monotone" dataKey="amount" stroke="#7c3aed" strokeWidth={2} fillOpacity={1} fill="url(#colorRevenue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Status Distribution - Takes up 1 column */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <h2 className="text-lg font-bold text-slate-800 mb-6">Order Status</h2>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={statusDist}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip cursor={{ fill: 'transparent' }} />
                <Bar dataKey="value" fill="#8b5cf6" radius={[4, 4, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;