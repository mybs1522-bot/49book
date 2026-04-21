const email = "mybs1522@gmail.com";
const edgeFunctionUrl = "https://dhufnozehayzjlsmnvdl.supabase.co/functions/v1/send-book-mail";

console.log(`Triggering test email to ${email}...`);

fetch(edgeFunctionUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
        email: email,
        orderId: "TEST_DELIVERABILITY_CHECK",
        type: "digital"
    })
})
    .then(async res => {
        const data = await res.json();
        if (res.ok) {
            console.log("✅ Success! Email sent. Resend ID:", data.id);
        } else {
            console.error("❌ Failed to send email:", data.error || data);
        }
    })
    .catch(err => {
        console.error("❌ Network error:", err);
    });
