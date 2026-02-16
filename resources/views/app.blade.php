<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}" class="scroll-smooth">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <meta name="csrf-token" content="{{ csrf_token() }}">

        <title>{{ config('app.name', 'MyApp') }}</title>

        <!-- Vite Dev Server -->
        <script type="module" src="http://127.0.0.1:5174/@@vite/client"></script>
        <script type="module" src="http://127.0.0.1:5174/resources/spa/main.js"></script>
    </head>
    <body class="antialiased">
        <div id="app"></div>
    </body>
</html>
