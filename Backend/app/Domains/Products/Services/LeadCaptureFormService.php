<?php

namespace App\Domains\Products\Services;

use App\Domains\Products\Domain\LeadCaptureFormRepositoryInterface;

class LeadCaptureFormService
{
    protected $leadCaptureFormRepository;

    public function __construct(LeadCaptureFormRepositoryInterface $leadCaptureFormRepository)
    {
        $this->leadCaptureFormRepository = $leadCaptureFormRepository;
    }

    public function getAllLeadCaptureForms(int $perPage = 15)
    {
        return $this->leadCaptureFormRepository->getAll($perPage);
    }

    public function createLeadCaptureForm(array $data)
    {
        return $this->leadCaptureFormRepository->create($data);
    }

    public function getLeadCaptureFormById(int $id)
    {
        return $this->leadCaptureFormRepository->find($id);
    }

    public function updateLeadCaptureForm(int $id, array $data)
    {
        return $this->leadCaptureFormRepository->update($id, $data);
    }

    public function deleteLeadCaptureForm(int $id)
    {
        return $this->leadCaptureFormRepository->delete($id);
    }
}
