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

export interface Vendor {
  id: number;
  vendor_code: string;
  name: string;
  npwp?: string;
  is_pkp: boolean;
}

export interface PoResult {
  id: number;
  po_number: string;
  po_item_line: string;
  plant: string;
  vendor_code: string;
  vendor_name: string;
  amount_po: number;
  purchasing_group: string;
}

export interface Stage {
  id: number;
  tahap_kode: string;
  tahap_nama: string;
  tahap_tahun: number;
}

export interface ReceiptPayload {
  po_number: string;
  po_item_line: string;
  vendor_code: string;
  no_invoice: string;
  tanggal_invoice: string;
  nilai_invoice: number;
  stage_id: number;
  is_pkp: boolean;
  keterangan?: string;
}
