import React from 'react';
import { Link } from '@inertiajs/react';
import { route } from 'ziggy-js';
import Badge from '@/shared/components/ui/Badge';
import Button from '@/shared/components/ui/Button';
/**
 * Email verification message component
 *
 * @param props
 * @param props.status - Verification status
 */
const VerifyEmailMessage = React.memo(function VerifyEmailMessage({ status }) {
  return (
            <div className=" ">$2</div><div className=" ">$2</div><div className=" ">$2</div><svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" / /></svg></div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2" />
          Verificar E-mail
        </h2>
        <p className="text-gray-600 text-sm leading-relaxed" />
          Obrigado por se cadastrar! Antes de começar, você poderia verificar seu
          endereço de e-mail clicando no link que acabamos de enviar para você?
          Se você não recebeu o e-mail, ficaremos felizes em enviar outro.
        </p>
      </div>
      {status === 'verification-link-sent' && (
        <div className=" ">$2</div><Badge variant="success" className="w-full justify-center p-3" />
            Um novo link de verificação foi enviado para seu e-mail.
          </Badge>
      </div>
    </>
  )}
      <div className=" ">$2</div><Link href={route('verification.send')} method="post" as="button" className="w-full" />
          <Button variant="primary" className="w-full" />
            Reenviar E-mail de Verificação
          </Button></Link><Link href={route('logout')} method="post" as="button" className="w-full" />
          <Button variant="outline" className="w-full" />
            Sair
          </Button></Link></div>
      <div className=" ">$2</div><p className="text-xs text-gray-500" />
          Não recebeu o e-mail? Verifique sua pasta de spam ou lixo eletrônico.
        </p>
      </div>);

});

export default VerifyEmailMessage;
