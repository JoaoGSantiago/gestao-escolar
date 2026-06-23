export interface Usuario {
  id: string;
  nome: string;
  email: string;
  senhaCriptografada: string;
  role: 'admin' | 'professor' | 'aluno';
}

export const usuariosBanco: Usuario[] = [];
