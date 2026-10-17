import { apiRequest } from './client';

export interface Profile {
  id: number;
  username: string;
  displayName: string;
  email: string;
}

export interface UpdateProfileInput {
  username?: string;
  displayName?: string;
  email?: string;
}

export function getProfile(): Promise<Profile> {
  return apiRequest<Profile>('/profile');
}

export function updateProfile(input: UpdateProfileInput): Promise<Profile> {
  return apiRequest<Profile>('/profile', {
    method: 'PATCH',
    body: JSON.stringify(input),
  });
}
