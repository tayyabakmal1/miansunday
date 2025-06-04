<?php

namespace SalesPulse\Forms\Settings;

use Botble\Base\Forms\FieldOptions\OnOffFieldOption;
use Botble\Base\Forms\Fields\OnOffCheckboxField;
use Botble\Base\Forms\Fields\NumberField;
use Botble\Base\Forms\Fields\TextareaField;
use Botble\Base\Forms\Fields\SelectField;
use Botble\Setting\Forms\SettingForm;

class SalesPulseSettingForm extends SettingForm
{
    public function setup(): void
    {
        parent::setup();

        $this
            ->setSectionTitle(trans('plugins/salespulse::salespulse.settings.title'))
            ->setSectionDescription(trans('plugins/salespulse::salespulse.settings.description'))
            ->setValidatorClass('SalesPulse\Http\Requests\Settings\SalesPulseSettingRequest')
            ->setFormOption('class', 'salespulse-settings-form')
            ->setFormOption('enctype', 'multipart/form-data')
            ->add(
                'salespulse_enabled',
                OnOffCheckboxField::class,
                OnOffFieldOption::make()
                    ->label(trans('plugins/salespulse::salespulse.settings.enabled'))
                    ->defaultValue((bool) setting('salespulse_enabled', true))
            )
            ->add(
                'salespulse_display_interval',
                NumberField::class,
                [
                    'label' => trans('plugins/salespulse::salespulse.settings.display_interval'),
                    'default_value' => setting('salespulse_display_interval', 15),
                    'min' => 5,
                ]
            )
            ->add(
                'salespulse_show_on',
                SelectField::class,
                [
                    'label' => trans('plugins/salespulse::salespulse.settings.show_on'),
                    'choices' => [
                        'all' => trans('plugins/salespulse::salespulse.settings.show_on_all'),
                        'product' => trans('plugins/salespulse::salespulse.settings.show_on_product'),
                        'category' => trans('plugins/salespulse::salespulse.settings.show_on_category'),
                    ],
                    'selected' => setting('salespulse_show_on', 'all'),
                ]
            )
            ->add(
                'salespulse_enable_fake',
                OnOffCheckboxField::class,
                OnOffFieldOption::make()
                    ->label(trans('plugins/salespulse::salespulse.settings.enable_fake'))
                    ->defaultValue((bool) setting('salespulse_enable_fake', false))
            )
            ->add(
                'salespulse_fake_names',
                TextareaField::class,
                [
                    'label' => trans('plugins/salespulse::salespulse.settings.fake_names'),
                    'default_value' => setting('salespulse_fake_names', "John,Jane,Alex,Emily,Chris,Katie"),
                    'rows' => 2,
                ]
            )
            ->add(
                'salespulse_fake_products',
                TextareaField::class,
                [
                    'label' => trans('plugins/salespulse::salespulse.settings.fake_products'),
                    'default_value' => setting('salespulse_fake_products', "Awesome Widget,Super Gadget,Cool Device"),
                    'rows' => 2,
                ]
            )
            ->add(
                'salespulse_popup_style',
                SelectField::class,
                [
                    'label' => trans('plugins/salespulse::salespulse.settings.popup_style'),
                    'choices' => [
                        'style-default' => trans('plugins/salespulse::salespulse.settings.popup_style_default'),
                        'style-modern' => trans('plugins/salespulse::salespulse.settings.popup_style_modern'),
                        'style-rounded' => trans('plugins/salespulse::salespulse.settings.popup_style_rounded'),
                        'style-dark' => trans('plugins/salespulse::salespulse.settings.popup_style_dark'),
                        'style-light' => trans('plugins/salespulse::salespulse.settings.popup_style_light'),
                    ],
                    'selected' => setting('salespulse_popup_style', 'style-default'),
                ]
            )
            ->add(
                'salespulse_popup_position',
                SelectField::class,
                [
                    'label' => trans('plugins/salespulse::salespulse.settings.popup_position'),
                    'choices' => [
                        'bottom-left' => trans('plugins/salespulse::salespulse.settings.position_bottom_left'),
                        'bottom-right' => trans('plugins/salespulse::salespulse.settings.position_bottom_right'),
                        'top-left' => trans('plugins/salespulse::salespulse.settings.position_top_left'),
                        'top-right' => trans('plugins/salespulse::salespulse.settings.position_top_right'),
                        'center' => trans('plugins/salespulse::salespulse.settings.position_center'),
                    ],
                    'selected' => setting('salespulse_popup_position', 'bottom-left'),
                ]
            );
    }
} 