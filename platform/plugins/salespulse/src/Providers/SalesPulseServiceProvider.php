<?php

namespace SalesPulse\Providers;

use Illuminate\Support\ServiceProvider;
use DashboardMenu;

class SalesPulseServiceProvider extends ServiceProvider
{
    public function register()
    {
        // Register config
        $this->mergeConfigFrom(__DIR__ . '/../../config/general.php', 'salespulse');
    }

    public function boot()
    {
        // Load routes
        $this->loadRoutesFrom(__DIR__ . '/../../routes/web.php');
        // Load migrations
        $this->loadMigrationsFrom(__DIR__ . '/../../database/migrations');
        // Load views
        $this->loadViewsFrom(__DIR__ . '/../../resources/views', 'salespulse');
        // Load translations
        $this->loadTranslationsFrom(__DIR__ . '/../../resources/lang', 'plugins/salespulse');
        // Publish config
        $this->publishes([
            __DIR__ . '/../../config/general.php' => config_path('salespulse.php'),
        ], 'config');

        // Register admin menu
        \DashboardMenu::default()->beforeRetrieving(function () {
            \DashboardMenu::make()
                ->registerItem(
                    \Botble\Base\Supports\DashboardMenuItem::make()
                        ->id('cms-plugins-salespulse')
                        ->priority(500)
                        ->name('SalesPulse')
                        ->icon('ti ti-bolt')
                )
                ->registerItem(
                    \Botble\Base\Supports\DashboardMenuItem::make()
                        ->id('cms-plugins-salespulse-analytics')
                        ->priority(1)
                        ->parentId('cms-plugins-salespulse')
                        ->name('Analytics')
                        ->icon('ti ti-chart-bar')
                        ->route('salespulse.analytics.index')
                )
                ->registerItem(
                    \Botble\Base\Supports\DashboardMenuItem::make()
                        ->id('cms-plugins-salespulse-settings')
                        ->priority(2)
                        ->parentId('cms-plugins-salespulse')
                        ->name('Settings')
                        ->icon('ti ti-settings')
                        ->route('salespulse.settings.edit')
                );
        });
    }
} 