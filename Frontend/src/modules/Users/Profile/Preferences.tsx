import React, { useEffect, useState, useCallback } from 'react';
import { Head } from '@inertiajs/react';
import { toast } from 'sonner';
import UserPreferencesForm from './components/UserPreferencesForm';
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout';
interface PreferencesProps {
  auth: {
user: unknown;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  onClick?: (e: any) => void;
  onChange?: (e: any) => void; };

  preferences: Record<string, any>;
}
const Preferences: React.FC<PreferencesProps> = React.memo(function Preferences({ auth, preferences }) {
  const [loading, setLoading] = useState(false);

  const handlePreferenceUpdate = useCallback(() => {
    setLoading(true);

    // Simulate API call
    setTimeout(() => {
      setLoading(false);

      toast.success('Preferências atualizadas com sucesso!');

    }, 1000);

  }, []);

  return (
        <>
      <AuthenticatedLayout user={ auth.user } />
      <Head title="Preferências" / />
      <div className=" ">$2</div><div className=" ">$2</div><div className=" ">$2</div><div className=" ">$2</div><div className=" ">$2</div><h1 className="text-2xl font-semibold text-gray-900" />
                  Preferências
                </h1>
                <p className="mt-2 text-sm text-gray-600" />
                  Gerencie suas preferências de conta e personalização.
                </p></div><UserPreferencesForm 
                preferences={ preferences }
                onUpdate={ handlePreferenceUpdate }
                loading={ loading }
              / /></div></div>
    </AuthenticatedLayout>);

});

export default Preferences;
