// src/components/UploadFiles.jsx

import React, { useState, forwardRef, useImperativeHandle, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { ArrowUpTrayIcon, DocumentTextIcon, PaperClipIcon, XCircleIcon } from '@heroicons/react/24/outline';
import TextareaAutosize from 'react-textarea-autosize'; // <-- 1. Εισαγωγή της βιβλιοθήκης

const TellAbout = forwardRef(({ errors, formData, handleInputChange }, ref) => {
  const { t } = useTranslation();
  const [selectedFiles, setSelectedFiles] = useState([]);

  const handleFileSelect = useCallback((event) => {
    const newFiles = Array.from(event.target.files);
    setSelectedFiles(prevFiles => [...prevFiles, ...newFiles]);
  }, []);

  const handleRemoveFile = useCallback((fileName) => {
    setSelectedFiles(prevFiles => prevFiles.filter(file => file.name !== fileName));
  }, []);

  useImperativeHandle(ref, () => ({
    getFiles: () => selectedFiles,
    clearFiles: () => setSelectedFiles([])
  }), [selectedFiles]);

  const baseInputClasses = "w-full p-3 pl-10 border rounded-lg transition duration-200 bg-slate-50 focus:bg-white focus:outline-none";
  const normalClasses = "border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500";
  const labelClasses = "block text-sm font-medium text-slate-600 mb-2";

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-slate-800">{t('uploadFiles')}</h2>
        <p className="mt-1 text-sm text-slate-500">{t('uploadOptional')}</p>
      </div>
      <div>
        <label className={labelClasses}>{t('selectFiles')}</label>
        <label htmlFor="files-upload" className="flex flex-col items-center justify-center w-full h-32 border-2 border-slate-300 border-dashed rounded-lg cursor-pointer bg-slate-50 hover:bg-slate-100 transition">
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            <ArrowUpTrayIcon className="w-8 h-8 mb-3 text-slate-400" />
            <p className="mb-2 text-sm text-slate-500"><span className="font-semibold text-indigo-600">{t('clickToUpload')}</span> {t('dragAndDrop')}</p>
            <p className="text-xs text-slate-400">{t('fileTypes')}</p>
          </div>
          <input id="files-upload" name="files" type="file" className="sr-only" multiple onChange={handleFileSelect} />
        </label>
      </div>
      {selectedFiles.length > 0 && (
        <div className="mt-4 space-y-2">
           <h3 className="text-sm font-medium text-slate-600">{t('selectedFiles')}</h3>
           <ul className="border border-slate-200 rounded-lg divide-y divide-slate-200">
            {selectedFiles.map((file, index) => (
              <li key={index} className="px-3 py-2 flex items-center justify-between text-sm">
                <div className="flex items-center space-x-2"><PaperClipIcon className="h-5 w-5 text-slate-400" /><span className="text-slate-700">{file.name}</span></div>
                <button type="button" onClick={() => handleRemoveFile(file.name)} className="text-slate-400 hover:text-red-600 transition"><XCircleIcon className="h-5 w-5" /></button>
              </li>
            ))}
          </ul>
        </div>
      )}
      <div>
        <label htmlFor="keywords" className={labelClasses}>{t('keywords')}</label>
        <div className="relative">
          <div className="pointer-events-none absolute top-3 left-0 flex items-center pl-3"><DocumentTextIcon className="h-5 w-5 text-slate-400" /></div>
          {/* 2. Αντικατάσταση του textarea */}
          <TextareaAutosize
            id="keywords"
            name="keywords"
            value={formData.keywords}
            onChange={handleInputChange}
            className={`${baseInputClasses} ${normalClasses} resize-none`}
            placeholder={t('placeholders.keywords')}
            minRows={3} // Αλλαγή σε minRows
          />
        </div>
      </div>
    </div>
  )
});

export default TellAbout;