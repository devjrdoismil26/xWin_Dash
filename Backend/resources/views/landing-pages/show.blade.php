<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{ $page->name }}</title>
</head>
<body>
    <h1>{{ $page->name }}</h1>
    <div>
        @if(is_array($page->content) && isset($page->content['components']))
            @foreach($page->content['components'] as $component)
                @include('landing-pages.components.' . $component['type'], ['props' => $component['props']])
            @endforeach
        @else
            <p>Conteúdo inválido.</p>
        @endif
    </div>
</body>
</html>
