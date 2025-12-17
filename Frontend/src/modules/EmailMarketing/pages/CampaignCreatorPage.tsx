/**
 * Página de Criador Avançado de Email Marketing
 *
 * @description
 * Página para criação avançada de emails com editor HTML.
 * Permite editar HTML diretamente e visualizar preview em tempo real.
 *
 * @module modules/EmailMarketing/pages/AdvancedCreator
 * @since 1.0.0
 */

import React, { useState } from 'react';

/**
 * Componente AdvancedCreator
 *
 * @description
 * Renderiza página de criador avançado de emails com editor HTML e preview.
 * Permite editar HTML diretamente e visualizar resultado em tempo real.
 *
 * @returns {JSX.Element} Página de criador avançado
 */
const AdvancedCreator = () => {
  const [content, setContent] = useState('');

  return (
            <div className=" ">$2</div><h1 className="text-xl font-semibold">Criador Avançado</h1>
      <textarea
        className="w-full border rounded p-2 min-h-[240px]"
        placeholder="HTML do email"
        value={ content }
        onChange={ (e: unknown) => setContent(e.target.value) } />
      <div className=" ">$2</div><div className="prose max-w-none" dangerouslySetInnerHTML={ __html: content } / />
           
        </div></div>);};

export default AdvancedCreator;
