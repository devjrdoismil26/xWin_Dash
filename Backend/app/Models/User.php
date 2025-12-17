<?php

namespace App\Models;

// Importa o Model real do Domínio Users.
// Esta é a implementação central da arquitetura DDD (Domain-Driven Design) do projeto.
use App\Domains\Users\Infrastructure\Persistence\Eloquent\UserModel;

/**
 * Global User Model Alias (Apelido Global para o Model User)
 *
 * Este arquivo serve como um "alias" estável para o Model de usuário real, que reside em seu próprio domínio.
 * Esta abordagem é usada para manter a compatibilidade com partes do framework Laravel
 * e outros pacotes externos que esperam que um Model User exista no local padrão App\Models\User.
 *
 * Ao estender o UserModel do domínio, garantimos que qualquer código que faça referência a App\Models\User
 * obtenha a implementação completa e correta, incluindo todos os relacionamentos, escopos e lógica de negócios.
 *
 * A implementação anterior usava uma verificação condicional `class_exists()`, que não era confiável
 * durante o processo de inicialização da aplicação e fazia com que um "fallback" para uma classe User básica fosse usado.
 * Isso resultava em erros fatais. Esta nova versão é um alias direto e incondicional, que é mais robusto e
 * confia no autoloader do Composer para funcionar corretamente.
 */
class User extends UserModel
{
    /**
     * Método auxiliar para confirmar que esta é a instância do model de alias global.
     * Pode ser útil para depuração para distingui-lo do UserModel base.
     *
     * @return bool
     */
    public function isGlobalUserModel(): bool
    {
        return true;
    }

    /*
    |--------------------------------------------------------------------------
    | Métodos de Ajuda para IDE / Análise Estática (Shims)
    |--------------------------------------------------------------------------
    |
    | Estes métodos são "shims" que ajudam IDEs e ferramentas de análise estática como
    | o PHPStan a entender que esta classe possui métodos de Traits usados no
    | UserModel pai (como o HasRoles do Spatie). Eles simplesmente chamam o método
    | pai e não contêm nenhuma lógica nova. Isso melhora a
    | experiência do desenvolvedor com melhor autocompletar e menos ruído na análise estática.
    |
    */

    /**
     * Shim para a IDE/PHPStan reconhecer o método assignRole da trait Spatie/Permission.
     * @param mixed ...$roles
     * @return static
     */
    public function assignRole(...$roles): static
    {
        return parent::assignRole(...$roles);
    }

    /**
     * Shim para a IDE/PHPStan reconhecer o método removeRole da trait Spatie/Permission.
     * @param mixed $role
     * @return static
     */
    public function removeRole($role): static
    {
        return parent::removeRole($role);
    }
}
