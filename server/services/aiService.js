/**
 * aiService.js
 *
 * Gemini AI Service Layer for MedScanAI
 * ─────────────────────────────────────
 * Migration: OpenAI (gpt-4o) → Google Gemini (gemini-2.5-flash)
 *
 * All public function signatures and return shapes are UNCHANGED so that
 * routes/reports.js and the frontend require zero modifications.
 *
 * SDK used: @google/genai  (already present in package.json)
 * Env vars:  GEMINI_API_KEY, GEMINI_MODEL (defaults to gemini-2.5-flash)
 */

const { GoogleGenAI } = require('@google/genai');

// ── Gemini client ────────────────────────────────────────────────────────────
// Initialise once at module load; the SDK re-uses connections internally.
const genai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// Model to use – read from env so it can be overridden without a code change.
const GEMINI_MODEL = process.env.GEMINI_MODEL || 'gemini-2.5-flash';

// ── Retry / timeout configuration ────────────────────────────────────────────
const MAX_RETRIES = 3;
const RETRY_DELAY_MS = 1000; // base delay; doubles on each attempt

// ── Language map (unchanged from original) ────────────────────────────────────
const LANGUAGE_MAP = {
  en: 'English', hi: 'Hindi', ja: 'Japanese',
  ta: 'Tamil', te: 'Telugu', bn: 'Bengali', mr: 'Marathi',
  es: 'Spanish', fr: 'French', de: 'German', pt: 'Portuguese',
  zh: 'Chinese', ko: 'Korean', ar: 'Arabic', ru: 'Russian',
  gu: 'Gujarati', kn: 'Kannada', ml: 'Malayalam', pa: 'Punjabi',
  ur: 'Urdu', th: 'Thai', vi: 'Vietnamese', it: 'Italian',
  nl: 'Dutch', tr: 'Turkish'
};

// ── System prompt (optimized for multi-language output) ───────────────────────
const SYSTEM_PROMPT = `You are MedScanAI, an AI medical lab report interpreter. You read lab reports and explain values simply.

IMPORTANT RULES:
1. Extract EVERY lab value from the report.
2. For each value, determine: name, numeric value, unit, reference range (min/max), status.
3. Status must be one of: "normal" (within range), "borderline" (within 10% of boundary), "critical" (outside range significantly).
4. Categorize each value: category MUST be strictly one of these English values: "CBC", "Liver", "Kidney", "Thyroid", "Lipid", "Diabetes", "Vitamin", "Other".
5. Do NOT generate: medicines, dosages, prescriptions, treatment plans, medical diagnoses, real doctor names, or fake doctor data.
6. The name, explanation, summary, concerns, and nextSteps MUST be written in the selected target language. Do not mix English and the target language.

Return ONLY valid JSON in this exact format:
{
  "reportType": "blood|thyroid|liver|kidney|lipid|diabetes|cbc|urine|other",
  "labName": "detected lab name or unknown",
  "reportDate": "detected date or null",
  "labValues": [
    {
      "name": "Test Name (translated)",
      "value": 42,
      "unit": "mm/hr",
      "referenceMin": 0,
      "referenceMax": 20,
      "status": "borderline|normal|critical",
      "explanation": "Patient friendly explanation (translated)",
      "category": "CBC|Liver|Kidney|Thyroid|Lipid|Diabetes|Vitamin|Other"
    }
  ],
  "summary": "Overall summary (translated)",
  "overallStatus": "normal|attention|urgent",
  "concerns": ["List of general health concerns (translated)"],
  "nextSteps": ["List of lifestyle, diet, and monitoring steps (translated)"]
}`;

// Localized strings map for programmatically generated clinical guidance fields
const LOCALIZED_STRINGS = {
  en: {
    urgency: {
      'Normal': 'Normal',
      'Monitor': 'Monitor',
      'Consult Doctor': 'Consult Doctor',
      'Urgent Review': 'Urgent Review'
    },
    specialist: {
      'General Physician': 'General Physician',
      'Nephrologist': 'Nephrologist',
      'Gastroenterologist / Hepatologist': 'Gastroenterologist / Hepatologist',
      'Cardiologist': 'Cardiologist',
      'Endocrinologist': 'Endocrinologist',
      'Hematologist': 'Hematologist'
    },
    disclaimer: 'This interpretation is for educational purposes only and is not a medical diagnosis, prescription, or treatment plan. Please consult a qualified healthcare professional for medical advice.',
    globalDisclaimer: 'This interpretation is for educational purposes only and is not a medical diagnosis. Please consult a qualified healthcare professional for medical advice.'
  },
  ja: {
    urgency: {
      'Normal': '正常',
      'Monitor': '経過観察',
      'Consult Doctor': '医師に相談',
      'Urgent Review': '至急受診'
    },
    specialist: {
      'General Physician': '一般内科医',
      'Nephrologist': '腎臓専門医',
      'Gastroenterologist / Hepatologist': '消化器・肝臓専門医',
      'Cardiologist': '循環器専門医',
      'Endocrinologist': '内分泌専門医',
      'Hematologist': '血液専門医'
    },
    disclaimer: 'この解釈は教育的な目的のみを対象としており、医師の診断、処方、または治療計画に代わるものではありません。医療的なアドバイスについては、必ず資格を持つ医療専門家にご相談ください。',
    globalDisclaimer: 'この解釈は教育的な目的のみを対象としており、医師の診断に代わるものではありません。医療的なアドバイスについては、必ず資格を持つ医療専門家にご相談ください。'
  },
  hi: {
    urgency: {
      'Normal': 'सामान्य',
      'Monitor': 'निगरानी रखें',
      'Consult Doctor': 'डॉक्टर से परामर्श करें',
      'Urgent Review': 'तत्काल समीक्षा'
    },
    specialist: {
      'General Physician': 'सामान्य चिकित्सक',
      'Nephrologist': 'किडनी विशेषज्ञ',
      'Gastroenterologist / Hepatologist': 'पेट और लिवर विशेषज्ञ',
      'Cardiologist': 'हृदय रोग विशेषज्ञ',
      'Endocrinologist': 'एंडोक्रिनोलॉजिस्ट (हार्मोन विशेषज्ञ)',
      'Hematologist': 'रक्त रोग विशेषज्ञ'
    },
    disclaimer: 'यह व्याख्या केवल शैक्षिक उद्देश्यों के लिए है और कोई चिकित्सा निदान, नुस्खा या उपचार योजना नहीं है। कृपया चिकित्सा सलाह के लिए एक योग्य स्वास्थ्य देखभाल पेशेवर से परामर्श लें।',
    globalDisclaimer: 'यह व्याख्या केवल शैक्षिक उद्देश्यों के लिए है और कोई चिकित्सा निदान नहीं है। कृपया चिकित्सा सलाह के लिए एक योग्य स्वास्थ्य देखभाल पेशेवर से परामर्श लें।'
  },
  gu: {
    urgency: {
      'Normal': 'સામાન્ય',
      'Monitor': 'નિરીક્ષણ કરો',
      'Consult Doctor': 'ડોક્ટરની સલાહ લો',
      'Urgent Review': 'તાત્કાલિક સમીક્ષા'
    },
    specialist: {
      'General Physician': 'સામાન્ય ચિકિત્સક',
      'Nephrologist': 'કિડની નિષ્ણાત',
      'Gastroenterologist / Hepatologist': 'ગેસ્ટ્રોએન્ટેરોલોજિસ્ટ / હેપેટોલોજિસ્ટ',
      'Cardiologist': 'કાર્ડિયોલોજિસ્ટ (હૃદય રોગ નિષ્ણાત)',
      'Endocrinologist': 'એન્ડોક્રિનોલોજિสต์ (હોર્મોન નિષ્ણાત)',
      'Hematologist': 'હેમેટોલોજિસ્ટ (લોહીના રોગના નિષ્ણાત)'
    },
    disclaimer: 'આ અર્થઘટન માત્ર શૈક્ષણિક હેતુઓ માટે જ છે અને તે કોઈ તબીબી નિદાન, પ્રિસ્ક્રિપ્શન કે સારવાર યોજના નથી. તબીબી સલાહ માટે કૃપા કરીને લાયક હેલ્થકેર પ્રોફેશનલની સલાહ લો.',
    globalDisclaimer: 'આ અર્થઘટન માત્ર શૈક્ષણિક હેતુઓ માટે જ છે અને તે કોઈ તબીબી નિદાન નથી. તબીબી સલાહ માટે કૃપા કરીને લાયક હેલ્થકેર પ્રોફેશનલની સલાહ લો.'
  },
  fr: {
    urgency: {
      'Normal': 'Normal',
      'Monitor': 'Surveiller',
      'Consult Doctor': 'Consulter un médecin',
      'Urgent Review': 'Consultation urgente'
    },
    specialist: {
      'General Physician': 'Médecin généraliste',
      'Nephrologist': 'Néphrologue',
      'Gastroenterologist / Hepatologist': 'Gastro-entérologue / Hépatologue',
      'Cardiologist': 'Cardiologue',
      'Endocrinologist': 'Endocrinologue',
      'Hematologist': 'Hématologue'
    },
    disclaimer: 'Cette interprétation est uniquement à but éducatif et ne constitue pas un diagnostic médical, une ordonnance ou un plan de traitement. Veuillez consulter un professionnel de la santé qualifié pour tout avis médical.',
    globalDisclaimer: 'Cette interprétation est uniquement à but éducatif et ne constitue pas un diagnostic médical. Veuillez consulter un professionnel de la santé qualifié pour tout avis médical.'
  }
};

// ── Internal helpers ──────────────────────────────────────────────────────────

const { generateExplanation } = require('./explanationEngine');

/**
 * Programmatically calculate Urgency Level based on rules.
 */
function calculateUrgency(abnormalCount, criticalCount) {
  if (abnormalCount === 0) return 'Normal';
  if (criticalCount > 0) return 'Urgent Review';
  if (abnormalCount > 1) return 'Consult Doctor';
  return 'Monitor';
}

/**
 * Programmatically map Specialist Type based on categories of abnormal markers.
 */
function determineSpecialist(abnormalValues) {
  if (abnormalValues.length === 0) return 'General Physician';
  
  const categories = abnormalValues.map(v => (v.category || '').toLowerCase());
  
  if (categories.includes('kidney')) return 'Nephrologist';
  if (categories.includes('liver')) return 'Gastroenterologist / Hepatologist';
  if (categories.includes('lipid') || categories.includes('cardiovascular')) return 'Cardiologist';
  if (categories.includes('diabetes') || categories.includes('thyroid')) return 'Endocrinologist';
  if (categories.includes('cbc') || categories.includes('blood')) return 'Hematologist';
  
  return 'General Physician';
}

/**
 * Strips markdown code fences from a Gemini response and parses it as JSON.
 * Gemini (like GPT-4o) sometimes wraps JSON in ```json … ``` blocks.
 */
function parseGeminiJson(rawText, language = 'en') {
  let cleaned = rawText.trim();
  
  // Try to find code block first
  const jsonBlockMatch = cleaned.match(/```json([\s\S]*?)```/);
  if (jsonBlockMatch) {
    cleaned = jsonBlockMatch[1].trim();
  } else {
    const genericBlockMatch = cleaned.match(/```([\s\S]*?)```/);
    if (genericBlockMatch) {
      cleaned = genericBlockMatch[1].trim();
    }
  }
  
  let parsed;
  try {
    parsed = JSON.parse(cleaned);
  } catch (firstError) {
    const firstBrace = cleaned.indexOf('{');
    const lastBrace = cleaned.lastIndexOf('}');
    if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
      try {
        const sliced = cleaned.slice(firstBrace, lastBrace + 1);
        parsed = JSON.parse(sliced);
      } catch (secondError) {
        console.error("[parseGeminiJson] Failed to parse sliced JSON:", secondError.message);
        throw firstError;
      }
    } else {
      throw firstError;
    }
  }
  
  // Inject medical explanations strictly from our verified knowledge base
  if (parsed && Array.isArray(parsed.labValues)) {
    parsed.labValues = parsed.labValues.map(val => {
      // Map referenceMin/Max to range field expected by explanationEngine
      const range = (val.referenceMin !== undefined && val.referenceMax !== undefined) 
        ? `${val.referenceMin} - ${val.referenceMax}` 
        : val.range;
      
      let explanation = val.explanation || '';
      
      if (language === 'en') {
        explanation = generateExplanation({ ...val, range });
      } else {
        // Append localized global disclaimer to Gemini's generated explanation
        const disc = LOCALIZED_STRINGS[language]?.globalDisclaimer || LOCALIZED_STRINGS['en'].globalDisclaimer;
        if (explanation && !explanation.includes(disc)) {
          explanation += ` ${disc}`;
        }
      }

      return {
        ...val,
        range,
        explanation
      };
    });
    
    // Build Clinical Guidance programmatically
    const abnormalValues = parsed.labValues.filter(v => v.status === 'borderline' || v.status === 'critical');
    const criticalCount = parsed.labValues.filter(v => v.status === 'critical').length;
    const abnormalCount = abnormalValues.length;
    
    const findings = abnormalValues.map(v => ({
      name: v.name,
      value: v.value,
      unit: v.unit || '',
      referenceRange: v.range || '',
      status: v.status
    }));

    const urgencyLevel = calculateUrgency(abnormalCount, criticalCount);
    const specialistType = determineSpecialist(abnormalValues);
    
    // Localize programmatic fields
    const lang = LOCALIZED_STRINGS[language] ? language : 'en';
    const localizedUrgency = LOCALIZED_STRINGS[lang].urgency[urgencyLevel] || urgencyLevel;
    const localizedSpecialist = LOCALIZED_STRINGS[lang].specialist[specialistType] || specialistType;
    const localizedDisclaimer = LOCALIZED_STRINGS[lang].disclaimer;

    parsed.clinicalGuidance = {
      findings: findings,
      concerns: parsed.concerns || [],
      nextSteps: parsed.nextSteps || [],
      specialistType: localizedSpecialist,
      urgencyLevel: localizedUrgency,
      disclaimer: localizedDisclaimer
    };
    
    // Clean up temporary fields
    delete parsed.concerns;
    delete parsed.nextSteps;
    parsed.doctorRecommendation = null;
  }
  
  return parsed;
}

/**
 * Custom Error to mark fallback eligibility
 */
class GeminiError extends Error {
  constructor(message, status) {
    super(message);
    this.status = status;
    this.name = 'GeminiError';
    // Fallback on all errors in production for resiliency
    this.isFallbackable = true;
  }
}

/**
 * Simple exponential-back-off retry wrapper.
 * Retries on network errors and Gemini 5xx / rate-limit responses.
 *
 * @param {Function} fn   Async function to retry
 * @param {number}   attempt   Current attempt number
 */
async function withRetry(fn, attempt = 1) {
  const delays = [2000, 5000, 10000]; // Retry 1 -> 2s, Retry 2 -> 5s, Retry 3 -> 10s
  
  try {
    return await fn();
  } catch (err) {
    // Determine status code if it's an ApiError from @google/genai
    const status = err.status || err.code || 500;
    const isPermanent = status === 400 || status === 401 || status === 403 || status === 404;

    console.error(`[GeminiService] Error Response (Attempt ${attempt}):`, err.message || err);

    if (attempt > 3 || isPermanent) {
      throw new GeminiError(err.message || 'Gemini API Error', status);
    }

    const delay = delays[attempt - 1];
    console.warn(`[GeminiService] Retry Attempt ${attempt} ... Waiting ${delay}ms`);
    await new Promise(resolve => setTimeout(resolve, delay));
    return withRetry(fn, attempt + 1);
  }
}

// ── Public API (same signatures as the OpenAI version) ────────────────────────

/**
 * Analyse a medical report from a Base-64-encoded image.
 *
 * Gemini change: uses generateContent with an inline_data Part instead of
 * OpenAI's image_url content block. Everything else (prompt, JSON shape) is
 * identical.
 *
 * @param {string} imageBase64   Base-64 image data (no data-URI prefix)
 * @param {string} mimeType      MIME type, e.g. "image/jpeg" or "application/pdf"
 * @param {string} language      BCP-47 language code, defaults to 'en'
 * @returns {Promise<Object>}    Parsed analysis object matching the original schema
 */
async function analyzeReportWithVision(imageBase64, mimeType, language = 'en') {
  const langName = LANGUAGE_MAP[language] || 'English';

  return withRetry(async () => {
    console.log(`[GeminiService] OCR Start`);
    console.log(`[GeminiService] Analysis Start - Vision Model`);
    console.log(`[GeminiService] Gemini Request Start`);
    const startTime = Date.now();
    
    const response = await genai.models.generateContent({
      model: GEMINI_MODEL,
      contents: [
        {
          role: 'user',
          parts: [
            { text: SYSTEM_PROMPT },
            {
              text: `Analyze this medical lab report. Extract ALL values. The target output language is: ${langName}. Return ALL names, explanations, categories, and text fields strictly translated and written in ${langName}. Return JSON only.`
            },
            {
              inlineData: {
                mimeType: mimeType,
                data: imageBase64
              }
            }
          ]
        }
      ],
      generationConfig: {
        maxOutputTokens: 4000,
        temperature: 0.1,
        responseMimeType: 'application/json'
      }
    });

    const elapsed = Date.now() - startTime;
    console.log(`[GeminiService] OCR Complete`);
    console.log(`[GeminiService] Analysis Complete in ${elapsed}ms`);

    const rawText = response.candidates[0].content.parts[0].text;
    return parseGeminiJson(rawText, language);
  });
}

/**
 * Analyse a medical report from plain extracted text.
 *
 * Gemini change: uses generateContent with a single text Part instead of
 * OpenAI's chat messages array. Return shape is identical.
 *
 * @param {string} text      Raw text extracted from the report
 * @param {string} language  BCP-47 language code, defaults to 'en'
 * @returns {Promise<Object>}  Parsed analysis object matching the original schema
 */
async function analyzeReportFromText(text, language = 'en') {
  const langName = LANGUAGE_MAP[language] || 'English';

  return withRetry(async () => {
    console.log(`[GeminiService] Analysis Start - Text Model`);
    console.log(`[GeminiService] Gemini Request Start`);
    const startTime = Date.now();
    const response = await genai.models.generateContent({
      model: GEMINI_MODEL,
      contents: [
        {
          role: 'user',
          parts: [
            { text: SYSTEM_PROMPT },
            {
              text: `Analyze this medical lab report text. Extract ALL values. The target output language is: ${langName}. Return ALL names, explanations, categories, and text fields strictly translated and written in ${langName}. Return JSON only.\n\nReport:\n${text}`
            }
          ]
        }
      ],
      generationConfig: {
        maxOutputTokens: 4000,
        temperature: 0.1,
        responseMimeType: 'application/json'
      }
    });

    const elapsed = Date.now() - startTime;
    console.log(`[GeminiService] Analysis Complete in ${elapsed}ms`);

    const rawText = response.candidates[0].content.parts[0].text;
    return parseGeminiJson(rawText, language);
  });
}

// ── Demo data (completely unchanged from original) ────────────────────────────

/**
 * Returns hardcoded demo analysis when no API key is configured.
 * This function is 100% identical to the original — no AI calls are made.
 *
 * @param {string} language  BCP-47 language code
 * @returns {Object}         Demo analysis object matching the real API schema
 */
function getDemoAnalysis(language = 'en') {
  const isHindi = language === 'hi';
  const isJapanese = language === 'ja';

  const getExplanation = (enText, hiText, jaText) => {
    if (isHindi) return hiText;
    if (isJapanese) return jaText || enText;
    return enText;
  };

  return {
    reportType: 'blood',
    labName: 'Dr. Lal PathLabs',
    reportDate: new Date().toISOString().split('T')[0],
    labValues: [
      { name: 'Hemoglobin', value: 14.2, unit: 'g/dL', referenceMin: 13, referenceMax: 17, status: 'normal',
        explanation: getExplanation('Your hemoglobin is normal. Blood oxygen carrying capacity is good.', 'आपका हीमोग्लोबिन सामान्य है। शरीर में खून की मात्रा ठीक है।', 'ヘモグロビンは正常です。血液の酸素運搬能力は良好です。'), category: 'CBC' },
      { name: 'ESR', value: 42, unit: 'mm/hr', referenceMin: 0, referenceMax: 20, status: 'borderline',
        explanation: getExplanation('ESR is mildly elevated. This is commonly caused by a recent cold or mild infection. Nothing to panic about.', 'ESR थोड़ा बढ़ा हुआ है। यह सर्दी-जुकाम या हल्के इन्फेक्शन से हो सकता है। घबराने की ज़रूरत नहीं है।', 'ESRはやや上昇しています。最近の風邪や軽い感染症が原因の可能性があります。心配する必要はありません。'), category: 'CBC' },
      { name: 'WBC Count', value: 11200, unit: '/cumm', referenceMin: 4000, referenceMax: 11000, status: 'borderline',
        explanation: getExplanation('WBC is slightly elevated, suggesting your body is fighting a mild infection.', 'WBC थोड़ा ज़्यादा है। शरीर किसी हल्के इन्फेक्शन से लड़ रहा है।', 'WBCがやや上昇しており、体が軽い感染症と戦っている可能性があります。'), category: 'CBC' },
      { name: 'RBC Count', value: 5.1, unit: 'million/cumm', referenceMin: 4.5, referenceMax: 5.5, status: 'normal',
        explanation: getExplanation('RBC count is perfectly normal.', 'RBC सामान्य है।', 'RBC数は完全に正常です。'), category: 'CBC' },
      { name: 'Platelet Count', value: 250000, unit: '/cumm', referenceMin: 150000, referenceMax: 400000, status: 'normal',
        explanation: getExplanation('Platelet count is normal.', 'प्लेटलेट काउंट सामान्य है।', '血小板数は正常です。'), category: 'CBC' },
      { name: 'Fasting Blood Sugar', value: 105, unit: 'mg/dL', referenceMin: 70, referenceMax: 100, status: 'borderline',
        explanation: getExplanation('Fasting sugar is slightly elevated (pre-diabetic range). Watch your diet and exercise regularly.', 'शुगर थोड़ी बढ़ी हुई है (प्री-डायबिटिक रेंज)। खान-पान में ध्यान दें।', '空腹時血糖値がやや高めです（前糖尿病範囲）。食事に注意し、定期的に運動してください。'), category: 'Diabetes' },
      { name: 'HbA1c', value: 5.4, unit: '%', referenceMin: 4, referenceMax: 5.7, status: 'normal',
        explanation: getExplanation('HbA1c is normal. Your 3-month average blood sugar is fine.', 'HbA1c सामान्य है। पिछले 3 महीनों की औसत शुगर ठीक है।', 'HbA1cは正常です。過去3ヶ月의平均血糖値は問題ありません。'), category: 'Diabetes' },
      { name: 'Total Cholesterol', value: 215, unit: 'mg/dL', referenceMin: 0, referenceMax: 200, status: 'borderline',
        explanation: getExplanation('Cholesterol is slightly elevated. Reduce fried foods and exercise more.', 'कोलेस्ट्रॉल थोड़ा बढ़ा है। तला-भुना कम करें।', 'コレステロールがやや高めです。揚げ物を減らし、運動を増やしてください。'), category: 'Lipid' },
      { name: 'HDL Cholesterol', value: 55, unit: 'mg/dL', referenceMin: 40, referenceMax: 60, status: 'normal',
        explanation: getExplanation('HDL (good cholesterol) is normal.', 'HDL (अच्छा कोलेस्ट्रॉल) सामान्य है।', 'HDL（善玉コレステロール）は正常です。'), category: 'Lipid' },
      { name: 'SGPT (ALT)', value: 32, unit: 'U/L', referenceMin: 7, referenceMax: 56, status: 'normal',
        explanation: getExplanation('Liver function is normal.', 'लिवर फंक्शन सामान्य है।', '肝機能は正常です。'), category: 'Liver' },
      { name: 'Creatinine', value: 1.0, unit: 'mg/dL', referenceMin: 0.7, referenceMax: 1.3, status: 'normal',
        explanation: getExplanation('Kidney function is normal.', 'किडनी फंक्शन सामान्य है।', '腎機能は正常です。'), category: 'Kidney' },
      { name: 'TSH', value: 4.8, unit: 'mIU/L', referenceMin: 0.4, referenceMax: 4.0, status: 'borderline',
        explanation: getExplanation('TSH is mildly elevated. Recheck thyroid in 6 weeks. Likely subclinical.', 'TSH थोड़ा बढ़ा है। थायरॉइड की जांच दोबारा करवाएं 6 हफ्ते बाद।', 'TSHがやや上昇しています。6週間後に甲状腺を再検査してください。'), category: 'Thyroid' },
      { name: 'Vitamin D', value: 18, unit: 'ng/mL', referenceMin: 30, referenceMax: 100, status: 'critical',
        explanation: getExplanation('Vitamin D is deficient. Take supplements as prescribed. Get 20 min of sunlight daily.', 'विटामिन D बहुत कम है। डॉक्टर से सप्लीमेंट लें। धूप में 20 मिनट बैठें।', 'ビタミンDが不足しています。処方されたサプリメントを服用し、毎日20分の日光浴をしてください。'), category: 'Vitamin' },
      { name: 'Vitamin B12', value: 350, unit: 'pg/mL', referenceMin: 200, referenceMax: 900, status: 'normal',
        explanation: getExplanation('Vitamin B12 is normal.', 'विटामिन B12 सामान्य है।', 'ビタミンB12は正常です。'), category: 'Vitamin' }
    ],
    summary: getExplanation(
      'Overall report is mostly normal. A few values are mildly elevated, likely due to recent infection and lifestyle factors. Vitamin D is deficient - take supplements. This is NOT a diagnosis.',
      'कुल मिलाकर रिपोर्ट ठीक है। कुछ वैल्यूज़ थोड़ी बढ़ी हुई हैं जो हल्के इन्फेक्शन और लाइफस्टाइल से जुड़ी हैं। विटामिन D की कमी है - सप्लीमेंट लें। यह डायग्नोसिस नहीं है।',
      '全体的にレポートはほぼ正常です。いくつかの値が軽度に上昇していますが、最近の感染症やライフスタイル要因によるものと思われます。ビタミンDが不足しています。これは診断ではありません。'
    ),
    overallStatus: 'attention',
    doctorRecommendation: getExplanation(
      'See doctor for Vitamin D supplements. Recheck TSH in 6 weeks. Rest is fine. No emergency.',
      'विटामिन D सप्लीमेंट के लिए डॉक्टर से मिलें। 6 हफ्ते बाद TSH दोबारा चेक करवाएं। बाकी सब ठीक है।',
      'ビタミンDサプリメントについて医師に相談してください。6週間後にTSHを再検査してください。それ以外は問題ありません।'
    )
  };
}

module.exports = { analyzeReportWithVision, analyzeReportFromText, getDemoAnalysis };
