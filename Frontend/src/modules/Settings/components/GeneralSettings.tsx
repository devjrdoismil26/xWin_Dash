import React from 'react';
import { Globe, Palette, Clock, Database } from 'lucide-react';

export const GeneralSettings: React.FC = () => {
  const options = [
    { icon: Globe, label: 'Idioma', value: 'Português (BR)' },
    { icon: Palette, label: 'Tema', value: 'Claro' },
    { icon: Clock, label: 'Fuso Horário', value: 'America/Sao_Paulo' },
    { icon: Database, label: 'Cache', value: 'Ativado' }
  ];

  return (
            <div className=" ">$2</div><h2 className="text-2xl font-bold mb-6">Configurações Gerais</h2>
      <div className="{options.map((option: unknown, i: unknown) => (">$2</div>
          <div key={i} className="p-4 flex items-center justify-between hover:bg-gray-50">
           
        </div><div className=" ">$2</div><option.icon className="w-5 h-5 text-gray-600" />
              <span className="font-medium">{option.label}</span></div><span className="text-gray-600">{option.value}</span>
      </div>
    </>
  ))}
      </div>);};

export default GeneralSettings;
