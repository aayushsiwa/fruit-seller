import '@testing-library/jest-dom';
import fetchMock from 'jest-fetch-mock';

fetchMock.enableMocks();

// Mock console.error globally
beforeEach(() => {
    jest.spyOn(console, "error").mockImplementation(() => {});
});

afterEach(() => {
    jest.spyOn(console, "error").mockRestore();
});

global.IntersectionObserver = class IntersectionObserver {
    root: Element | null = null;
    rootMargin: string = '';
    thresholds: ReadonlyArray<number> = [];

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    constructor(_: IntersectionObserverCallback, __?: IntersectionObserverInit) {}
    observe() {}
    disconnect() {}
    unobserve() {}
    takeRecords(): IntersectionObserverEntry[] { return []; }
};