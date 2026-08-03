import { useState, useRef } from 'react';
import { Printer, CarFront, Truck, Bus, Users, FileText, Download, Upload, Plus, Trash2 } from 'lucide-react';

// Use the newly attached logo and diagrams by importing them here.
import newLogo from './assets/AL_Logo_Gold.png'; 
import lightVehicleDiagram from './assets/pickup_diagram.png'; 
import tankerDiagram from './assets/tanker_diagram.png'; 
import busDiagram from './assets/bus_diagram.png'; 

export default function VehicleReceptionReport() {
  const [vehicleType, setVehicleType] = useState('light');
  const [activeTab, setActiveTab] = useState('vehicle');

  const [vehicleFields, setVehicleFields] = useState([
    { id: '1', label: 'Plate No.', value: '' },
    { id: '2', label: 'Chassis No.', value: '' },
    { id: '3', label: 'Make / Brand', value: '' },
    { id: '4', label: 'Model', value: '' },
    { id: '5', label: 'Color', value: '' },
    { id: '6', label: 'Year', value: '' },
    { id: '7', label: 'Owner', value: '' },
    { id: '8', label: 'Odometer (Out)', value: '' }
  ]);

  const [driverFields, setDriverFields] = useState([
    { id: '1', label: 'Full Name', value: '' },
    { id: '2', label: 'Company Name', value: '' },
    { id: '3', label: 'Company License', value: '' },
    { id: '4', label: 'Expiry Date', value: '' }
  ]);
  const fileInputRef = useRef(null);
  const [statusMessage, setStatusMessage] = useState(null);

  const showToast = (text, type = "success") => {
    setStatusMessage({ text, type });
    setTimeout(() => setStatusMessage(null), 4000);
  };

  const [receiptDate, setReceiptDate] = useState('');
  const [remarks, setRemarks] = useState('');

  const vehicleTypes = {
    light: { id: 'light', label: 'Light Vehicles & Pickup Trucks', icon: <CarFront className="w-4 h-4" />, diagram: lightVehicleDiagram },
    tanker: { id: 'tanker', label: 'Tankers & Trailers', icon: <Truck className="w-4 h-4" />, diagram: tankerDiagram },
    bus: { id: 'bus', label: 'Buses & Coaches', icon: <Bus className="w-4 h-4" />, diagram: busDiagram }
  };

  const currentType = vehicleTypes[vehicleType];

  const handlePrint = () => {
    window.print();
  };

  const exportConfiguration = () => {
    const config = {
      vehicleType,
      vehicleFields,
      driverFields,
      receiptDate,
      remarks
    };
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(config, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    
    // Find plate no if exists for the filename
    const plateField = vehicleFields.find(f => f.label.toLowerCase().includes('plate'));
    const plateName = plateField && plateField.value ? plateField.value : 'Draft';
    
    downloadAnchor.setAttribute("download", `VehicleReception_${plateName}.json`);
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
        if (parsed.vehicleType) setVehicleType(parsed.vehicleType);
        
        if (parsed.vehicleFields) {
          setVehicleFields(parsed.vehicleFields);
        } else if (parsed.vehicleInfo) {
          // Backwards compatibility for old drafts
          setVehicleFields([
            { id: '1', label: 'Plate No.', value: parsed.vehicleInfo.plateNo || '' },
            { id: '2', label: 'Chassis No.', value: parsed.vehicleInfo.chassisNo || '' },
            { id: '3', label: 'Make / Brand', value: parsed.vehicleInfo.brand || '' },
            { id: '4', label: 'Model', value: parsed.vehicleInfo.model || '' },
            { id: '5', label: 'Color', value: parsed.vehicleInfo.color || '' },
            { id: '6', label: 'Year', value: parsed.vehicleInfo.year || '' },
            { id: '7', label: 'Owner', value: parsed.vehicleInfo.owner || '' },
            { id: '8', label: 'Odometer (Out)', value: parsed.vehicleInfo.odometer || '' }
          ]);
        }
        
        if (parsed.driverFields) setDriverFields(parsed.driverFields);
        if (parsed.receiptDate !== undefined) setReceiptDate(parsed.receiptDate);
        if (parsed.remarks !== undefined) setRemarks(parsed.remarks);
        showToast("Draft loaded successfully!");
      } catch {
        showToast("Invalid JSON structure.", "error");
      }
    };
    reader.readAsText(file);
    // reset input
    if (fileInputRef.current) fileInputRef.current.value = '';
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
            padding: 10mm !important;
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
          <div className="flex items-center bg-slate-900 border border-slate-800 rounded-lg p-1">
            {Object.values(vehicleTypes).map(type => (
              <button
                key={type.id}
                onClick={() => setVehicleType(type.id)}
                className={`flex items-center gap-2 px-4 py-2 text-sm font-bold rounded-md transition-all ${vehicleType === type.id
                  ? 'bg-[#c5a059] text-black shadow-md'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                  }`}
              >
                {type.icon}
                {type.label}
              </button>
            ))}
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

        {/* LEFT COLUMN: INTERACTIVE SETTINGS EDITOR (HIDDEN ON PRINT) */}
        <section className="no-print lg:col-span-5 space-y-6 flex flex-col">
          <div className="bg-slate-950 border border-slate-800 rounded-xl p-1.5 flex gap-1 shadow-inner">
            <button
              onClick={() => setActiveTab('vehicle')}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-xs font-semibold rounded-lg transition-all ${activeTab === 'vehicle' ? 'bg-[#c5a059] text-black shadow-md' : 'text-slate-400 hover:bg-slate-900 hover:text-slate-100'}`}
            >
              <CarFront className="w-4 h-4" />
              Vehicle Info
            </button>
            <button
              onClick={() => setActiveTab('driver')}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-xs font-semibold rounded-lg transition-all ${activeTab === 'driver' ? 'bg-[#c5a059] text-black shadow-md' : 'text-slate-400 hover:bg-slate-900 hover:text-slate-100'}`}
            >
              <Users className="w-4 h-4" />
              Driver Info
            </button>
            <button
              onClick={() => setActiveTab('details')}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-xs font-semibold rounded-lg transition-all ${activeTab === 'details' ? 'bg-[#c5a059] text-black shadow-md' : 'text-slate-400 hover:bg-slate-900 hover:text-slate-100'}`}
            >
              <FileText className="w-4 h-4" />
              Remarks & Date
            </button>
          </div>

          {activeTab === 'vehicle' && (
            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-xl">
              <div className="flex justify-between items-center mb-2 border-b border-slate-800 pb-2">
                <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider">Vehicle Details</h3>
                <button
                  onClick={() => setVehicleFields([...vehicleFields, { id: Date.now().toString(), label: 'New Field', value: '' }])}
                  className="flex items-center gap-1 text-xs text-[#c5a059] hover:text-[#b08d4a] transition-colors font-bold"
                >
                  <Plus className="w-4 h-4" /> Add Field
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {vehicleFields.map((field, index) => (
                  <div key={field.id} className="flex gap-2 items-start">
                    <div className="w-2/5 space-y-1">
                      <input
                        type="text"
                        value={field.label}
                        onChange={(e) => {
                          const next = [...vehicleFields];
                          next[index].label = e.target.value;
                          setVehicleFields(next);
                        }}
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2 py-2 text-sm text-[#c5a059] font-semibold focus:outline-none focus:border-[#c5a059]"
                        placeholder="Label"
                      />
                    </div>
                    <div className="flex-1 space-y-1">
                      <input
                        type="text"
                        value={field.value}
                        onChange={(e) => {
                          const next = [...vehicleFields];
                          next[index].value = e.target.value;
                          setVehicleFields(next);
                        }}
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2 py-2 text-sm text-slate-200 focus:outline-none focus:border-[#c5a059]"
                        placeholder="Value"
                      />
                    </div>
                    <button
                      onClick={() => setVehicleFields(vehicleFields.filter((_, i) => i !== index))}
                      className="mt-1 p-2 text-red-400 hover:text-red-300 hover:bg-red-400/10 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'driver' && (
            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-xl">
              <div className="flex justify-between items-center mb-2 border-b border-slate-800 pb-2">
                <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider">Driver Details</h3>
                <button
                  onClick={() => setDriverFields([...driverFields, { id: Date.now().toString(), label: 'New Field', value: '' }])}
                  className="flex items-center gap-1 text-xs text-[#c5a059] hover:text-[#b08d4a] transition-colors font-bold"
                >
                  <Plus className="w-4 h-4" /> Add Field
                </button>
              </div>
              <div className="space-y-4">
                {driverFields.map((field, index) => (
                  <div key={field.id} className="flex gap-2 items-start">
                    <div className="w-1/3 space-y-1">
                      <input
                        type="text"
                        value={field.label}
                        onChange={(e) => {
                          const next = [...driverFields];
                          next[index].label = e.target.value;
                          setDriverFields(next);
                        }}
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-[#c5a059] font-semibold focus:outline-none focus:border-[#c5a059]"
                        placeholder="Label"
                      />
                    </div>
                    <div className="flex-1 space-y-1">
                      <input
                        type="text"
                        value={field.value}
                        onChange={(e) => {
                          const next = [...driverFields];
                          next[index].value = e.target.value;
                          setDriverFields(next);
                        }}
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-[#c5a059]"
                        placeholder="Value"
                      />
                    </div>
                    <button
                      onClick={() => setDriverFields(driverFields.filter((_, i) => i !== index))}
                      className="mt-1 p-2 text-red-400 hover:text-red-300 hover:bg-red-400/10 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'details' && (
            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-xl">
              <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider mb-2 border-b border-slate-800 pb-2">Remarks & Date</h3>
              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-400">Date of Receipt</label>
                  <input type="text" value={receiptDate} onChange={(e) => setReceiptDate(e.target.value)} className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-[#c5a059]" placeholder="e.g. 15/08/2026" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-400">Additional Remarks</label>
                  <textarea value={remarks} onChange={(e) => setRemarks(e.target.value)} className="w-full h-32 bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-[#c5a059]" placeholder="Enter any additional remarks..." />
                </div>
              </div>
            </div>
          )}
        </section>

        {/* RIGHT COLUMN: THE DOCUMENT CONTAINER */}
        <section className="lg:col-span-7 flex flex-col items-center justify-start print-full-width">
          <div className="w-full max-w-[800px] bg-white text-black shadow-2xl overflow-hidden flex flex-col print-full-width print:border-none print:shadow-none min-h-[1123px] print:min-h-0 relative font-[Arial,sans-serif] text-[11px] print-a4-strict">
            <div className="flex flex-col flex-1 p-6 print:p-0 h-full">

              {/* BRAND HEADER */}
              <div className="bg-[#111111] border-b-[3px] border-[#c5a059] flex items-center justify-between p-2 rounded-t-md print:rounded-none">
                <img src={newLogo} alt="Access Lion Logo" className="h-12 w-12 object-contain" onError={(e) => { e.target.style.display = 'none'; }} />
                <div className="text-center text-[#c5a059]">
                  <h1 className="text-xl font-bold tracking-[0.2em] mb-1">ACCESS LION</h1>
                  <p className="text-[10px] tracking-widest">Transportation & Fleet Management — اكسس ليون</p>
                </div>
                <img src={newLogo} alt="Access Lion Logo" className="h-12 w-12 object-contain" onError={(e) => { e.target.style.display = 'none'; }} />
              </div>

              {/* FORM TITLE */}
              <div className="text-center mt-2 mb-2">
                <h2 className="text-lg font-bold tracking-widest mb-1">VEHICLE RECEPTION REPORT</h2>
                <div className="inline-block bg-[#c5a059] text-black font-bold px-4 py-0.5 rounded-full text-[10px] shadow-sm">
                  {currentType.label}
                </div>
              </div>

              {/* VEHICLE INFORMATION */}
              <div className="mb-4">
                <div className="bg-[#111111] text-[#c5a059] text-center font-bold py-1 text-xs uppercase tracking-wider">
                  VEHICLE INFORMATION
                </div>
                <table className="w-full border-collapse border border-[#e5e5e5]">
                  <tbody>
                    {Array.from({ length: Math.ceil(vehicleFields.length / 2) }).map((_, rowIndex) => {
                      const field1 = vehicleFields[rowIndex * 2];
                      const field2 = vehicleFields[rowIndex * 2 + 1];
                      return (
                        <tr key={rowIndex}>
                          {field1 ? (
                            <>
                              <td className="w-1/4 bg-[#f4f2eb] border border-[#e5e5e5] p-1 px-2 font-bold text-[#111] align-middle">{field1.label}</td>
                              <td className="w-1/4 border border-[#e5e5e5] p-1 font-semibold text-[#333] h-6">{field1.value}</td>
                            </>
                          ) : (
                            <>
                              <td className="w-1/4 bg-[#f4f2eb] border border-[#e5e5e5] p-1 px-2 font-bold text-[#111] align-middle"></td>
                              <td className="w-1/4 border border-[#e5e5e5] p-1 h-6"></td>
                            </>
                          )}
                          {field2 ? (
                            <>
                              <td className="w-1/4 bg-[#f4f2eb] border border-[#e5e5e5] p-1 px-2 font-bold text-[#111] align-middle">{field2.label}</td>
                              <td className="w-1/4 border border-[#e5e5e5] p-1 font-semibold text-[#333] h-6">{field2.value}</td>
                            </>
                          ) : (
                            <>
                              <td className="w-1/4 bg-[#f4f2eb] border border-[#e5e5e5] p-1 px-2 font-bold text-[#111] align-middle"></td>
                              <td className="w-1/4 border border-[#e5e5e5] p-1 h-6"></td>
                            </>
                          )}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* USER / DRIVER INFORMATION */}
              <div className="mb-4">
                <div className="bg-[#111111] text-[#c5a059] text-center font-bold py-1 text-xs uppercase tracking-wider">
                  USER / DRIVER INFORMATION
                </div>
                <table className="w-full border-collapse border border-[#e5e5e5]">
                  <tbody>
                    {Array.from({ length: Math.ceil(driverFields.length / 2) }).map((_, rowIndex) => {
                      const field1 = driverFields[rowIndex * 2];
                      const field2 = driverFields[rowIndex * 2 + 1];
                      return (
                        <tr key={rowIndex}>
                          {field1 ? (
                            <>
                              <td className="w-1/4 bg-[#f4f2eb] border border-[#e5e5e5] p-1 px-2 font-bold text-[#111] align-middle">{field1.label}</td>
                              <td className="w-1/4 border border-[#e5e5e5] p-1 font-semibold text-[#333] h-6">{field1.value}</td>
                            </>
                          ) : (
                            <>
                              <td className="w-1/4 bg-[#f4f2eb] border border-[#e5e5e5] p-1 px-2 font-bold text-[#111] align-middle"></td>
                              <td className="w-1/4 border border-[#e5e5e5] p-1 h-6"></td>
                            </>
                          )}
                          {field2 ? (
                            <>
                              <td className="w-1/4 bg-[#f4f2eb] border border-[#e5e5e5] p-1 px-2 font-bold text-[#111] align-middle">{field2.label}</td>
                              <td className="w-1/4 border border-[#e5e5e5] p-1 font-semibold text-[#333] h-6">{field2.value}</td>
                            </>
                          ) : (
                            <>
                              <td className="w-1/4 bg-[#f4f2eb] border border-[#e5e5e5] p-1 px-2 font-bold text-[#111] align-middle"></td>
                              <td className="w-1/4 border border-[#e5e5e5] p-1 h-6"></td>
                            </>
                          )}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* INSPECTION CHECKLIST */}
              <div className="mb-4">
                <div className="bg-[#111111] text-[#c5a059] text-center font-bold py-1 text-xs uppercase tracking-wider border-b border-[#c5a059]">
                  INSPECTION CHECKLIST
                </div>
                <div className="flex border border-[#e5e5e5] border-t-0 items-stretch">
                  <div className="w-[45%] flex flex-col border-r border-[#e5e5e5]">
                    <div className="bg-[#222222] text-[#fff] text-center font-bold py-1 text-[10px]">
                      Vehicle Documents ✓
                    </div>
                    <div className="flex flex-col">
                      {[
                        { id: 1, label: 'Original Registration' },
                        { id: 2, label: 'Insurance Policy' },
                        { id: 3, label: 'Driving Authorization' },
                        { id: 4, label: 'Periodic Inspection' },
                      ].map((item) => (
                        <div key={'doc-' + item.id} className="flex border-b border-[#e5e5e5] last:border-0 h-5">
                          <div className="w-6 bg-[#c5a059] text-black font-bold flex items-center justify-center text-[10px]">{item.id}</div>
                          <div className="flex-1 flex items-center px-2 text-[9px]">{item.label}</div>
                          <div className="w-6 flex items-center justify-center border-l border-[#e5e5e5]">
                            <input type="checkbox" className="w-2.5 h-2.5 accent-[#c5a059] cursor-pointer" />
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="bg-[#222222] text-[#fff] text-center font-bold py-1 text-[10px] border-t border-[#e5e5e5]">
                      Vehicle Accessories ✓
                    </div>
                    <div className="grid grid-cols-2 flex-1">
                      {[
                        'Wipers & Arms', 'Side Mirrors', 'Rearview Mirror', 'Interior Lighting', 'Floor Mats',
                        'Insurance Documents', 'Radio / Audio System', 'Antenna', 'Battery', 'Spare Tire',
                        'Car Jack', 'Lug Wrench', 'Air Compressor', 'Tire Repair Plug Kit', 'Grippy Gloves',
                        'Tire Pressure Gauge', 'Jumper Cable 6 Gauge 12FT', 'Tow Rope 12FT', 'Safety Vest ANSI',
                        'Reflective Warning Triangle', 'Flashlight', 'First Aid Kit', 'Thermal Blanket',
                        'Glass Hammer', 'Seat Belt Cutter', 'Emergency Poncho', 'Air Shutoff Valve',
                        'Spark Arrestor', 'Battery Switch', 'Fire Extinguisher', 'Flag Pole 3 MTR'
                      ].map((item, index) => (
                        <div key={'acc-' + (index + 1)} className={`flex border-b border-[#e5e5e5] h-[16px] ${index % 2 === 0 ? 'border-r border-[#e5e5e5]' : ''}`}>
                          <div className="w-5 bg-[#c5a059] text-black font-bold flex items-center justify-center text-[8px]">{index + 1}</div>
                          <div className="flex-1 flex items-center px-1 text-[8px] leading-none">{item}</div>
                          <div className="w-5 flex items-center justify-center border-l border-[#e5e5e5]">
                            <input type="checkbox" className="w-2 h-2 accent-[#c5a059] cursor-pointer" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="w-[55%] flex flex-col bg-[#fbfbfb]">
                    <div className="text-center font-bold py-1.5 text-[10px] border-b border-[#e5e5e5]">
                      Vehicle Diagram — Multi-View
                    </div>
                    <div className="flex-1 flex items-center justify-center p-2">
                      <div className="w-full h-full min-h-[160px] border border-slate-200 rounded flex items-center justify-center bg-white overflow-hidden relative">
                        <img
                          src={currentType.diagram}
                          alt="Vehicle Diagram"
                          className="w-full h-full object-contain absolute inset-0"
                          onError={(e) => {
                            e.target.style.display = 'none';
                            e.target.nextElementSibling.style.display = 'flex';
                          }}
                        />
                        <div className="hidden flex-col items-center justify-center text-slate-400">
                          {currentType.icon}
                          <span className="text-[10px] mt-2">Diagram placeholder. Add image to src/assets</span>
                        </div>
                      </div>
                    </div>
                    <div className="p-3 border-t border-[#e5e5e5]">
                      <div className="font-bold text-[10px] mb-1">Additional Notes / Remarks:</div>
                      <div className="w-full min-h-[40px] p-1 border border-transparent rounded text-[10px] leading-relaxed whitespace-pre-wrap text-[#333]">
                        {remarks}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* VEHICLE RECEIPT DECLARATION */}
              <div className="mb-3">
                <div className="bg-[#111111] text-[#c5a059] text-center font-bold py-1 text-xs uppercase tracking-wider">
                  ◇ VEHICLE RECEIPT DECLARATION
                </div>
                <div className="border border-[#e5e5e5] border-t-0 p-3 text-[10px] leading-relaxed">
                  <p className="font-bold mb-1">I, the undersigned, hereby declare that:</p>
                  <p className="text-[#333]">
                    I have received the above-mentioned vehicle from the company for official work purposes only. I commit to maintaining the vehicle and all its accessories in good condition throughout daily use, and to ensuring regular maintenance is performed. In case of any problems, I will immediately notify management. I accept full responsibility for any damage caused by misuse or negligence. I will not hand over the vehicle to any other person or allow unauthorized use. I will return the vehicle immediately upon the company's request, and I will comply with all traffic laws and work regulations applicable in the United Arab Emirates.
                  </p>
                </div>
              </div>

              {/* SIGNATURES TABLE */}
              <div className="mb-2">
                <table className="w-full border-collapse border border-[#e5e5e5]">
                  <thead>
                    <tr className="bg-[#c5a059] text-black">
                      <th className="border border-[#e5e5e5] p-1 text-left text-[8px] w-[20%]">Date of Receipt</th>
                      <th className="border border-[#e5e5e5] p-1 text-left text-[8px] w-[20%]">Driver Signature</th>
                      <th className="border border-[#e5e5e5] p-1 text-left text-[8px] w-[20%]">Mechanic Signature</th>
                      <th className="border border-[#e5e5e5] p-1 text-left text-[8px] w-[20%]">Operations Manager Signature</th>
                      <th className="border border-[#e5e5e5] p-1 text-left text-[8px] w-[20%]">Supervisor Signature</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-[#e5e5e5] p-1 h-8 align-top font-semibold text-[#333]">{receiptDate}</td>
                      <td className="border border-[#e5e5e5] p-1 h-8"></td>
                      <td className="border border-[#e5e5e5] p-1 h-8"></td>
                      <td className="border border-[#e5e5e5] p-1 h-8"></td>
                      <td className="border border-[#e5e5e5] p-1 h-8"></td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* FOOTER */}
              <div className="mt-auto text-center border-t border-[#e5e5e5] pt-3 text-[9px] text-[#666]">
                ◆ ACCESS LION — اكسس ليون ◆ Vehicle Reception Form ◆ All Rights Reserved ◆
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

