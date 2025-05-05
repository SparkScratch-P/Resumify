import React, { useState } from 'react';
import Button from '../ui/Button';
import { Download, FileDown, Copy, Check } from 'lucide-react';
import html2pdf from 'html2pdf.js';
import type { Resume } from '../../types';

interface ExportOptionsProps {
  resume: Resume;
  previewRef: React.RefObject<HTMLDivElement>;
}

const ExportOptions: React.FC<ExportOptionsProps> = ({ resume, previewRef }) => {
  const [isExporting, setIsExporting] = useState(false);
  const [copied, setCopied] = useState(false);
  
  const getResumeFileName = () => {
    const name = resume.personalInfo.firstName && resume.personalInfo.lastName
      ? `${resume.personalInfo.firstName}-${resume.personalInfo.lastName}`
      : 'resume';
    
    return `${name.toLowerCase().replace(/\s+/g, '-')}-${new Date().toISOString().slice(0, 10)}`;
  };
  
  const handleExportPDF = async () => {
    if (!previewRef.current) return;
    
    setIsExporting(true);
    
    try {
      const element = previewRef.current;
      const opt = {
        margin: [10, 15, 10, 15],
        filename: `${getResumeFileName()}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { 
          scale: 2,
          useCORS: true,
          letterRendering: true
        },
        jsPDF: { 
          unit: 'mm', 
          format: 'a4', 
          orientation: 'portrait' 
        }
      };
      
      await html2pdf().set(opt).from(element).save();
    } catch (error) {
      console.error('Error exporting PDF:', error);
    } finally {
      setIsExporting(false);
    }
  };
  
  const handleCopyToClipboard = async () => {
    if (!previewRef.current) return;
    
    try {
      const text = previewRef.current.innerText;
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Error copying to clipboard:', error);
    }
  };
  
  return (
    <div className="flex flex-col sm:flex-row gap-3">
      <Button
        variant="primary"
        icon={<Download size={16} />}
        onClick={handleExportPDF}
        isLoading={isExporting}
        disabled={isExporting}
      >
        Export PDF
      </Button>
      
      <Button
        variant="outline"
        icon={copied ? <Check size={16} /> : <Copy size={16} />}
        onClick={handleCopyToClipboard}
      >
        {copied ? 'Copied!' : 'Copy Text'}
      </Button>
    </div>
  );
};

export default ExportOptions;