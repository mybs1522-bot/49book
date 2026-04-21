import "jsr:@supabase/functions-js/edge-runtime.d.ts"

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')
const FROM_EMAIL = 'hello@archbysha.com'
const DOWNLOAD_LINK = 'https://drive.google.com/drive/folders/1cVcmiL-fo3o--aA-2YnXTO5UkF_3ERHc'
const WHATSAPP_LINK = 'https://wa.me/919198747810'

Deno.serve(async (req) => {
    // CORS
    if (req.method === 'OPTIONS') {
        return new Response('ok', {
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
            },
        })
    }

    try {
        const { email, name, orderId, type, address } = await req.json()

        if (!email) {
            return new Response(JSON.stringify({ error: 'Email is required' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
            })
        }

        if (!RESEND_API_KEY) {
            console.error('RESEND_API_KEY not set')
            return new Response(JSON.stringify({ error: 'Email service not configured' }), {
                status: 500,
                headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
            })
        }

        const isHardcopy = type === 'hardcopy'
        const customerName = name || 'there'
        const subject = isHardcopy
            ? '📦 Your Hardcopy Order is Confirmed!'
            : '📚 Your Interior Design Books Are Ready!'

        const htmlBody = generateEmailHTML({
            customerName,
            email,
            orderId: orderId || 'N/A',
            isHardcopy,
            address,
        })

        const res = await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${RESEND_API_KEY}`,
            },
            body: JSON.stringify({
                from: `Interior Design Books <${FROM_EMAIL}>`,
                to: [email],
                subject,
                html: htmlBody,
                reply_to: FROM_EMAIL,
                tags: [
                    { name: 'order_type', value: isHardcopy ? 'hardcopy' : 'digital' },
                    { name: 'order_id', value: orderId || 'unknown' },
                ],
            }),
        })

        const result = await res.json()

        if (!res.ok) {
            console.error('[Resend Error]', result)
            return new Response(JSON.stringify({ error: 'Failed to send email', details: result }), {
                status: res.status,
                headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
            })
        }

        console.log('[Resend Success]', { email, orderId, resendId: result.id })

        return new Response(JSON.stringify({ success: true, id: result.id }), {
            headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
        })
    } catch (error) {
        console.error('[Email Function Error]', error)
        return new Response(JSON.stringify({ error: error.message }), {
            status: 500,
            headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
        })
    }
})

function generateEmailHTML({ customerName, email, orderId, isHardcopy, address }: {
    customerName: string
    email: string
    orderId: string
    isHardcopy: boolean
    address?: string
}) {
    return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Order Confirmation</title>
</head>
<body style="margin:0; padding:0; background-color:#f8f6f2; font-family:-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f8f6f2; padding:40px 20px;">
        <tr>
            <td align="center">
                <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="background-color:#ffffff; border-radius:16px; overflow:hidden; box-shadow:0 4px 24px rgba(0,0,0,0.06);">
                    
                    <!-- Header -->
                    <tr>
                        <td style="background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%); padding:40px 40px 32px; text-align:center;">
                            <div style="width:56px; height:56px; background-color:rgba(16,185,129,0.15); border-radius:50%; margin:0 auto 20px; line-height:56px; font-size:28px;">
                                ✅
                            </div>
                            <h1 style="color:#ffffff; font-size:26px; font-weight:800; margin:0 0 8px; letter-spacing:-0.5px;">
                                ${isHardcopy ? 'Order Confirmed!' : 'Payment Successful!'}
                            </h1>
                            <p style="color:rgba(255,255,255,0.7); font-size:14px; margin:0; font-weight:500;">
                                ${isHardcopy ? 'Your hardcopy collection is on its way' : 'Your digital collection is ready for download'}
                            </p>
                        </td>
                    </tr>

                    <!-- Body -->
                    <tr>
                        <td style="padding:32px 40px;">
                            <p style="color:#374151; font-size:16px; line-height:1.6; margin:0 0 24px;">
                                Hi <strong>${customerName}</strong>,
                            </p>
                            <p style="color:#6b7280; font-size:15px; line-height:1.6; margin:0 0 24px;">
                                Thank you for your purchase! ${isHardcopy
                                    ? 'Your 6-book hardcopy collection has been confirmed and will be shipped soon.'
                                    : 'Your Interior Design Book Collection (6 books) is ready for immediate download.'
                                }
                            </p>

                            <!-- Order Details -->
                            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f9fafb; border-radius:12px; border:1px solid #e5e7eb; margin-bottom:24px;">
                                <tr>
                                    <td style="padding:20px;">
                                        <p style="font-size:11px; font-weight:700; text-transform:uppercase; letter-spacing:1.5px; color:#9ca3af; margin:0 0 12px;">Order Details</p>
                                        <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                                            <tr>
                                                <td style="color:#6b7280; font-size:13px; padding:4px 0;">Order ID</td>
                                                <td align="right" style="color:#111827; font-size:13px; font-weight:600; padding:4px 0;">${orderId}</td>
                                            </tr>
                                            <tr>
                                                <td style="color:#6b7280; font-size:13px; padding:4px 0;">Product</td>
                                                <td align="right" style="color:#111827; font-size:13px; font-weight:600; padding:4px 0;">${isHardcopy ? '6 Book Hardcopy Collection' : '6 Book Digital Collection'}</td>
                                            </tr>
                                            <tr>
                                                <td style="color:#6b7280; font-size:13px; padding:4px 0;">Amount</td>
                                                <td align="right" style="color:#111827; font-size:13px; font-weight:600; padding:4px 0;">${isHardcopy ? '$199.00' : '$49.00'}</td>
                                            </tr>
                                            <tr>
                                                <td style="color:#6b7280; font-size:13px; padding:4px 0;">Email</td>
                                                <td align="right" style="color:#111827; font-size:13px; font-weight:600; padding:4px 0;">${email}</td>
                                            </tr>
                                            ${address ? `
                                            <tr>
                                                <td style="color:#6b7280; font-size:13px; padding:4px 0;">Ship To</td>
                                                <td align="right" style="color:#111827; font-size:13px; font-weight:600; padding:4px 0; max-width:250px;">${address}</td>
                                            </tr>
                                            ` : ''}
                                        </table>
                                    </td>
                                </tr>
                            </table>

                            <!-- What's Included -->
                            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f0fdf4; border-radius:12px; border:1px solid #bbf7d0; margin-bottom:24px;">
                                <tr>
                                    <td style="padding:20px;">
                                        <p style="font-size:11px; font-weight:700; text-transform:uppercase; letter-spacing:1.5px; color:#16a34a; margin:0 0 12px;">📚 What's Included</p>
                                        <p style="color:#166534; font-size:13px; line-height:2; margin:0;">
                                            ✓ 6 Interior Design Books<br>
                                            ✓ Free Sketchup-Vray Course (Bonus)<br>
                                            ✓ Free Lead Generation Course (Bonus)<br>
                                            ✓ Lifetime Updates at No Extra Charge
                                        </p>
                                    </td>
                                </tr>
                            </table>

                            ${!isHardcopy ? `
                            <!-- Download Button -->
                            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
                                <tr>
                                    <td align="center">
                                        <a href="${DOWNLOAD_LINK}" target="_blank" style="display:inline-block; background:linear-gradient(135deg, #f97316, #ea580c); color:#ffffff; font-size:16px; font-weight:800; text-decoration:none; padding:16px 48px; border-radius:12px; letter-spacing:0.5px; text-transform:uppercase;">
                                            ⬇️ Download Your Books
                                        </a>
                                    </td>
                                </tr>
                                <tr>
                                    <td align="center" style="padding-top:12px;">
                                        <p style="color:#9ca3af; font-size:12px; margin:0;">
                                            Button not working? <a href="${DOWNLOAD_LINK}" style="color:#f97316; text-decoration:underline;">Click here</a>
                                        </p>
                                    </td>
                                </tr>
                            </table>
                            ` : `
                            <!-- Hardcopy Shipping Info -->
                            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#eff6ff; border-radius:12px; border:1px solid #bfdbfe; margin-bottom:24px;">
                                <tr>
                                    <td style="padding:20px;">
                                        <p style="font-size:11px; font-weight:700; text-transform:uppercase; letter-spacing:1.5px; color:#2563eb; margin:0 0 8px;">📦 Shipping Info</p>
                                        <p style="color:#1e40af; font-size:13px; line-height:1.6; margin:0;">
                                            Your books will be shipped within 3-5 business days. You'll receive a tracking number once dispatched.
                                        </p>
                                    </td>
                                </tr>
                            </table>

                            <!-- Digital Access Too -->
                            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
                                <tr>
                                    <td align="center">
                                        <p style="color:#6b7280; font-size:13px; margin:0 0 12px;">Meanwhile, access the digital versions instantly:</p>
                                        <a href="${DOWNLOAD_LINK}" target="_blank" style="display:inline-block; background:linear-gradient(135deg, #f97316, #ea580c); color:#ffffff; font-size:14px; font-weight:700; text-decoration:none; padding:14px 40px; border-radius:12px; letter-spacing:0.5px; text-transform:uppercase;">
                                            ⬇️ Download Digital Copies
                                        </a>
                                    </td>
                                </tr>
                            </table>
                            `}

                            <!-- Support -->
                            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-top:1px solid #e5e7eb; padding-top:20px;">
                                <tr>
                                    <td align="center">
                                        <p style="color:#9ca3af; font-size:13px; margin:0 0 8px;">Need help? We're here for you.</p>
                                        <a href="${WHATSAPP_LINK}" target="_blank" style="display:inline-block; background-color:#25d366; color:#ffffff; font-size:13px; font-weight:700; text-decoration:none; padding:10px 24px; border-radius:8px;">
                                            💬 WhatsApp Support
                                        </a>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>

                    <!-- Footer -->
                    <tr>
                        <td style="background-color:#f9fafb; padding:24px 40px; border-top:1px solid #e5e7eb; text-align:center;">
                            <p style="color:#9ca3af; font-size:11px; margin:0 0 4px;">
                                © ${new Date().getFullYear()} Interior Design Books by Arch by Sha
                            </p>
                            <p style="color:#d1d5db; font-size:10px; margin:0;">
                                This is an automated order confirmation. Please do not reply to this email.
                            </p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
`
}
