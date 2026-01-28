import React from 'react';
import { Head } from '@inertiajs/react';
import DeleteUserForm from './Partials/DeleteUserForm.tsx';
import UpdatePasswordForm from './Partials/UpdatePasswordForm.tsx';
import UpdateProfileInformationForm from './Partials/UpdateProfileInformationForm.tsx';
import PageLayout from '@/layouts/PageLayout';
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout';
import { Grid, GridItem } from '@/components/ui/Grid';
interface EditProps {
  auth: {
    user: any;
  };
  mustVerifyEmail: boolean;
  status?: string;
}
/**
 * Profile edit page component
 *
 * @param props
 * @param props.auth - Authentication data
 * @param props.mustVerifyEmail - Whether email verification is required
 * @param props.status - Status message
 */
const Edit: React.FC<EditProps> = React.memo(function Edit({ auth, mustVerifyEmail, status }) {
  return (
    <AuthenticatedLayout user={auth.user}>
      <Head title="Editar Perfil" />
      <PageLayout 
        title="Editar Perfil"
        description="Gerencie as informações do seu perfil e configurações de segurança."
      >
        <Grid>
          <GridItem>
            <UpdateProfileInformationForm
              mustVerifyEmail={mustVerifyEmail}
              status={status}
              className="max-w-xl"
            />
          </GridItem>
          <GridItem>
            <UpdatePasswordForm className="max-w-xl" />
          </GridItem>
          <GridItem>
            <DeleteUserForm className="max-w-xl" />
          </GridItem>
        </Grid>
      </PageLayout>
    </AuthenticatedLayout>
  );
});
export default Edit;
