<?php

namespace App\Domains\Projects\Models;

/*
 * Alias for LeadCaptureFormModel for PHPStan compatibility
 *
 * @see \App\Domains\Projects\Infrastructure\Persistence\Eloquent\LeadCaptureFormModel
 */
class_alias(
    \App\Domains\Projects\Infrastructure\Persistence\Eloquent\LeadCaptureFormModel::class,
    \App\Domains\Projects\Models\LeadCaptureForm::class,
);

// Re-export the class for type hinting
if (false) {
    /**
     * @extends \App\Domains\Projects\Infrastructure\Persistence\Eloquent\LeadCaptureFormModel
     */
    class LeadCaptureForm extends \App\Domains\Projects\Infrastructure\Persistence\Eloquent\LeadCaptureFormModel
    {
        // This class exists only for IDE and static analysis support
    }
}
