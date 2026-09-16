import "jsr:@supabase/functions-js/edge-runtime.d.ts"

const STRIPE_SECRET_KEY = Deno.env.get('STRIPE_SECRET_KEY')

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
        if (!STRIPE_SECRET_KEY) {
            throw new Error('STRIPE_SECRET_KEY not configured')
        }

        const { email, name, payment_method } = await req.json()

        // Build line items
        const lineItems = [{
            price_data: {
                currency: 'usd',
                product_data: {
                    name: '6 Interior & Exterior Design Books - Complete Collection',
                    description: 'Instant digital download - Living Room, Kitchen, Bedroom, Washroom, Study & Elevations Design Books',
                },
                unit_amount: 4900, // $49.00
            },
            quantity: 1,
        }]

        // Determine which payment method types to allow
        let paymentMethodTypes: string[] = ['card']
        
        if (payment_method === 'apple_pay' || payment_method === 'google_pay') {
            // For Apple Pay / Google Pay, we use 'card' with wallet enabled
            // Stripe Checkout automatically shows Apple Pay / Google Pay when 'card' is included
            paymentMethodTypes = ['card']
        }

        // Determine the site origin for success/cancel URLs
        const origin = req.headers.get('origin') || req.headers.get('referer')?.replace(/\/[^/]*$/, '') || 'https://49book.vercel.app'

        // Create Stripe Checkout Session via API
        const params = new URLSearchParams()
        params.append('mode', 'payment')
        params.append('success_url', `${origin}/checkout?success=true&session_id={CHECKOUT_SESSION_ID}`)
        params.append('cancel_url', `${origin}/checkout`)
        params.append('line_items[0][price_data][currency]', 'usd')
        params.append('line_items[0][price_data][product_data][name]', '6 Interior & Exterior Design Books')
        params.append('line_items[0][price_data][product_data][description]', 'Instant digital download - Complete Collection')
        params.append('line_items[0][price_data][unit_amount]', '4900')
        params.append('line_items[0][quantity]', '1')
        params.append('payment_method_types[]', 'card')
        
        // Allow Apple Pay and Google Pay via wallet options
        params.append('payment_method_options[card][setup_future_usage]', '')
        
        if (email) {
            params.append('customer_email', email)
        }

        // Metadata for post-payment processing
        params.append('metadata[product]', 'interior-design-6-books')
        params.append('metadata[customer_name]', name || '')
        params.append('metadata[payment_method_requested]', payment_method || 'card')

        const response = await fetch('https://api.stripe.com/v1/checkout/sessions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${STRIPE_SECRET_KEY}`,
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: params.toString(),
        })

        const session = await response.json()

        if (session.error) {
            throw new Error(session.error.message || 'Failed to create checkout session')
        }

        return new Response(JSON.stringify({ 
            url: session.url,
            sessionId: session.id 
        }), {
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
            },
        })
    } catch (error) {
        console.error('Checkout session error:', error)
        return new Response(JSON.stringify({ error: error.message || 'Failed to create checkout session' }), {
            status: 500,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
            },
        })
    }
})
