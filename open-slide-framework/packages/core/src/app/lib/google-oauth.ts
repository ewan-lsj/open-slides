const GOOGLE_SCOPE = 'https://www.googleapis.com/auth/drive.file';
const TOKEN_EXPIRY_SKEW_MS = 60_000;

type TokenClient = {
  requestAccessToken: (overrideConfig?: { prompt?: string }) => void;
};

type TokenResponse = {
  access_token?: string;
  expires_in?: number;
  error?: string;
  error_description?: string;
};

declare global {
  interface Window {
    google?: {
      accounts: {
        oauth2: {
          initTokenClient: (config: {
            client_id: string;
            scope: string;
            callback: (response: TokenResponse) => void;
          }) => TokenClient;
        };
      };
    };
  }
}

let scriptPromise: Promise<void> | null = null;
let cachedToken: { clientId: string; accessToken: string; expiresAt: number } | null = null;
let hasGrantedToken = false;

function loadGoogleIdentityScript(): Promise<void> {
  if (window.google?.accounts?.oauth2) return Promise.resolve();
  if (scriptPromise) return scriptPromise;
  scriptPromise = new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Failed to load Google Identity Services'));
    document.head.appendChild(script);
  });
  return scriptPromise;
}

export async function requestGoogleAccessToken(clientId: string): Promise<string> {
  if (
    cachedToken?.clientId === clientId &&
    cachedToken.expiresAt - TOKEN_EXPIRY_SKEW_MS > Date.now()
  ) {
    console.info('[open-slide][gslides] reusing cached access token');
    return cachedToken.accessToken;
  }

  console.info('[open-slide][gslides] loading Google Identity Services…');
  await loadGoogleIdentityScript();
  const oauth = window.google?.accounts?.oauth2;
  if (!oauth) throw new Error('Google Identity Services unavailable');

  try {
    console.info(
      hasGrantedToken
        ? '[open-slide][gslides] requesting token silently (prior consent)…'
        : '[open-slide][gslides] requesting token with consent prompt…',
    );
    return await requestFreshAccessToken(clientId, hasGrantedToken ? '' : undefined);
  } catch (err) {
    if (!hasGrantedToken) throw err;
    console.warn('[open-slide][gslides] silent token request failed, prompting again', err);
    return requestFreshAccessToken(clientId);
  }
}

function requestFreshAccessToken(clientId: string, prompt?: string): Promise<string> {
  const oauth = window.google?.accounts?.oauth2;
  if (!oauth) throw new Error('Google Identity Services unavailable');

  return new Promise((resolve, reject) => {
    const client = oauth.initTokenClient({
      client_id: clientId,
      scope: GOOGLE_SCOPE,
      callback: (response) => {
        if (response.error) {
          reject(new Error(response.error_description ?? response.error));
          return;
        }
        if (!response.access_token) {
          reject(new Error('No access token returned'));
          return;
        }
        const expiresInMs = Math.max(0, response.expires_in ?? 3600) * 1000;
        cachedToken = {
          clientId,
          accessToken: response.access_token,
          expiresAt: Date.now() + expiresInMs,
        };
        hasGrantedToken = true;
        resolve(response.access_token);
      },
    });
    client.requestAccessToken(prompt == null ? undefined : { prompt });
  });
}

export function googleSlidesEditUrl(presentationId: string): string {
  return `https://docs.google.com/presentation/d/${presentationId}/edit`;
}
