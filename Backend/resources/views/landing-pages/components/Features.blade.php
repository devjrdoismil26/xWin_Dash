<section>
    <h2>{{ $props['title'] }}</h2>
    <p>{{ $props['subtitle'] }}</p>
    <ul>
        @foreach($props['items'] as $item)
            <li>
                <span>{{ $item['icon'] }}</span>
                <h3>{{ $item['title'] }}</h3>
                <p>{{ $item['description'] }}</p>
            </li>
        @endforeach
    </ul>
</section>
