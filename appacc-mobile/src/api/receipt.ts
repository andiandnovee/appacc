import api from './axios';
import { ReceiptPayload, ReceiptItem, Stage } from '../types';

export interface Company {
  id: number;
  name: string;
  sap_id?: string;
}

export interface Vendor {
  id: number;
  sap_id?: string;
  name: string;
  npwp?: string;
  is_pkp: boolean;
  is_active: boolean;
}

export const getStages = async (): Promise<Stage[]> => {
  const response = await api.get('/stages');
  return response.data?.data ?? response.data;
};

export const getCompanies = async (): Promise<Company[]> => {
  const response = await api.get('/companies');
  return response.data?.data ?? response.data;
};

// Dropdown — pakai ?all=true biar tidak paginated
export const getVendors = async (): Promise<Vendor[]> => {
  const response = await api.get('/vendors', { params: { all: true } });
  return response.data?.data ?? response.data;
};

export const storeReceipt = async (payload: ReceiptPayload): Promise<any> => {
  const response = await api.post('/receipts', payload);
  return response.data;
};

export const getReceipts = async (page = 1, perPage = 15): Promise<{
  data: ReceiptItem[];
  meta: { last_page: number; total: number };
}> => {
  const response = await api.get('/receipts', {
    params: { page, per_page: perPage },
  });
  return response.data;
};