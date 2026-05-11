import api from './axios';
import { User } from '../types';

export const googleAuthCallback = async (idToken: string): Promise<{ user: User; token: string }> => {
  const response = await api.post('/auth/google/mobile', { id_token: idToken });
  const data = response.data;

  return {
    token: data.token,
    user: {
      id: data.user.id,
      name: data.user.name,
      email: data.user.email,
      avatar: data.user.avatar,
      roles: data.user.roles ?? [],
    },
  };
};

export const getProfile = async (): Promise<User> => {
  const response = await api.get('/auth/me');
  return response.data.data ?? response.data;
};

export const logout = async (): Promise<void> => {
  await api.post('/auth/logout');
};
