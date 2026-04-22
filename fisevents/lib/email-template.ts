export function applyTemplate(template: string, vars: Record<string, string>): string {
  return Object.entries(vars).reduce(
    (result, [key, value]) => result.replaceAll(`%${key}%`, value),
    template
  );
}

export function emailTemplate({
  content,
  subject,
}: {
  content: string;
  subject?: string;
}): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${subject ?? 'FisEvents'}</title>
</head>
<body style="margin:0;padding:0;background-color:#f9f9ff;font-family:Arial,Helvetica,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="background-color:#f9f9ff;">
    <tr>
      <td align="center" style="padding:32px 16px;">
        <table width="600" cellpadding="0" cellspacing="0" role="presentation" style="max-width:600px;width:100%;background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 2px 12px rgba(0,0,0,0.08);">
          <!-- Header -->
          <tr>
            <td style="background:#f97316;padding:24px 32px;text-align:center;">
              <span style="display:inline-block;font-size:22px;font-weight:700;color:#ffffff;letter-spacing:0.5px;font-family:Arial,Helvetica,sans-serif;">
                Fis<span style="color:#ffdbca;">Events</span>
              </span>
            </td>
          </tr>
          <!-- Body -->
          <tr>
            <td style="padding:36px 40px;color:#1a1a2e;font-size:15px;line-height:1.7;">
              ${content}
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="background:#f3f4f6;padding:20px 40px;text-align:center;border-top:1px solid #e5e7eb;">
              <p style="margin:0;font-size:12px;color:#9ca3af;font-family:Arial,Helvetica,sans-serif;">
                © ${new Date().getFullYear()} FisEvents · fisevents.com
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}
