// Extends Vitest's `expect` with jest-dom matchers (toBeInTheDocument, etc).
// Vitest picks this up automatically via the `setupFiles` entry in vite.config.ts.
import '@testing-library/jest-dom';

if (typeof window.IntersectionObserver === 'undefined') {
    class IntersectionObserverMock implements IntersectionObserver {
        readonly root = null;
        readonly rootMargin = '';
        readonly scrollMargin = '';
        readonly thresholds: readonly number[] = [];

        disconnect(): void { }
        observe(): void { }
        takeRecords(): IntersectionObserverEntry[] { return []; }
        unobserve(): void { }
    }

    window.IntersectionObserver = IntersectionObserverMock;
}
