import React, { useState } from 'react';
type EmailSchedulerProps = { auth?: unknown };
const EmailScheduler: React.FC<EmailSchedulerProps> = () => {
  const [open, setOpen] = useState(false);
  return (
    <div className="p-6 space-y-4">
      <h1 className="text-xl font-semibold">Agendamento de Emails</h1>
      <button className="px-3 py-2 rounded bg-blue-600 text-white" onClick={() => setOpen(true)}>Novo agendamento</button>
      {open && (
        <div className="p-4 border rounded">
          <p className="mb-2">Formulário de criação (placeholder)</p>
          <button className="text-sm underline" onClick={() => setOpen(false)}>Fechar</button>
        </div>
      )}
    </div>
  );
};
export default EmailScheduler;
