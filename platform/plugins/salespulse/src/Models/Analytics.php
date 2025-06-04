<?php

namespace SalesPulse\Models;

use Illuminate\Database\Eloquent\Model;

class Analytics extends Model
{
    protected $table = 'salespulse_analytics';

    protected $fillable = [
        'notification_id', 'event_type', 'event_time'
    ];

    public function notification()
    {
        return $this->belongsTo(Notification::class, 'notification_id');
    }
} 