# Hotel Luxury Website — Demo Documentation

## 1. Product overview

This project is a hotel website and content-management dashboard. It combines:

- A public-facing hotel discovery and booking experience.
- An authenticated admin panel for managing hotel inventory, reservations, guests, reviews, messages, promotions, users, roles, navigation, footer content, theme settings, and page content.
- A PostgreSQL database accessed through Prisma.
- Configurable homepage and page content stored as settings, so much of the website can be updated without editing code.

The main demo story is: a guest discovers the property, explores rooms and experiences, submits a reservation, and the hotel team manages the resulting booking and content from the admin panel.

## 2. Public website

### Homepage — `/`

The homepage is assembled from configurable sections:

- Hero/banner with headline, supporting text, imagery, and call-to-action.
- Featured rooms and suites.
- Amenities and property highlights.
- Our story/about content.
- Dining and culinary content.
- Spa and wellness content.
- Experiences and local activities.
- Booking call-to-action.
- Testimonials/reviews.
- Global navigation and footer.

Homepage visibility and content are driven by stored homepage settings. The selected theme fonts and heading sizes are applied globally.

### Rooms and suites

- `/rooms-and-suites` — room-category listing.
- `/rooms-and-suites/[slug]` — category detail page.
- `/rooms-and-suites/[slug]/[roomNumber]` — individual room detail page.

Room experiences include:

- Room/category imagery.
- Room descriptions, rates, occupancy, bed type, size, amenities, and availability status.
- Image gallery and optional room video.
- Arrival and departure date selection.
- Reservation form connected to the booking workflow.

### Hotel information pages

- `/about` — hotel story, values, and team content.
- `/dining` — dining hero, introduction, venues, menu content, and gallery sections.
- `/spa` — spa hero, introduction, facilities, and treatments.
- `/experiences` — featured experiences, introduction, and local guide content.
- `/gallery` — gallery hero and masonry image layout.
- `/faq` — frequently asked questions in an accordion interface.
- `/contact` — contact information and contact form.
- `/privacy` — privacy page.
- `/terms` — terms page.

### Search

- `/search` — search results page with advanced filtering/sidebar behavior.
- Search can surface relevant hotel content and room information.

### Booking flow

The booking flow is available from room pages and the booking page at `/booking`.

The guest provides:

- First name and last name.
- Email address.
- Phone number.
- Arrival and departure dates.
- Payment method: credit card or QR.
- Payment reference ID when QR payment is selected.

The system validates the guest input, confirms the room exists, calculates the stay total as nights multiplied by the room price, creates or updates the guest record, and creates a booking with a pending-payment status.

The UI supports a success state with a booking reference after a successful submission.

### Navigation and footer

The public navbar and footer are database-backed and editable from the admin panel. Link visibility, labels, URLs, dropdown links, footer link groups, contact information, branding, and social links can be maintained without changing frontend code.

## 3. Admin panel

Admin entry point:

- `/admin/login`

The dashboard shell includes a responsive sidebar, mobile navigation sheet, top bar, admin search, user identity area, unread notifications, and protected admin routes.

## 4. Admin sidebar — Operations

### Dashboard — `/admin/dashboard`

The dashboard provides a management overview:

- Total rooms.
- Available rooms.
- Occupied rooms.
- Total guests.
- Unread contact messages.
- Pending reviews.
- Room allocation visualization.
- Seven-day income versus expense chart.
- Recent bookings.
- Today’s check-ins.

### Bookings — `/admin/bookings`

Booking management includes:

- Guest, room, stay dates, total, payment, and status information.
- Responsive booking cards on mobile and tablet.
- Booking details dialog.
- Status updates through the booking API.
- Booking deletion.
- Payment method, payment reference, and reservation-fee information.
- Schedule export control in the interface.

### Messages — `/admin/messages`

- Lists contact-form messages.
- Shows sender, subject, date, read state, and actions.
- Supports opening and managing message details.
- Unread messages are surfaced in admin notification counts.

### Rooms — `/admin/rooms`

- Create, edit, and delete rooms.
- Assign a room category.
- Set room number, price, status, description, image, and video.
- Assign amenities.
- View availability, occupancy, maintenance, and cleaning status.
- Responsive card layout on smaller screens.

### Categories — `/admin/categories`

- Create and edit room categories.
- Set category name, slug, description, size, bed type, occupancy, and base price.
- Upload category images.
- Assign amenities.
- See how many rooms belong to a category.

### Amenities — `/admin/amenities`

- Create, edit, and delete amenities.
- Store an amenity name and optional icon identifier.
- Reuse amenities across room categories and rooms.

### Promotions — `/admin/promotions`

- Create, edit, and delete promotional codes.
- Configure fixed or percentage discounts.
- Configure validity dates and usage limits.
- Track usage count and active status.

### Reviews — `/admin/reviews`

- View guest name, room, rating, comment, and approval status.
- Approve reviews so they can appear publicly.
- Reject and permanently delete reviews.
- On mobile/tablet, “Tap to edit” opens the same approve or reject/delete actions available from desktop.

### Guests — `/admin/guests`

- View guest name, email, phone, and total stays.
- Open guest details.
- Edit or delete guest records.
- Guest records are automatically created or updated during booking submission.

## 5. Admin sidebar — Pages

The Pages section manages public content without direct code changes.

- `/admin/pages/homepage` — hero, homepage sections, featured content, loader, testimonials, and footer-related homepage settings.
- `/admin/pages/about` — story, values, team, and About page content.
- `/admin/pages/rooms` — Rooms & Suites page presentation and category-facing content.
- `/admin/pages/dining` — dining hero, intro, venues, menus, and dining gallery.
- `/admin/pages/spa` — spa page sections, facilities, and treatments.
- `/admin/pages/experiences` — experiences hero, intro, featured content, and local guide.
- `/admin/pages/gallery` — gallery page copy, images, and masonry gallery content.
- `/admin/pages/faq` — FAQ content and ordering.
- `/admin/pages/contact` — contact page content and contact information.

Most page editors provide:

- Editable text fields.
- Visibility controls.
- Ordering/reordering controls.
- Image upload support.
- Add/remove item controls for repeatable content.
- Save controls with success feedback.

Dining has dedicated managers for venues, menus, and galleries. Homepage and other editors support structured sections rather than requiring HTML editing.

## 6. Admin sidebar — System

### Users — `/admin/users`

- Create, edit, and delete admin users.
- Set name, email, password, and role.
- Associate users with roles.

### Roles — `/admin/roles`

- Create, edit, and delete roles.
- Store permission lists.
- See how many users are assigned to each role.

### Navbar — `/admin/settings/navbar`

- Add, edit, reorder, hide, and delete primary navigation links.
- Set labels and href values.
- Add dropdown links under a navigation item.
- Toggle the global call-to-action button.
- Set the CTA label and destination.
- Save all changes at once.

### Footer — `/admin/settings/footer`

- Edit footer brand name, description, contact information, social links, and visibility.
- Manage Explore Links and Quick Links.
- Add new footer links that render as frontend list items.
- Reorder, hide, show, and delete links.
- Save changes through the footer settings editor.

### System Settings — `/admin/settings`

Global settings include:

- Heading font family.
- Body font family.
- Frontend heading size.
- Admin heading size.
- Body font size.
- Theme-related homepage settings.
- Payment method configuration.
- QR payment image upload.
- Loader image upload.

The page includes typography previews and separate save actions for theme and payment settings.

## 7. Data and content model

The application uses PostgreSQL with Prisma. Main entities are:

- `User` and `Role` — admin authentication and permissions.
- `Guest` — guest identity and contact information.
- `Amenity` — reusable hotel features.
- `Image` — category image records.
- `RoomCategory` — room type/category information.
- `Room` — individual room inventory and availability status.
- `Promotion` — discount and usage configuration.
- `Booking` — guest reservation, dates, room, amount, status, and payment details.
- `Review` — guest rating and moderation state.
- `Transaction` — income/expense and booking-linked financial records.
- `AnalyticsEvent` — event/value tracking records.
- `Setting` — database-backed application and page configuration.
- `ContactMessage` — messages submitted through the public contact form.

Important booking statuses include pending payment, pending, confirmed, checked in, checked out, and cancelled. Room statuses include available, occupied, maintenance, and cleaning.

## 8. API surface

The project exposes REST-style API routes for:

- Authentication.
- Users and roles.
- Guests.
- Rooms and room categories.
- Amenities.
- Promotions.
- Bookings.
- Reviews.
- Images.
- Settings.
- Finance and transactions.
- Analytics.
- Unread notifications.
- Uploads.
- Stripe payment-intent creation.

Server actions handle many content-management operations, including homepage, navbar, footer, page settings, contact messages, booking submission, payment settings, search, authentication, and room/category settings.

## 9. Authentication and access

- Admin routes are separated from public routes.
- Admin access is handled through the authentication layer and session-aware dashboard layout.
- Passwords are handled with bcrypt.
- The project uses NextAuth/Auth.js route integration and cookie-backed sessions.
- Admin navigation and user identity are rendered from the current session.

## 10. Uploads and payments

### Uploads

The upload route supports images used for:

- Room images.
- Category galleries.
- Gallery page media.
- Payment QR image.
- Loader image.
- Other CMS-managed media.

### Payments

The application supports a credit-card flow through Stripe-related dependencies and a QR/reference-ID flow. Payment settings are configurable from the System Settings screen. Bookings retain payment method, payment reference, and payment amount fields for admin review.

For a production demo, configure the required Stripe, database, authentication, upload, and email/environment values before presenting payment functionality.

## 11. Demo walkthrough

Recommended presentation order:

1. Open the homepage and highlight the hero, room discovery, amenities, dining, spa, experiences, testimonials, and footer.
2. Open a room category and then an individual room.
3. Select dates and demonstrate the booking form validation.
4. Submit a test booking and show the booking confirmation reference.
5. Sign in at `/admin/login`.
6. Open Dashboard and explain occupancy, guests, reviews, messages, and recent bookings.
7. Open Bookings and show the responsive booking cards and booking details.
8. Show Rooms, Categories, Amenities, and Promotions as the inventory/content operations workflow.
9. Show Reviews moderation and Messages management.
10. Open Pages and demonstrate changing public content.
11. Open Navbar and Footer settings to demonstrate no-code navigation and footer updates.
12. Open System Settings to demonstrate typography, loader, payment, and QR configuration.

## 12. Responsive behavior

The admin panel has responsive behavior for mobile, tablet, laptop, desktop, and wide displays:

- Mobile navigation uses a slide-out sidebar.
- Operations and System data tables become stacked cards below tablet/desktop breakpoints.
- Cards show field labels and “Tap to edit” affordances where applicable.
- Images move to the right side of image-bearing cards.
- Dialogs and forms fit narrow screens and scroll vertically when necessary.
- Long labels, URLs, emails, and reference values wrap instead of forcing horizontal page scrolling.
- Public media and forms are constrained to the available viewport.

## 13. Technology summary

- Next.js App Router.
- React.
- TypeScript.
- Tailwind CSS v4.
- shadcn/Base UI components.
- Prisma ORM.
- PostgreSQL.
- Auth.js/NextAuth integration.
- bcrypt.
- Stripe dependencies for payment processing.
- Supabase client dependency for hosted database/storage integration.
- Framer Motion and Swiper dependencies for interactive presentation.
- Recharts for dashboard visualizations.
- TipTap for rich text editing.
- Sonner for in-app notifications.

