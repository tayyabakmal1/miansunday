<?php

namespace SalesPulse\Models;

use Illuminate\Database\Eloquent\Model;

class Notification extends Model
{
    protected $table = 'salespulse_notifications';

    protected $fillable = [
        'type', 'buyer_name', 'city', 'product_title', 'product_id', 'is_fake', 'shown_at', 'dismissed_at', 'clicked_at'
    ];

    public function analytics()
    {
        return $this->hasMany(Analytics::class, 'notification_id');
    }
} 