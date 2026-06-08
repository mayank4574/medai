import { motion } from 'framer-motion';
import { CheckCircle, AlertTriangle, AlertOctagon, ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';
import ParameterTooltip from './ParameterTooltip';
const statusConfig = {
  normal: { icon: CheckCircle, color: 'text-emerald-500', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', bar: '#10b981', label: 'Normal' },
  borderline: { icon: AlertTriangle, color: 'text-amber-500', bg: 'bg-amber-500/10', border: 'border-amber-500/20', bar: '#f59e0b', label: 'Watch' },
  critical: { icon: AlertOctagon, color: 'text-red-500', bg: 'bg-red-500/10', border: 'border-red-500/20', bar: '#ef4444', label: 'See Doctor' }
};

function LabValueRow({ val, index, language }) {
  const [expanded, setExpanded] = useState(false);
  const config = statusConfig[val.status] || statusConfig.normal;
  const Icon = config.icon;
  const pct = val.referenceMax > val.referenceMin
    ? Math.min(((val.value - val.referenceMin) / (val.referenceMax - val.referenceMin)) * 100, 120)
    : 50;

  return (
    <motion.div
      className={`mb-3 rounded-xl border ${config.bg} ${config.border} overflow-hidden transition-all duration-300 hover:shadow-lg cursor-pointer`}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05 }}
      onClick={() => setExpanded(!expanded)}
    >
      <div className="flex flex-wrap sm:flex-nowrap items-center p-4 gap-3 sm:gap-4 relative">
        <div className={`p-2 rounded-lg shrink-0 ${config.bg} ${config.color}`}>
          <Icon size={20} />
        </div>
        <div className="flex-1 min-w-[120px]">
          <ParameterTooltip row={val} language={language} darkTheme={true}>
            <div className="font-bold text-base sm:text-lg text-white mb-1 w-fit">{val.name}</div>
          </ParameterTooltip>
          <div className="text-xs sm:text-sm text-[#a0a0b8]">
            Ref: {val.referenceMin} - {val.referenceMax} {val.unit}
          </div>
        </div>
        <div className="flex flex-col items-end shrink-0 text-right pr-2 sm:pr-4 border-r border-white/10">
          <span className={`text-xl sm:text-2xl font-bold font-mono ${config.color}`}>{val.value}</span>
          <span className="text-xs text-[#a0a0b8]">{val.unit}</span>
        </div>
        <div className="flex items-center gap-2 sm:gap-4 shrink-0">
          <div className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${config.bg} ${config.color} ${config.border}`}>
            {config.label}
          </div>
          <div className="text-[#a0a0b8] hidden sm:block">
            {expanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </div>
        </div>
      </div>

      {/* Progress bar */}
      <div className="px-4 pb-4">
        <div className="h-1.5 w-full bg-[#1a1a2e] rounded-full relative overflow-hidden">
          <div className="absolute top-0 bottom-0 left-0 rounded-full" style={{ width: `${Math.max(0, Math.min(pct, 100))}%`, background: config.bar }} />
          <div className="absolute top-0 bottom-0 w-1 bg-white shadow-[0_0_5px_white]" style={{ left: `${Math.max(1, Math.min(pct, 99))}%`, transform: 'translateX(-50%)' }} />
        </div>
      </div>

      {expanded && val.explanation && (
        <motion.div
          className="px-4 pb-4 text-sm sm:text-base text-white/80 leading-relaxed border-t border-white/5 pt-3"
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <p>{val.explanation}</p>
        </motion.div>
      )}
    </motion.div>
  );
}

export default function ReportCard({ analysis, animate = true }) {
  if (!analysis) return null;

  const normalCount = analysis.labValues?.filter(v => v.status === 'normal').length || 0;
  const borderlineCount = analysis.labValues?.filter(v => v.status === 'borderline').length || 0;
  const criticalCount = analysis.labValues?.filter(v => v.status === 'critical').length || 0;
  const total = analysis.labValues?.length || 0;

  const overallConfig = {
    normal: { bg: 'bg-emerald-500/10', border: 'border-emerald-500/30', color: 'text-emerald-500', text: 'All Clear!' },
    attention: { bg: 'bg-amber-500/10', border: 'border-amber-500/30', color: 'text-amber-500', text: 'Needs Attention' },
    urgent: { bg: 'bg-red-500/10', border: 'border-red-500/30', color: 'text-red-500', text: 'See Doctor Soon' }
  };
  const overall = overallConfig[analysis.overallStatus] || overallConfig.attention;

  // Group values by category
  const categories = {};
  (analysis.labValues || []).forEach(v => {
    const cat = v.category || 'Other';
    if (!categories[cat]) categories[cat] = [];
    categories[cat].push(v);
  });

  let globalIndex = 0;

  return (
    <motion.div
      className="bg-[#1a1a2e] rounded-3xl border border-white/10 overflow-hidden shadow-2xl"
      initial={animate ? { opacity: 0, y: 30 } : false}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Overall Status Banner */}
      <div className={`p-6 sm:p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-white/5 ${overall.bg} ${overall.border}`}>
        <div className="flex-1">
          <h3 className={`text-2xl sm:text-3xl font-bold font-['Space_Grotesk'] mb-2 ${overall.color}`}>{overall.text}</h3>
          <p className="text-white/80 text-sm sm:text-base leading-relaxed">{analysis.summary}</p>
        </div>
        <div className="flex gap-4 sm:gap-6 bg-[#0a0a0f]/50 p-4 rounded-2xl border border-white/5 shrink-0 w-full md:w-auto">
          <div className="flex flex-col items-center">
            <span className="text-2xl font-bold text-emerald-500">{normalCount}</span>
            <span className="text-xs font-semibold text-[#a0a0b8] uppercase tracking-wide">Normal</span>
          </div>
          <div className="w-px bg-white/10"></div>
          <div className="flex flex-col items-center">
            <span className="text-2xl font-bold text-amber-500">{borderlineCount}</span>
            <span className="text-xs font-semibold text-[#a0a0b8] uppercase tracking-wide">Watch</span>
          </div>
          <div className="w-px bg-white/10"></div>
          <div className="flex flex-col items-center">
            <span className="text-2xl font-bold text-red-500">{criticalCount}</span>
            <span className="text-xs font-semibold text-[#a0a0b8] uppercase tracking-wide">Critical</span>
          </div>
        </div>
      </div>

      {/* Lab info */}
      {analysis.labName && (
        <div className="px-6 py-4 bg-[#12121a] flex flex-wrap gap-x-6 gap-y-2 text-sm text-[#6b6b80] border-b border-white/5">
          <span className="font-medium text-[#a0a0b8]">Lab: {analysis.labName}</span>
          {analysis.reportDate && <span>Date: {new Date(analysis.reportDate).toLocaleDateString()}</span>}
          <span>{total} values analyzed</span>
        </div>
      )}

      {/* Values by Category */}
      <div className="p-4 sm:p-6 space-y-8">
        {Object.entries(categories).map(([category, values]) => (
          <div key={category}>
            <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#7c3aed]"></span>
              {category}
            </h4>
            <div className="space-y-3">
              {values.map((val) => (
                <LabValueRow key={val.name + (globalIndex++)} val={val} index={globalIndex} language={analysis.summaryLanguage} />
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Doctor Recommendation */}
      {analysis.doctorRecommendation && (
        <div className="m-4 sm:m-6 p-5 sm:p-6 rounded-2xl bg-gradient-to-br from-[#7c3aed]/10 to-[#a855f7]/10 border border-[#7c3aed]/30 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-5">
            <CheckCircle size={80} className="text-[#a855f7]" />
          </div>
          <h4 className="text-[#a855f7] font-bold mb-2 flex items-center gap-2">
             Doctor Recommendation
          </h4>
          <p className="text-white/90 text-sm sm:text-base leading-relaxed relative z-10">{analysis.doctorRecommendation}</p>
        </div>
      )}

      <div className="p-4 text-center text-xs text-[#6b6b80] bg-[#0a0a0f] border-t border-white/5">
        * This is NOT a medical diagnosis. Always consult a qualified healthcare professional.
      </div>
    </motion.div>
  );
}
