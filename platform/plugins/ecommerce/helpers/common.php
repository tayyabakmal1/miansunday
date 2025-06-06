<?php

use Botble\Ecommerce\Facades\EcommerceHelper;
use Botble\Ecommerce\Models\StoreLocator;
use Botble\Media\Facades\RvMedia;

if (! function_exists('array_equal')) {
    function array_equal(array $first, array $second): bool
    {
        if (count($first) != count($second)) {
            return false;
        }

        return ! array_diff($first, $second) && ! array_diff($second, $first);
    }
}

if (! function_exists('esc_sql')) {
    function esc_sql(int|string|null $string): string
    {
        return app('db')->getPdo()->quote($string);
    }
}

if (! function_exists('rv_get_image_list')) {
    function rv_get_image_list(array $imagesList, array $sizes): array
    {
        $result = [];
        foreach ($sizes as $size) {
            $images = [];

            foreach ($imagesList as $url) {
                if (empty($url)) {
                    continue;
                }

                try {
                    $images[] = RvMedia::getImageUrl($url, apply_filters('ecommerce_product_gallery_origin_image_size', $size));
                } catch (Throwable $exception) {
                    logger()->error('Failed to get image URL: ' . $exception->getMessage(), [
                        'url' => $url,
                        'size' => $size,
                        'exception' => $exception,
                    ]);

                    $images[] = RvMedia::getDefaultImage(false, $size);
                }
            }

            $result[$size] = $images;
        }

        return $result;
    }
}

if (! function_exists('rv_get_image_sizes')) {
    /**
     * Get image URLs for multiple sizes of an image
     *
     * @param string $imageUrl The original image URL
     * @param array $sizes Array of size names to generate URLs for
     * @return array An array of image URLs indexed by size name
     */
    function rv_get_image_sizes(string $imageUrl, array $sizes): array
    {
        $result = [];
        foreach ($sizes as $size) {
            $result[$size] = RvMedia::getImageUrl($imageUrl, apply_filters('ecommerce_product_gallery_origin_image_size', $size));
        }

        return $result;
    }
}

if (! function_exists('get_ecommerce_setting')) {
    function get_ecommerce_setting(string $key, bool|int|string|null $default = ''): array|int|string|null
    {
        return setting(EcommerceHelper::getSettingPrefix() . $key, $default);
    }
}

if (! function_exists('get_shipment_code')) {
    function get_shipment_code(int|string $shipmentId): string
    {
        return '#' . (config('plugins.ecommerce.order.default_order_start_number') + intval($shipmentId));
    }
}

if (! function_exists('get_primary_store_locator')) {
    function get_primary_store_locator(): StoreLocator
    {
        /**
         * @var StoreLocator $storeLocator
         */
        $storeLocator = StoreLocator::query()->firstOrNew(['is_primary' => 1]);

        return $storeLocator;
    }
}

if (! function_exists('ecommerce_convert_weight')) {
    function ecommerce_convert_weight(?float $weight): float
    {
        switch (get_ecommerce_setting('store_weight_unit', 'g')) {
            case 'g':
                break;
            case 'kg':
                $weight = $weight * 1000;

                break;
            case 'lb':
                $weight = $weight * 453.592;

                break;
            case 'oz':
                $weight = $weight * 28.3495;

                break;
        }

        return (float) $weight;
    }
}

if (! function_exists('ecommerce_convert_width_height')) {
    function ecommerce_convert_width_height(?float $data): float
    {
        switch (get_ecommerce_setting('store_width_height_unit', 'cm')) {
            case 'cm':
                break;
            case 'inch':
                $data = $data * 2.54;

                break;
            case 'm':
                $data = $data * 100;

                break;
        }

        return (float) $data;
    }
}

if (! function_exists('ecommerce_weight_unit')) {
    function ecommerce_weight_unit(bool $full = false): string
    {
        $unit = (string) get_ecommerce_setting('store_weight_unit', 'g');

        if (! $full) {
            return $unit;
        }

        switch ($unit) {
            case 'g':
                $unit = __('grams');

                break;
            case 'kg':
                $unit = __('kilograms');

                break;
        }

        return $unit;
    }
}

if (! function_exists('ecommerce_width_height_unit')) {
    function ecommerce_width_height_unit(bool $full = false): string
    {
        $unit = (string) get_ecommerce_setting('store_width_height_unit', 'cm');

        if (! $full) {
            return $unit;
        }

        switch ($unit) {
            case 'cm':
                $unit = __('centimeters');

                break;
            case 'm':
                $unit = __('meters');

                break;
        }

        return $unit;
    }
}

if (! function_exists('mapped_implode')) {
    function mapped_implode(string $glue, array $array, string $symbol = '='): string
    {
        return implode(
            $glue,
            array_map(
                function ($k, $v) use ($symbol) {
                    return $k . $symbol . $v;
                },
                array_keys($array),
                array_values($array)
            )
        );
    }
}
