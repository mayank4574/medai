const GLOBAL_DISCLAIMER = "This interpretation is for educational purposes only and is not a medical diagnosis. Please consult a qualified healthcare professional for medical advice.";

// 1. Biomarker Normalization Layer
const normalizeBiomarkerName = (rawName) => {
  if (!rawName) return '';
  const lowerName = rawName.toLowerCase().trim();

  // CBC
  if (lowerName.match(/^(hb|hgb|hemoglobin|haemoglobin)$/i)) return 'Hemoglobin';
  if (lowerName.match(/^(rbc|red blood cell count|red blood cells)$/i)) return 'RBC';
  if (lowerName.match(/^(wbc|wbc count|white blood cell count|white blood cells|leukocyte count)$/i)) return 'WBC';
  if (lowerName.match(/^(platelets|platelet count|plt)$/i)) return 'Platelet Count';
  if (lowerName.match(/^(hematocrit|hct|pcv|packed cell volume)$/i)) return 'Hematocrit';
  if (lowerName.match(/^(mcv|mean corpuscular volume)$/i)) return 'MCV';
  if (lowerName.match(/^(mch|mean corpuscular hemoglobin)$/i)) return 'MCH';
  if (lowerName.match(/^(mchc|mean corpuscular hgb conc)$/i)) return 'MCHC';
  if (lowerName.match(/^(rdw|rdw-cv|red cell distribution width)$/i)) return 'RDW';
  
  // WBC Differentials
  if (lowerName.match(/^(neutrophils|neutrophil %|polymorphs|segs)$/i)) return 'Neutrophils';
  if (lowerName.match(/^(lymphocytes|lymphocyte %|lymphs)$/i)) return 'Lymphocytes';
  if (lowerName.match(/^(monocytes|monocyte %|monos)$/i)) return 'Monocytes';
  if (lowerName.match(/^(eosinophils|eosinophil %|eos)$/i)) return 'Eosinophils';
  if (lowerName.match(/^(basophils|basophil %|basos)$/i)) return 'Basophils';

  // Inflammatory
  if (lowerName.match(/^(esr|erythrocyte sedimentation rate)$/i)) return 'ESR';
  if (lowerName.match(/^(crp|c-reactive protein|hs-crp)$/i)) return 'CRP';

  // Diabetes
  if (lowerName.match(/^(glucose|fbs|fasting blood sugar|blood sugar fasting|ppbs|random blood sugar)$/i)) return 'Glucose';
  if (lowerName.match(/^(hba1c|glycated hemoglobin|a1c)$/i)) return 'HbA1c';

  // Lipid
  if (lowerName.match(/^(total cholesterol|cholesterol|serum cholesterol)$/i)) return 'Total Cholesterol';
  if (lowerName.match(/^(hdl|hdl cholesterol|high density lipoprotein)$/i)) return 'HDL';
  if (lowerName.match(/^(ldl|ldl cholesterol|low density lipoprotein)$/i)) return 'LDL';
  if (lowerName.match(/^(triglycerides|tg|serum triglycerides)$/i)) return 'Triglycerides';
  if (lowerName.match(/^(vldl|vldl cholesterol)$/i)) return 'VLDL';

  // Liver
  if (lowerName.match(/^(ast|sgot|aspartate aminotransferase)$/i)) return 'AST';
  if (lowerName.match(/^(alt|sgpt|alanine aminotransferase)$/i)) return 'ALT';
  if (lowerName.match(/^(alp|alkaline phosphatase)$/i)) return 'ALP';
  if (lowerName.match(/^(bilirubin total|total bilirubin)$/i)) return 'Total Bilirubin';
  if (lowerName.match(/^(albumin|serum albumin)$/i)) return 'Albumin';
  if (lowerName.match(/^(globulin|serum globulin)$/i)) return 'Globulin';

  // Kidney
  if (lowerName.match(/^(creatinine|serum creatinine)$/i)) return 'Creatinine';
  if (lowerName.match(/^(bun|blood urea nitrogen|urea)$/i)) return 'BUN';
  if (lowerName.match(/^(uric acid|serum uric acid)$/i)) return 'Uric Acid';
  if (lowerName.match(/^(egfr|estimated glomerular filtration rate)$/i)) return 'eGFR';

  // Return formatted original if unknown
  return rawName.charAt(0).toUpperCase() + rawName.slice(1);
};

// 2. Medical Dictionary
const medicalDictionary = {
  'Hemoglobin': {
    normal: 'Hemoglobin is the protein in red blood cells that carries oxygen to your body\'s organs and tissues. Your value is within the normal reference range, indicating healthy oxygen transport.',
    high: 'Hemoglobin measures the oxygen-carrying protein in the blood. Elevated levels may indicate dehydration, living at high altitudes, smoking, or conditions like polycythemia vera.',
    low: 'Hemoglobin measures the oxygen-carrying protein in the blood. Low levels indicate anemia, which can be caused by iron deficiency, vitamin deficiencies, blood loss, or chronic diseases.'
  },
  'RBC': {
    normal: 'Red Blood Cells (RBC) carry oxygen from your lungs to the rest of your body. Your count is within the healthy reference range.',
    high: 'Red Blood Cells (RBC) carry oxygen to tissues. An elevated count (erythrocytosis) may be due to dehydration, smoking, lung or heart disease, or polycythemia.',
    low: 'Red Blood Cells (RBC) carry oxygen to tissues. A decreased count indicates anemia, potentially caused by blood loss, nutritional deficiencies, or bone marrow issues.'
  },
  'WBC': {
    normal: 'White Blood Cells (WBC) are a crucial part of your immune system, fighting infections. Your count is within the normal range, indicating a balanced immune state.',
    high: 'White Blood Cells (WBC) fight infections. A high count (leukocytosis) typically indicates an active infection, inflammation, physical stress, or a reaction to medication.',
    low: 'White Blood Cells (WBC) fight infections. A low count (leukopenia) suggests a weakened immune system, which could be due to viral infections, certain medications, or bone marrow disorders.'
  },
  'Platelet Count': {
    normal: 'Platelets are cell fragments that help your blood clot to stop bleeding. Your count is normal, indicating healthy clotting capacity.',
    high: 'Platelets help blood clot. A high count (thrombocytosis) may be a reactive response to inflammation, infection, iron deficiency, or a primary bone marrow disorder.',
    low: 'Platelets help blood clot. A low count (thrombocytopenia) can increase the risk of bleeding or bruising, and may be caused by viral infections, medications, or autoimmune conditions.'
  },
  'Hematocrit': {
    normal: 'Hematocrit measures the proportion of your blood made up of red blood cells. Your value falls within the healthy reference range.',
    high: 'Hematocrit measures the percentage of red blood cells in your blood. High values usually result from dehydration, lung/heart conditions, or smoking.',
    low: 'Hematocrit measures the percentage of red blood cells. Low values indicate anemia, meaning there are fewer red blood cells available to carry oxygen.'
  },
  'Neutrophils': {
    normal: 'Neutrophils are the most abundant type of white blood cell, acting as the first responders to bacterial infections. Your levels are normal.',
    high: 'Neutrophils are immune cells that fight bacteria. Elevated levels (neutrophilia) commonly indicate an active bacterial infection, acute stress, or inflammation.',
    low: 'Neutrophils are immune cells. Low levels (neutropenia) make you more susceptible to infections and can be caused by viral illnesses, medications, or autoimmune disorders.'
  },
  'Lymphocytes': {
    normal: 'Lymphocytes are white blood cells crucial for fighting viral infections and producing antibodies. Your levels are within the healthy range.',
    high: 'Lymphocytes fight viral infections. A high count (lymphocytosis) typically points to a recent or active viral infection (like the flu or mononucleosis).',
    low: 'Lymphocytes fight viral infections. A low count (lymphocytopenia) can result from recent acute infections, intense physical stress, autoimmune diseases, or certain medications.'
  },
  'Monocytes': {
    normal: 'Monocytes are white blood cells that help break down bacteria and clear cellular debris. Your count is perfectly normal.',
    high: 'Monocytes help fight chronic infections and clear debris. High levels (monocytosis) may indicate a chronic infection, autoimmune disorder, or recovery phase of an illness.',
    low: 'Monocytes help clear cellular debris. Low levels are generally not medically significant on their own but can occasionally occur in bone marrow disorders.'
  },
  'Eosinophils': {
    normal: 'Eosinophils are white blood cells involved in allergic responses and fighting parasitic infections. Your levels are within the normal range.',
    high: 'Eosinophils are involved in allergic responses. High levels (eosinophilia) strongly suggest an allergic reaction, asthma, eczema, or a parasitic infection.',
    low: 'Eosinophils handle allergies and parasites. A low count is generally considered normal and has no major clinical significance.'
  },
  'Basophils': {
    normal: 'Basophils are white blood cells involved in inflammatory and allergic reactions. Your levels are normal.',
    high: 'Basophils are involved in allergic and inflammatory reactions. Elevated levels are rare but can occur in severe allergic responses or certain inflammatory conditions.',
    low: 'Basophils handle inflammatory responses. A low count is considered completely normal since they exist in very small numbers in healthy individuals.'
  },
  'MCV': {
    normal: 'Mean Corpuscular Volume (MCV) measures the average size of your red blood cells. Your cells are of normal size (normocytic).',
    high: 'Mean Corpuscular Volume (MCV) measures red blood cell size. A high value (macrocytosis) often indicates a deficiency in Vitamin B12 or Folate, or may be related to liver disease.',
    low: 'Mean Corpuscular Volume (MCV) measures red blood cell size. A low value (microcytosis) most commonly indicates iron deficiency anemia or thalassemia.'
  },
  'MCH': {
    normal: 'Mean Corpuscular Hemoglobin (MCH) measures the average amount of hemoglobin per red blood cell. Your value is normal.',
    high: 'Mean Corpuscular Hemoglobin (MCH) measures hemoglobin per red blood cell. High values typically correlate with macrocytic anemias (like B12/folate deficiency).',
    low: 'Mean Corpuscular Hemoglobin (MCH) measures hemoglobin per red blood cell. Low values usually indicate iron deficiency or chronic blood loss.'
  },
  'MCHC': {
    normal: 'MCHC measures the concentration of hemoglobin in a given volume of red blood cells. Your value is within the healthy reference range.',
    high: 'MCHC measures the concentration of hemoglobin inside red blood cells. High values are uncommon but can occur in conditions like hereditary spherocytosis.',
    low: 'MCHC measures hemoglobin concentration. Low values (hypochromia) mean red blood cells are paler than usual, commonly seen in iron deficiency anemia.'
  },
  'RDW': {
    normal: 'Red Cell Distribution Width (RDW) measures the variation in size of your red blood cells. Your cells are uniform in size.',
    high: 'RDW measures the variation in red blood cell size. A high value indicates cells are of varying sizes (anisocytosis), which is a very early indicator of iron, B12, or folate deficiency.',
    low: 'RDW measures red blood cell size variation. A low value indicates cells are very uniform in size and is generally not a cause for clinical concern.'
  },
  'ESR': {
    normal: 'Erythrocyte Sedimentation Rate (ESR) is a marker of inflammation in the body. Your normal value suggests no active systemic inflammation.',
    high: 'ESR measures how fast red blood cells settle in a test tube, indicating systemic inflammation. High levels can result from infections, autoimmune diseases, or chronic inflammation.',
    low: 'ESR is an inflammation marker. A low value is perfectly normal and indicates an absence of active systemic inflammation.'
  },
  'CRP': {
    normal: 'C-Reactive Protein (CRP) is a direct marker of acute inflammation. Your value is normal, indicating an absence of active inflammation or infection.',
    high: 'C-Reactive Protein (CRP) is produced by the liver in response to inflammation. High levels indicate an active infection, tissue injury, or an inflammatory condition.',
    low: 'C-Reactive Protein (CRP) measures inflammation. A low level is ideal and means there is no active inflammatory process detected.'
  },
  'Glucose': {
    normal: 'Glucose is the primary sugar in your blood used for energy. Your value is within the normal range, indicating healthy carbohydrate metabolism.',
    high: 'Glucose is your primary blood sugar. Elevated levels (hyperglycemia) indicate impaired glucose tolerance, insulin resistance, or diabetes.',
    low: 'Glucose is your primary blood sugar. Low levels (hypoglycemia) can cause dizziness and fatigue, and may occur from fasting, intense exercise, or certain medications.'
  },
  'HbA1c': {
    normal: 'HbA1c measures your average blood sugar levels over the past 3 months. Your value is normal, ruling out diabetes or prediabetes.',
    high: 'HbA1c reflects a 3-month average of your blood sugar. High values indicate poor blood sugar control and are used to diagnose and monitor prediabetes or diabetes.',
    low: 'HbA1c reflects a 3-month average of your blood sugar. Low values are uncommon but can be seen in conditions that rapidly turn over red blood cells.'
  },
  'Total Cholesterol': {
    normal: 'Total Cholesterol measures the overall amount of cholesterol in your blood. Your level is within the healthy target range.',
    high: 'Total Cholesterol measures all circulating blood fats. High levels increase the risk of plaque buildup in arteries, raising the risk for heart disease or stroke.',
    low: 'Total Cholesterol measures blood fats. Extremely low levels are rare but can be associated with severe malnutrition, malabsorption, or hyperthyroidism.'
  },
  'HDL': {
    normal: 'HDL is the "good" cholesterol that helps remove excess plaque from your arteries. Your levels are at a healthy, protective range.',
    high: 'HDL is the "good" cholesterol. High levels are generally considered beneficial and highly protective against cardiovascular disease.',
    low: 'HDL is the "good" cholesterol. Low levels increase your risk of cardiovascular disease as your body has less ability to clear harmful plaque from arteries.'
  },
  'LDL': {
    normal: 'LDL is the "bad" cholesterol that can build up in blood vessels. Your levels are within the healthy, optimal range.',
    high: 'LDL is the "bad" cholesterol. High levels lead to the buildup of fatty plaques in your arteries (atherosclerosis), significantly increasing heart disease risk.',
    low: 'LDL is the "bad" cholesterol. Low levels are excellent for cardiovascular health and greatly reduce the risk of heart disease.'
  },
  'Triglycerides': {
    normal: 'Triglycerides are a type of fat found in your blood, used for energy. Your levels are within the healthy range.',
    high: 'Triglycerides are blood fats used for energy. High levels are linked to a diet high in sugars and carbs, obesity, and an increased risk of heart disease.',
    low: 'Triglycerides are blood fats. Low levels are perfectly normal and typically indicate a healthy metabolism or a low-fat diet.'
  },
  'VLDL': {
    normal: 'VLDL carries triglycerides through your bloodstream. Your levels are normal, indicating healthy lipid transport.',
    high: 'VLDL carries triglycerides in the blood. High levels contribute to plaque buildup in the arteries and are strongly associated with heart disease risk.',
    low: 'VLDL carries triglycerides. Low levels are normal and beneficial for cardiovascular health.'
  },
  'AST': {
    normal: 'AST is an enzyme found mostly in the liver and heart. Your normal levels indicate healthy liver and muscle function.',
    high: 'AST is a liver and muscle enzyme. Elevated levels suggest liver injury, muscle damage, intense physical exertion, or heart issues.',
    low: 'AST is a liver enzyme. Low levels are considered completely normal and healthy.'
  },
  'ALT': {
    normal: 'ALT is an enzyme found primarily in the liver. Your value is within the normal range, indicating healthy liver tissue.',
    high: 'ALT is a specific liver enzyme. Elevated levels are a strong indicator of liver cell damage, inflammation (hepatitis), or a fatty liver.',
    low: 'ALT is a liver enzyme. Low levels are healthy and indicate normal liver function.'
  },
  'ALP': {
    normal: 'Alkaline Phosphatase (ALP) is an enzyme found in the liver and bones. Your normal value indicates healthy liver and bone metabolism.',
    high: 'ALP is an enzyme found in the liver and bones. High levels can indicate bile duct obstruction, liver disease, or rapid bone growth/disorders.',
    low: 'ALP is a liver/bone enzyme. Low levels are rare but can be seen in zinc deficiency or malnutrition.'
  },
  'Total Bilirubin': {
    normal: 'Bilirubin is a yellowish pigment made during the breakdown of red blood cells. Your levels are normal, indicating the liver is clearing it efficiently.',
    high: 'Bilirubin is produced by breaking down red blood cells. High levels can cause jaundice (yellowing of skin) and suggest liver dysfunction, bile duct blockage, or hemolysis.',
    low: 'Bilirubin is a waste product. Low levels have no clinical significance and are completely normal.'
  },
  'Albumin': {
    normal: 'Albumin is the main protein produced by the liver, keeping fluid from leaking out of blood vessels. Your levels are completely normal.',
    high: 'Albumin is a liver protein. High levels are almost always a simple sign of dehydration.',
    low: 'Albumin is a liver protein. Low levels can indicate liver disease, kidney damage, chronic inflammation, or poor nutritional status.'
  },
  'Globulin': {
    normal: 'Globulins are a group of proteins important for immune function and blood clotting. Your levels are within the normal reference range.',
    high: 'Globulins are immune-related proteins. High levels often indicate an active infection, an inflammatory disease, or an autoimmune disorder.',
    low: 'Globulins are immune-related proteins. Low levels may suggest liver or kidney disease, or a compromised immune system.'
  },
  'Creatinine': {
    normal: 'Creatinine is a waste product from normal muscle breakdown that is filtered by your kidneys. Your normal value indicates healthy kidney filtration.',
    high: 'Creatinine is a muscle waste product filtered by the kidneys. High levels typically indicate impaired kidney function or severe dehydration.',
    low: 'Creatinine is a muscle waste product. Low levels generally indicate low muscle mass or reduced protein intake, rather than kidney damage.'
  },
  'BUN': {
    normal: 'Blood Urea Nitrogen (BUN) measures urea, a waste product of protein breakdown filtered by the kidneys. Your value is normal.',
    high: 'BUN measures urea waste filtered by the kidneys. High levels indicate reduced kidney function, dehydration, or a high-protein diet.',
    low: 'BUN measures urea waste. Low levels are common and can be seen in a low-protein diet, severe liver damage, or overhydration.'
  },
  'Uric Acid': {
    normal: 'Uric Acid is a waste product formed from the breakdown of purines in food. Your value is normal, indicating balanced production and excretion.',
    high: 'Uric Acid is a waste product. High levels (hyperuricemia) can lead to crystal formation in joints (gout) or kidney stones.',
    low: 'Uric Acid is a waste product. Low levels are uncommon and typically of no clinical concern, or may result from certain medications.'
  },
  'eGFR': {
    normal: 'Estimated Glomerular Filtration Rate (eGFR) is the best overall measure of your kidney function. Your score indicates healthy filtering capacity.',
    high: 'eGFR measures kidney filtering capacity. Values above the standard reference simply indicate excellent, healthy kidney function.',
    low: 'eGFR measures kidney filtering capacity. A low score indicates the kidneys are not filtering waste efficiently, which is the hallmark of chronic kidney disease.'
  }
};

/**
 * Generates a medically accurate explanation for a given biomarker.
 * @param {Object} params
 * @param {string} params.name Raw biomarker name from OCR
 * @param {number|string} params.value Patient value
 * @param {string} params.range Reference range
 * @param {string} params.status 'normal', 'borderline', 'critical' (or 'high'/'low')
 * @returns {string} The final medical explanation
 */
const generateExplanation = ({ name, value, range, status }) => {
  const normalizedName = normalizeBiomarkerName(name);
  const dictEntry = medicalDictionary[normalizedName];

  // Convert status to dictionary keys (normal, high, low)
  // 'borderline' acts as either high or low depending on context, but typically we treat anything non-normal as abnormal.
  // Since OCR doesn't strictly give us 'high' or 'low' efficiently sometimes, we will check if it's normal.
  // If it's borderline/critical, we assume 'high' for now unless we have specific high/low parsing.
  // Actually, standard status is 'normal', 'borderline', 'critical'. 
  // Let's deduce high vs low by checking if value is < referenceMin or > referenceMax.
  // If we can't parse limits, default to 'high' explanation as a safe generalized abnormal statement, 
  // or use a generic abnormal phrasing if the dictionary allows.
  
  let interpretationKey = 'normal';
  if (status !== 'normal') {
    // Attempt to guess if it's high or low by parsing range
    if (range && value) {
      const match = range.match(/([0-9.]+)\s*-\s*([0-9.]+)/);
      if (match) {
        const min = parseFloat(match[1]);
        if (parseFloat(value) < min) {
          interpretationKey = 'low';
        } else {
          interpretationKey = 'high';
        }
      } else {
        // If range format is < 50
        if (range.includes('<') && status !== 'normal') interpretationKey = 'high';
        else if (range.includes('>') && status !== 'normal') interpretationKey = 'low';
        else interpretationKey = 'high'; // fallback
      }
    } else {
      interpretationKey = 'high'; // fallback if no range
    }
  }

  let explanation = '';

  if (dictEntry && dictEntry[interpretationKey]) {
    explanation = dictEntry[interpretationKey];
  } else {
    // 3. Strict safe fallback for unknown biomarkers
    explanation = `Your ${normalizedName || name} value is ${value || 'N/A'}. The reference range is ${range || 'N/A'}. This result is currently classified as ${status || 'unknown'}. A detailed interpretation for this biomarker is not yet available. Please consult a healthcare professional for personalized medical guidance.`;
    return explanation; // Return early to avoid duplicating disclaimer since fallback includes one
  }

  // 4. Append Global Disclaimer if abnormal
  // Wait, requirement: "7. Add a global disclaimer: 'This interpretation is for educational purposes only and is not a medical diagnosis. Please consult a qualified healthcare professional for medical advice.'"
  // "Appended to EVERYTHING" or just abnormal? Requirement says "Add a global disclaimer". It implies to all explanations.
  
  explanation += ` ${GLOBAL_DISCLAIMER}`;

  return explanation;
};

module.exports = {
  generateExplanation,
  normalizeBiomarkerName
};
