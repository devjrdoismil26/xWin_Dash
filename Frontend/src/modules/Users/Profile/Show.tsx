import React from 'react';
import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/AppLayout';
export default function ProfileShow({ auth }) {
    return (
        <>
      <AppLayout
            title="Perfil"
            subtitle="Visualizar informações do perfil" />
      <Head title="Perfil - xWin Dash" / />
            <div className=" ">$2</div><div className=" ">$2</div><div className=" ">$2</div><h3 className="text-lg leading-6 font-medium text-gray-900 mb-4" />
                            Informações do Perfil
                        </h3>
                        <div className=" ">$2</div><div>
           
        </div><label className="block text-sm font-medium text-gray-700" />
                                    Nome
                                </label>
                                <div className="{auth.user?.name || 'Não informado'}">$2</div>
                                </div>
                            <div>
           
        </div><label className="block text-sm font-medium text-gray-700" />
                                    Email
                                </label>
                                <div className="{auth.user?.email || 'Não informado'}">$2</div>
                                </div>
                            <div>
           
        </div><label className="block text-sm font-medium text-gray-700" />
                                    Status
                                </label>
                                <div className=" ">$2</div><span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                        auth.user?.is_active 
                                            ? 'bg-green-100 text-green-800' 
                                            : 'bg-red-100 text-red-800'
                                    } `}>
           
        </span>{auth.user?.is_active ? 'Ativo' : 'Inativo'}
                                    </span></div><div>
           
        </div><label className="block text-sm font-medium text-gray-700" />
                                    ID do Usuário
                                </label>
                                <div className="{auth.user?.id || 'Não disponível'}">$2</div>
                                </div></div><div className=" ">$2</div><a
                                href="/profile/edit"
                                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500" />
                                Editar Perfil
                            </a></div></div>
        </AppLayout>);

}
