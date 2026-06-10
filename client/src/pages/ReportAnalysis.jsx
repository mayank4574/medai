import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FileText, ChevronRight, Search, Filter, Trash2, Calendar, AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';
import { getReports, deleteReport } from '../services/api';

const getStatusBadge = (status) => {
  if (status === 'urgent') return { bg: 'bg-red-100', text: 'text-red-700', label: 'Urgent' };
  if (status === 'attention') return { bg: 'bg-yellow-100', text: 'text-yellow-700', label: 'Attention' };
  return { bg: 'bg-green-100', text: 'text-green-700', label: 'Normal' };
};

const getReportTypeIcon = (type) => {
  const colors = {
    blood: 'bg-red-50 text-red-500',
    cbc: 'bg-blue-50 text-blue-500',
    liver: 'bg-amber-50 text-amber-600',
    kidney: 'bg-purple-50 text-purple-500',
    thyroid: 'bg-cyan-50 text-cyan-600',
    lipid: 'bg-orange-50 text-orange-500',
    diabetes: 'bg-pink-50 text-pink-500',
    urine: 'bg-yellow-50 text-yellow-600',
    other: 'bg-slate-50 text-slate-500'
  };
  return colors[type] || colors.other;
};

export default function ReportAnalysis() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const res = await getReports();
      setReports(res.data);
    } catch (err) {
      console.error('Failed to fetch reports:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, e) => {
    e.preventDefault();
    e.stopPropagation();
    if (window.confirm('Delete this report?')) {
      try {
        await deleteReport(id);
        setReports(prev => prev.filter(r => r._id !== id));
      } catch (err) {
        console.error('Failed to delete:', err);
      }
    }
  };

  // Filter & search
  const filteredReports = reports.filter(r => {
    const matchSearch = searchQuery === '' || 
      r.reportType?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.labName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.familyMemberName?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchStatus = filterStatus === 'all' || r.overallStatus === filterStatus;
    return matchSearch && matchStatus;
  });

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
        <Loader2 size={32} className="text-primary animate-spin" />
        <p className="text-slate-500 font-medium">Loading reports...</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto pb-10">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Your Reports</h1>
          <p className="text-slate-600 text-sm">
            {reports.length} total reports analyzed by MedScanAI
          </p>
        </div>
        <Link 
          to="/upload"
          className="flex items-center gap-2 bg-primary hover:bg-primary-hover text-white px-5 py-2.5 rounded-lg text-sm font-medium transition-all cursor-pointer hover:shadow-lg"
        >
          + Upload New Report
        </Link>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 mb-6 shadow-sm flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search reports by type, lab name, or member..."
            className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:bg-white transition-all"
          />
        </div>
        <div className="flex gap-2">
          {['all', 'normal', 'attention', 'urgent'].map(status => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wide transition-all cursor-pointer ${
                filterStatus === status
                  ? 'bg-primary text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {status === 'all' ? 'All' : status}
            </button>
          ))}
        </div>
      </div>

      {/* Reports List */}
      {filteredReports.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-16 text-center shadow-sm">
          <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4">
            <FileText size={28} className="text-slate-400" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 mb-2">
            {reports.length === 0 ? 'No reports yet' : 'No matching reports'}
          </h3>
          <p className="text-sm text-slate-500 mb-6">
            {reports.length === 0 
              ? 'Upload your first medical report to get AI-powered insights.' 
              : 'Try adjusting your search or filter criteria.'}
          </p>
          {reports.length === 0 && (
            <Link 
              to="/upload"
              className="inline-flex items-center gap-2 bg-primary hover:bg-primary-hover text-white px-6 py-3 rounded-lg text-sm font-medium transition-all cursor-pointer"
            >
              Upload Your First Report
            </Link>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredReports.map(report => {
            const badge = getStatusBadge(report.overallStatus);
            const iconColor = getReportTypeIcon(report.reportType);
            const abnormalCount = report.labValues?.filter(v => v.status !== 'normal').length || 0;
            const totalCount = report.labValues?.length || 0;

            return (
              <Link 
                key={report._id} 
                to={`/reports/${report._id}`}
                className="block bg-white rounded-xl border border-slate-200 p-5 shadow-sm hover:shadow-md hover:border-[#00a3e0]/50 transition-all cursor-pointer group"
              >
                <div className="flex items-center gap-5">
                  {/* Icon */}
                  <div className={`w-14 h-14 rounded-xl flex items-center justify-center shrink-0 ${iconColor}`}>
                    <FileText size={24} />
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="text-base font-bold text-slate-900 truncate">
                        {report.reportType?.charAt(0).toUpperCase() + report.reportType?.slice(1)} Report
                      </h3>
                      <span className={`px-2 py-0.5 rounded text-xs font-bold ${badge.bg} ${badge.text}`}>
                        {badge.label}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-slate-500 font-medium">
                      <span className="flex items-center gap-1">
                        <Calendar size={12} />
                        {report.reportDate ? new Date(report.reportDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : 'N/A'}
                      </span>
                      <span>{report.labName || 'Lab'}</span>
                      <span>{report.familyMemberName || 'Self'}</span>
                      <span className="flex items-center gap-1">
                        {abnormalCount > 0 ? (
                          <><AlertCircle size={12} className="text-orange-500" /> {abnormalCount} flagged</>
                        ) : (
                          <><CheckCircle2 size={12} className="text-green-500" /> All normal</>
                        )}
                      </span>
                      <span className="text-slate-400">{totalCount} tests</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-3 shrink-0">
                    <button 
                      onClick={(e) => handleDelete(report._id, e)}
                      className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all cursor-pointer opacity-0 group-hover:opacity-100"
                      title="Delete"
                    >
                      <Trash2 size={16} />
                    </button>
                    <ChevronRight size={18} className="text-slate-400 group-hover:text-primary group-hover:translate-x-1 transition-all" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
