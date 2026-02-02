export type Client = {
  id: string;          
  name: string;
  email: string;
  verified: boolean;
  avatarUrl?: string;
  phone?: string | null;
  kycStatus?: string;
};