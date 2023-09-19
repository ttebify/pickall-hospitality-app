<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UserRegistrationRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules()
    {
        return [
            'name'=>['required', 'string', ],
            'phone' => ['required', 'string', 'max:16'],
            'email'=>['required', 'string', 'max:255','email', 'unique:users'],
            'password' => ['required',  'min:8', 'max:20', 'confirmed', ],
        ];
    }
}
