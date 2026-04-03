export interface Participant {
  id: string;
  name: string;
  whatsapp: string;
  estimatedBirthDate: Date;
  itemName?: string | null;
  pixValue?: number | null;
  receiptPath?: string | null;
  createdAt: Date;
}

export interface ParticipantFormData {
  name: string;
  whatsapp: string;
  estimatedBirthDate: string;
  itemName?: string;
  pixValue?: number;
}

export interface PresignedUrlResponse {
  uploadUrl: string;
  cloud_storage_path: string;
}
