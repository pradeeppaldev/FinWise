# FinWise Frontend Sitemap

## Page Hierarchy and Routes

```mermaid
graph TD
    A[App.jsx] --> B[Public Routes]
    A --> C[Auth Routes]
    A --> D[Protected Routes]

    B --> B1[LandingPage<br/>/]
    
    C --> C1[AuthLayout]
    C1 --> C11[LoginPage<br/>/auth/login]
    C1 --> C12[RegisterPage<br/>/auth/register]
    C1 --> C13[VerifyPage<br/>/auth/verify]
    C1 --> C14[ForgotPasswordPage<br/>/auth/forgot]
    C1 --> C15[ResetPasswordPage<br/>/auth/reset]
    
    D --> D1[MainLayout<br/>/dashboard]
    D1 --> D11[DashboardPage<br/>/dashboard]
    
    D1 --> D2[Expenses<br/>/expenses]
    D1 --> D3[Budgets<br/>/budgets]
    D1 --> D4[Goals<br/>/goals]
    D1 --> D5[Learning<br/>/learning]
    D1 --> D6[Community<br/>/community]
```

## Component Hierarchy

```mermaid
graph TD
    A[App.jsx] --> B[AuthProvider]
    B --> C[Router]
    C --> D[Routes]
    
    D --> E[MainLayout]
    E --> F[Navbar]
    E --> G[Sidebar]
    E --> H[main content]
    
    D --> I[AuthLayout]
    I --> J[Auth pages]
    
    H --> K[Protected Routes]
    K --> L[DashboardPage]
    
    F --> F1[Navigation Links]
    F --> F2[User Menu]
    
    G --> G1[Navigation Items]
    G --> G2[User Profile]
```

## Key Components

1. **Layouts**
   - MainLayout.jsx - Main application layout with Navbar and Sidebar
   - AuthLayout.jsx - Layout for authentication pages

2. **Pages**
   - LandingPage.jsx - Home page for unauthenticated users
   - LoginPage.jsx - User login page
   - RegisterPage.jsx - User registration page
   - VerifyPage.jsx - Email verification page
   - ForgotPasswordPage.jsx - Password reset request page
   - ResetPasswordPage.jsx - Password reset page
   - DashboardPage.jsx - Main dashboard for authenticated users

3. **Components**
   - Navbar.jsx - Top navigation bar
   - Sidebar.jsx - Side navigation menu
   - FormInput.jsx - Reusable form input component
   - Button.jsx - Reusable button component
   - Card.jsx - Reusable card component
   - LoadingSpinner.jsx - Loading indicator
   - ErrorBanner.jsx - Error display component
   - ProtectedRoute.jsx - Route protection component

4. **Contexts**
   - AuthContext.jsx - Authentication state management

5. **Utilities**
   - api.js - Axios instance with interceptors

## Styling

- Tailwind CSS for utility-first styling
- Custom CSS variables for consistent theming
- Responsive design for mobile and desktop
- Gradient backgrounds and modern UI elements