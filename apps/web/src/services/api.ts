const API_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3333/api";

const TOKEN_KEY = "edu_token";
const USER_KEY = "edu_user";

export interface UsuarioAutenticado {
  id: string;
  nome: string;
  email: string;
  role: "COORDENACAO" | "PROFESSOR";
}

export function salvarSessao(token: string, user: UsuarioAutenticado) {
  if (typeof globalThis.window === "undefined") return;
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function limparSessao() {
  if (typeof globalThis.window === "undefined") return;
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

export function obterToken(): string | null {
  if (typeof globalThis.window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function obterUsuario(): UsuarioAutenticado | null {
  if (typeof globalThis.window === "undefined") return null;
  const raw = localStorage.getItem(USER_KEY);
  return raw ? (JSON.parse(raw) as UsuarioAutenticado) : null;
}

/** Cliente HTTP central: injeta o token JWT e trata erros da API. */
export async function apiFetch<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const token = obterToken();
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers ?? {}),
    },
  });

  if (!response.ok) {
    const corpo = await response.json().catch(() => null);
    const mensagem = corpo?.message ?? `Erro ${response.status}`;
    throw new Error(Array.isArray(mensagem) ? mensagem.join(", ") : mensagem);
  }

  if (response.status === 204) {
    return undefined as T;
  }
  return response.json() as Promise<T>;
}
