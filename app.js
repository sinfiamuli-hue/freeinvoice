/* app.js - Invoice Maker Application Engine */

document.addEventListener('DOMContentLoaded', () => {
  
  // ----------------------------------------------------
  // 1. Initial State Definition
  // ----------------------------------------------------
  let state = {
    // Styling configurations
    style: {
      theme: 'light',
      layout: 'modern',
      primaryColor: '#2563eb',
      accentColor: '#3b82f6',
      headerBg: '#f8fafc',
      tableHeaderTxt: '#ffffff',
      borderRadius: 8,
      fontSizeBase: 13,
      fontFamily: "'Faruma_Regular', 'Inter', sans-serif"
    },
    
    // Header & Company Profile
    company: {
      logo: '', // Base64
      name: 'Apex Global Solutions Ltd',
      regNo: 'Reg No: 12345678-A',
      taxId: 'Tax ID: GB987654321',
      address: '100 Pine Street, Suite 2400\nSan Francisco, CA 94111\nUnited States',
      phone: '+1 (415) 555-0199',
      email: 'billing@apexglobal.com',
      website: 'www.apexglobal.com'
    },
    
    // Invoice meta data
    meta: {
      title: 'INVOICE',
      number: 'INV-2026-0001',
      autoNum: true,
      prefix: 'INV-2026-',
      date: '', // default today
      dueDate: '', // default today + 30 days
      terms: 'Net 30',
      poNumber: 'PO-998877',
      refNumber: 'REF-654',
      currency: 'USD',
      customCurrencySymbol: ''
    },
    
    // Client details
    client: {
      name: 'Jane Doe',
      company: 'Acme Corporation',
      address: '456 Oak Avenue, Building 4B\nBoston, MA 02110\nUnited States',
      phone: '+1 (617) 555-0245',
      email: 'jane.doe@acme.com',
      taxId: 'VAT ID: US554433221'
    },
    
    // Shipping Details (Optional)
    shippingEnabled: true,
    shipping: {
      name: 'Jane Doe (HQ)',
      address: '456 Oak Avenue, Building 4B\nBoston, MA 02110\nUnited States'
    },
    
    // Invoice Items
    items: [
      { desc: 'Web Application Design & UI/UX Wireframing\n- 8 Custom layout designs\n- Mobile responsive mapping', qty: 1, unit: 'Flat', price: 2400.00, disc: 10, tax: 5 },
      { desc: 'Full-Stack Frontend React/Node Development\n- Implementation of custom layout systems\n- Integration of state management', qty: 35, unit: 'hrs', price: 85.00, disc: 0, tax: 5 },
      { desc: 'Premium Assets & Deployment Configuration\n- Domain setup and SSL installation', qty: 1, unit: 'Unit', price: 150.00, disc: 0, tax: 0 }
    ],
    
    // Payment bank details
    payment: {
      bankName: 'Silicon Valley Bank',
      accName: 'Apex Global Solutions Ltd',
      accNumber: '1122334455',
      iban: 'US89 SVBA 0112 2334 4556 78',
      swift: 'SVBANY33',
      instructions: 'Please mention the invoice number as reference when making the bank wire transfer.'
    },
    
    // Notes & terms
    notes: 'Thank you for choosing Apex Global Solutions! We appreciate your business. Please reach out if you have any questions about this invoice.',
    terms: 'All invoices are subject to standard payment within 30 days. Late payments may accrue interest at 1.5% per month. Goods remain the property of Apex Global Solutions Ltd until fully paid.',
    
    // Totals input adjustments
    charges: {
      shipping: 50.00,
      additional: 0.00,
      paid: 0.00
    },
    
    // Signature block
    signature: {
      image: '', // Base64
      name: 'Marcus Aurelius',
      position: 'Chief Financial Officer',
      date: '' // default today
    },
    
    footerText: 'Apex Global Solutions Ltd • www.apexglobal.com • billing@apexglobal.com'
  };

  // Currencies lookup map
  const currencies = {
    USD: '$', EUR: '€', GBP: '£', AUD: 'A$', CAD: 'C$',
    AED: 'د.إ', MVR: 'Rf', INR: '₹', LKR: 'Rs', SGD: 'S$',
    MYR: 'RM', SAR: 'SR', QAR: 'QR', CUSTOM: ''
  };

  // ----------------------------------------------------
  // 2. Selectors / DOM Nodes
  // ----------------------------------------------------
  const DOM = {
    // Sidebar Controls
    themeToggle: document.getElementById('theme-toggle'),
    invoiceStyle: document.getElementById('invoice-style'),
    primaryColor: document.getElementById('primary-color'),
    accentColor: document.getElementById('accent-color'),
    headerBgColor: document.getElementById('header-bg-color'),
    tableHeaderColor: document.getElementById('table-header-color'),
    fontFamily: document.getElementById('font-family'),
    borderRadius: document.getElementById('border-radius'),
    borderRadiusVal: document.getElementById('border-radius-val'),
    fontSizeBase: document.getElementById('font-size-base'),
    fontSizeBaseVal: document.getElementById('font-size-base-val'),
    toggleShipping: document.getElementById('toggle-shipping'),
    toggleAutoInvoiceNum: document.getElementById('toggle-auto-invoice-num'),
    invoicePrefix: document.getElementById('invoice-prefix'),
    invoicePrefixGroup: document.getElementById('invoice-prefix-group'),
    validationErrors: document.getElementById('validation-errors'),
    
    // Sidebar Actions
    btnPrint: document.getElementById('btn-print'),
    btnPreviewMode: document.getElementById('btn-preview-mode'),
    btnSaveJson: document.getElementById('btn-save-json'),
    loadJsonFile: document.getElementById('load-json-file'),
    btnDuplicate: document.getElementById('btn-duplicate'),
    btnClear: document.getElementById('btn-clear'),
    btnExitPreview: document.getElementById('btn-exit-preview'),
    previewBanner: document.getElementById('preview-banner'),

    // Invoice Card & Wrappers
    invoiceCard: document.getElementById('invoice-card'),
    stripeAccent: document.getElementById('stripe-accent'),
    
    // Header Zone
    logoDropZone: document.getElementById('logo-drop-zone'),
    logoFileInput: document.getElementById('logo-file-input'),
    logoPlaceholder: document.getElementById('logo-placeholder'),
    logoPreviewWrapper: document.getElementById('logo-preview-wrapper'),
    logoPreview: document.getElementById('logo-preview'),
    btnRemoveLogo: document.getElementById('btn-remove-logo'),
    companyName: document.getElementById('company-name'),
    companyReg: document.getElementById('company-reg'),
    companyTaxId: document.getElementById('company-tax-id'),
    companyAddress: document.getElementById('company-address'),
    companyPhone: document.getElementById('company-phone'),
    companyEmail: document.getElementById('company-email'),
    companyWebsite: document.getElementById('company-website'),
    
    // Client Info
    clientName: document.getElementById('client-name'),
    clientCompany: document.getElementById('client-company'),
    clientAddress: document.getElementById('client-address'),
    clientPhone: document.getElementById('client-phone'),
    clientEmail: document.getElementById('client-email'),
    clientTaxId: document.getElementById('client-tax-id'),
    shippingSection: document.getElementById('shipping-section'),
    shipName: document.getElementById('ship-name'),
    shipAddress: document.getElementById('ship-address'),
    
    // Meta Info
    invoiceTitleLabel: document.getElementById('invoice-title-label'),
    invoiceNumber: document.getElementById('invoice-number'),
    invoiceDate: document.getElementById('invoice-date'),
    invoiceDueDate: document.getElementById('invoice-due-date'),
    paymentTerms: document.getElementById('payment-terms'),
    poNumber: document.getElementById('po-number'),
    refNumber: document.getElementById('ref-number'),
    invoiceCurrency: document.getElementById('invoice-currency'),
    customCurrencySymbol: document.getElementById('custom-currency-symbol'),
    
    // Items
    itemsTbody: document.getElementById('items-tbody'),
    btnAddItem: document.getElementById('btn-add-item'),
    
    // Payment Details
    bankName: document.getElementById('bank-name'),
    bankAccName: document.getElementById('bank-acc-name'),
    bankAccNum: document.getElementById('bank-acc-num'),
    bankIban: document.getElementById('bank-iban'),
    bankSwift: document.getElementById('bank-swift'),
    paymentInstructions: document.getElementById('payment-instructions'),
    
    // Totals Panel
    calcSubtotal: document.getElementById('calc-subtotal'),
    calcDiscountTotal: document.getElementById('calc-discount-total'),
    calcTaxTotal: document.getElementById('calc-tax-total'),
    chargeShipping: document.getElementById('charge-shipping'),
    chargeAdditional: document.getElementById('charge-additional'),
    calcGrandTotal: document.getElementById('calc-grand-total'),
    chargePaid: document.getElementById('charge-paid'),
    calcBalanceDue: document.getElementById('calc-balance-due'),
    
    // Notes & Footer
    invoiceNotes: document.getElementById('invoice-notes'),
    invoiceTerms: document.getElementById('invoice-terms'),
    footerText: document.getElementById('footer-text'),
    
    // Signatures
    signatureDropZone: document.getElementById('signature-drop-zone'),
    signatureFileInput: document.getElementById('signature-file-input'),
    sigPlaceholder: document.getElementById('sig-placeholder'),
    sigPreviewWrapper: document.getElementById('sig-preview-wrapper'),
    sigPreview: document.getElementById('sig-preview'),
    btnRemoveSig: document.getElementById('btn-remove-sig'),
    sigName: document.getElementById('sig-name'),
    sigPosition: document.getElementById('sig-position'),
    sigDate: document.getElementById('sig-date')
  };

  // ----------------------------------------------------
  // 3. Helper Functions
  // ----------------------------------------------------
  
  // Format Date to YYYY-MM-DD
  function formatDate(date) {
    const d = new Date(date);
    let month = '' + (d.getMonth() + 1);
    let day = '' + d.getDate();
    const year = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [year, month, day].join('-');
  }

  // Get date in future by N days
  function getFutureDate(days) {
    const d = new Date();
    d.setDate(d.getDate() + days);
    return formatDate(d);
  }

  // Get active currency symbol
  function getCurrencySymbol() {
    const code = state.meta.currency;
    if (code === 'CUSTOM') {
      return state.meta.customCurrencySymbol || '';
    }
    return currencies[code] || '$';
  }

  // Format currency value safely
  function formatMoney(amount) {
    const symbol = getCurrencySymbol();
    // Handles negative formatting beautifully
    if (amount < 0) {
      return `-${symbol}${Math.abs(amount).toFixed(2)}`;
    }
    return `${symbol}${amount.toFixed(2)}`;
  }

  // Update dynamic hex label in sidebar
  function updateHexLabel(inputEl) {
    const span = inputEl.nextElementSibling;
    if (span && span.classList.contains('color-hex')) {
      span.textContent = inputEl.value;
    }
  }

  // Auto-grow textareas inline inside the invoice sheet
  function autoGrowTextarea(el) {
    el.style.height = 'auto';
    el.style.height = el.scrollHeight + 'px';
  }

  // Trigger auto-grow for all textareas
  function triggerTextareaAutoGrow() {
    document.querySelectorAll('.invoice-card textarea').forEach(textarea => {
      autoGrowTextarea(textarea);
    });
  }

  // Generate Invoice Number (e.g. INV-2026-0001)
  function generateInvoiceNum() {
    const prefix = state.meta.prefix;
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    return `${prefix}${randomNum}`;
  }

  // ----------------------------------------------------
  // 4. State Sync & rendering
  // ----------------------------------------------------
  
  // Sync state variables back to UI elements
  function syncStateToDOM() {
    // Themes & Layout
    document.documentElement.setAttribute('data-theme', state.style.theme);
    DOM.invoiceStyle.value = state.style.layout;
    DOM.primaryColor.value = state.style.primaryColor;
    DOM.accentColor.value = state.style.accentColor;
    DOM.headerBgColor.value = state.style.headerBg;
    DOM.tableHeaderColor.value = state.style.tableHeaderTxt;
    DOM.fontFamily.value = state.style.fontFamily;
    DOM.borderRadius.value = state.style.borderRadius;
    DOM.borderRadiusVal.textContent = `${state.style.borderRadius}px`;
    DOM.fontSizeBase.value = state.style.fontSizeBase;
    DOM.fontSizeBaseVal.textContent = `${state.style.fontSizeBase}px`;
    
    // Update theme visual configurations
    updateThemeCustomizer();

    // Company Info
    DOM.companyName.value = state.company.name;
    DOM.companyReg.value = state.company.regNo;
    DOM.companyTaxId.value = state.company.taxId;
    DOM.companyAddress.value = state.company.address;
    DOM.companyPhone.value = state.company.phone;
    DOM.companyEmail.value = state.company.email;
    DOM.companyWebsite.value = state.company.website;

    // Load Company Logo if exists
    if (state.company.logo) {
      DOM.logoPreview.src = state.company.logo;
      DOM.logoPreviewWrapper.style.display = 'flex';
      DOM.logoPlaceholder.style.display = 'none';
      DOM.logoDropZone.classList.add('has-image');
    } else {
      DOM.logoPreview.src = '';
      DOM.logoPreviewWrapper.style.display = 'none';
      DOM.logoPlaceholder.style.display = 'flex';
      DOM.logoDropZone.classList.remove('has-image');
    }

    // Client Info
    DOM.clientName.value = state.client.name;
    DOM.clientCompany.value = state.client.company;
    DOM.clientAddress.value = state.client.address;
    DOM.clientPhone.value = state.client.phone;
    DOM.clientEmail.value = state.client.email;
    DOM.clientTaxId.value = state.client.taxId;

    // Shipping Section
    DOM.toggleShipping.checked = state.shippingEnabled;
    if (state.shippingEnabled) {
      DOM.shippingSection.style.display = 'block';
    } else {
      DOM.shippingSection.style.display = 'none';
    }
    DOM.shipName.value = state.shipping.name;
    DOM.shipAddress.value = state.shipping.address;

    // Meta Info
    DOM.invoiceTitleLabel.value = state.meta.title;
    DOM.invoiceNumber.value = state.meta.number;
    DOM.invoiceDate.value = state.meta.date;
    DOM.invoiceDueDate.value = state.meta.dueDate;
    DOM.paymentTerms.value = state.meta.terms;
    DOM.poNumber.value = state.meta.poNumber;
    DOM.refNumber.value = state.meta.refNumber;
    DOM.invoiceCurrency.value = state.meta.currency;
    DOM.customCurrencySymbol.value = state.meta.customCurrencySymbol;
    DOM.toggleAutoInvoiceNum.checked = state.meta.autoNum;
    DOM.invoicePrefix.value = state.meta.prefix;

    if (state.meta.currency === 'CUSTOM') {
      DOM.customCurrencySymbol.style.display = 'inline-block';
    } else {
      DOM.customCurrencySymbol.style.display = 'none';
    }

    if (state.meta.autoNum) {
      DOM.invoicePrefixGroup.style.display = 'flex';
    } else {
      DOM.invoicePrefixGroup.style.display = 'none';
    }

    // Payment Info
    DOM.bankName.value = state.payment.bankName;
    DOM.bankAccName.value = state.payment.accName;
    DOM.bankAccNum.value = state.payment.accNumber;
    DOM.bankIban.value = state.payment.iban;
    DOM.bankSwift.value = state.payment.swift;
    DOM.paymentInstructions.value = state.payment.instructions;

    // Notes & Footers
    DOM.invoiceNotes.value = state.notes;
    DOM.invoiceTerms.value = state.terms;
    DOM.footerText.value = state.footerText;

    // Totals Input values
    DOM.chargeShipping.value = state.charges.shipping;
    DOM.chargeAdditional.value = state.charges.additional;
    DOM.chargePaid.value = state.charges.paid;

    // Signature Load
    if (state.signature.image) {
      DOM.sigPreview.src = state.signature.image;
      DOM.sigPreviewWrapper.style.display = 'flex';
      DOM.sigPlaceholder.style.display = 'none';
      DOM.signatureDropZone.classList.add('has-image');
    } else {
      DOM.sigPreview.src = '';
      DOM.sigPreviewWrapper.style.display = 'none';
      DOM.sigPlaceholder.style.display = 'flex';
      DOM.signatureDropZone.classList.remove('has-image');
    }
    DOM.sigName.value = state.signature.name;
    DOM.sigPosition.value = state.signature.position;
    DOM.sigDate.value = state.signature.date;

    // Redraw Table rows
    renderItemsTable();

    // Re-calculate everything
    recalculateInvoice();

    // Adjust textareas height
    setTimeout(triggerTextareaAutoGrow, 50);

    lucide.createIcons();
  }

  // Update theme settings directly in CSS Variables
  function updateThemeCustomizer() {
    const root = document.documentElement;
    root.style.setProperty('--primary-color', state.style.primaryColor);
    root.style.setProperty('--accent-color', state.style.accentColor);
    root.style.setProperty('--header-bg', state.style.headerBg);
    root.style.setProperty('--table-header-txt', state.style.tableHeaderTxt);
    root.style.setProperty('--border-radius', `${state.style.borderRadius}px`);
    root.style.setProperty('--font-family', state.style.fontFamily);
    root.style.setProperty('--font-size-base', `${state.style.fontSizeBase}px`);

    // Sync input HEX displays
    updateHexLabel(DOM.primaryColor);
    updateHexLabel(DOM.accentColor);
    updateHexLabel(DOM.headerBgColor);
    updateHexLabel(DOM.tableHeaderColor);

    // Apply layout style class on card
    DOM.invoiceCard.className = 'invoice-card'; // reset
    DOM.invoiceCard.classList.add(`layout-${state.style.layout}`);

    // Update symbols on subtotal panels
    const symbol = getCurrencySymbol();
    document.querySelectorAll('.curr-sym').forEach(el => {
      el.textContent = symbol;
    });
  }

  // ----------------------------------------------------
  // 5. Calculations Engine
  // ----------------------------------------------------
  function recalculateInvoice() {
    let subtotal = 0;
    let discountTotal = 0;
    let taxTotal = 0;

    state.items.forEach(item => {
      const qty = parseFloat(item.qty) || 0;
      const price = parseFloat(item.price) || 0;
      const discPercent = parseFloat(item.disc) || 0;
      const taxPercent = parseFloat(item.tax) || 0;

      // Base line cost
      const rawCost = qty * price;
      
      // Discount
      const lineDisc = rawCost * (discPercent / 100);
      discountTotal += lineDisc;

      // Discounted Cost
      const discountedCost = rawCost - lineDisc;

      // Tax (applied after discount)
      const lineTax = discountedCost * (taxPercent / 100);
      taxTotal += lineTax;

      // Add to subtotal (subtotal shows items before taxes and shipping, but usually after item discounts)
      subtotal += discountedCost;
    });

    // Total Calculations
    const shipping = parseFloat(state.charges.shipping) || 0;
    const additional = parseFloat(state.charges.additional) || 0;
    const paid = parseFloat(state.charges.paid) || 0;

    const grandTotal = subtotal + taxTotal + shipping + additional;
    const balanceDue = grandTotal - paid;

    // Hydrate fields
    DOM.calcSubtotal.textContent = formatMoney(subtotal + discountTotal); // Subtotal before item discounts
    DOM.calcDiscountTotal.textContent = `-${formatMoney(discountTotal)}`;
    DOM.calcTaxTotal.textContent = formatMoney(taxTotal);
    DOM.calcGrandTotal.textContent = formatMoney(grandTotal);
    DOM.calcBalanceDue.textContent = formatMoney(balanceDue);

    // Style balance due dynamically
    if (balanceDue > 0) {
      DOM.calcBalanceDue.style.color = '#ef4444'; // Red warning
    } else if (balanceDue === 0) {
      DOM.calcBalanceDue.style.color = '#16a34a'; // Green check
    } else {
      DOM.calcBalanceDue.style.color = '#2563eb'; // Credit/Overpaid
    }

    // Keep state values sync
    state.charges.shipping = shipping;
    state.charges.additional = additional;
    state.charges.paid = paid;

    // Trigger validations
    runValidationCheck();
  }

  // ----------------------------------------------------
  // 6. Validation System
  // ----------------------------------------------------
  function runValidationCheck() {
    const warnings = [];

    if (!state.meta.number.trim()) {
      warnings.push('Invoice Number is empty.');
    }
    if (!state.client.name.trim()) {
      warnings.push('Customer Name is empty.');
    }
    if (state.items.length === 0) {
      warnings.push('Invoice must contain at least one line item.');
    }

    state.items.forEach((item, index) => {
      const idx = index + 1;
      if (!item.desc.trim()) {
        warnings.push(`Item #${idx}: Description is empty.`);
      }
      if (parseFloat(item.qty) <= 0 || isNaN(parseFloat(item.qty))) {
        warnings.push(`Item #${idx}: Quantity must be positive.`);
      }
      if (parseFloat(item.price) < 0 || isNaN(parseFloat(item.price))) {
        warnings.push(`Item #${idx}: Price cannot be negative.`);
      }
    });

    // Render Warnings inside sidebar
    DOM.validationErrors.innerHTML = '';
    
    if (warnings.length > 0) {
      warnings.forEach(warn => {
        const div = document.createElement('div');
        div.className = 'val-error-item';
        div.innerHTML = `<i data-lucide="alert-triangle"></i> <span>${warn}</span>`;
        DOM.validationErrors.appendChild(div);
      });
      lucide.createIcons();
    } else {
      DOM.validationErrors.innerHTML = `<div class="val-success-msg"><i data-lucide="check-circle-2"></i> Invoice checks out perfectly!</div>`;
      lucide.createIcons();
    }
  }

  // ----------------------------------------------------
  // 7. Items Table Render & Interactive Handlers
  // ----------------------------------------------------
  function renderItemsTable() {
    DOM.itemsTbody.innerHTML = '';

    state.items.forEach((item, index) => {
      const tr = document.createElement('tr');
      tr.className = 'item-row';
      tr.dataset.index = index;

      const qty = parseFloat(item.qty) || 0;
      const price = parseFloat(item.price) || 0;
      const disc = parseFloat(item.disc) || 0;
      const amount = (qty * price) * (1 - disc / 100);

      tr.innerHTML = `
        <td class="col-num text-center">${index + 1}</td>
        <td class="col-desc">
          <textarea class="editable-textarea item-desc-area" placeholder="Item description & details...">${item.desc}</textarea>
        </td>
        <td class="col-qty text-right">
          <input type="number" class="editable-input text-right item-qty" step="any" min="0" value="${item.qty}">
        </td>
        <td class="col-unit text-center">
          <input type="text" class="editable-input text-center item-unit" placeholder="pcs" value="${item.unit}">
        </td>
        <td class="col-price text-right">
          <input type="number" class="editable-input text-right item-price" step="any" min="0" value="${item.price.toFixed(2)}">
        </td>
        <td class="col-disc text-right">
          <input type="number" class="editable-input text-right item-disc" step="any" min="0" max="100" value="${item.disc}">
        </td>
        <td class="col-tax text-right">
          <input type="number" class="editable-input text-right item-tax" step="any" min="0" max="100" value="${item.tax}">
        </td>
        <td class="col-amount text-right font-weight-600 item-amount-val">${formatMoney(amount)}</td>
        <td class="col-actions text-center no-print">
          <div class="item-actions-wrapper">
            <button class="row-action-btn btn-move-up" title="Move Up"><i data-lucide="arrow-up"></i></button>
            <button class="row-action-btn btn-move-down" title="Move Down"><i data-lucide="arrow-down"></i></button>
            <button class="row-action-btn btn-duplicate-row" title="Duplicate Row"><i data-lucide="copy"></i></button>
            <button class="row-action-btn btn-delete-row" title="Delete Row"><i data-lucide="trash-2"></i></button>
          </div>
        </td>
      `;

      // Textarea Auto Grow bindings
      const descArea = tr.querySelector('.item-desc-area');
      descArea.addEventListener('input', (e) => {
        state.items[index].desc = e.target.value;
        autoGrowTextarea(e.target);
        runValidationCheck();
      });
      // Initial height sync
      setTimeout(() => autoGrowTextarea(descArea), 10);

      // Value input bindings
      tr.querySelector('.item-qty').addEventListener('input', (e) => {
        state.items[index].qty = parseFloat(e.target.value) || 0;
        updateRowAmount(tr, index);
      });
      tr.querySelector('.item-unit').addEventListener('input', (e) => {
        state.items[index].unit = e.target.value;
      });
      tr.querySelector('.item-price').addEventListener('input', (e) => {
        state.items[index].price = parseFloat(e.target.value) || 0;
        updateRowAmount(tr, index);
      });
      tr.querySelector('.item-disc').addEventListener('input', (e) => {
        state.items[index].disc = parseFloat(e.target.value) || 0;
        updateRowAmount(tr, index);
      });
      tr.querySelector('.item-tax').addEventListener('input', (e) => {
        state.items[index].tax = parseFloat(e.target.value) || 0;
        updateRowAmount(tr, index);
      });

      // Actions buttons binding
      tr.querySelector('.btn-move-up').addEventListener('click', () => moveItemRow(index, -1));
      tr.querySelector('.btn-move-down').addEventListener('click', () => moveItemRow(index, 1));
      tr.querySelector('.btn-duplicate-row').addEventListener('click', () => duplicateItemRow(index));
      tr.querySelector('.btn-delete-row').addEventListener('click', () => deleteItemRow(index));

      DOM.itemsTbody.appendChild(tr);
    });

    lucide.createIcons();
  }

  // Update a single row total in real-time
  function updateRowAmount(rowEl, index) {
    const qty = parseFloat(state.items[index].qty) || 0;
    const price = parseFloat(state.items[index].price) || 0;
    const disc = parseFloat(state.items[index].disc) || 0;
    const amount = (qty * price) * (1 - disc / 100);

    rowEl.querySelector('.item-amount-val').textContent = formatMoney(amount);
    recalculateInvoice();
  }

  // Add Item Row
  function addNewItem() {
    state.items.push({ desc: '', qty: 1, unit: 'pcs', price: 0.00, disc: 0, tax: 0 });
    renderItemsTable();
    recalculateInvoice();
    // Focus new description area
    const rows = DOM.itemsTbody.querySelectorAll('.item-row');
    if (rows.length > 0) {
      const lastRowDesc = rows[rows.length - 1].querySelector('.item-desc-area');
      lastRowDesc.focus();
    }
  }

  // Delete Item Row
  function deleteItemRow(index) {
    state.items.splice(index, 1);
    renderItemsTable();
    recalculateInvoice();
  }

  // Duplicate Item Row
  function duplicateItemRow(index) {
    const item = state.items[index];
    // Create shallow copy
    state.items.splice(index + 1, 0, { ...item });
    renderItemsTable();
    recalculateInvoice();
  }

  // Move Item Row Up/Down in array
  function moveItemRow(index, direction) {
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= state.items.length) return;

    // Swap elements in state array
    const temp = state.items[index];
    state.items[index] = state.items[targetIndex];
    state.items[targetIndex] = temp;

    renderItemsTable();
    recalculateInvoice();
    
    // Focus description of moved row
    const rows = DOM.itemsTbody.querySelectorAll('.item-row');
    rows[targetIndex].querySelector('.item-desc-area').focus();
  }

  // Keyboard navigation inside table
  DOM.itemsTbody.addEventListener('keydown', (e) => {
    const target = e.target;
    if (!target.classList.contains('editable-input') && !target.classList.contains('editable-textarea')) return;

    const cell = target.closest('td');
    const row = target.closest('tr');
    const rowIndex = parseInt(row.dataset.index);
    const colClass = getColClass(cell);

    // Tab navigation on last field (Tax %) of last row triggers new row creation
    if (e.key === 'Tab' && !e.shiftKey && colClass === 'col-tax' && rowIndex === state.items.length - 1) {
      e.preventDefault();
      addNewItem();
      return;
    }

    // Arrow navigation
    if (e.key === 'ArrowDown') {
      const nextRow = DOM.itemsTbody.querySelector(`.item-row[data-index="${rowIndex + 1}"]`);
      if (nextRow) {
        nextRow.querySelector(`.${colClass} input, .${colClass} textarea`).focus();
      }
    } else if (e.key === 'ArrowUp') {
      const prevRow = DOM.itemsTbody.querySelector(`.item-row[data-index="${rowIndex - 1}"]`);
      if (prevRow) {
        prevRow.querySelector(`.${colClass} input, .${colClass} textarea`).focus();
      }
    }
  });

  // Extract grid column class name from table cells
  function getColClass(cellEl) {
    if (cellEl.classList.contains('col-desc')) return 'item-desc-area';
    if (cellEl.classList.contains('col-qty')) return 'item-qty';
    if (cellEl.classList.contains('col-unit')) return 'item-unit';
    if (cellEl.classList.contains('col-price')) return 'item-price';
    if (cellEl.classList.contains('col-disc')) return 'item-disc';
    if (cellEl.classList.contains('col-tax')) return 'item-tax';
    return '';
  }

  // ----------------------------------------------------
  // 8. Image drag-and-drop systems
  // ----------------------------------------------------
  function setupImageUpload(dropZoneEl, fileInputEl, stateKey, previewEl, wrapperEl, placeholderEl, removeBtnEl) {
    
    // Drag & Drop event bindings
    ['dragenter', 'dragover'].forEach(eventName => {
      dropZoneEl.addEventListener(eventName, (e) => {
        e.preventDefault();
        dropZoneEl.style.borderColor = 'var(--primary-color)';
        dropZoneEl.style.backgroundColor = '#f1f5f9';
      }, false);
    });

    ['dragleave', 'drop'].forEach(eventName => {
      dropZoneEl.addEventListener(eventName, (e) => {
        e.preventDefault();
        dropZoneEl.style.borderColor = '#cbd5e1';
        dropZoneEl.style.backgroundColor = '#f8fafc';
      }, false);
    });

    dropZoneEl.addEventListener('drop', (e) => {
      const dt = e.dataTransfer;
      const files = dt.files;
      if (files.length > 0) {
        handleFile(files[0]);
      }
    }, false);

    // Click trigger bind
    dropZoneEl.addEventListener('click', (e) => {
      if (e.target.closest('.remove-img-btn')) return; // ignore click from delete button
      fileInputEl.click();
    });

    fileInputEl.addEventListener('change', (e) => {
      if (e.target.files.length > 0) {
        handleFile(e.target.files[0]);
      }
    });

    // Remove Image button bind
    removeBtnEl.addEventListener('click', (e) => {
      e.stopPropagation();
      state[stateKey.parent][stateKey.child] = '';
      previewEl.src = '';
      wrapperEl.style.display = 'none';
      placeholderEl.style.display = 'flex';
      dropZoneEl.classList.remove('has-image');
      fileInputEl.value = ''; // clear input cache
      saveStateToLocalStorage();
    });

    // FileReader handle file
    function handleFile(file) {
      if (!file.type.match('image.*')) {
        alert('Please upload an image file (PNG, JPG, or SVG).');
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const base64Data = e.target.result;
        state[stateKey.parent][stateKey.child] = base64Data;
        previewEl.src = base64Data;
        wrapperEl.style.display = 'flex';
        placeholderEl.style.display = 'none';
        dropZoneEl.classList.add('has-image');
        saveStateToLocalStorage();
      };
      reader.readAsDataURL(file);
    }
  }

  // ----------------------------------------------------
  // 9. Input Change / Value Bindings
  // ----------------------------------------------------
  
  // Bind simple text inputs
  function bindInput(domEl, stateKey) {
    domEl.addEventListener('input', (e) => {
      state[stateKey.parent][stateKey.child] = e.target.value;
      saveStateToLocalStorage();
      runValidationCheck();
    });
  }

  // Bind textareas (grows automatically)
  function bindTextarea(domEl, stateKey) {
    domEl.addEventListener('input', (e) => {
      state[stateKey.parent][stateKey.child] = e.target.value;
      autoGrowTextarea(e.target);
      saveStateToLocalStorage();
      runValidationCheck();
    });
  }

  // Bind specific numeric totals values
  function bindTotalsInput(domEl, chargeKey) {
    domEl.addEventListener('input', (e) => {
      state.charges[chargeKey] = parseFloat(e.target.value) || 0;
      recalculateInvoice();
      saveStateToLocalStorage();
    });
  }

  // Set up all static text field bindings
  bindInput(DOM.companyName, { parent: 'company', child: 'name' });
  bindInput(DOM.companyReg, { parent: 'company', child: 'regNo' });
  bindInput(DOM.companyTaxId, { parent: 'company', child: 'taxId' });
  bindTextarea(DOM.companyAddress, { parent: 'company', child: 'address' });
  bindInput(DOM.companyPhone, { parent: 'company', child: 'phone' });
  bindInput(DOM.companyEmail, { parent: 'company', child: 'email' });
  bindInput(DOM.companyWebsite, { parent: 'company', child: 'website' });

  bindInput(DOM.clientName, { parent: 'client', child: 'name' });
  bindInput(DOM.clientCompany, { parent: 'client', child: 'company' });
  bindTextarea(DOM.clientAddress, { parent: 'client', child: 'address' });
  bindInput(DOM.clientPhone, { parent: 'client', child: 'phone' });
  bindInput(DOM.clientEmail, { parent: 'client', child: 'email' });
  bindInput(DOM.clientTaxId, { parent: 'client', child: 'taxId' });

  bindInput(DOM.shipName, { parent: 'shipping', child: 'name' });
  bindTextarea(DOM.shipAddress, { parent: 'shipping', child: 'address' });

  bindInput(DOM.invoiceTitleLabel, { parent: 'meta', child: 'title' });
  bindInput(DOM.invoiceNumber, { parent: 'meta', child: 'number' });
  bindInput(DOM.poNumber, { parent: 'meta', child: 'poNumber' });
  bindInput(DOM.refNumber, { parent: 'meta', child: 'refNumber' });

  bindInput(DOM.bankName, { parent: 'payment', child: 'bankName' });
  bindInput(DOM.bankAccName, { parent: 'payment', child: 'accName' });
  bindInput(DOM.bankAccNum, { parent: 'payment', child: 'accNumber' });
  bindInput(DOM.bankIban, { parent: 'payment', child: 'iban' });
  bindInput(DOM.bankSwift, { parent: 'payment', child: 'swift' });
  bindTextarea(DOM.paymentInstructions, { parent: 'payment', child: 'instructions' });

  bindTextarea(DOM.invoiceNotes, { parent: '', child: 'notes' });
  bindTextarea(DOM.invoiceTerms, { parent: '', child: 'terms' });
  bindInput(DOM.footerText, { parent: '', child: 'footerText' });

  bindInput(DOM.sigName, { parent: 'signature', child: 'name' });
  bindInput(DOM.sigPosition, { parent: 'signature', child: 'position' });

  // Bind dates
  DOM.invoiceDate.addEventListener('change', (e) => {
    state.meta.date = e.target.value;
    saveStateToLocalStorage();
  });
  DOM.invoiceDueDate.addEventListener('change', (e) => {
    state.meta.dueDate = e.target.value;
    saveStateToLocalStorage();
  });
  DOM.sigDate.addEventListener('change', (e) => {
    state.signature.date = e.target.value;
    saveStateToLocalStorage();
  });

  // Bind totals charges
  bindTotalsInput(DOM.chargeShipping, 'shipping');
  bindTotalsInput(DOM.chargeAdditional, 'additional');
  bindTotalsInput(DOM.chargePaid, 'paid');

  // Currency select bind
  DOM.invoiceCurrency.addEventListener('change', (e) => {
    state.meta.currency = e.target.value;
    if (state.meta.currency === 'CUSTOM') {
      DOM.customCurrencySymbol.style.display = 'inline-block';
      DOM.customCurrencySymbol.focus();
    } else {
      DOM.customCurrencySymbol.style.display = 'none';
      state.meta.customCurrencySymbol = '';
    }
    updateThemeCustomizer();
    recalculateInvoice();
    renderItemsTable();
    saveStateToLocalStorage();
  });

  DOM.customCurrencySymbol.addEventListener('input', (e) => {
    state.meta.customCurrencySymbol = e.target.value;
    updateThemeCustomizer();
    recalculateInvoice();
    renderItemsTable();
    saveStateToLocalStorage();
  });

  // Terms Select terms bind
  DOM.paymentTerms.addEventListener('change', (e) => {
    state.meta.terms = e.target.value;
    if (state.meta.terms !== 'Custom') {
      // Calculate due date automatically based on Invoice Date
      let days = 0;
      if (state.meta.terms === 'Net 15') days = 15;
      else if (state.meta.terms === 'Net 30') days = 30;
      else if (state.meta.terms === 'Net 45') days = 45;
      else if (state.meta.terms === 'Net 60') days = 60;
      
      const invoiceDateVal = DOM.invoiceDate.value ? new Date(DOM.invoiceDate.value) : new Date();
      invoiceDateVal.setDate(invoiceDateVal.getDate() + days);
      const computedDueDate = formatDate(invoiceDateVal);
      DOM.invoiceDueDate.value = computedDueDate;
      state.meta.dueDate = computedDueDate;
    }
    saveStateToLocalStorage();
  });

  // Theme customizer bindings
  DOM.invoiceStyle.addEventListener('change', (e) => {
    state.style.layout = e.target.value;
    updateThemeCustomizer();
    saveStateToLocalStorage();
    triggerTextareaAutoGrow();
  });

  DOM.primaryColor.addEventListener('input', (e) => {
    state.style.primaryColor = e.target.value;
    updateThemeCustomizer();
    saveStateToLocalStorage();
  });

  DOM.accentColor.addEventListener('input', (e) => {
    state.style.accentColor = e.target.value;
    updateThemeCustomizer();
    saveStateToLocalStorage();
  });

  DOM.headerBgColor.addEventListener('input', (e) => {
    state.style.headerBg = e.target.value;
    updateThemeCustomizer();
    saveStateToLocalStorage();
  });

  DOM.tableHeaderColor.addEventListener('input', (e) => {
    state.style.tableHeaderTxt = e.target.value;
    updateThemeCustomizer();
    saveStateToLocalStorage();
  });

  DOM.fontFamily.addEventListener('change', (e) => {
    state.style.fontFamily = e.target.value;
    updateThemeCustomizer();
    saveStateToLocalStorage();
  });

  DOM.borderRadius.addEventListener('input', (e) => {
    state.style.borderRadius = parseInt(e.target.value);
    DOM.borderRadiusVal.textContent = `${state.style.borderRadius}px`;
    updateThemeCustomizer();
    saveStateToLocalStorage();
  });

  DOM.fontSizeBase.addEventListener('input', (e) => {
    state.style.fontSizeBase = parseInt(e.target.value);
    DOM.fontSizeBaseVal.textContent = `${state.style.fontSizeBase}px`;
    updateThemeCustomizer();
    saveStateToLocalStorage();
    triggerTextareaAutoGrow();
  });

  // Toggles
  DOM.toggleShipping.addEventListener('change', (e) => {
    state.shippingEnabled = e.target.checked;
    if (state.shippingEnabled) {
      DOM.shippingSection.style.display = 'block';
    } else {
      DOM.shippingSection.style.display = 'none';
    }
    saveStateToLocalStorage();
    triggerTextareaAutoGrow();
  });

  DOM.toggleAutoInvoiceNum.addEventListener('change', (e) => {
    state.meta.autoNum = e.target.checked;
    if (state.meta.autoNum) {
      DOM.invoicePrefixGroup.style.display = 'flex';
      const generated = generateInvoiceNum();
      DOM.invoiceNumber.value = generated;
      state.meta.number = generated;
    } else {
      DOM.invoicePrefixGroup.style.display = 'none';
    }
    saveStateToLocalStorage();
  });

  DOM.invoicePrefix.addEventListener('input', (e) => {
    state.meta.prefix = e.target.value;
    if (state.meta.autoNum) {
      const generated = generateInvoiceNum();
      DOM.invoiceNumber.value = generated;
      state.meta.number = generated;
    }
    saveStateToLocalStorage();
  });

  // ----------------------------------------------------
  // 10. Sidebar Actions Bindings
  // ----------------------------------------------------

  // Print Action
  DOM.btnPrint.addEventListener('click', () => {
    window.print();
  });

  // Preview Mode Action
  DOM.btnPreviewMode.addEventListener('click', togglePreviewMode);
  DOM.btnExitPreview.addEventListener('click', togglePreviewMode);

  function togglePreviewMode() {
    const body = document.body;
    body.classList.toggle('preview-mode-active');
    DOM.previewBanner.classList.toggle('active');
    triggerTextareaAutoGrow();
  }

  // Add Item Action
  DOM.btnAddItem.addEventListener('click', addNewItem);

  // Theme Dark/Light toggle
  DOM.themeToggle.addEventListener('click', () => {
    const nextTheme = state.style.theme === 'light' ? 'dark' : 'light';
    state.style.theme = nextTheme;
    document.documentElement.setAttribute('data-theme', nextTheme);
    saveStateToLocalStorage();
  });

  // Save JSON
  DOM.btnSaveJson.addEventListener('click', () => {
    const filename = `invoice-${state.meta.number || 'draft'}.json`;
    const jsonStr = JSON.stringify(state, null, 2);

    // Blob + object URL works reliably on iOS Safari and Android Chrome.
    // (data: URIs frequently open in a new tab instead of downloading on mobile Safari.)
    const blob = new Blob([jsonStr], { type: 'application/json' });

    if (navigator.share && navigator.canShare && navigator.canShare({ files: [new File([blob], filename, { type: 'application/json' })] })) {
      // Mobile devices that support the native Share Sheet: let the user pick
      // "Save to Files" (iOS) or a save/share target (Android) directly.
      const file = new File([blob], filename, { type: 'application/json' });
      navigator.share({ files: [file], title: filename }).catch(() => {
        downloadViaAnchor(blob, filename);
      });
    } else {
      downloadViaAnchor(blob, filename);
    }
  });

  function downloadViaAnchor(blob, filename) {
    const url = URL.createObjectURL(blob);
    const downloadAnchor = document.createElement('a');
    downloadAnchor.href = url;
    downloadAnchor.download = filename;
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    // Delay revoke slightly so the browser has time to start the download
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  // Load JSON
  DOM.loadJsonFile.addEventListener('change', (e) => {
    const files = e.target.files;
    if (files.length === 0) return;

    const file = files[0];
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const loadedState = JSON.parse(event.target.result);
        
        // Simple structure validation
        if (loadedState.items && Array.isArray(loadedState.items) && loadedState.company && loadedState.client) {
          state = { ...state, ...loadedState };
          syncStateToDOM();
          alert('Invoice loaded successfully!');
        } else {
          alert('Invalid JSON file layout. Unable to load.');
        }
      } catch (err) {
        alert('Failed to parse JSON file.');
      }
    };
    reader.readAsText(file);
    e.target.value = ''; // Reset input selection
  });

  // Duplicate Invoice
  DOM.btnDuplicate.addEventListener('click', () => {
    // Generate new invoice number
    let nextNum = state.meta.number;
    if (state.meta.autoNum) {
      nextNum = generateInvoiceNum();
    } else {
      nextNum += ' (Copy)';
    }

    state.meta.number = nextNum;
    state.meta.date = formatDate(new Date());
    state.signature.date = formatDate(new Date());

    syncStateToDOM();
    alert('Invoice duplicated! Created a copy with today\'s date.');
  });

  // Clear Invoice
  DOM.btnClear.addEventListener('click', () => {
    if (!confirm('Are you sure you want to clear this entire invoice? This will reset all fields and delete all items.')) return;

    // Reset fields back to clean/empty values
    state.company = { logo: '', name: '', regNo: '', taxId: '', address: '', phone: '', email: '', website: '' };
    state.client = { name: '', company: '', address: '', phone: '', email: '', taxId: '' };
    state.shipping = { name: '', address: '' };
    state.items = [];
    state.meta.number = '';
    state.meta.date = formatDate(new Date());
    state.meta.dueDate = getFutureDate(30);
    state.meta.terms = 'Net 30';
    state.meta.poNumber = '';
    state.meta.refNumber = '';
    state.payment = { bankName: '', accName: '', accNumber: '', iban: '', swift: '', instructions: '' };
    state.notes = '';
    state.terms = '';
    state.charges = { shipping: 0.00, additional: 0.00, paid: 0.00 };
    state.signature = { image: '', name: '', position: '', date: formatDate(new Date()) };
    state.footerText = '';

    syncStateToDOM();
  });

  // ----------------------------------------------------
  // 11. LocalStorage Management
  // ----------------------------------------------------
  function saveStateToLocalStorage() {
    localStorage.setItem('invoicely_state', JSON.stringify(state));
  }

  function loadStateFromLocalStorage() {
    const local = localStorage.getItem('invoicely_state');
    if (local) {
      try {
        const parsed = JSON.parse(local);
        // Shallow merge to keep backward compatibility
        state = { ...state, ...parsed };
      } catch (err) {
        console.error("Failed to parse local storage state", err);
      }
    } else {
      // Set defaults dates
      state.meta.date = formatDate(new Date());
      state.meta.dueDate = getFutureDate(30);
      state.signature.date = formatDate(new Date());
    }
  }

  // ----------------------------------------------------
  // 12. Setup execution flow
  // ----------------------------------------------------
  
  // Drag & drop logo setup
  setupImageUpload(
    DOM.logoDropZone,
    DOM.logoFileInput,
    { parent: 'company', child: 'logo' },
    DOM.logoPreview,
    DOM.logoPreviewWrapper,
    DOM.logoPlaceholder,
    DOM.btnRemoveLogo
  );

  // Drag & drop signature setup
  setupImageUpload(
    DOM.signatureDropZone,
    DOM.signatureFileInput,
    { parent: 'signature', child: 'image' },
    DOM.sigPreview,
    DOM.sigPreviewWrapper,
    DOM.sigPlaceholder,
    DOM.btnRemoveSig
  );

  // Initial sync & load
  loadStateFromLocalStorage();
  syncStateToDOM();
});
