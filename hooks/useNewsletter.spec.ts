import { act, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import useNewsletter from './useNewsletter';

describe('useNewsletter', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('returns null newsletterStatus initially', () => {
    const { result } = renderHook(() => useNewsletter());
    expect(result.current.newsletterStatus).toBeNull();
  });

  it('sets status to "success" and calls resetForm/setSubmitting after successful submit', async () => {
    const { result } = renderHook(() => useNewsletter());

    const setSubmitting = vi.fn();
    const resetForm = vi.fn();

    await act(async () => {
      const promise = result.current.handleNewsletterSubmit(
        { email: 'test@example.com' },
        { setSubmitting, resetForm }
      );
      vi.runAllTimers();
      await promise;
    });

    expect(result.current.newsletterStatus).toBe('success');
    expect(resetForm).toHaveBeenCalledOnce();
    expect(setSubmitting).toHaveBeenCalledWith(false);
  });
});
