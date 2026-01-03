import React, { useState, useEffect } from 'react';
import { api } from '../services/api';

import {
  ForecastResponse,
  RFMResponse,
  RFMSegmentData,
  YearlyRevenue,
  MoMGrowth,
  PendingMonthly,
  TopCustomers,
  ProductAnalyticsResponse,
  DeliveryPerformanceMetrics,
  DeliveryDistribution,
  ScatterData,
  HeatmapData,
  ExpectedScheduleData
} from '../types';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  Area,
  AreaChart,
  ComposedChart,
  BarChart,
  Bar,
  ScatterChart,
  Scatter,
  ZAxis
} from 'recharts';
import {
  Sparkles,
  Users,
  TrendingUp,
  AlertCircle,
  Crown,
  Heart,
  UserCheck,
  UserMinus,
  DollarSign,
  Activity,
  Package,
  Truck,
  Calendar as CalendarIcon,
  Box,
  PieChart,
  Search,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

const Analytics: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'revenue' | 'operations' | 'forecast' | 'customers'>('revenue');

  // Year State for Revenue Tab
  const [yearly, setYearly] = useState<YearlyRevenue | null>(null);
  const [mom, setMom] = useState<MoMGrowth | null>(null);
  const [pending, setPending] = useState<PendingMonthly | null>(null);
  const [products, setProducts] = useState<ProductAnalyticsResponse | null>(null);
  const [scatter, setScatter] = useState<ScatterData[] | null>(null);

  // Operations State
  const [delMetrics, setDelMetrics] = useState<DeliveryPerformanceMetrics | null>(null);
  const [delDist, setDelDist] = useState<DeliveryDistribution[] | null>(null);
  const [schedule, setSchedule] = useState<ExpectedScheduleData[] | null>(null);

  // Forecast State
  const [forecast, setForecast] = useState<ForecastResponse | null>(null);

  // Customer State
  const [rfm, setRfm] = useState<RFMResponse | null>(null);
  const [topCust, setTopCust] = useState<TopCustomers | null>(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async (signal: AbortSignal) => {
    // CRITICAL: Reset all data states immediately to prevent stale data rendering
    // and show loading spinner while fetching new data.
    setLoading(true);
    setYearly(null);
    setMom(null);
    setPending(null);
    setProducts(null);
    setScatter(null);
    setDelMetrics(null);
    setDelDist(null);
    setSchedule(null);
    setForecast(null);
    setRfm(null);
    setTopCust(null);

    setError(null);

    try {
      if (activeTab === 'revenue') {
        const [yData, mData, pData, prodData, scatData] = await Promise.all([
          api.get<YearlyRevenue>('/analytics/revenue/yearly', signal),
          api.get<MoMGrowth>('/analytics/revenue/mom-growth', signal),
          api.get<PendingMonthly>('/analytics/pending/monthly', signal),
          api.get<ProductAnalyticsResponse>('/analytics/products/top', signal),
          api.get<ScatterData[]>('/analytics/charts/scatter-revenue-qty', signal)
        ]);
        if (!signal.aborted) {
          setYearly(yData);
          setMom(mData);
          setPending(pData);
          setProducts(prodData);
          setScatter(scatData);
        }
      }
      else if (activeTab === 'operations') {
        const [metData, distData, schData] = await Promise.all([
          api.get<DeliveryPerformanceMetrics>('/analytics/metrics/delivery-performance', signal),
          api.get<DeliveryDistribution[]>('/analytics/charts/delivery-distribution', signal),
          api.get<ExpectedScheduleData[]>('/analytics/charts/expected-delivery-schedule', signal)
        ]);
        if (!signal.aborted) {
          setDelMetrics(metData);
          setDelDist(distData);
          setSchedule(schData);
        }
      }
      else if (activeTab === 'forecast') {
        const res = await api.get<ForecastResponse>('/analytics/forecast', signal);
        if (!signal.aborted) {
          setForecast(res);
        }
      }
      else if (activeTab === 'customers') {
        const [rfmData, custData] = await Promise.all([
          api.get<RFMResponse>('/analytics/rfm', signal),
          api.get<TopCustomers>('/analytics/orders/top-customers', signal)
        ]);
        if (!signal.aborted) {
          setRfm(rfmData);
          setTopCust(custData);
        }
      }
    } catch (e: any) {
      if (e.name === 'AbortError') {
        console.log('Request cancelled for tab change');
        return;
      }
      console.error(e);
      if (!signal.aborted) {
        setError(e.message || "Failed to load analytics data.");
      }
    } finally {
      if (!signal.aborted) {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    const controller = new AbortController();
    fetchData(controller.signal);
    return () => controller.abort();
  }, [activeTab]);

  // Helpers
  const toChartData = (data: any, keyName: string, valName: string) => {
    if (!data) return [];
    return Object.entries(data).map(([k, v]) => ({ [keyName]: k, [valName]: v }));
  };

  const formatYAxis = (value: number) => {
    if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
    if (value >= 1000) return `${(value / 1000).toFixed(0)}k`;
    return value.toString();
  };

  // Components
  const KpiCard = ({ title, value, sub, icon: Icon, color }: any) => (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-start justify-between hover:shadow-md transition-shadow">
      <div>
        <p className="text-sm font-medium text-slate-500 mb-1">{title}</p>
        <h3 className="text-2xl font-bold text-slate-900">{value}</h3>
        {sub && <p className="text-xs text-slate-400 mt-1">{sub}</p>}
      </div>
      <div className={`p-3 rounded-lg ${color}`}>
        <Icon className="w-5 h-5" />
      </div>
    </div>
  );

  // Calendar Component
  const InteractiveCalendar = () => {
    const [currentDate, setCurrentDate] = useState(new Date());

    if (!schedule) return null;

    // Map data: date string -> quantity
    const scheduleMap = new Map<string, number>();
    schedule.forEach(s => scheduleMap.set(s.date, s.total_quantity));

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay(); // 0=Sun

    const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
    const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

    // Generate grid cells
    const cells = [];
    // Padding
    for (let i = 0; i < startingDayOfWeek; i++) {
      cells.push(<div key={`pad-${i}`} className="h-24 bg-slate-50 border border-slate-100/50"></div>);
    }
    // Days
    for (let d = 1; d <= daysInMonth; d++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      const qty = scheduleMap.get(dateStr) || 0;

      const isToday = new Date().toDateString() === new Date(year, month, d).toDateString();

      cells.push(
        <div
          key={d}
          className={`h-24 border border-slate-100 p-2 relative group transition-all hover:bg-slate-50
                    ${isToday ? 'bg-blue-50/50' : 'bg-white'}
                `}
        >
          <div className={`text-xs font-semibold mb-1 ${isToday ? 'text-blue-600' : 'text-slate-500'}`}>{d}</div>
          {qty > 0 && (
            <div className="flex flex-col gap-1 mt-1">
              <div className={`
                            px-2 py-1 rounded text-xs font-bold text-center shadow-sm
                            ${qty > 100 ? 'bg-indigo-100 text-indigo-700' :
                  qty > 50 ? 'bg-blue-100 text-blue-700' :
                    'bg-sky-100 text-sky-700'}
                        `}>
                {qty} Units
              </div>
              <span className="text-[10px] text-slate-400 text-center">Pending</span>
            </div>
          )}
        </div>
      );
    }

    return (
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-4">
            <h3 className="font-bold text-lg text-slate-800">Expected Delivery Schedule</h3>
            <div className="text-sm font-medium text-slate-500 bg-white px-3 py-1 rounded border border-slate-200 shadow-sm">
              {currentDate.toLocaleDateString('default', { month: 'long', year: 'numeric' })}
            </div>
          </div>
          <div className="flex gap-2">
            <button onClick={prevMonth} className="p-2 hover:bg-slate-200 rounded-full transition-colors text-slate-600">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button onClick={nextMonth} className="p-2 hover:bg-slate-200 rounded-full transition-colors text-slate-600">
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Grid Header */}
        <div className="grid grid-cols-7 bg-slate-100 border-b border-slate-200">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="py-2 text-center text-xs font-bold text-slate-500 uppercase tracking-wider">{day}</div>
          ))}
        </div>

        {/* Grid Body */}
        <div className="grid grid-cols-7">
          {cells}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header & Tabs */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Analytics Dashboard</h1>
          <p className="text-slate-500">Business performance, delivery metrics, and AI forecasts.</p>
        </div>
        <div className="flex bg-white p-1 rounded-lg border border-slate-200 overflow-x-auto">
          {[
            { id: 'revenue', label: 'Revenue & Trends', icon: DollarSign },
            { id: 'operations', label: 'Operations & Delivery', icon: Truck },
            { id: 'forecast', label: 'Forecast & AI', icon: Sparkles },
            { id: 'customers', label: 'Customer Insights', icon: Users }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all whitespace-nowrap ${activeTab === tab.id ? 'bg-brand-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-50'}`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="h-96 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-600"></div>
        </div>
      ) : error ? (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-8 text-center text-amber-800">
          <AlertCircle className="w-8 h-8 mx-auto mb-2" />
          <p className="font-medium">Failed to load data</p>
          <p className="text-sm opacity-80">{error}</p>
        </div>
      ) : (
        <div className="animate-in fade-in slide-in-from-bottom-4">

          {/* 1. REVENUE & TRENDS */}
          {activeTab === 'revenue' && yearly && (
            <div className="space-y-6">
              {/* KPIs */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <KpiCard
                  title="Total Revenue (All Time)"
                  value={`₹${Object.values(yearly).reduce((a, b) => a + b, 0).toLocaleString()}`}
                  sub="Based on yearly aggregation"
                  icon={DollarSign}
                  color="bg-emerald-100 text-emerald-600"
                />
                <KpiCard
                  title="Pending Payments"
                  value={`₹${Object.values(pending || {}).reduce((a, b) => a + b, 0).toLocaleString()}`}
                  sub="Total outstanding amount"
                  icon={AlertCircle}
                  color="bg-rose-100 text-rose-600"
                />
                <KpiCard
                  title="Unique Products Sold"
                  value={products?.products.length || 0}
                  sub="Active catalog items"
                  icon={Package}
                  color="bg-indigo-100 text-indigo-600"
                />
              </div>

              {/* Charts Row 1 */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                  <h3 className="font-bold text-lg text-slate-800 mb-4">Revenue Trend (Yearly)</h3>
                  <div className="h-72">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={toChartData(yearly, 'year', 'revenue')}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis dataKey="year" axisLine={false} tickLine={false} />
                        <YAxis axisLine={false} tickLine={false} tickFormatter={formatYAxis} />
                        <Tooltip formatter={(val: number) => `₹${val.toLocaleString()}`} />
                        <Bar dataKey="revenue" fill="#4f46e5" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                  <h3 className="font-bold text-lg text-slate-800 mb-4">MoM Growth Rate</h3>
                  <div className="h-72">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={toChartData(mom, 'month', 'growth')}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis dataKey="month" axisLine={false} tickLine={false} />
                        <YAxis axisLine={false} tickLine={false} />
                        <Tooltip formatter={(val: number) => `${val.toFixed(1)}%`} />
                        <Area type="monotone" dataKey="growth" stroke="#10b981" fill="#d1fae5" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>

              {/* Scatter Plot (Pricing Analysis) */}
              {scatter && (
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-bold text-lg text-slate-800">Pricing Consistency (Volume vs Revenue)</h3>
                    <span className="text-xs text-slate-500 bg-slate-100 px-2 py-1 rounded">
                      Detect outliers (Low Price/High Qty)
                    </span>
                  </div>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                        <CartesianGrid />
                        <XAxis type="number" dataKey="quantity" name="Quantity" unit=" units" />
                        <YAxis type="number" dataKey="revenue" name="Revenue" unit="₹" tickFormatter={formatYAxis} />
                        <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                        <Scatter name="Orders" data={scatter} fill="#8884d8" shape="circle" />
                      </ScatterChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* 2. OPERATIONS & DELIVERY */}
          {activeTab === 'operations' && delMetrics && (
            <div className="space-y-6">
              {/* Metric Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <KpiCard title="Total Orders" value={delMetrics.total_orders} icon={Box} color="bg-blue-100 text-blue-600" />
                <KpiCard title="Total Deliveries" value={delMetrics.total_deliveries} icon={Truck} color="bg-emerald-100 text-emerald-600" />
                <KpiCard title="Units Delivered" value={delMetrics.total_quantity.toLocaleString()} icon={Package} color="bg-purple-100 text-purple-600" />
                <KpiCard title="Amount Received" value={`₹${delMetrics.total_amount.toLocaleString()}`} icon={DollarSign} color="bg-amber-100 text-amber-600" />
              </div>

              {/* Calendar Schedule */}
              <InteractiveCalendar />

              {/* Delivery Size Histogram */}
              <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                <h3 className="font-bold text-lg text-slate-800 mb-4">Delivery Size Distribution</h3>
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={delDist || []}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="range" axisLine={false} tickLine={false} />
                      <YAxis axisLine={false} tickLine={false} />
                      <Tooltip cursor={{ fill: '#f1f5f9' }} />
                      <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} name="Deliveries" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <p className="text-sm text-slate-500 mt-2">
                  Most deliveries are in the <b>{delDist?.sort((a, b) => b.count - a.count)[0]?.range}</b> unit range.
                </p>
              </div>
            </div>
          )}

          {/* 3. FORECAST & AI */}
          {activeTab === 'forecast' && forecast && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <KpiCard title="Model Accuracy (R²)" value={`${(forecast.r2_score * 100).toFixed(1)}%`} sub="Robust Log-Linear Regression" icon={Sparkles} color="bg-purple-100 text-purple-600" />
                <KpiCard title="Next 12 Months" value={`₹${forecast.forecast_12_months.reduce((a, b) => a + b.predicted_revenue, 0).toLocaleString()}`} sub="Total Predicted Revenue" icon={TrendingUp} color="bg-blue-100 text-blue-600" />
                <KpiCard title="Confidence Level" value={forecast.confidence_level} sub="Statistical Certainty" icon={AlertCircle} color="bg-emerald-100 text-emerald-600" />
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                <h3 className="font-bold text-lg text-slate-800 mb-6">Historical vs Forecast (12 Months)</h3>
                <div className="h-96">
                  <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart data={[
                      // Map Historical Data
                      ...(forecast.historical_data || []).map(h => ({
                        month: h.month,
                        Actual: h.revenue,
                        Predicted: null, // Don't show prediction line for history
                        upper_bound: null,
                        lower_bound: null
                      })),
                      // Connecting Point (Last Historical matches First Forecast start? Optional, but good for continuity)
                      // Map Forecast Data
                      ...forecast.forecast_12_months.map(f => ({
                        month: f.month,
                        Actual: null, // Don't show actual line for future
                        Predicted: f.predicted_revenue,
                        upper_bound: f.upper_bound,
                        lower_bound: f.lower_bound
                      }))
                    ]}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="month" axisLine={false} tickLine={false} />
                      <YAxis axisLine={false} tickLine={false} tickFormatter={formatYAxis} />
                      <Tooltip formatter={(val: number) => `₹${val.toLocaleString()}`} />
                      <Legend verticalAlign="top" />

                      {/* Confidence Interval Area */}
                      <Area type="monotone" dataKey="upper_bound" stroke="none" fill="#e9d5ff" fillOpacity={0.3} name="Confidence Interval" />

                      {/* Actual Revenue Line (Solid Blue) */}
                      <Line type="monotone" dataKey="Actual" stroke="#2563eb" strokeWidth={3} dot={{ r: 4 }} name="Actual Revenue" connectNulls={false} />

                      {/* Predicted Revenue Line (Dashed Purple) */}
                      <Line type="monotone" dataKey="Predicted" stroke="#7c3aed" strokeWidth={3} strokeDasharray="5 5" dot={{ r: 4 }} name="AI Prediction" connectNulls={false} />
                    </ComposedChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          )}

          {/* 4. CUSTOMER INSIGHTS */}
          {activeTab === 'customers' && rfm && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Top Customers List */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                  <h3 className="font-bold text-lg text-slate-800 mb-4">Top Customers (Lifetime Value)</h3>
                  <div className="space-y-3 h-80 overflow-y-auto pr-2">
                    {toChartData(topCust?.top_total, 'name', 'revenue').map((c: any, i) => (
                      <div key={i} className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-xs">{i + 1}</div>
                          <span className="font-medium">{c.name}</span>
                        </div>
                        <span className="font-bold">₹{c.revenue.toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* RFM Segments */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                  <h3 className="font-bold text-lg text-slate-800 mb-4">Customer Segments (RFM)</h3>
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    {Object.entries(rfm.segments).map(([key, data]) => (
                      <div key={key} className="p-4 border rounded-lg bg-slate-50 border-slate-100 text-center">
                        <h4 className="font-bold text-slate-700">{key}</h4>
                        <p className="text-3xl font-bold my-2 text-brand-600">{data.count}</p>
                        <p className="text-xs text-slate-500">{data.business_explanation.split('.')[0]}</p>
                      </div>
                    ))}
                  </div>

                </div>
              </div>


              <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                <h3 className="font-bold text-lg text-slate-800 mb-4">Customer Segmentation Details</h3>
                <div className="divide-y divide-slate-100">
                  {Object.entries(rfm.segments).map(([key, data]) => (
                    <div key={key} className="py-4">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-2 h-2 rounded-full bg-brand-500"></div>
                        <h4 className="font-semibold text-slate-800">{key}</h4>
                        <span className="px-2 py-0.5 bg-slate-100 text-slate-600 text-xs rounded-full">{data.count} Customers</span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {data.customers.slice(0, 15).map((cust, i) => (
                          <span key={i} className="text-xs px-2 py-1 bg-white border border-slate-200 rounded text-slate-600">
                            {cust}
                          </span>
                        ))}
                        {data.customers.length > 15 && (
                          <span className="text-xs px-2 py-1 bg-slate-100 text-slate-500 rounded">+{data.customers.length - 15} more</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Analytics;

