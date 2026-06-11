import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

// Localized strings map for PDF generation
const PDF_TRANSLATIONS = {
  en: {
    reportAnalysis: 'Report Analysis',
    reportId: 'Report ID',
    generated: 'Generated',
    labDate: 'Lab Date',
    patientName: 'Patient Name',
    labFacility: 'Lab Facility',
    overallStatus: 'Overall Status',
    totalMetrics: 'Total Metrics',
    normal: 'Normal',
    abnormal: 'Abnormal',
    detailedLabResults: 'Detailed Lab Results',
    aiSummaryAnalysis: 'AI Summary Analysis',
    clinicalGuidance: 'Clinical Guidance',
    recommendedSpecialist: 'Recommended Specialist',
    urgencyLevel: 'Urgency Level',
    possibleHealthConcerns: 'Possible Health Concerns',
    recommendedNextSteps: 'Recommended Next Steps',
    disclaimer: 'This interpretation is for educational purposes only and is not a medical diagnosis, prescription, or treatment plan. Please consult a qualified healthcare professional for medical advice.',
    page: 'Page',
    of: 'of',
    tableHeaders: ['Parameter', 'Value', 'Unit', 'Ref. Range', 'Status', 'Explanation'],
    statusLabels: {
      critical: 'CRITICAL',
      high: 'HIGH',
      borderline: 'BORDERLINE',
      low: 'LOW',
      normal: 'NORMAL'
    }
  },
  ja: {
    reportAnalysis: 'レポート分析',
    reportId: 'レポートID',
    generated: '作成日',
    labDate: '検査日',
    patientName: '患者名',
    labFacility: '検査機関',
    overallStatus: '総合状態',
    totalMetrics: '検査項目数',
    normal: '正常',
    abnormal: '異常あり',
    detailedLabResults: '詳細な検査結果',
    aiSummaryAnalysis: 'AI要約分析',
    clinicalGuidance: '臨床的ガイダンス',
    recommendedSpecialist: '推奨される専門医',
    urgencyLevel: '緊急度',
    possibleHealthConcerns: '考えられる健康上の懸念事項',
    recommendedNextSteps: '推奨される次のステップ',
    disclaimer: 'この解釈は教育的な目的のみを対象としており、医師の診断、処方、または治療計画に代わるものではありません。医療的なアドバイスについては、必ず資格を持つ医療専門家にご相談ください。',
    page: 'ページ',
    of: '/',
    tableHeaders: ['項目名', '測定値', '単位', '基準値', '状態', '詳細説明'],
    statusLabels: {
      critical: '重度異常',
      high: '高い',
      borderline: '境界値',
      low: '低い',
      normal: '正常'
    }
  },
  hi: {
    reportAnalysis: 'रिपोर्ट विश्लेषण',
    reportId: 'रिपोर्ट आईडी',
    generated: 'तैयार किया गया',
    labDate: 'प्रयोगशाला तिथि',
    patientName: 'मरीज का नाम',
    labFacility: 'प्रयोगशाला सुविधा',
    overallStatus: 'कुल मिलाकर स्थिति',
    totalMetrics: 'कुल पैरामीटर',
    normal: 'सामान्य',
    abnormal: 'असामान्य',
    detailedLabResults: 'विस्तृत परिणाम',
    aiSummaryAnalysis: 'एआई सारांश विश्लेषण',
    clinicalGuidance: 'नैदानिक मार्गदर्शन',
    recommendedSpecialist: 'अनुशंसित विशेषज्ञ',
    urgencyLevel: 'तैयारी का स्तर',
    possibleHealthConcerns: 'संभावित स्वास्थ्य चिंताएं',
    recommendedNextSteps: 'अनुशंसित अगले कदम',
    disclaimer: 'यह व्याख्या केवल शैक्षिक उद्देश्यों के लिए है और कोई चिकित्सा निदान, नुस्खा या उपचार योजना नहीं है। कृपया चिकित्सा सलाह के लिए एक योग्य स्वास्थ्य देखभाल पेशेवर से परामर्श लें।',
    page: 'पृष्ठ',
    of: 'का',
    tableHeaders: ['पैरामीटर', 'मान', 'इकाई', 'सामान्य सीमा', 'स्थिति', 'स्पष्टीकरण'],
    statusLabels: {
      critical: 'अति असामान्य',
      high: 'उच्च',
      borderline: 'सीमांत',
      low: 'निम्न',
      normal: 'सामान्य'
    }
  },
  gu: {
    reportAnalysis: 'રિપોર્ટ વિશ્લેષણ',
    reportId: 'રિપોર્ટ આઈડી',
    generated: 'તૈયાર કરેલ',
    labDate: 'લેબોરેટરી તારીખ',
    patientName: 'દર્દીનું નામ',
    labFacility: 'લેબોરેટરી સુવિધા',
    overallStatus: 'સમગ્ર સ્થિતિ',
    totalMetrics: 'કુલ માપદંડો',
    normal: 'સામાન્ય',
    abnormal: 'અસામાન્ય',
    detailedLabResults: 'વિગતવાર લેબોરેટરી પરિણામો',
    aiSummaryAnalysis: 'AI સારાંશ વિશ્લેષણ',
    clinicalGuidance: 'ક્લિનિકલ માર્ગદર્શન',
    recommendedSpecialist: 'ભલામણ કરેલ નિષ્ણાત',
    urgencyLevel: 'તાકીદનું સ્તર',
    possibleHealthConcerns: 'સંભવિત આરોગ્ય ચિંતાઓ',
    recommendedNextSteps: 'ભલામણ કરેલ આગામી પગલાં',
    disclaimer: 'આ અર્થઘટન માત્ર શૈક્ષણિક હેતુઓ માટે જ છે અને તે કોઈ તબીબી નિદાન, પ્રિસ્ક્રિપ્શન કે સારવાર યોજના નથી. તબીબી સલાહ માટે કૃપા કરીને લાયક હેલ્થકેર પ્રોફેશનલની સલાહ લો.',
    page: 'પૃષ્ઠ',
    of: 'નું',
    tableHeaders: ['માપદંડ', 'મૂલ્ય', 'એકમ', 'સામાન્ય સીમા', 'સ્થિતિ', 'સ્પષ્ટીકરણ'],
    statusLabels: {
      critical: 'અતિ અસામાન્ય',
      high: 'ઊંચું',
      borderline: 'બોર્ડરલાઇન',
      low: 'નીચું',
      normal: 'સામાન્ય'
    }
  },
  fr: {
    reportAnalysis: 'Analyse du rapport',
    reportId: 'ID du rapport',
    generated: 'Généré le',
    labDate: 'Date de labo',
    patientName: 'Nom du patient',
    labFacility: 'Établissement',
    overallStatus: 'Statut général',
    totalMetrics: 'Total des mesures',
    normal: 'Normal',
    abnormal: 'Attention requise',
    detailedLabResults: 'Résultats détaillés',
    aiSummaryAnalysis: 'Analyse et résumé IA',
    clinicalGuidance: 'Directives cliniques',
    recommendedSpecialist: 'Spécialiste recommandé',
    urgencyLevel: 'Niveau d\'urgence',
    possibleHealthConcerns: 'Problèmes de santé potentiels',
    recommendedNextSteps: 'Prochaines étapes recommandées',
    disclaimer: 'Cette interprétation est uniquement à but éducatif et ne constitue pas un diagnostic médical, une ordonnance ou un plan de traitement. Veuillez consulter un professionnel de la santé qualifié.',
    page: 'Page',
    of: 'sur',
    tableHeaders: ['Paramètre', 'Valeur', 'Unité', 'Intervalle de réf.', 'Statut', 'Explication'],
    statusLabels: {
      critical: 'CRITIQUE',
      high: 'ÉLEVÉ',
      borderline: 'LIMITE',
      low: 'BAS',
      normal: 'NORMAL'
    }
  }
};

// Helper to format dates localely
const formatDate = (dateString, lang) => {
  if (!dateString) return 'N/A';
  const d = new Date(dateString);
  const localeMap = { en: 'en-US', ja: 'ja-JP', hi: 'hi-IN', gu: 'gu-IN', fr: 'fr-FR' };
  const locale = localeMap[lang] || 'en-US';
  return d.toLocaleDateString(locale, { year: 'numeric', month: 'short', day: 'numeric' });
};

// Helper to load TTF font dynamically from jsDelivr GitHub mirror
const loadFont = async (doc, url, fontName) => {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Failed to fetch font: ${response.statusText}`);
  const arrayBuffer = await response.arrayBuffer();
  
  // Convert ArrayBuffer to Base64 safely
  const bytes = new Uint8Array(arrayBuffer);
  let binary = '';
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  const base64String = window.btoa(binary);

  doc.addFileToVFS(`${fontName}.ttf`, base64String);
  doc.addFont(`${fontName}.ttf`, fontName, 'normal');
};

// Colors matching the UI theme
const colors = {
  primary: [15, 23, 42], // slate-900
  secondary: [100, 116, 139], // slate-500
  accent: [59, 130, 246], // blue-500
  normal: [34, 197, 94], // green-500
  attention: [249, 115, 22], // orange-500
  critical: [239, 68, 68], // red-500
  bgLight: [248, 250, 252], // slate-50
  border: [226, 232, 240] // slate-200
};

export const generateReportPDF = async (report, user) => {
  try {
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    const lang = report.summaryLanguage || 'en';
    const t = PDF_TRANSLATIONS[lang] || PDF_TRANSLATIONS.en;

    // --- DYNAMIC FONT LOADING FOR UNICODE SUPPORT ---
    let fontFamily = 'helvetica';
    if (lang === 'ja') {
      fontFamily = 'NotoSansJapanese';
      const fontUrl = 'https://cdn.jsdelivr.net/gh/google/fonts@main/ofl/notosansjapanese/NotoSansJapanese-Regular.ttf';
      try {
        await loadFont(doc, fontUrl, fontFamily);
      } catch (err) {
        console.error('Failed to load Japanese font, falling back to helvetica:', err);
        fontFamily = 'helvetica';
      }
    } else if (lang === 'hi') {
      fontFamily = 'NotoSansDevanagari';
      const fontUrl = 'https://cdn.jsdelivr.net/gh/google/fonts@main/ofl/notosansdevanagari/NotoSansDevanagari-Regular.ttf';
      try {
        await loadFont(doc, fontUrl, fontFamily);
      } catch (err) {
        console.error('Failed to load Devanagari font, falling back to helvetica:', err);
        fontFamily = 'helvetica';
      }
    } else if (lang === 'gu') {
      fontFamily = 'NotoSansGujarati';
      const fontUrl = 'https://cdn.jsdelivr.net/gh/google/fonts@main/ofl/notosansgujarati/NotoSansGujarati-Regular.ttf';
      try {
        await loadFont(doc, fontUrl, fontFamily);
      } catch (err) {
        console.error('Failed to load Gujarati font, falling back to helvetica:', err);
        fontFamily = 'helvetica';
      }
    }

    const setDocFont = (style = 'normal') => {
      if (fontFamily === 'helvetica') {
        doc.setFont('helvetica', style);
      } else {
        doc.setFont(fontFamily, 'normal');
      }
    };

    const getLocalizedStatus = (status) => {
      if (!status) return '-';
      const s = status.toLowerCase();
      if (s === 'critical' || s === 'high') return t.statusLabels.critical;
      if (s === 'borderline' || s === 'low') return t.statusLabels.borderline;
      if (s === 'normal') return t.statusLabels.normal;
      return status;
    };

    const pageWidth = doc.internal.pageSize.width;
    const pageHeight = doc.internal.pageSize.height;
    const margin = 15;
    let cursorY = margin;

    // --- HELPER: Add Footer to all pages ---
    const addFooters = () => {
      const pageCount = doc.internal.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        
        // Footer Line
        doc.setDrawColor(...colors.border);
        doc.line(margin, pageHeight - 20, pageWidth - margin, pageHeight - 20);
        
        // Disclaimer
        doc.setFontSize(7);
        doc.setTextColor(...colors.secondary);
        setDocFont('italic');
        const disclaimer = t.disclaimer;
        const splitDisclaimer = doc.splitTextToSize(disclaimer, pageWidth - margin * 2);
        doc.text(splitDisclaimer, margin, pageHeight - 15);
        
        // Page Info
        setDocFont('normal');
        doc.setFontSize(8);
        doc.text(`MedScanAI | Generated by Gemini 2.5 Flash`, margin, pageHeight - 7);
        doc.text(`${t.page} ${i} ${t.of} ${pageCount}`, pageWidth - margin - 15, pageHeight - 7);
      }
    };

    // --- HEADER: Professional Cover Section ---
    // Title
    setDocFont('bold');
    doc.setFontSize(24);
    doc.setTextColor(...colors.primary);
    doc.text('MedScanAI', margin, cursorY + 8);
    
    // Subtitle
    doc.setFontSize(14);
    doc.setTextColor(...colors.accent);
    
    const reportTypeMap = {
      en: { blood: 'Blood', thyroid: 'Thyroid', liver: 'Liver', kidney: 'Kidney', lipid: 'Lipid', diabetes: 'Diabetes', cbc: 'CBC', urine: 'Urine', other: 'Medical' },
      ja: { blood: '血液', thyroid: '甲状腺', liver: '肝臓', kidney: '腎臓', lipid: '脂質', diabetes: '糖尿病', cbc: '血算', urine: '尿', other: '医療' },
      hi: { blood: 'रक्त', thyroid: 'थायराइड', liver: 'लिवर', kidney: 'किडनी', lipid: 'लिपिड', diabetes: 'मधुमेह', cbc: 'सीबीसी', urine: 'मूत्र', other: 'चिकित्सा' },
      gu: { blood: 'લોહી', thyroid: 'થાઇરોઇડ', liver: 'લિવર', kidney: 'કિડની', lipid: 'લિપિડ', diabetes: 'ડાયાબિટીસ', cbc: 'CBC', urine: 'પેશાબ', other: 'તબીબી' },
      fr: { blood: 'Sang', thyroid: 'Thyroïde', liver: 'Foie', kidney: 'Rein', lipid: 'Lipide', diabetes: 'Diabète', cbc: 'Hémogramme', urine: 'Urine', other: 'Médical' }
    };
    const currentTypes = reportTypeMap[lang] || reportTypeMap.en;
    const reportType = currentTypes[report.reportType?.toLowerCase()] || currentTypes.other;
    doc.text(`${reportType} ${t.reportAnalysis}`, margin, cursorY + 16);

    // Right Side Header (Metadata)
    doc.setFontSize(9);
    doc.setTextColor(...colors.secondary);
    setDocFont('normal');
    doc.text(`${t.reportId}: ${report._id?.slice(-8).toUpperCase() || 'N/A'}`, pageWidth - margin, cursorY + 8, { align: 'right' });
    doc.text(`${t.generated}: ${formatDate(new Date(), lang)}`, pageWidth - margin, cursorY + 12, { align: 'right' });
    doc.text(`${t.labDate}: ${formatDate(report.reportDate, lang)}`, pageWidth - margin, cursorY + 16, { align: 'right' });

    // Divider
    cursorY += 22;
    doc.setDrawColor(...colors.border);
    doc.setLineWidth(0.5);
    doc.line(margin, cursorY, pageWidth - margin, cursorY);
    cursorY += 8;

    // --- PATIENT INFO & HEALTH SCORE SECTION ---
    const patientName = report.familyMemberName === 'Self' ? (user?.name || 'Patient') : (report.familyMemberName || 'Patient');
    const abnormalValues = report.labValues?.filter(v => v.status !== 'normal') || [];
    const normalValues = report.labValues?.filter(v => v.status === 'normal') || [];
    
    // Patient Info Block
    doc.setFontSize(10);
    setDocFont('bold');
    doc.setTextColor(...colors.primary);
    doc.text(`${t.patientName}: `, margin, cursorY);
    setDocFont('normal');
    doc.text(patientName, margin + 25, cursorY);
    
    setDocFont('bold');
    doc.text(`${t.labFacility}: `, margin, cursorY + 6);
    setDocFont('normal');
    doc.text(report.labName || 'Unknown', margin + 25, cursorY + 6);

    // Health Score Block (Right aligned)
    let badgeColor = colors.normal;
    let badgeText = t.statusLabels.normal;
    if (report.overallStatus === 'urgent') {
      badgeColor = colors.critical;
      badgeText = t.statusLabels.critical || 'URGENT';
    } else if (report.overallStatus === 'attention') {
      badgeColor = colors.attention;
      badgeText = t.statusLabels.borderline || 'ATTENTION';
    }

    doc.setFontSize(10);
    setDocFont('bold');
    doc.setTextColor(...colors.primary);
    doc.text(`${t.overallStatus}:`, pageWidth - margin - 45, cursorY);
    doc.setTextColor(...badgeColor);
    doc.text(badgeText, pageWidth - margin - 15, cursorY);

    doc.setTextColor(...colors.secondary);
    doc.setFontSize(9);
    setDocFont('normal');
    doc.text(`${t.totalMetrics}: ${report.labValues?.length || 0}`, pageWidth - margin - 45, cursorY + 6);
    doc.text(`${t.normal}: ${normalValues.length}`, pageWidth - margin - 45, cursorY + 11);
    doc.text(`${t.abnormal}: ${abnormalValues.length}`, pageWidth - margin - 45, cursorY + 16);

    cursorY += 25;

    // --- LAB RESULTS TABLE ---
    doc.setFontSize(14);
    setDocFont('bold');
    doc.setTextColor(...colors.primary);
    doc.text(t.detailedLabResults, margin, cursorY);
    cursorY += 5;

    const tableData = (report.labValues || []).map(val => [
      val.name || '-',
      val.value !== undefined ? String(val.value) : '-',
      val.unit || '-',
      (val.referenceMin !== undefined && val.referenceMax !== undefined) ? `${val.referenceMin} - ${val.referenceMax}` : '-',
      getLocalizedStatus(val.status),
      val.explanation || '-'
    ]);

    autoTable(doc, {
      startY: cursorY,
      head: [t.tableHeaders],
      body: tableData,
      theme: 'grid',
      headStyles: {
        fillColor: colors.primary,
        textColor: [255, 255, 255],
        fontSize: 9,
        fontStyle: 'normal',
        font: fontFamily
      },
      styles: {
        fontSize: 8,
        cellPadding: 4,
        textColor: colors.primary,
        font: fontFamily
      },
      columnStyles: {
        0: { cellWidth: 35 },
        1: { cellWidth: 15 },
        2: { cellWidth: 15 },
        3: { cellWidth: 25 },
        4: { cellWidth: 20 },
        5: { cellWidth: 'auto' }
      },
      didParseCell: function(data) {
        if (data.section === 'body' && data.column.index === 4) {
          const statusVal = report.labValues[data.row.index]?.status;
          if (statusVal === 'critical') {
            data.cell.styles.textColor = colors.critical;
          } else if (statusVal === 'borderline') {
            data.cell.styles.textColor = colors.attention;
          } else if (statusVal === 'normal') {
            data.cell.styles.textColor = colors.normal;
          }
        }
      },
      margin: { top: margin, right: margin, bottom: 25, left: margin }
    });

    cursorY = doc.lastAutoTable.finalY + 15;

    const checkPageBreak = (neededSpace) => {
      if (cursorY + neededSpace > pageHeight - 25) {
        doc.addPage();
        cursorY = margin;
      }
    };

    // --- AI SUMMARY ---
    if (report.summary) {
      checkPageBreak(40);
      doc.setFontSize(14);
      setDocFont('bold');
      doc.setTextColor(...colors.primary);
      doc.text(t.aiSummaryAnalysis, margin, cursorY);
      cursorY += 6;

      doc.setFontSize(10);
      setDocFont('normal');
      doc.setTextColor(...colors.secondary);
      const splitSummary = doc.splitTextToSize(report.summary, pageWidth - margin * 2);
      doc.text(splitSummary, margin, cursorY);
      cursorY += (splitSummary.length * 5) + 10;
    }

    // --- CLINICAL GUIDANCE ---
    if (report.clinicalGuidance) {
      const cg = report.clinicalGuidance;
      checkPageBreak(60);
      
      doc.setFontSize(14);
      setDocFont('bold');
      doc.setTextColor(...colors.primary);
      doc.text(t.clinicalGuidance, margin, cursorY);
      cursorY += 8;

      // Specialist & Urgency
      if (cg.specialistType || cg.urgencyLevel) {
        doc.setFontSize(10);
        setDocFont('bold');
        if (cg.specialistType) {
          doc.text(`${t.recommendedSpecialist}: ${cg.specialistType}`, margin, cursorY);
        }
        if (cg.urgencyLevel) {
          doc.text(`${t.urgencyLevel}: ${cg.urgencyLevel}`, margin + 90, cursorY);
        }
        cursorY += 8;
      }

      // Concerns
      if (cg.concerns && cg.concerns.length > 0) {
        checkPageBreak(30);
        doc.setFontSize(10);
        setDocFont('bold');
        doc.setTextColor(...colors.attention);
        doc.text(`${t.possibleHealthConcerns}:`, margin, cursorY);
        cursorY += 6;

        setDocFont('normal');
        doc.setTextColor(...colors.primary);
        cg.concerns.forEach(concern => {
          const split = doc.splitTextToSize(`• ${concern}`, pageWidth - margin * 2 - 5);
          checkPageBreak(split.length * 5 + 5);
          doc.text(split, margin + 5, cursorY);
          cursorY += split.length * 5;
        });
        cursorY += 5;
      }

      // Next Steps
      if (cg.nextSteps && cg.nextSteps.length > 0) {
        checkPageBreak(30);
        doc.setFontSize(10);
        setDocFont('bold');
        doc.setTextColor(...colors.accent);
        doc.text(`${t.recommendedNextSteps}:`, margin, cursorY);
        cursorY += 6;

        setDocFont('normal');
        doc.setTextColor(...colors.primary);
        cg.nextSteps.forEach(step => {
          const split = doc.splitTextToSize(`• ${step}`, pageWidth - margin * 2 - 5);
          checkPageBreak(split.length * 5 + 5);
          doc.text(split, margin + 5, cursorY);
          cursorY += split.length * 5;
        });
        cursorY += 5;
      }
    }

    addFooters();

    const sanitizedName = patientName.replace(/[^a-zA-Z0-9]/g, '_');
    const dateStr = new Date().toISOString().split('T')[0];
    const fileName = `MedScanAI_Report_${sanitizedName}_${dateStr}.pdf`;

    doc.save(fileName);
    return true;
  } catch (error) {
    console.error('PDF Generation failed:', error);
    throw error;
  }
};
