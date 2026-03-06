import React, { useState, useMemo } from 'react';
import { Search, Crown, Heart, UserCheck, AlertCircle, ChevronDown, ChevronUp, Users } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { RFMSegmentData } from '../types';

interface Props {
  segments: { [key: string]: RFMSegmentData };
}

export const CustomerSegmentationDetails: React.FC<Props> = ({ segments }) => {
  const [expandedSegment, setExpandedSegment] = useState<string | null>(Object.keys(segments)[0] || null);
  const [searchQuery, setSearchQuery] = useState('');

  const getSegmentConfig = (key: string) => {
    const lowerKey = key.toLowerCase();
    if (lowerKey.includes('vip')) return { icon: Crown, color: 'text-amber-500', bg: 'bg-amber-50', border: 'border-amber-200', activeBg: 'bg-amber-100', dot: 'bg-amber-400' };
    if (lowerKey.includes('loyal')) return { icon: Heart, color: 'text-rose-500', bg: 'bg-rose-50', border: 'border-rose-200', activeBg: 'bg-rose-100', dot: 'bg-rose-400' };
    if (lowerKey.includes('occasional')) return { icon: UserCheck, color: 'text-blue-500', bg: 'bg-blue-50', border: 'border-blue-200', activeBg: 'bg-blue-100', dot: 'bg-blue-400' };
    if (lowerKey.includes('risk')) return { icon: AlertCircle, color: 'text-red-500', bg: 'bg-red-50', border: 'border-red-200', activeBg: 'bg-red-100', dot: 'bg-red-400' };
    return { icon: Users, color: 'text-slate-500', bg: 'bg-slate-50', border: 'border-slate-200', activeBg: 'bg-slate-100', dot: 'bg-slate-400' };
  };

  const filteredSegments = useMemo(() => {
    if (!searchQuery.trim()) return segments;
    
    const query = searchQuery.toLowerCase();
    const result: { [key: string]: RFMSegmentData } = {};
    
    Object.entries(segments).forEach(([key, data]) => {
      const filteredCustomers = data.customers.filter(c => c.toLowerCase().includes(query));
      if (filteredCustomers.length > 0 || key.toLowerCase().includes(query)) {
        result[key] = {
          ...data,
          customers: filteredCustomers
        };
      }
    });
    
    return result;
  }, [segments, searchQuery]);

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h3 className="font-bold text-lg text-slate-800">Customer Segmentation Details</h3>
          <p className="text-sm text-slate-500">Deep dive into your AI-driven customer groups</p>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search customers..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all w-full md:w-64"
          />
        </div>
      </div>

      <div className="space-y-3">
        {Object.entries(filteredSegments).length === 0 ? (
          <div className="text-center py-8 text-slate-500">
            No customers found matching "{searchQuery}"
          </div>
        ) : (
          Object.entries(filteredSegments).map(([key, data]) => {
            const isExpanded = expandedSegment === key;
            const config = getSegmentConfig(key);
            const Icon = config.icon;

            return (
              <div 
                key={key} 
                className={`border rounded-xl overflow-hidden transition-all duration-200 ${isExpanded ? config.border : 'border-slate-100'}`}
              >
                <button
                  onClick={() => setExpandedSegment(isExpanded ? null : key)}
                  className={`w-full flex items-center justify-between p-4 transition-colors hover:${config.activeBg} ${isExpanded ? config.activeBg : 'bg-white'}`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`p-2 rounded-lg ${config.bg} ${config.color}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="text-left w-full max-w-[200px] md:max-w-md">
                      <h4 className="font-semibold text-slate-800">{key}</h4>
                      <p className="text-xs text-slate-500 line-clamp-1 truncate">{data.business_explanation}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className={`px-2.5 py-1 text-xs font-semibold rounded-full hidden sm:block ${config.bg} ${config.color}`}>
                      {data.count} Customers
                    </span>
                    <span className={`sm:hidden px-2 py-1 text-xs font-semibold rounded-full ${config.bg} ${config.color}`}>
                      {data.count}
                    </span>
                    {isExpanded ? <ChevronUp className="w-5 h-5 text-slate-400" /> : <ChevronDown className="w-5 h-5 text-slate-400" />}
                  </div>
                </button>

                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="p-4 bg-slate-50 border-t border-slate-100">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                          {data.customers.map((cust, i) => (
                            <div 
                              key={i} 
                              className="flex items-center gap-2 p-2 bg-white rounded-lg border border-slate-100 shadow-sm hover:shadow-md transition-shadow hover:border-slate-200 group"
                            >
                              <div className={`w-1.5 h-1.5 rounded-full ${config.dot}`}></div>
                              <span className="text-sm text-slate-700 truncate group-hover:text-slate-900" title={cust}>
                                {cust}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
