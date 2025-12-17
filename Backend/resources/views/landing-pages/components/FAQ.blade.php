<section>
    <h2>{{ $props['title'] }}</h2>
    <p>{{ $props['subtitle'] }}</p>
    <dl>
        @foreach($props['items'] as $item)
            <dt>{{ $item['question'] }}</dt>
            <dd>{{ $item['answer'] }}</dd>
        @endforeach
    </dl>
</section>
