# Fully Functional Settings Module Implementation Plan

This plan details the process of connecting the existing Settings UI to robust, production-ready backend features and global frontend state integrations.

## User Review Required

> [!IMPORTANT]
> 1. **i18n Implementation**: I will install `react-i18next` and `i18next` to manage translations. Because translating the *entire* application manually takes immense time, I will set up the translation infrastructure, provide translation JSON files for the core UI (Nav, Dashboard, Settings, etc.), and ensure that switching languages updates these core texts globally.
> 2. **Global Appearance**: I will build a `ThemeProvider` context that injects Tailwind classes and CSS variables into the root `<html>` element based on the user's `appearance` settings fetched from the database, effectively applying Dark Mode, Accent Colors, Font Sizes, and Layout changes globally.

## Open Questions

> [!WARNING]
> 1. **Profile Image Storage**: I will use `multer` to save uploaded profile images locally to a `public/uploads` folder on the backend, and store the relative URL string in MongoDB. Does this align with how you currently store uploaded medical reports?
> 2. **Support Ticket Routing**: When a user submits a "Contact Support" form, I will save it to a new `SupportTicket` MongoDB collection. Do you want email notifications to be triggered on the backend (e.g., via Nodemailer) or just database persistence for now?

---

## Proposed Changes

### 1. Profile Page (Image Upload & Email Update)
- **Backend**:
  - Implement a `multer` middleware in `server/routes/auth.js` to handle single image uploads to `uploads/avatars`.
  - Update the `PUT /api/auth/profile` route to process the `avatar` path if an image was uploaded.
  - Support updating `email` and validating uniqueness.
- **Frontend**:
  - Update `MyProfile.jsx` to handle an `<input type="file" />` over the camera icon.
  - Modify `updateProfile` API service to send `multipart/form-data` when an image is present.
  - Enable the disabled email field.

### 2. Language Settings (react-i18next)
- **Frontend**:
  - Install `i18next` and `react-i18next`.
  - Create `client/src/i18n.js` to configure the system.
  - Create translation JSON files (e.g. `client/src/locales/en.json`, `hi.json`, `es.json`) for core application text.
  - Wrap the app in `<I18nextProvider>` or initialize centrally.
  - Update `LanguageSettings.jsx` to call `i18n.changeLanguage()` immediately upon saving the preference to MongoDB.
  - Apply `useTranslation` hooks to Navbars and Settings UI to demonstrate global reactivity.

### 3. Security Settings (Password Validation & Sessions)
- **Backend**:
  - Update `PUT /api/auth/profile` to accept `currentPassword` and `newPassword`. Validate `currentPassword` against the hashed password in MongoDB using `bcrypt.compare` before updating.
  - Modify the login flow to push a new session token string and device info to the `user.sessions` array.
  - Create `POST /api/auth/sessions/:id/logout` to revoke a specific session.
  - Create `POST /api/auth/sessions/logout-all` to clear all tokens except the current one.
- **Frontend**:
  - Update `SecuritySettings.jsx` to map active sessions returned from `GET /api/auth/sessions` and add a "Logout Device" button.
  - Include the `currentPassword` field in the password update payload.

### 4. Appearance Settings (Global Theming)
- **Frontend**:
  - Create a new `ThemeProvider.jsx` (or merge logic into `Layout.jsx`/`App.jsx`) that listens to `settings.appearance`.
  - Dynamically add/remove the `dark` class from `document.documentElement` based on `theme`.
  - Apply CSS variables for the chosen `accentColor` globally.
  - Apply CSS classes for `fontSize` (e.g., scale up rem bases) and `layout` (adjust max-widths/padding).

### 5. Help & Support (Support Tickets)
- **Backend**:
  - Create `server/models/SupportTicket.js` (fields: `userId`, `subject`, `message`, `status`).
  - Create `POST /api/settings/support` route to save the ticket.
- **Frontend**:
  - Update `HelpSupport.jsx` to include a functional form replacing the dummy buttons.
  - Call the new API to save the ticket, showing a success Toast on completion.

### 6. Sign Out
- **Backend/Frontend**:
  - Ensure `/logout-all` invalidates the DB array of tokens.
  - The frontend `SignOut.jsx` properly calls `logoutAllSessions()` and clears local storage.

## Verification Plan
1. **Upload Photo**: Verify multer creates the file and MongoDB stores the URL.
2. **Theming**: Toggle dark mode and red accent color in Appearance; verify the entire app reflects the changes instantly.
3. **i18n**: Change language to Hindi; verify the UI strings update using `react-i18next`.
4. **Security**: Validate current password requirement when setting a new password. Verify active sessions map correctly to multiple logged-in browsers.
