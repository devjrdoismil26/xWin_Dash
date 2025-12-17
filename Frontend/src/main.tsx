/**
 * Ponto de Entrada da Aplicação - main.tsx
 *
 * @description
 * Arquivo principal de inicialização da aplicação Inertia.js.
 * Configura o roteamento, resolve componentes e inicializa a aplicação React.
 *
 * @module main
 * @since 1.0.0
 */

import React from "react";
import { createInertiaApp } from '@inertiajs/react';
import { createRoot } from 'react-dom/client';
import { ResponsiveProvider } from '@/shared/components/ui/ResponsiveSystem';

// =========================================
// BOOTSTRAP - Configurações Globais
// =========================================
// Importa configurações de axios, Echo e Socket.io
// Nota: bootstrap.js está na raiz do Frontend, então usamos caminho relativo
import "../../bootstrap.js";

// =========================================
// IMPORTAÇÕES DE COMPONENTES
// =========================================

// Componente de fallback para páginas não encontradas
import PageNotFound from "@/shared/components/ErrorBoundary/PageNotFound";

// =========================================
// CONFIGURAÇÃO DA APLICAÇÃO
// =========================================

/**
 * Nome da aplicação
 *
 * @constant
 * @type {string}
 */
const appName = import.meta.env.VITE_APP_NAME || "xWin_Dash";

/**
 * Carregamento dinâmico de páginas (Vite Glob Import)
 *
 * @description
 * Importa dinamicamente todos os componentes de página (.tsx) dentro da pasta `./modules`.
 * Isso elimina a necessidade de um `componentMap` manual e de importações estáticas.
 *
 * @see https://vitejs.dev/guide/features.html#glob-import
 *
 * @type {Record<string, () => Promise<{ default: React.ComponentType }>>}
 */
const pages = import.meta.glob("./modules/**/*.tsx");

/**
 * Inicializa a aplicação Inertia.js
 *
 * @description
 * Configura e inicializa a aplicação Inertia.js com:
 * - Resolução de componentes por nome de rota de forma dinâmica
 * - Configuração de título dinâmico
 * - Setup do React Root com ResponsiveProvider
 * - Barra de progresso para navegação
 */
createInertiaApp({
  /**
   * Função para formatar título da página
   *
   * @param {string} [title] - Título da página (opcional)
   * @returns {string} Título formatado com nome da aplicação
   */
  title: (title?: string): string => {
    return title ? `${title} - ${appName}` : appName;
  },

  /**
   * Função para resolver componentes por nome de rota (dinamicamente)
   *
   * @description
   * Resolve componentes React a partir do nome da rota do Inertia de forma assíncrona.
   * Procura por um arquivo `.tsx` correspondente dentro da pasta `modules`.
   * Retorna PageNotFound como fallback se o componente não for encontrado.
   *
   * @param {string} name - Nome da rota do Inertia (ex: 'Users/Auth/Login')
   * @returns {Promise<React.ComponentType>} Componente React correspondente
   */
  resolve: async (name: string): Promise<React.ComponentType> => {
    const path = `./modules/${name}.tsx`;
    const pageResolver = pages[path];

    if (pageResolver) {
      const module = await pageResolver() as { default: React.ComponentType};

      const page = module.default;
      return page;
    }

    // Fallback para página não encontrada
    if (import.meta.env.DEV) {
      console.warn(`⚠️ Página não encontrada: ${name}, usando fallback.`);

    }
    return PageNotFound;
  },

  /**
   * Função de setup para inicializar React Root
   *
   * @description
   * Cria o React Root e renderiza a aplicação com ResponsiveProvider
   * para gerenciar responsividade globalmente.
   *
   * @param {Object} options - Opções de setup
   * @param {HTMLElement} options.el - Elemento DOM onde renderizar
   * @param {React.ComponentType} options.App - Componente App do Inertia
   * @param {Record<string, any>} options.props - Props iniciais do Inertia
   */
  setup({ el, App, props }): void {
    const root = createRoot(el);

    root.render(
      <ResponsiveProvider>
        <App {...props} />
      </ResponsiveProvider>
    );

  },

  /**
   * Configuração da barra de progresso
   *
   * @description
   * Configura a barra de progresso exibida durante navegação do Inertia.
   */
  progress: {
    color: "#4B5563",
    showSpinner: true,
  },
});
