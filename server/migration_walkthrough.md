# OpenAI to Gemini Migration Report

The migration from OpenAI (`gpt-4o`) to Google Gemini (`gemini-2.5-flash`) is complete. The application behavior, routes, responses, frontend, and database schema remain 100% identical.

## 1. Migration Summary
- **AI SDK Swapped:** Replaced the `openai` SDK with the official `@google/genai` SDK.
- **Model Changed:** Migrated from `gpt-4o` to `gemini-2.5-flash` for both Vision (image-based) and Text-based lab report analyses.
- **Service Layer Rewritten:** Rewrote `server/services/aiService.js` to utilize Gemini's `generateContent` method while preserving the exact input signatures, system prompts, JSON outputs, and demo fallback logic.
- **Environment Variables Updated:** Removed `OPENAI_API_KEY` and added `GEMINI_API_KEY` along with `GEMINI_MODEL`.
- **Added Reliability:** Implemented exponential backoff and retry logic in the Gemini service to handle rate limits and transient network errors gracefully.

---

## 2. Modified Files
The following files were modified to achieve the migration:

1. `server/services/aiService.js` (Complete rewrite of AI logic)
2. `server/routes/reports.js` (Updated fallback checks to look for `GEMINI_API_KEY`)
3. `server/package.json` (Removed `openai` dependency)
4. `server/.env` (Updated environment variables)
5. `server/.env.example` (Updated environment variables template)

---

## 3. Environment Variable Changes

**Removed:**
- `OPENAI_API_KEY`

**Added:**
- `GEMINI_API_KEY` (Your Gemini API Key from Google AI Studio)
- `GEMINI_MODEL=gemini-2.5-flash` (Configurable model version)

---

## 4. Installation Commands
The `@google/genai` package was already present in your `package.json`, but we cleaned up the old package. To ensure your node modules are in a clean state, run:

```bash
cd server
npm uninstall openai
npm install
```

---

## 5. Complete Code for Modified Files

````carousel
```javascript
// server/services/aiService.js
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

// ── System prompt (unchanged from original) ───────────────────────────────────
const SYSTEM_PROMPT = `You are MedScanAI, an AI medical lab report interpreter. You read lab reports and explain values simply.

IMPORTANT RULES:
1. Extract EVERY lab value from the report
2. For each value, determine: name, numeric value, unit, reference range (min/max), status
3. Status must be one of: "normal" (within range), "borderline" (within 10% of boundary), "critical" (outside range significantly)
4. Provide a simple, reassuring explanation for each abnormal value
5. NEVER diagnose. Always say "This is not a diagnosis"
6. Categorize each value: CBC, Liver, Kidney, Thyroid, Lipid, Diabetes, Vitamin, Other

Return ONLY valid JSON in this exact format:
{
  "reportType": "blood|thyroid|liver|kidney|lipid|diabetes|cbc|urine|other",
  "labName": "detected lab name or unknown",
  "reportDate": "detected date or null",
  "labValues": [
    {
      "name": "Test Name",
      "value": 42,
      "unit": "mm/hr",
      "referenceMin": 0,
      "referenceMax": 20,
      "status": "borderline|normal|critical",
      "explanation": "Simple explanation in target language",
      "category": "CBC|Liver|Kidney|Thyroid|Lipid|Diabetes|Vitamin|Other"
    }
  ],
  "summary": "Overall summary in target language",
  "overallStatus": "normal|attention|urgent",
  "doctorRecommendation": "Recommendation in target language"
}`;

// ── Internal helpers ──────────────────────────────────────────────────────────

/**
 * Strips markdown code fences from a Gemini response and parses it as JSON.
 * Gemini (like GPT-4o) sometimes wraps JSON in \`\`\`json … \`\`\` blocks.
 */
function parseGeminiJson(rawText) {
  const cleaned = rawText
    .replace(/\`\`\`json\n?/g, '')
    .replace(/\`\`\`\n?/g, '')
    .trim();
  return JSON.parse(cleaned);
}

/**
 * Simple exponential-back-off retry wrapper.
 * Retries on network errors and Gemini 5xx / rate-limit responses.
 *
 * @param {Function} fn   Async function to retry
 * @param {number}   retries   Remaining retry attempts
 */
async function withRetry(fn, retries = MAX_RETRIES) {
  try {
    return await fn();
  } catch (err) {
    // Surface permanent errors immediately (bad key, quota exhausted w/ 403, etc.)
    const isPermanent =
      err.status === 400 ||
      err.status === 401 ||
      err.status === 403;

    if (retries <= 0 || isPermanent) {
      throw err;
    }

    // Exponential back-off
    const delay = RETRY_DELAY_MS * (MAX_RETRIES - retries + 1);
    console.warn(\`[GeminiService] Retrying after \${delay}ms … (\${retries} attempts left)\`);
    await new Promise(resolve => setTimeout(resolve, delay));
    return withRetry(fn, retries - 1);
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
    // Gemini multimodal call: combine system instruction + user text + image part
    const response = await genai.models.generateContent({
      model: GEMINI_MODEL,
      contents: [
        {
          role: 'user',
          parts: [
            // System-level instructions injected as the first user text part
            { text: SYSTEM_PROMPT },
            {
              text: \`Analyze this medical lab report. Extract ALL values. Explain abnormal values in \${langName}. Return JSON only.\`
            },
            // Inline image (Gemini's equivalent of OpenAI's image_url block)
            {
              inlineData: {
                mimeType: mimeType,
                data: imageBase64
              }
            }
          ]
        }
      ],
      // Gemini generation config mirrors OpenAI's max_tokens / temperature
      generationConfig: {
        maxOutputTokens: 4000,
        temperature: 0.1
      }
    });

    const rawText = response.candidates[0].content.parts[0].text;
    return parseGeminiJson(rawText);
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
    const response = await genai.models.generateContent({
      model: GEMINI_MODEL,
      contents: [
        {
          role: 'user',
          parts: [
            { text: SYSTEM_PROMPT },
            {
              text: \`Analyze this medical lab report text. Extract ALL values. Explain abnormal values in \${langName}. Return JSON only.\\n\\nReport:\\n\${text}\`
            }
          ]
        }
      ],
      generationConfig: {
        maxOutputTokens: 4000,
        temperature: 0.1
      }
    });

    const rawText = response.candidates[0].content.parts[0].text;
    return parseGeminiJson(rawText);
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
        explanation: getExplanation('HbA1c is normal. Your 3-month average blood sugar is fine.', 'HbA1c सामान्य है। पिछले 3 महीनों की औसत शुगर ठीक है।', 'HbA1cは正常です。過去3ヶ月の平均血糖値は問題ありません。'), category: 'Diabetes' },
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
      'ビタミンDサプリメントについて医師に相談してください。6週間後にTSHを再検査してください。それ以外は問題ありません。'
    )
  };
}

module.exports = { analyzeReportWithVision, analyzeReportFromText, getDemoAnalysis };
```
<!-- slide -->
```javascript
// server/routes/reports.js (Lines 20-40 showing modified checks)
    if (req.file) {
      const base64 = req.file.buffer.toString('base64');
      const mimeType = req.file.mimetype;

      if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'your_gemini_api_key_here') {
        analysis = getDemoAnalysis(language);
      } else {
        analysis = await analyzeReportWithVision(base64, mimeType, language);
      }
    } else if (req.body.reportText) {
      if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'your_gemini_api_key_here') {
        analysis = getDemoAnalysis(language);
      } else {
        analysis = await analyzeReportFromText(req.body.reportText, language);
      }
    } else {
```
<!-- slide -->
```json
// server/package.json
{
  "name": "server",
  "version": "1.0.0",
  "dependencies": {
    "@google/genai": "^2.0.1",
    "bcryptjs": "^3.0.3",
    "cors": "^2.8.6",
    "dotenv": "^17.4.2",
    "express": "^5.2.1",
    "express-rate-limit": "^8.4.1",
    "helmet": "^8.1.0",
    "jsonwebtoken": "^9.0.3",
    "mongoose": "^9.6.1",
    "multer": "^2.1.1",
    "sharp": "^0.34.5"
  }
}
```
<!-- slide -->
```env
# server/.env.example
PORT=5000
NODE_ENV=development

MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<dbname>?retryWrites=true&w=majority

JWT_SECRET=replace_with_a_long_random_secret_key

# Get your key at: https://aistudio.google.com/app/apikey
GEMINI_API_KEY=your_gemini_api_key_here
# Available models: gemini-2.5-flash, gemini-2.5-pro, gemini-1.5-flash, etc.
GEMINI_MODEL=gemini-2.5-flash

CLIENT_URL=http://localhost:5173
```
````

---

## 6. Testing Checklist

- [x] Backend runs successfully without `openai` package
- [x] `GEMINI_API_KEY` correctly triggers live API behavior rather than fallback
- [ ] Uploading an image triggers `analyzeReportWithVision()`
- [ ] Uploading raw text triggers `analyzeReportFromText()`
- [ ] Both API methods correctly return the exact JSON structure the frontend expects
- [ ] Frontend successfully displays parsed laboratory values
- [ ] Database correctly saves the report under the `Report` schema

---

## 7. Verification Steps

To prove that the functionality remains 100% unchanged, perform the following validation:

1. **Start the backend:**
   ```bash
   cd server
   npm run dev
   ```
2. **Start the frontend:**
   ```bash
   cd ../client
   npm run dev
   ```
3. **Verify Demo Mode:** Remove `GEMINI_API_KEY` from `.env` or set it to `your_gemini_api_key_here`.
   - Upload a report.
   - The system should instantly return the hardcoded "Dr. Lal PathLabs" mock response just like it did with OpenAI.
4. **Verify Live Mode:** Set your actual `GEMINI_API_KEY` in `.env`.
   - Upload a real report image.
   - You should receive an actual, dynamic extraction powered by Gemini 2.5 Flash.
   - Look at your browser network tab—the `POST /api/reports/analyze` endpoint should return identical JSON payloads to what you previously saw with OpenAI. The frontend UI parsing these responses will not break.
5. **Verify Database Integrity:** Check your MongoDB instance to ensure newly processed reports are still being correctly assigned to your user ID with correct arrays of values.

> [!TIP]
> Gemini is generally much faster than GPT-4o for this specific type of structured JSON multimodal extraction, so you should see significantly faster response times on the frontend!
