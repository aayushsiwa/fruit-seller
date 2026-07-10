export type SendEmailOptions = {
  to: string;
  subject: string;
  text?: string;
  html?: string;
  fromName?: string;
  fromAddress?: string;
};

export async function sendEmail(options: SendEmailOptions): Promise<boolean> {
  if (typeof window !== 'undefined') {
    throw new Error('sendEmail can only be executed server-side.');
  }

  const emailServiceUrl =
    process.env.EMAIL_SERVICE_URL || 'http://localhost:3001/api/send';
  const emailServiceApiKey = process.env.EMAIL_SERVICE_API_KEY;

  let targetUrl = emailServiceUrl;
  if (emailServiceApiKey) {
    const separator = emailServiceUrl.includes('?') ? '&' : '?';
    targetUrl = `${emailServiceUrl}${separator}key=${encodeURIComponent(emailServiceApiKey)}`;
  }

  const formData = new FormData();
  formData.append('profile', 'fruit-seller');
  formData.append('to', options.to);
  formData.append('subject', options.subject);

  if (options.text) {
    formData.append('text', options.text);
  }

  if (options.html) {
    const htmlBlob = new Blob([options.html], { type: 'text/html' });
    formData.append('html_file', htmlBlob, 'email.html');
  }

  if (options.fromName) {
    formData.append('from_name', options.fromName);
  }

  if (options.fromAddress) {
    formData.append('from_address', options.fromAddress);
  }

  try {
    const response = await fetch(targetUrl, {
      method: 'POST',
      body: formData,
    });

    if (response.ok) {
      return true;
    } else {
      const errorText = await response.text();
      console.error(
        'Email service failed with status:',
        response.status,
        errorText
      );
      return false;
    }
  } catch (error) {
    console.error('Failed to call email microservice:', error);
    return false;
  }
}
