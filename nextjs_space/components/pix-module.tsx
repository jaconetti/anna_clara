'use client';

import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DollarSign, Upload, X, AlertCircle, CheckCircle } from 'lucide-react';
import { PIX_VALUES } from '@/lib/constants';
import Image from 'next/image';

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
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (file: File | null) => {
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setUploadError('Por favor, selecione uma imagem válida');
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

      const presignedResponse = await fetch('/api/upload/presigned', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fileName: file.name,
          contentType: file.type
        })
      });

      if (!presignedResponse.ok) {
        throw new Error('Erro ao gerar URL de upload');
      }

      const { uploadUrl, cloud_storage_path } = await presignedResponse.json();

      const uploadResponse = await fetch(uploadUrl, {
        method: 'PUT',
        body: file,
        headers: {
          'Content-Type': file.type
        }
      });

      if (!uploadResponse.ok) {
        throw new Error('Erro ao fazer upload da imagem');
      }

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
      <div className="bg-white bg-opacity-60 backdrop-blur-sm rounded-2xl p-6 md:p-8 shadow-elegant border border-white border-opacity-50">
        <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
          <DollarSign className="w-6 h-6" />
          ou Contribua com PIX
        </h3>

        <div className="mb-8">
          <p className="text-sm font-semibold text-gray-900 mb-4">Escolha um valor:</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {PIX_VALUES.map((option) => (
              <motion.button
                key={option.value}
                type="button"
                onClick={() => onValueSelect(option.value)}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.95 }}
                className={`p-3 rounded-lg font-semibold transition-all duration-300 ${
                  selectedValue === option.value
                    ? 'bg-gradient-to-br from-blue-400 to-blue-500 text-white shadow-elevated ring-2 ring-blue-300'
                    : 'bg-blue-50 text-blue-700 hover:bg-blue-100 shadow-elegant'
                }`}
              >
                {option.label}
              </motion.button>
            ))}
          </div>
        </div>

        {selectedValue && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-4"
          >
            <p className="text-sm font-semibold text-gray-900">Comprovante PIX *</p>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
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
                    <p className="text-xs text-gray-500 mt-1">PNG, JPG ou GIF (máx. 5MB)</p>
                  </>
                )}
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="space-y-3"
              >
                {previewUrl && (
                  <div className="relative w-full h-48 rounded-lg overflow-hidden shadow-elegant">
                    <Image
                      src={previewUrl}
                      alt="Comprovante PIX"
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
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
