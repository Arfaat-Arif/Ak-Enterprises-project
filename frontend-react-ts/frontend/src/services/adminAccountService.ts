import { apiClient } from './apiClient';

export interface AdminAccount {
  email: string;
}

export interface AdminAccountUpdatePayload {
  currentPassword: string;
  email?: string;
  password?: string;
  passwordConfirmation?: string;
}

interface AdminAccountResponse {
  data: AdminAccount;
}

interface AdminAccountUpdateResponse {
  message: string;
  requiresReauth: boolean;
  data: AdminAccount;
}

export async function getAdminAccount(): Promise<AdminAccount> {
  const { data } = await apiClient.get<AdminAccountResponse>('/admin/account');
  return data.data;
}

export async function updateAdminAccount(
  payload: AdminAccountUpdatePayload,
): Promise<AdminAccountUpdateResponse> {
  const body: Record<string, string> = {
    current_password: payload.currentPassword,
  };

  if (payload.email !== undefined) {
    body.email = payload.email;
  }
  if (payload.password) {
    body.password = payload.password;
    body.password_confirmation = payload.passwordConfirmation ?? '';
  }

  const { data } = await apiClient.put<AdminAccountUpdateResponse>('/admin/account', body);
  return data;
}
