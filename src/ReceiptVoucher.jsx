import { useState, useRef } from 'react';
import { Printer, Download, Upload, Plus, Trash2, Receipt } from 'lucide-react';
import newLogo from './assets/AL_Logo_Gold.png';
import mainLogo from './assets/AL_Logo.png';

export default function ReceiptVoucher() {
  const [voucherNo, setVoucherNo] = useState('AL-0123');
  const [date, setDate] = useState('');
  const [amount, setAmount] = useState('');
  
  const [fields, setFields] = useState([
    { id: '1', label: 'RECEIVED WITH THANKS FROM', value: '' },
    { id: '2', label: 'ON ACCOUNT OF', value: '' },
    { id: '3', label: 'THE SUM OF (in words)', value: '' }
  ]);

  const [description, setDescription] = useState('');

  const [paymentMethod, setPaymentMethod] = useState({
    cash: false,
    cheque: false,
    bankTransfer: false,
    onlinePayment: false
  });

  const [bankDetails, setBankDetails] = useState({
    bankName: '',
    chequeNo: '',
    date: ''
  });

  const [receivedBy, setReceivedBy] = useState({
    name: '',
    date: ''
  });

  const [statusMessage, setStatusMessage] = useState(null);
  const fileInputRef = useRef(null);

  const showToast = (text, type = "success") => {
    setStatusMessage({ text, type });
    setTimeout(() => setStatusMessage(null), 4000);
  };

  const handlePrint = () => {
    window.print();
  };

  const exportConfiguration = () => {
    const config = {
      voucherNo,
      date,
      amount,
      fields,
      description,
      paymentMethod,
      bankDetails,
      receivedBy
    };
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(config, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `ReceiptVoucher_${voucherNo || 'Draft'}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showToast("Draft exported successfully!");
  };

  const importConfiguration = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target.result);
        if (parsed.voucherNo !== undefined) setVoucherNo(parsed.voucherNo);
        if (parsed.date !== undefined) setDate(parsed.date);
        if (parsed.amount !== undefined) setAmount(parsed.amount);
        if (parsed.fields) setFields(parsed.fields);
        if (parsed.description !== undefined) setDescription(parsed.description);
        if (parsed.paymentMethod) setPaymentMethod(parsed.paymentMethod);
        if (parsed.bankDetails) setBankDetails(parsed.bankDetails);
        if (parsed.receivedBy) setReceivedBy(parsed.receivedBy);
        showToast("Draft loaded successfully!");
      } catch {
        showToast("Invalid JSON structure.", "error");
      }
    };
    reader.readAsText(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const renderAmountBoxes = () => {
    // We want 6 boxes for integers, 1 dot, 2 boxes for decimals
    const numBoxes = 9; // 6 int, 1 dot, 2 dec
    let valStr = amount.replace(/[^0-9.]/g, '');
    let parts = valStr.split('.');
    let intPart = parts[0] || '';
    let decPart = parts[1] || '';
    
    // Ensure decPart is at most 2 digits
    if (decPart.length > 2) decPart = decPart.substring(0, 2);
    
    // Total formatted string representation mapped to boxes
    let chars = [];
    
    if (valStr.includes('.')) {
      // align decPart to the right 2 boxes
      const paddedDec = decPart.padEnd(2, ' ');
      // get up to 6 int digits
      const paddedInt = intPart.padStart(6, ' ').slice(-6);
      chars = [...paddedInt.split(''), '.', ...paddedDec.split('')];
    } else {
      // align int to right, 2 blank dec boxes
      const paddedInt = intPart.padStart(6, ' ').slice(-6);
      chars = [...paddedInt.split(''), '.', ' ', ' '];
    }

    return chars.map((char, index) => {
      if (char === '.') {
        return (
          <div key={index} className="w-1.5 h-6 flex items-end justify-center font-bold pb-0.5">
            .
          </div>
        );
      }
      return (
        <div key={index} className="w-5 h-6 border border-[#333] flex items-center justify-center text-sm font-bold">
          {char.trim()}
        </div>
      );
    });
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 font-sans print:bg-white print:text-black print:min-h-0">
      <style dangerouslySetInnerHTML={{
        __html: `
        @media print {
          body {
            background-color: white !important;
            color: black !important;
            margin: 0 !important;
            padding: 0 !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
            font-family: Arial, sans-serif !important;
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
            margin: 0;
          }
          .print-a4-strict {
            width: 210mm !important;
            height: 296mm !important;
            max-height: 296mm !important;
            overflow: hidden !important;
            box-sizing: border-box !important;
            padding: 0 !important;
            page-break-after: avoid !important;
            page-break-inside: avoid !important;
            margin: 0 !important;
          }
          input[type="checkbox"] {
            accent-color: #c5a059 !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
        }
      `}} />

      {/* HEADER BAR */}
      <header className="no-print bg-slate-950 border-b border-slate-800 px-6 py-4 sticky top-0 z-50 shadow-md">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-amber-500 font-bold text-lg tracking-widest uppercase">
            <Receipt className="w-6 h-6" /> Receipt Voucher Builder
          </div>

          <div className="flex items-center gap-3">
            <input
              type="file"
              ref={fileInputRef}
              onChange={importConfiguration}
              accept=".json"
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-white font-bold px-4 py-2.5 rounded-lg transition-colors shadow-sm"
            >
              <Upload className="w-5 h-5" />
              <span className="hidden sm:inline">Import</span>
            </button>
            <button
              onClick={exportConfiguration}
              className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-white font-bold px-4 py-2.5 rounded-lg transition-colors shadow-sm"
            >
              <Download className="w-5 h-5" />
              <span className="hidden sm:inline">Export</span>
            </button>
            <button
              onClick={handlePrint}
              className="flex items-center gap-2 bg-[#c5a059] hover:bg-[#b08d4a] text-black font-bold px-5 py-2.5 rounded-lg transition-colors shadow-lg"
            >
              <Printer className="w-5 h-5" />
              <span>Print Document</span>
            </button>
          </div>
        </div>
      </header>

      {/* WORKSPACE CONTAINER */}
      <main className="max-w-7xl mx-auto px-4 py-6 md:py-8 grid grid-cols-1 lg:grid-cols-12 gap-8 print:p-0">

        {/* LEFT COLUMN: INTERACTIVE SETTINGS EDITOR */}
        <section className="no-print lg:col-span-5 space-y-6 flex flex-col">
          
          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-xl">
            <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider mb-2 border-b border-slate-800 pb-2">Voucher Details</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-400">Voucher No</label>
                <input type="text" value={voucherNo} onChange={(e) => setVoucherNo(e.target.value)} className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-[#c5a059]" />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-400">Date</label>
                <input type="text" value={date} onChange={(e) => setDate(e.target.value)} className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-[#c5a059]" placeholder="DD/MM/YYYY" />
              </div>
              <div className="space-y-1 col-span-2">
                <label className="text-xs font-semibold text-slate-400">Amount (AED)</label>
                <input type="text" value={amount} onChange={(e) => setAmount(e.target.value)} className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-[#c5a059]" placeholder="e.g. 1500.00" />
              </div>
            </div>
          </div>

          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-xl">
            <div className="flex justify-between items-center mb-2 border-b border-slate-800 pb-2">
              <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider">Main Fields</h3>
              <button
                onClick={() => setFields([...fields, { id: Date.now().toString(), label: 'NEW FIELD', value: '' }])}
                className="flex items-center gap-1 text-xs text-[#c5a059] hover:text-[#b08d4a] transition-colors font-bold"
              >
                <Plus className="w-4 h-4" /> Add Field
              </button>
            </div>
            
            <div className="space-y-4">
              {fields.map((field, index) => (
                <div key={field.id} className="flex gap-2 items-start">
                  <div className="w-2/5 space-y-1">
                    <input
                      type="text"
                      value={field.label}
                      onChange={(e) => {
                        const next = [...fields];
                        next[index].label = e.target.value;
                        setFields(next);
                      }}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2 py-2 text-xs text-[#c5a059] font-semibold focus:outline-none focus:border-[#c5a059] uppercase"
                      placeholder="Label"
                    />
                  </div>
                  <div className="flex-1 space-y-1">
                    <input
                      type="text"
                      value={field.value}
                      onChange={(e) => {
                        const next = [...fields];
                        next[index].value = e.target.value;
                        setFields(next);
                      }}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2 py-2 text-sm text-slate-200 focus:outline-none focus:border-[#c5a059]"
                      placeholder="Value"
                    />
                  </div>
                  <button
                    onClick={() => setFields(fields.filter((_, i) => i !== index))}
                    className="mt-1 p-2 text-red-400 hover:text-red-300 hover:bg-red-400/10 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
            
            <div className="space-y-1 pt-2 border-t border-slate-800">
              <label className="text-xs font-semibold text-slate-400 uppercase">Description (Multiline)</label>
              <textarea 
                value={description} 
                onChange={(e) => setDescription(e.target.value)} 
                className="w-full h-24 bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-[#c5a059]" 
                placeholder="Description details..." 
              />
            </div>
          </div>

          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-xl">
            <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider mb-2 border-b border-slate-800 pb-2">Payment Details</h3>
            <div className="grid grid-cols-2 gap-4">
              {['cash', 'cheque', 'bankTransfer', 'onlinePayment'].map(method => (
                <label key={method} className="flex items-center gap-2 cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={paymentMethod[method]} 
                    onChange={(e) => setPaymentMethod({...paymentMethod, [method]: e.target.checked})} 
                    className="w-4 h-4 accent-[#c5a059] rounded"
                  />
                  <span className="text-sm text-slate-200 capitalize">{method.replace(/([A-Z])/g, ' $1').trim()}</span>
                </label>
              ))}
            </div>
            <div className="space-y-1 mt-4">
              <label className="text-xs font-semibold text-slate-400">Bank Name</label>
              <input type="text" value={bankDetails.bankName} onChange={(e) => setBankDetails({...bankDetails, bankName: e.target.value})} className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-[#c5a059]" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-400">Cheque/Ref. No.</label>
                <input type="text" value={bankDetails.chequeNo} onChange={(e) => setBankDetails({...bankDetails, chequeNo: e.target.value})} className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-[#c5a059]" />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-400">Date</label>
                <input type="text" value={bankDetails.date} onChange={(e) => setBankDetails({...bankDetails, date: e.target.value})} className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-[#c5a059]" />
              </div>
            </div>
          </div>

          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-xl">
            <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider mb-2 border-b border-slate-800 pb-2">Signatures</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-400">Name</label>
                <input type="text" value={receivedBy.name} onChange={(e) => setReceivedBy({...receivedBy, name: e.target.value})} className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-[#c5a059]" />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-400">Date</label>
                <input type="text" value={receivedBy.date} onChange={(e) => setReceivedBy({...receivedBy, date: e.target.value})} className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-[#c5a059]" />
              </div>
            </div>
          </div>
          
        </section>

        {/* RIGHT COLUMN: THE DOCUMENT CONTAINER */}
        <section className="lg:col-span-7 flex flex-col items-center justify-start print-full-width">
          <div className="w-full max-w-[800px] bg-white text-black shadow-2xl overflow-hidden flex flex-col print-full-width print:border-none print:shadow-none min-h-[1123px] print:min-h-0 relative font-[Arial,sans-serif] print-a4-strict">
            
            {/* Watermark Background */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
              <img src={newLogo} alt="Watermark" className="w-[75%] max-w-[600px] object-contain opacity-15" />
            </div>

            {/* Corner Vectors (Top Left) */}
            <div className="absolute top-0 left-0 w-80 h-80 overflow-hidden z-0 pointer-events-none">
              <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="w-full h-full opacity-95 transform -translate-x-6 -translate-y-6">
                <path fill="#222" d="M0,0 L200,0 C150,50 100,100 0,200 Z" />
                <path fill="#C5A059" d="M0,0 L180,0 C130,40 80,80 0,180 Z" />
                <path fill="#111" d="M0,0 L140,0 C90,30 50,60 0,140 Z" />
                {/* Thin gold accent lines */}
                <path fill="none" stroke="#C5A059" strokeWidth="1.5" d="M0,20 L160,20 C110,60 60,100 0,160" />
                <path fill="none" stroke="#C5A059" strokeWidth="0.8" d="M0,40 L120,40 C80,70 40,100 0,120" />
              </svg>
            </div>

            <div className="flex flex-col flex-1 p-10 pt-16 print:p-10 z-10 h-full relative">
              
              {/* Header */}
              <div className="flex items-start justify-between mb-12 pl-6 pr-4 relative z-10">
                <div className="flex flex-col items-center ml-14">
                  <img src={newLogo} alt="Access Lion Logo" className="h-28 w-28 object-contain drop-shadow-md" />
                  <div className="mt-1 text-center">
                    <h1 className="text-2xl font-bold tracking-[0.2em] text-[#222]">ACCESS</h1>
                    <div className="flex items-center gap-2 justify-center my-0.5">
                      <div className="h-[1px] w-6 bg-[#C5A059]"></div>
                      <span className="text-[#C5A059] font-semibold tracking-[0.3em] text-sm">LION</span>
                      <div className="h-[1px] w-6 bg-[#C5A059]"></div>
                    </div>
                    <p className="text-[7px] font-bold tracking-wider text-[#333]">GENERAL CONTRACTING AND TRANSPORTING L.L.C S.P.C</p>
                  </div>
                </div>
                
                <div className="flex flex-col items-end mt-4">
                  <h2 className="text-[40px] font-black text-[#1a557a] tracking-tight leading-none">RECEIPT</h2>
                  <h2 className="text-[40px] font-black text-[#222] tracking-tight leading-none mt-1">VOUCHER</h2>
                </div>
              </div>

              {/* Voucher Info Row */}
              <div className="flex justify-between items-end mb-10 px-2 font-[Arial,sans-serif]">
                <div className="w-1/3">
                  <div className="font-bold text-[17px] text-[#111]">Voucher No:</div>
                  <div className="text-[17px] text-[#222] mt-1 tracking-wide">{voucherNo}</div>
                </div>
                <div className="w-1/3 -ml-4">
                  <div className="font-bold text-[17px] text-[#111]">Date:</div>
                  <div className="text-[17px] text-[#222] mt-1 tracking-wide">{date}</div>
                </div>
                <div className="w-1/3 flex flex-col items-end">
                  <div className="font-bold text-[17px] text-[#111] mb-1">Amount (AED):</div>
                  <div className="flex bg-white">
                    {renderAmountBoxes()}
                  </div>
                </div>
              </div>

              {/* Dynamic Fields */}
              <div className="flex-1 space-y-9 mt-4 px-2">
                {fields.map((field) => (
                  <div key={field.id} className="relative flex items-end">
                    <span className="font-bold text-[17px] text-[#111] whitespace-nowrap mr-3 shrink-0">
                      {field.label}:
                    </span>
                    <div className="flex-1 border-b-[1.5px] border-[#333] pb-1 min-h-[30px] text-[17px] text-[#222] font-medium px-2 relative leading-tight">
                      {field.value}
                    </div>
                  </div>
                ))}
                
                {/* Description Lines */}
                <div className="relative">
                  <div className="flex items-start">
                    <span className="font-bold text-[17px] text-[#111] whitespace-nowrap mr-3 shrink-0 mt-1">
                      DESCRIPTION:
                    </span>
                    <div className="flex-1">
                      <div className="border-b-[1.5px] border-[#333] min-h-[34px] text-[17px] text-[#222] font-medium px-2 break-all leading-tight">
                        {description.split('\n')[0] || ''}
                      </div>
                    </div>
                  </div>
                  <div className="border-b-[1.5px] border-[#333] min-h-[34px] text-[17px] text-[#222] font-medium px-2 mt-5 leading-tight">
                    {description.split('\n').length > 1 ? description.split('\n').slice(1).join(' ') : ''}
                  </div>
                  <div className="border-b-[1.5px] border-[#333] min-h-[34px] text-[17px] text-[#222] font-medium px-2 mt-5 leading-tight"></div>
                </div>
                
                <div className="relative flex items-end">
                  <span className="font-bold text-[17px] text-[#111] whitespace-nowrap mr-3 shrink-0">
                    AMOUNT (Figures):
                  </span>
                  <div className="flex-1 border-b-[1.5px] border-[#333] pb-1 min-h-[30px] text-[17px] text-[#222] font-medium px-2 leading-tight">
                    <span className="font-semibold">AED</span> {amount} <span className="font-semibold">/-</span>
                  </div>
                </div>

                {/* Payment Method */}
                <div className="relative flex items-center pt-2">
                  <span className="font-bold text-[17px] text-[#111] whitespace-nowrap mr-5 shrink-0">
                    PAYMENT METHOD:
                  </span>
                  <div className="flex gap-5 items-center">
                    {[
                      { id: 'cash', label: 'Cash' },
                      { id: 'cheque', label: 'Cheque' },
                      { id: 'bankTransfer', label: 'Bank Transfer' },
                      { id: 'onlinePayment', label: 'Online Payment' }
                    ].map(pm => (
                      <div key={pm.id} className="flex items-center gap-2">
                        <div className="w-[18px] h-[18px] border-[1.5px] border-[#333] flex items-center justify-center bg-white relative top-0.5">
                          {paymentMethod[pm.id] && <div className="text-black font-bold text-sm leading-none mt-0.5">✓</div>}
                        </div>
                        <span className="text-[17px] font-medium text-[#222]">{pm.label}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="relative flex items-end">
                  <span className="font-bold text-[17px] text-[#111] whitespace-nowrap mr-3 shrink-0">
                    BANK NAME:
                  </span>
                  <div className="flex-1 border-b-[1.5px] border-[#333] pb-1 min-h-[30px] text-[17px] text-[#222] font-medium px-2 leading-tight">
                    {bankDetails.bankName}
                  </div>
                </div>
                
                <div className="relative flex justify-between items-end gap-6">
                  <div className="flex-[3] flex items-end">
                    <span className="font-bold text-[17px] text-[#111] whitespace-nowrap mr-3 shrink-0">
                      CHEQUE/REF. NO:
                    </span>
                    <div className="flex-1 border-b-[1.5px] border-[#333] pb-1 min-h-[30px] text-[17px] text-[#222] font-medium px-2 leading-tight">
                      {bankDetails.chequeNo}
                    </div>
                  </div>
                  <div className="flex-[2] flex items-end">
                    <span className="font-bold text-[17px] text-[#111] whitespace-nowrap mr-3 shrink-0">
                      DATE:
                    </span>
                    <div className="flex-1 border-b-[1.5px] border-[#333] pb-1 min-h-[30px] text-[17px] text-[#222] font-medium px-2 leading-tight">
                      {bankDetails.date}
                    </div>
                  </div>
                </div>
              </div>

              {/* Signatures */}
              <div className="mt-16 mb-20 flex justify-between gap-6 px-2">
                <div className="flex flex-col flex-[2]">
                  <div className="border-b-[1.5px] border-[#333] h-10 w-full mb-1"></div>
                  <div className="flex items-center gap-1.5 mt-1">
                    <span className="font-bold text-[15px] text-[#111]">RECEIVED BY</span>
                    <span className="text-[12px] font-medium text-[#444]">(Authorized Signature & Stamp):</span>
                  </div>
                </div>
                <div className="flex flex-col flex-1 pl-4">
                  <div className="border-b-[1.5px] border-[#333] h-10 w-full mb-1 flex items-end justify-center pb-1 font-medium text-[17px] text-[#222]">
                    {receivedBy.name}
                  </div>
                  <span className="font-bold text-[15px] text-[#111] mt-1">NAME:</span>
                </div>
                <div className="flex flex-col flex-1 pl-4">
                  <div className="border-b-[1.5px] border-[#333] h-10 w-full mb-1 flex items-end justify-center pb-1 font-medium text-[17px] text-[#222]">
                    {receivedBy.date}
                  </div>
                  <span className="font-bold text-[15px] text-[#111] mt-1">DATE:</span>
                </div>
              </div>
            </div>

            {/* Footer with Corner Vectors */}
            <div className="mt-auto relative overflow-hidden bg-white z-0 w-full">
              <div className="absolute bottom-0 right-0 w-80 h-40 overflow-hidden pointer-events-none rotate-180 z-0">
                <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="w-full h-full opacity-95 transform -translate-x-8 -translate-y-8">
                  <path fill="#222" d="M0,0 L200,0 C150,50 100,100 0,200 Z" />
                  <path fill="#C5A059" d="M0,0 L180,0 C130,40 80,80 0,180 Z" />
                  <path fill="#111" d="M0,0 L140,0 C90,30 50,60 0,140 Z" />
                  <path fill="none" stroke="#C5A059" strokeWidth="1.5" d="M0,20 L160,20 C110,60 60,100 0,160" />
                  <path fill="none" stroke="#C5A059" strokeWidth="0.8" d="M0,40 L120,40 C80,70 40,100 0,120" />
                </svg>
              </div>
              
              <div className="border-t-[3px] border-[#C5A059] relative z-10 w-[90%] mx-auto py-5 text-center pb-8">
                <h3 className="text-[15px] font-black text-[#111] mb-1">ACCESS LION GENERAL CONTRACTING AND TRANSPORTING L.L.C S.P.C</h3>
                <p className="text-[13px] text-[#333] leading-relaxed">
                  Address: Office 201, Lion Tower, Salam Street, Abu Dhabi, UAE<br/>
                  Tel: +971-2-1234567 | Email: info@accesslion.ae<br/>
                  TRN (VAT No): 100345678900003
                </p>
              </div>
            </div>

          </div>
        </section>
      </main>

      {/* Toast Notification */}
      {statusMessage && (
        <div className={`fixed bottom-6 right-6 px-6 py-3 rounded-lg shadow-2xl z-[100] border font-semibold flex items-center gap-2 transform transition-all duration-300 ${statusMessage.type === 'error' ? 'bg-red-500/90 text-white border-red-400' : 'bg-[#c5a059]/90 text-black border-[#b08d4a]'}`}>
          {statusMessage.text}
        </div>
      )}
    </div>
  );
}
