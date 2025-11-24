import { axiosInstance } from '@/lib/axios';
import type { LoginCredentials, EncryptedResponse, AuthResponse } from '@/types';

export const authService = {
  async getEncryptedToken(credentials: LoginCredentials): Promise<string> {
    const formData = new URLSearchParams();
    formData.append('username', credentials.username);
    formData.append('password', credentials.password);
    formData.append('grant_type', 'password');

    // Nota: Usamos ruta relativa. El proxy maneja el dominio.
    const response = await axiosInstance.post<EncryptedResponse>(
      '/auth-service/oauth/token',
      formData,
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          // Basic Auth hardcodeado según requerimiento
          'Authorization': 'Basic ' + btoa('bankvision:bankvision'),
        },
      }
    );
    return response.data.data;
  },

  async decryptToken(encryptedData: string): Promise<AuthResponse> {
    const response = await axiosInstance.post<AuthResponse[]>(
      '/aes-service/decrypt',
      { data: encryptedData }
    );
    // El endpoint devuelve un array, tomamos el primero
    return response.data[0];
  },

  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const encryptedToken = await this.getEncryptedToken(credentials);
      const authData = await this.decryptToken(encryptedToken);
      sessionStorage.setItem('access_token', authData.access_token);
      return authData;
    } catch (error) {
      console.error("Error en flujo de login:", error);
      throw error;
    }
  },

  logout() {
    sessionStorage.removeItem('access_token');
  },

  isAuthenticated(): boolean {
    return !!sessionStorage.getItem('access_token');
  },
};
