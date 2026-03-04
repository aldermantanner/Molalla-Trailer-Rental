/**
 * QuickBooks Online Invoice Creation via Pica Passthrough
 *
 * REQUIRED Environment Variables (set in Supabase project settings):
 * - PICA_SECRET_KEY (required)
 * - PICA_QUICKBOOKS_CONNECTION_KEY or QUICKBOOKS_CONNECTION_KEY (required)
 * - QBO_ITEM_TRAILER_RENTAL_ID (required for trailer rentals)
 * - QBO_ITEM_JUNK_REMOVAL_ID (required for junk removal)
 * - QBO_ITEM_DEPOSIT_FEE_ID (optional)
 * - QBO_ITEM_TRAVEL_SURCHARGE_ID (optional)
 * - QBO_ITEM_TAX_ID (optional)
 */

import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface PicaFetchOptions {
  url: string;
  method: 'GET' | 'POST';
  actionId: string;
  headers?: Record<string, string>;
  body?: unknown;
}

interface BookingInput {
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

interface QBOCustomer {
  Id: string;
  DisplayName: string;
  PrimaryEmailAddr?: { Address: string };
  PrimaryPhone?: { FreeFormNumber: string };
  BillAddr?: Record<string, unknown>;
}

interface QBOInvoice {
  Id: string;
  DocNumber?: string;
  TotalAmt?: number;
  Balance?: number;
  TxnDate?: string;
  DueDate?: string;
  EmailStatus?: string;
  CustomerRef?: Record<string, unknown>;
  InvoiceLink?: string;
}

async function picaFetch({ url, method, actionId, headers = {}, body }: PicaFetchOptions) {
  const picaSecret = Deno.env.get('PICA_SECRET_KEY');
  const connectionKey = Deno.env.get('PICA_QUICKBOOKS_CONNECTION_KEY') ?? Deno.env.get('QUICKBOOKS_CONNECTION_KEY');

  if (!picaSecret) {
    throw new Error('PICA_SECRET_KEY environment variable is not set');
  }
  if (!connectionKey) {
    throw new Error('PICA_QUICKBOOKS_CONNECTION_KEY or QUICKBOOKS_CONNECTION_KEY environment variable is not set');
  }

  const requestHeaders: Record<string, string> = {
    'x-pica-secret': picaSecret,
    'x-pica-connection-key': connectionKey,
    'x-pica-action-id': actionId,
    ...headers,
  };

  const requestInit: RequestInit = {
    method,
    headers: requestHeaders,
  };

  if (body && method === 'POST') {
    requestInit.body = JSON.stringify(body);
  }

  const response = await fetch(url, requestInit);
  const isJson = headers['Accept']?.includes('application/json');

  let data: unknown;
  let text = '';

  if (isJson) {
    text = await response.text();
    try {
      data = JSON.parse(text);
    } catch {
      data = null;
    }
  } else {
    const arrayBuffer = await response.arrayBuffer();
    data = new Uint8Array(arrayBuffer);
    text = '[binary data]';
  }

  return {
    ok: response.ok,
    status: response.status,
    data,
    text,
  };
}

function formatDateYYYYMMDD(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function normalizePhone(phone: string | null): string {
  if (!phone) return '';
  return phone.replace(/\D/g, '');
}

function calculateDaysBetween(startDate: string, endDate: string): number {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffTime = Math.abs(end.getTime() - start.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return Math.max(1, diffDays);
}

async function findOrCreateCustomer(input: BookingInput): Promise<QBOCustomer> {
  let customer: QBOCustomer | null = null;

  if (input.customer_email) {
    const query = `select * from Customer where PrimaryEmailAddr = '${input.customer_email.replace(/'/g, "\\'")}' maxresults 1`;
    const queryUrl = `https://api.picaos.com/v1/passthrough/query?query=${encodeURIComponent(query)}`;

    const queryResult = await picaFetch({
      url: queryUrl,
      method: 'GET',
      actionId: 'conn_mod_def::GD9h4N_PTkc::mFk9VOT0Q_aphNTX1uN6qg',
      headers: { 'Accept': 'application/json' },
    });

    if (queryResult.ok && queryResult.data) {
      const queryResponse = queryResult.data as { QueryResponse?: { Customer?: QBOCustomer[] } };
      if (queryResponse.QueryResponse?.Customer && queryResponse.QueryResponse.Customer.length > 0) {
        customer = queryResponse.QueryResponse.Customer[0];
      }
    }
  }

  if (!customer && input.customer_phone) {
    const displayName = input.customer_name.replace(/'/g, "\\'");
    const query = `select * from Customer where DisplayName = '${displayName}' maxresults 5`;
    const queryUrl = `https://api.picaos.com/v1/passthrough/query?query=${encodeURIComponent(query)}`;

    const queryResult = await picaFetch({
      url: queryUrl,
      method: 'GET',
      actionId: 'conn_mod_def::GD9h4N_PTkc::mFk9VOT0Q_aphNTX1uN6qg',
      headers: { 'Accept': 'application/json' },
    });

    if (queryResult.ok && queryResult.data) {
      const queryResponse = queryResult.data as { QueryResponse?: { Customer?: QBOCustomer[] } };
      if (queryResponse.QueryResponse?.Customer) {
        const normalizedInputPhone = normalizePhone(input.customer_phone);
        customer = queryResponse.QueryResponse.Customer.find(c =>
          normalizePhone(c.PrimaryPhone?.FreeFormNumber ?? '') === normalizedInputPhone
        ) ?? null;
      }
    }
  }

  if (customer) {
    return customer;
  }

  const createCustomerPayload: Record<string, unknown> = {
    DisplayName: input.customer_name.substring(0, 500),
    FullyQualifiedName: input.customer_name.substring(0, 500),
  };

  if (input.customer_email) {
    createCustomerPayload.PrimaryEmailAddr = { Address: input.customer_email };
  }

  if (input.customer_phone) {
    createCustomerPayload.PrimaryPhone = { FreeFormNumber: input.customer_phone };
  }

  if (input.customer_address) {
    createCustomerPayload.BillAddr = {
      Line1: input.customer_address.line1,
      ...(input.customer_address.line2 && { Line2: input.customer_address.line2 }),
      City: input.customer_address.city,
      CountrySubDivisionCode: input.customer_address.state,
      PostalCode: input.customer_address.postal_code,
      ...(input.customer_address.country && { Country: input.customer_address.country }),
    };
  }

  const createResult = await picaFetch({
    url: 'https://api.picaos.com/v1/passthrough/customer',
    method: 'POST',
    actionId: 'conn_mod_def::GD9h4nK_qyU::bcW_Ix1qQVGgrAvewtby_w',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: createCustomerPayload,
  });

  if (!createResult.ok) {
    throw new Error(`Failed to create customer: ${createResult.text}`);
  }

  const createResponse = createResult.data as { Customer?: QBOCustomer };
  if (!createResponse.Customer) {
    throw new Error('Customer creation succeeded but no customer data returned');
  }

  return createResponse.Customer;
}

async function createInvoice(input: BookingInput, customer: QBOCustomer): Promise<QBOInvoice> {
  const today = new Date();
  const dueDate = new Date(today);
  dueDate.setDate(dueDate.getDate() + 3);

  const invoiceLines: Array<Record<string, unknown>> = [];
  const extras = input.extras || {};
  let remainingAmount = input.total_price;

  if (extras.deposit_fee) {
    remainingAmount -= extras.deposit_fee;
  }
  if (extras.travel_fuel_surcharge) {
    remainingAmount -= extras.travel_fuel_surcharge;
  }
  if (extras.tax_amount) {
    remainingAmount -= extras.tax_amount;
  }

  if (input.service_type === 'trailer_rental' || input.service_type === 'both') {
    const itemId = Deno.env.get('QBO_ITEM_TRAILER_RENTAL_ID');
    if (!itemId) {
      throw new Error('QBO_ITEM_TRAILER_RENTAL_ID environment variable is not set');
    }

    let trailerAmount = remainingAmount;
    if (input.service_type === 'both') {
      trailerAmount = remainingAmount / 2;
    }

    let description = `Trailer Rental - ${input.trailer_model || 'Trailer'}`;
    if (input.start_date && input.end_date) {
      const days = calculateDaysBetween(input.start_date, input.end_date);
      const dailyRate = trailerAmount / days;
      description += `\nRental from ${input.start_date} to ${input.end_date} (${days} days at $${dailyRate.toFixed(2)}/day)`;
    }

    invoiceLines.push({
      Amount: trailerAmount,
      Description: description,
      DetailType: 'SalesItemLineDetail',
      SalesItemLineDetail: {
        ItemRef: {
          value: itemId,
          name: 'Trailer Rental',
        },
        Qty: 1,
        UnitPrice: trailerAmount,
      },
    });
  }

  if (input.service_type === 'junk_removal' || input.service_type === 'both') {
    const itemId = Deno.env.get('QBO_ITEM_JUNK_REMOVAL_ID');
    if (!itemId) {
      throw new Error('QBO_ITEM_JUNK_REMOVAL_ID environment variable is not set');
    }

    let junkAmount = remainingAmount;
    if (input.service_type === 'both') {
      junkAmount = remainingAmount / 2;
    }

    const description = input.junk_description
      ? `Junk Removal Service\n${input.junk_description}`
      : 'Junk Removal Service';

    invoiceLines.push({
      Amount: junkAmount,
      Description: description,
      DetailType: 'SalesItemLineDetail',
      SalesItemLineDetail: {
        ItemRef: {
          value: itemId,
          name: 'Junk Removal',
        },
        Qty: 1,
        UnitPrice: junkAmount,
      },
    });
  }

  if (extras.deposit_fee && extras.deposit_fee > 0) {
    const itemId = Deno.env.get('QBO_ITEM_DEPOSIT_FEE_ID');
    if (!itemId) {
      throw new Error('QBO_ITEM_DEPOSIT_FEE_ID environment variable is not set (required when deposit_fee is provided)');
    }

    invoiceLines.push({
      Amount: extras.deposit_fee,
      Description: 'Deposit Fee',
      DetailType: 'SalesItemLineDetail',
      SalesItemLineDetail: {
        ItemRef: {
          value: itemId,
          name: 'Deposit Fee',
        },
        Qty: 1,
        UnitPrice: extras.deposit_fee,
      },
    });
  }

  if (extras.travel_fuel_surcharge && extras.travel_fuel_surcharge > 0) {
    const itemId = Deno.env.get('QBO_ITEM_TRAVEL_SURCHARGE_ID');
    if (!itemId) {
      throw new Error('QBO_ITEM_TRAVEL_SURCHARGE_ID environment variable is not set (required when travel_fuel_surcharge is provided)');
    }

    invoiceLines.push({
      Amount: extras.travel_fuel_surcharge,
      Description: 'Travel & Fuel Surcharge',
      DetailType: 'SalesItemLineDetail',
      SalesItemLineDetail: {
        ItemRef: {
          value: itemId,
          name: 'Travel Surcharge',
        },
        Qty: 1,
        UnitPrice: extras.travel_fuel_surcharge,
      },
    });
  }

  const location = `${input.customer_address.city}, ${input.customer_address.state}`;
  const privateNote = `Website Booking #${input.booking_id} - Service Type: ${input.service_type} - Location: ${location}`;

  const invoicePayload: Record<string, unknown> = {
    CustomerRef: {
      value: customer.Id,
      name: customer.DisplayName,
    },
    TxnDate: formatDateYYYYMMDD(today),
    DueDate: formatDateYYYYMMDD(dueDate),
    Line: invoiceLines,
    PrivateNote: privateNote,
    CustomerMemo: {
      value: `Thank you for choosing Molalla Trailer Rental! Booking #${input.booking_id}`,
    },
  };

  if (input.customer_email) {
    invoicePayload.BillEmail = {
      Address: input.customer_email,
    };
  }

  if (input.customer_address) {
    invoicePayload.BillAddr = {
      Line1: input.customer_address.line1,
      ...(input.customer_address.line2 && { Line2: input.customer_address.line2 }),
      City: input.customer_address.city,
      CountrySubDivisionCode: input.customer_address.state,
      PostalCode: input.customer_address.postal_code,
      ...(input.customer_address.country && { Country: input.customer_address.country }),
    };
  }

  invoicePayload.AllowOnlinePayment = true;
  invoicePayload.AllowOnlineCreditCardPayment = true;
  invoicePayload.AllowOnlineACHPayment = true;

  let createResult = await picaFetch({
    url: 'https://api.picaos.com/v1/passthrough/invoice',
    method: 'POST',
    actionId: 'conn_mod_def::GD9h8p8qTi8::MiNlet1KSQSe99EphDAh6Q',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: invoicePayload,
  });

  if (!createResult.ok) {
    delete invoicePayload.AllowOnlinePayment;
    delete invoicePayload.AllowOnlineCreditCardPayment;
    delete invoicePayload.AllowOnlineACHPayment;

    createResult = await picaFetch({
      url: 'https://api.picaos.com/v1/passthrough/invoice',
      method: 'POST',
      actionId: 'conn_mod_def::GD9h8p8qTi8::MiNlet1KSQSe99EphDAh6Q',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: invoicePayload,
    });
  }

  if (!createResult.ok) {
    throw new Error(`Failed to create invoice: ${createResult.text}`);
  }

  const createResponse = createResult.data as { Invoice?: QBOInvoice };
  if (!createResponse.Invoice) {
    throw new Error('Invoice creation succeeded but no invoice data returned');
  }

  return createResponse.Invoice;
}

async function readInvoice(invoiceId: string): Promise<QBOInvoice> {
  const readResult = await picaFetch({
    url: `https://api.picaos.com/v1/passthrough/invoice/${invoiceId}`,
    method: 'GET',
    actionId: 'conn_mod_def::GD9h7OYp80E::uZRGOombQTmGVSheesImVg',
    headers: {
      'Accept': 'application/json',
    },
  });

  if (!readResult.ok) {
    throw new Error(`Failed to read invoice: ${readResult.text}`);
  }

  const readResponse = readResult.data as { Invoice?: QBOInvoice };
  if (!readResponse.Invoice) {
    throw new Error('Invoice read succeeded but no invoice data returned');
  }

  return readResponse.Invoice;
}

async function getInvoicePDF(invoiceId: string): Promise<string> {
  const pdfResult = await picaFetch({
    url: `https://api.picaos.com/v1/passthrough/invoice/${invoiceId}/pdf`,
    method: 'GET',
    actionId: 'conn_mod_def::GD9h6x7UFvs::chxuinxeQGe7kYMp7S-bgg',
    headers: {
      'Content-Type': 'application/pdf',
    },
  });

  if (!pdfResult.ok) {
    throw new Error(`Failed to get invoice PDF: ${pdfResult.text}`);
  }

  const pdfBytes = pdfResult.data as Uint8Array;

  const base64Chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
  let base64 = '';
  const len = pdfBytes.length;

  for (let i = 0; i < len; i += 3) {
    const byte1 = pdfBytes[i];
    const byte2 = i + 1 < len ? pdfBytes[i + 1] : 0;
    const byte3 = i + 2 < len ? pdfBytes[i + 2] : 0;

    const encoded1 = byte1 >> 2;
    const encoded2 = ((byte1 & 0x03) << 4) | (byte2 >> 4);
    const encoded3 = ((byte2 & 0x0F) << 2) | (byte3 >> 6);
    const encoded4 = byte3 & 0x3F;

    base64 += base64Chars[encoded1];
    base64 += base64Chars[encoded2];
    base64 += i + 1 < len ? base64Chars[encoded3] : '=';
    base64 += i + 2 < len ? base64Chars[encoded4] : '=';
  }

  return base64;
}

async function sendInvoice(invoiceId: string, email: string): Promise<void> {
  await picaFetch({
    url: `https://api.picaos.com/v1/passthrough/invoice/${invoiceId}/send?sendTo=${encodeURIComponent(email)}`,
    method: 'POST',
    actionId: 'conn_mod_def::GD9h7YsjSeY::8m7wNWgKQ8uXyhxdMywNmQ',
    headers: {
      'Content-Type': 'application/octet-stream',
      'Accept': 'application/json',
    },
  });
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const input: BookingInput = await req.json();

    if (!input.customer_name || !input.service_type || !input.total_price || !input.booking_id) {
      return new Response(
        JSON.stringify({
          ok: false,
          error: {
            message: 'Missing required fields: customer_name, service_type, total_price, booking_id',
            code: 'VALIDATION_ERROR',
          },
        }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    if (!['trailer_rental', 'junk_removal', 'both'].includes(input.service_type)) {
      return new Response(
        JSON.stringify({
          ok: false,
          error: {
            message: 'Invalid service_type. Must be: trailer_rental, junk_removal, or both',
            code: 'VALIDATION_ERROR',
          },
        }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    const customer = await findOrCreateCustomer(input);
    const invoice = await createInvoice(input, customer);
    const detailedInvoice = await readInvoice(invoice.Id);
    const pdfBase64 = await getInvoicePDF(invoice.Id);

    if (input.customer_email) {
      try {
        await sendInvoice(invoice.Id, input.customer_email);
      } catch (error) {
        console.warn('Failed to send invoice email:', error);
      }
    }

    return new Response(
      JSON.stringify({
        ok: true,
        customer: {
          id: customer.Id,
          displayName: customer.DisplayName,
        },
        invoice: {
          id: detailedInvoice.Id,
          docNumber: detailedInvoice.DocNumber ?? null,
          totalAmt: detailedInvoice.TotalAmt ?? null,
          balance: detailedInvoice.Balance ?? null,
          status: detailedInvoice.EmailStatus ?? null,
          txnDate: detailedInvoice.TxnDate ?? null,
          dueDate: detailedInvoice.DueDate ?? null,
        },
        links: {
          pdf: {
            contentType: 'application/pdf',
            base64: pdfBase64,
          },
          hostedInvoiceUrl: detailedInvoice.InvoiceLink ?? null,
          payNowUrl: detailedInvoice.InvoiceLink ?? null,
        },
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('QBO Invoice Creation Error:', error);

    return new Response(
      JSON.stringify({
        ok: false,
        error: {
          message: error instanceof Error ? error.message : 'Unknown error occurred',
          code: 'INTERNAL_ERROR',
          details: error,
        },
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
