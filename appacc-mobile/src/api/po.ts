import api from './axios';
import { PoResult } from '../types';

export const searchPo = async (poNumber: string): Promise<PoResult[]> => {
  const response = await api.get('/po/search', {
    params: { q: poNumber },
  });
  return response.data.data;
};
