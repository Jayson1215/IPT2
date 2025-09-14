<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ProfileController;

// API routes for profiles
Route::get('/profiles', [ProfileController::class, 'index']);   // GET all
Route::post('/profiles', [ProfileController::class, 'store']);  // POST new
Route::put('/profiles/{id}', [ProfileController::class, 'update']); // UPDATE
Route::delete('/profiles/{id}', [ProfileController::class, 'destroy']); // DELETE

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});
