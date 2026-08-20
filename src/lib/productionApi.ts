export type SourceType = 'FILE' | 'FOLDER';
export type SourceProvider = 'GOOGLE_DRIVE' | 'ONEDRIVE' | 'SHAREPOINT' | 'DROPBOX' | 'OTHER';

export interface ProductionSubmissionRequest {
  project_id: string;
  source_type: SourceType;
  source_provider: SourceProvider;
  source_url: string;
  source_name: string | null;
  instructions: string;
  source_access_attested: boolean;
}

export interface ProductionSubmissionResponse {
  submission: {
    id: string;
    project_id: string;
    source_type: SourceType;
    source_provider: SourceProvider;
    source_name: string | null;
    access_status: string;
    submitted_at: string;
  };
}

export class ApiError extends Error {
  status: number;
  code: string;

  constructor(status: number, code: string) {
    super(code);
    this.status = status;
    this.code = code;
    this.name = 'ApiError';
  }
}

function getApiBaseUrl(): string {
  const value = import.meta.env.VITE_API_URL?.trim();

  if (!value) {
    throw new ApiError(500, 'API_CONFIGURATION_ERROR');
  }

  return value.replace(/\/+$/, '');
}

export async function submitProduction(
  token: string,
  data: ProductionSubmissionRequest
): Promise<ProductionSubmissionResponse> {
  const apiBaseUrl = getApiBaseUrl();

  let response: Response;
  try {
    response = await fetch(`${apiBaseUrl}/production/submissions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(data)
    });
  } catch {
    throw new ApiError(503, 'NETWORK_ERROR');
  }

  if (!response.ok) {
    let errorCode = 'API_REQUEST_FAILED';
    try {
      const errorData = await response.json();
      if (errorData && errorData.error && typeof errorData.error.code === 'string') {
        errorCode = errorData.error.code;
      }
    } catch {
      // Parsing failed, use fallback code
    }
    throw new ApiError(response.status, errorCode);
  }

  try {
    return await response.json();
  } catch {
    throw new ApiError(500, 'INVALID_API_RESPONSE');
  }
}
