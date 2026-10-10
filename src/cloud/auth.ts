import type { CloudConfiguration } from './readOnlySnapshot';

export interface CloudSession {
  access_token: string;
  refresh_token: string;
  expires_at?: number;
  user: { id: string; email?: string };
}

const SESSION_KEY = 'dlv_supabase_session_v1';

export function loadCloudSession(): CloudSession | null {
  try {
    const raw = sessionStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    const value: unknown = JSON.parse(raw);
    if (!value || typeof value !== 'object') return null;
    const session = value as Partial<CloudSession>;
    if (typeof session.access_token !== 'string' || typeof session.refresh_token !== 'string' ||
        !session.user || typeof session.user.id !== 'string') return null;
    return session as CloudSession;
  } catch { return null; }
}

function storeSession(session: CloudSession): CloudSession {
  sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));
  return session;
}

export async function signInCloud(config: CloudConfiguration, email: string, password: string): Promise<CloudSession> {
  const response = await fetch(`${config.url}/auth/v1/token?grant_type=password`, {
    method: 'POST',
    headers: { apikey: config.publishableKey, 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: email.trim(), password }),
    cache: 'no-store',
  });
  const result = await response.json() as Record<string, unknown>;
  if (!response.ok || typeof result.access_token !== 'string' || typeof result.refresh_token !== 'string' ||
      !result.user || typeof result.user !== 'object' || typeof (result.user as { id?: unknown }).id !== 'string') {
    throw new Error('Sign-in failed. Check your email, password, and email confirmation.');
  }
  return storeSession(result as unknown as CloudSession);
}

export async function signUpCloud(config: CloudConfiguration, email: string, password: string): Promise<void> {
  const response = await fetch(`${config.url}/auth/v1/signup`, {
    method: 'POST',
    headers: { apikey: config.publishableKey, 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: email.trim(), password }),
    cache: 'no-store',
  });
  if (!response.ok) throw new Error('Account creation failed. Check the email and password requirements.');
}

export function signOutCloud(): void {
  sessionStorage.removeItem(SESSION_KEY);
}
