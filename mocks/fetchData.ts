type FetchOptions = {
  simularErro?: boolean;
  simularVazio?: boolean;
};

function esperar(tempo = 800) {
  return new Promise((resolve) => setTimeout(resolve, tempo));
}

export async function fetchMockData<T>(
  data: T[],
  options?: FetchOptions
): Promise<T[]> {
  await esperar();

  if (options?.simularErro) {
    throw new Error("Erro ao carregar os dados.");
  }

  if (options?.simularVazio) {
    return [];
  }

  return data;
}
