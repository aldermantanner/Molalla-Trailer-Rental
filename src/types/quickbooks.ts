export interface QBOInvoiceRequest {
  customer_name: string;
  customer_email: string | null;
  customer_phone: string | null;
  customer_address: {
    line1: string;
    line2?: string | null;
    city: string;
    state: string;
    postal_code: string;
    country?: string | null;
  };
  service_type: 'trailer_rental' | 'junk_removal' | 'both';
  trailer_model?: string | null;
  start_date?: string | null;
  end_date?: string | null;
  junk_description?: string | null;
  total_price: number;
  booking_id: string;
  extras?: {
    deposit_fee?: number | null;
    travel_fuel_surcharge?: number | null;
    tax_amount?: number | null;
  };
}

export interface QBOInvoiceResponse {
  ok: true;
  customer: {
    id: string;
    displayName: string;
  };
  invoice: {
    id: string;
    docNumber: string | null;
    totalAmt: number | null;
    balance: number | null;
    status: string | null;
    txnDate: string | null;
    dueDate: string | null;
  };
  links: {
    pdf: {
      contentType: 'application/pdf';
      base64: string;
    };
    hostedInvoiceUrl: string | null;
    payNowUrl: string | null;
  };
}

export interface QBOInvoiceError {
  ok: false;
  error: {
    message: string;
    code: string | null;
    details?: unknown;
  };
}

export type QBOInvoiceResult = QBOInvoiceResponse | QBOInvoiceError;
