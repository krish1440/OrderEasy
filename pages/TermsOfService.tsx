import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Scale } from 'lucide-react';

const TermsOfService: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl w-full bg-white rounded-2xl shadow-xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-br from-brand-600 to-indigo-900 p-8 text-white relative">
          <button
            onClick={() => navigate(-1)}
            className="absolute top-8 right-8 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors backdrop-blur-sm flex items-center gap-2"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Go Back</span>
          </button>
          
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
              <Scale className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold">Terms of Service</h1>
          </div>
          <p className="text-brand-100">Last updated: {new Date().toLocaleDateString()}</p>
        </div>

        {/* Content */}
        <div className="p-8 prose prose-slate max-w-none text-slate-600">
          <h2 className="text-xl font-bold text-slate-800 mb-4">1. Acceptance of Terms</h2>
          <p className="mb-6">
            By accessing and using OrderEasy, you accept and agree to be bound by the terms and provision of this agreement. Any participation in this service will constitute acceptance of this agreement.
          </p>

          <h2 className="text-xl font-bold text-slate-800 mb-4">2. Description of Service</h2>
          <p className="mb-6">
            OrderEasy provides an AI-powered B2B order management and analytics platform. We reserve the right to modify, suspend or discontinue the Service with or without notice at any time and without any liability to you.
          </p>

          <h2 className="text-xl font-bold text-slate-800 mb-4">3. User Conduct</h2>
          <p className="mb-6">
            You agree not to use the Service for any illegal or unauthorized purpose. You must not, in the use of the Service, violate any laws in your jurisdiction (including but not limited to copyright or trademark laws).
          </p>

          <h2 className="text-xl font-bold text-slate-800 mb-4">4. Data Privacy and AI Forecasting</h2>
          <p className="mb-6">
            Your organizational data is protected and strictly segregated. AI forecasting modules use anonymized mathematical aggregations and your specific dataset to generate projections. OrderEasy does not share your business intelligence with third-party organizations.
          </p>
          
          <h2 className="text-xl font-bold text-slate-800 mb-4">5. Modifications to Terms</h2>
          <p className="mb-6">
            We reserve the right to modify these terms at any time. We do so by posting and drawing attention to the updated terms on the Site. Your decision to continue to visit and make use of the Site after such changes have been made constitutes your formal acceptance of the new Terms of Service.
          </p>
        </div>
      </div>
    </div>
  );
};

export default TermsOfService;
