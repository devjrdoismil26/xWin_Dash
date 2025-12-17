<?php

namespace App\Domains\Leads\Contracts;

use App\Domains\Leads\Domain\Segment; // Supondo que a entidade de domínio exista
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

interface SegmentServiceInterface
{
    /**
     * Cria um novo Segmento.
     *
     * @param array $data
     *
     * @return Segment
     */
    public function createSegment(array $data): Segment;

    /**
     * Obtém um Segmento pelo seu ID.
     *
     * @param int $id
     *
     * @return Segment|null
     */
    public function getSegmentById(int $id): ?Segment;

    /**
     * Atualiza um Segmento existente.
     *
     * @param int   $id
     * @param array $data
     *
     * @return Segment
     */
    public function updateSegment(int $id, array $data): Segment;

    /**
     * Deleta um Segmento pelo seu ID.
     *
     * @param int $id
     *
     * @return bool
     */
    public function deleteSegment(int $id): bool;

    /**
     * Retorna todos os Segmentos paginados para um usuário.
     *
     * @param int $userId
     * @param int $perPage
     *
     * @return LengthAwarePaginator
     */
    public function getAllSegments(int $userId, int $perPage = 15): LengthAwarePaginator;

    /**
     * Avalia as regras de um segmento e retorna os Leads correspondentes.
     *
     * @param Segment $segment
     *
     * @return array<Lead>
     */
    public function evaluateSegmentRules(Segment $segment): array;
}
