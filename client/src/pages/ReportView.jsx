import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Share2, Download, ClipboardList, Info, ChevronRight, Stethoscope, Clock, ShieldCheck, Activity, ArrowLeft, Trash2, Loader2, AlertTriangle, Search, CheckCircle } from 'lucide-react';
import { getReport, deleteReport } from '../services/api';
import ParameterTooltip from '../components/ParameterTooltip';
import { generateReportPDF } from '../utils/pdfGenerator';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

// Color/status helpers
const getStatusColor = (status) => {
  if (status === 'critical') return { bg: 'bg-red-50', text: 'text-red-600', dot: 'bg-red-500', border: '#ef4444' };
  if (status === 'borderline') return { bg: 'bg-orange-50', text: 'text-orange-500', dot: 'bg-orange-500', border: '#f97316' };
  return { bg: 'bg-green-50', text: 'text-green-600', dot: 'bg-green-500', border: '#22c55e' };
};

const getStatusLabel = (status) => {
  if (status === 'critical') return 'High';
  if (status === 'borderline') return 'Borderline';
  return 'Normal';
};

const getOverallBadge = (status) => {
  if (status === 'urgent') return { bg: 'bg-red-100', text: 'text-red-700', label: 'URGENT' };
  if (status === 'attention') return { bg: 'bg-yellow-100', text: 'text-yellow-700', label: 'ATTENTION' };
  return { bg: 'bg-green-100', text: 'text-green-700', label: 'NORMAL' };
};

export default function ReportView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const res = await getReport(id);
        setReport(res.data);
      } catch (err) {
        setError('Report not found or failed to load.');
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchReport();
  }, [id]);

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this report?')) {
      try {
        await deleteReport(id);
        navigate('/reports');
      } catch (err) {
        setError('Failed to delete report');
      }
    }
  };

  const handleDownloadPDF = async () => {
    if (!report) return;
    try {
      setIsGeneratingPdf(true);
      const loadingToast = toast.loading('Generating your PDF report...');
      
      // Delay slightly to ensure UI is ready
      await new Promise(resolve => setTimeout(resolve, 500));
      
      await generateReportPDF(report, user);
      
      toast.success('PDF downloaded successfully!', { id: loadingToast });
    } catch (err) {
      console.error(err);
      toast.error('Failed to generate PDF. Please try again.');
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
        <Loader2 size={32} className="text-primary animate-spin" />
        <p className="text-slate-500 font-medium">Loading report analysis...</p>
      </div>
    );
  }

  if (error || !report) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
        <p className="text-red-500 font-medium">{error || 'Report not found'}</p>
        <Link to="/reports" className="text-primary font-semibold hover:underline cursor-pointer">← Back to Reports</Link>
      </div>
    );
  }

  const badge = getOverallBadge(report.overallStatus);
  const abnormalValues = report.labValues?.filter(v => v.status !== 'normal') || [];
  const normalValues = report.labValues?.filter(v => v.status === 'normal') || [];
  const categories = [...new Set(report.labValues?.map(v => v.category) || [])];

  return (
    <div className="max-w-6xl mx-auto pb-10">
      {/* Breadcrumb */}
      <div className="text-xs font-semibold text-slate-500 mb-4 flex items-center gap-1">
        <Link to="/reports" className="hover:text-primary cursor-pointer">Reports</Link>
        <ChevronRight size={12} />
        <span className="text-slate-900">Analysis</span>
      </div>

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl font-bold text-slate-900">
              {report.reportType?.charAt(0).toUpperCase() + report.reportType?.slice(1)} Report
            </h1>
            <span className={`px-2.5 py-1 rounded text-xs font-bold uppercase tracking-wider ${badge.bg} ${badge.text}`}>
              {badge.label}
            </span>
          </div>
          <p className="text-slate-600 text-sm font-medium">
            Lab: <span className="text-slate-900 font-semibold">{report.labName || 'Unknown Lab'}</span> •
            Date: <span className="text-slate-900 font-semibold">{report.reportDate ? new Date(report.reportDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : 'N/A'}</span> •
            For: <span className="text-slate-900 font-semibold">{report.familyMemberName || 'Self'}</span>
          </p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={() => navigate('/reports')}
            className="flex items-center gap-2 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 px-4 py-2 rounded-lg text-sm font-medium transition-all cursor-pointer"
          >
            <ArrowLeft size={16} /> Back
          </button>
          <button 
            onClick={handleDelete}
            className="flex items-center gap-2 bg-white border border-red-200 hover:bg-red-50 text-red-600 px-4 py-2 rounded-lg text-sm font-medium transition-all cursor-pointer"
          >
            <Trash2 size={16} /> Delete
          </button>
          <button 
            onClick={handleDownloadPDF}
            disabled={isGeneratingPdf}
            className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary-hover text-white rounded-lg text-sm font-semibold transition-colors shadow-sm disabled:opacity-70"
          >
            {isGeneratingPdf ? <Loader2 size={16} className="animate-spin" /> : <Download size={16} />}
            {isGeneratingPdf ? 'Generating...' : 'PDF Download'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Stats Summary */}
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-white rounded-xl border border-slate-200 p-4 text-center shadow-sm">
              <p className="text-2xl font-bold text-slate-900">{report.labValues?.length || 0}</p>
              <p className="text-xs text-slate-500 font-medium mt-1">Total Metrics</p>
            </div>
            <div className="bg-white rounded-xl border border-green-100 p-4 text-center shadow-sm">
              <p className="text-2xl font-bold text-green-600">{normalValues.length}</p>
              <p className="text-xs text-slate-500 font-medium mt-1">Normal</p>
            </div>
            <div className="bg-white rounded-xl border border-red-100 p-4 text-center shadow-sm">
              <p className="text-2xl font-bold text-red-500">{abnormalValues.length}</p>
              <p className="text-xs text-slate-500 font-medium mt-1">Attention Needed</p>
            </div>
          </div>

          {/* Lab Values Table - Grouped by Category */}
          {categories.map(category => {
            const categoryValues = report.labValues.filter(v => v.category === category);
            return (
              <div key={category} className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
                <div className="px-6 py-4 border-b border-slate-200 flex justify-between items-center bg-slate-50">
                  <h3 className="text-lg font-bold text-slate-900">{category} Panel</h3>
                  <span className="bg-blue-100 text-primary px-2 py-1 rounded text-xs font-bold uppercase tracking-wider">
                    {categoryValues.length} Tests
                  </span>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left text-slate-600">
                    <thead className="text-xs text-slate-500 uppercase bg-slate-50/50 border-b border-slate-200">
                      <tr>
                        <th className="px-6 py-3 font-semibold">Metric Name</th>
                        <th className="px-6 py-3 font-semibold">Your Value</th>
                        <th className="px-6 py-3 font-semibold">Reference Range</th>
                        <th className="px-6 py-3 font-semibold">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {categoryValues.map((row, idx) => {
                        const colors = getStatusColor(row.status);
                        return (
                          <tr key={idx} className="hover:bg-slate-50 transition-colors group">
                            <td className="px-6 py-4 font-medium text-slate-900 border-l-4" 
                                style={{ borderLeftColor: colors.border }}>
                              <ParameterTooltip row={row} language={report.summaryLanguage}>
                                <span>{row.name}</span>
                              </ParameterTooltip>
                            </td>
                            <td className={`px-6 py-4 font-semibold ${colors.text}`}>
                              {row.value} {row.unit}
                            </td>
                            <td className="px-6 py-4 text-slate-500">{row.referenceMin} - {row.referenceMax} {row.unit}</td>
                            <td className="px-6 py-4">
                              <span className="flex items-center gap-1.5 font-semibold text-xs">
                                <div className={`w-2 h-2 rounded-full ${colors.dot}`}></div>
                                {getStatusLabel(row.status)}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            );
          })}

          {/* Clinical Guidance / Doctor's Recommendation */}
          {report.clinicalGuidance ? (
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm mb-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                  <Stethoscope size={24} className="text-primary" /> Clinical Guidance
                </h3>
                {report.clinicalGuidance.urgencyLevel && (
                  <span className={`px-3 py-1 text-xs font-bold uppercase rounded-full ${
                    report.clinicalGuidance.urgencyLevel === 'Urgent Review' ? 'bg-red-100 text-red-700' :
                    report.clinicalGuidance.urgencyLevel === 'Consult Doctor' ? 'bg-orange-100 text-orange-700' :
                    report.clinicalGuidance.urgencyLevel === 'Monitor' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-green-100 text-green-700'
                  }`}>
                    {report.clinicalGuidance.urgencyLevel}
                  </span>
                )}
              </div>

              {/* Key Findings */}
              {report.clinicalGuidance.findings && report.clinicalGuidance.findings.length > 0 && (
                <div className="mb-6">
                  <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-3">Key Findings</h4>
                  <div className="overflow-hidden rounded-lg border border-slate-200 overflow-x-auto">
                    <table className="w-full text-left text-sm min-w-[500px]">
                      <thead className="bg-slate-50 text-slate-500">
                        <tr>
                          <th className="px-4 py-2 font-medium">Parameter</th>
                          <th className="px-4 py-2 font-medium">Value</th>
                          <th className="px-4 py-2 font-medium">Range</th>
                          <th className="px-4 py-2 font-medium">Severity</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {report.clinicalGuidance.findings.map((finding, idx) => (
                          <tr key={idx}>
                            <td className="px-4 py-3 font-medium text-slate-900">{finding.name}</td>
                            <td className="px-4 py-3 font-bold text-slate-900">{finding.value} {finding.unit}</td>
                            <td className="px-4 py-3 text-slate-500">{finding.referenceRange}</td>
                            <td className="px-4 py-3">
                              <span className={`text-xs font-bold uppercase ${finding.status === 'critical' ? 'text-red-600' : 'text-orange-500'}`}>
                                {finding.status === 'critical' ? 'High' : 'Borderline'}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                {/* Health Concerns */}
                {report.clinicalGuidance.concerns && report.clinicalGuidance.concerns.length > 0 && (
                  <div className="bg-orange-50/50 rounded-xl p-5 border border-orange-100/50 h-full">
                    <h4 className="text-sm font-bold text-orange-900 flex items-center gap-2 mb-3">
                      <AlertTriangle size={16} className="text-orange-500" /> Possible Health Concerns
                    </h4>
                    <ul className="space-y-2">
                      {report.clinicalGuidance.concerns.map((concern, idx) => (
                        <li key={idx} className="text-sm text-orange-800 flex items-start gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-orange-400 mt-1.5 shrink-0" />
                          <span className="leading-relaxed">{concern}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Next Steps */}
                {report.clinicalGuidance.nextSteps && report.clinicalGuidance.nextSteps.length > 0 && (
                  <div className="bg-blue-50/50 rounded-xl p-5 border border-blue-100/50 h-full">
                    <h4 className="text-sm font-bold text-blue-900 flex items-center gap-2 mb-3">
                      <CheckCircle size={16} className="text-blue-500" /> Recommended Next Steps
                    </h4>
                    <ul className="space-y-2">
                      {report.clinicalGuidance.nextSteps.map((step, idx) => (
                        <li key={idx} className="text-sm text-blue-800 flex items-start gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-1.5 shrink-0" />
                          <span className="leading-relaxed">{step}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Recommended Specialist & Action */}
              {report.clinicalGuidance.specialistType && (
                <div className="bg-slate-50 rounded-xl p-5 border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
                  <div>
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Recommended Specialist</p>
                    <p className="text-lg font-bold text-slate-900">{report.clinicalGuidance.specialistType}</p>
                  </div>
                  <button 
                    onClick={() => window.open(`https://www.google.com/search?q=${encodeURIComponent(report.clinicalGuidance.specialistType)}+near+me`, '_blank')}
                    className="w-full sm:w-auto px-5 py-2.5 bg-white border border-slate-300 text-slate-700 hover:bg-slate-100 hover:text-slate-900 rounded-lg text-sm font-semibold transition-colors flex items-center justify-center gap-2 shadow-sm"
                  >
                    <Search size={16} /> Find Nearby Doctors
                  </button>
                </div>
              )}

              {/* Disclaimer */}
              {report.clinicalGuidance.disclaimer && (
                <div className="text-xs text-slate-400 leading-relaxed border-t border-slate-100 pt-4 flex items-start gap-2">
                  <Info size={14} className="shrink-0 mt-0.5" />
                  <p>{report.clinicalGuidance.disclaimer}</p>
                </div>
              )}
            </div>
          ) : report.doctorRecommendation ? (
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm mb-6">
              <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                <ClipboardList size={20} className="text-primary" /> Doctor's Recommendation
              </h3>
              <div className="bg-blue-50 border border-blue-100 rounded-xl p-5">
                <p className="text-sm text-slate-700 leading-relaxed">{report.doctorRecommendation}</p>
              </div>
            </div>
          ) : null}
        </div>

        {/* Right Sidebar */}
        <div className="space-y-6">
          {/* AI Insights Card */}
          <div className="bg-[#1e1e2d] rounded-xl p-6 text-white shadow-lg">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-2 text-[#00a3e0] font-bold">
                <Activity size={18} /> AI Insights
              </div>
              <span className="text-[10px] text-slate-400 uppercase tracking-wider">MedScanAI NLP v4.2</span>
            </div>
            
            <h4 className="text-lg font-bold mb-4">Summary Analysis</h4>
            <div className="space-y-4 text-sm text-slate-300 leading-relaxed">
              <p>{report.summary}</p>
            </div>

            {/* Abnormal values highlights */}
            {abnormalValues.length > 0 && (
              <div className="mt-6 space-y-3">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Flagged Values</p>
                {abnormalValues.map((val, idx) => {
                  const colors = getStatusColor(val.status);
                  return (
                    <div key={idx} className="bg-white/5 rounded-lg p-3 border border-white/10">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-white font-semibold text-sm">{val.name}</span>
                        <span className={`text-xs font-bold ${val.status === 'critical' ? 'text-red-400' : 'text-orange-400'}`}>
                          {val.value} {val.unit}
                        </span>
                      </div>
                      {val.explanation && (
                        <p className="text-xs text-slate-400 leading-relaxed">{val.explanation}</p>
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            <div className="mt-6 flex items-start gap-2 text-xs text-slate-400 bg-white/5 p-3 rounded-lg border border-white/10">
              <Info size={14} className="shrink-0 mt-0.5" />
              <p>AI results are for informational purposes only. Always consult a professional.</p>
            </div>
          </div>

          {/* Recommended Next Steps */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
            <h3 className="text-lg font-bold text-slate-900 mb-6">Recommended Next Steps</h3>
            
            <div className="space-y-6">
              {abnormalValues.length > 0 && (
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-blue-50 text-primary flex items-center justify-center shrink-0">
                    <Stethoscope size={20} />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">Schedule GP Consultation</h4>
                    <p className="text-xs text-slate-500 mt-1 leading-relaxed">Discuss your {abnormalValues.length} flagged values with your doctor.</p>
                  </div>
                </div>
              )}

              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-slate-50 text-slate-500 flex items-center justify-center shrink-0">
                  <Clock size={20} />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">Retest in 3 months</h4>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">Monitor progress on flagged values after lifestyle changes.</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-slate-50 text-slate-500 flex items-center justify-center shrink-0">
                  <ShieldCheck size={20} />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">Review Dietary Guidelines</h4>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">Access MedScanAI's curated health recommendations.</p>
                </div>
              </div>
            </div>

            <Link 
              to="/trends"
              className="w-full mt-6 border border-primary text-primary hover:bg-blue-50 py-2.5 rounded-lg text-sm font-bold transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              View Health Trends
            </Link>
          </div>

          <div className="bg-gradient-to-br from-[#0f172a] to-[#1e293b] rounded-xl overflow-hidden relative h-32 flex flex-col justify-end p-5">
            <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
            <div className="relative z-10 flex flex-col justify-end h-full">
              <h4 className="text-white text-sm font-bold">MedScanAI Certified Analysis • {report.aiModel || 'gemini-2.5-flash'}</h4>
              <p className="text-slate-400 text-xs mt-1">Language: {report.summaryLanguage?.toUpperCase() || 'EN'}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
