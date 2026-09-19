/**
 * Modular Checkout & Swatch State Handler for Vercel
 * Integrated with Stripe & PayPal with Instant E-Book Delivery & Hardcopy Checkout
 */

const CHECKOUT_CONFIG = {
  currency: 'USD',
  currencySymbol: '$',
  storeName: 'AVADA Books',
  
  // 'modal' (recommended - customer chooses Card or PayPal), 'stripe', or 'paypal'
  provider: 'modal',

  // 1. Stripe Checkout Settings (Credit/Debit Card, Apple Pay, Google Pay)
  stripe: {
    paymentLink: 'https://buy.stripe.com/your_stripe_payment_link_here',
    publishableKey: 'pk_live_your_key_here'
  },

  // 2. PayPal Checkout Settings
  paypal: {
    paymentLink: 'https://www.paypal.com/checkoutnow?token=your_paypal_link_here',
    clientId: 'your_paypal_client_id_here'
  },

  // Thank You & Instant E-Book Download URL
  thankYouUrl: '/pages/thank-you.html'
};

/**
 * Main Checkout Handler
 */
function handleCheckout(orderData) {
  const isHard = orderData.variantTitle && orderData.variantTitle.toLowerCase().includes('hard');
  console.log('[Checkout] Initiating checkout for:', orderData);

  try {
    localStorage.setItem('avada_last_order', JSON.stringify({
      productTitle: orderData.productTitle || '6 Books to Design Interiors & Exteriors',
      variantTitle: isHard ? 'Hardcopy Edition' : (orderData.variantTitle || 'E-Book Edition'),
      price: orderData.price || (isHard ? '199.00' : '49.00'),
      timestamp: Date.now()
    }));
  } catch(e) {}

  if (isHard) {
    window.location.href = '/hardcopy';
  } else {
    window.location.href = '/checkout';
  }
}

function handleStripePayment(orderData) {
  const link = CHECKOUT_CONFIG.stripe.paymentLink;
  if (link && link.startsWith('https://') && !link.includes('your_stripe_payment_link_here')) {
    window.location.href = link;
  } else {
    // In dev / before link is configured: offer to redirect to Thank You page in test mode
    const proceed = confirm(
      "Stripe Payment Link setup required in assets/js/checkout.js.\n\n" +
      "Would you like to simulate a successful purchase and preview the Instant E-Book Delivery & Thank You Page now?"
    );
    if (proceed) {
      window.location.href = CHECKOUT_CONFIG.thankYouUrl + '?session_id=SIMULATED_STRIPE_' + Date.now();
    }
  }
}

function handlePayPalPayment(orderData) {
  const link = CHECKOUT_CONFIG.paypal.paymentLink;
  if (link && link.startsWith('https://') && !link.includes('your_paypal_link_here')) {
    window.location.href = link;
  } else {
    // In dev / before link is configured: offer to redirect to Thank You page in test mode
    const proceed = confirm(
      "PayPal Payment Link setup required in assets/js/checkout.js.\n\n" +
      "Would you like to simulate a successful PayPal purchase and preview the Instant E-Book Delivery & Thank You Page now?"
    );
    if (proceed) {
      window.location.href = CHECKOUT_CONFIG.thankYouUrl + '?payment_id=SIMULATED_PAYPAL_' + Date.now();
    }
  }
}

function showCheckoutModal(orderData) {
  let modal = document.getElementById('vercel-checkout-modal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'vercel-checkout-modal';
    modal.innerHTML = `
      <div class="vcm-backdrop" onclick="closeCheckoutModal()"></div>
      <div class="vcm-dialog">
        <button class="vcm-close" onclick="closeCheckoutModal()">&times;</button>
        
        <div class="vcm-header">
          <div class="vcm-icon-shield">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#ea580c" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
          </div>
          <h3>Select Payment Method</h3>
          <p class="vcm-sub">Encrypted 256-Bit SSL Checkout</p>
        </div>
        
        <div class="vcm-summary">
          <div class="vcm-row">
            <span class="vcm-label">Product:</span>
            <span class="vcm-value" id="vcm-product-title"></span>
          </div>
          <div class="vcm-row">
            <span class="vcm-label">Edition:</span>
            <span class="vcm-value" id="vcm-variant-title"></span>
          </div>
          <div class="vcm-row vcm-total">
            <span class="vcm-label">Total Amount:</span>
            <span class="vcm-value" id="vcm-total-price"></span>
          </div>
        </div>

        <div class="vcm-payment-options">
          <!-- Stripe (Card / Apple Pay / Google Pay) -->
          <button type="button" class="vcm-pay-btn vcm-stripe-btn" onclick="handleStripePayment(currentOrderData)">
            <div class="vcm-pay-left">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect><line x1="1" y1="10" x2="23" y2="10"></line></svg>
              <div>
                <div class="vcm-pay-title">Card / Apple Pay / Google Pay</div>
                <div class="vcm-pay-sub">Stripe Verified • Visa, Mastercard, Amex</div>
              </div>
            </div>
            <span class="vcm-pay-arrow">→</span>
          </button>

          <!-- PayPal -->
          <button type="button" class="vcm-pay-btn vcm-paypal-btn" onclick="handlePayPalPayment(currentOrderData)">
            <div class="vcm-pay-left">
              <span class="vcm-pp-badge">P</span>
              <div>
                <div class="vcm-pay-title">PayPal Checkout</div>
                <div class="vcm-pay-sub">Pay with PayPal balance or card</div>
              </div>
            </div>
            <span class="vcm-pay-arrow">→</span>
          </button>
        </div>

        <div class="vcm-guarantees">
          <span>🔒 256-Bit Encryption</span> • <span>📦 Express Delivery</span> • <span>🛡️ 14-Day Guarantee</span>
        </div>

        <div class="vcm-test-link-wrap">
          <a href="/pages/thank-you?session_id=DEMO_PREVIEW" class="vcm-test-link">
            🚀 Click here to preview Instant Delivery &amp; Thank You Page (Demo Mode)
          </a>
        </div>
      </div>
    `;
    document.body.appendChild(modal);
    injectModalStyles();
  }

  window.currentOrderData = orderData;
  document.getElementById('vcm-product-title').textContent = orderData.productTitle || '6 Books to Design Interiors & Exteriors';
  document.getElementById('vcm-variant-title').textContent = orderData.variantTitle || 'E-Book Edition';
  document.getElementById('vcm-total-price').textContent = `${CHECKOUT_CONFIG.currencySymbol}${orderData.price || '49.00'}`;
  
  modal.classList.add('vcm-open');
}

function closeCheckoutModal() {
  const modal = document.getElementById('vercel-checkout-modal');
  if (modal) modal.classList.remove('vcm-open');
}

function injectModalStyles() {
  if (document.getElementById('vcm-styles')) return;
  const style = document.createElement('style');
  style.id = 'vcm-styles';
  style.textContent = `
    #vercel-checkout-modal {
      display: none;
      position: fixed;
      inset: 0;
      z-index: 999999;
      font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    }
    #vercel-checkout-modal.vcm-open {
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .vcm-backdrop {
      position: fixed;
      inset: 0;
      background: rgba(15, 23, 42, 0.7);
      backdrop-filter: blur(5px);
    }
    .vcm-dialog {
      position: relative;
      background: #ffffff;
      border-radius: 20px;
      padding: 28px;
      max-width: 440px;
      width: 90%;
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
      animation: vcmFadeUp 0.25s cubic-bezier(0.16, 1, 0.3, 1);
      z-index: 2;
      box-sizing: border-box;
      text-align: left;
    }
    @keyframes vcmFadeUp {
      from { opacity: 0; transform: translateY(15px) scale(0.97); }
      to { opacity: 1; transform: translateY(0) scale(1); }
    }
    .vcm-close {
      position: absolute;
      top: 16px;
      right: 16px;
      background: #f1f5f9;
      border: none;
      font-size: 20px;
      width: 32px;
      height: 32px;
      border-radius: 50%;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #64748b;
      transition: all 0.15s;
    }
    .vcm-close:hover {
      background: #e2e8f0;
      color: #0f172a;
    }
    .vcm-header {
      text-align: center;
      margin-bottom: 20px;
    }
    .vcm-icon-shield {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 48px;
      height: 48px;
      border-radius: 14px;
      background: #fff7ed;
      border: 1px solid #ffedd5;
      margin-bottom: 12px;
    }
    .vcm-header h3 {
      margin: 0;
      font-size: 20px;
      font-weight: 800;
      color: #0f172a;
      letter-spacing: -0.02em;
    }
    .vcm-sub {
      margin: 4px 0 0;
      font-size: 12px;
      color: #64748b;
      font-weight: 500;
    }
    .vcm-summary {
      background: #f8fafc;
      border-radius: 12px;
      padding: 14px 16px;
      margin-bottom: 20px;
      border: 1px solid #e2e8f0;
    }
    .vcm-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 13px;
      color: #475569;
      margin-bottom: 6px;
    }
    .vcm-row:last-child {
      margin-bottom: 0;
    }
    .vcm-row.vcm-total {
      margin-top: 8px;
      padding-top: 8px;
      border-top: 1px dashed #cbd5e1;
      font-size: 15px;
      font-weight: 700;
      color: #0f172a;
    }
    .vcm-value {
      font-weight: 700;
      color: #0f172a;
    }
    .vcm-payment-options {
      display: flex;
      flex-direction: column;
      gap: 10px;
      margin-bottom: 18px;
    }
    .vcm-pay-btn {
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 14px 18px;
      border-radius: 14px;
      border: 1.5px solid transparent;
      cursor: pointer;
      transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
      text-align: left;
      box-sizing: border-box;
    }
    .vcm-pay-left {
      display: flex;
      align-items: center;
      gap: 12px;
    }
    .vcm-stripe-btn {
      background: #0f172a;
      color: #ffffff;
      box-shadow: 0 4px 12px rgba(15, 23, 42, 0.15);
      border-color: #0f172a;
    }
    .vcm-stripe-btn:hover {
      background: #1e293b;
      border-color: #1e293b;
      transform: translateY(-1px);
      box-shadow: 0 6px 16px rgba(15, 23, 42, 0.22);
    }
    .vcm-paypal-btn {
      background: #ffc439;
      color: #003087;
      border-color: #f5b722;
      box-shadow: 0 4px 12px rgba(255, 196, 57, 0.25);
    }
    .vcm-paypal-btn:hover {
      background: #ffbb1a;
      border-color: #f5b722;
      transform: translateY(-1px);
      box-shadow: 0 6px 16px rgba(255, 196, 57, 0.35);
    }
    .vcm-pp-badge {
      width: 24px;
      height: 24px;
      background: #003087;
      color: #ffffff;
      border-radius: 6px;
      font-weight: 900;
      font-size: 14px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      font-style: italic;
    }
    .vcm-pay-title {
      font-size: 14px;
      font-weight: 700;
      line-height: 1.2;
      color: inherit;
    }
    .vcm-stripe-btn .vcm-pay-sub {
      font-size: 11px;
      color: #94a3b8;
      margin-top: 2px;
    }
    .vcm-paypal-btn .vcm-pay-sub {
      font-size: 11px;
      color: #003087;
      opacity: 0.8;
      margin-top: 2px;
    }
    .vcm-pay-arrow {
      font-size: 18px;
      font-weight: 700;
      opacity: 0.7;
      color: inherit;
    }
    .vcm-guarantees {
      text-align: center;
      font-size: 11px;
      color: #64748b;
      margin-bottom: 12px;
      font-weight: 500;
    }
    .vcm-test-link-wrap {
      text-align: center;
      border-top: 1px solid #f1f5f9;
      padding-top: 12px;
    }
    .vcm-test-link {
      font-size: 11.5px;
      color: #ea580c;
      text-decoration: none;
      font-weight: 600;
    }
    .vcm-test-link:hover {
      text-decoration: underline;
    }

    /* Active styling for sold-out Hardcopy swatch */
    .luxury-swatch-card[data-swatch-soldout="true"].swatch--active,
    .luxury-swatch-card.swatch--active {
      border: 1.5px solid #09090b !important;
      background: #fafafa !important;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05) !important;
    }
    .luxury-swatch-card.swatch--active .luxury-card-radio {
      border-color: #09090b !important;
      background: #09090b !important;
    }
    .luxury-swatch-card.swatch--active .radio-dot {
      opacity: 1 !important;
      transform: scale(1) !important;
      background: #ffffff !important;
    }
    .luxury-swatch-card {
      cursor: pointer !important;
    }
  `;
  document.head.appendChild(style);
}

/**
 * Swatch State Manager:
 * Handles switching between E-Book and Hardcopy editions:
 * When Hardcopy is selected:
 *  - Hide urgency countdown timer (.arch-pill-timer-wrap)
 *  - Hide cut prices ($98.00 / $398.00)
 *  - Hide sale/offer percentage badges (-50% OFF)
 *  - Update main price display to $199.00
 *  - Update sticky bar price to $199 (no cut price)
 *  - Keep buttons fully clickable / in-stock
 * When E-Book is selected:
 *  - Restore countdown timer
 *  - Show cut price ($98.00)
 *  - Show offer badge (-50% OFF)
 *  - Update main price display to $49.00
 *  - Update sticky bar price to $49 (cut $98)
 */
function updateSwatchFormatState(isHardcopy, optionName) {
  const buyButtons = document.querySelectorAll('[data-buy-button], .button--buy-now, .product-form__buttons button');
  const stickyBtn = document.getElementById('archStickyBuyBtn');
  const timerWrap = document.querySelectorAll('.arch-pill-timer-wrap');
  const qtyInput = document.querySelector('.quantity--input');

  // 1. Update Main Buy Now Button
  buyButtons.forEach(btn => {
    btn.disabled = false;
    btn.removeAttribute('aria-disabled');
    btn.classList.remove('is-sold-out-btn');
    if (btn.dataset.originalHtml) {
      btn.innerHTML = btn.dataset.originalHtml;
    }
    btn.style.removeProperty('background');
    btn.style.removeProperty('color');
    btn.style.removeProperty('cursor');
    btn.style.removeProperty('opacity');
    btn.style.removeProperty('pointer-events');
    btn.style.removeProperty('box-shadow');
    btn.style.removeProperty('transform');
  });

  // 2. Update Sticky Bottom Bar Button
  if (stickyBtn) {
    stickyBtn.disabled = false;
    stickyBtn.removeAttribute('aria-disabled');
    stickyBtn.classList.remove('is-sold-out-btn');
    if (stickyBtn.dataset.originalHtml) {
      stickyBtn.innerHTML = stickyBtn.dataset.originalHtml;
    }
    stickyBtn.style.removeProperty('background');
    stickyBtn.style.removeProperty('cursor');
    stickyBtn.style.removeProperty('opacity');
    stickyBtn.style.removeProperty('pointer-events');
    stickyBtn.style.removeProperty('box-shadow');

    const stickyPriceActive = document.querySelector('.arch-sticky-price__active');
    const stickyPriceCut = document.querySelector('.arch-sticky-price__cut');
    const stickyArrow = stickyBtn.querySelector('.arch-sticky-btn__arrow');
    if (stickyArrow) stickyArrow.style.display = '';

    if (isHardcopy) {
      if (stickyPriceActive) stickyPriceActive.textContent = '$199';
      if (stickyPriceCut) stickyPriceCut.style.setProperty('display', 'none', 'important');
    } else {
      if (stickyPriceActive) stickyPriceActive.textContent = '$49';
      if (stickyPriceCut) {
        stickyPriceCut.textContent = '$98';
        stickyPriceCut.style.removeProperty('display');
      }
    }
  }

  // 3. Urgency Pill Timer (Remove when Hardcopy is selected, show when E-Book is selected)
  timerWrap.forEach(el => {
    if (isHardcopy) {
      el.style.setProperty('display', 'none', 'important');
    } else {
      el.style.removeProperty('display');
    }
  });

  // 4. Quantity Input
  if (qtyInput) {
    qtyInput.style.opacity = '1';
    qtyInput.style.pointerEvents = 'auto';
  }

  // 5. Main Price Displays
  const mainPrices = document.querySelectorAll('[data-product-price]');
  const salePrices = document.querySelectorAll('[data-product-price-sale]');
  const saleTags = document.querySelectorAll('[data-tag-sale], [data-tag-product], .tag--sale, .tag, .product__badge, .product__tag');

  mainPrices.forEach(p => {
    p.textContent = isHardcopy ? '$199.00' : '$49.00';
  });

  salePrices.forEach(sp => {
    if (isHardcopy) {
      sp.style.setProperty('display', 'none', 'important');
    } else {
      sp.style.removeProperty('display');
      sp.classList.remove('hide');
    }
  });

  saleTags.forEach(st => {
    if (isHardcopy) {
      st.style.setProperty('display', 'none', 'important');
    } else {
      st.style.removeProperty('display');
      st.classList.remove('hide');
    }
  });

  // 6. Update hidden variant inputs
  const variantInputs = document.querySelectorAll('[data-bstr-variant-input], input[name="id"]');
  variantInputs.forEach(inp => {
    inp.value = isHardcopy ? '53067294572861' : '53066848436541';
  });
}

function initSwatchSelector() {
  injectModalStyles();

  const handleSwatchClick = function(e) {
    const card = e.target.closest('.luxury-swatch-card, [data-swatch-option]');
    if (!card) return;

    e.preventDefault();
    e.stopPropagation();

    const option = card.dataset.swatchOption || card.getAttribute('data-swatch-option') || 'E-Book';
    const isHardcopy = option.toLowerCase().includes('hard');

    // Toggle active classes across all swatch elements
    document.querySelectorAll('.luxury-swatch-card, [data-swatch-option]').forEach(c => {
      const cOpt = c.dataset.swatchOption || c.getAttribute('data-swatch-option');
      if (cOpt && cOpt.toLowerCase() === option.toLowerCase()) {
        c.classList.add('swatch--active');
        const dot = c.querySelector('.radio-dot');
        if (dot) {
          dot.style.opacity = '1';
          dot.style.transform = 'scale(1)';
        }
      } else {
        c.classList.remove('swatch--active');
        const dot = c.querySelector('.radio-dot');
        if (dot) {
          dot.style.opacity = '0';
          dot.style.transform = 'scale(0.5)';
        }
      }
    });

    // Update Format Title
    document.querySelectorAll('[data-swatch-selected-name]').forEach(titleEl => {
      titleEl.textContent = ` - ${option}`;
    });

    // Update prices, timer, and offer visibility
    updateSwatchFormatState(isHardcopy, option);
  };

  document.querySelectorAll('.luxury-swatch-card, [data-swatch-option]').forEach(card => {
    card.style.cursor = 'pointer';
    card.removeEventListener('click', handleSwatchClick);
    card.addEventListener('click', handleSwatchClick);
  });

  // Global delegation
  document.addEventListener('click', function(e) {
    const card = e.target.closest('.luxury-swatch-card, [data-swatch-option]');
    if (card) {
      handleSwatchClick(e);
    }
  });

  // Direct buy execution functions
  const wrapBuyFunction = () => {
    if (window.executeDirectBuyNow) {
      window.executeDirectBuyNow = function(e, btn) {
        if (e) { e.preventDefault(); e.stopPropagation(); }
        const activeSwatch = document.querySelector('.luxury-swatch-card.swatch--active') || document.querySelector('.swatch--active') || document.querySelector('[data-swatch-option].selected');
        const variantTitle = activeSwatch ? (activeSwatch.dataset.swatchOption || activeSwatch.innerText.trim()) : 'E-Book';
        const isHard = variantTitle.toLowerCase().includes('hard');
        
        const titleEl = document.querySelector('h1.product__title') || document.querySelector('h1');
        const productTitle = titleEl ? titleEl.innerText.trim() : '6 Books to Design Interiors & Exteriors';
        const priceText = isHard ? '199.00' : '49.00';

        handleCheckout({
          productTitle,
          variantTitle: isHard ? 'Hardcopy Edition' : 'E-Book Edition',
          price: priceText
        });
      };
    }

    if (window.executeStickyBuyNow) {
      window.executeStickyBuyNow = function(btn) {
        const activeSwatch = document.querySelector('.luxury-swatch-card.swatch--active') || document.querySelector('.swatch--active') || document.querySelector('[data-swatch-option].selected');
        const variantTitle = activeSwatch ? (activeSwatch.dataset.swatchOption || activeSwatch.innerText.trim()) : 'E-Book';
        const isHard = variantTitle.toLowerCase().includes('hard');

        const titleEl = document.querySelector('h1.product__title') || document.querySelector('h1');
        const productTitle = titleEl ? titleEl.innerText.trim() : '6 Books to Design Interiors & Exteriors';
        const priceText = isHard ? '199.00' : '49.00';

        handleCheckout({
          productTitle,
          variantTitle: isHard ? 'Hardcopy Edition' : 'E-Book Edition',
          price: priceText
        });
      };
    }
  };

  wrapBuyFunction();
  setTimeout(wrapBuyFunction, 500);
}

document.addEventListener('DOMContentLoaded', () => {
  initSwatchSelector();

  const attachButtons = () => {
    const buyButtons = document.querySelectorAll('[data-buy-button], .product-form__buttons button, [name="add"], form[action*="/cart/add"] button[type="submit"], .button--primary');
    buyButtons.forEach(btn => {
      if (btn.dataset.vcmInitd) return;
      btn.dataset.vcmInitd = 'true';
      btn.addEventListener('click', (e) => {
        const activeSwatch = document.querySelector('.luxury-swatch-card.swatch--active') || document.querySelector('.swatch--active') || document.querySelector('[data-swatch-option].selected');
        const variantTitle = activeSwatch ? (activeSwatch.dataset.swatchOption || activeSwatch.innerText.trim()) : 'E-Book';
        const isHard = variantTitle.toLowerCase().includes('hard');

        e.preventDefault();
        e.stopPropagation();

        const titleEl = document.querySelector('h1.product__title') || document.querySelector('h1');
        const productTitle = titleEl ? titleEl.innerText.trim() : '6 Books to Design Interiors & Exteriors';
        const priceText = isHard ? '199.00' : '49.00';

        handleCheckout({
          productTitle,
          variantTitle: isHard ? 'Hardcopy Edition' : 'E-Book Edition',
          price: priceText
        });
      });
    });
  };

  attachButtons();
  setTimeout(attachButtons, 800);
});
