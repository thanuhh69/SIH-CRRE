'use client';

import React, { useState, useRef } from 'react';
import { Upload, FileText, CheckCircle2, AlertCircle, X, FileCheck, Sparkles, Download } from 'lucide-react';
import { uploadFileWithFallback, getCloudinaryDownloadUrl } from '@/lib/storage';

interface PptUploadSectionProps {
  onFileSelected?: (file: File | null, fileUrl: string | null) => void;
  onUploadSuccess?: (fileUrl: string, fileName: string) => void;
  initialFileName?: string;
  isStandalone?: boolean;
}

export default function PptUploadSection({
  onFileSelected,
  onUploadSuccess,
  initialFileName,
  isStandalone = false,
}: PptUploadSectionProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [uploadedFileName, setUploadedFileName] = useState<string>(initialFileName || '');
  const [uploadedFileUrl, setUploadedFileUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateAndSetFile = async (file: File) => {
    setFileError(null);
    setUploadSuccess(false);

    const fileName = file.name.toLowerCase();
    const isPpt = fileName.endsWith('.ppt') || fileName.endsWith('.pptx');

    if (!isPpt) {
      setFileError('Invalid file format. Please upload only .ppt or .pptx files.');
      setSelectedFile(null);
      if (onFileSelected) onFileSelected(null, null);
      return;
    }

    setSelectedFile(file);
    setIsUploading(true);

    try {
      const url = await uploadFileWithFallback(file, 'registration-files');
      setIsUploading(false);
      setUploadSuccess(true);
      setUploadedFileName(file.name);
      setUploadedFileUrl(url);

      if (onFileSelected) {
        onFileSelected(file, url);
      }
      if (onUploadSuccess) {
        onUploadSuccess(url, file.name);
      }
    } catch (err) {
      console.error('PPT Upload Error:', err);
      setIsUploading(false);
      setFileError('Failed to upload presentation to Cloudinary. Please try again.');
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      validateAndSetFile(e.target.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndSetFile(e.dataTransfer.files[0]);
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setFileError(null);
    setUploadSuccess(false);
    setUploadedFileUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
    if (onFileSelected) onFileSelected(null, null);
  };

  const handleUploadSubmit = async () => {
    if (!selectedFile) {
      setFileError('Please select a PPT file (.ppt or .pptx) before submitting.');
      return;
    }

    setIsUploading(true);
    setFileError(null);

    try {
      // Upload using Cloudinary / Fallback
      const url = await uploadFileWithFallback(selectedFile, 'registration-files');
      setIsUploading(false);
      setUploadSuccess(true);
      setUploadedFileName(selectedFile.name);
      setUploadedFileUrl(url);

      if (onUploadSuccess) {
        onUploadSuccess(url, selectedFile.name);
      }
    } catch (err) {
      console.error('PPT Upload Error:', err);
      setIsUploading(false);
      setFileError('Failed to upload presentation. Please try again.');
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  return (
    <div className="bg-white rounded-lg border border-slate-300 p-6 shadow-sm space-y-4">
      {/* Main Heading & Supporting Text */}
      <div className="border-b border-slate-200 pb-3">
        <h3 className="font-serif font-bold text-lg text-college-navy flex items-center gap-2">
          <FileText className="w-5 h-5 text-college-gold" /> Upload Your Problem Statement PPT
        </h3>
        <p className="text-slate-600 text-xs mt-1">
          Upload the PPT containing your selected/problem statement for the SIH Internal Hackathon.
        </p>
      </div>

      {/* Upload Field Box */}
      {!selectedFile && !uploadSuccess ? (
        <div
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-college-border hover:border-college-gold bg-slate-50 hover:bg-amber-50/50 p-8 rounded-lg text-center cursor-pointer transition-all group"
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".ppt,.pptx,application/vnd.ms-powerpoint,application/vnd.openxmlformats-officedocument.presentationml.presentation"
            onChange={handleFileChange}
            className="hidden"
          />

          <div className="w-14 h-14 rounded-full bg-white border border-slate-300 text-college-navy group-hover:text-college-gold group-hover:border-college-gold flex items-center justify-center mx-auto mb-3 shadow-xs transition-colors">
            <Upload className="w-6 h-6" />
          </div>

          <div className="font-serif font-bold text-sm text-college-navy group-hover:text-college-accent transition-colors">
            Click to Browse or Drag & Drop PPT File Here
          </div>
          <p className="text-slate-500 text-xs mt-1">
            Accepted formats: <strong className="font-mono text-college-gold">.ppt</strong> or <strong className="font-mono text-college-gold">.pptx</strong> (Max size: 25MB)
          </p>
        </div>
      ) : (
        /* Selected File Card */
        <div className="p-4 bg-slate-50 border border-slate-300 rounded-lg flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-10 h-10 rounded bg-amber-100 text-amber-800 border border-amber-300 flex items-center justify-center shrink-0">
              <FileCheck className="w-5 h-5 text-college-gold" />
            </div>
            <div className="truncate">
              <div className="font-bold text-xs text-college-navy truncate">
                {selectedFile ? selectedFile.name : uploadedFileName}
              </div>
              <div className="text-[11px] text-slate-500 font-mono">
                {selectedFile ? formatFileSize(selectedFile.size) : 'PowerPoint Presentation'}
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={handleRemoveFile}
            className="text-slate-400 hover:text-red-600 p-1.5 rounded-full hover:bg-slate-200 transition-colors"
            title="Remove file"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* File Validation Error Message */}
      {fileError && (
        <div className="p-3 bg-red-50 border border-red-200 rounded text-xs text-red-800 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
          <span>{fileError}</span>
        </div>
      )}

      {/* Success Notification Message & Download Link */}
      {uploadSuccess && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-300 rounded text-xs text-emerald-900 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <div>
              <strong className="font-bold">PPT Uploaded to Cloudinary!</strong> File <span className="font-mono font-semibold">{uploadedFileName}</span> is stored securely.
            </div>
          </div>
          {uploadedFileUrl && (
            <a
              href={getCloudinaryDownloadUrl(uploadedFileUrl, uploadedFileName)}
              target="_blank"
              rel="noopener noreferrer"
              download={uploadedFileName}
              className="shrink-0 inline-flex items-center gap-1.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold px-3 py-1.5 rounded text-xs transition-colors shadow-xs"
            >
              <Download className="w-3.5 h-3.5 text-white" /> Download PPT
            </a>
          )}
        </div>
      )}

      {/* Standalone Upload / Submit Button */}
      {isStandalone && selectedFile && !uploadSuccess && (
        <div className="pt-2">
          <button
            type="button"
            onClick={handleUploadSubmit}
            disabled={isUploading}
            className="w-full inline-flex items-center justify-center gap-2 bg-college-navy hover:bg-college-blue text-white font-bold text-xs py-2.5 px-5 rounded shadow transition-colors border border-college-gold/30 disabled:opacity-50"
          >
            {isUploading ? (
              <span>UPLOADING PRESENTATION...</span>
            ) : (
              <>
                <Upload className="w-4 h-4 text-college-gold" />
                <span>UPLOAD PPT / SUBMIT</span>
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
}
