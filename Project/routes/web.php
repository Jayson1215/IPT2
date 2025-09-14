<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ProfileController;

Route::get('/home', function () {
    return view('home'); // will just show "Jayson T. Velasco"
});

// Serve the Profile Manager UI (home.js from public folder)
Route::get('/profile-manager', function () {
    return response()->file(public_path('home.js'));
});

// Profile CRUD API routes
Route::get('/profiles', [ProfileController::class, 'index']);
Route::post('/profiles', [ProfileController::class, 'store']);
Route::put('/profiles/{id}', [ProfileController::class, 'update']);
Route::delete('/profiles/{id}', [ProfileController::class, 'destroy']);
