import React from 'react';
import { User, Mail, Lock, Bell } from 'lucide-react';

export const UserSettings: React.FC = () => {
  const sections = [
    { icon: User, title: 'Perfil', description: 'Informações pessoais' },
    { icon: Mail, title: 'Email', description: 'Configurações de email' },
    { icon: Lock, title: 'Segurança', description: 'Senha e autenticação' },
    { icon: Bell, title: 'Notificações', description: 'Preferências de notificação' }
  ];

  return (
            <div className=" ">$2</div><h2 className="text-2xl font-bold mb-6">Configurações de Usuário</h2>
      <div className="{sections.map((section: unknown, i: unknown) => (">$2</div>
          <div key={i} className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition">
           
        </div><section.icon className="w-8 h-8 text-blue-500 mb-3" />
            <h3 className="text-lg font-semibold mb-2">{section.title}</h3>
            <p className="text-gray-600">{section.description}</p>
      </div>
    </>
  ))}
      </div>);};

export default UserSettings;
