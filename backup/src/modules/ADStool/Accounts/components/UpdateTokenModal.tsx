import React, { useCallback } from 'react';
import { useForm } from '@inertiajs/react';
import { route } from 'ziggy-js';
import { toast } from 'sonner';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import InputError from '@/components/ui/InputError';
import InputLabel from '@/components/ui/InputLabel';
import Modal from '@/components/ui/Modal';
const UpdateTokenModal = ({ isOpen, onClose, onSuccess, account }) => {
  const { data, setData, put, processing, errors, reset } = useForm({ access_token: '' });
  const handleSubmit = useCallback(
    (e) => {
      e.preventDefault();
      if (!account || !data.access_token) {
        toast.error('The new access token is required.');
        return;
        }
      put(route('api.adstool.accounts.update', account.id), {
        onSuccess: () => {
          toast.success('Token updated successfully!');
          reset();
          onSuccess?.();
          onClose?.();
        },
        onError: () => {
          toast.error('An error occurred while updating the token. Please try again.');
        },
      });
    },
    [account, data.access_token, onClose, onSuccess, put, reset],
  );
  return (
    <Modal open={isOpen} onClose={onClose}>
      <Card>
        <Card.Header>
          <Card.Title>Update Access Token for {account?.name}</Card.Title>
        </Card.Header>
        <form onSubmit={handleSubmit}>
          <Card.Content>
            <InputLabel htmlFor="access_token">Access Token</InputLabel>
            <Input
              id="access_token"
              name="access_token"
              type="text"
              value={data.access_token}
              onChange={(e) => setData('access_token', e.target.value)}
              required
            />
            {errors?.access_token && <InputError text={errors.access_token} />}
          </Card.Content>
          <Card.Footer>
            <Button type="button" variant="outline" onClick={onClose} disabled={processing}>
              Cancelar
            </Button>
            <Button type="submit" loading={processing}>
              {processing ? 'Updating...' : 'Update Token'}
            </Button>
          </Card.Footer>
        </form>
      </Card>
    </Modal>
  );
};
export default UpdateTokenModal;
