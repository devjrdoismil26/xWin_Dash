<?php

namespace App\Domains\ADStool\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;

class CreateReportRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        return Auth::check();
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, mixed>
     */
    public function rules()
    {
        return [
            'name' => 'required|string|max:255',
            'report_type' => 'required|string|in:campaign_performance,account_summary',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after_or_equal:start_date',
            'campaign_ids' => 'nullable|array',
            'campaign_ids.*' => 'integer|exists:adstool_campaigns,id',
            'account_ids' => 'nullable|array',
            'account_ids.*' => 'integer|exists:adstool_accounts,id',
        ];
    }
}
