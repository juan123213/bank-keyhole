import axios from 'axios';
import type { LoginCredentials, EncryptedResponse, AuthResponse } from '@/types';

const BASE_URL = 'https://pruebas.bankvision.com';

export const authService = {
  // Step A: Get encrypted token
  async getEncryptedToken(credentials: LoginCredentials): Promise<string> {
    const formData = new URLSearchParams();
    formData.append('username', credentials.username);
    formData.append('password', credentials.password);
    formData.append('grant_type', 'password');

    const response = await axios.post<EncryptedResponse>(
      `${BASE_URL}/auth-service/oauth/token`,
      formData,
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': 'Basic ' + btoa('bankvision:bankvision'),
        },
      }
    );

    return response.data.data;
  },

  // Step B: Decrypt token
  async decryptToken(encryptedData: string): Promise<AuthResponse> {
    const response = await axios.post<AuthResponse[]>(
      `${BASE_URL}/aes-service/decrypt`,
      { data: encryptedData },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    return response.data[0];
  },

  // Complete login flow
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const encryptedToken = await this.getEncryptedToken(credentials);
    const authData = await this.decryptToken(encryptedToken);
    
    // Store token in session storage
    sessionStorage.setItem('access_token', authData.access_token);
    
    return authData;
  },

  logout() {
    sessionStorage.removeItem('access_token');
  },

  isAuthenticated(): boolean {
    return !!sessionStorage.getItem('access_token');
  },
};
