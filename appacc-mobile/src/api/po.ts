import api from './axios';
import { PoResult } from '../types';

export const searchPo = async (poNumber: string): Promise<PoResult | null> => {
  try {
    const response = await api.get('/sap/po-lookup', {
      params: { po_number: poNumber },
    });
    return response.data;
  } catch (error: any) {
    if (error?.response?.status === 404) return null;
    throw error;
  }
};
