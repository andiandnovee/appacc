export interface User {
  id: number;
  name: string;
  email: string;
  avatar?: string;
  roles: string[];
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setAuth: (user: User, token: string) => void;
  clearAuth: () => void;
}

export interface PoItem {
  item_no: string;
  po_uom: string;
  po_qty: number;
  net_value: number;
}

export interface PoResult {
  found: boolean;
  po_number: string;
  sap_vendor_id: string;
  vendor_id: number;
  vendor_name: string;
  is_pkp: boolean | null;
  sap_business_area_id: string;
  buyer_name: string;
  purc_grp: string;
  amount: number;
  items: PoItem[];
}

export interface Stage {
  id: number;
  name: string;
  year: number;
  start_date?: string;
}

export interface Company {
  id: number;
  name: string;
  sap_id?: string;
}

export interface ReceiptPayload {
  receipt_date: string;
  vendor_id: number;
  po_number: string;
  amount: number;
  company_id: number;
  stage_id: number;
  pgr_id?: string;
  business_area_code?: string;
  invoice_number?: string;
}

export interface ReceiptItem {
  id: number;
  receipt_date: string;
  po_number: string;
  invoice_number?: string;
  amount: number;
  vendor?: {
    id: number;
    name: string;
  };
  stage?: {
    id: number;
    name: string;
    year: number;
  };
  company?: {
    id: number;
    name: string;
  };
  latest_status?: {
    status_value: string;
    status_date: string;
  };
  created_at: string;
}
