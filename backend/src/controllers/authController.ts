import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { usuariosBanco, Usuario } from '../config/database';

const JWT_SECRET = 'sua_chave_secreta_super_segura_aqui';

export const authController = {
  registrar: async (req: Request, res: Response): Promise<any> => {
    try {
      const { nome, email, senha, role } = req.body;

      if (!nome || !email || !senha) {
        return res.status(400).json({ error: 'Todos os campos são obrigatórios' });
      }

      const usuarioExiste = usuariosBanco.find(u => u.email === email);
      if (usuarioExiste) {
        return res.status(400).json({ error: 'Este e-mail já está cadastrado' });
      }

      const salt = await bcrypt.genSalt(10);
      const senhaCriptografada = await bcrypt.hash(senha, salt);

      const novoUsuario: Usuario = {
        id: Math.random().toString(36).substr(2, 9),
        nome,
        email,
        senhaCriptografada,
        role: role || 'aluno'
      };

      usuariosBanco.push(novoUsuario);

      return res.status(201).json({ 
        message: 'Usuário criado com sucesso!',
        usuario: { id: novoUsuario.id, nome: novoUsuario.nome, email: novoUsuario.email }
      });

    } catch (error) {
      return res.status(500).json({ error: 'Erro interno no servidor' });
    }
  },

  login: async (req: Request, res: Response): Promise<any> => {
    try {
      const { email, senha } = req.body;

      const usuario = usuariosBanco.find(u => u.email === email);
      if (!usuario) {
        return res.status(400).json({ error: 'E-mail ou senha incorretos' });
      }

      const senhaCorreta = await bcrypt.compare(senha, usuario.senhaCriptografada);
      if (!senhaCorreta) {
        return res.status(400).json({ error: 'E-mail ou senha incorretos' });
      }

      const token = jwt.sign(
        { id: usuario.id, role: usuario.role }, 
        JWT_SECRET, 
        { expiresIn: '1d' }
      );

      return res.json({
        message: 'Login bem-sucedido!',
        token,
        usuario: { id: usuario.id, nome: usuario.nome, email: usuario.email, role: usuario.role }
      });

    } catch (error) {
      return res.status(500).json({ error: 'Erro interno no servidor' });
    }
  }
};
