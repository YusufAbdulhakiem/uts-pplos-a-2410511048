<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use App\Models\Booking;

class BookingController extends Controller
{
    
public function store(Request $req)
{
    try {
        // validasi
        $req->validate([
            'property_id' => 'required|integer',
            'booking_date' => 'required|date'
        ]);

        $userId = $req->header('x-user-id');
        $token = $req->headers->get('authorization');

        if (!$userId || !$token) {
            return response()->json([
                'error' => 'Unauthorized',
                'user_id' => $userId,
                'token' => $token
            ], 401);
        }

        // cek property via gateway
        $property = Http::withHeaders([
            'Authorization' => $token
        ])->get('http://localhost:3000/properties/' . $req->property_id);

        if ($property->status() !== 200) {
            return response()->json([
                'error' => 'Property check failed',
                'status' => $property->status(),
                'body' => $property->body()
            ], 400);
        }

        // simpan booking
        $booking = Booking::create([
            'user_id' => $userId,
            'property_id' => $req->property_id,
            'booking_date' => $req->booking_date,
            'status' => 'pending'
        ]);

        return response()->json($booking, 201);

    } catch (\Throwable $e) {
        return response()->json([
            'error' => $e->getMessage(),
            'line' => $e->getLine(),
            'file' => $e->getFile()
        ], 500);
    }
}

    public function index(Request $req)
    {
        $userId = $req->header('x-user-id');

        if (!$userId) {
            return response()->json(['msg' => 'Unauthorized'], 401);
        }

        return Booking::where('user_id', $userId)->paginate(5);
    }

    public function show($id, Request $req)
    {
        $userId = $req->header('x-user-id');

        $data = Booking::where('id', $id)
            ->where('user_id', $userId)
            ->first();

        if (!$data) return response()->json(['msg' => 'Not found'], 404);

        return response()->json($data);
    }

    public function update($id, Request $req)
    {
        $userId = $req->header('x-user-id');

        $booking = Booking::where('id', $id)
            ->where('user_id', $userId)
            ->first();

        if (!$booking) return response()->json(['msg' => 'Not found'], 404);

        $booking->update([
            'status' => $req->status
        ]);

        return response()->json($booking);
    }

    public function destroy($id, Request $req)
    {
        $userId = $req->header('x-user-id');

        $booking = Booking::where('id', $id)
            ->where('user_id', $userId)
            ->first();

        if (!$booking) return response()->json(['msg' => 'Not found'], 404);

        $booking->delete();

        return response()->json(null, 204);
    }
}