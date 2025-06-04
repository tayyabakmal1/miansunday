@extends(BaseHelper::getAdminMasterLayoutTemplate())

@section('content')
    <div class="max-width-1200">
        {!! Form::open(['route' => 'sentry.settings.update']) !!}
            <x-core-setting::section
                :title="trans('plugins/sentry::sentry.settings.title')"
                :description="trans('plugins/sentry::sentry.settings.description')"
            >
                <x-core-setting::text-input
                    name="sentry_dsn"
                    :label="trans('plugins/sentry::sentry.settings.dsn')"
                    :value="setting('sentry_dsn')"
                    :placeholder="trans('plugins/sentry::sentry.settings.dsn_placeholder')"
                />
            </x-core-setting::section>

            <div class="flexbox-annotated-section" style="border: none">
                <div class="flexbox-annotated-section-annotation">
                    &nbsp;
                </div>
                <div class="flexbox-annotated-section-content">
                    <button class="btn btn-info" type="submit">
                        {{ trans('core/base::forms.save_settings') }}
                    </button>
                </div>
            </div>
        {!! Form::close() !!}
    </div>
@stop
