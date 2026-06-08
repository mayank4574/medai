const express = require('express');
const Report = require('../models/Report');
const { protect } = require('../middleware/auth');
const upload = require('../middleware/upload');
const { analyzeReportWithVision, analyzeReportFromText, getDemoAnalysis } = require('../services/aiService');

const router = express.Router();

// POST /api/reports/analyze - Upload and analyze a report
router.post('/analyze', protect, upload.single('report'), async (req, res) => {
  try {
    const user = req.user;
    if (user.plan === 'free' && user.reportsThisMonth >= 3) {
      return res.status(403).json({ message: 'Free plan limit reached. Upgrade to Premium.' });
    }

    let analysis;
    const language = req.body.language || user.language || 'en';
    const familyMember = req.body.familyMember || 'Self';

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
      return res.status(400).json({ message: 'Please upload a report image or provide report text' });
    }

    const report = await Report.create({
      user: user._id,
      familyMemberName: familyMember,
      reportType: analysis.reportType,
      labName: analysis.labName,
      reportDate: analysis.reportDate || new Date(),
      rawOcrText: req.body.reportText || 'Image uploaded',
      labValues: analysis.labValues,
      summary: analysis.summary,
      summaryLanguage: language,
      overallStatus: analysis.overallStatus,
      doctorRecommendation: analysis.doctorRecommendation
    });

    // Increment monthly counter
    await require('../models/User').findByIdAndUpdate(user._id, { $inc: { reportsThisMonth: 1 } });

    res.status(201).json(report);
  } catch (error) {
    console.error('Analysis error:', error);
    res.status(500).json({ message: 'Failed to analyze report', error: error.message });
  }
});

// POST /api/reports/demo - Demo analysis without auth
router.post('/demo', async (req, res) => {
  try {
    const language = req.body.language || 'en';
    const analysis = getDemoAnalysis(language);
    res.json(analysis);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET /api/reports - Get user's report history
router.get('/', protect, async (req, res) => {
  try {
    const reports = await Report.find({ user: req.user._id }).sort({ createdAt: -1 }).limit(50);
    res.json(reports);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET /api/reports/:id
router.get('/:id', protect, async (req, res) => {
  try {
    const report = await Report.findOne({ _id: req.params.id, user: req.user._id });
    if (!report) return res.status(404).json({ message: 'Report not found' });
    res.json(report);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// DELETE /api/reports/:id
router.delete('/:id', protect, async (req, res) => {
  try {
    await Report.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    res.json({ message: 'Report deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET /api/reports/trends/:valueName - Get trend data for a specific lab value
router.get('/trends/:valueName', protect, async (req, res) => {
  try {
    const reports = await Report.find({ user: req.user._id }).sort({ createdAt: 1 });
    const trends = reports
      .filter(r => r.labValues.some(v => v.name === req.params.valueName))
      .map(r => {
        const val = r.labValues.find(v => v.name === req.params.valueName);
        return { date: r.reportDate || r.createdAt, value: val.value, status: val.status };
      });
    res.json(trends);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
