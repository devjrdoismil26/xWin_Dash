import React, { useEffect, useState, useCallback } from 'react';
import { Head } from '@inertiajs/react';
import { toast } from 'sonner';
import UserPreferencesForm from './components/UserPreferencesForm.tsx';
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout';
interface PreferencesProps {
  auth: {
    user: any;
  };
  preferences: any;
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
    <AuthenticatedLayout user={auth.user}>
      <Head title="Preferências" />
      <div className="py-12">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
            <div className="p-6 text-gray-900">
              <div className="mb-6">
                <h1 className="text-2xl font-semibold text-gray-900">
                  Preferências
                </h1>
                <p className="mt-2 text-sm text-gray-600">
                  Gerencie suas preferências de conta e personalização.
                </p>
              </div>
              <UserPreferencesForm 
                preferences={preferences}
                onUpdate={handlePreferenceUpdate}
                loading={loading}
              />
            </div>
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
});
export default Preferences;
