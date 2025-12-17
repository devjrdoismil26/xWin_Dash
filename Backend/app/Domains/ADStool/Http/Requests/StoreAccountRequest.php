<?php

namespace App\Domains\ADStool\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;

class StoreAccountRequest extends FormRequest
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
            'platform' => 'required|string|in:facebook,google',
            'platform_account_id' => 'required|string|max:255',
            // O unique aqui garante que o usuário não cadastre a mesma conta duas vezes
            'unique_account' => 'unique:adstool_accounts,platform_account_id,NULL,id,user_id,' . Auth::id(),
        ];
    }

    /**
     * Prepare the data for validation.
     */
    protected function prepareForValidation()
    {
        $this->merge([
            // Campo virtual para a regra de validação unique composta
            'unique_account' => $this->input('platform_account_id'),
        ]);
    }
}
