import { useState } from 'react';
import { Printer, CarFront, Truck, Bus, Users, FileText } from 'lucide-react';

// Use the newly attached logo and diagrams by importing them here.
import newLogo from './assets/AL_Logo_Gold.png'; 
import lightVehicleDiagram from './assets/pickup_diagram.png'; 
import tankerDiagram from './assets/tanker_diagram.png'; 
import busDiagram from './assets/bus_diagram.png'; 

export default function VehicleReceptionReport() {
  const [vehicleType, setVehicleType] = useState('light');
  const [activeTab, setActiveTab] = useState('vehicle');

  const [vehicleInfo, setVehicleInfo] = useState({
    plateNo: '',
    chassisNo: '',
    brand: '',
    model: '',
    color: '',
    year: '',
    owner: '',
    odometer: ''
  });

  const [driverInfo, setDriverInfo] = useState({
    fullName: '',
    companyName: '',
    companyLicense: '',
    expiryDate: ''
  });

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

          <button
            onClick={handlePrint}
            className="flex items-center gap-2 bg-[#c5a059] hover:bg-[#b08d4a] text-black font-bold px-5 py-2.5 rounded-lg transition-colors shadow-lg"
          >
            <Printer className="w-5 h-5" />
            <span>Print Document</span>
          </button>
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
              <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider mb-2 border-b border-slate-800 pb-2">Vehicle Details</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-400">Plate No.</label>
                  <input type="text" value={vehicleInfo.plateNo} onChange={(e) => setVehicleInfo({...vehicleInfo, plateNo: e.target.value})} className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-[#c5a059]" placeholder="Plate No." />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-400">Chassis No.</label>
                  <input type="text" value={vehicleInfo.chassisNo} onChange={(e) => setVehicleInfo({...vehicleInfo, chassisNo: e.target.value})} className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-[#c5a059]" placeholder="Chassis No." />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-400">Make / Brand</label>
                  <input type="text" value={vehicleInfo.brand} onChange={(e) => setVehicleInfo({...vehicleInfo, brand: e.target.value})} className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-[#c5a059]" placeholder="Make / Brand" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-400">Model</label>
                  <input type="text" value={vehicleInfo.model} onChange={(e) => setVehicleInfo({...vehicleInfo, model: e.target.value})} className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-[#c5a059]" placeholder="Model" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-400">Color</label>
                  <input type="text" value={vehicleInfo.color} onChange={(e) => setVehicleInfo({...vehicleInfo, color: e.target.value})} className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-[#c5a059]" placeholder="Color" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-400">Year</label>
                  <input type="text" value={vehicleInfo.year} onChange={(e) => setVehicleInfo({...vehicleInfo, year: e.target.value})} className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-[#c5a059]" placeholder="Year" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-400">Owner</label>
                  <input type="text" value={vehicleInfo.owner} onChange={(e) => setVehicleInfo({...vehicleInfo, owner: e.target.value})} className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-[#c5a059]" placeholder="Owner" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-400">Odometer (Out)</label>
                  <input type="text" value={vehicleInfo.odometer} onChange={(e) => setVehicleInfo({...vehicleInfo, odometer: e.target.value})} className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-[#c5a059]" placeholder="Odometer" />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'driver' && (
            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-xl">
              <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider mb-2 border-b border-slate-800 pb-2">Driver Details</h3>
              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-400">Full Name</label>
                  <input type="text" value={driverInfo.fullName} onChange={(e) => setDriverInfo({...driverInfo, fullName: e.target.value})} className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-[#c5a059]" placeholder="Full Name" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-400">Company Name</label>
                  <input type="text" value={driverInfo.companyName} onChange={(e) => setDriverInfo({...driverInfo, companyName: e.target.value})} className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-[#c5a059]" placeholder="Company Name" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-400">Company License</label>
                  <input type="text" value={driverInfo.companyLicense} onChange={(e) => setDriverInfo({...driverInfo, companyLicense: e.target.value})} className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-[#c5a059]" placeholder="Company License" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-400">Expiry Date</label>
                  <input type="text" value={driverInfo.expiryDate} onChange={(e) => setDriverInfo({...driverInfo, expiryDate: e.target.value})} className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-[#c5a059]" placeholder="Expiry Date" />
                </div>
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
        <section className="lg:col-span-7 flex justify-center lg:justify-end print:col-span-12 print:justify-center overflow-x-auto pb-12">
          <div className="w-full max-w-[800px] min-w-[794px] bg-white text-black shadow-2xl overflow-hidden flex flex-col print-full-width print:border-none print:shadow-none min-h-[1123px] print:min-h-0 relative font-[Arial,sans-serif] text-[11px] print-a4-strict">
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
                    <tr>
                      <td className="w-1/4 bg-[#f4f2eb] border border-[#e5e5e5] p-1 px-2 font-bold text-[#111] align-middle">Plate No.</td>
                      <td className="w-1/4 border border-[#e5e5e5] p-1 font-semibold text-[#333] h-6">{vehicleInfo.plateNo}</td>
                      <td className="w-1/4 bg-[#f4f2eb] border border-[#e5e5e5] p-1 px-2 font-bold text-[#111] align-middle">Chassis No.</td>
                      <td className="w-1/4 border border-[#e5e5e5] p-1 font-semibold text-[#333] h-6">{vehicleInfo.chassisNo}</td>
                    </tr>
                    <tr>
                      <td className="bg-[#f4f2eb] border border-[#e5e5e5] p-1 px-2 font-bold text-[#111] align-middle">Make / Brand</td>
                      <td className="border border-[#e5e5e5] p-1 font-semibold text-[#333] h-6">{vehicleInfo.brand}</td>
                      <td className="bg-[#f4f2eb] border border-[#e5e5e5] p-1 px-2 font-bold text-[#111] align-middle">Model</td>
                      <td className="border border-[#e5e5e5] p-1 font-semibold text-[#333] h-6">{vehicleInfo.model}</td>
                    </tr>
                    <tr>
                      <td className="bg-[#f4f2eb] border border-[#e5e5e5] p-1 px-2 font-bold text-[#111] align-middle">Color</td>
                      <td className="border border-[#e5e5e5] p-1 font-semibold text-[#333] h-6">{vehicleInfo.color}</td>
                      <td className="bg-[#f4f2eb] border border-[#e5e5e5] p-1 px-2 font-bold text-[#111] align-middle">Year</td>
                      <td className="border border-[#e5e5e5] p-1 font-semibold text-[#333] h-6">{vehicleInfo.year}</td>
                    </tr>
                    <tr>
                      <td className="bg-[#f4f2eb] border border-[#e5e5e5] p-1 px-2 font-bold text-[#111] align-middle">Owner</td>
                      <td className="border border-[#e5e5e5] p-1 font-semibold text-[#333] h-6">{vehicleInfo.owner}</td>
                      <td className="bg-[#f4f2eb] border border-[#e5e5e5] p-1 px-2 font-bold text-[#111] align-middle">Odometer (Out)</td>
                      <td className="border border-[#e5e5e5] p-1 font-semibold text-[#333] h-6">{vehicleInfo.odometer}</td>
                    </tr>
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
                    <tr>
                      <td className="w-1/4 bg-[#f4f2eb] border border-[#e5e5e5] p-1 px-2 font-bold text-[#111] align-middle">Full Name</td>
                      <td className="w-1/4 border border-[#e5e5e5] p-1 font-semibold text-[#333] h-6">{driverInfo.fullName}</td>
                      <td className="w-1/4 bg-[#f4f2eb] border border-[#e5e5e5] p-1 px-2 font-bold text-[#111] align-middle">Company Name</td>
                      <td className="w-1/4 border border-[#e5e5e5] p-1 font-semibold text-[#333] h-6">{driverInfo.companyName}</td>
                    </tr>
                    <tr>
                      <td className="bg-[#f4f2eb] border border-[#e5e5e5] p-1 px-2 font-bold text-[#111] align-middle">Company License</td>
                      <td className="border border-[#e5e5e5] p-1 font-semibold text-[#333] h-6">{driverInfo.companyLicense}</td>
                      <td className="bg-[#f4f2eb] border border-[#e5e5e5] p-1 px-2 font-bold text-[#111] align-middle">Expiry Date</td>
                      <td className="border border-[#e5e5e5] p-1 font-semibold text-[#333] h-6">{driverInfo.expiryDate}</td>
                    </tr>
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
    </div>
  );
}

