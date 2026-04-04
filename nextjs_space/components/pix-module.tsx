'use client';

import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DollarSign, Upload, X, AlertCircle, CheckCircle, Copy, Check } from 'lucide-react';
import Image from 'next/image';
import { PIX_VALUES } from '@/lib/constants';

const PIX_CODE = '00020126580014BR.GOV.BCB.PIX013672a966c3-088a-49ff-ab3e-6cd8537d43eb5204000053039865802BR5925Gabrielle Barsotti Jacone6009SAO PAULO62140510OFZOL5LGN563048FDE';

interface PixModuleProps {
  selectedValue: number | null;
  onValueSelect: (value: number) => void;
  receiptPath: string | null;
  onReceiptUpload: (path: string | null) => void;
}

export default function PixModule({
  selectedValue,
  onValueSelect,
  receiptPath,
  onReceiptUpload
}: PixModuleProps) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [customValue, setCustomValue] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleCopyPix = async () => {
    await navigator.clipboard.writeText(PIX_CODE);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCustomValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, '');
    setCustomValue(raw);
    if (raw && parseInt(raw) > 0) {
      onValueSelect(parseInt(raw));
    }
  };

  const handleFileSelect = async (file: File | null) => {
    if (!file) return;

    if (!file.type.startsWith('image/') && file.type !== 'application/pdf') {
      setUploadError('Por favor, selecione uma imagem ou PDF válido');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setUploadError('A imagem deve ter no máximo 5MB');
      return;
    }

    setIsUploading(true);
    setUploadError(null);

    try {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        const result = e?.target?.result;
        if (typeof result === 'string') {
          setPreviewUrl(result);
        }
      };
      reader.readAsDataURL(file);

      const formData = new FormData();
      formData.append('file', file);

      const uploadResponse = await fetch('/api/upload/presigned', {
        method: 'POST',
        body: formData,
      });

      if (!uploadResponse.ok) {
        const err = await uploadResponse.json().catch(() => ({}));
        throw new Error(err?.error ?? 'Erro ao fazer upload da imagem');
      }

      const { cloud_storage_path } = await uploadResponse.json();

      onReceiptUpload(cloud_storage_path);
      setUploadError(null);
    } catch (error) {
      console.error('Upload error:', error);
      setUploadError(
        error instanceof Error ? error.message : 'Erro ao fazer upload'
      );
      setPreviewUrl(null);
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveReceipt = () => {
    onReceiptUpload(null);
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
    >
      <div className="bg-white bg-opacity-60 backdrop-blur-sm rounded-2xl p-4 md:p-8 shadow-elegant border border-white border-opacity-50 overflow-hidden">
        <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
          <DollarSign className="w-6 h-6" />
          ou Contribua com PIX
        </h3>

        <div className="mb-8">
          <p className="text-sm font-semibold text-gray-900 mb-4">Escolha um valor:</p>
          <div className="grid grid-cols-3 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {PIX_VALUES.map((option) => (
              <motion.button
                key={option.value}
                type="button"
                onClick={() => { onValueSelect(option.value); setCustomValue(''); }}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.95 }}
                className={`p-3 rounded-lg font-semibold transition-all duration-300 ${
                  selectedValue === option.value && !customValue
                    ? 'bg-gradient-to-br from-blue-400 to-blue-500 text-white shadow-elevated ring-2 ring-blue-300'
                    : 'bg-blue-50 text-blue-700 hover:bg-blue-100 shadow-elegant'
                }`}
              >
                {option.label}
              </motion.button>
            ))}
          </div>

          {/* Custom value */}
          <div className="mt-4 flex flex-col sm:flex-row sm:items-center gap-2 w-full min-w-0">
            <label className="text-sm font-semibold text-gray-700 sm:whitespace-nowrap flex-shrink-0">Outro valor:</label>
            <div className={`flex items-center gap-2 w-full min-w-0 border-2 rounded-lg px-3 py-2 bg-white transition-colors ${
              customValue && parseInt(customValue) > 0
                ? 'border-blue-400 ring-2 ring-blue-200'
                : 'border-gray-300'
            }`}>
              <span className="text-gray-500 font-semibold">R$</span>
              <input
                type="text"
                inputMode="numeric"
                placeholder="0"
                value={customValue}
                onChange={handleCustomValueChange}
                className="flex-1 outline-none text-gray-900 font-semibold bg-transparent"
              />
            </div>
          </div>
        </div>

        {selectedValue && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-4"
          >
            {/* QR Code + PIX code */}
            <div className="flex flex-col items-center gap-4 p-6 bg-blue-50 rounded-xl border border-blue-200">
              <p className="text-sm font-semibold text-gray-700">Escaneie o QR Code ou copie o código PIX:</p>
              <Image
                src="/QRCODE.png"
                alt="QR Code PIX"
                width={200}
                height={200}
                className="w-40 h-40 md:w-48 md:h-48 rounded-lg border border-blue-200 shadow-sm"
              />
              <div className="w-full flex items-center gap-2 bg-white border border-blue-200 rounded-lg px-3 py-2">
                <p className="text-xs text-gray-500 font-mono truncate flex-1">{PIX_CODE}</p>
                <button
                  type="button"
                  onClick={handleCopyPix}
                  className="flex-shrink-0 flex items-center gap-1 px-3 py-1.5 bg-blue-500 hover:bg-blue-600 text-white text-xs font-semibold rounded-md transition-colors"
                >
                  {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  {copied ? 'Copiado!' : 'Copiar'}
                </button>
              </div>
            </div>

            <p className="text-sm font-semibold text-gray-900">Comprovante PIX *</p>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*,application/pdf"
              onChange={(e) => handleFileSelect(e?.target?.files?.[0] ?? null)}
              className="hidden"
            />

            {!receiptPath ? (
              <motion.div
                onClick={() => fileInputRef?.current?.click()}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="border-2 border-dashed border-yellow-300 rounded-xl p-6 cursor-pointer hover:border-yellow-400 transition-colors text-center"
              >
                {isUploading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="animate-spin">
                      <Upload className="w-6 h-6 text-yellow-600" />
                    </div>
                    <span className="text-gray-700 font-medium">Enviando...</span>
                  </div>
                ) : (
                  <>
                    <Upload className="w-8 h-8 text-yellow-600 mx-auto mb-2" />
                    <p className="text-gray-700 font-medium">Clique para fazer upload</p>
                    <p className="text-xs text-gray-500 mt-1">PNG, JPG, GIF ou PDF (máx. 5MB)</p>
                  </>
                )}
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="space-y-3"
              >
                <div className="flex items-center gap-2 p-3 bg-green-100 border border-green-300 rounded-lg">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                  <span className="text-green-800 font-medium">Comprovante enviado com sucesso!</span>
                  <button
                    type="button"
                    onClick={handleRemoveReceipt}
                    className="ml-auto text-green-600 hover:text-green-800 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </motion.div>
            )}

            <AnimatePresence>
              {uploadError && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="p-3 bg-red-100 border border-red-300 rounded-lg flex items-center gap-2 text-red-800"
                >
                  <AlertCircle className="w-5 h-5 flex-shrink-0" />
                  <span className="text-sm font-medium">{uploadError}</span>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
