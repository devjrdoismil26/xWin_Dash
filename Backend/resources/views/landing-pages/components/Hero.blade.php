<section>
    <h2>{{ $props['title'] }}</h2>
    <p>{{ $props['subtitle'] }}</p>
    <button>{{ $props['button_text'] }}</button>
    @if(isset($props['image_url']))
        <img src="{{ $props['image_url'] }}" alt="Hero Image">
    @endif
</section>
