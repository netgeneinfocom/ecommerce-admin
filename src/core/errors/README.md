# Error Handling

Centralized error handling utilities and components for consistent error management across the application.

## Components

### ErrorBoundary

React Error Boundary component that catches JavaScript errors anywhere in the component tree and displays a fallback UI.

```tsx
import { ErrorBoundary } from "@/core/errors";

<ErrorBoundary>
  <YourComponent />
</ErrorBoundary>
```

## Utilities

### handleError

Normalizes different error types into a consistent `AppError` format.

```tsx
import { handleError } from "@/core/errors";

try {
  // some code
} catch (error) {
  const appError = handleError(error);
  console.log(appError.message);
}
```

### showErrorToast

Displays an error toast notification to the user.

```tsx
import { showErrorToast } from "@/core/errors";

try {
  // some code
} catch (error) {
  showErrorToast(error);
}
```

### ApplicationError

Custom error class for application-specific errors with additional context.

```tsx
import { ApplicationError } from "@/core/errors";

throw new ApplicationError(
  "Failed to load data",
  "LOAD_ERROR",
  500,
  { userId: 123 }
);
```

### getErrorMessage

Extracts a user-friendly error message from any error type.

```tsx
import { getErrorMessage } from "@/core/errors";

const message = getErrorMessage(error);
```

### isNetworkError

Checks if an error is network-related.

```tsx
import { isNetworkError } from "@/core/errors";

if (isNetworkError(error)) {
  // Handle network error
}
```

## Integration

The error handling system is integrated at the root level:

- **ErrorBoundary** wraps the entire app in `RootProvider`
- **QueryClient** is configured to automatically show toast notifications for mutation errors
- All errors are logged to the console for debugging

## Best Practices

1. Use `showErrorToast` for user-facing errors
2. Use `ApplicationError` for custom application errors with context
3. Wrap critical sections in try-catch blocks
4. Let React Query handle API errors automatically
5. Use `ErrorBoundary` around route components for isolation
