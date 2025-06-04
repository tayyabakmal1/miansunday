<?php

namespace SalesPulse\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Routing\Controller;
use SalesPulse\Models\Analytics;
use Illuminate\Support\Carbon;

class SalesPulseAnalyticsApiController extends Controller
{
    public function store(Request $request)
    {
        $data = $request->validate([
            'notification_id' => 'nullable|integer',
            'event_type' => 'required|string|in:impression,click,dismiss',
        ]);

        Analytics::create([
            'notification_id' => $data['notification_id'] ?? null,
            'event_type' => $data['event_type'],
            'event_time' => Carbon::now(),
        ]);

        return response()->json(['success' => true]);
    }
} 