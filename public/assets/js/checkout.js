/**
 * Modular Checkout & Swatch State Handler for Vercel
 * Integrated with Stripe & PayPal with Instant E-Book Delivery
 */

const CHECKOUT_CONFIG = {
  currency: 'USD',
  currencySymbol: '$',
  storeName: 'AVADA Books',
  
  // 'modal' (recommended - customer chooses Card or PayPal), 'stripe', or 'paypal'
  provider: 'modal',

  // 1. Stripe Checkout Settings (Credit/Debit Card, Apple Pay, Google Pay)
  stripe: {
    // Paste your Stripe Payment Link here (created in Stripe Dashboard -> Payment Links)
    // Setup tip: Set "After payment" -> "Redirect to your website" -> https://your-site.vercel.app/pages/thank-you
    paymentLink: 'https://buy.stripe.com/your_stripe_payment_link_here',
    publishableKey: 'pk_live_your_key_here'
  },

  // 2. PayPal Checkout Settings
  paypal: {
    // Paste your PayPal payment link, PayPal.me link, or PayPal button URL:
    // Setup tip: Set return URL in PayPal to https://your-site.vercel.app/pages/thank-you
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
  // If Hardcopy is selected, prevent checkout and notify customer
  if (orderData.variantTitle && orderData.variantTitle.toLowerCase().includes('hard')) {
    alert('The Deluxe Printed Hardcopy edition is currently out of stock. Please select the E-Book edition for instant access.');
    return;
  }

  console.log('[Checkout] Initiating checkout for:', orderData);

  try {
    localStorage.setItem('avada_last_order', JSON.stringify({
      productTitle: orderData.productTitle || '6 Books to Design Interiors & Exteriors',
      variantTitle: orderData.variantTitle || 'E-Book Edition',
      price: orderData.price || '49.00',
      timestamp: Date.now()
    }));
  } catch(e) {}

  window.location.href = '/checkout';
}

function handleStripePayment(orderData) {
  const link = CHECKOUT_CONFIG.stripe.paymentLink;
  if (link && link.startsWith('https://') && !link.includes('your_stripe_payment_link_here')) {
    window.location.href = link;
  } else {
    // In dev / before link is configured: offer to redirect to Thank You page in test mode
    const proceed = confirm(
      "Stripe Payment Link setup required in assets/js/checkout.js.\\n\\n" +
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
      "PayPal Payment Link setup required in assets/js/checkout.js.\\n\\n" +
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
          <p class="vcm-sub">Encrypted 256-Bit SSL Checkout • Instant Digital Access</p>
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
          <span>🔒 256-Bit Encryption</span> • <span>⚡ Instant E-Book Access</span> • <span>🛡️ 14-Day Guarantee</span>
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
      max-width: 460px;
      width: 92%;
      padding: 30px 24px 24px 24px;
      box-shadow: 0 25px 50px -12px rgba(0,0,0,0.25);
      z-index: 10;
      text-align: center;
      animation: vcmFadeIn 0.2s ease-out;
      box-sizing: border-box;
    }
    @keyframes vcmFadeIn {
      from { opacity: 0; transform: scale(0.96); }
      to { opacity: 1; transform: scale(1); }
    }
    .vcm-close {
      position: absolute;
      top: 14px;
      right: 14px;
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
      transition: background 0.15s;
    }
    .vcm-close:hover {
      background: #e2e8f0;
      color: #0f172a;
    }
    .vcm-icon-shield {
      width: 44px;
      height: 44px;
      background: #fff7ed;
      border-radius: 50%;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 10px;
    }
    .vcm-header h3 {
      font-size: 21px;
      font-weight: 800;
      color: #0f172a;
      margin: 0 0 6px 0;
      letter-spacing: -0.01em;
    }
    .vcm-sub {
      font-size: 13px;
      color: #64748b;
      margin: 0 0 20px 0;
    }
    .vcm-summary {
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 14px;
      padding: 14px 18px;
      margin-bottom: 20px;
      text-align: left;
    }
    .vcm-row {
      display: flex;
      justify-content: space-between;
      font-size: 13.5px;
      margin-bottom: 6px;
      color: #475569;
    }
    .vcm-value {
      font-weight: 700;
      color: #0f172a;
    }
    .vcm-total {
      margin-top: 10px;
      padding-top: 10px;
      border-top: 1px dashed #cbd5e1;
      font-size: 16px;
      font-weight: 800;
      color: #0f172a;
    }
    .vcm-payment-options {
      display: flex;
      flex-direction: column;
      gap: 12px;
      margin-bottom: 20px;
    }
    .vcm-pay-btn {
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 14px 18px;
      border-radius: 14px;
      border: 1.5px solid #e2e8f0;
      background: #ffffff;
      cursor: pointer;
      transition: all 0.15s ease;
      text-align: left;
      box-sizing: border-box;
    }
    .vcm-pay-btn:hover {
      border-color: #0f172a;
      background: #f8fafc;
      transform: translateY(-1px);
      box-shadow: 0 4px 14px rgba(0,0,0,0.06);
    }
    .vcm-stripe-btn:hover {
      border-color: #ea580c;
    }
    .vcm-paypal-btn {
      background: #fffdf5;
      border-color: #fed7aa;
    }
    .vcm-paypal-btn:hover {
      border-color: #0070ba;
      background: #f0f9ff;
    }
    .vcm-pay-left {
      display: flex;
      align-items: center;
      gap: 12px;
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
      font-size: 14.5px;
      font-weight: 700;
      color: #0f172a;
      line-height: 1.2;
    }
    .vcm-pay-sub {
      font-size: 12px;
      color: #64748b;
      margin-top: 2px;
    }
    .vcm-pay-arrow {
      font-size: 18px;
      color: #94a3b8;
      font-weight: 700;
    }
    .vcm-guarantees {
      font-size: 11.5px;
      color: #64748b;
      margin-bottom: 16px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-wrap: wrap;
      gap: 6px;
    }
    .vcm-test-link-wrap {
      padding-top: 12px;
      border-top: 1px solid #f1f5f9;
    }
    .vcm-test-link {
      font-size: 12px;
      font-weight: 600;
      color: #ea580c;
      text-decoration: none;
      transition: underline 0.15s;
    }
    .vcm-test-link:hover {
      text-decoration: underline;
    }

    /* Active styling for sold-out Hardcopy swatch */
    .luxury-swatch-card[data-swatch-soldout="true"].swatch--active {
      border: 1.5px solid #09090b !important;
      background: #fafafa !important;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05) !important;
    }
    .luxury-swatch-card[data-swatch-soldout="true"].swatch--active .luxury-card-radio {
      border-color: #09090b !important;
      background: #09090b !important;
    }
    .luxury-swatch-card[data-swatch-soldout="true"].swatch--active .radio-dot {
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
 * Handles clicking on Hardcopy and changing Buy Now to Out Of Stock
 */
function updateOutOfStockState(isSoldOut, optionName) {
  const buyButtons = document.querySelectorAll('[data-buy-button], .button--buy-now, .product-form__buttons button');
  const stickyBtn = document.getElementById('archStickyBuyBtn');
  const timerWrap = document.querySelector('.arch-pill-timer-wrap');
  const qtyInput = document.querySelector('.quantity--input');

  // 1. Update Main Buy Now Button
  buyButtons.forEach(btn => {
    if (!btn.dataset.originalHtml) {
      btn.dataset.originalHtml = btn.innerHTML;
    }

    if (isSoldOut) {
      btn.disabled = true;
      btn.setAttribute('aria-disabled', 'true');
      btn.classList.add('is-sold-out-btn');
      btn.innerHTML = `<span data-button-text="" style="font-weight: 700; letter-spacing: 0.04em;">Out Of Stock</span>`;
      btn.style.setProperty('background', '#64748b', 'important');
      btn.style.setProperty('color', '#ffffff', 'important');
      btn.style.setProperty('cursor', 'not-allowed', 'important');
      btn.style.setProperty('opacity', '0.8', 'important');
      btn.style.setProperty('pointer-events', 'none', 'important');
      btn.style.setProperty('box-shadow', 'none', 'important');
      btn.style.setProperty('transform', 'none', 'important');
    } else {
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
    }
  });

  // 2. Update Sticky Bottom Bar Button
  if (stickyBtn) {
    if (!stickyBtn.dataset.originalHtml) {
      stickyBtn.dataset.originalHtml = stickyBtn.innerHTML;
    }

    const stickyText = stickyBtn.querySelector('.arch-sticky-btn__text');
    const stickyPriceActive = document.querySelector('.arch-sticky-price__active');
    const stickyPriceCut = document.querySelector('.arch-sticky-price__cut');
    const stickyIcon = stickyBtn.querySelector('.arch-sticky-btn__icon');
    const stickyArrow = stickyBtn.querySelector('.arch-sticky-btn__arrow');

    if (isSoldOut) {
      stickyBtn.disabled = true;
      stickyBtn.setAttribute('aria-disabled', 'true');
      stickyBtn.classList.add('is-sold-out-btn');
      if (stickyText) stickyText.textContent = 'Out Of Stock';
      if (stickyIcon) stickyIcon.style.opacity = '0.5';
      if (stickyArrow) stickyArrow.style.display = 'none';

      stickyBtn.style.setProperty('background', '#64748b', 'important');
      stickyBtn.style.setProperty('cursor', 'not-allowed', 'important');
      stickyBtn.style.setProperty('opacity', '0.8', 'important');
      stickyBtn.style.setProperty('pointer-events', 'none', 'important');
      stickyBtn.style.setProperty('box-shadow', 'none', 'important');

      if (stickyPriceActive) stickyPriceActive.textContent = '$199';
      if (stickyPriceCut) stickyPriceCut.style.display = 'none';
    } else {
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

      if (stickyPriceActive) stickyPriceActive.textContent = '$49';
      if (stickyPriceCut) stickyPriceCut.style.display = '';
    }
  }

  // 3. Urgency Pill Timer
  if (timerWrap) {
    timerWrap.style.setProperty('display', isSoldOut ? 'none' : 'flex', 'important');
  }

  // 4. Quantity Input
  if (qtyInput) {
    qtyInput.style.opacity = isSoldOut ? '0.4' : '1';
    qtyInput.style.pointerEvents = isSoldOut ? 'none' : 'auto';
  }

  // 5. Main Price Displays
  const mainPrices = document.querySelectorAll('[data-product-price]');
  const salePrices = document.querySelectorAll('[data-product-price-sale]');
  const saleTags = document.querySelectorAll('[data-tag-sale], [data-tag-product], .tag--sale, .tag, .product__badge, .product__tag');

  mainPrices.forEach(p => {
    p.textContent = isSoldOut ? '$199.00' : '$49.00';
  });

  salePrices.forEach(sp => {
    if (isSoldOut) {
      sp.style.setProperty('display', 'none', 'important');
    } else {
      sp.style.removeProperty('display');
      sp.classList.remove('hide');
    }
  });

  saleTags.forEach(st => {
    if (isSoldOut) {
      st.style.setProperty('display', 'none', 'important');
    } else {
      st.style.removeProperty('display');
      st.classList.remove('hide');
    }
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
    const isHardcopy = option.toLowerCase().includes('hard') || card.dataset.swatchSoldout === 'true';

    // Toggle active classes
    document.querySelectorAll('.luxury-swatch-card, [data-swatch-option]').forEach(c => {
      const cOpt = c.dataset.swatchOption || c.getAttribute('data-swatch-option');
      if (cOpt === option) {
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

    // Update Out Of Stock state
    updateOutOfStockState(isHardcopy, option);
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

  // Guard direct buy execution functions
  const wrapBuyFunction = () => {
    if (window.executeDirectBuyNow) {
      window.executeDirectBuyNow = function(e, btn) {
        if (e) { e.preventDefault(); e.stopPropagation(); }
        const activeSwatch = document.querySelector('.luxury-swatch-card.swatch--active') || document.querySelector('.swatch--active') || document.querySelector('[data-swatch-option].selected');
        const variantTitle = activeSwatch ? (activeSwatch.dataset.swatchOption || activeSwatch.innerText.trim()) : 'E-Book';
        if (variantTitle.toLowerCase().includes('hard') || (btn && (btn.disabled || btn.classList.contains('is-sold-out-btn') || btn.getAttribute('aria-disabled') === 'true'))) {
          alert('The Deluxe Printed Hardcopy edition is currently out of stock. Please select the E-Book edition for instant access.');
          return;
        }
        const titleEl = document.querySelector('h1.product__title') || document.querySelector('h1');
        const priceEl = document.querySelector('[data-product-price]') || document.querySelector('.product__price');
        const productTitle = titleEl ? titleEl.innerText.trim() : '6 Books to Design Interiors & Exteriors';
        let priceText = priceEl ? priceEl.innerText.replace(/[^0-9.]/g, '') : '49.00';
        if (!priceText) priceText = '49.00';

        handleCheckout({
          productTitle,
          variantTitle,
          price: priceText
        });
      };
    }

    if (window.executeStickyBuyNow) {
      window.executeStickyBuyNow = function(btn) {
        const activeSwatch = document.querySelector('.luxury-swatch-card.swatch--active') || document.querySelector('.swatch--active') || document.querySelector('[data-swatch-option].selected');
        const variantTitle = activeSwatch ? (activeSwatch.dataset.swatchOption || activeSwatch.innerText.trim()) : 'E-Book';
        if (variantTitle.toLowerCase().includes('hard') || (btn && (btn.disabled || btn.classList.contains('is-sold-out-btn') || btn.getAttribute('aria-disabled') === 'true'))) {
          alert('The Deluxe Printed Hardcopy edition is currently out of stock. Please select the E-Book edition for instant access.');
          return;
        }
        const titleEl = document.querySelector('h1.product__title') || document.querySelector('h1');
        const priceEl = document.querySelector('[data-product-price]') || document.querySelector('.product__price');
        const productTitle = titleEl ? titleEl.innerText.trim() : '6 Books to Design Interiors & Exteriors';
        let priceText = priceEl ? priceEl.innerText.replace(/[^0-9.]/g, '') : '49.00';
        if (!priceText) priceText = '49.00';

        handleCheckout({
          productTitle,
          variantTitle,
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
        
        if (variantTitle.toLowerCase().includes('hard') || btn.disabled || btn.classList.contains('is-sold-out-btn')) {
          e.preventDefault();
          e.stopPropagation();
          alert('The Deluxe Printed Hardcopy edition is currently out of stock. Please select the E-Book edition for instant access.');
          return;
        }

        e.preventDefault();
        e.stopPropagation();

        const titleEl = document.querySelector('h1.product__title') || document.querySelector('h1');
        const priceEl = document.querySelector('[data-product-price]') || document.querySelector('.product__price');

        const productTitle = titleEl ? titleEl.innerText.trim() : '6 Books to Design Interiors & Exteriors';
        
        let priceText = priceEl ? priceEl.innerText.replace(/[^0-9.]/g, '') : '49.00';
        if (!priceText) priceText = '49.00';

        handleCheckout({
          productTitle,
          variantTitle,
          price: priceText
        });
      });
    });
  };

  attachButtons();
  setTimeout(attachButtons, 800);
});
