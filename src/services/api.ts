const API_DELAY_MS = 250;

export function simularRespostaApi<T>(dados: T): Promise<T> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(structuredClone(dados)), API_DELAY_MS);
  });
}
