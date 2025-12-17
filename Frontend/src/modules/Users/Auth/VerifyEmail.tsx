import React from 'react';
import { Head, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout';
import Card from '@/shared/components/ui/Card';
import Button from '@/shared/components/ui/Button';

interface VerifyEmailProps {
  auth?: { user?: { id: string;
  name: string;
  email: string;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  onClick?: (e: any) => void;
  onChange?: (e: any) => void; };};

}

const VerifyEmail: React.FC<VerifyEmailProps> = ({ auth    }) => { return (
        <>
      <AuthenticatedLayout user={auth?.user } />
      <Head title="Verificar email" / />
      <div className=" ">$2</div><div className=" ">$2</div><div>
           
        </div><h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900" />
              Verificar email
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600" />
              Verifique sua caixa de entrada para o link de verificação
            </p></div><Card />
            <Card.Content className="p-6 text-center" />
              <div className=" ">$2</div><p className="text-gray-600" />
                  Enviamos um link de verificação para seu email. 
                  Clique no link para verificar sua conta.
                </p>
                
                <div className=" ">$2</div><Button asChild className="w-full" />
                    <Link href="/login">Voltar ao login</Link></Button><Button variant="outline" asChild className="w-full" />
                    <Link href="/register">Criar nova conta</Link></Button></div>
            </Card.Content></Card></div>
    </AuthenticatedLayout>);};

export default VerifyEmail;