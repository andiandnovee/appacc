# MyApp - Single Page Application

A modern web application built with Laravel, Vue 3, and Flowbite.

## Stack

- **Backend**: Laravel 11
- **Frontend**: Vue 3 with Composition API
- **Routing**: Vue Router 4
- **UI Components**: Flowbite
- **Styling**: Tailwind CSS 4
- **Build Tool**: Vite
- **Authentication**: Socialite (Google, Facebook)

## Project Structure

```
/resources
├── /spa
│   ├── main.js          # Vue app entry point
│   ├── router.js        # Vue Router configuration
│   ├── App.vue          # Root Vue component
│   ├── /pages           # Page components
│   │   ├── Home.vue
│   │   ├── About.vue
│   │   └── NotFound.vue
│   └── /components      # Reusable Vue components
├── /views
│   └── app.blade.php    # Main SPA layout
└── /css
    └── app.css          # Global styles
```

## Installation

### 1. Install PHP Dependencies
```bash
composer install
```

### 2. Install Node Dependencies
```bash
npm install
```

### 3. Environment Setup
```bash
cp .env.example .env
php artisan key:generate
```

### 4. Database Setup (if needed)
```bash
php artisan migrate
```

## Development

### Start Development Server

**Option 1: Using concurrently** (runs both Laravel and Vite)
```bash
npm run dev
```

**Option 2: Run separately**

Terminal 1 - Start Laravel server:
```bash
php artisan serve
```

Terminal 2 - Start Vite dev server:
```bash
npm run dev
```

The application will be available at `http://localhost:8000`

## Building for Production

```bash
npm run build
```

This will compile:
- Vue components
- JavaScript assets
- CSS with Tailwind

## Features

- ✅ Single Page Application (SPA) with Vue Router
- ✅ Responsive design with Flowbite components
- ✅ Dark mode support
- ✅ OAuth authentication (Google, Facebook)
- ✅ Hot module replacement (HMR) during development
- ✅ RESTful API ready
- ✅ CSRF protection

## Adding Pages

Create new Vue components in `resources/spa/pages/`:

```vue
<template>
  <div class="container mx-auto">
    <h1>My New Page</h1>
  </div>
</template>

<script setup>
</script>
```

Then add the route in `resources/spa/router.js`:

```javascript
{
  path: '/my-page',
  name: 'MyPage',
  component: () => import('./pages/MyPage.vue')
}
```

## Adding Reusable Components

Create components in `resources/spa/components/` and use them in your pages:

```vue
<template>
  <MyComponent :prop="value" @event="handler" />
</template>

<script setup>
import MyComponent from '@/components/MyComponent.vue'
</script>
```

## API Integration

Use axios for API calls:

```javascript
import axios from 'axios'

const response = await axios.get('/api/users')
const data = response.data
```

## Styling

- Use Tailwind CSS utility classes for styling
- Global styles in `resources/css/app.css`
- Component scoped styles in `<style scoped>`
- Flowbite components are pre-configured

## Authentication

The project includes Socialite for OAuth:

1. Configure Google/Facebook credentials in `.env`:
   ```
   GOOGLE_CLIENT_ID=your_client_id
   GOOGLE_CLIENT_SECRET=your_secret
   FACEBOOK_CLIENT_ID=your_client_id
   FACEBOOK_CLIENT_SECRET=your_secret
   ```

2. Create authentication routes in `routes/api.php`

3. Use the Socialite provider in your controllers

## Deployment

1. Build assets:
   ```bash
   npm run build
   ```

2. Deploy using standard Laravel deployment process

3. Ensure `public` directory is served as document root

4. Set up proper environment variables on production server

## Troubleshooting

### Port already in use
Change the port in your serve command:
```bash
php artisan serve --port=8001
```

### Vite not rebuilding
- Clear node_modules and reinstall: `rm -rf node_modules && npm install`
- Restart the Vite dev server

### Hot Module Replacement (HMR) issues
Update `vite.config.js` HMR configuration:
```javascript
server: {
    hmr: {
        host: '127.0.0.1',
        port: 5173,
    }
}
```

## Resources

- [Laravel Documentation](https://laravel.com/docs)
- [Vue 3 Documentation](https://vuejs.org)
- [Vue Router Documentation](https://router.vuejs.org)
- [Flowbite Documentation](https://flowbite.com)
- [Tailwind CSS Documentation](https://tailwindcss.com)
- [Vite Documentation](https://vitejs.dev)

## License

This project is open-source software licensed under the MIT license.
