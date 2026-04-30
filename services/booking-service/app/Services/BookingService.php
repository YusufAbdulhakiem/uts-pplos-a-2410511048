<?php

namespace App\Services;

use App\Models\Booking;
use Illuminate\Support\Facades\Http;

class BookingService
{
    public function create($data)
    {
        // 🔥 VALIDASI PROPERTY KE PROPERTY SERVICE
        $res = Http::get(env('PROPERTY_SERVICE_URL') . '/properties/' . $data['property_id'], [
            'headers' => [
                'x-user-id' => $data['user_id']
            ]
        ]);

        if ($res->status() !== 200) {
            throw new \Exception('Property tidak valid');
        }

        return Booking::create($data);
    }

    public function list($userId)
    {
        return Booking::where('user_id', $userId)->get();
    }

    public function detail($userId, $id)
    {
        return Booking::where('id', $id)
            ->where('user_id', $userId)
            ->firstOrFail();
    }

    public function delete($userId, $id)
    {
        $booking = Booking::where('id', $id)
            ->where('user_id', $userId)
            ->firstOrFail();

        $booking->delete();
    }
}