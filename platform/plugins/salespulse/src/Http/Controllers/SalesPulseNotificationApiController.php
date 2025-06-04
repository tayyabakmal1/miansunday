<?php

namespace SalesPulse\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Routing\Controller;
use SalesPulse\Models\Notification;
use Botble\Ecommerce\Models\Order;
use Botble\Ecommerce\Models\OrderProduct;
use Botble\Ecommerce\Models\OrderAddress;
use Botble\Ecommerce\Models\Product;
use Carbon\Carbon;

class SalesPulseNotificationApiController extends Controller
{
    public function index(Request $request)
    {
        $limit = (int)($request->input('limit', 10));
        $notifications = [];

        // Fetch real orders
        $orders = Order::query()
            ->where('is_finished', 1)
            ->orderByDesc('created_at')
            ->with(['user', 'shippingAddress', 'products.product'])
            ->limit($limit)
            ->get();

        foreach ($orders as $order) {
            foreach ($order->products as $orderProduct) {
                $product = $orderProduct->product;
                $notifications[] = [
                    'buyer_name' => $order->user->name ?? 'Someone',
                    'city' => $order->shippingAddress->city ?? '',
                    'product_title' => $product->name ?? $orderProduct->product_name,
                    'time_ago' => $this->timeAgo($order->created_at),
                    'type' => 'real',
                ];
            }
        }

        // Fake notifications
        if (setting('salespulse_enable_fake', false)) {
            $fakeNames = array_map('trim', explode(',', setting('salespulse_fake_names', 'John,Jane,Alex,Emily,Chris,Katie')));
            $fakeProducts = array_map('trim', explode(',', setting('salespulse_fake_products', 'Awesome Widget,Super Gadget,Cool Device')));
            $fakeCities = ['New York', 'London', 'Paris', 'Berlin', 'Sydney', 'Toronto', 'Tokyo', 'Dubai'];
            for ($i = 0; $i < $limit; $i++) {
                $notifications[] = [
                    'buyer_name' => $fakeNames[array_rand($fakeNames)],
                    'city' => $fakeCities[array_rand($fakeCities)],
                    'product_title' => $fakeProducts[array_rand($fakeProducts)],
                    'time_ago' => $this->timeAgo(Carbon::now()->subMinutes(rand(1, 60))),
                    'type' => 'fake',
                ];
            }
        }

        // Shuffle to mix real and fake
        shuffle($notifications);

        return response()->json(array_slice($notifications, 0, $limit));
    }

    private function timeAgo($date)
    {
        $carbon = $date instanceof Carbon ? $date : Carbon::parse($date);
        $diff = $carbon->diffInMinutes(now());
        if ($diff < 1) {
            return 'just now';
        } elseif ($diff === 1) {
            return '1 minute ago';
        } elseif ($diff < 60) {
            return $diff . ' minutes ago';
        } else {
            $hours = floor($diff / 60);
            return $hours . ' hour' . ($hours > 1 ? 's' : '') . ' ago';
        }
    }
} 