<?php

namespace Botble\Ecommerce\Facades;

use Botble\Ecommerce\Supports\OrderHelper as BaseOrderHelper;
use Illuminate\Support\Facades\Facade;

/**
 * @method static \Illuminate\Support\Collection|\Illuminate\Database\Eloquent\Model|array|bool processOrder(array|string|null $orderIds, string|null $chargeId = null)
 * @method static bool decreaseProductQuantity(\Botble\Ecommerce\Models\Order $order)
 * @method static \Botble\Base\Supports\EmailHandler setEmailVariables(\Botble\Ecommerce\Models\Order $order)
 * @method static array getEmailVariables(\Botble\Ecommerce\Models\Order $order)
 * @method static bool sendOrderConfirmationEmail(\Botble\Ecommerce\Models\Order $order, bool $saveHistory = false)
 * @method static void sendEmailForDigitalProducts(\Botble\Ecommerce\Models\Order $order)
 * @method static \Botble\Ecommerce\Models\Order setOrderCompleted(string|int $orderId, \Illuminate\Http\Request $request, string|int $userId = 0)
 * @method static array|string|null getShippingMethod(string $method, array|string|null $option = null)
 * @method static string|null processHistoryVariables(\Botble\Ecommerce\Models\OrderHistory|\Botble\Ecommerce\Models\ShipmentHistory $history)
 * @method static array setOrderSessionData(string|null $token, array|string $data)
 * @method static string getOrderSessionToken()
 * @method static array getOrderSessionData(string|null $token = null)
 * @method static array cleanData(array $data)
 * @method static array mergeOrderSessionData(string|null $token, array|string $data)
 * @method static void clearSessions(string|null $token)
 * @method static array handleAddCart(\Botble\Ecommerce\Models\Product $product, \Illuminate\Http\Request $request)
 * @method static array getProductOptionData(array $data, string|int|null $productId = null)
 * @method static array processAddressOrder(string|int $currentUserId, array $sessionData, \Illuminate\Http\Request $request)
 * @method static array checkAndCreateOrderAddress(array $addressData, array $sessionData)
 * @method static array processOrderProductData(\Illuminate\Support\Collection|array $products, array $sessionData)
 * @method static array processOrderInCheckout($sessionData, $request, $cartItems, $order, array $generalData)
 * @method static mixed createOrder(\Illuminate\Http\Request $request, string|int $currentUserId, string $token, array $cartItems)
 * @method static bool confirmPayment(\Botble\Ecommerce\Models\Order $order)
 * @method static \Botble\Ecommerce\Models\Order cancelOrder(\Botble\Ecommerce\Models\Order $order, string|null $reason = null, string|null $reasonDescription = null)
 * @method static \Botble\Ecommerce\Models\Order shippingStatusDelivered(\Botble\Ecommerce\Models\Shipment $shipment, \Illuminate\Http\Request $request, string|int $userId = 0)
 * @method static string|null getOrderBankInfo(\Botble\Ecommerce\Models\Order|\Illuminate\Database\Eloquent\Collection $orders)
 * @method static void confirmOrder(\Botble\Ecommerce\Models\Order $order)
 * @method static \Botble\Ecommerce\Models\Order|false|null createOrUpdateIncompleteOrder(array $data, \Botble\Ecommerce\Models\Order|null $order = null)
 * @method static void captureFootprints(\Botble\Ecommerce\Models\Order $order)
 *
 * @see \Botble\Ecommerce\Supports\OrderHelper
 */
class OrderHelper extends Facade
{
    protected static function getFacadeAccessor(): string
    {
        return BaseOrderHelper::class;
    }
}
