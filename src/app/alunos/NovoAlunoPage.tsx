'use client';

import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { useEscola } from '@/contexts/EscolaContext';
import { useRouter } from 'next/navigation';

const alunoSchema = z.object({
  nome: z.string().min(3, 'O nome deve ter pelo menos 3 caracteres'),
  email: z.string().email('E-mail inválido'),
  matricula: z.string().min(5, 'A matrícula deve ter pelo menos 5 dígitos'),
  dataNascimento: z.string().min(1, 'Data obrigatória'),
  turma: z.string().min(1, 'Selecione uma turma'),
  status: z.enum(['Ativo', 'Inativo']),
});

type AlunoFormData = z.infer<typeof alunoSchema>;

export default function NovoAlunoPage() {
  const { adicionarAluno } = useEscola();
  const router = useRouter();

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<AlunoFormData>({
    resolver: zodResolver(alunoSchema),
    defaultValues: { status: 'Ativo' },
  });

  const onSubmit = async (data: AlunoFormData) => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    adicionarAluno(data);
    toast.success('Aluno cadastrado com sucesso!');
    reset();
    router.push('/alunos'); // Volta para a lista
  };

  return (
    <div className="max-w-2xl mx-auto p-8 bg-white rounded-2xl shadow-sm border mt-10">
      <h2 className="text-2xl font-bold mb-6">Cadastrar Novo Aluno</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* NOME */}
        <div>
          <label className="block text-sm font-medium mb-1">Nome Completo</label>
          <input {...register('nome')} className="w-full p-3 border rounded-xl" />
          {errors.nome && <span className="text-red-500 text-xs">{errors.nome.message}</span>}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">E-mail</label>
            <input {...register('email')} className="w-full p-3 border rounded-xl" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Matrícula</label>
            <input {...register('matricula')} className="w-full p-3 border rounded-xl" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Data de Nascimento</label>
            <input {...register('dataNascimento')} type="date" className="w-full p-3 border rounded-xl" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Turma</label>
            <select {...register('turma')} className="w-full p-3 border rounded-xl bg-white">
              <option value="">Selecione...</option>
              <option value="1º Ano A">1º Ano A</option>
              <option value="2º Ano B">2º Ano B</option>
            </select>
          </div>
        </div>

        <button type="submit" disabled={isSubmitting} className="w-full bg-blue-600 text-white p-4 rounded-xl font-bold hover:bg-blue-700">
          {isSubmitting ? 'Salvando...' : 'Cadastrar Aluno'}
        </button>
      </form>
    </div>
  );
}