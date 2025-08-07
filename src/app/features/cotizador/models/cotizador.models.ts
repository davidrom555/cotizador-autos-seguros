export interface Marca {
  id: number;
  nombre: string;
}

export interface Modelo {
  id: number;
  marcaId: number;
  nombre: string;
}

export interface Version {
  id: number;
  modeloId: number;
  nombre: string;
  cilindrada?: string;
  combustible?: string;
  transmision?: string;
}

export interface CarData {
  brandId: number;
  brand: string;
  modelId: number;
  model: string;
  versionId?: number;
  version?: string;
  year: number;
  gnc: boolean;
  usage: string;
}

export interface PlanData {
  id?: string;
  name: string;
  description: string;
  planType: string;
  price: number;
  features?: string[];
  recommended?: boolean;
}

export interface PersonalData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  postalCode: string;
  locality: string;
}

export interface PaymentData {
  name: string;
  cardNumber?: string;
  cardHolderName?: string;
  expiryDate?: string;
  cvv?: string;
}
