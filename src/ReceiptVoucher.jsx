import { useState, useRef, useEffect } from 'react';
import { Printer, Download, Upload, Plus, Trash2, Receipt } from 'lucide-react';
import topLeftCorner from './assets/receipt_top_left.png';
import bottomRightCorner from './assets/receipt_bottom_right.png';
import watermark from './assets/receipt_watermark.png';
import headerLogo from './assets/receipt_header_logo.png';
const formatDisplayDate = (dateString) => {
  if (!dateString) return '';
  const [year, month, day] = dateString.split('-');
  if (!year || !month || !day) return dateString;
  return `${day}/${month}/${year}`;
};

const numberToWords = (num) => {
  if (num === 0 || isNaN(num)) return 'Zero AED';

  const a = ['', 'One ', 'Two ', 'Three ', 'Four ', 'Five ', 'Six ', 'Seven ', 'Eight ', 'Nine ', 'Ten ', 'Eleven ', 'Twelve ', 'Thirteen ', 'Fourteen ', 'Fifteen ', 'Sixteen ', 'Seventeen ', 'Eighteen ', 'Nineteen '];
  const b = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

  const convertBlock = (n) => {
    let res = '';
    if (Math.floor(n / 100) > 0) {
      res += a[Math.floor(n / 100)] + 'Hundred ';
      n %= 100;
    }
    if (n > 0) {
      if (n < 20) {
        res += a[n];
      } else {
        res += b[Math.floor(n / 10)] + (n % 10 > 0 ? ' ' + a[n % 10] : ' ');
      }
    }
    return res;
  };

  const intPart = Math.floor(num);
  let str = '';
  if (intPart > 0) {
    if (Math.floor(intPart / 1000000000) > 0) {
      str += convertBlock(Math.floor(intPart / 1000000000)) + 'Billion ';
    }
    if (Math.floor((intPart % 1000000000) / 1000000) > 0) {
      str += convertBlock(Math.floor((intPart % 1000000000) / 1000000)) + 'Million ';
    }
    if (Math.floor((intPart % 1000000) / 1000) > 0) {
      str += convertBlock(Math.floor((intPart % 1000000) / 1000)) + 'Thousand ';
    }
    if (intPart % 1000 > 0) {
      str += convertBlock(intPart % 1000);
    }
  }

  let decimals = Math.round((num - intPart) * 100);
  let decimalStr = decimals > 0 ? ` and ${decimals} Fils` : '';

  return str ? str.trim() + ' AED' + decimalStr + ' Only' : 'Zero AED';
};

export default function ReceiptVoucher() {
  const [voucherNo, setVoucherNo] = useState(() => {
    return localStorage.getItem('lastVoucherNo') || '01';
  });
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
    onlinePayment: false,
    cardPayment: false
  });

  const [bankDetails, setBankDetails] = useState({
    bankName: '',
    chequeNo: '',
    date: ''
  });

  const [cardDetails, setCardDetails] = useState({
    bankName: '',
    cardHolderName: ''
  });

  const [receivedBy, setReceivedBy] = useState({
    name: '',
    date: ''
  });

  const [sectionsVisibility, setSectionsVisibility] = useState({
    paymentMethod: true,
    bankDetails: true,
    cardDetails: false,
  });

  const [statusMessage, setStatusMessage] = useState(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    const originalTitle = document.title;
    document.title = voucherNo ? `Vo-no. ${voucherNo.replace(/\//g, '_')}` : 'Payment_Voucher';
    return () => {
      document.title = originalTitle;
    };
  }, [voucherNo]);

  const showToast = (text, type = "success") => {
    setStatusMessage({ text, type });
    setTimeout(() => setStatusMessage(null), 4000);
  };

  const handlePrint = () => {
    window.print();
    
    // Auto increment after print dialog is opened
    if (voucherNo) {
      const match = voucherNo.match(/^(.*?)(\d+)(.*)$/);
      if (match) {
        const prefix = match[1];
        const numStr = match[2];
        const suffix = match[3];
        const nextNum = (parseInt(numStr, 10) + 1).toString().padStart(numStr.length, '0');
        const nextVoucherNo = `${prefix}${nextNum}${suffix}`;
        
        localStorage.setItem('lastVoucherNo', nextVoucherNo);
        setTimeout(() => {
          setVoucherNo(nextVoucherNo);
        }, 1500);
      }
    }
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
      cardDetails,
      receivedBy,
      sectionsVisibility
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
        if (parsed.paymentMethod) setPaymentMethod(prev => ({ ...prev, ...parsed.paymentMethod }));
        if (parsed.bankDetails) setBankDetails(prev => ({ ...prev, ...parsed.bankDetails }));
        if (parsed.cardDetails) setCardDetails(prev => ({ ...prev, ...parsed.cardDetails }));
        if (parsed.receivedBy) setReceivedBy(prev => ({ ...prev, ...parsed.receivedBy }));
        if (parsed.sectionsVisibility) setSectionsVisibility(prev => ({ ...prev, ...parsed.sectionsVisibility }));
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
            width: 794px !important;
            height: 1123px !important;
            max-width: 794px !important;
            max-height: 1123px !important;
            min-width: 794px !important;
            min-height: 1123px !important;
            overflow: hidden !important;
            box-sizing: border-box !important;
            padding: 0 !important;
            page-break-after: avoid !important;
            page-break-inside: avoid !important;
            margin: 0 auto !important;
            position: relative !important;
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
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-end gap-4">
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
                <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-[#c5a059]" />
              </div>
              <div className="space-y-1 col-span-2">
                <label className="text-xs font-semibold text-slate-400">Amount (AED)</label>
                <input 
                  type="text" 
                  value={amount} 
                  onChange={(e) => {
                    const newAmt = e.target.value;
                    setAmount(newAmt);
                    const num = parseFloat(newAmt.replace(/,/g, ''));
                    if (!isNaN(num)) {
                      const words = numberToWords(num);
                      setFields(prev => prev.map(f => f.label === 'THE SUM OF (in words)' ? { ...f, value: words } : f));
                    } else if (newAmt === '') {
                      setFields(prev => prev.map(f => f.label === 'THE SUM OF (in words)' ? { ...f, value: '' } : f));
                    }
                  }} 
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-[#c5a059]" 
                  placeholder="e.g. 1500.00" 
                />
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
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 mb-2 border-b border-slate-800 pb-2">
              <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider">Payment Details</h3>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={sectionsVisibility.paymentMethod} onChange={(e) => setSectionsVisibility({...sectionsVisibility, paymentMethod: e.target.checked})} className="w-4 h-4 accent-[#c5a059] rounded" />
                  <span className="text-xs text-slate-300 font-semibold uppercase">Show Methods</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={sectionsVisibility.bankDetails} onChange={(e) => setSectionsVisibility({...sectionsVisibility, bankDetails: e.target.checked})} className="w-4 h-4 accent-[#c5a059] rounded" />
                  <span className="text-xs text-slate-300 font-semibold uppercase">Show Bank Ref</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={sectionsVisibility.cardDetails} onChange={(e) => setSectionsVisibility({...sectionsVisibility, cardDetails: e.target.checked})} className="w-4 h-4 accent-[#c5a059] rounded" />
                  <span className="text-xs text-slate-300 font-semibold uppercase">Show Card Details</span>
                </label>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {['cash', 'cheque', 'bankTransfer', 'onlinePayment', 'cardPayment'].map(method => (
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
            <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-slate-800">
              <div className="col-span-2 mb-1">
                <span className="text-xs font-bold text-slate-300 uppercase">Card Payment Details</span>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-400">Bank Name</label>
                <input type="text" value={cardDetails.bankName} onChange={(e) => setCardDetails({...cardDetails, bankName: e.target.value})} className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-[#c5a059]" />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-400">Card Holder Name</label>
                <input type="text" value={cardDetails.cardHolderName} onChange={(e) => setCardDetails({...cardDetails, cardHolderName: e.target.value})} className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-[#c5a059]" />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-slate-800">
              <div className="col-span-2 mb-1">
                <span className="text-xs font-bold text-slate-300 uppercase">Bank Reference (Cheque/Transfer)</span>
              </div>
              <div className="space-y-1 col-span-2">
                <label className="text-xs font-semibold text-slate-400">Bank Name</label>
                <input type="text" value={bankDetails.bankName} onChange={(e) => setBankDetails({...bankDetails, bankName: e.target.value})} className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-[#c5a059]" />
              </div>
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
                <label className="text-xs font-semibold text-slate-400">Approved By</label>
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
        <section className="lg:col-span-7 flex flex-col items-center justify-start">
          <div className="w-[794px] h-[1123px] bg-white text-black shadow-2xl overflow-hidden flex flex-col print:border-none print:shadow-none relative font-[Arial,sans-serif] print-a4-strict">
            
            {/* Watermark Background */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
              <img src={watermark} alt="Watermark" className="w-[85%] max-w-[650px] object-contain opacity-5" onError={(e) => { e.target.style.display = 'none'; }} />
            </div>

            {/* Corner Vectors (Top Left) */}
            <img src={topLeftCorner} alt="Top Left Corner" className="absolute top-0 left-0 w-80 max-w-[40%] object-contain pointer-events-none z-0" onError={(e) => { e.target.style.display = 'none'; }} />

            <div className="flex flex-col flex-1 px-12 pt-16 pb-[160px] print:px-12 print:pt-16 print:pb-[160px] z-10 h-full relative">
              
              {/* Header */}
              <div className="flex items-center justify-between mb-8 pl-[70px] pr-4 relative z-10">
                <div className="flex flex-col items-start">
                  <img src={headerLogo} alt="Access Lion Logo" className="h-28 w-auto object-contain drop-shadow-sm" onError={(e) => { e.target.style.display = 'none'; }} />
                </div>
                
                <div className="flex flex-col items-stretch">
                  <h2 className="text-[52px] font-black text-[#205178] tracking-tight leading-none uppercase" style={{ fontFamily: 'Arial Black, sans-serif' }}>PAYMENT</h2>
                  <h2 className="text-[28px] font-black text-[#111] leading-none uppercase flex justify-between w-full" style={{ fontFamily: 'Arial Black, sans-serif' }}>
                    {'VOUCHER'.split('').map((char, index) => (
                      <span key={index}>{char}</span>
                    ))}
                  </h2>
                </div>
              </div>

              {/* Voucher Info Row */}
              <div className="flex justify-between items-baseline mb-8 mt-2 px-1 font-[Arial,sans-serif]">
                <div className="flex gap-2 items-baseline">
                  <span className="font-bold text-[14px] text-[#111]">Voucher No:</span>
                  <div className="text-[14px] text-[#222] font-semibold tracking-wide">{voucherNo}</div>
                </div>
                <div className="flex gap-2 items-baseline">
                  <span className="font-bold text-[14px] text-[#111]">Date:</span>
                  <div className="text-[14px] text-[#222] font-semibold tracking-wide">{formatDisplayDate(date)}</div>
                </div>
              </div>

              {/* Dynamic Fields */}
              <div className="flex-1 space-y-5 mt-4 px-1">
                {fields.map((field) => (
                  <div key={field.id} className="relative flex items-baseline">
                    <span className="font-bold text-[12px] text-[#111] mr-3 shrink-0 uppercase tracking-wide pb-1">
                      {field.label}:
                    </span>
                    <div className={`flex-1 border-b-[1.5px] border-dashed ${field.value ? 'border-transparent' : 'border-[#555]'} pb-1 min-h-[26px] text-[13px] text-[#222] font-semibold px-2 relative leading-relaxed`}>
                      {field.value}
                    </div>
                  </div>
                ))}
                
                {/* Description Lines */}
                <div className="relative pt-1">
                  <div className="flex items-start">
                    <span className="font-bold text-[12px] text-[#111] mr-3 shrink-0 mt-1 uppercase tracking-wide">
                      DESCRIPTION:
                    </span>
                    <div className="flex-1">
                      {description ? (
                        <div className="min-h-[84px] text-[13px] text-[#222] font-semibold px-2 break-all leading-relaxed whitespace-pre-wrap">
                          {description}
                        </div>
                      ) : (
                        <>
                          <div className="border-b-[1.5px] border-dashed border-[#555] min-h-[28px] px-2"></div>
                          <div className="border-b-[1.5px] border-dashed border-[#555] min-h-[28px] px-2 mt-5"></div>
                          <div className="border-b-[1.5px] border-dashed border-[#555] min-h-[28px] px-2 mt-5"></div>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="relative flex items-baseline pt-2">
                  <span className="font-bold text-[12px] text-[#111] mr-3 shrink-0 uppercase tracking-wide pb-1">
                    AMOUNT (Figures):
                  </span>
                  <div className={`flex-1 border-b-[1.5px] border-dashed ${amount && amount !== '0.00' ? 'border-transparent' : 'border-[#555]'} pb-1 min-h-[26px] text-[13px] text-[#222] font-bold px-2 leading-relaxed`}>
                    {amount ? `AED ${amount} /-` : ''}
                  </div>
                </div>

                {/* Payment Method */}
                {sectionsVisibility.paymentMethod && (
                  <div className="relative flex items-center pt-3">
                    <span className="font-bold text-[12px] text-[#111] mr-6 shrink-0 uppercase tracking-wide">
                      PAYMENT METHOD:
                    </span>
                    <div className="flex gap-8 items-center flex-wrap">
                      {[
                        { id: 'cash', label: 'Cash' },
                        { id: 'cheque', label: 'Cheque' },
                        { id: 'bankTransfer', label: 'Bank Transfer' },
                        { id: 'onlinePayment', label: 'Online' },
                        { id: 'cardPayment', label: 'Card' }
                      ].map(pm => (
                        <div key={pm.id} className="flex items-center gap-2">
                          <div className="w-[14px] h-[14px] border-[1.5px] border-[#222] flex items-center justify-center bg-white relative">
                            {paymentMethod[pm.id] && <div className="text-black font-extrabold text-[12px] leading-none">✓</div>}
                          </div>
                          <span className="text-[12px] font-semibold text-[#222] uppercase">{pm.label}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Bank Details */}
                {sectionsVisibility.bankDetails && (
                  <>
                    <div className="relative flex items-baseline pt-3">
                      <span className="font-bold text-[12px] text-[#111] mr-3 shrink-0 uppercase tracking-wide pb-1">
                        BANK NAME:
                      </span>
                      <div className={`flex-1 border-b-[1.5px] border-dashed ${bankDetails.bankName ? 'border-transparent' : 'border-[#555]'} pb-1 min-h-[26px] text-[13px] text-[#222] font-semibold px-2 leading-relaxed`}>
                        {bankDetails.bankName}
                      </div>
                    </div>
                    
                    <div className="relative flex justify-between items-baseline gap-10 pt-3">
                      <div className="flex-[3] flex items-baseline">
                        <span className="font-bold text-[12px] text-[#111] mr-3 shrink-0 uppercase tracking-wide pb-1">
                          CHEQUE/REF. NO:
                        </span>
                        <div className={`flex-1 border-b-[1.5px] border-dashed ${bankDetails.chequeNo ? 'border-transparent' : 'border-[#555]'} pb-1 min-h-[26px] text-[13px] text-[#222] font-semibold px-2 leading-relaxed`}>
                          {bankDetails.chequeNo}
                        </div>
                      </div>
                      <div className="flex-[2] flex items-baseline">
                        <span className="font-bold text-[12px] text-[#111] mr-3 shrink-0 uppercase tracking-wide pb-1">
                          DATE:
                        </span>
                        <div className={`flex-1 border-b-[1.5px] border-dashed ${bankDetails.date ? 'border-transparent' : 'border-[#555]'} pb-1 min-h-[26px] text-[13px] text-[#222] font-semibold px-2 leading-relaxed text-center`}>
                          {bankDetails.date}
                        </div>
                      </div>
                    </div>
                  </>
                )}
                
                {/* Card Details */}
                {sectionsVisibility.cardDetails && (
                  <>
                    <div className="relative flex items-baseline pt-3">
                      <span className="font-bold text-[12px] text-[#111] mr-3 shrink-0 uppercase tracking-wide pb-1">
                        CARD BANK NAME:
                      </span>
                      <div className={`flex-1 border-b-[1.5px] border-dashed ${cardDetails.bankName ? 'border-transparent' : 'border-[#555]'} pb-1 min-h-[26px] text-[13px] text-[#222] font-semibold px-2 leading-relaxed`}>
                        {cardDetails.bankName}
                      </div>
                    </div>
                    <div className="relative flex items-baseline pt-2">
                      <span className="font-bold text-[12px] text-[#111] mr-3 shrink-0 uppercase tracking-wide pb-1">
                        CARD HOLDER NAME:
                      </span>
                      <div className={`flex-1 border-b-[1.5px] border-dashed ${cardDetails.cardHolderName ? 'border-transparent' : 'border-[#555]'} pb-1 min-h-[26px] text-[13px] text-[#222] font-semibold px-2 leading-relaxed`}>
                        {cardDetails.cardHolderName}
                      </div>
                    </div>
                  </>
                )}
              </div>

              {/* Signatures */}
              <div className="mt-8 mb-0 flex items-start justify-between gap-12 px-4">
                <div className="flex flex-col flex-[1.5]">
                  <div className="border-b-[1.5px] border-[#222] h-10 w-full mb-1 flex items-end justify-center pb-1 font-bold text-[16px] text-[#222]">
                  </div>
                  <span className="font-bold text-[12px] text-[#111] mt-1 uppercase text-center tracking-widest">PREPARED BY</span>
                </div>
                
                <div className="flex flex-col flex-[2]">
                  <div className="border-b-[1.5px] border-[#222] h-10 w-full mb-1 flex items-end justify-center pb-1 font-bold text-[16px] text-[#222]">
                    {receivedBy.name}
                  </div>
                  <span className="font-bold text-[12px] text-[#111] mt-1 uppercase text-center tracking-widest">APPROVED BY</span>
                </div>

                <div className="flex flex-col flex-[2.5]">
                  <div className="border-b-[1.5px] border-[#222] h-10 w-full mb-1 flex items-end justify-center pb-1 font-bold text-[16px] text-[#222]">
                  </div>
                  <div className="flex flex-col items-center mt-1 space-y-1">
                    <span className="text-[10px] font-bold text-[#555] uppercase tracking-wider">(Authorized Signature & Stamp)</span>
                    <span className="font-bold text-[12px] text-[#111] uppercase tracking-widest pt-2">RECEIVED BY</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer with Corner Vectors */}
            <div className="absolute bottom-0 left-0 right-0 bg-transparent z-0 w-full h-[160px] flex flex-col justify-end overflow-hidden pointer-events-none">
              <img src={bottomRightCorner} alt="Bottom Right Corner" className="absolute bottom-0 left-0 w-full h-auto object-cover pointer-events-none z-0" onError={(e) => { e.target.style.display = 'none'; }} />
              
              <div className="relative z-10 w-[85%] mx-auto mb-[50px] pt-3 border-t-[2px] border-[#C5A059] text-center bg-transparent">
                <h3 className="text-[11px] font-black text-[#111] mb-0.5 tracking-wider">ACCESS LION GENERAL CONTRACTING AND TRANSPORTING L.L.C S.P.C</h3>
                <p className="text-[9px] font-bold text-[#222] leading-relaxed uppercase tracking-widest">
                  P.O Box: 58914, Al Dhafra Region, Zayed City, Abu Dhabi, United Arab Emirates<br/>
                  Phone +971542811111 | TRN: 100227450200003
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
