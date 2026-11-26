import { Component, type ErrorInfo, type ReactNode } from 'react';
import { BAKERY_PHONE_DISPLAY, BAKERY_PHONE_HREF } from '../data/menuData';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('Uncaught application error:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-bakery-page px-4 text-center text-bakery-ink">
          <h1 className="mb-2 font-display text-2xl font-bold">Что-то пошло не так</h1>
          <p className="mb-4 max-w-md text-sm text-bakery-textMuted">
            Попробуйте обновить страницу или позвоните в пекарню напрямую для оформления заказа.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="rounded-xl bg-bakery-charcoal px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-bakery-charcoalHover"
            >
              Обновить страницу
            </button>
            <a
              href={BAKERY_PHONE_HREF}
              className="rounded-xl border border-bakery-border bg-bakery-surface px-4 py-2 text-sm font-semibold text-bakery-ink"
            >
              {BAKERY_PHONE_DISPLAY}
            </a>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
