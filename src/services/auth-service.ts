import { postRequest } from '@/lib/http';
/*
/ ----------------------------------
/ Login
/ ----------------------------------    
*/

interface LoginPayload {
  email: string;
  password: string;
}

// interface LoginResponse {
//   token: string;
// }

export function login(payload: LoginPayload) {
  return postRequest('/auth/sign-in', payload);
}
