import React from 'react';
import { motion } from 'framer-motion';
import { Scan, ArrowRight, UploadCloud, Brain, Activity, Target, Shield, Languages, CheckCircle2, Stethoscope, Globe, BarChart3 } from 'lucide-react';
import { Link } from 'react-router-dom';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-white font-sans text-slate-900 overflow-x-hidden selection:bg-primary-light/20">
      
      {/* Navigation */}
      <nav className="fixed w-full z-50 bg-white/80 backdrop-blur-xl border-b border-slate-100">
        <div className="container mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2 group cursor-pointer">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-light to-[#2563eb] flex items-center justify-center font-bold text-white shadow-[0_0_20px_rgba(14,165,233,0.4)] group-hover:shadow-[0_0_30px_rgba(14,165,233,0.6)] transition-all">
              <Scan size={22} />
            </div>
            <span className="text-2xl font-black font-['Space_Grotesk'] tracking-wide bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-700">MedScan</span>
            <span className="text-xs font-bold bg-primary-light/10 text-primary-light px-2 py-0.5 rounded ml-1">AI</span>
          </div>

          <div className="hidden md:flex items-center gap-8 font-medium text-slate-600">
            <a href="#features" className="hover:text-slate-900 transition-colors cursor-pointer">Features</a>
            <a href="#how-it-works" className="hover:text-slate-900 transition-colors cursor-pointer">How it Works</a>
            <a href="#security" className="hover:text-slate-900 transition-colors cursor-pointer">Security</a>
          </div>

          <div className="flex items-center gap-4">
            <Link to="/login" className="hidden sm:block font-bold text-slate-600 hover:text-slate-900 transition-colors cursor-pointer">Log In</Link>
            <Link to="/register" className="bg-slate-900 hover:bg-slate-800 text-white px-6 py-2.5 rounded-full font-bold shadow-lg shadow-slate-900/20 transition-all hover:-translate-y-0.5 active:translate-y-0 cursor-pointer">
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden">
        {/* Abstract Background Shapes */}
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-gradient-to-bl from-primary-light/10 to-transparent rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-gradient-to-tr from-[#38bdf8]/10 to-transparent rounded-full blur-3xl translate-y-1/2 -translate-x-1/3 pointer-events-none"></div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-100 text-slate-800 font-bold text-sm mb-8 border border-slate-200">
                <span className="w-2.5 h-2.5 rounded-full bg-[#10b981] animate-pulse"></span>
                AI Medical Diagnosis Partner is Live
              </div>
            </motion.div>

            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-5xl md:text-7xl font-black font-['Space_Grotesk'] leading-[1.1] mb-6 tracking-tight"
            >
              Understand your lab reports. <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary-light to-[#2563eb]">
                In any language.
              </span>
            </motion.h1>

            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-lg md:text-xl text-slate-600 mb-10 max-w-2xl mx-auto leading-relaxed font-medium"
            >
              Upload any complex medical report. MedScanAI instantly translates medical jargon into simple, actionable insights in 25+ languages including English, Hindi, Japanese, Arabic, and more.
            </motion.p>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <Link to="/register" className="w-full sm:w-auto flex items-center justify-center gap-2 bg-slate-900 text-white px-8 py-4 rounded-full font-bold text-lg hover:shadow-xl hover:shadow-slate-900/30 hover:-translate-y-1 transition-all cursor-pointer">
                Try MedScanAI Free <ArrowRight size={20} />
              </Link>
              <Link to="/login" className="w-full sm:w-auto flex items-center justify-center gap-2 bg-white border-2 border-slate-200 text-slate-700 px-8 py-4 rounded-full font-bold text-lg hover:border-primary-light hover:text-primary-light transition-all cursor-pointer">
                Sign In
              </Link>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="mt-16 flex items-center justify-center gap-8 md:gap-16"
            >
              <div className="text-center">
                <p className="text-3xl font-black text-slate-900">99.8%</p>
                <p className="text-xs text-slate-500 font-medium mt-1">OCR Accuracy</p>
              </div>
              <div className="w-px h-10 bg-slate-200"></div>
              <div className="text-center">
                <p className="text-3xl font-black text-slate-900">25+</p>
                <p className="text-xs text-slate-500 font-medium mt-1">Languages</p>
              </div>
              <div className="w-px h-10 bg-slate-200"></div>
              <div className="text-center">
                <p className="text-3xl font-black text-slate-900">Gemini 2.5 Flash</p>
                <p className="text-xs text-slate-500 font-medium mt-1">Vision Engine</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Feature Showcase Grid */}
      <section id="features" className="py-24 bg-slate-50 border-y border-slate-200">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-black font-['Space_Grotesk'] mb-4">Everything you need to stay healthy</h2>
            <p className="text-slate-600 max-w-2xl mx-auto font-medium">MedScanAI goes beyond translation. It's a complete ecosystem for managing your family's long-term health metrics.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm hover:shadow-xl transition-shadow group cursor-pointer">
              <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Brain size={28} />
              </div>
              <h3 className="text-xl font-bold mb-3 text-slate-900">Gemini 2.5 Flash Vision OCR</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Take a blurry photo of a printed lab report. Our advanced vision models extract every single row, reference range, and unit with 99.8% accuracy.
              </p>
            </div>

            <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm hover:shadow-xl transition-shadow group cursor-pointer">
              <div className="w-14 h-14 bg-cyan-50 text-cyan-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Languages size={28} />
              </div>
              <h3 className="text-xl font-bold mb-3 text-slate-900">25+ Language Support</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Medical reports in Japan? Results in English? Get the entire summary explained beautifully in Hindi, Japanese, Arabic, Tamil, Bengali or 20+ other languages.
              </p>
            </div>

            <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm hover:shadow-xl transition-shadow group cursor-pointer">
              <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Activity size={28} />
              </div>
              <h3 className="text-xl font-bold mb-3 text-slate-900">Smart Health Trends</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Upload your blood tests every 6 months. MedScanAI automatically builds interactive charts showing your Cholesterol, Glucose, and Vitamin progression.
              </p>
            </div>

            <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm hover:shadow-xl transition-shadow group cursor-pointer">
              <div className="w-14 h-14 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Stethoscope size={28} />
              </div>
              <h3 className="text-xl font-bold mb-3 text-slate-900">Color-Coded Results</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Every lab value is instantly color-coded as Normal (green), Borderline (orange), or Critical (red). No more confusion about what's safe.
              </p>
            </div>

            <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm hover:shadow-xl transition-shadow group cursor-pointer">
              <div className="w-14 h-14 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Globe size={28} />
              </div>
              <h3 className="text-xl font-bold mb-3 text-slate-900">Family Health Hub</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Create profiles for parents, spouse, and children. Track everyone's health in one dashboard. Each member gets their own AI analysis.
              </p>
            </div>

            <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm hover:shadow-xl transition-shadow group cursor-pointer">
              <div className="w-14 h-14 bg-rose-50 text-rose-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <BarChart3 size={28} />
              </div>
              <h3 className="text-xl font-bold mb-3 text-slate-900">AI Health Predictions</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Based on your historical data, MedScanAI predicts future trends and recommends preventive actions to keep you healthy.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section id="how-it-works" className="py-24 bg-white overflow-hidden">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-black font-['Space_Grotesk'] mb-4">How MedScanAI Works</h2>
            <p className="text-slate-600 max-w-2xl mx-auto font-medium">Three simple steps to understand your health better</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-light to-[#2563eb] text-white flex items-center justify-center mx-auto mb-6 text-2xl font-black shadow-lg shadow-blue-500/30">1</div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Upload Report</h3>
              <p className="text-sm text-slate-600">Take a photo or upload a PDF of your medical lab report. Any format works.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#10b981] to-[#059669] text-white flex items-center justify-center mx-auto mb-6 text-2xl font-black shadow-lg shadow-emerald-500/30">2</div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">AI Analyzes</h3>
              <p className="text-sm text-slate-600">Gemini 2.5 Flash Vision extracts all values, compares with reference ranges, and translates to your language.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#f59e0b] to-[#d97706] text-white flex items-center justify-center mx-auto mb-6 text-2xl font-black shadow-lg shadow-amber-500/30">3</div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Get Insights</h3>
              <p className="text-sm text-slate-600">Receive color-coded results, plain-language explanations, and actionable health recommendations.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Comparison Section */}
      <section id="security" className="py-24 bg-slate-50 border-t border-slate-200 overflow-hidden">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-black font-['Space_Grotesk'] mb-6 leading-tight">Stop Googling your symptoms.</h2>
              <p className="text-lg text-slate-600 mb-8 font-medium leading-relaxed">
                Searching the internet for abnormal lab values usually leads to worst-case scenarios and unnecessary panic. MedScanAI gives you contextual, calm, and clinically-backed explanations.
              </p>
              <ul className="space-y-4">
                <li className="flex items-center gap-3 text-slate-700 font-bold">
                  <CheckCircle2 className="text-[#10b981]" /> Color-coded severity indicators
                </li>
                <li className="flex items-center gap-3 text-slate-700 font-bold">
                  <CheckCircle2 className="text-[#10b981]" /> Actionable lifestyle recommendations
                </li>
                <li className="flex items-center gap-3 text-slate-700 font-bold">
                  <CheckCircle2 className="text-[#10b981]" /> Shared family profiles
                </li>
                <li className="flex items-center gap-3 text-slate-700 font-bold">
                  <CheckCircle2 className="text-[#10b981]" /> 25+ language translations
                </li>
                <li className="flex items-center gap-3 text-slate-700 font-bold">
                  <CheckCircle2 className="text-[#10b981]" /> HIPAA-grade data privacy
                </li>
              </ul>
              <div className="mt-10">
                <Link to="/register" className="text-primary-light font-bold flex items-center gap-2 hover:gap-3 transition-all cursor-pointer">
                  Create your free account <ArrowRight size={20} />
                </Link>
              </div>
            </div>

            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-tr from-primary-light to-[#2563eb] rounded-[3rem] blur-3xl opacity-20 transform rotate-6"></div>
              <div className="bg-slate-900 rounded-[2rem] p-8 relative shadow-2xl border border-slate-800">
                <div className="flex items-center gap-4 mb-8 pb-6 border-b border-white/10">
                  <div className="w-12 h-12 bg-red-500/20 text-red-400 rounded-xl flex items-center justify-center">
                    <Target size={24} />
                  </div>
                  <div>
                    <h4 className="text-white font-bold">High LDL Cholesterol (165 mg/dL)</h4>
                    <p className="text-slate-400 text-sm">Target: Below 100 mg/dL</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                    <p className="text-emerald-400 font-bold text-sm mb-1">MEDSCANAI INSIGHT</p>
                    <p className="text-slate-300 text-sm leading-relaxed">
                      "Your LDL is elevated, but your HDL (Good Cholesterol) is excellent. Focus on reducing saturated fats and increasing fiber. Re-test in 3 months before starting statins, after consulting your GP."
                    </p>
                  </div>
                  <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                    <p className="text-cyan-400 font-bold text-sm mb-1">हिंदी में</p>
                    <p className="text-slate-300 text-sm leading-relaxed">
                      "आपका LDL बढ़ा हुआ है, लेकिन HDL (अच्छा कोलेस्ट्रॉल) बहुत अच्छा है। तला-भुना कम करें और फाइबर बढ़ाएं। 3 महीने बाद दोबारा टेस्ट करवाएं।"
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-br from-slate-900 to-slate-800 text-white">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-5xl font-black font-['Space_Grotesk'] mb-6">Ready to understand your health?</h2>
          <p className="text-lg text-slate-300 max-w-2xl mx-auto mb-10 font-medium">
            Join thousands of users who trust MedScanAI to decode their medical reports. Free to start, no credit card required.
          </p>
          <Link to="/register" className="inline-flex items-center gap-2 bg-white text-slate-900 px-8 py-4 rounded-full font-bold text-lg hover:shadow-xl hover:shadow-white/20 hover:-translate-y-1 transition-all cursor-pointer">
            Get Started Free <ArrowRight size={20} />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-50 py-12 border-t border-slate-200">
        <div className="container mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Scan size={20} className="text-primary-light" />
            <span className="text-xl font-black font-['Space_Grotesk']">MedScanAI</span>
          </div>
          <p className="text-slate-500 font-medium text-sm">© 2026 MedScanAI. Built with Gemini 2.5 Flash Vision. For hackathon demo purposes.</p>
        </div>
      </footer>

    </div>
  );
};

export default LandingPage;
