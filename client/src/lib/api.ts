import { apiRequest } from "./queryClient";
import { type RegisterUser } from "@shared/schema";

export async function checkUsernameAvailability(username: string): Promise<boolean> {
  const res = await apiRequest("GET", `/api/auth/check-username?username=${encodeURIComponent(username)}`);
  const json = await res.json();
  return Boolean(json.available);
}

export async function registerUser(payload: RegisterUser): Promise<{ id: string; username: string; userType: string }>
{
  const res = await apiRequest("POST", "/api/auth/register", payload);
  const json = await res.json();
  return json.user as { id: string; username: string; userType: string };
}

