# Settings Functionality Implementation Tasks

- `[x]` **Backend: Avatar Uploads (multer)**
  - `[x]` Configure `multer` for `/uploads/avatars`
  - `[x]` Expose static `uploads` folder in `server/index.js`
  - `[x]` Update `PUT /api/auth/profile` to handle `avatar` file upload

- `[x]` **Backend: Security & Passwords**
  - `[x]` Update `PUT /api/auth/profile` to verify `currentPassword` with bcrypt
  - `[x]` Ensure new password hashes properly before save
  - `[x]` Build real logic for `GET /api/auth/sessions` and logout endpoints

- `[x]` **Backend: Support Tickets**
  - `[x]` Create `SupportTicket.js` MongoDB schema
  - `[x]` Create `POST /api/settings/support` route in `settings.js`

- `[x]` **Frontend: Profile Image Upload**
  - `[x]` Update `MyProfile.jsx` to use `<input type="file" />`
  - `[x]` Map local image display or database URL dynamically
  - `[x]` Ensure form sends `FormData`

- `[x]` **Frontend: i18n Translation System**
  - `[x]` Install `i18next` and `react-i18next`
  - `[x]` Setup `client/src/i18n.js` with language JSON files
  - `[x]` Hook `LanguageSettings.jsx` to `i18n.changeLanguage()`
  - `[x]` Apply `useTranslation()` globally (Layout, Nav, Dashboard, Reports)

- `[x]` **Frontend: Global Theming (Appearance)**
  - `[x]` Create `client/src/context/ThemeProvider.jsx`
  - `[x]` Implement `dark` mode injection into `<html>`
  - `[x]` Inject CSS variables for Accent Colors and Font Sizes
  - `[x]` Wrap `App.jsx` in `<ThemeProvider>`

- `[x]` **Frontend: Support Tickets & Sign Out**
  - `[x]` Build real submit handler for `HelpSupport.jsx`
  - `[x]` Verify `SignOut.jsx` calls invalidate APIs properly
