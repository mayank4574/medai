const { generateExplanation, normalizeBiomarkerName } = require('../services/explanationEngine');

const GLOBAL_DISCLAIMER = "This interpretation is for educational purposes only and is not a medical diagnosis. Please consult a qualified healthcare professional for medical advice.";

describe('Explanation Engine', () => {

  describe('Biomarker Normalization', () => {
    it('normalizes common aliases correctly', () => {
      expect(normalizeBiomarkerName('Hb')).toBe('Hemoglobin');
      expect(normalizeBiomarkerName('HGB')).toBe('Hemoglobin');
      expect(normalizeBiomarkerName('WBC Count')).toBe('WBC');
      expect(normalizeBiomarkerName('Platelets')).toBe('Platelet Count');
      expect(normalizeBiomarkerName('Neutrophil %')).toBe('Neutrophils');
    });

    it('returns formatted unknown parameter', () => {
      expect(normalizeBiomarkerName('unknown factor x')).toBe('Unknown factor x');
    });
  });

  describe('Explanation Generation', () => {
    it('returns normal explanation for a known biomarker', () => {
      const result = generateExplanation({
        name: 'Hb',
        value: 14.5,
        range: '13.0 - 17.0',
        status: 'normal'
      });
      expect(result).toContain('Hemoglobin is the protein');
      expect(result).toContain('healthy oxygen transport');
      expect(result).toContain(GLOBAL_DISCLAIMER);
    });

    it('returns high explanation based on status parsing', () => {
      const result = generateExplanation({
        name: 'WBC',
        value: 15.0,
        range: '4.0 - 11.0',
        status: 'critical'
      });
      expect(result).toContain('A high count (leukocytosis) typically indicates');
      expect(result).toContain(GLOBAL_DISCLAIMER);
    });

    it('returns low explanation based on status parsing', () => {
      const result = generateExplanation({
        name: 'Platelets',
        value: 100,
        range: '150 - 450',
        status: 'critical' // engine uses value < range min to deduce "low"
      });
      expect(result).toContain('A low count (thrombocytopenia) can increase the risk of bleeding');
      expect(result).toContain(GLOBAL_DISCLAIMER);
    });

    it('generates a safe fallback for unknown biomarkers', () => {
      const result = generateExplanation({
        name: 'XYZ Factor',
        value: 42,
        range: '10 - 30',
        status: 'high'
      });
      expect(result).toContain('Your XYZ Factor value is 42.');
      expect(result).toContain('The reference range is 10 - 30.');
      expect(result).toContain('This result is currently classified as high.');
      expect(result).toContain('A detailed interpretation for this biomarker is not yet available. Please consult a healthcare professional for personalized medical guidance.');
      // Fallbacks do not append the global disclaimer because they have their own.
      expect(result).not.toContain(GLOBAL_DISCLAIMER);
    });
  });
});
