import "jsr:@supabase/functions-js/edge-runtime.d.ts"

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')
const FROM_EMAIL = 'hello@archbysha.com'
const DOWNLOAD_LINK = 'https://drive.google.com/drive/folders/1cVcmiL-fo3o--aA-2YnXTO5UkF_3ERHc'
const WHATSAPP_LINK = 'https://wa.me/919198747810'

Deno.serve(async (req) => {
    // Handle CORS
    if (req.method === 'OPTIONS') {
        return new Response('ok', {
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': '*',
                'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
            },
        })
    }

    if (req.method !== 'POST') {
        return new Response('Method Not Allowed', { status: 405 })
    }

    try {
        const bodyText = await req.text()
        const params = new URLSearchParams(bodyText)

        const paymentStatus = params.get('payment_status')
        const payerEmail = params.get('payer_email')
        const customEmail = params.get('custom')
        const email = customEmail || payerEmail
        const firstName = params.get('first_name') || ''
        const lastName = params.get('last_name') || ''
        const customerName = (firstName || lastName) ? `${firstName} ${lastName}`.trim() : 'there'
        const txnId = params.get('txn_id') || ('PAYPAL-' + Date.now())
        const mcGross = params.get('mc_gross') || '49.00'

        console.log('[PayPal IPN Received]', {
            paymentStatus,
            email,
            customerName,
            txnId,
            mcGross
        })

        // Verify IPN with PayPal (optional verification step)
        const verifyBody = 'cmd=_notify-validate&' + bodyText
        try {
            const verifyRes = await fetch('https://ipnpb.paypal.com/cgi-bin/webscr', {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: verifyBody
            })
            const verifyText = await verifyRes.text()
            console.log('[PayPal IPN Verification]', verifyText)
        } catch (vErr) {
            console.warn('[PayPal IPN Verification warning]', vErr)
        }

        // Only dispatch books if payment is Completed
        if (paymentStatus === 'Completed' || paymentStatus === 'Processed') {
            if (!email) {
                console.error('[PayPal IPN] No recipient email found')
                return new Response('OK - No email', { status: 200 })
            }

            console.log(`[PayPal IPN] Dispatching 6 books to ${email}...`)

            // Call send-book-mail or Resend directly
            if (RESEND_API_KEY) {
                const htmlBody = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="margin:0; padding:0; background-color:#f8f6f2; font-family:-apple-system, BlinkMacSystemFont, sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff; border-radius:16px; overflow:hidden; box-shadow:0 4px 24px rgba(0,0,0,0.06);">
          <tr>
            <td style="background:#1a1a2e; padding:40px; text-align:center;">
              <h1 style="color:#ffffff; margin:0 0 8px;">Payment Successful!</h1>
              <p style="color:#a7f3d0; margin:0; font-size:14px;">Your 6-Book Interior Design Collection is ready</p>
            </td>
          </tr>
          <tr>
            <td style="padding:32px 40px;">
              <p style="color:#374151; font-size:16px;">Hi <strong>${customerName}</strong>,</p>
              <p style="color:#6b7280; font-size:15px; line-height:1.6;">
                Thank you for purchasing the <strong>AVADA 6-Book Interior & Exterior Design Architecture System</strong> via PayPal!
              </p>
              <p style="color:#6b7280; font-size:13px;">Transaction ID: <strong>${txnId}</strong></p>
              <div style="text-align:center; margin:32px 0;">
                <a href="${DOWNLOAD_LINK}" target="_blank" style="display:inline-block; background:#ea580c; color:#ffffff; font-size:16px; font-weight:800; text-decoration:none; padding:16px 40px; border-radius:12px; text-transform:uppercase;">
                  ⬇️ Download Your Books Now
                </a>
              </div>
              <p style="color:#9ca3af; font-size:12px; text-align:center;">
                Direct Google Drive Library: <a href="${DOWNLOAD_LINK}" style="color:#ea580c;">${DOWNLOAD_LINK}</a>
              </p>
              <div style="border-top:1px solid #e5e7eb; margin-top:24px; padding-top:16px; text-align:center;">
                <p style="color:#6b7280; font-size:13px;">Need help? WhatsApp us at <a href="${WHATSAPP_LINK}" style="color:#25d366; font-weight:bold;">+91 91987 47810</a></p>
              </div>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`

                const resendRes = await fetch('https://api.resend.com/emails', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${RESEND_API_KEY}`,
                    },
                    body: JSON.stringify({
                        from: `Interior Design Books <${FROM_EMAIL}>`,
                        to: [email],
                        subject: '📚 Your Interior Design Books Are Ready! (PayPal Confirmation)',
                        html: htmlBody,
                    })
                })
                const resendData = await resendRes.json()
                console.log('[PayPal IPN Resend Success]', resendData)
            } else {
                // Fallback to local send-book-mail invocation
                await fetch('https://dhufnozehayzjlsmnvdl.supabase.co/functions/v1/send-book-mail', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, name: customerName, orderId: txnId })
                }).catch(e => console.error('[PayPal IPN fallback error]', e))
            }
        }

        return new Response('OK', { status: 200 })
    } catch (err: any) {
        console.error('[PayPal IPN Error]', err)
        return new Response(`IPN Error: ${err.message}`, { status: 500 })
    }
})
