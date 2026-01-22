# Clean Feature-Based Folder Structure

## ✅ Clean & Modular Architecture

```
frontend/
├── src/
│   ├── main.tsx                         # ✅ Vite entry file
│   ├── App.tsx                          # ✅ Root app component
│   ├── index.css                        # ✅ Global CSS entry
│
│   ├── pages/                           # ✅ Page-level routes
│   │   ├── auth/                        # Authentication pages
│   │   │   ├── Login.tsx
│   │   │   └── Register.tsx
│   │   ├── dashboard/                   # Dashboard pages
│   │   │   ├── Dashboard.tsx            # Main dashboard layout
│   │   │   ├── DashboardHome.tsx
│   │   │   ├── Users.tsx & UserForm.tsx
│   │   │   ├── Products.tsx & ProductForm.tsx
│   │   │   ├── Orders.tsx & OrderDetail.tsx
│   │   │   ├── Categories.tsx & CategoryForm.tsx
│   │   │   ├── SubCategories.tsx & SubCategoryForm.tsx
│   │   │   └── Brand.tsx & BrandForm.tsx
│   │   ├── Index.tsx                    # Landing page
│   │   └── Error.tsx                    # 404 page
│
│   ├── features/                        # ⚡ Feature modules
│   │   ├── auth/                        # Authentication feature
│   │   │   ├── components/
│   │   │   │   ├── AuthCard.tsx
│   │   │   │   ├── AuthDivider.tsx
│   │   │   │   ├── AuthTabs.tsx
│   │   │   │   ├── PasswordStrengthIndicator.tsx
│   │   │   │   ├── ProviderButtons.tsx
│   │   │   │   ├── SocialLoginButton.tsx
│   │   │   │   └── index.ts             # Component exports
│   │   │   └── index.ts                 # Feature exports
│   │   │
│   │   └── dashboard/                   # Dashboard feature
│   │       ├── components/
│   │       │   ├── AppSidebar.tsx       # Main sidebar
│   │       │   ├── DashboardHeader.tsx  # Top header
│   │       │   ├── ProfileMenu.tsx      # User profile menu
│   │       │   └── index.ts             # Component exports
│   │       └── index.ts                 # Feature exports
│
│   ├── components/                      # ♻️ Shared components
│   │   ├── ui/                          # Shadcn UI components (42+ components)
│   │   │   ├── button.tsx, input.tsx, card.tsx
│   │   │   ├── dialog.tsx, dropdown-menu.tsx
│   │   │   ├── table.tsx, form.tsx
│   │   │   └── ... (all UI primitives)
│   │   └── NavLink.tsx                  # Shared navigation component
│
│   ├── core/                            # 🧠 Core application logic
│   │   ├── providers/
│   │   │   └── RootProvider.tsx         # Wraps QueryClient, Theme, Toast
│   │   ├── config/
│   │   │   └── routes.ts                # Route constants & helpers
│   │   ├── hooks/
│   │   │   ├── use-toast.ts             # Toast notifications
│   │   │   ├── use-mobile.tsx           # Mobile detection
│   │   │   └── index.ts                 # Hook exports
│   │   └── utils/
│   │       └── index.ts                 # Utility functions (cn, etc.)
│
│   └── styles/                          # 🎨 Global styles
│       └── theme.css                    # Tailwind + CSS variables
│
├── public/                              # 🖼️ Static assets
│   ├── robots.txt
│   └── ...
│
├── vite.config.ts
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```