<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Services\BookingService;

class BookingController extends Controller
{
    protected $service;

    public function __construct(BookingService $service)
    {
        $this->service = $service;
    }

    public function store(Request $req)
    {
        $data = $req->validate([
            'property_id' => 'required|integer',
            'start_date' => 'required|date',
            'end_date' => 'required|date'
        ]);

        $data['user_id'] = $req->user_id;

        $booking = $this->service->create($data);

        return response()->json($booking, 201);
    }

    public function index(Request $req)
    {
        return response()->json(
            $this->service->list($req->user_id)
        );
    }

    public function show(Request $req, $id)
    {
        return response()->json(
            $this->service->detail($req->user_id, $id)
        );
    }

    public function destroy(Request $req, $id)
    {
        $this->service->delete($req->user_id, $id);

        return response()->json([], 204);
    }
}