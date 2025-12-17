<section>
    <h2>{{ $props['title'] }}</h2>
    <p>{{ $props['subtitle'] }}</p>
    <div>
        @foreach($props['plans'] as $plan)
            <div>
                <h3>{{ $plan['name'] }}</h3>
                <p>{{ $plan['description'] }}</p>
                <p>{{ $plan['price'] }}</p>
                <ul>
                    @foreach($plan['features'] as $feature)
                        <li>{{ $feature }}</li>
                    @endforeach
                </ul>
                <button>{{ $plan['button_text'] }}</button>
            </div>
        @endforeach
    </div>
</section>
