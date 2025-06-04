<?php

namespace Botble\Sentry\Providers;

use Botble\Base\Facades\DashboardMenu;
use Botble\Base\Traits\LoadAndPublishDataTrait;
use Illuminate\Support\ServiceProvider;

class SentryServiceProvider extends ServiceProvider
{
    use LoadAndPublishDataTrait;

    public function boot(): void
    {
        $this
            ->setNamespace('plugins/sentry')
            ->loadAndPublishConfigurations(['permissions', 'general'])
            ->loadAndPublishTranslations()
            ->loadRoutes(['web'])
            ->loadAndPublishViews();

        DashboardMenu::beforeRetrieving(function (): void {
            DashboardMenu::make()
                ->registerItem([
                    'id' => 'cms-plugins-sentry',
                    'priority' => 99,
                    'parent_id' => 'cms-core-settings',
                    'name' => 'plugins/sentry::sentry.name',
                    'icon' => 'ti ti-alert-triangle',
                    'url' => route('sentry.settings'),
                    'permissions' => ['sentry.settings'],
                ]);
        });
    }
}
