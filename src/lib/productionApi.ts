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
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
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
    throw new ApiError(503, 'A network error occurred. Please try again.');
  }

  if (!response.ok) {
    throw new ApiError(response.status, 'An error occurred during submission.');
  }

  try {
    return await response.json();
  } catch {
    throw new ApiError(500, 'An unexpected response was received from the server.');
  }
}
