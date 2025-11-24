import { axiosInstance } from '@/lib/axios';
import type { QueryParams, EncryptedResponse, QueryResponse } from '@/types';

export const productsService = {
  // Step C: Encrypt query params
  async encryptQuery(params: Omit<QueryParams, 'S01T' | 'S008' | 'S010' | 'S018'>): Promise<string> {
    const fullParams: QueryParams = {
      ...params,
      S01T: '6',
      S008: 'SV2',
      S010: '0',
      S018: '1',
    };

    const response = await axiosInstance.post<EncryptedResponse>(
      '/aes-service/encrypt',
      fullParams,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    return response.data.data;
  },

  // Step D: Query products with encrypted payload
  async queryProducts(encryptedPayload: string, page = 1, size = 10): Promise<QueryResponse> {
    const response = await axiosInstance.post<QueryResponse>(
      `/distribuciones/ApiReport/ReportGeneral?page=${page}&size=${size}`,
      { data: encryptedPayload },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    return response.data;
  },

  // Complete query flow
  async getProducts(params: { originAccount: string; valueTransfer: string }): Promise<QueryResponse> {
    const encryptedPayload = await this.encryptQuery(params);
    const products = await this.queryProducts(encryptedPayload);
    return products;
  },
};
