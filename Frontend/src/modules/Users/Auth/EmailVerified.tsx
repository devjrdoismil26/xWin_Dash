import React from 'react';
import { Head, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout';
import Card from '@/shared/components/ui/Card';
import Button from '@/shared/components/ui/Button';

interface EmailVerifiedProps {
  auth?: { user?: { id: string;
  name: string;
  email: string;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  onClick?: (e: any) => void;
  onChange?: (e: any) => void; };};

}

const EmailVerified: React.FC<EmailVerifiedProps> = ({ auth    }) => { return (
        <>
      <AuthenticatedLayout user={auth?.user } />
      <Head title="Email verificado" / />
      <div className=" ">$2</div><div className=" ">$2</div><div>
           
        </div><h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900" />
              Email verificado com sucesso!
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600" />
              Seu email foi verificado e sua conta está ativa.
            </p></div><Card />
            <Card.Content className="p-6 text-center" />
              <div className=" ">$2</div><div className="text-green-600 text-6xl">✓</div>
                <p className="text-gray-600" />
                  Parabéns! Seu email foi verificado com sucesso. 
                  Agora você pode usar todas as funcionalidades da plataforma.
                </p>
                
                <div className=" ">$2</div><Button asChild className="w-full" />
                    <Link href="/dashboard">Ir para o Dashboard</Link></Button><Button variant="outline" asChild className="w-full" />
                    <Link href="/profile">Ver Perfil</Link></Button></div>
            </Card.Content></Card></div>
    </AuthenticatedLayout>);};

export default EmailVerified;