<?php

namespace App\Http\Controllers;

use App\Models\Profile;
use Illuminate\Http\Request;

class ProfileController extends Controller
{
    public function index()
    {
        return response()->json(Profile::all());
    }

    public function store(Request $request)
    {
        $profile = Profile::create($request->only(['name', 'email', 'bio']));
        return response()->json($profile);
    }

    public function update(Request $request, $id)
    {
        $profile = Profile::findOrFail($id);
        $profile->update($request->only(['name', 'email', 'bio']));
        return response()->json($profile);
    }

    public function destroy($id)
    {
        Profile::destroy($id);
        return response()->json(['message' => 'Deleted successfully']);
    }
}
