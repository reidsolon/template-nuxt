# Project Structure & Code Organization

## Overview

This document outlines the project structure, naming conventions, and code organization standards for this Nuxt 3 application template with Vite, Pinia, and Tailwind CSS.

## Core Technologies & Versions

### Dependencies
- **Nuxt**: ^3.17.6 (Vue 3 framework)
- **Vue**: ^3.5.17 (Frontend framework)
- **Pinia**: ^3.0.3 (State management)
- **Tailwind CSS**: ^6.14.0 (Utility-first CSS framework)
- **TypeScript**: Built-in with Nuxt 3
- **ESLint**: ^9.30.1 (Linting)
- **Prettier**: ^3.6.2 (Code formatting)
- **Vite**: Built-in with Nuxt 3 (Build tool)

### Development Tools
- **Vitest**: Testing framework
- **Better SQLite3**: ^11.10.0 (Database)
- **Nuxt Icon**: ^1.15.0 (Icon system)
- **Nuxt Image**: ^1.10.0 (Image optimization)
- **Auto Import**: ^19.3.0 (Automatic imports)

## File & Folder Structure

### Root Directory
```
/
├── assets/                 # Static assets (CSS, images)
├── components/             # Global shared components
├── modules/               # Feature-specific modules
├── pages/                 # Route pages
├── plugins/               # Nuxt plugins
├── public/                # Static files
├── rules/                 # Development guidelines
├── server/                # Server-side code
├── stores/                # Global Pinia stores
├── types/                 # Global TypeScript types
├── utils/                 # Global utility functions
├── app.vue                # Main app component
├── nuxt.config.ts         # Nuxt configuration
├── package.json           # Dependencies
└── tsconfig.json          # TypeScript configuration
```

### Module Structure (Feature-Based)
```
modules/
└── [module-name]/
    ├── _components/       # Module-specific components
    ├── _composables/      # Module-specific composables
    ├── _stores/           # Module-specific Pinia stores
    ├── _types/            # Module-specific TypeScript types
    ├── _utils/            # Module-specific utilities
    └── _assets/           # Module-specific assets (optional)
```

### Components Organization
```
components/
├── global/                # App-wide components (Header, Footer, Navigation)
├── ui/                    # Reusable UI components (Base components)
└── [feature]/             # Feature-specific shared components
```

## Naming Conventions

### File & Directory Naming

#### Folders
- **Global folders**: `kebab-case` (e.g., `components`, `server-api`)
- **Module-specific folders**: `_kebab-case` with underscore prefix (e.g., `_components`, `_stores`)
- **Feature folders**: `kebab-case` (e.g., `user-profile`, `todo-list`)

#### Files
- **Components**: `PascalCase.vue` (e.g., `UserProfile.vue`, `TodoItem.vue`)
- **Pages**: `kebab-case.vue` (e.g., `index.vue`, `user-profile.vue`)
- **Composables**: `use-kebab-case.ts` (e.g., `use-todo-manager.ts`)
- **Stores**: `kebab-case.ts` (e.g., `todo.ts`, `user-profile.ts`)
- **Types**: `kebab-case.ts` (e.g., `todo.ts`, `api-response.ts`)
- **Utilities**: `kebab-case.ts` (e.g., `date-helpers.ts`)
- **Plugins**: `camelCase.ts` (e.g., `apiClient.ts`, `authProvider.ts`)

### Code Naming Conventions

#### Variables & Functions
- **Functions**: `camelCase` (e.g., `getUserProfile`, `calculateTotal`)
- **Variables**: `camelCase` (e.g., `userProfile`, `todoItems`)
- **Constants**: `SCREAMING_SNAKE_CASE` (e.g., `API_BASE_URL`, `MAX_RETRY_COUNT`)

#### Classes & Types
- **Classes**: `PascalCase` (e.g., `UserService`, `TodoManager`)
- **Interfaces**: `PascalCase` (e.g., `TodoItem`, `ApiResponse`)
- **Types**: `PascalCase` (e.g., `UserRole`, `TodoStatus`)
- **Enums**: `PascalCase` (e.g., `TodoPriority`, `UserStatus`)

#### Database (if applicable)
- **Tables**: `snake_case` (e.g., `user_profiles`, `todo_items`)
- **Columns**: `snake_case` (e.g., `created_at`, `user_id`)
- **Indexes**: `snake_case` (e.g., `idx_user_email`, `idx_todo_status`)

#### CSS Classes
- **Tailwind**: Use utility classes as-is
- **Custom classes**: `kebab-case` (e.g., `custom-button`, `hero-section`)

## Component Guidelines

### Base Components
Located in `components/ui/`, prefixed with `Base`:
- `BaseButton.vue`
- `BaseInput.vue`
- `BaseCard.vue`
- `BaseModal.vue`

### Global Components
Located in `components/global/`:
- `AppHeader.vue`
- `AppFooter.vue`
- `AppNavigation.vue`

### Feature Components
Located in `components/[feature]/` or `modules/[module]/_components/`:
- `UserProfile.vue`
- `TodoList.vue`
- `DashboardStats.vue`

## Store Organization

### Global Stores
Located in `stores/`:
```typescript
// stores/auth.ts
export const useAuthStore = defineStore('auth', () => {
  // Store logic
})
```

### Module Stores
Located in `modules/[module]/_stores/`:
```typescript
// modules/todo/_stores/todo.ts
export const useTodoStore = defineStore('todo', () => {
  // Store logic
})
```

## Composables Organization

### Global Composables
Located in `composables/`:
```typescript
// composables/use-auth.ts
export const useAuth = () => {
  // Composable logic
}
```

### Module Composables
Located in `modules/[module]/_composables/`:
```typescript
// modules/todo/_composables/use-todo-manager.ts
export const useTodoManager = () => {
  // Composable logic
}
```

## Type Definitions

### Global Types
Located in `types/`:
```typescript
// types/api.ts
export interface ApiResponse<T> {
  data: T
  message: string
  status: number
}
```

### Module Types
Located in `modules/[module]/_types/`:
```typescript
// modules/todo/_types/todo.ts
export interface TodoItem {
  id: string
  title: string
  completed: boolean
  createdAt: Date
  updatedAt: Date
}
```

## Module-Specific vs Shared Code

### Shared Code (Global)
Use for code that is used across multiple modules:
- **Location**: Root-level directories (`components/`, `composables/`, `stores/`, `types/`, `utils/`)
- **Examples**: Authentication, UI components, API client, common utilities

### Module-Specific Code
Use for code that belongs to a specific feature:
- **Location**: `modules/[module]/_*` directories
- **Examples**: Todo management, user profile, dashboard analytics
- **Prefix**: Use underscore prefix (`_components`, `_stores`, etc.)

## Auto-Import Configuration

The project uses Nuxt's auto-import feature:
- **Components**: Auto-imported from `components/` and `modules/*/_components/`
- **Composables**: Auto-imported from `composables/` and `modules/*/_composables/`
- **Stores**: Configured in `nuxt.config.ts` for both global and module stores
- **Utils**: Auto-imported from `utils/` directory

## File Organization Best Practices

### 1. Feature-Based Organization
Group related functionality together in modules:
```
modules/todo/
├── _components/TodoList.vue
├── _composables/use-todo-manager.ts
├── _stores/todo.ts
├── _types/todo.ts
└── _utils/todo-helpers.ts
```

### 2. Separation of Concerns
- **Components**: UI presentation logic
- **Composables**: Business logic and state management
- **Stores**: Global state management
- **Types**: TypeScript definitions
- **Utils**: Pure utility functions

### 3. Import Organization
Follow this order in imports:
1. Vue/Nuxt imports
2. Third-party libraries
3. Internal composables/stores
4. Internal components
5. Internal types/interfaces
6. Internal utilities

```typescript
// Vue/Nuxt imports
import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

// Third-party libraries
import { z } from 'zod'

// Internal imports
import { useAuth } from '~/composables/use-auth'
import type { TodoItem } from '~/types/todo'
import { formatDate } from '~/utils/date-helpers'
```

## Development Scripts

```json
{
  "dev": "nuxt dev",
  "build": "nuxt build",
  "generate": "nuxt generate",
  "preview": "nuxt preview",
  "lint": "eslint . --ext .vue,.js,.ts,.tsx,.jsx --fix",
  "format": "prettier . --write"
}
```

## Additional Notes

- Follow the guidelines in `/rules/*.md` for specific component, composable, store, and styling rules
- Use TypeScript for all code files
- Leverage Nuxt's auto-import capabilities
- Follow the established naming conventions consistently
- Keep module-specific code isolated within their respective directories
- Use the todo module as a reference implementation for new modules
