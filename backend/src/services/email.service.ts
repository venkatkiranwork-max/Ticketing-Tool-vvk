export interface WelcomeEmailData {
  recipientName: string;
  email: string;
  temporaryPassword: string;
  loginUrl?: string;
  companyName?: string;
}

export interface ResetPasswordEmailData {
  recipientName: string;
  email: string;
  temporaryPassword: string;
  loginUrl?: string;
}

export class EmailService {
  /**
   * Generates formatted HTML & Plain Text Welcome Email content
   */
  static generateWelcomeEmail(data: WelcomeEmailData) {
    const company = data.companyName || 'ABC Technologies';
    const loginUrl = data.loginUrl || 'https://ticketflow.company.com/login';

    const subject = `Welcome to ${company}`;
    const text = `
Hello ${data.recipientName},

Your TicketFlow account has been created successfully.

Email:
${data.email}

Temporary Password:
${data.temporaryPassword}

Please sign in using the link below and change your password.

${loginUrl}

Regards,
${company} IT Team
    `.trim();

    return { subject, text };
  }

  /**
   * Generates formatted HTML & Plain Text Reset Password Email content
   */
  static generateResetPasswordEmail(data: ResetPasswordEmailData) {
    const loginUrl = data.loginUrl || 'https://ticketflow.company.com/login';

    const subject = `TicketFlow Password Reset`;
    const text = `
Hello ${data.recipientName},

Your TicketFlow account password has been reset by an administrator.

Email:
${data.email}

New Temporary Password:
${data.temporaryPassword}

Please sign in using the link below and change your password immediately.

${loginUrl}

Regards,
TicketFlow Support Team
    `.trim();

    return { subject, text };
  }

  /**
   * Send / Log Welcome Email
   */
  static async sendWelcomeEmail(data: WelcomeEmailData): Promise<boolean> {
    const emailContent = this.generateWelcomeEmail(data);
    console.log(`[EMAIL SERVICE] Sending Welcome Email to ${data.email}:`);
    console.log(emailContent.text);
    return true;
  }

  /**
   * Send / Log Reset Password Email
   */
  static async sendResetPasswordEmail(data: ResetPasswordEmailData): Promise<boolean> {
    const emailContent = this.generateResetPasswordEmail(data);
    console.log(`[EMAIL SERVICE] Sending Reset Password Email to ${data.email}:`);
    console.log(emailContent.text);
    return true;
  }
}

export async function sendPasswordResetEmail(email: string, resetUrl: string): Promise<boolean> {
  console.log(`[EMAIL SERVICE] Sending Password Reset Link to ${email}: ${resetUrl}`);
  return true;
}
