import React, { useState, useRef } from 'react';
import defaultLogo from './assets/logo1.png';
import { 
  FileText, 
  Plus, 
  Trash2, 
  Printer, 
  Download, 
  Upload, 
  Settings, 
  Briefcase, 
  CheckCircle2,
  Info,
  Car,
  Users
} from 'lucide-react';

export default function LOABuilder() {
  // --- PRESETS & INITIAL STATE ---
  const initialCompanyInfo = {
    nameEn: "ACCESS LION GENERAL CONTRACTING AND TRANSPORTATING – L.L.C – S.P.C",
    nameAr: "اكسس ليون للمقاولات والنقليات العامة - ذ.م.م -ش.و.و"
  };

  const initialNameItem = {
    id: "1",
    name: "John Doe",
    nationality: "Pakistani",
    companyName: "اكسس ليون للمقاولات والنقليات العامة - ذ.م.م",
    occupation: "سائق باص",
    visaIssueArea: "ابوظبي"
  };

  const initialVehicleItem = {
    id: "1",
    companyName: "اكسس ليون للمقاولات والنقليات العامة - ذ.م.م",
    plateNo: "57980",
    plateType: "عمومي",
    placeOfIssue: "ابوظبي",
    typeOfCar: "تويوتا هايلوكس",
    licenseExpiryDate: "20-06-2026"
  };

  // --- STATE ---
  const [formType, setFormType] = useState('names'); // 'names' or 'vehicles'
  const [companyInfo, setCompanyInfo] = useState(initialCompanyInfo);
  const [nameItems, setNameItems] = useState([initialNameItem]);
  const [vehicleItems, setVehicleItems] = useState([initialVehicleItem]);
  const [activeTab, setActiveTab] = useState("items");
  const [customLogo, setCustomLogo] = useState(defaultLogo);
  const [statusMessage, setStatusMessage] = useState(null);
  const fileInputRef = useRef(null);

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

  // Items Management
  const addItem = () => {
    if (formType === 'names') {
      setNameItems([
        ...nameItems,
        {
          id: Date.now().toString(),
          name: "",
          nationality: "",
          companyName: "اكسس ليون للمقاولات والنقليات العامة - ذ.م.م",
          occupation: "",
          visaIssueArea: "ابوظبي"
        }
      ]);
    } else {
      setVehicleItems([
        ...vehicleItems,
        {
          id: Date.now().toString(),
          companyName: "اكسس ليون للمقاولات والنقليات العامة - ذ.م.م",
          plateNo: "",
          plateType: "عمومي",
          placeOfIssue: "ابوظبي",
          typeOfCar: "",
          licenseExpiryDate: ""
        }
      ]);
    }
  };

  const updateNameItem = (id, field, value) => {
    setNameItems(nameItems.map(item => item.id === id ? { ...item, [field]: value } : item));
  };

  const updateVehicleItem = (id, field, value) => {
    setVehicleItems(vehicleItems.map(item => item.id === id ? { ...item, [field]: value } : item));
  };

  const removeItem = (id) => {
    if (formType === 'names') {
      setNameItems(nameItems.filter(item => item.id !== id));
    } else {
      setVehicleItems(vehicleItems.filter(item => item.id !== id));
    }
  };

  // Save/Load Config as JSON file
  const exportConfiguration = () => {
    const config = {
      formType,
      companyInfo,
      nameItems,
      vehicleItems
    };
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(config, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `LOA_${formType}_data.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showToast("LOA draft exported successfully!");
  };

  const importConfiguration = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target.result);
        if (parsed.formType) setFormType(parsed.formType);
        if (parsed.companyInfo) setCompanyInfo(parsed.companyInfo);
        if (parsed.nameItems) setNameItems(parsed.nameItems);
        if (parsed.vehicleItems) setVehicleItems(parsed.vehicleItems);
        showToast("LOA data loaded successfully!");
      } catch (err) {
        showToast("Invalid JSON structure.", "error");
      }
    };
    reader.readAsText(file);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 font-sans print:bg-white print:text-black">
      {/* PRINT-ONLY CSS STYLES FOR EXACT A4 FIT */}
      <style dangerouslySetInnerHTML={{__html: `
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
            size: A4 portrait;
            margin: 1cm;
          }
          .table-header-bg {
            background-color: #D4C38E !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          table {
            border-collapse: collapse;
            width: 100%;
          }
          th, td {
            border: 1px solid black;
            padding: 3px;
            text-align: center;
          }
        }
      `}} />

      {/* HEADER BAR (HIDDEN ON PRINT) */}
      <header className="no-print bg-slate-950 border-b border-slate-800 px-6 py-4 sticky top-0 z-50 shadow-md">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-500/10 rounded-lg border border-amber-500/30">
              <FileText className="w-6 h-6 text-amber-500" />
            </div>
            <div>
              <h1 className="font-bold text-lg tracking-wider text-amber-400">ACCESS LION</h1>
              <p className="text-xs text-slate-400">Interactive LOA Builder</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Form Type Selector */}
            <div className="flex items-center bg-slate-900 border border-slate-800 rounded-lg p-1 mr-4">
              <button 
                onClick={() => setFormType('names')}
                className={`flex items-center gap-1 px-3 py-1 text-xs font-medium rounded-md transition-all ${formType === 'names' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40' : 'text-slate-400 hover:text-slate-200'}`}
              >
                <Users className="w-3.5 h-3.5" />
                Drivers Form
              </button>
              <button 
                onClick={() => setFormType('vehicles')}
                className={`flex items-center gap-1 px-3 py-1 text-xs font-medium rounded-md transition-all ${formType === 'vehicles' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40' : 'text-slate-400 hover:text-slate-200'}`}
              >
                <Car className="w-3.5 h-3.5" />
                Vehicles Form
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
          <div className="flex items-center gap-2 px-4 py-3 rounded-xl shadow-2xl border bg-slate-900/95 text-amber-300 border-amber-500/40">
            <CheckCircle2 className="w-5 h-5 text-amber-400" />
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
              onClick={() => setActiveTab("items")}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-xs font-semibold rounded-lg transition-all ${
                activeTab === 'items' ? 'bg-amber-500 text-slate-950 shadow-md' : 'text-slate-400 hover:bg-slate-900 hover:text-slate-100'
              }`}
            >
              <Briefcase className="w-4 h-4" />
              Rows
            </button>
            <button
              onClick={() => setActiveTab("general")}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-xs font-semibold rounded-lg transition-all ${
                activeTab === 'general' ? 'bg-amber-500 text-slate-950 shadow-md' : 'text-slate-400 hover:bg-slate-900 hover:text-slate-100'
              }`}
            >
              <Settings className="w-4 h-4" />
              Company Settings
            </button>
          </div>

          {/* TAB CONTENT: GENERAL & COMPANY */}
          {activeTab === 'general' && (
            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 space-y-6 shadow-xl">
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
                  <label className="text-xs font-semibold text-slate-400">Arabic Corporate Name</label>
                  <input 
                    type="text" 
                    value={companyInfo.nameAr}
                    onChange={(e) => setCompanyInfo({ ...companyInfo, nameAr: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-right text-slate-200 focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB CONTENT: FORM ITEMS */}
          {activeTab === 'items' && (
            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-xl">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider">
                  {formType === 'names' ? 'Drivers List' : 'Vehicles List'}
                </h3>
                <button 
                  onClick={addItem}
                  className="flex items-center gap-1 bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 text-xs px-2.5 py-1 rounded-md transition-all font-semibold"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Add Row
                </button>
              </div>

              <div className="space-y-4 max-h-[600px] overflow-y-auto pr-1">
                {formType === 'names' ? (
                  nameItems.map((item, index) => (
                    <div key={item.id} className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 space-y-3 relative">
                      <div className="absolute top-2 right-2">
                        <button 
                          onClick={() => removeItem(item.id)}
                          className="text-slate-500 hover:text-red-400 p-1 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <span className="text-xs font-bold text-amber-500 uppercase tracking-wider">Row #{index + 1}</span>

                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <label className="text-xs font-semibold text-slate-400">Name (الاسم)</label>
                          <input 
                            type="text" 
                            value={item.name}
                            onChange={(e) => updateNameItem(item.id, 'name', e.target.value)}
                            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-right text-slate-200 focus:outline-none focus:border-amber-500"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-xs font-semibold text-slate-400">Nationality (الجنسية)</label>
                          <input 
                            type="text" 
                            value={item.nationality}
                            onChange={(e) => updateNameItem(item.id, 'nationality', e.target.value)}
                            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-right text-slate-200 focus:outline-none focus:border-amber-500"
                          />
                        </div>
                        <div className="space-y-1 col-span-2">
                          <label className="text-xs font-semibold text-slate-400">Company Name (اسم الشركة)</label>
                          <input 
                            type="text" 
                            value={item.companyName}
                            onChange={(e) => updateNameItem(item.id, 'companyName', e.target.value)}
                            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-right text-slate-200 focus:outline-none focus:border-amber-500"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-xs font-semibold text-slate-400">Occupation (المهنة)</label>
                          <input 
                            type="text" 
                            value={item.occupation}
                            onChange={(e) => updateNameItem(item.id, 'occupation', e.target.value)}
                            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-right text-slate-200 focus:outline-none focus:border-amber-500"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-xs font-semibold text-slate-400">Visa Issue Area (مكان صدور الاقامة)</label>
                          <input 
                            type="text" 
                            value={item.visaIssueArea}
                            onChange={(e) => updateNameItem(item.id, 'visaIssueArea', e.target.value)}
                            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-right text-slate-200 focus:outline-none focus:border-amber-500"
                          />
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  vehicleItems.map((item, index) => (
                    <div key={item.id} className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 space-y-3 relative">
                      <div className="absolute top-2 right-2">
                        <button 
                          onClick={() => removeItem(item.id)}
                          className="text-slate-500 hover:text-red-400 p-1 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <span className="text-xs font-bold text-amber-500 uppercase tracking-wider">Row #{index + 1}</span>

                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1 col-span-2">
                          <label className="text-xs font-semibold text-slate-400">Company Name (اسم الشركة)</label>
                          <input 
                            type="text" 
                            value={item.companyName}
                            onChange={(e) => updateVehicleItem(item.id, 'companyName', e.target.value)}
                            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-right text-slate-200 focus:outline-none focus:border-amber-500"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-xs font-semibold text-slate-400">Plate No (رقم اللوحة)</label>
                          <input 
                            type="text" 
                            value={item.plateNo}
                            onChange={(e) => updateVehicleItem(item.id, 'plateNo', e.target.value)}
                            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-right text-slate-200 focus:outline-none focus:border-amber-500"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-xs font-semibold text-slate-400">Plate Type (نوع اللوحة)</label>
                          <input 
                            type="text" 
                            value={item.plateType}
                            onChange={(e) => updateVehicleItem(item.id, 'plateType', e.target.value)}
                            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-right text-slate-200 focus:outline-none focus:border-amber-500"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-xs font-semibold text-slate-400">Place of Issue (مصدر اللوحة)</label>
                          <input 
                            type="text" 
                            value={item.placeOfIssue}
                            onChange={(e) => updateVehicleItem(item.id, 'placeOfIssue', e.target.value)}
                            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-right text-slate-200 focus:outline-none focus:border-amber-500"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-xs font-semibold text-slate-400">Type of Car (نوع المركبة)</label>
                          <input 
                            type="text" 
                            value={item.typeOfCar}
                            onChange={(e) => updateVehicleItem(item.id, 'typeOfCar', e.target.value)}
                            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-right text-slate-200 focus:outline-none focus:border-amber-500"
                          />
                        </div>
                        <div className="space-y-1 col-span-2">
                          <label className="text-xs font-semibold text-slate-400">License Expiry Date (تاريخ انتهاء الملكية)</label>
                          <input 
                            type="text" 
                            value={item.licenseExpiryDate}
                            onChange={(e) => updateVehicleItem(item.id, 'licenseExpiryDate', e.target.value)}
                            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-amber-500"
                          />
                        </div>
                      </div>
                    </div>
                  ))
                )}
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

          {/* THE DOCUMENT CONTAINER */}
          <div className="w-full max-w-[800px] bg-white text-black shadow-2xl overflow-hidden flex flex-col print-full-width print:border-none print:shadow-none min-h-[1000px] print:min-h-0 relative font-[Arial,sans-serif]">
            
            {/* DOCUMENT WRAPPER FOR PADDING */}
            <div className="flex flex-col flex-1 p-8 md:p-12 print:p-0">
              
              {/* BRAND HEADER */}
              <div className="text-center space-y-2 mb-4">
                <div className="text-sm font-bold border-b-2 border-black inline-block pb-0.5">
                  <u>Company Name:</u>{companyInfo.nameEn}
                </div>
                <div className="text-base font-bold">
                  <u>اسم الشركة:</u>{companyInfo.nameAr}
                </div>
              </div>

              {/* FORM TITLE */}
              <div className="text-center space-y-1 mb-4">
                <div className="text-lg font-bold">
                  <u>{formType === 'names' ? 'نموذج كشف الاسماء' : 'نموذج كشف المركبات والمعدات'}</u>
                </div>
                <div className="text-base">
                  {formType === 'names' ? 'Names Disclosure Form' : 'Vehicles & Equipment Disclosure Form'}
                </div>
              </div>

              {/* TABLE */}
              <div className="mb-4 overflow-hidden border border-black">
                <table className="w-full text-center border-collapse">
                  <thead>
                    {formType === 'names' ? (
                      <tr className="bg-[#D4C38E] table-header-bg text-black">
                        <th className="border border-black p-1 font-bold text-xs w-32">
                          <div className="text-right pb-1">مكان صدور الاقامة</div>
                          <div className="text-left">Place of visa issue area</div>
                        </th>
                        <th className="border border-black p-1 font-bold text-xs w-32">
                          <div className="text-right pb-1">المهنة</div>
                          <div className="text-left">Occupation</div>
                        </th>
                        <th className="border border-black p-1 font-bold text-xs">
                          <div className="text-center pb-1">اسم الشركة</div>
                          <div className="text-center">Company Name</div>
                        </th>
                        <th className="border border-black p-1 font-bold text-xs w-24">
                          <div className="text-center pb-1">الجنسية</div>
                          <div className="text-center">Nationality</div>
                        </th>
                        <th className="border border-black p-1 font-bold text-xs w-32">
                          <div className="text-center pb-1">الاسم</div>
                          <div className="text-center">Name</div>
                        </th>
                        <th className="border border-black p-1 font-bold text-xs w-12">
                          <div className="text-center pb-1">رقم</div>
                          <div className="text-center">No</div>
                        </th>
                      </tr>
                    ) : (
                      <tr className="bg-[#D4C38E] table-header-bg text-black">
                        <th className="border border-black p-1 font-bold text-xs w-24">
                          <div className="text-center pb-1">تاريخ انتهاء الملكية</div>
                          <div className="text-center">License Expiry Date</div>
                        </th>
                        <th className="border border-black p-1 font-bold text-xs w-24">
                          <div className="text-center pb-1">نوع المركبة</div>
                          <div className="text-center">Type of Car</div>
                        </th>
                        <th className="border border-black p-1 font-bold text-xs w-20">
                          <div className="text-center pb-1">مصدر اللوحة</div>
                          <div className="text-center">Place of Issue</div>
                        </th>
                        <th className="border border-black p-1 font-bold text-xs w-20">
                          <div className="text-center pb-1">نوع اللوحة</div>
                          <div className="text-center">Plate Type</div>
                        </th>
                        <th className="border border-black p-1 font-bold text-xs w-20">
                          <div className="text-center pb-1">رقم اللوحة</div>
                          <div className="text-center">Plate No.</div>
                        </th>
                        <th className="border border-black p-1 font-bold text-xs">
                          <div className="text-center pb-1">اسم الشركة</div>
                          <div className="text-center">Company Name</div>
                        </th>
                        <th className="border border-black p-1 font-bold text-xs w-12">
                          <div className="text-center pb-1">الرقم</div>
                          <div className="text-center">No.</div>
                        </th>
                      </tr>
                    )}
                  </thead>
                  <tbody>
                    {formType === 'names' ? (
                      nameItems.map((item, index) => (
                        <tr key={item.id}>
                          <td className="border border-black p-1 text-xs text-right" dir="rtl">{item.visaIssueArea}</td>
                          <td className="border border-black p-1 text-xs text-right" dir="rtl">{item.occupation}</td>
                          <td className="border border-black p-1 text-xs text-center" dir="rtl">
                            {item.companyName.split('-').map((part, i) => (
                              <React.Fragment key={i}>
                                {part}{i < item.companyName.split('-').length - 1 ? ' - ' : ''}
                                {i === 0 && <br/>}
                              </React.Fragment>
                            ))}
                          </td>
                          <td className="border border-black p-1 text-xs text-center" dir="rtl">{item.nationality}</td>
                          <td className="border border-black p-1 text-xs text-right" dir="rtl">{item.name}</td>
                          <td className="border border-black p-1 text-xs text-center">{index + 1}</td>
                        </tr>
                      ))
                    ) : (
                      vehicleItems.map((item, index) => (
                        <tr key={item.id}>
                          <td className="border border-black p-1 text-xs text-center">{item.licenseExpiryDate}</td>
                          <td className="border border-black p-1 text-xs text-right" dir="rtl">{item.typeOfCar}</td>
                          <td className="border border-black p-1 text-xs text-center" dir="rtl">{item.placeOfIssue}</td>
                          <td className="border border-black p-1 text-xs text-center" dir="rtl">{item.plateType}</td>
                          <td className="border border-black p-1 text-xs text-center">{item.plateNo}</td>
                          <td className="border border-black p-1 text-xs text-center" dir="rtl">
                            {item.companyName.split('-').map((part, i) => (
                              <React.Fragment key={i}>
                                {part}{i < item.companyName.split('-').length - 1 ? ' - ' : ''}
                                {i === 0 && <br/>}
                              </React.Fragment>
                            ))}
                          </td>
                          <td className="border border-black p-1 text-xs text-center">{index + 1}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {/* FOOTER */}
              <div className="mt-4 space-y-1 mb-8 text-center">
                <div className="text-sm font-bold italic">
                  <u>تتعهد الشركة المذكورة بأن تلتزم بصحة البيانات الموضحة في الكشف اعلاه.</u>
                </div>
                <div className="text-xs italic">
                  The company undertakes of accuracy of the information that mentioned in the disclosure above.
                </div>
              </div>

              <div className="mt-6">
                <div className="border-t border-dashed border-black mx-4"></div>
                <div className="flex justify-between font-bold text-sm pt-2 px-4">
                  <span>Authorized signatory with company seal:</span>
                  <span>المخول بالتوقيع مع ختم الشركة:</span>
                </div>
              </div>

            </div>
          </div>
        </section>

      </main>
    </div>
  );
}