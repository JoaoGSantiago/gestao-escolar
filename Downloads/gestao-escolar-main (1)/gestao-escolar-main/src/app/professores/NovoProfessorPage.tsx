'use client';

import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEscola } from '@/contexts/EscolaContext';

const professorSchema = z.object({
  nome: z.string().min(3, 'O nome deve ter pelo menos 3 caracteres'),
  email: z.string().email('E-mail inválido'),
  telefone: z.string().min(10, 'Informe um telefone válido'),
  disciplina: z.string().min(2, 'Informe a disciplina'),
  status: z.enum(['Ativo', 'Inativo']),
});

type ProfessorFormData = z.infer<typeof professorSchema>;

export default function NovoProfessorPage() {
  const router = useRouter();
  const { adicionarProfessor } = useEscola();

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<ProfessorFormData>({
    resolver: zodResolver(professorSchema),
    defaultValues: { status: 'Ativo' },
  });

  const onSubmit = async (data: ProfessorFormData) => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    adicionarProfessor(data);
    toast.success('Professor cadastrado com sucesso!');
    reset();
    router.push('/professores');
  };

  return (
    <main className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-2xl mx-auto">
        <Link href="/professores" className="text-indigo-600 hover:underline mb-4 inline-block">
          ← Voltar para a lista
        </Link>

        <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
          <h1 className="text-2xl font-bold mb-6">Cadastrar Professor</h1>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-1">Nome Completo</label>
              <input {...register('nome')} className={`w-full p-3 rounded-xl border ${errors.nome ? 'border-red-500' : 'border-gray-200'}`} />
              {errors.nome && <span className="text-red-500 text-xs">{errors.nome.message}</span>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">E-mail</label>
                <input {...register('email')} type="email" className="w-full p-3 rounded-xl border border-gray-200" />
                {errors.email && <span className="text-red-500 text-xs">{errors.email.message}</span>}
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Telefone</label>
                <input {...register('telefone')} className="w-full p-3 rounded-xl border border-gray-200" />
                {errors.telefone && <span className="text-red-500 text-xs">{errors.telefone.message}</span>}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Disciplina</label>
              <input {...register('disciplina')} className="w-full p-3 rounded-xl border border-gray-200" />
              {errors.disciplina && <span className="text-red-500 text-xs">{errors.disciplina.message}</span>}
            </div>

            <button type="submit" disabled={isSubmitting} className="w-full bg-indigo-600 text-white py-3 rounded-xl font-bold hover:bg-indigo-700 transition-all">
              {isSubmitting ? 'Salvando...' : 'Cadastrar Professor'}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}