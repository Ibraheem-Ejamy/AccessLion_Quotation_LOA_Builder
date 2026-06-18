import React, { useState } from 'react';
import { LayoutDashboard, FileSignature } from 'lucide-react';
import QuotationBuilder from './QuotationBuilder';
import LOABuilder from './LOABuilder';
import alLogo from './assets/AL_Logo.png';

export default function App() {
  const [activeTab, setActiveTab] = useState('quotation');

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col font-sans">
      {/* GLOBAL MASTER NAVIGATION (Hidden on Print) */}
      <div className="no-print bg-slate-950 border-b border-slate-800 p-3 shadow-md z-50">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <img src={alLogo} alt="Access Lion Logo" className="h-8 object-contain" />
            <div className="text-amber-500 font-bold text-lg md:text-xl tracking-widest uppercase">
              {activeTab === 'quotation' ? 'Access Lion Quotation Builder' : 'Access Lion LOA Builder'}
            </div>
          </div>
          <div className="flex bg-slate-900 border border-slate-800 rounded-xl p-1 shadow-inner">
            <button
              onClick={() => setActiveTab('quotation')}
              className={`flex items-center gap-2 px-6 py-2 rounded-lg font-bold text-sm transition-all ${activeTab === 'quotation'
                  ? 'bg-amber-500 text-slate-950 shadow-md'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              Quotation Builder
            </button>
            <button
              onClick={() => setActiveTab('loa')}
              className={`flex items-center gap-2 px-6 py-2 rounded-lg font-bold text-sm transition-all ${activeTab === 'loa'
                  ? 'bg-amber-500 text-slate-950 shadow-md'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                }`}
            >
              <FileSignature className="w-4 h-4" />
              LOA Form Builder
            </button>
          </div>
        </div>
      </div>

      {/* RENDER ACTIVE BUILDER */}
      <div className="flex-1 w-full">
        {activeTab === 'quotation' ? <QuotationBuilder /> : <LOABuilder />}
      </div>
    </div>
  );
}
