<?php

namespace SalesPulse\Http\Requests\Settings;

use Botble\Base\Rules\OnOffRule;
use Botble\Support\Http\Requests\Request;

class SalesPulseSettingRequest extends Request
{
    public function rules(): array
    {
        return [
            'salespulse_enabled' => new OnOffRule(),
            'salespulse_display_interval' => 'required|integer|min:5|max:3600',
            'salespulse_show_on' => 'required|string|in:all,product,category',
            'salespulse_enable_fake' => new OnOffRule(),
            'salespulse_fake_names' => 'nullable|string',
            'salespulse_fake_products' => 'nullable|string',
            'salespulse_popup_style' => 'required|string|in:style-default,style-modern,style-rounded,style-dark,style-light',
            'salespulse_popup_position' => 'required|string|in:bottom-left,bottom-right,top-left,top-right,center',
        ];
    }

    public function validationData()
    {
        $data = parent::validationData();
        $data['salespulse_enabled'] = $data['salespulse_enabled'] ?? '0';
        $data['salespulse_enable_fake'] = $data['salespulse_enable_fake'] ?? '0';
        return $data;
    }
} 