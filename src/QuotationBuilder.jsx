import React, { useState, useEffect, useRef } from 'react';
import defaultLogo from './assets/logo1.png';
import {
  FileText,
  Plus,
  Trash2,
  Printer,
  Download,
  Upload,
  RefreshCw,
  Settings,
  Users,
  Briefcase,
  ShieldAlert,
  FileCheck,
  CheckCircle2,
  Info,
  DollarSign
} from 'lucide-react';

export default function QuotationBuilder() {
  // --- PRESETS & INITIAL STATE ---
  const initialCompanyInfo = {
    nameEn: "ACCESS LION GENERAL CONTRACTING AND TRANSPORTING",
    nameAr: "اكسس ليون للمقاولات والنقليات العامة",
    tel: "0542811111",
    poBox: "58914",
    email: "info@access.com",
    web: "www.accesslion.ae",
    address: "Al-Dhafra Region, Madinat Zayed, Abu Dhabi U.A.E"
  };

  const initialClientInfo = {
    company: "International Gulf Petrochemical Services LLC",
    contactPerson: "Mr. S. Rajendran",
    phone: "+971542343601",
    email: "",
    address: "Abu Dhabi, U.A.E"
  };

  const initialQuoteInfo = {
    quoteNo: "QUO 009/26",
    date: "2026-06-09",
    expiryDate: "2026-07-09",
    contactPerson: "Mr./Mrs",
    contactNo: "+971 54 281 1111"
  };

  const initialItems = [
    {
      id: "1",
      description: "MAN LIFT JLG 600AJ WITHOUT OPERATOR",
      qty: 1,
      price: 8500,
      unit: "month"
    }
  ];

  const initialRentalTerms = [
    "In case the machinery is rented without operator, the renter shall bear full responsibility for the machinery during the entire rental period.",
    "In the event of any damages, accidents all resulting costs and liabilities shall be borne by the renter.",
    "The renter is obligated to settle all charges and expenses arising from damages, accidents without delay."
  ];

  const initialGeneralTerms = [
    "Need LPO/Agreement.",
    "Need LOA.",
    "VAT 5% will be added as shown in table."
  ];

  // --- STATE ---
  const [companyInfo, setCompanyInfo] = useState(initialCompanyInfo);
  const [clientInfo, setClientInfo] = useState(initialClientInfo);
  const [quoteInfo, setQuoteInfo] = useState(initialQuoteInfo);
  const [items, setItems] = useState(initialItems);
  const [rentalTerms, setRentalTerms] = useState(initialRentalTerms);
  const [generalTerms, setGeneralTerms] = useState(initialGeneralTerms);
  const [vatRate, setVatRate] = useState(5);
  const [currency, setCurrency] = useState("AED");
  const [activeTab, setActiveTab] = useState("general");
  const [customLogo, setCustomLogo] = useState(defaultLogo);
  const [statusMessage, setStatusMessage] = useState(null);
  const [designStyle, setDesignStyle] = useState("luxury-dark"); // luxury-dark, royal-gold, elegant-clean
  const fileInputRef = useRef(null);

  useEffect(() => {
    const originalTitle = document.title;
    document.title = quoteInfo.quoteNo ? `Quotation_${quoteInfo.quoteNo.replace(/\//g, '_')}` : 'Quotation';
    return () => {
      document.title = originalTitle;
    };
  }, [quoteInfo.quoteNo]);

  // --- HELPERS ---
  const showToast = (text, type = "success") => {
    setStatusMessage({ text, type });
    setTimeout(() => setStatusMessage(null), 4000);
  };

  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCustomLogo(reader.result);
        showToast("Logo updated successfully!");
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerLogoUpload = () => {
    fileInputRef.current.click();
  };

  const resetLogo = () => {
    setCustomLogo(defaultLogo);
    showToast("Reset to premium default logo crest.");
  };

  // Calculations
  const calculateSubtotal = () => {
    return items.reduce((sum, item) => sum + (item.qty * item.price), 0);
  };

  const calculateVat = () => {
    return calculateSubtotal() * (vatRate / 100);
  };

  const calculateTotal = () => {
    return calculateSubtotal() + calculateVat();
  };

  // Items Management
  const addItem = () => {
    setItems([
      ...items,
      {
        id: Date.now().toString(),
        description: "New Machinery / Service Rental",
        qty: 1,
        price: 1000,
        unit: "month"
      }
    ]);
  };

  const updateItem = (id, field, value) => {
    setItems(items.map(item => {
      if (item.id === id) {
        const val = (field === 'qty' || field === 'price') ? parseFloat(value) || 0 : value;
        return { ...item, [field]: val };
      }
      return item;
    }));
  };

  const removeItem = (id) => {
    if (items.length === 1) {
      showToast("Quotation must have at least one item.", "error");
      return;
    }
    setItems(items.filter(item => item.id !== id));
  };

  // Terms Management
  const addRentalTerm = () => {
    setRentalTerms([...rentalTerms, "New liability or rental condition statement."]);
  };

  const updateRentalTerm = (index, value) => {
    const next = [...rentalTerms];
    next[index] = value;
    setRentalTerms(next);
  };

  const removeRentalTerm = (index) => {
    setRentalTerms(rentalTerms.filter((_, i) => i !== index));
  };

  const addGeneralTerm = () => {
    setGeneralTerms([...generalTerms, "New general instruction or payment milestone."]);
  };

  const updateGeneralTerm = (index, value) => {
    const next = [...generalTerms];
    next[index] = value;
    setGeneralTerms(next);
  };

  const removeGeneralTerm = (index) => {
    setGeneralTerms(generalTerms.filter((_, i) => i !== index));
  };

  // Save/Load Config as JSON file
  const exportConfiguration = () => {
    const config = {
      companyInfo,
      clientInfo,
      quoteInfo,
      items,
      rentalTerms,
      generalTerms,
      vatRate,
      currency,
      designStyle
    };
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(config, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `${quoteInfo.quoteNo.replace(/\//g, '_')}_data.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showToast("Quotation draft exported successfully!");
  };

  const importConfiguration = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target.result);
        if (parsed.companyInfo) setCompanyInfo(parsed.companyInfo);
        if (parsed.clientInfo) setClientInfo(parsed.clientInfo);
        if (parsed.quoteInfo) setQuoteInfo(parsed.quoteInfo);
        if (parsed.items) setItems(parsed.items);
        if (parsed.rentalTerms) setRentalTerms(parsed.rentalTerms);
        if (parsed.generalTerms) setGeneralTerms(parsed.generalTerms);
        if (parsed.vatRate !== undefined) setVatRate(parsed.vatRate);
        if (parsed.currency) setCurrency(parsed.currency);
        if (parsed.designStyle) setDesignStyle(parsed.designStyle);
        showToast("Quotation data loaded successfully!");
      } catch (err) {
        showToast("Invalid JSON structure.", "error");
      }
    };
    reader.readAsText(file);
  };

  const handlePrint = () => {
    window.print();
  };

  // Convert numbers to words for luxury aesthetic
  const numberToWords = (num) => {
    const a = ['', 'One ', 'Two ', 'Three ', 'Four ', 'Five ', 'Six ', 'Seven ', 'Eight ', 'Nine ', 'Ten ', 'Eleven ', 'Twelve ', 'Thirteen ', 'Fourteen ', 'Fifteen ', 'Sixteen ', 'Seventeen ', 'Eighteen ', 'Nineteen '];
    const b = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

    if ((num = num.toString()).length > 9) return 'Amount Exceeded Limit';
    let n = ('000000000' + num).substr(-9).match(/^(\d{2})(\d{2})(\d{2})(\d{1})(\d{2})$/);
    if (!n) return '';
    let str = '';
    str += (Number(n[1]) != 0) ? (a[Number(n[1])] || b[n[1][0]] + ' ' + a[n[1][1]]) + 'Crore ' : '';
    str += (Number(n[2]) != 0) ? (a[Number(n[2])] || b[n[2][0]] + ' ' + a[n[2][1]]) + 'Lakh ' : '';
    str += (Number(n[3]) != 0) ? (a[Number(n[3])] || b[n[3][0]] + ' ' + a[n[3][1]]) + 'Thousand ' : '';
    str += (Number(n[4]) != 0) ? (a[Number(n[4])] || b[n[4][0]] + ' ' + a[n[4][1]]) + 'Hundred ' : '';
    str += (Number(n[5]) != 0) ? ((str != '') ? 'and ' : '') + (a[Number(n[5])] || b[n[5][0]] + ' ' + a[n[5][1]]) + ' ' : '';
    return str ? str + ' ' + currency + ' Only' : 'Zero ' + currency;
  };

  // SVG representation of Gold Lion logo from company design files
  const DefaultLionLogo = () => (
    <svg viewBox="0 0 400 400" className="w-20 h-20 filter drop-shadow-md">
      <defs>
        <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#DFBA73" />
          <stop offset="50%" stopColor="#C5A028" />
          <stop offset="100%" stopColor="#9A7B3E" />
        </linearGradient>
      </defs>
      <circle cx="200" cy="200" r="190" fill="none" stroke="url(#goldGrad)" strokeWidth="4" />
      <circle cx="200" cy="200" r="175" fill="none" stroke="url(#goldGrad)" strokeWidth="1" strokeDasharray="5,5" />

      {/* Golden Tribal Lion Outline Shield Concept */}
      <path
        d="M200 65 C140 65 110 110 110 170 C110 240 160 300 200 335 C240 300 290 240 290 170 C290 110 260 65 200 65 Z"
        fill="none"
        stroke="url(#goldGrad)"
        strokeWidth="3"
      />
      {/* Mane Elements */}
      <path d="M200 90 L180 120 L200 130 L220 120 Z" fill="url(#goldGrad)" />
      <path d="M170 115 L145 150 L175 155 L185 140 Z" fill="url(#goldGrad)" />
      <path d="M230 115 L255 150 L225 155 L215 140 Z" fill="url(#goldGrad)" />
      <path d="M140 160 L120 200 L155 195 L165 180 Z" fill="url(#goldGrad)" />
      <path d="M260 160 L280 200 L245 195 L235 180 Z" fill="url(#goldGrad)" />
      {/* Lion Face Features */}
      <path d="M175 195 C175 195 190 185 200 185 C210 185 225 195 225 195" fill="none" stroke="url(#goldGrad)" strokeWidth="3" strokeLinecap="round" />
      <path d="M170 215 C170 215 185 235 200 235 C215 235 230 215 230 215" fill="none" stroke="url(#goldGrad)" strokeWidth="3" strokeLinecap="round" />
      <polygon points="200,205 190,195 210,195" fill="url(#goldGrad)" />
      <path d="M200 205 L200 220" stroke="url(#goldGrad)" strokeWidth="3" />
      <path d="M190 245 C190 255 210 255 210 245" fill="none" stroke="url(#goldGrad)" strokeWidth="2" />
    </svg>
  );

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 font-sans print:bg-white print:text-black">
      {/* PRINT-ONLY CSS STYLES FOR EXACT A4 FIT */}
      <style dangerouslySetInnerHTML={{
        __html: `
        @media print {
          body {
            background-color: white !important;
            color: black !important;
            font-size: 11pt !important;
            margin: 0 !important;
            padding: 0 !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          .no-print {
            display: none !important;
          }
          .print-full-width {
            width: 100% !important;
            max-width: 100% !important;
            padding: 0 !important;
            margin: 0 !important;
            box-shadow: none !important;
            border-radius: 0 !important;
          }
          @page {
            size: A4;
            margin: 1.2cm 1.2cm 1.2cm 1.2cm;
          }
          .premium-header-bg {
            background-color: #1e293b !important;
            -webkit-print-color-adjust: exact !important;
          }
          .premium-gold-border {
            border-color: #D4AF37 !important;
          }
          .gold-accent-text {
            color: #C5A028 !important;
          }
        }
      `}} />

      {/* HEADER BAR (HIDDEN ON PRINT) */}
      <header className="no-print bg-slate-950 border-b border-slate-800 px-6 py-4 sticky top-0 z-50 shadow-md">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-end gap-4">
          <div className="flex flex-wrap items-center gap-3">
            {/* Style Selector */}
            <div className="flex items-center bg-slate-900 border border-slate-800 rounded-lg p-1">
              <button
                onClick={() => setDesignStyle("luxury-dark")}
                className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${designStyle === 'luxury-dark' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40' : 'text-slate-400 hover:text-slate-200'}`}
              >
                Charcoal Header
              </button>
              <button
                onClick={() => setDesignStyle("royal-gold")}
                className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${designStyle === 'royal-gold' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40' : 'text-slate-400 hover:text-slate-200'}`}
              >
                Royal Gold
              </button>
              <button
                onClick={() => setDesignStyle("elegant-clean")}
                className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${designStyle === 'elegant-clean' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40' : 'text-slate-400 hover:text-slate-200'}`}
              >
                Minimal Gold
              </button>
            </div>

            {/* Quick Actions */}
            <button
              onClick={handlePrint}
              className="flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold px-4 py-2 rounded-lg transition-colors shadow-lg"
            >
              <Printer className="w-4 h-4" />
              <span>Print / Save PDF</span>
            </button>

            <button
              onClick={exportConfiguration}
              title="Save config to edit later"
              className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 px-3 py-2 rounded-lg transition-colors"
            >
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">Export Draft</span>
            </button>

            <label className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 px-3 py-2 rounded-lg transition-colors cursor-pointer">
              <Upload className="w-4 h-4" />
              <span className="hidden sm:inline">Import Draft</span>
              <input
                type="file"
                accept=".json"
                onChange={importConfiguration}
                className="hidden"
              />
            </label>
          </div>
        </div>
      </header>

      {/* TOAST SYSTEM */}
      {statusMessage && (
        <div className="no-print fixed top-20 right-6 z-50 animate-bounce">
          <div className={`flex items-center gap-2 px-4 py-3 rounded-xl shadow-2xl border ${statusMessage.type === 'error' ? 'bg-red-950/95 text-red-300 border-red-500/40' : 'bg-slate-900/95 text-amber-300 border-amber-500/40'
            }`}>
            {statusMessage.type === 'error' ? <ShieldAlert className="w-5 h-5 text-red-400" /> : <CheckCircle2 className="w-5 h-5 text-amber-400" />}
            <span className="text-sm font-medium">{statusMessage.text}</span>
          </div>
        </div>
      )}

      {/* WORKSPACE CONTAINER */}
      <main className="max-w-7xl mx-auto px-4 py-6 md:py-8 grid grid-cols-1 lg:grid-cols-12 gap-8 print:p-0">

        {/* LEFT COLUMN: INTERACTIVE SETTINGS EDITOR (HIDDEN ON PRINT) */}
        <section className="no-print lg:col-span-5 space-y-6 flex flex-col">

          {/* EDITOR NAVIGATION */}
          <div className="bg-slate-950 border border-slate-800 rounded-xl p-1.5 flex gap-1 shadow-inner">
            <button
              onClick={() => setActiveTab("general")}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-xs font-semibold rounded-lg transition-all ${activeTab === 'general' ? 'bg-amber-500 text-slate-950 shadow-md' : 'text-slate-400 hover:bg-slate-900 hover:text-slate-100'
                }`}
            >
              <Settings className="w-4 h-4" />
              Info & Logo
            </button>
            <button
              onClick={() => setActiveTab("client")}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-xs font-semibold rounded-lg transition-all ${activeTab === 'client' ? 'bg-amber-500 text-slate-950 shadow-md' : 'text-slate-400 hover:bg-slate-900 hover:text-slate-100'
                }`}
            >
              <Users className="w-4 h-4" />
              Client Info
            </button>
            <button
              onClick={() => setActiveTab("items")}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-xs font-semibold rounded-lg transition-all ${activeTab === 'items' ? 'bg-amber-500 text-slate-950 shadow-md' : 'text-slate-400 hover:bg-slate-900 hover:text-slate-100'
                }`}
            >
              <Briefcase className="w-4 h-4" />
              Items ({items.length})
            </button>
            <button
              onClick={() => setActiveTab("terms")}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-xs font-semibold rounded-lg transition-all ${activeTab === 'terms' ? 'bg-amber-500 text-slate-950 shadow-md' : 'text-slate-400 hover:bg-slate-900 hover:text-slate-100'
                }`}
            >
              <FileCheck className="w-4 h-4" />
              Terms
            </button>
          </div>

          {/* TAB CONTENT: GENERAL & COMPANY / LOGO */}
          {activeTab === 'general' && (
            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 space-y-6 shadow-xl">
              <div>
                <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider mb-4 border-b border-slate-800 pb-2">Logo Management</h3>
                <div className="flex items-center gap-4">
                  <div className="w-20 h-20 bg-slate-900 rounded-xl border border-slate-700 flex items-center justify-center overflow-hidden">
                    {customLogo ? (
                      <img src={customLogo} alt="Uploaded logo" className="object-contain w-full h-full" />
                    ) : (
                      <DefaultLionLogo />
                    )}
                  </div>
                  <div className="space-y-2">
                    <button
                      onClick={triggerLogoUpload}
                      className="text-xs bg-slate-900 hover:bg-slate-800 border border-slate-700 text-amber-400 font-semibold px-3 py-2 rounded-lg transition-colors block"
                    >
                      Upload Custom Logo (PNG/JPG)
                    </button>
                    {customLogo && (
                      <button
                        onClick={resetLogo}
                        className="text-xs text-red-400 hover:text-red-300 font-medium block"
                      >
                        Reset to Royal Gold Crest
                      </button>
                    )}
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleLogoUpload}
                      accept="image/*"
                      className="hidden"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider border-b border-slate-800 pb-2">Quotation Header Metadata</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-400">Quotation No.</label>
                    <input
                      type="text"
                      value={quoteInfo.quoteNo}
                      onChange={(e) => setQuoteInfo({ ...quoteInfo, quoteNo: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-amber-500"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-400">Date Issued</label>
                    <input
                      type="date"
                      value={quoteInfo.date}
                      onChange={(e) => setQuoteInfo({ ...quoteInfo, date: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-amber-500"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-400">Valid Until</label>
                    <input
                      type="date"
                      value={quoteInfo.expiryDate}
                      onChange={(e) => setQuoteInfo({ ...quoteInfo, expiryDate: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-amber-500"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-400">VAT Rate (%)</label>
                    <input
                      type="number"
                      value={vatRate}
                      onChange={(e) => setVatRate(parseFloat(e.target.value) || 0)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-400">Sender Contact Person</label>
                    <input
                      type="text"
                      value={quoteInfo.contactPerson}
                      onChange={(e) => setQuoteInfo({ ...quoteInfo, contactPerson: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-amber-500"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-400">Sender Direct Phone</label>
                    <input
                      type="text"
                      value={quoteInfo.contactNo}
                      onChange={(e) => setQuoteInfo({ ...quoteInfo, contactNo: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider border-b border-slate-800 pb-2">Sender Company Settings</h3>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-400">English Corporate Name</label>
                  <input
                    type="text"
                    value={companyInfo.nameEn}
                    onChange={(e) => setCompanyInfo({ ...companyInfo, nameEn: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-400">Arabic Corporate Name (اكسس ليون)</label>
                  <input
                    type="text"
                    value={companyInfo.nameAr}
                    onChange={(e) => setCompanyInfo({ ...companyInfo, nameAr: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-right text-slate-200 focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-400">Office Telephone</label>
                    <input
                      type="text"
                      value={companyInfo.tel}
                      onChange={(e) => setCompanyInfo({ ...companyInfo, tel: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-amber-500"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-400">P.O. Box</label>
                    <input
                      type="text"
                      value={companyInfo.poBox}
                      onChange={(e) => setCompanyInfo({ ...companyInfo, poBox: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB CONTENT: CLIENT INFORMATION */}
          {activeTab === 'client' && (
            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-xl">
              <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider mb-2 border-b border-slate-800 pb-2">Client Details</h3>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-400">Client Company Name</label>
                <input
                  type="text"
                  value={clientInfo.company}
                  onChange={(e) => setClientInfo({ ...clientInfo, company: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-amber-500"
                  placeholder="e.g. International Gulf Petrochemical Services"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-400">Recipient Name / Designation</label>
                <input
                  type="text"
                  value={clientInfo.contactPerson}
                  onChange={(e) => setClientInfo({ ...clientInfo, contactPerson: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-amber-500"
                  placeholder="e.g. Mr. S. Rajendran"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-400">Client Phone</label>
                  <input
                    type="text"
                    value={clientInfo.phone}
                    onChange={(e) => setClientInfo({ ...clientInfo, phone: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-amber-500"
                    placeholder="e.g. +971542343601"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-400">Client Email (Optional)</label>
                  <input
                    type="email"
                    value={clientInfo.email}
                    onChange={(e) => setClientInfo({ ...clientInfo, email: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-amber-500"
                    placeholder="e.g. name@domain.com"
                  />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-400">Client Office Address</label>
                <textarea
                  value={clientInfo.address}
                  onChange={(e) => setClientInfo({ ...clientInfo, address: e.target.value })}
                  rows="2"
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-amber-500"
                  placeholder="e.g. Abu Dhabi, U.A.E."
                />
              </div>
            </div>
          )}

          {/* TAB CONTENT: QUOTATION ITEMS */}
          {activeTab === 'items' && (
            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-xl">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider">Line Items</h3>
                <button
                  onClick={addItem}
                  className="flex items-center gap-1 bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 text-xs px-2.5 py-1 rounded-md transition-all font-semibold"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Add Row
                </button>
              </div>

              <div className="space-y-4 max-h-[450px] overflow-y-auto pr-1">
                {items.map((item, index) => (
                  <div key={item.id} className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 space-y-3 relative">
                    <div className="absolute top-2 right-2">
                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-slate-500 hover:text-red-400 p-1 transition-colors"
                        title="Delete item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <span className="text-xs font-bold text-amber-500 uppercase tracking-wider">Line #{index + 1}</span>

                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-400">Description / Machinery Spec</label>
                      <input
                        type="text"
                        value={item.description}
                        onChange={(e) => updateItem(item.id, 'description', e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-amber-500"
                        placeholder="e.g. MAN LIFT JLG 600AJ WITHOUT OPERATOR"
                      />
                    </div>

                    <div className="grid grid-cols-3 gap-2">
                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-slate-400">Qty</label>
                        <input
                          type="number"
                          value={item.qty}
                          onChange={(e) => updateItem(item.id, 'qty', e.target.value)}
                          className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-amber-500"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-slate-400">Price ({currency})</label>
                        <input
                          type="number"
                          value={item.price}
                          onChange={(e) => updateItem(item.id, 'price', e.target.value)}
                          className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-amber-500"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-slate-400">Unit / Term</label>
                        <input
                          type="text"
                          value={item.unit}
                          onChange={(e) => updateItem(item.id, 'unit', e.target.value)}
                          className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-amber-500"
                          placeholder="e.g. month, day, total"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB CONTENT: TERMS AND CONDITIONS */}
          {activeTab === 'terms' && (
            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 space-y-6 shadow-xl flex-1">
              {/* Rental Liability Terms */}
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider">Machinery Rental Terms</h3>
                  <button
                    onClick={addRentalTerm}
                    className="flex items-center gap-1 bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 text-xs px-2.5 py-1 rounded-md transition-all font-semibold"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Add Rule
                  </button>
                </div>
                <div className="space-y-2 max-h-[200px] overflow-y-auto pr-1">
                  {rentalTerms.map((term, index) => (
                    <div key={index} className="flex gap-2 items-center bg-slate-900 p-2 rounded-lg border border-slate-800">
                      <span className="text-xs text-amber-500 font-bold w-5">{index + 1}.</span>
                      <input
                        type="text"
                        value={term}
                        onChange={(e) => updateRentalTerm(index, e.target.value)}
                        className="flex-1 bg-transparent border-none text-xs text-slate-200 focus:ring-0 focus:outline-none"
                      />
                      <button
                        onClick={() => removeRentalTerm(index)}
                        className="text-slate-500 hover:text-red-400 p-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* General terms */}
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider">Terms & Conditions</h3>
                  <button
                    onClick={addGeneralTerm}
                    className="flex items-center gap-1 bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 text-xs px-2.5 py-1 rounded-md transition-all font-semibold"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Add Item
                  </button>
                </div>
                <div className="space-y-2 max-h-[200px] overflow-y-auto pr-1">
                  {generalTerms.map((term, index) => (
                    <div key={index} className="flex gap-2 items-center bg-slate-900 p-2 rounded-lg border border-slate-800">
                      <span className="text-xs text-amber-500 font-bold w-5">{index + 1}.</span>
                      <input
                        type="text"
                        value={term}
                        onChange={(e) => updateGeneralTerm(index, e.target.value)}
                        className="flex-1 bg-transparent border-none text-xs text-slate-200 focus:ring-0 focus:outline-none"
                      />
                      <button
                        onClick={() => removeGeneralTerm(index)}
                        className="text-slate-500 hover:text-red-400 p-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </section>

        {/* RIGHT COLUMN: PRECISE PREMIUM A4 PREVIEW */}
        <section className="lg:col-span-7 flex flex-col items-center justify-start print-full-width">

          <div className="no-print w-full flex items-center justify-between mb-4 px-2">
            <span className="text-xs text-slate-400 flex items-center gap-1">
              <Info className="w-3.5 h-3.5 text-amber-500" />
              Live interactive letterhead mock. Double-check details below before saving.
            </span>
            <span className="text-xs font-bold text-amber-400 uppercase tracking-widest bg-slate-950 border border-slate-800 px-2 py-1 rounded">
              A4 Format Preview
            </span>
          </div>

          {/* THE DOCUMENT CONTAINER (Standard A4 Proportions in pixels roughly 794px wide for clean scaling) */}
          <div className="w-full max-w-[800px] bg-white text-slate-900 shadow-2xl rounded-2xl overflow-hidden border border-slate-200 flex flex-col print-full-width print:border-none print:shadow-none print:rounded-none min-h-[1000px] print:min-h-[26cm] relative">

            {/* Elegant luxury top border strip */}
            <div className="h-3 w-full bg-gradient-to-r from-slate-900 via-amber-500 to-slate-900" />

            {/* DOCUMENT WRAPPER FOR PADDING */}
            <div className="flex flex-col justify-between flex-1 p-8 md:p-10 print:p-8">
              {/* DOCUMENT BODY FOR PRINT CONTENT */}
              <div className="space-y-5">

                {/* BRAND HEADER */}
                <div className="flex flex-col sm:flex-row print:flex-row items-center justify-between gap-6 border-b pb-5 premium-gold-border">
                  {/* Logo Section */}
                  <div className="flex items-center gap-4">
                    <div className="w-20 h-20 bg-slate-950 text-white rounded-xl flex items-center justify-center p-1 border-2 border-amber-500/50">
                      {customLogo ? (
                        <img src={customLogo} alt="Corporate Logo" className="object-contain w-full h-full" />
                      ) : (
                        <DefaultLionLogo />
                      )}
                    </div>
                    <div>
                      <h2 className="font-extrabold text-2xl tracking-wider text-slate-950 font-serif leading-none">ACCESS</h2>
                      <h3 className="font-bold text-lg tracking-widest text-amber-600 font-serif leading-none mt-1">LION</h3>
                      <p className="text-[9px] text-slate-500 uppercase tracking-widest mt-2">Elite Machinery Solutions</p>
                    </div>
                  </div>

                  {/* Company Details (English / Arabic bilingual setup matching original) */}
                  <div className="text-center sm:text-right print:text-right w-full sm:max-w-[60%] print:max-w-[60%] space-y-1">
                    <h1 className="text-md font-extrabold text-slate-900 leading-tight">اكسس ليون للمقاولات والنقليات العامة</h1>
                    <h2 className="text-xs font-bold text-amber-700 tracking-wide">{companyInfo.nameEn}</h2>
                    <p className="text-[10px] text-slate-500 leading-relaxed font-medium">
                      Tel: {companyInfo.tel} • P.O.Box: {companyInfo.poBox} • Web: {companyInfo.web} <br />
                      Email: {companyInfo.email} • {companyInfo.address}
                    </p>
                  </div>
                </div>

                {/* QUOTATION SUB-HEADER BANNER */}
                <div className={`rounded-xl p-4 flex flex-col sm:flex-row print:flex-row items-center justify-between gap-4 border ${designStyle === 'luxury-dark' ? 'bg-slate-900 text-white border-slate-800 premium-header-bg' :
                    designStyle === 'royal-gold' ? 'bg-gradient-to-r from-amber-600 via-yellow-500 to-amber-600 text-slate-950 font-bold border-amber-500' :
                      'bg-slate-50 text-slate-900 border-amber-600/30'
                  }`}>
                  <div>
                    <h4 className={`text-xs font-extrabold uppercase tracking-widest ${designStyle === 'royal-gold' ? 'text-slate-950' : 'text-amber-500'}`}>Official Proposal</h4>
                    <h3 className="text-xl font-black font-serif tracking-wider uppercase mt-0.5">QUOTATION</h3>
                  </div>
                  <div className="flex flex-wrap justify-end gap-x-6 gap-y-1 text-xs text-right sm:text-right">
                    <div>
                      <span className={`block text-[9px] uppercase tracking-wider ${designStyle === 'luxury-dark' ? 'text-slate-400' : 'text-slate-900/70'}`}>Quotation Number</span>
                      <strong className="text-sm font-bold">{quoteInfo.quoteNo}</strong>
                    </div>
                    <div>
                      <span className={`block text-[9px] uppercase tracking-wider ${designStyle === 'luxury-dark' ? 'text-slate-400' : 'text-slate-900/70'}`}>Date Issued</span>
                      <strong className="text-sm font-bold">{quoteInfo.date}</strong>
                    </div>
                  </div>
                </div>

                {/* CLIENT & SENDER DETAILS METADATA */}
                <div className="grid grid-cols-1 sm:grid-cols-2 print:grid-cols-2 gap-6 bg-slate-50/50 p-5 rounded-xl border border-slate-100">
                  {/* Quotation To (Client) */}
                  <div className="space-y-1.5 border-r border-slate-100 pr-4 print:border-r">
                    <span className="text-[9px] font-bold text-amber-600 uppercase tracking-widest block">Quotation To</span>
                    <div className="space-y-0.5">
                      <h4 className="font-extrabold text-slate-900 text-xs leading-snug">{clientInfo.company}</h4>
                      <p className="text-[11px] text-slate-700 font-semibold">{clientInfo.contactPerson}</p>
                      <p className="text-[11px] text-slate-600 flex items-center gap-1">
                        <span>Phone:</span> <strong className="text-slate-900 font-bold">{clientInfo.phone}</strong>
                      </p>
                      {clientInfo.email && (
                        <p className="text-[11px] text-slate-600 flex items-center gap-1">
                          <span>Email:</span> <strong className="text-slate-900 font-bold">{clientInfo.email}</strong>
                        </p>
                      )}
                      <p className="text-[11px] text-slate-500 leading-tight">{clientInfo.address}</p>
                    </div>
                  </div>

                  {/* Sender Representative details */}
                  <div className="space-y-1.5 pl-2">
                    <span className="text-[9px] font-bold text-amber-600 uppercase tracking-widest block">Access Lion Contact Person</span>
                    <div className="space-y-0.5">
                      <h4 className="font-extrabold text-slate-900 text-xs">{quoteInfo.contactPerson}</h4>
                      <p className="text-[11px] text-slate-700 font-medium">Operations & Rental Dept.</p>
                      <p className="text-[11px] text-slate-600 flex items-center gap-1">
                        <span>Direct Contact:</span> <strong className="text-slate-900 font-bold">{quoteInfo.contactNo}</strong>
                      </p>
                      <p className="text-[11px] text-slate-500">Validity: Offer valid until {quoteInfo.expiryDate}</p>
                    </div>
                  </div>
                </div>

                {/* TABLE OF ITEMS */}
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-900 text-white premium-header-bg border-b-2 border-amber-500">
                        <th className="py-2.5 px-3 text-[10px] font-bold uppercase tracking-widest rounded-tl-lg text-center w-10">No.</th>
                        <th className="py-2.5 px-3 text-[10px] font-bold uppercase tracking-widest">Machinery / Equipment Specification</th>
                        <th className="py-2.5 px-3 text-[10px] font-bold uppercase tracking-widest text-center w-14">Qty</th>
                        <th className="py-2.5 px-3 text-[10px] font-bold uppercase tracking-widest text-right w-28">Unit Price</th>
                        <th className="py-2.5 px-3 text-[10px] font-bold uppercase tracking-widest text-right rounded-tr-lg w-28">Total ({currency})</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {items.map((item, index) => {
                        const itemTotal = item.qty * item.price;
                        return (
                          <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                            <td className="py-2.5 px-3 text-[11px] font-bold text-slate-400 text-center">{index + 1}</td>
                            <td className="py-2.5 px-3 text-[11px] text-slate-900 font-semibold leading-snug">
                              {item.description}
                            </td>
                            <td className="py-2.5 px-3 text-[11px] text-slate-900 font-bold text-center">{item.qty}</td>
                            <td className="py-2.5 px-3 text-[11px] text-slate-800 text-right font-medium">
                              {item.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                              <span className="text-[9px] text-slate-500 block">per {item.unit}</span>
                            </td>
                            <td className="py-2.5 px-3 text-[11px] text-slate-900 font-bold text-right">
                              {itemTotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {/* TOTAL CALCULATIONS BOX */}
                <div className="grid grid-cols-1 sm:grid-cols-12 print:grid-cols-12 gap-6 items-start pt-2">
                  <div className="sm:col-span-7 print:col-span-7 space-y-1.5">
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block">Total Amount in Words</span>
                    <p className="text-[11px] italic text-slate-700 bg-slate-50 p-3 rounded-lg border border-slate-100 font-medium">
                      {numberToWords(calculateTotal())}
                    </p>
                  </div>

                  <div className="sm:col-span-5 print:col-span-5 bg-slate-50 p-3.5 rounded-xl space-y-2 border border-slate-100">
                    <div className="flex justify-between items-center text-[11px]">
                      <span className="text-slate-600">Subtotal:</span>
                      <span className="font-semibold text-slate-900">
                        {calculateSubtotal().toLocaleString(undefined, { minimumFractionDigits: 2 })} {currency}
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-[11px] text-slate-600 pb-1.5 border-b">
                      <span>VAT ({vatRate}%):</span>
                      <span>
                        {calculateVat().toLocaleString(undefined, { minimumFractionDigits: 2 })} {currency}
                      </span>
                    </div>
                    <div className="flex justify-between items-center pt-0.5">
                      <span className="text-[11px] font-bold text-slate-900">Total Proposal Value:</span>
                      <span className="text-xs font-black text-amber-700">
                        {calculateTotal().toLocaleString(undefined, { minimumFractionDigits: 2 })} {currency}
                      </span>
                    </div>
                  </div>
                </div>

                {/* RENTAL TERMS & GENERAL TERMS BILINGUAL */}
                <div className="grid grid-cols-1 sm:grid-cols-2 print:grid-cols-2 gap-4 pt-3 border-t border-slate-100">
                  {/* Rental Machinery terms of liability */}
                  <div className="space-y-3">
                    <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-1.5 pb-1 border-b border-amber-500/30">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                      Special Machinery Rental Terms
                    </h4>
                    <ul className="space-y-2 text-[10px] text-slate-600 leading-relaxed pl-3 list-disc">
                      {rentalTerms.map((term, index) => (
                        <li key={index} className="pl-1">{term}</li>
                      ))}
                    </ul>
                  </div>

                  {/* General T&Cs */}
                  <div className="space-y-3">
                    <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-1.5 pb-1 border-b border-amber-500/30">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                      General Terms & Conditions
                    </h4>
                    <ul className="space-y-2 text-[10px] text-slate-600 leading-relaxed pl-3 list-disc">
                      {generalTerms.map((term, index) => (
                        <li key={index} className="pl-1">{term}</li>
                      ))}
                    </ul>
                  </div>
                </div>

              </div>

              {/* DOCUMENT FOOTER & SIGNATURE SECTION */}
              <div className="pt-8 space-y-6 print:break-inside-avoid">

                {/* Signatures Layout */}
                <div className="grid grid-cols-2 gap-8 text-center pt-4 border-t border-slate-100">
                  <div className="space-y-8">
                    <p className="text-[10px] uppercase font-bold tracking-widest text-slate-500">Prepared & Approved By</p>
                    <div className="inline-block border-t border-slate-300 w-44 pt-2">
                      <p className="text-xs font-bold text-slate-900">Access Lion Management</p>
                      <p className="text-[9px] text-slate-400">Authorized Signatory & Stamp</p>
                    </div>
                  </div>

                  <div className="space-y-8">
                    <p className="text-[10px] uppercase font-bold tracking-widest text-slate-500">Accepted & Confirmed By</p>
                    <div className="inline-block border-t border-slate-300 w-44 pt-2">
                      <p className="text-xs font-bold text-slate-900">For Client/LPO Authority</p>
                      <p className="text-[9px] text-slate-400">Authorized Signature & Stamp</p>
                    </div>
                  </div>
                </div>

                {/* Symmetrical footer info strip */}
                <div className="pt-4 border-t border-slate-100 text-center space-y-1">
                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                    ACCESS LION GENERAL CONTRACTING AND TRANSPORTING • ABU DHABI UAE
                  </p>
                  <p className="text-[8px] text-slate-400">
                    This quotation is a confidential commercial offer and remains subject to our standard hire agreement.
                  </p>
                </div>

              </div>

            </div>
          </div>
        </section>

      </main>
    </div>
  );
}