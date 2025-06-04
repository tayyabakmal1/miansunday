<?php

namespace SalesPulse\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Routing\Controller;
use SalesPulse\Models\Analytics;
use SalesPulse\Models\Notification;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;

class SalesPulseAnalyticsController extends Controller
{
    public function index(Request $request)
    {
        $start = $request->input('start_date');
        $end = $request->input('end_date');

        $analyticsQuery = Analytics::query();
        if ($start) {
            $analyticsQuery->whereDate('event_time', '>=', $start);
        }
        if ($end) {
            $analyticsQuery->whereDate('event_time', '<=', $end);
        }

        $impressions = (clone $analyticsQuery)->where('event_type', 'impression')->count();
        $clicks = (clone $analyticsQuery)->where('event_type', 'click')->count();
        $dismisses = (clone $analyticsQuery)->where('event_type', 'dismiss')->count();

        // Get recent notifications with stats in date range
        $recent = DB::table('salespulse_notifications as n')
            ->leftJoin('salespulse_analytics as a', 'n.id', '=', 'a.notification_id')
            ->select(
                'n.buyer_name', 'n.city', 'n.product_title', 'n.type', 'n.created_at',
                DB::raw("SUM(a.event_type = 'impression'" . ($start ? " AND a.event_time >= '$start'" : '') . ($end ? " AND a.event_time <= '$end'" : '') . ") as impressions"),
                DB::raw("SUM(a.event_type = 'click'" . ($start ? " AND a.event_time >= '$start'" : '') . ($end ? " AND a.event_time <= '$end'" : '') . ") as clicks"),
                DB::raw("SUM(a.event_type = 'dismiss'" . ($start ? " AND a.event_time >= '$start'" : '') . ($end ? " AND a.event_time <= '$end'" : '') . ") as dismisses")
            )
            ->groupBy('n.id')
            ->orderByDesc('n.created_at')
            ->limit(10)
            ->get();

        $stats = [
            'impressions' => $impressions,
            'clicks' => $clicks,
            'dismisses' => $dismisses,
            'notifications' => $recent,
        ];
        return view('salespulse::analytics', compact('stats'));
    }
} 