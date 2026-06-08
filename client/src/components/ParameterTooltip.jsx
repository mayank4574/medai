import React, { useRef } from 'react';
import { useFloating, autoUpdate, offset, flip, shift, arrow } from '@floating-ui/react';

const TRANSLATIONS = {
  en: {
    status: 'Status',
    referenceRange: 'Reference Range',
    yourValue: 'Your Value',
    high: 'High',
    borderline: 'Borderline',
    normal: 'Normal',
    noExplanation: 'No specific explanation available.'
  },
  hi: {
    status: 'स्थिति',
    referenceRange: 'सामान्य सीमा',
    yourValue: 'आपका मान',
    high: 'अधिक',
    borderline: 'सीमांत',
    normal: 'सामान्य',
    noExplanation: 'कोई विशिष्ट स्पष्टीकरण उपलब्ध नहीं है।'
  },
  ja: {
    status: '状態',
    referenceRange: '基準値',
    yourValue: '測定値',
    high: '高い',
    borderline: '境界値',
    normal: '正常',
    noExplanation: '特定の説明はありません。'
  }
};

export default function ParameterTooltip({ row, children, language = 'en', darkTheme = false }) {
  const t = TRANSLATIONS[language] || TRANSLATIONS.en;
  
  const arrowRef = useRef(null);

  const { refs, floatingStyles, middlewareData, placement } = useFloating({
    placement: 'top-start',
    strategy: 'fixed',
    whileElementsMounted: autoUpdate,
    middleware: [
      offset(10),
      flip({ fallbackAxisSideDirection: 'end' }),
      shift({ padding: 12 }),
      arrow({ element: arrowRef })
    ],
  });

  // Preserve existing Basophils behavior if exactly 'Basophils'
  if (row?.name?.toLowerCase().includes('basophil')) {
    return (
      <div className="group cursor-default relative w-full block">
        {children}
        {row.explanation && row.status !== 'normal' && (
          <p className={`text-xs mt-1 font-normal max-w-xs opacity-0 group-hover:opacity-100 transition-opacity ${darkTheme ? 'text-slate-400' : 'text-slate-500'}`}>
            {row.explanation}
          </p>
        )}
      </div>
    );
  }

  const getStatusText = (status) => {
    if (status === 'critical') return t.high;
    if (status === 'borderline') return t.borderline;
    return t.normal;
  };

  const getStatusColor = (status) => {
    if (status === 'critical') return 'text-red-600';
    if (status === 'borderline') return 'text-orange-500';
    return 'text-green-600';
  };

  return (
    <div 
      className="relative group cursor-help inline-block w-full"
      ref={refs.setReference}
    >
      {children}
      
      {/* Tooltip Body */}
      <div
        ref={refs.setFloating}
        style={floatingStyles}
        className={`z-[9999] w-72 rounded-xl shadow-xl border opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 pointer-events-none ${placement.startsWith('top') ? 'transform translate-y-2 group-hover:translate-y-0' : 'transform -translate-y-2 group-hover:translate-y-0'} ${darkTheme ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}
      >
        <div className="p-4 space-y-3">
          <div className="flex justify-between items-start">
            <span className={`font-bold ${darkTheme ? 'text-white' : 'text-slate-900'}`}>{row.name}</span>
            <span className={`text-xs font-bold uppercase ${getStatusColor(row.status)}`}>
              {getStatusText(row.status)}
            </span>
          </div>
          
          <p className={`text-sm leading-relaxed ${darkTheme ? 'text-slate-300' : 'text-slate-600'}`}>
            {row.explanation || t.noExplanation}
          </p>
          
          <div className={`rounded-lg p-3 text-xs space-y-2 border ${darkTheme ? 'bg-slate-700 border-slate-600' : 'bg-slate-50 border-slate-100'}`}>
            <div className="flex justify-between items-center">
              <span className={`font-medium ${darkTheme ? 'text-slate-400' : 'text-slate-500'}`}>{t.yourValue}:</span>
              <span className={`font-bold text-sm ${getStatusColor(row.status)}`}>
                {row.value} {row.unit}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className={`font-medium ${darkTheme ? 'text-slate-400' : 'text-slate-500'}`}>{t.referenceRange}:</span>
              <span className={`font-medium ${darkTheme ? 'text-slate-300' : 'text-slate-700'}`}>
                {row.referenceMin} - {row.referenceMax} {row.unit}
              </span>
            </div>
          </div>
        </div>
        
        {/* Tooltip Arrow */}
        <div 
          ref={arrowRef}
          style={{
            left: middlewareData.arrow?.x != null ? `${middlewareData.arrow.x}px` : '24px',
            top: placement.startsWith('bottom') ? '-7px' : 'auto',
            bottom: placement.startsWith('top') ? '-7px' : 'auto',
            transform: placement.startsWith('bottom') ? 'rotate(180deg)' : 'none',
          }}
          className={`absolute border-8 border-transparent drop-shadow-sm ${darkTheme ? 'border-t-slate-800' : 'border-t-white'}`}
        ></div>
      </div>
    </div>
  );
}
