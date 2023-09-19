<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;

use App\Traits\HttpResponses;
use Dotenv\Exception\ValidationException;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Storage;
use JsonException;

class ProfileController extends Controller
{
    use HttpResponses;

    public function updateProfile(Request $request)
    {
        try {
            $user = $request->user();

            $validatedData = $request->validate([
                'name' => 'string|max:255',
                'phone' => 'string|max:255',
            ]);

            $user->update($validatedData);

            if ($request->hasFile('avatar')) {
                $avatar = $request->file('avatar');

                if ($user->avatar) {
                    Storage::disk('public')->delete($user->avatar);
                }

                $avatarPath = $avatar->store('avatars', 'public');
                $user->avatar = $avatarPath;
                $user->save();
            }

            activity()->log($user->name . ' updated their profile');

            return $this->success($user, 'Profile updated successfully');
        } catch (ValidationException $e) {
            throw $e;
        } catch (JsonException $e) {
            logger($e, $e->getTrace());

            return $this->error(null, 'Failed to update profile', Response::HTTP_BAD_REQUEST);
        }
    }
}
