import React, { useState } from 'react';
import { Printer, Download, CarFront, Truck, Bus } from 'lucide-react';

// Use the newly attached logo and diagrams by importing them here.
// IMPORTANT: You will need to save the attached images into the `src/assets/` folder
// with these exact filenames, or update the filenames here to match what you saved them as.
import newLogo from './assets/AL_Logo_Gold.png'; // The newly attached gold logo
import lightVehicleDiagram from './assets/pickup_diagram.png'; // The pickup truck multi-view
import tankerDiagram from './assets/tanker_diagram.png'; // The tanker multi-view
import busDiagram from './assets/bus_diagram.png'; // The bus multi-view

export default function VehicleReceptionReport() {
  const [vehicleType, setVehicleType] = useState('light'); // 'light', 'tanker', 'bus'

  const vehicleTypes = {
    light: {
      id: 'light',
      label: 'Light Vehicles & Pickup Trucks',
      icon: <CarFront className="w-4 h-4" />,
      diagram: lightVehicleDiagram
    },
    tanker: {
      id: 'tanker',
      label: 'Tankers & Trailers',
      icon: <Truck className="w-4 h-4" />,
      diagram: tankerDiagram
    },
    bus: {
      id: 'bus',
      label: 'Buses & Coaches',
      icon: <Bus className="w-4 h-4" />,
      diagram: busDiagram
    }
  };

  const currentType = vehicleTypes[vehicleType];

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 font-sans print:bg-white print:text-black print:min-h-0">
      {/* PRINT-ONLY CSS STYLES FOR EXACT A4 FIT */}
      <style dangerouslySetInnerHTML={{__html: `
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
          input, textarea {
            border: none !important;
            background: transparent !important;
            box-shadow: none !important;
            padding: 0 !important;
            color: black !important;
            resize: none !important;
          }
          /* Remove placeholder text in print */
          input::placeholder, textarea::placeholder {
            color: transparent !important;
          }
          .hide-border-print {
            border-color: transparent !important;
          }
        }
      `}} />

      {/* HEADER BAR (HIDDEN ON PRINT) */}
      <header className="no-print bg-slate-950 border-b border-slate-800 px-6 py-4 sticky top-0 z-50 shadow-md">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* Vehicle Type Selector */}
          <div className="flex items-center bg-slate-900 border border-slate-800 rounded-lg p-1">
            {Object.values(vehicleTypes).map(type => (
              <button 
                key={type.id}
                onClick={() => setVehicleType(type.id)}
                className={`flex items-center gap-2 px-4 py-2 text-sm font-bold rounded-md transition-all ${
                  vehicleType === type.id 
                    ? 'bg-[#c5a059] text-black shadow-md' 
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                }`}
              >
                {type.icon}
                {type.label}
              </button>
            ))}
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-3">
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
      <main className="max-w-7xl mx-auto px-4 py-8 flex flex-col items-center justify-start print-full-width">
        
        {/* THE DOCUMENT CONTAINER */}
        <div className="w-full max-w-[800px] bg-white text-black shadow-2xl overflow-hidden flex flex-col print-full-width print:border-none print:shadow-none min-h-[1000px] print:min-h-0 relative font-[Arial,sans-serif] text-[11px] print-a4-strict">
          
          <div className="flex flex-col flex-1 p-6 print:p-0 h-full">
            
            {/* BRAND HEADER */}
            <div className="bg-[#111111] border-b-[3px] border-[#c5a059] flex items-center justify-between p-2 rounded-t-md print:rounded-none">
              <img src={newLogo} alt="Access Lion Logo" className="h-12 w-12 object-contain" onError={(e) => { e.target.style.display = 'none'; }} />
              <div className="text-center text-[#c5a059]">
                <h1 className="text-xl font-bold tracking-[0.2em] mb-1">ACCESS LION</h1>
                <p className="text-[10px] tracking-widest">Transportation & Fleet Management — اكسس لايون</p>
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
                    <td className="w-1/4 border border-[#e5e5e5] p-1"><input type="text" className="w-full h-full p-0.5 border border-slate-200 rounded hide-border-print focus:outline-none focus:border-[#c5a059]" /></td>
                    <td className="w-1/4 bg-[#f4f2eb] border border-[#e5e5e5] p-1 px-2 font-bold text-[#111] align-middle">Chassis No.</td>
                    <td className="w-1/4 border border-[#e5e5e5] p-1"><input type="text" className="w-full h-full p-0.5 border border-slate-200 rounded hide-border-print focus:outline-none focus:border-[#c5a059]" /></td>
                  </tr>
                  <tr>
                    <td className="bg-[#f4f2eb] border border-[#e5e5e5] p-1 px-2 font-bold text-[#111] align-middle">Make / Brand</td>
                    <td className="border border-[#e5e5e5] p-1"><input type="text" className="w-full h-full p-0.5 border border-slate-200 rounded hide-border-print focus:outline-none focus:border-[#c5a059]" /></td>
                    <td className="bg-[#f4f2eb] border border-[#e5e5e5] p-1 px-2 font-bold text-[#111] align-middle">Model</td>
                    <td className="border border-[#e5e5e5] p-1"><input type="text" className="w-full h-full p-0.5 border border-slate-200 rounded hide-border-print focus:outline-none focus:border-[#c5a059]" /></td>
                  </tr>
                  <tr>
                    <td className="bg-[#f4f2eb] border border-[#e5e5e5] p-1 px-2 font-bold text-[#111] align-middle">Color</td>
                    <td className="border border-[#e5e5e5] p-1"><input type="text" className="w-full h-full p-0.5 border border-slate-200 rounded hide-border-print focus:outline-none focus:border-[#c5a059]" /></td>
                    <td className="bg-[#f4f2eb] border border-[#e5e5e5] p-1 px-2 font-bold text-[#111] align-middle">Year</td>
                    <td className="border border-[#e5e5e5] p-1"><input type="text" className="w-full h-full p-0.5 border border-slate-200 rounded hide-border-print focus:outline-none focus:border-[#c5a059]" /></td>
                  </tr>
                  <tr>
                    <td className="bg-[#f4f2eb] border border-[#e5e5e5] p-1 px-2 font-bold text-[#111] align-middle">Owner</td>
                    <td className="border border-[#e5e5e5] p-1"><input type="text" className="w-full h-full p-0.5 border border-slate-200 rounded hide-border-print focus:outline-none focus:border-[#c5a059]" /></td>
                    <td className="bg-[#f4f2eb] border border-[#e5e5e5] p-1 px-2 font-bold text-[#111] align-middle">Odometer (Out)</td>
                    <td className="border border-[#e5e5e5] p-1"><input type="text" className="w-full h-full p-0.5 border border-slate-200 rounded hide-border-print focus:outline-none focus:border-[#c5a059]" /></td>
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
                    <td className="w-1/4 border border-[#e5e5e5] p-1"><input type="text" className="w-full h-full p-0.5 border border-slate-200 rounded hide-border-print focus:outline-none focus:border-[#c5a059]" /></td>
                    <td className="w-1/4 bg-[#f4f2eb] border border-[#e5e5e5] p-1 px-2 font-bold text-[#111] align-middle">ID / Iqama No.</td>
                    <td className="w-1/4 border border-[#e5e5e5] p-1"><input type="text" className="w-full h-full p-0.5 border border-slate-200 rounded hide-border-print focus:outline-none focus:border-[#c5a059]" /></td>
                  </tr>
                  <tr>
                    <td className="bg-[#f4f2eb] border border-[#e5e5e5] p-1 px-2 font-bold text-[#111] align-middle">License Type</td>
                    <td className="border border-[#e5e5e5] p-1"><input type="text" className="w-full h-full p-0.5 border border-slate-200 rounded hide-border-print focus:outline-none focus:border-[#c5a059]" /></td>
                    <td className="bg-[#f4f2eb] border border-[#e5e5e5] p-1 px-2 font-bold text-[#111] align-middle">Expiry Date</td>
                    <td className="border border-[#e5e5e5] p-1"><input type="text" className="w-full h-full p-0.5 border border-slate-200 rounded hide-border-print focus:outline-none focus:border-[#c5a059]" /></td>
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
                
                {/* Left Side: Checklists */}
                <div className="w-[45%] flex flex-col border-r border-[#e5e5e5]">
                  
                  {/* Vehicle Documents */}
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
                      <div key={'doc-'+item.id} className="flex border-b border-[#e5e5e5] last:border-0 h-5">
                        <div className="w-6 bg-[#c5a059] text-black font-bold flex items-center justify-center text-[10px]">{item.id}</div>
                        <div className="flex-1 flex items-center px-2 text-[9px]">{item.label}</div>
                        <div className="w-6 flex items-center justify-center border-l border-[#e5e5e5]">
                          <input type="checkbox" className="w-2.5 h-2.5 accent-[#c5a059] cursor-pointer" />
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Vehicle Accessories */}
                  <div className="bg-[#222222] text-[#fff] text-center font-bold py-1 text-[10px] border-t border-[#e5e5e5]">
                    Vehicle Accessories ✓
                  </div>
                  <div className="grid grid-cols-2 flex-1">
                    {[
                      'Wipers & Arms',
                      'Side Mirrors',
                      'Rearview Mirror',
                      'Interior Lighting',
                      'Floor Mats',
                      'Insurance Documents',
                      'Radio / Audio System',
                      'Antenna',
                      'Battery',
                      'Spare Tire',
                      'Car Jack',
                      'Lug Wrench',
                      'Air Compressor',
                      'Tire Repair Plug Kit',
                      'Grippy Gloves',
                      'Tire Pressure Gauge',
                      'Jumper Cable 6 Gauge 12FT',
                      'Tow Rope 12FT',
                      'Safety Vest ANSI',
                      'Reflective Warning Triangle',
                      'Flashlight',
                      'First Aid Kit',
                      'Thermal Blanket',
                      'Glass Hammer',
                      'Seat Belt Cutter',
                      'Emergency Poncho',
                      'Air Shutoff Valve',
                      'Spark Arrestor',
                      'Battery Switch',
                      'Fire Extinguisher'
                    ].map((item, index) => (
                      <div key={'acc-'+(index+1)} className={`flex border-b border-[#e5e5e5] h-[16px] ${index % 2 === 0 ? 'border-r border-[#e5e5e5]' : ''}`}>
                        <div className="w-5 bg-[#c5a059] text-black font-bold flex items-center justify-center text-[8px]">{index + 1}</div>
                        <div className="flex-1 flex items-center px-1 text-[8px] leading-none">{item}</div>
                        <div className="w-5 flex items-center justify-center border-l border-[#e5e5e5]">
                          <input type="checkbox" className="w-2 h-2 accent-[#c5a059] cursor-pointer" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Right Side: Diagram & Notes */}
                <div className="w-[55%] flex flex-col bg-[#fbfbfb]">
                  <div className="text-center font-bold py-1.5 text-[10px] border-b border-[#e5e5e5]">
                    Vehicle Diagram — Multi-View
                  </div>
                  <div className="flex-1 flex items-center justify-center p-2">
                    <div className="w-full h-full min-h-[160px] border border-slate-200 rounded flex items-center justify-center bg-white overflow-hidden relative">
                      {/* Diagram Image */}
                      <img 
                        src={currentType.diagram} 
                        alt="Vehicle Diagram" 
                        className="w-full h-full object-contain absolute inset-0"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.nextElementSibling.style.display = 'flex';
                        }}
                      />
                      {/* Fallback if image not found */}
                      <div className="hidden flex-col items-center justify-center text-slate-400">
                        {currentType.icon}
                        <span className="text-[10px] mt-2">Diagram placeholder. Add image to src/assets</span>
                      </div>
                    </div>
                  </div>
                  <div className="p-3 border-t border-[#e5e5e5]">
                    <div className="font-bold text-[10px] mb-1">Additional Notes / Remarks:</div>
                    <textarea 
                      className="w-full h-[40px] p-2 border border-[#e5e5e5] rounded text-[10px] leading-relaxed hide-border-print focus:outline-none focus:border-[#c5a059]"
                      placeholder="Enter remarks here..."
                    ></textarea>
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
                  I have received the above-mentioned vehicle from the company for official work purposes only. I commit to maintaining the vehicle and all its accessories in good condition throughout daily use, and to ensuring regular maintenance is performed. In case of any problems, I will immediately notify management. I accept full responsibility for any damage caused by misuse or negligence. I will not hand over the vehicle to any other person or allow unauthorized use. I will return the vehicle immediately upon the company's request, and I will comply with all traffic laws and work regulations applicable in the Kingdom of Saudi Arabia.
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
                    <td className="border border-[#e5e5e5] p-1 h-8 align-top"><input type="text" className="w-full h-full px-1 border border-transparent hide-border-print focus:outline-none" /></td>
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
              ◆ ACCESS LION — اكسس لايون ◆ Vehicle Reception Form ◆ All Rights Reserved ◆
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}
