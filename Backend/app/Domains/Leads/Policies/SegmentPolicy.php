<?php

namespace App\Domains\Leads\Policies;

use App\Domains\Leads\Domain\Segment;
use App\Models\User; // Supondo que a entidade de domínio exista
use Illuminate\Auth\Access\HandlesAuthorization;

class SegmentPolicy
{
    use HandlesAuthorization;

    /**
     * Determine whether the user can view any segments.
     *
     * @param \App\Models\User $user
     *
     * @return \Illuminate\Auth\Access\Response|bool
     */
    public function viewAny(User $user)
    {
        return true; // Qualquer usuário autenticado pode ver segmentos que ele tem acesso
    }

    /**
     * Determine whether the user can view the segment.
     *
     * @param \App\Models\User $user
     * @param Segment          $segment
     *
     * @return \Illuminate\Auth\Access\Response|bool
     */
    public function view(User $user, Segment $segment)
    {
        return $user->id === $segment->userId; // Exemplo: o usuário pode ver o segmento se ele for o criador
    }

    /**
     * Determine whether the user can create segments.
     *
     * @param \App\Models\User $user
     *
     * @return \Illuminate\Auth\Access\Response|bool
     */
    public function create(User $user)
    {
        return true; // Qualquer usuário autenticado pode criar segmentos
    }

    /**
     * Determine whether the user can update the segment.
     *
     * @param \App\Models\User $user
     * @param Segment          $segment
     *
     * @return \Illuminate\Auth\Access\Response|bool
     */
    public function update(User $user, Segment $segment)
    {
        return $user->id === $segment->userId;
    }

    /**
     * Determine whether the user can delete the segment.
     *
     * @param \App\Models\User $user
     * @param Segment          $segment
     *
     * @return \Illuminate\Auth\Access\Response|bool
     */
    public function delete(User $user, Segment $segment)
    {
        return $user->id === $segment->userId;
    }
}
