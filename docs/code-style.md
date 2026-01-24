# Code Style Guide

These rules align with the project's conventions and ESLint configuration.

## Indentation
- Use 4 spaces for indentation across TS/JS/TSX/JSX.
- Switch cases are indented by 1 level.

## Parameters & Arguments
- Keep function and class parameters on a single line unless the line would exceed ~120 characters.
- When wrapping is needed, use consistent line breaks for parameters and call arguments.

## Naming
- Prefer intuitive, self-explanatory function and class names over code-level documentation.
- Use descriptive names that reflect intent (e.g., `ProductRepo`, `FirestoreProductsDs`).

## Line Length
- Aim for a soft limit of ~120 characters per line.
- Wrap parameters/arguments only when necessary; avoid gratuitous line breaks.

## UI & State Patterns
- Use existing shadcn/radix wrappers from `components/ui` and compose with `mergeClasses()`.
- Client state uses Zustand with `persist`; keep store shapes minimal and compute derived values via helpers.

## Client vs Server Components
- Default to server components; add `"use client"` only for interactivity.
- Keep server-only imports out of client components.

## Examples
- Parameters in one line:
  ```ts
  export function formatPrice(price: number): string { return price.toFixed(2); }
  ```
- Wrapped consistently when long:
  ```tsx
  function ProductForm({ product, onSuccess, onCancel }: {
      product?: ProductModel | null; onSuccess: () => void; onCancel: () => void;
  }) { /* ... */ }
  ```
