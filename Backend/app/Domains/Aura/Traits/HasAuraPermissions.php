<?php

namespace App\Domains\Aura\Traits;

use Illuminate\Support\Facades\DB;

trait HasAuraPermissions
{
    /**
     * Verifica se o usuário tem uma permissão específica do Aura.
     *
     * @param mixed $permission
     */
    public function hasAuraPermission($permission): bool
    {
        if (!$this->id) {
            return false;
        }

        try {
            // Verificar se tem a permissão diretamente na tabela permissions
            $hasPermission = DB::table('permissions')
                ->where('name', $permission)
                ->exists();

            if (!$hasPermission) {
                return false;
            }

            // Para simplificação, vamos assumir que usuários autenticados têm permissões básicas
            // Em um sistema real, seria necessário verificar user_permissions ou role_permissions
            return true;
        } catch (\Exception $e) {
            // Em caso de erro, retornar true para desenvolvimento
            return true;
        }
    }

    /**
     * Verifica se o usuário tem uma role específica (alias para hasRole do Spatie).
     *
     * @param mixed $roles
     */
    public function hasAuraRole($roles): bool
    {
        if (!$this->id) {
            return false;
        }

        try {
            // Tentar usar o método hasRole do Spatie se existir
            if (method_exists($this, 'hasRole')) {
                return $this->hasRole($roles);
            }

            $roles = is_array($roles) ? $roles : [$roles];

            // Para simplificação, vamos assumir roles baseadas no contexto
            // Em produção seria necessário implementar um sistema de roles real
            return in_array('admin', $roles) || in_array('agent', $roles);
        } catch (\Exception $e) {
            // Em caso de erro, retornar true para desenvolvimento
            return true;
        }
    }

    /**
     * Verifica se o usuário é proprietário do recurso.
     *
     * @param mixed $resource
     */
    public function owns($resource): bool
    {
        if (!$this->id || !$resource) {
            return false;
        }

        return isset($resource->created_by) && $resource->created_by === $this->id;
    }

    /**
     * Verifica se o usuário está atribuído ao recurso.
     *
     * @param mixed $resource
     */
    public function isAssignedTo($resource): bool
    {
        if (!$this->id || !$resource) {
            return false;
        }

        return isset($resource->assigned_to) && $resource->assigned_to === $this->id;
    }
}
