<?php

namespace App\Domains\Users\Domain;

class User
{
    public ?string $id;

    public string $name;

    public string $email;

    public ?string $emailVerifiedAt;

    public ?string $password;

    public string $status;

    public string $role;

    public ?\DateTime $createdAt;

    public ?\DateTime $updatedAt;

    public function __construct(
        string $name,
        string $email,
        ?string $password,
        string $status = 'active',
        string $role = 'member',
        ?string $emailVerifiedAt = null,
        ?string $id = null,
        ?\DateTime $createdAt = null,
        ?\DateTime $updatedAt = null,
    ) {
        $this->id = $id;
        $this->name = $name;
        $this->email = $email;
        $this->emailVerifiedAt = $emailVerifiedAt;
        $this->password = $password;
        $this->status = $status;
        $this->role = $role;
        $this->createdAt = $createdAt;
        $this->updatedAt = $updatedAt;
    }

    /**
     * Cria uma instância da entidade a partir de um array de dados (ex: vindo do repositório).
     *
     * @param array<string, mixed> $data
     *
     * @return self
     */
    public static function fromArray(array $data): self
    {
        return new self(
            $data['name'] ?? '',
            $data['email'] ?? '',
            $data['password'] ?? null,
            $data['status'] ?? 'active',
            $data['role'] ?? 'member',
            $data['email_verified_at'] ?? null,
            $data['id'] ?? null,
            isset($data['created_at']) ? new \DateTime($data['created_at']) : null,
            isset($data['updated_at']) ? new \DateTime($data['updated_at']) : null,
        );
    }

    /**
     * Converte a entidade para um array.
     *
     * @return array{id:int|null,name:string,email:string,email_verified_at:string|null,password:string,status:string,role:string,created_at:string|null,updated_at:string|null}
     */
    public function toArray(): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'email' => $this->email,
            'email_verified_at' => $this->emailVerifiedAt,
            'password' => $this->password,
            'status' => $this->status,
            'role' => $this->role,
            'created_at' => $this->createdAt ? $this->createdAt->format('Y-m-d H:i:s') : null,
            'updated_at' => $this->updatedAt ? $this->updatedAt->format('Y-m-d H:i:s') : null,
        ];
    }

    /**
     * Verifica se o usuário é um administrador.
     *
     * @return bool
     */
    public function isAdmin(): bool
    {
        return $this->role === 'admin';
    }
}
