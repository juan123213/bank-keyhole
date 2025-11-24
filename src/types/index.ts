// Auth Types
export interface LoginCredentials {
  username: string;
  password: string;
}

export interface EncryptedResponse {
  data: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  scope: string;
}

// Financial Product Types
export interface QueryParams {
  originAccount: string;
  valueTransfer: string;
  S01T: string;
  S008: string;
  S010: string;
  S018: string;
}

export interface FinancialProduct {
  tipoDocumento: string;
  nroProducto: string;
  convenio: string;
  nombreAsociado: string;
  estado: string;
  fechaApertura: string;
  valorCuota: number;
  valorPendienteDePago: number;
  nroDocumento: string;
}

export interface QueryResponse {
  content: FinancialProduct[];
}
