This is a frontend application for a product catalog and inventory management system. Built with Vue 3, TypeScript, and Vuetify, it provides an interactive admin dashboard for managing products, categories, and users with JWT-based authentication.

**Live Demo:** [https://npi-alpha.vercel.app](https://npi-alpha.vercel.app)

---

### Features

- **Authentication** — Login and registration with JWT token storage
- **Route Guards** — Automatic redirect to login for unauthenticated users
- **Product Management** — Full CRUD with image upload, search, sort, and pagination
- **Category Management** — Organize products into categories with full CRUD
- **Data Tables** — Server-side pagination, sorting, and search with Vuetify's `v-data-table-server`
- **Image Support** — Upload and display product images
- **Responsive UI** — Built with Vuetify 3 components
- **Dark Theme** — Custom dark-themed interface

---

### Authentication Flow

1. Users register at `/register` or login at `/login`
2. On successful login, the JWT token and username are stored in `localStorage`
3. Axios interceptors automatically attach the `Authorization: Bearer <token>` header
4. If a 401 response is received, the user is redirected to `/login`
5. Route guards prevent unauthenticated access to the dashboard

---

### Tech Stack

| Technology  | Version |
| ----------- | ------- |
| Vue         | 3.5.17  |
| TypeScript  | ~5.8.3  |
| Vite        | 6.3.5   |
| Vuetify     | 3.9.1   |
| Vue Router  | 4.5.1   |
| Axios       | 1.12.2  |
| Roboto Font | 5.2.6   |
| MDI Icons   | 7.4.47  |

---

### API Integration

The frontend communicates with the [npi-back](https://github.com/fagner02/npi-back) Spring Boot API:

| Endpoint               | Method     | Description            |
| ---------------------- | ---------- | ---------------------- |
| `/users/login`         | POST       | Authenticate user      |
| `/users/register`      | POST       | Register new user      |
| `/produtos`            | GET/POST   | List/create products   |
| `/produtos/{id}`       | PUT/DELETE | Update/delete product  |
| `/produtos/{id}/image` | POST       | Upload product image   |
| `/categorias`          | GET/POST   | List/create categories |
| `/categorias/{id}`     | PUT/DELETE | Update/delete category |
