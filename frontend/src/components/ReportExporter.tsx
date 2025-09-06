'use client';

import React, { useState } from 'react';
import {
  Download,
  FileText,
  FileSpreadsheet,
  Mail,
  Share2,
  Printer,
  Loader2
} from 'lucide-react';

interface ReportExporterProps {
  reportData: any;
  reportTitle: string;
  onExport?: (format: string) => void;
  onEmail?: (email: string) => void;
  onShare?: () => void;
  onPrint?: () => void;
}

export default function ReportExporter({
  reportData,
  reportTitle,
  onExport,
  onEmail,
  onShare,
  onPrint
}: ReportExporterProps) {
  const [isExporting, setIsExporting] = useState(false);
  const [exportFormat, setExportFormat] = useState<string>('');
  const [emailAddress, setEmailAddress] = useState('');
  const [showEmailModal, setShowEmailModal] = useState(false);

  const handleExport = async (format: string) => {
    setIsExporting(true);
    setExportFormat(format);
    
    try {
      // Simulate export process
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Generate file content based on format
      let content = '';
      let mimeType = '';
      let fileExtension = '';
      
      switch (format) {
        case 'pdf':
          content = generatePDFContent(reportData, reportTitle);
          mimeType = 'application/pdf';
          fileExtension = 'pdf';
          break;
        case 'excel':
          content = generateExcelContent(reportData, reportTitle);
          mimeType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
          fileExtension = 'xlsx';
          break;
        case 'csv':
          content = generateCSVContent(reportData, reportTitle);
          mimeType = 'text/csv';
          fileExtension = 'csv';
          break;
        default:
          content = JSON.stringify(reportData, null, 2);
          mimeType = 'application/json';
          fileExtension = 'json';
      }
      
      // Create and download file
      const blob = new Blob([content], { type: mimeType });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${reportTitle}-${new Date().toISOString().split('T')[0]}.${fileExtension}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      onExport?.(format);
    } catch (error) {
      console.error('Export error:', error);
      alert('Dosya indirilirken bir hata oluştu.');
    } finally {
      setIsExporting(false);
      setExportFormat('');
    }
  };

  const generatePDFContent = (data: any, title: string): string => {
    // Mock PDF content - in real implementation, use jsPDF or similar
    return `
%PDF-1.4
1 0 obj
<<
/Type /Catalog
/Pages 2 0 R
>>
endobj

2 0 obj
<<
/Type /Pages
/Kids [3 0 R]
/Count 1
>>
endobj

3 0 obj
<<
/Type /Page
/Parent 2 0 R
/MediaBox [0 0 612 792]
/Contents 4 0 R
>>
endobj

4 0 obj
<<
/Length 100
>>
stream
BT
/F1 12 Tf
72 720 Td
(${title}) Tj
ET
endstream
endobj

xref
0 5
0000000000 65535 f 
0000000009 00000 n 
0000000058 00000 n 
0000000115 00000 n 
0000000204 00000 n 
trailer
<<
/Size 5
/Root 1 0 R
>>
startxref
354
%%EOF
    `;
  };

  const generateExcelContent = (data: any, title: string): string => {
    // Mock Excel content - in real implementation, use xlsx library
    const csvData = generateCSVContent(data, title);
    return csvData; // Simplified for demo
  };

  const generateCSVContent = (data: any, title: string): string => {
    let csv = `"${title}"\n`;
    csv += `"Oluşturulma Tarihi","${new Date().toLocaleDateString('tr-TR')}"\n\n`;
    
    if (data.financial) {
      csv += '"Finansal Veriler"\n';
      csv += '"Kategori","Değer"\n';
      csv += `"Toplam Gelir","${data.financial.totalRevenue || 0}"\n`;
      csv += `"Toplam Gider","${data.financial.totalExpenses || 0}"\n`;
      csv += `"Net Kâr","${data.financial.netProfit || 0}"\n\n`;
    }
    
    if (data.customers) {
      csv += '"Müşteri Verileri"\n';
      csv += '"Kategori","Değer"\n';
      csv += `"Toplam Müşteri","${data.customers.totalCustomers || 0}"\n`;
      csv += `"Yeni Müşteri","${data.customers.newCustomers || 0}"\n`;
      csv += `"Sadakat Oranı","${data.customers.customerRetentionRate || 0}%"\n\n`;
    }
    
    return csv;
  };

  const handleEmail = async () => {
    if (!emailAddress) {
      alert('Lütfen e-posta adresi girin.');
      return;
    }
    
    setIsExporting(true);
    
    try {
      // Simulate email sending
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // In real implementation, send email via API
      alert(`Rapor ${emailAddress} adresine gönderildi!`);
      setShowEmailModal(false);
      setEmailAddress('');
      
      onEmail?.(emailAddress);
    } catch (error) {
      console.error('Email error:', error);
      alert('E-posta gönderilirken bir hata oluştu.');
    } finally {
      setIsExporting(false);
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: reportTitle,
        text: `${reportTitle} raporunu görüntüle`,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Rapor linki panoya kopyalandı!');
    }
    
    onShare?.();
  };

  const handlePrint = () => {
    window.print();
    onPrint?.();
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Raporu Dışa Aktar</h3>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <button
          onClick={() => handleExport('pdf')}
          disabled={isExporting}
          className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors disabled:opacity-50"
        >
          {isExporting && exportFormat === 'pdf' ? (
            <Loader2 className="w-6 h-6 text-blue-600 animate-spin mb-2" />
          ) : (
            <FilePdf className="w-6 h-6 text-red-600 mb-2" />
          )}
          <span className="text-sm font-medium text-gray-700">PDF</span>
        </button>
        
        <button
          onClick={() => handleExport('excel')}
          disabled={isExporting}
          className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:border-green-500 hover:bg-green-50 transition-colors disabled:opacity-50"
        >
          {isExporting && exportFormat === 'excel' ? (
            <Loader2 className="w-6 h-6 text-green-600 animate-spin mb-2" />
          ) : (
            <FileSpreadsheet className="w-6 h-6 text-green-600 mb-2" />
          )}
          <span className="text-sm font-medium text-gray-700">Excel</span>
        </button>
        
        <button
          onClick={() => handleExport('csv')}
          disabled={isExporting}
          className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:border-purple-500 hover:bg-purple-50 transition-colors disabled:opacity-50"
        >
          {isExporting && exportFormat === 'csv' ? (
            <Loader2 className="w-6 h-6 text-purple-600 animate-spin mb-2" />
          ) : (
            <FileText className="w-6 h-6 text-purple-600 mb-2" />
          )}
          <span className="text-sm font-medium text-gray-700">CSV</span>
        </button>
        
        <button
          onClick={() => setShowEmailModal(true)}
          disabled={isExporting}
          className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:border-yellow-500 hover:bg-yellow-50 transition-colors disabled:opacity-50"
        >
          <Mail className="w-6 h-6 text-yellow-600 mb-2" />
          <span className="text-sm font-medium text-gray-700">E-posta</span>
        </button>
      </div>
      
      <div className="flex space-x-3">
        <button
          onClick={handleShare}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Share2 className="w-4 h-4" />
          <span>Paylaş</span>
        </button>
        
        <button
          onClick={handlePrint}
          className="flex items-center space-x-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
        >
          <Printer className="w-4 h-4" />
          <span>Yazdır</span>
        </button>
      </div>
      
      {/* Email Modal */}
      {showEmailModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">E-posta Gönder</h3>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                E-posta Adresi
              </label>
              <input
                type="email"
                value={emailAddress}
                onChange={(e) => setEmailAddress(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="ornek@email.com"
              />
            </div>
            
            <div className="flex space-x-3">
              <button
                onClick={handleEmail}
                disabled={isExporting || !emailAddress}
                className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                {isExporting ? 'Gönderiliyor...' : 'Gönder'}
              </button>
              <button
                onClick={() => setShowEmailModal(false)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                İptal
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}