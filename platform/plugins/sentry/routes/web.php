<?php

use Botble\Base\Facades\BaseHelper;
use Illuminate\Support\Facades\Route;

Route::group(['namespace' => 'Botble\Sentry\Http\Controllers', 'middleware' => ['web', 'core']], function () {
    Route::group(['prefix' => BaseHelper::getAdminPrefix(), 'middleware' => 'auth'], function () {
        Route::group(['prefix' => 'settings/sentry', 'as' => 'sentry.'], function () {
            Route::get('', [
                'as' => 'settings',
                'uses' => 'SentryController@settings',
            ]);

            Route::post('', [
                'as' => 'settings.update',
                'uses' => 'SentryController@updateSettings',
                'permission' => 'sentry.settings',
            ]);
        });
    });
});
