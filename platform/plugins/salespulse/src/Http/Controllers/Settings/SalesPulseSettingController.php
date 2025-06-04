<?php

namespace SalesPulse\Http\Controllers\Settings;

use Botble\Base\Http\Responses\BaseHttpResponse;
use SalesPulse\Forms\Settings\SalesPulseSettingForm;
use Illuminate\Http\Request;
use Botble\Setting\Http\Controllers\SettingController;

class SalesPulseSettingController extends SettingController
{
    public function edit()
    {
        $this->pageTitle(trans('plugins/salespulse::salespulse.settings.title'));
        return SalesPulseSettingForm::create()->renderForm();
    }

    public function update(Request $request): BaseHttpResponse
    {
        return $this->performUpdate($request->all());
    }
} 