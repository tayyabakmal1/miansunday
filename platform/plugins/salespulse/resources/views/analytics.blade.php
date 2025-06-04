@extends('core/base::layouts.master')

@section('content')
    <form method="get" class="mb-4 row g-3 align-items-end">
        <div class="col-auto">
            <label for="start_date" class="form-label">Start Date</label>
            <input type="date" id="start_date" name="start_date" class="form-control" value="{{ request('start_date') }}">
        </div>
        <div class="col-auto">
            <label for="end_date" class="form-label">End Date</label>
            <input type="date" id="end_date" name="end_date" class="form-control" value="{{ request('end_date') }}">
        </div>
        <div class="col-auto">
            <button type="submit" class="btn btn-primary">Filter</button>
        </div>
    </form>
    <div class="row mb-4">
        <div class="col-md-4">
            <x-core::card>
                <x-core::card.body>
                    <h5>{{ trans('plugins/salespulse::salespulse.analytics.impressions') }}</h5>
                    <h2>{{ $stats['impressions'] }}</h2>
                </x-core::card.body>
            </x-core::card>
        </div>
        <div class="col-md-4">
            <x-core::card>
                <x-core::card.body>
                    <h5>{{ trans('plugins/salespulse::salespulse.analytics.clicks') }}</h5>
                    <h2>{{ $stats['clicks'] }}</h2>
                </x-core::card.body>
            </x-core::card>
        </div>
        <div class="col-md-4">
            <x-core::card>
                <x-core::card.body>
                    <h5>{{ trans('plugins/salespulse::salespulse.analytics.dismisses') }}</h5>
                    <h2>{{ $stats['dismisses'] }}</h2>
                </x-core::card.body>
            </x-core::card>
        </div>
    </div>
    <div class="card">
        <div class="card-header">
            <h4>{{ trans('plugins/salespulse::salespulse.analytics.recent_notifications') }}</h4>
        </div>
        <div class="card-body">
            <table class="table table-striped">
                <thead>
                    <tr>
                        <th>{{ trans('plugins/salespulse::salespulse.analytics.buyer') }}</th>
                        <th>{{ trans('plugins/salespulse::salespulse.analytics.city') }}</th>
                        <th>{{ trans('plugins/salespulse::salespulse.analytics.product') }}</th>
                        <th>{{ trans('plugins/salespulse::salespulse.analytics.time') }}</th>
                        <th>{{ trans('plugins/salespulse::salespulse.analytics.type') }}</th>
                        <th>{{ trans('plugins/salespulse::salespulse.analytics.impressions') }}</th>
                        <th>{{ trans('plugins/salespulse::salespulse.analytics.clicks') }}</th>
                        <th>{{ trans('plugins/salespulse::salespulse.analytics.dismisses') }}</th>
                    </tr>
                </thead>
                <tbody>
                    @foreach ($stats['notifications'] as $n)
                    <tr>
                        <td>{{ $n->buyer_name }}</td>
                        <td>{{ $n->city }}</td>
                        <td>{{ $n->product_title }}</td>
                        <td>{{ \Carbon\Carbon::parse($n->created_at)->diffForHumans() }}</td>
                        <td>{{ ucfirst($n->type) }}</td>
                        <td>{{ $n->impressions }}</td>
                        <td>{{ $n->clicks }}</td>
                        <td>{{ $n->dismisses }}</td>
                    </tr>
                    @endforeach
                </tbody>
            </table>
        </div>
    </div>
@endsection 