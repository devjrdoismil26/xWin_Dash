import React from 'react';
import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/AppLayout';
export default function ProfileShow({ auth }) {
    return (
        <AppLayout
            title="Perfil"
            subtitle="Visualizar informações do perfil"
        >
            <Head title="Perfil - xWin Dash" />
            <div className="max-w-4xl mx-auto">
                <div className="bg-white shadow rounded-lg">
                    <div className="px-4 py-5 sm:p-6">
                        <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                            Informações do Perfil
                        </h3>
                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Nome
                                </label>
                                <div className="mt-1 text-sm text-gray-900">
                                    {auth.user?.name || 'Não informado'}
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Email
                                </label>
                                <div className="mt-1 text-sm text-gray-900">
                                    {auth.user?.email || 'Não informado'}
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Status
                                </label>
                                <div className="mt-1">
                                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                        auth.user?.is_active 
                                            ? 'bg-green-100 text-green-800' 
                                            : 'bg-red-100 text-red-800'
                                    }`}>
                                        {auth.user?.is_active ? 'Ativo' : 'Inativo'}
                                    </span>
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    ID do Usuário
                                </label>
                                <div className="mt-1 text-sm text-gray-900 font-mono">
                                    {auth.user?.id || 'Não disponível'}
                                </div>
                            </div>
                        </div>
                        <div className="mt-6">
                            <a
                                href="/profile/edit"
                                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            >
                                Editar Perfil
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
