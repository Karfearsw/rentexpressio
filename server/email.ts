import { Resend } from 'resend';

let connectionSettings: any;

async function getCredentials() {
  const hostname = process.env.REPLIT_CONNECTORS_HOSTNAME;
  const xReplitToken = process.env.REPL_IDENTITY 
    ? 'repl ' + process.env.REPL_IDENTITY 
    : process.env.WEB_REPL_RENEWAL 
    ? 'depl ' + process.env.WEB_REPL_RENEWAL 
    : null;

  if (!xReplitToken) {
    throw new Error('X_REPLIT_TOKEN not found for repl/depl');
  }

  connectionSettings = await fetch(
    'https://' + hostname + '/api/v2/connection?include_secrets=true&connector_names=resend',
    {
      headers: {
        'Accept': 'application/json',
        'X_REPLIT_TOKEN': xReplitToken
      }
    }
  ).then(res => res.json()).then(data => data.items?.[0]);

  if (!connectionSettings || (!connectionSettings.settings.api_key)) {
    throw new Error('Resend not connected');
  }
  return { apiKey: connectionSettings.settings.api_key, fromEmail: connectionSettings.settings.from_email };
}

export async function getResendClient() {
  const { apiKey, fromEmail } = await getCredentials();
  return {
    client: new Resend(apiKey),
    fromEmail
  };
}

export async function sendInvoiceEmail(toEmail: string, tenantName: string, amount: string, dueDate: string, description: string) {
  try {
    const { client, fromEmail } = await getResendClient();
    
    await client.emails.send({
      from: fromEmail || 'noreply@rentexpress.io',
      to: toEmail,
      subject: `Invoice: ${description}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h1 style="color: #1a1a1a;">Invoice from RentExpress</h1>
          <p>Hello ${tenantName},</p>
          <p>You have a new charge on your account:</p>
          <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 0;"><strong>Description:</strong> ${description}</p>
            <p style="margin: 10px 0 0;"><strong>Amount:</strong> $${amount}</p>
            <p style="margin: 10px 0 0;"><strong>Due Date:</strong> ${dueDate}</p>
          </div>
          <p>Please log in to your tenant portal to make a payment.</p>
          <p style="color: #666; font-size: 12px; margin-top: 30px;">This is an automated email from RentExpress.</p>
        </div>
      `
    });
    
    return { success: true };
  } catch (error) {
    console.error('Failed to send invoice email:', error);
    return { success: false, error };
  }
}

export async function sendReminderEmail(toEmail: string, tenantName: string, amount: string, dueDate: string, description: string) {
  try {
    const { client, fromEmail } = await getResendClient();
    
    await client.emails.send({
      from: fromEmail || 'noreply@rentexpress.io',
      to: toEmail,
      subject: `Payment Reminder: ${description}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h1 style="color: #e65100;">Payment Reminder</h1>
          <p>Hello ${tenantName},</p>
          <p>This is a friendly reminder that the following charge is due soon:</p>
          <div style="background: #fff3e0; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #e65100;">
            <p style="margin: 0;"><strong>Description:</strong> ${description}</p>
            <p style="margin: 10px 0 0;"><strong>Amount:</strong> $${amount}</p>
            <p style="margin: 10px 0 0;"><strong>Due Date:</strong> ${dueDate}</p>
          </div>
          <p>Please log in to your tenant portal to make a payment before the due date.</p>
          <p style="color: #666; font-size: 12px; margin-top: 30px;">This is an automated email from RentExpress.</p>
        </div>
      `
    });
    
    return { success: true };
  } catch (error) {
    console.error('Failed to send reminder email:', error);
    return { success: false, error };
  }
}

export async function sendReceiptEmail(toEmail: string, tenantName: string, amount: string, paidDate: string, description: string) {
  try {
    const { client, fromEmail } = await getResendClient();
    
    await client.emails.send({
      from: fromEmail || 'noreply@rentexpress.io',
      to: toEmail,
      subject: `Payment Receipt: ${description}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h1 style="color: #2e7d32;">Payment Received</h1>
          <p>Hello ${tenantName},</p>
          <p>Thank you for your payment! Here is your receipt:</p>
          <div style="background: #e8f5e9; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #2e7d32;">
            <p style="margin: 0;"><strong>Description:</strong> ${description}</p>
            <p style="margin: 10px 0 0;"><strong>Amount Paid:</strong> $${amount}</p>
            <p style="margin: 10px 0 0;"><strong>Date:</strong> ${paidDate}</p>
          </div>
          <p>This payment has been applied to your account.</p>
          <p style="color: #666; font-size: 12px; margin-top: 30px;">This is an automated email from RentExpress.</p>
        </div>
      `
    });
    
    return { success: true };
  } catch (error) {
    console.error('Failed to send receipt email:', error);
    return { success: false, error };
  }
}
