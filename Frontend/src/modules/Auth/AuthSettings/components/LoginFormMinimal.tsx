import React, { useState } from 'react';
import { useForm } from '@inertiajs/react';

const LoginFormMinimal = () => {
  const { data, setData, post, processing, errors } = useForm({
    email: '',
    password: '',
    remember: false,
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    post('/login');
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2 className="auth-title">
          Login
        </h2>
        <p className="auth-subtitle">
          Entre com suas credenciais para acessar o xWin Dashboard
        </p>
        
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="email" className="form-label">
              Email
            </label>
            <input
              id="email"
              type="email"
              name="email"
              value={data.email}
              className="form-input"
              placeholder="seu@email.com"
              onChange={(e) => setData('email', e.target.value)}
              required
            />
            {errors.email && (
              <p className="form-error">{errors.email}</p>
            )}
          </div>
          
          <div className="form-group">
            <label htmlFor="password" className="form-label">
              Senha
            </label>
            <input
              id="password"
              type="password"
              name="password"
              value={data.password}
              className="form-input"
              placeholder="Sua senha"
              onChange={(e) => setData('password', e.target.value)}
              required
            />
            {errors.password && (
              <p className="form-error">{errors.password}</p>
            )}
          </div>
          
          <button
            type="submit"
            disabled={processing}
            className="form-button"
          >
            {processing ? 'Entrando...' : 'Entrar'}
          </button>
        </form>
        
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Não tem uma conta?{' '}
            <a href="/register" className="form-link">
              Cadastre-se aqui
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginFormMinimal;