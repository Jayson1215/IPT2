<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ProfileController;

// Home route (name displayed only)
Route::get('/home', function () {
    return view('home'); 
});

// Profile Manager (React UI)
Route::get('/profile', function () {
    return view('profile'); // profile.blade.php mounts profile.js
});

// Profile API
Route::get('/profiles', [ProfileController::class, 'index']);
Route::post('/profiles', [ProfileController::class, 'store']);
Route::put('/profiles/{id}', [ProfileController::class, 'update']);
Route::delete('/profiles/{id}', [ProfileController::class, 'destroy']);
