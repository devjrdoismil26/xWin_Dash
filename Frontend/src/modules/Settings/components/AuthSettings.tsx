import React from 'react';
import { Shield, Key, Users, Lock } from 'lucide-react';

export const AuthSettings: React.FC = () => {
  const settings = [
    { icon: Shield, label: '2FA', value: 'Ativado', color: 'green' },
    { icon: Key, label: 'API Keys', value: '3 ativas', color: 'blue' },
    { icon: Users, label: 'Sessões', value: '2 ativas', color: 'purple' },
    { icon: Lock, label: 'Senha', value: 'Atualizada há 30 dias', color: 'gray' }
  ];

  return (
            <div className=" ">$2</div><h2 className="text-2xl font-bold mb-6">Configurações de Autenticação</h2>
      <div className="{settings.map((setting: unknown, i: unknown) => (">$2</div>
          <div key={i} className="bg-white p-4 rounded-lg shadow flex items-center justify-between">
           
        </div><div className=" ">$2</div><setting.icon className={`w-6 h-6 text-${setting.color} -500`} / />
              <div>
           
        </div><p className="font-semibold">{setting.label}</p>
                <p className="text-sm text-gray-600">{setting.value}</p></div><button className="btn btn-sm btn-secondary">Configurar</button>
      </div>
    </>
  ))}
      </div>);};

export default AuthSettings;
