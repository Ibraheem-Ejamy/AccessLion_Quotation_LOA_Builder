import React, { useState, useRef } from 'react';
import * as docx from "docx";
import { saveAs } from "file-saver";
import defaultLogo from './assets/logo1.png';
import adnocHeader from './assets/adnoc_header.png';
import adnocFooter from './assets/adnoc_footer.png';
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
    companyName: "اكسس ليون للمقاولات والنقليات العامة - ذ.م.م -ش.و.و",
    occupation: "سائق باص",
    visaIssueArea: "ابوظبي"
  };

  const initialVehicleItem = {
    id: "1",
    companyName: "اكسس ليون للمقاولات والنقليات العامة - ذ.م.م -ش.و.و",
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
  const [customStamp, setCustomStamp] = useState(null);
  const [customSignature, setCustomSignature] = useState(null);
  const [statusMessage, setStatusMessage] = useState(null);
  const fileInputRef = useRef(null);

  // --- HELPERS ---
  const showToast = (text, type = "success") => {
    setStatusMessage({ text, type });
    setTimeout(() => setStatusMessage(null), 4000);
  };

  const resizeImage = (file, maxWidth, maxHeight, callback) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        callback(canvas.toDataURL(file.type || 'image/png'));
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  };

  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      resizeImage(file, 1200, 1200, (resizedBase64) => {
        setCustomLogo(resizedBase64);
        showToast("Logo updated successfully!");
      });
    }
  };

  const handleStampUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      resizeImage(file, 1200, 1200, (resizedBase64) => {
        setCustomStamp(resizedBase64);
        showToast("Stamp uploaded successfully!");
      });
    }
  };

  const handleSignatureUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      resizeImage(file, 1200, 1200, (resizedBase64) => {
        setCustomSignature(resizedBase64);
        showToast("Signature uploaded successfully!");
      });
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
      vehicleItems,
      customStamp,
      customSignature
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
        if (parsed.customStamp) setCustomStamp(parsed.customStamp);
        if (parsed.customSignature) setCustomSignature(parsed.customSignature);
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

  const exportToWord = async () => {
    try {
      showToast("Generating Document...", "info");
      
      const { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell, ImageRun, AlignmentType, WidthType, BorderStyle, Header, Footer, ShadingType } = docx;

      const getAbsoluteUrl = (imgSrc) => {
        if (!imgSrc) return "";
        if (imgSrc.startsWith('http') || imgSrc.startsWith('data:')) return imgSrc;
        const a = document.createElement('a');
        a.href = imgSrc;
        return a.href;
      };

      const urlToArrayBuffer = async (url) => {
        const response = await fetch(getAbsoluteUrl(url));
        const blob = await response.blob();
        return await blob.arrayBuffer();
      };

      const headerBuffer = await urlToArrayBuffer(adnocHeader);
      const footerBuffer = await urlToArrayBuffer(adnocFooter);
      
      const getImgDimensions = (id, targetHeight) => {
        const node = document.getElementById(id);
        if (node && node.naturalHeight) {
          let calcW = Math.round(node.naturalWidth * (targetHeight / node.naturalHeight));
          let calcH = targetHeight;
          const MAX_W = 680; // Max A4 width in pixels
          if (calcW > MAX_W) {
            calcH = Math.max(10, Math.round(calcH * (MAX_W / calcW)));
            calcW = MAX_W;
          }
          return {
            w: Math.max(10, calcW),
            h: Math.max(10, calcH)
          };
        }
        return { w: targetHeight * 2, h: targetHeight };
      };

      const hDim = getImgDimensions('header-img', 112);
      const fDim = getImgDimensions('footer-img', 96);
      const sigDim = getImgDimensions('sig-img', 70);
      const stampDim = getImgDimensions('stamp-img', 85);

      const tableRowsData = [];
      const headerColor = "D4C38E";

      // Create Table Header
      if (formType === 'names') {
        tableRowsData.push(
          new TableRow({
            children: [
              new TableCell({ children: [new Paragraph({ text: "مكان صدور الاقامة", alignment: AlignmentType.CENTER }), new Paragraph({ text: "Place of visa issue area", alignment: AlignmentType.CENTER })], shading: { fill: headerColor, type: ShadingType.CLEAR, color: "auto" } }),
              new TableCell({ children: [new Paragraph({ text: "المهنة", alignment: AlignmentType.CENTER }), new Paragraph({ text: "Occupation", alignment: AlignmentType.CENTER })], shading: { fill: headerColor, type: ShadingType.CLEAR, color: "auto" } }),
              new TableCell({ children: [new Paragraph({ text: "اسم الشركة", alignment: AlignmentType.CENTER }), new Paragraph({ text: "Company Name", alignment: AlignmentType.CENTER })], shading: { fill: headerColor, type: ShadingType.CLEAR, color: "auto" } }),
              new TableCell({ children: [new Paragraph({ text: "الجنسية", alignment: AlignmentType.CENTER }), new Paragraph({ text: "Nationality", alignment: AlignmentType.CENTER })], shading: { fill: headerColor, type: ShadingType.CLEAR, color: "auto" } }),
              new TableCell({ children: [new Paragraph({ text: "الاسم", alignment: AlignmentType.CENTER }), new Paragraph({ text: "Name", alignment: AlignmentType.CENTER })], shading: { fill: headerColor, type: ShadingType.CLEAR, color: "auto" } }),
              new TableCell({ children: [new Paragraph({ text: "رقم", alignment: AlignmentType.CENTER }), new Paragraph({ text: "No", alignment: AlignmentType.CENTER })], shading: { fill: headerColor, type: ShadingType.CLEAR, color: "auto" } }),
            ]
          })
        );
        nameItems.forEach((item, index) => {
          tableRowsData.push(
            new TableRow({
              children: [
                new TableCell({ children: [new Paragraph({ text: item.visaIssueArea || "", alignment: AlignmentType.CENTER })] }),
                new TableCell({ children: [new Paragraph({ text: item.occupation || "", alignment: AlignmentType.CENTER })] }),
                new TableCell({ children: [new Paragraph({ text: item.companyName || "", alignment: AlignmentType.CENTER })] }),
                new TableCell({ children: [new Paragraph({ text: item.nationality || "", alignment: AlignmentType.CENTER })] }),
                new TableCell({ children: [new Paragraph({ text: item.name || "", alignment: AlignmentType.RIGHT })] }),
                new TableCell({ children: [new Paragraph({ text: (index + 1).toString(), alignment: AlignmentType.CENTER })] }),
              ]
            })
          );
        });
      } else {
        tableRowsData.push(
          new TableRow({
            children: [
              new TableCell({ children: [new Paragraph({ text: "تاريخ انتهاء الملكية", alignment: AlignmentType.CENTER }), new Paragraph({ text: "License Expiry Date", alignment: AlignmentType.CENTER })], shading: { fill: headerColor, type: ShadingType.CLEAR, color: "auto" } }),
              new TableCell({ children: [new Paragraph({ text: "نوع المركبة", alignment: AlignmentType.CENTER }), new Paragraph({ text: "Type of Car", alignment: AlignmentType.CENTER })], shading: { fill: headerColor, type: ShadingType.CLEAR, color: "auto" } }),
              new TableCell({ children: [new Paragraph({ text: "مصدر اللوحة", alignment: AlignmentType.CENTER }), new Paragraph({ text: "Place of Issue", alignment: AlignmentType.CENTER })], shading: { fill: headerColor, type: ShadingType.CLEAR, color: "auto" } }),
              new TableCell({ children: [new Paragraph({ text: "نوع اللوحة", alignment: AlignmentType.CENTER }), new Paragraph({ text: "Plate Type", alignment: AlignmentType.CENTER })], shading: { fill: headerColor, type: ShadingType.CLEAR, color: "auto" } }),
              new TableCell({ children: [new Paragraph({ text: "رقم اللوحة", alignment: AlignmentType.CENTER }), new Paragraph({ text: "Plate No.", alignment: AlignmentType.CENTER })], shading: { fill: headerColor, type: ShadingType.CLEAR, color: "auto" } }),
              new TableCell({ children: [new Paragraph({ text: "اسم الشركة", alignment: AlignmentType.CENTER }), new Paragraph({ text: "Company Name", alignment: AlignmentType.CENTER })], shading: { fill: headerColor, type: ShadingType.CLEAR, color: "auto" } }),
              new TableCell({ children: [new Paragraph({ text: "الرقم", alignment: AlignmentType.CENTER }), new Paragraph({ text: "No.", alignment: AlignmentType.CENTER })], shading: { fill: headerColor, type: ShadingType.CLEAR, color: "auto" } }),
            ]
          })
        );
        vehicleItems.forEach((item, index) => {
          tableRowsData.push(
            new TableRow({
              children: [
                new TableCell({ children: [new Paragraph({ text: item.licenseExpiryDate || "", alignment: AlignmentType.CENTER })] }),
                new TableCell({ children: [new Paragraph({ text: item.typeOfCar || "", alignment: AlignmentType.CENTER })] }),
                new TableCell({ children: [new Paragraph({ text: item.placeOfIssue || "", alignment: AlignmentType.CENTER })] }),
                new TableCell({ children: [new Paragraph({ text: item.plateType || "", alignment: AlignmentType.CENTER })] }),
                new TableCell({ children: [new Paragraph({ text: item.plateNo || "", alignment: AlignmentType.CENTER })] }),
                new TableCell({ children: [new Paragraph({ text: item.companyName || "", alignment: AlignmentType.CENTER })] }),
                new TableCell({ children: [new Paragraph({ text: (index + 1).toString(), alignment: AlignmentType.CENTER })] }),
              ]
            })
          );
        });
      }

      let sigTable = null;
      if (customSignature || customStamp) {
        const sigChildren = [];
        if (customSignature) {
          const sigBuf = await urlToArrayBuffer(customSignature);
          sigChildren.push(new ImageRun({ data: sigBuf, transformation: { width: sigDim.w, height: sigDim.h } }));
        }
        if (customStamp) {
          const stampBuf = await urlToArrayBuffer(customStamp);
          sigChildren.push(new ImageRun({ data: stampBuf, transformation: { width: stampDim.w, height: stampDim.h } }));
        }

        sigTable = new Table({
          width: { size: 100, type: WidthType.PERCENTAGE },
          borders: { top: { style: BorderStyle.NONE }, bottom: { style: BorderStyle.NONE }, left: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE }, insideHorizontal: { style: BorderStyle.NONE }, insideVertical: { style: BorderStyle.NONE } },
          rows: [
            new TableRow({
              children: [
                new TableCell({ children: [new Paragraph({ text: "Authorized signatory with company seal:", bold: true })] }),
                new TableCell({ children: [new Paragraph({ children: sigChildren, alignment: AlignmentType.CENTER })] }),
                new TableCell({ children: [new Paragraph({ text: "المخول بالتوقيع مع ختم الشركة:", bold: true, alignment: AlignmentType.RIGHT })] })
              ]
            })
          ]
        });
      }

      const doc = new Document({
        styles: {
          default: {
            document: {
              run: {
                font: "Arial",
              },
            },
          },
        },
        sections: [{
          properties: {
            page: {
              margin: {
                top: 720,
                right: 720,
                bottom: 720,
                left: 720,
                header: 720,
                footer: 100,
              },
            },
          },
          headers: {
            default: new Header({
              children: [
                new Paragraph({
                  alignment: AlignmentType.RIGHT,
                  children: [
                    new ImageRun({
                      data: headerBuffer,
                      transformation: { width: hDim.w, height: hDim.h }
                    })
                  ]
                })
              ]
            })
          },
          footers: {
            default: new Footer({
              children: [
                new Table({
                  width: { size: 100, type: WidthType.PERCENTAGE },
                  borders: {
                    top: { color: "1D448E", space: 1, style: BorderStyle.SINGLE, size: 12 },
                    bottom: { style: BorderStyle.NONE }, left: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE }, insideHorizontal: { style: BorderStyle.NONE }, insideVertical: { style: BorderStyle.NONE }
                  },
                  rows: [
                    new TableRow({
                      children: [
                        new TableCell({
                          borders: { top: { style: BorderStyle.NONE }, bottom: { style: BorderStyle.NONE }, left: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE } },
                          children: [
                            new Paragraph({
                              alignment: AlignmentType.RIGHT,
                              children: [
                                new ImageRun({ data: footerBuffer, transformation: { width: fDim.w, height: fDim.h } })
                              ]
                            })
                          ]
                        })
                      ]
                    })
                  ]
                })
              ]
            })
          },
          children: [
            new Paragraph({
              alignment: AlignmentType.CENTER,
              children: [new TextRun({ text: `Company Name: ${companyInfo?.nameEn || ""}`, bold: true })]
            }),
            new Paragraph({
              alignment: AlignmentType.CENTER,
              children: [new TextRun({ text: `اسم الشركة: ${companyInfo?.nameAr || ""}`, bold: true })]
            }),
            new Paragraph({ children: [], spacing: { after: 200 } }),
            new Paragraph({
              alignment: AlignmentType.CENTER,
              children: [new TextRun({ text: formType === 'names' ? 'نموذج كشف الاسماء' : 'نموذج كشف المركبات والمعدات', bold: true, size: 28 })]
            }),
            new Paragraph({
              alignment: AlignmentType.CENTER,
              children: [new TextRun({ text: formType === 'names' ? 'Names Disclosure Form' : 'Vehicles & Equipment Disclosure Form', size: 24 })]
            }),
            new Paragraph({ children: [], spacing: { after: 200 } }),
            
            new Table({
              width: { size: 100, type: WidthType.PERCENTAGE },
              rows: tableRowsData
            }),
            
            new Paragraph({ children: [], spacing: { after: 200 } }),
            new Paragraph({
              alignment: AlignmentType.CENTER,
              children: [new TextRun({ text: "تتعهد الشركة المذكورة بأن تلتزم بصحة البيانات الموضحة في الكشف اعلاه.", bold: true, italics: true })]
            }),
            new Paragraph({
              alignment: AlignmentType.CENTER,
              children: [new TextRun({ text: "The company undertakes of accuracy of the information that mentioned in the disclosure above.", italics: true })]
            }),
            new Paragraph({ children: [], spacing: { after: 400 } }),
            
            ...(sigTable ? [
              new Paragraph({ children: [], borders: { top: { color: "000000", space: 1, style: BorderStyle.DASHED, size: 6 } } }),
              sigTable
            ] : [])
          ]
        }]
      });

      const blob = await Packer.toBlob(doc);
      saveAs(blob, `LOA_${formType}.docx`);
      showToast("Downloaded perfectly as Word document!");
    } catch (err) {
      console.error("Docx generation error:", err);
      alert(`Error generating DOCX: ${err.message}`);
      showToast("Failed to generate Word document.", "error");
    }
  };

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
          @page {
            size: 210mm 297mm;
            margin: 0 !important;
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
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-end gap-4">
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
              onClick={exportToWord}
              className="flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold px-4 py-2 rounded-lg transition-colors shadow-lg"
            >
              <Download className="w-4 h-4" />
              <span>Download Word</span>
            </button>
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
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-xs font-semibold rounded-lg transition-all ${activeTab === 'items' ? 'bg-amber-500 text-slate-950 shadow-md' : 'text-slate-400 hover:bg-slate-900 hover:text-slate-100'
                }`}
            >
              <Briefcase className="w-4 h-4" />
              Rows
            </button>
            <button
              onClick={() => setActiveTab("general")}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-xs font-semibold rounded-lg transition-all ${activeTab === 'general' ? 'bg-amber-500 text-slate-950 shadow-md' : 'text-slate-400 hover:bg-slate-900 hover:text-slate-100'
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

                {/* Stamp & Signature Uploads */}
                <div className="pt-4 border-t border-slate-800 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-slate-400">Company Stamp (.png)</label>
                    <div className="flex items-center gap-3">
                      <label className="flex-1 flex justify-center items-center gap-2 bg-slate-900 hover:bg-slate-800 border border-slate-700 border-dashed rounded-lg py-4 cursor-pointer transition-colors group">
                        <Upload className="w-5 h-5 text-slate-500 group-hover:text-amber-400 transition-colors" />
                        <span className="text-xs font-medium text-slate-400 group-hover:text-slate-200">Upload Stamp</span>
                        <input type="file" accept="image/png, image/jpeg" onChange={handleStampUpload} className="hidden" />
                      </label>
                      {customStamp && (
                        <div className="w-16 h-16 bg-white rounded flex items-center justify-center p-1 border border-slate-700 relative group">
                          <img src={customStamp} alt="Stamp" className="max-w-full max-h-full object-contain" />
                          <button onClick={() => setCustomStamp(null)} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity">
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-slate-400">Authorized Signature (.png)</label>
                    <div className="flex items-center gap-3">
                      <label className="flex-1 flex justify-center items-center gap-2 bg-slate-900 hover:bg-slate-800 border border-slate-700 border-dashed rounded-lg py-4 cursor-pointer transition-colors group">
                        <Upload className="w-5 h-5 text-slate-500 group-hover:text-amber-400 transition-colors" />
                        <span className="text-xs font-medium text-slate-400 group-hover:text-slate-200">Upload Signature</span>
                        <input type="file" accept="image/png, image/jpeg" onChange={handleSignatureUpload} className="hidden" />
                      </label>
                      {customSignature && (
                        <div className="w-16 h-16 bg-white rounded flex items-center justify-center p-1 border border-slate-700 relative group">
                          <img src={customSignature} alt="Signature" className="max-w-full max-h-full object-contain" />
                          <button onClick={() => setCustomSignature(null)} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity">
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
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
          <div className="w-full overflow-x-auto flex justify-center bg-transparent print-full-width pb-10">
            <div id="print-container" className="shadow-2xl print:shadow-none bg-white relative text-black font-[Arial,sans-serif]" style={{ width: '210mm', minHeight: '297mm', padding: '40px 40px 140px 40px', boxSizing: 'border-box', margin: '0 auto' }}>

              {/* ADNOC HEADER */}
              <div id="adnoc-header" className="w-full mb-4 flex justify-end" style={{ textAlign: 'right' }}>
                <img id="header-img" src={adnocHeader} alt="ADNOC Header" height="112" style={{ height: '112px', width: 'auto', maxWidth: '100%', display: 'inline-block', objectFit: 'contain' }} className="h-28" />
              </div>

              {/* BRAND HEADER */}
              <div className="w-full mb-6 font-bold flex flex-col items-center justify-center text-center" style={{ fontSize: '11pt', textAlign: 'center' }}>
                <div className="mb-2">
                  <u>Company Name: {companyInfo.nameEn}</u>
                </div>
                <div dir="rtl">
                  <u>اسم الشركة: {companyInfo.nameAr}</u>
                </div>
              </div>

              {/* FORM TITLE */}
              <div className="w-full text-center flex flex-col items-center justify-center mb-6" style={{ textAlign: 'center' }}>
                <div className="text-xl font-bold mb-1 w-full text-center" style={{ fontSize: '18pt' }}>
                  <u>{formType === 'names' ? 'نموذج كشف الاسماء' : 'نموذج كشف المركبات والمعدات'}</u>
                </div>
                <div className="text-lg w-full text-center" style={{ fontSize: '14pt' }}>
                  {formType === 'names' ? 'Names Disclosure Form' : 'Vehicles & Equipment Disclosure Form'}
                </div>
              </div>

              {/* TABLE */}
              <div className="mb-4 overflow-hidden border border-black">
                <table className="data-table w-full text-center border-collapse">
                  <thead>
                    {formType === 'names' ? (
                      <tr className="bg-[#D4C38E] table-header-bg text-black">
                        <th className="border border-black p-1 font-bold text-xs w-32" align="center" style={{ textAlign: 'center' }}>
                          <div className="text-center pb-1" style={{ textAlign: 'center' }}>مكان صدور الاقامة</div>
                          <div className="text-center" style={{ textAlign: 'center' }}>Place of visa issue area</div>
                        </th>
                        <th className="border border-black p-1 font-bold text-xs w-32" align="center" style={{ textAlign: 'center' }}>
                          <div className="text-center pb-1" style={{ textAlign: 'center' }}>المهنة</div>
                          <div className="text-center" style={{ textAlign: 'center' }}>Occupation</div>
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
                          <td className="border border-black p-1 text-xs text-center" align="center" style={{ textAlign: 'center' }} dir="rtl">{item.visaIssueArea}</td>
                          <td className="border border-black p-1 text-xs text-center" align="center" style={{ textAlign: 'center' }} dir="rtl">{item.occupation}</td>
                          <td className="border border-black p-1 text-xs text-center" dir="rtl">
                            {item.companyName.split('-').map((part, i) => (
                              <React.Fragment key={i}>
                                {part}{i < item.companyName.split('-').length - 1 ? ' - ' : ''}
                                {i === 0 && <br />}
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
                                {i === 0 && <br />}
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
              <div className="mt-4 space-y-1 mb-4 text-center" style={{ textAlign: 'center', marginTop: '1rem', marginBottom: '1rem' }}>
                <div className="text-sm font-bold italic" style={{ fontWeight: 'bold', fontStyle: 'italic', fontSize: '14px' }}>
                  <u>تتعهد الشركة المذكورة بأن تلتزم بصحة البيانات الموضحة في الكشف اعلاه.</u>
                </div>
                <div className="text-xs italic" style={{ fontStyle: 'italic', fontSize: '12px' }}>
                  The company undertakes of accuracy of the information that mentioned in the disclosure above.
                </div>
              </div>

              <div className="mt-6 px-4" style={{ marginTop: '1.5rem', paddingLeft: '1rem', paddingRight: '1rem', pageBreakInside: 'avoid' }}>
                <hr style={{ borderTop: '1px dashed black', marginBottom: '0.5rem', borderBottom: 'none', borderLeft: 'none', borderRight: 'none' }} />
                <table border="0" style={{ width: '100%', borderCollapse: 'collapse', border: 'none', pageBreakInside: 'avoid' }}>
                  <tbody>
                    <tr style={{ border: 'none' }}>
                      <td style={{ border: 'none', textAlign: 'left', fontWeight: 'bold', fontSize: '14px', padding: 0, verticalAlign: 'middle', width: '33%' }}>
                        Authorized signatory with company seal:
                      </td>
                      <td style={{ border: 'none', textAlign: 'center', verticalAlign: 'middle', width: '34%', padding: 0 }}>
                        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '20px' }}>
                          {customSignature && <img id="sig-img" src={customSignature} height="70" style={{ height: '70px', maxHeight: '70px', maxWidth: '140px', objectFit: 'contain' }} alt="Signature" />}
                          {customStamp && <img id="stamp-img" src={customStamp} height="85" style={{ height: '85px', maxHeight: '85px', maxWidth: '110px', objectFit: 'contain' }} alt="Company Seal" />}
                        </div>
                      </td>
                      <td style={{ border: 'none', textAlign: 'right', fontWeight: 'bold', fontSize: '14px', padding: 0, verticalAlign: 'middle', width: '33%' }} dir="rtl">
                        المخول بالتوقيع مع ختم الشركة:
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* ADNOC FOOTER */}
              <div id="adnoc-footer" style={{ position: 'absolute', bottom: '0px', left: '40px', right: '40px' }}>
                <div style={{ width: '100%', height: '2px', backgroundColor: '#1D448E', marginBottom: '8px', fontSize: 0, lineHeight: 0 }}>&nbsp;</div>
                <div className="w-full flex justify-end" style={{ width: '100%', textAlign: 'right' }} align="right">
                  <img id="footer-img" src={adnocFooter} alt="ADNOC Footer" height="96" style={{ height: '96px', width: 'auto', maxWidth: '100%', display: 'inline-block', verticalAlign: 'bottom', objectFit: 'contain' }} className="h-24" />
                </div>
              </div>

            </div>
          </div>
        </section>

      </main>
    </div>
  );
}