<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\UserLoginRequest;
use App\Http\Requests\UserRegistrationRequest;
use App\Models\User;
use App\Traits\HttpResponses;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use JsonException;

class AuthController extends Controller
{
    use HttpResponses;

    public function register(UserRegistrationRequest $request)
    {
        try {

            $request->validated($request->all());

            $user = User::create([
                'name' => $request->name,
                'phone' => $request->phone,
                'email' => $request->email,
                'password' => Hash::make($request->password),
            ]);

            activity()->log($request['email'] . ' just registered');

            return $this->respond([
                'user' => $user,
                'token' => $user->createToken('API Token of ' . $user->name)->plainTextToken
            ]);
        } catch (JsonException $e) {
            logger($e, $e->getTrace());

            return $this->respondError('Failed to create a new account', Response::HTTP_BAD_REQUEST);
        }
    }

    public function login(UserLoginRequest $request)
    {
        try {
            $request->validated($request->all());

            if (!Auth::attempt($request->only('email', 'password'))) {
                return $this->error('', 'Credentials do not match', 401);
            }

            $user = User::where('email', $request->email)->first();

            activity()->log($user->email . ' just logged in');

            return $this->respond([
                'user' => $user,
                'token' => $user->createToken('API Token of ' . $user->name)->plainTextToken
            ]);
        } catch (JsonException $e) {
            logger($e, $e->getTrace());

            return $this->respondError('Failed to login', Response::HTTP_BAD_REQUEST);
        }
    }
}
