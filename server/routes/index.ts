// This file acts as a central registry for all server-side routes.

// 1. Import route modules
import * as home from './home/index.tsx';
import * as about from './about/index.tsx';

// 2. Export them in a single object.
// The key (e.g., 'home', 'about') will be used to derive the route path.
// When adding a new page, you must add its route module to this object.
export const routes = {
  home,
  about,
};
