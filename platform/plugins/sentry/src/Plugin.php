<?php

namespace Botble\Sentry;

use Botble\PluginManagement\Abstracts\PluginOperationAbstract;
use Botble\Setting\Facades\Setting;

class Plugin extends PluginOperationAbstract
{
    public static function activated(): void
    {
        Setting::set('sentry_dsn', '')->save();
    }

    public static function removed(): void
    {
        Setting::delete([
            'sentry_dsn',
        ]);
    }
}
