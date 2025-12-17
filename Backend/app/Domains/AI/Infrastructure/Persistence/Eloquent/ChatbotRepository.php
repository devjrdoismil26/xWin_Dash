<?php

namespace App\Domains\AI\Infrastructure\Persistence\Eloquent;

use App\Domains\AI\Domain\ChatbotRepositoryInterface;
use App\Domains\AI\Models\Chatbot as ChatbotModel;
use Illuminate\Database\Eloquent\Collection;

class ChatbotRepository implements ChatbotRepositoryInterface
{
    protected ChatbotModel $model;

    public function __construct(ChatbotModel $model)
    {
        $this->model = $model;
    }

    /**
     * Cria um novo chatbot.
     *
     * @param array $data
     *
     * @return ChatbotModel
     */
    public function create(array $data): ChatbotModel
    {
        return $this->model->create($data);
    }

    /**
     * Atualiza um chatbot existente.
     *
     * @param int   $id
     * @param array $data
     *
     * @return ChatbotModel
     */
    public function update(int $id, array $data): ChatbotModel
    {
        $chatbot = $this->find($id);
        $chatbot->update($data);
        return $chatbot;
    }

    /**
     * Encontra um chatbot pelo seu ID.
     *
     * @param int $id
     *
     * @return ChatbotModel|null
     */
    public function find(int $id): ?ChatbotModel
    {
        return $this->model->find($id);
    }

    /**
     * Retorna todos os chatbots de um usuário.
     *
     * @param int $userId
     *
     * @return Collection
     */
    public function getForUser(int $userId): Collection
    {
        return $this->model->where('user_id', $userId)->get();
    }

    /**
     * Deleta um chatbot.
     *
     * @param int $id
     *
     * @return bool
     */
    public function delete(int $id): bool
    {
        return $this->model->destroy($id);
    }
}
