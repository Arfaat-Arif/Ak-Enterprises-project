// Extends Vitest's `expect` with jest-dom matchers (toBeInTheDocument, etc).
// Vitest picks this up automatically via the `setupFiles` entry in vite.config.ts.
import '@testing-library/jest-dom';
import { vi } from 'vitest';

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

// Mock framer-motion to avoid scroll ref hydration errors in test environment
vi.mock('framer-motion', async () => {
    const actual = await vi.importActual<typeof import('framer-motion')>('framer-motion');
    return {
        ...actual,
        useScroll: () => ({ scrollYProgress: { get: () => 0 } }),
        useTransform: () => ({ get: () => 0 }),
    };
});
