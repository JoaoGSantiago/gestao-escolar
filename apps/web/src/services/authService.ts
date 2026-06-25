import {
  apiFetch,
  limparSessao,
  salvarSessao,
  type UsuarioAutenticado,
} from "./api";

interface LoginResponse {
  accessToken: string;
  user: UsuarioAutenticado;
}

export async function login(email: string, senha: string) {
  const resposta = await apiFetch<LoginResponse>("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, senha }),
  });
  salvarSessao(resposta.accessToken, resposta.user);
  return resposta.user;
}

export function logout() {
  limparSessao();
}

export type { UsuarioAutenticado };
