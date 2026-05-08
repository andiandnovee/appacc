import api from './axios';
import { ReceiptPayload, Stage } from '../types';

export const getStages = async (year?: number): Promise<Stage[]> => {
  const response = await api.get('/stages', {
    params: { year: year ?? new Date().getFullYear() },
  });
  return response.data.data;
};

export const storeReceipt = async (payload: ReceiptPayload): Promise<any> => {
  const response = await api.post('/receipts', payload);
  return response.data;
};
