<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;

use App\Traits\HttpResponses;
use Dotenv\Exception\ValidationException;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use JsonException;

class ProfileController extends Controller
{
    use HttpResponses;

    public function getCurrentUser()
    {
        $user = Auth::user();

        return $this->respond($user);
    }

    public function updateProfile(Request $request)
    {
        try {
            $user = $request->user();
            $input = $request->all();

            $user->fill(Arr::only($input, ['name', 'email', 'phone', 'password']));
            $user->save();

            activity()->log($user->name . ' updated their profile');

            return $this->respond($user);
        } catch (ValidationException $e) {
            throw $e;
        } catch (JsonException $e) {
            logger($e, $e->getTrace());

            return $this->respondError('Failed to update profile', Response::HTTP_BAD_REQUEST);
        }
    }
}
