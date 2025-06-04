<?php

// SalesPulse plugin routes
// TODO: Add admin and API routes here 

use Illuminate\Support\Facades\Route;
use SalesPulse\Http\Controllers\Settings\SalesPulseSettingController;
use SalesPulse\Http\Controllers\SalesPulseAnalyticsController;
use SalesPulse\Http\Controllers\SalesPulseNotificationApiController;
use SalesPulse\Http\Controllers\SalesPulseAnalyticsApiController;

Route::group(['prefix' => 'admin', 'middleware' => ['web', 'auth']], function () {
    Route::get('/salespulse', [SalesPulseController::class, 'index'])->name('salespulse.index');
    Route::get('/salespulse/settings', [SalesPulseSettingController::class, 'edit'])->name('salespulse.settings.edit');
    Route::post('/salespulse/settings', [SalesPulseSettingController::class, 'update'])->name('salespulse.settings.update');
    Route::get('/salespulse/analytics', [SalesPulseAnalyticsController::class, 'index'])->name('salespulse.analytics.index');
    Route::get('settings/salespulse', [SalesPulseSettingController::class, 'edit'])->name('salespulse.settings.edit');
    Route::post('settings/salespulse', [SalesPulseSettingController::class, 'update'])->name('salespulse.settings.update');
    Route::get('salespulse/analytics', [SalesPulseAnalyticsController::class, 'index'])->name('salespulse.analytics.index');
    Route::get('api/salespulse/notifications', [SalesPulseNotificationApiController::class, 'index']);
    Route::post('api/salespulse/analytics', [SalesPulseAnalyticsApiController::class, 'store']);
    Route::get('api/salespulse/notifications', [SalesPulseNotificationApiController::class, 'index']);
    Route::post('api/salespulse/analytics', [SalesPulseAnalyticsApiController::class, 'store']);


});


Route::get('api/salespulse/notifications', [SalesPulseNotificationApiController::class, 'index']);
Route::post('api/salespulse/analytics', [SalesPulseAnalyticsApiController::class, 'store']); 

