import React, { useState } from 'react';
const AdvancedCreator = () => {
  const [content, setContent] = useState('');
  return (
    <div className="p-6 space-y-4">
      <h1 className="text-xl font-semibold">Criador Avançado</h1>
      <textarea
        className="w-full border rounded p-2 min-h-[240px]"
        placeholder="HTML do email"
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />
      <div className="border rounded p-4 bg-white">
        <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: content }} />
      </div>
    </div>
  );
};
export default AdvancedCreator;
