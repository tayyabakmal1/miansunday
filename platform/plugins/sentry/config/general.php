<?php

return [
    'name' => 'Sentry',
    'description' => 'Configure Sentry settings',
    'settings' => [
        [
            'label' => 'Sentry DSN',
            'type' => 'text',
            'attributes' => [
                'name' => 'sentry_dsn',
                'value' => null,
                'options' => [
                    'class' => 'form-control',
                    'placeholder' => 'Enter Sentry DSN',
                    'data-counter' => 255,
                ],
            ],
        ],
    ],
];
