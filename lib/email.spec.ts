// @vitest-environment node
import { sendEmail } from './email';

describe('sendEmail()', () => {
  const originalEnv = process.env;
  const originalWindow = (global as any).window;

  beforeEach(() => {
    vi.restoreAllMocks();
    process.env = {
      ...originalEnv,
      EMAIL_SERVICE_URL: 'http://mock-email-service/api/send',
      EMAIL_SERVICE_API_KEY: 'mock-key',
    };
    // Simulate server environment by ensuring window is undefined
    delete (global as any).window;
  });

  afterEach(() => {
    process.env = originalEnv;
    if (originalWindow) {
      (global as any).window = originalWindow;
    }
  });

  it('should send email successfully', async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      text: async () => 'success',
    });
    global.fetch = mockFetch;

    const success = await sendEmail({
      to: 'test@example.com',
      subject: 'Test Subject',
      text: 'Test Text',
      html: '<h1>Test HTML</h1>',
      fromName: 'Test Sender',
      fromAddress: 'sender@example.com',
    });

    expect(success).toBe(true);
    expect(mockFetch).toHaveBeenCalledTimes(1);

    const [calledUrl, calledOptions] = mockFetch.mock.calls[0];
    expect(calledUrl).toContain(
      'http://mock-email-service/api/send?key=mock-key'
    );
    expect(calledOptions.method).toBe('POST');
    expect(calledOptions.body).toBeInstanceOf(FormData);
  });

  it('should return false when fetch fails', async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 500,
      text: async () => 'Internal Server Error',
    });
    global.fetch = mockFetch;

    const success = await sendEmail({
      to: 'test@example.com',
      subject: 'Test Subject',
    });

    expect(success).toBe(false);
  });

  it('should throw error when executed in browser environment', async () => {
    (global as any).window = {};

    await expect(
      sendEmail({
        to: 'test@example.com',
        subject: 'Test Subject',
      })
    ).rejects.toThrow('sendEmail can only be executed server-side.');
  });
});
