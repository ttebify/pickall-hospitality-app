<?php

use App\Http\Controllers\Auth\AuthController;
use App\Http\Controllers\User\ProfileController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

Route::group(['middleware' => ['auth:sanctum']], function () {
    Route::group(['prefix' => 'users'], function () {
        Route::get('/me', [ProfileController::class, 'getCurrentUser'])->name('user.profile');
        Route::post('/update-profile', [ProfileController::class, 'updateProfile'])->name('user.update-profile');
        Route::get('/{uuid}', [ProfileController::class, 'getUserProfile'])->name('user.get-profile');
    });
});
