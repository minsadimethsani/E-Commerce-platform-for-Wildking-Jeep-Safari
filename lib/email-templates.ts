/**
 * Email Templates for Firestore Trigger Email Extension
 * Wildking Safari - Sri Lanka Expeditions
 */

export interface EmailTemplateResult {
  subject: string;
  html: string;
  text: string;
}

/**
 * Responsive HTML Email Header & Base Shell
 */
function getEmailHeader(title: string): string {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      background-color: #040906;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      color: #e4e4e7;
      -webkit-font-smoothing: antialiased;
    }
    .wrapper {
      width: 100%;
      background-color: #040906;
      padding: 30px 10px;
    }
    .main-container {
      max-width: 600px;
      margin: 0 auto;
      background-color: #09150e;
      border: 1px solid rgba(16, 185, 129, 0.2);
      border-radius: 16px;
      overflow: hidden;
      box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.5);
    }
    .header {
      background: linear-gradient(135deg, #064e3b 0%, #040906 100%);
      padding: 32px 24px;
      text-align: center;
      border-bottom: 1px solid rgba(245, 158, 11, 0.3);
    }
    .brand-title {
      font-size: 24px;
      font-weight: 800;
      letter-spacing: 2px;
      color: #ffffff;
      margin: 0;
      font-family: Georgia, serif;
    }
    .brand-accent {
      color: #f59e0b;
    }
    .brand-subtitle {
      font-size: 11px;
      letter-spacing: 3px;
      color: #34d399;
      text-transform: uppercase;
      margin-top: 6px;
      font-weight: 600;
    }
    .content {
      padding: 32px 28px;
    }
    .footer {
      background-color: #020503;
      padding: 24px;
      text-align: center;
      border-top: 1px solid rgba(16, 185, 129, 0.15);
      font-size: 12px;
      color: #71717a;
    }
    .badge {
      display: inline-block;
      padding: 6px 14px;
      background-color: rgba(16, 185, 129, 0.15);
      border: 1px solid #10b981;
      color: #34d399;
      border-radius: 20px;
      font-size: 12px;
      font-weight: 700;
      letter-spacing: 1px;
      text-transform: uppercase;
      margin-bottom: 16px;
    }
    .card {
      background-color: rgba(6, 78, 59, 0.2);
      border: 1px solid rgba(16, 185, 129, 0.25);
      border-radius: 12px;
      padding: 20px;
      margin: 20px 0;
    }
    .btn {
      display: inline-block;
      background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
      color: #040906;
      font-weight: 800;
      font-size: 14px;
      text-decoration: none;
      padding: 14px 28px;
      border-radius: 10px;
      text-transform: uppercase;
      letter-spacing: 1px;
      box-shadow: 0 4px 14px rgba(245, 158, 11, 0.3);
      margin-top: 16px;
    }
    .detail-row {
      display: flex;
      justify-content: space-between;
      padding: 10px 0;
      border-bottom: 1px dashed rgba(255, 255, 255, 0.1);
      font-size: 14px;
    }
    .detail-label {
      color: #a1a1aa;
    }
    .detail-value {
      color: #ffffff;
      font-weight: 600;
      text-align: right;
    }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="main-container">
      <div class="header">
        <div class="brand-title">WILDKING <span class="brand-accent">SAFARI</span></div>
        <div class="brand-subtitle">Sri Lanka Expeditions</div>
      </div>
      <div class="content">
`;
}

function getEmailFooter(): string {
  return `
      </div>
      <div class="footer">
        <p style="margin: 0 0 10px 0; color: #a1a1aa;">Wildking Safari (Pvt) Ltd • SLTDA Registered Operator</p>
        <p style="margin: 0 0 10px 0;">Yala • Udawalawe • Wilpattu • Minneriya</p>
        <p style="margin: 0; font-size: 11px;">
          WhatsApp Concierge: <a href="https://wa.me/94771234567" style="color: #f59e0b; text-decoration: none;">+94 77 123 4567</a> | 
          Email: <a href="mailto:info@wildking-safari.com" style="color: #34d399; text-decoration: none;">info@wildking-safari.com</a>
        </p>
      </div>
    </div>
  </div>
</body>
</html>
`;
}

/**
 * 1. Wildlife Dispatch Alert Subscription Welcome Email Template
 */
export function getAlertSubscriptionEmailTemplate(subscriberEmail: string): EmailTemplateResult {
  const subject = "Welcome to Wildking Safari Wildlife Dispatch! 🐆";

  const html = `
${getEmailHeader(subject)}
  <div style="text-align: center;">
    <div class="badge">Wildlife Dispatch Subscribed</div>
    <h1 style="color: #ffffff; font-size: 22px; margin-top: 8px; margin-bottom: 16px;">You are now plugged into the wild!</h1>
  </div>

  <p style="line-height: 1.6; color: #d4d4d8;">
    Thank you for subscribing to <strong>Wildking Safari's Wildlife Dispatch</strong>. You will now receive priority alerts on Sri Lanka's greatest wildlife events, seasonal leopard sighting forecasts, and exclusive promo codes.
  </p>

  <div class="card">
    <h3 style="margin-top: 0; color: #f59e0b; font-size: 16px;">What you will receive:</h3>
    <ul style="padding-left: 20px; margin: 0; color: #d4d4d8; line-height: 1.8;">
      <li>🐆 <strong>Leopard Sightings Bulletin:</strong> Real-time tracking reports from Yala & Wilpattu.</li>
      <li>🐘 <strong>The Great Elephant Gathering:</strong> Minneriya seasonal updates & peak week alerts.</li>
      <li>🎟️ <strong>Subscriber VIP Perks:</strong> Early access to private 4x4 Land Cruiser discounts.</li>
    </ul>
  </div>

  <div style="text-align: center; margin-top: 24px;">
    <p style="color: #a1a1aa; font-size: 13px;">Planning your next expedition to Sri Lanka?</p>
    <a href="https://wa.me/94771234567?text=Hi%20Wildking%20Safari%2C%20I%20subscribed%20to%20alerts%20and%20would%20like%20to%20plan%20a%20safari." class="btn" target="_blank">Chat with Naturalist Concierge</a>
  </div>
${getEmailFooter()}
`;

  const text = `
WILDKING SAFARI - Sri Lanka Expeditions
Welcome to Wildlife Dispatch!

Thank you for subscribing (${subscriberEmail}). You are now signed up for:
- Leopard & Sloth Bear tracking updates across Yala & Wilpattu
- Elephant Gathering seasonal forecasts in Minneriya
- VIP Subscriber booking discounts

Need to book a safari? Contact our 24/7 WhatsApp Hotline: +94 77 123 4567
Website: https://wildking-safari.com
`;

  return { subject, html, text };
}

/**
 * 2. Package Booking Confirmation Email Template
 */
export function getBookingConfirmationEmailTemplate(bookingData: {
  packageTitle: string;
  park: string;
  expeditionDate: string;
  timeSlot: string;
  selectedVehicle?: string;
  guestCount: number;
  customerInfo: {
    fullName: string;
    email: string;
    phone: string;
  };
  pickupDetails?: {
    hotelName?: string;
    address?: string;
  };
  totalAmountUsd: number;
  currency?: string;
}, bookingId: string): EmailTemplateResult {
  const subject = `Booking Confirmed: ${bookingData.packageTitle} - Wildking Safari (Ref: ${bookingId})`;
  const currencySymbol = bookingData.currency === 'LKR' ? 'LKR' : bookingData.currency === 'EUR' ? '€' : '$';

  const html = `
${getEmailHeader(subject)}
  <div style="text-align: center;">
    <div class="badge" style="background-color: rgba(245, 158, 11, 0.15); border-color: #f59e0b; color: #fbbf24;">✓ Booking Confirmed & Guaranteed</div>
    <h1 style="color: #ffffff; font-size: 22px; margin-top: 8px; margin-bottom: 4px;">Get Ready for the Wild, ${bookingData.customerInfo.fullName}!</h1>
    <p style="color: #34d399; font-size: 14px; margin-top: 0; font-weight: 600;">Reference ID: ${bookingId}</p>
  </div>

  <p style="line-height: 1.6; color: #d4d4d8;">
    Your luxury 4x4 safari expedition with <strong>Wildking Safari</strong> has been successfully booked and confirmed. Below are your expedition details:
  </p>

  <div class="card">
    <div style="border-bottom: 1px solid rgba(16, 185, 129, 0.3); padding-bottom: 10px; margin-bottom: 12px;">
      <span style="color: #f59e0b; font-weight: 800; font-size: 16px;">${bookingData.packageTitle}</span>
    </div>

    <table style="width: 100%; font-size: 14px; border-collapse: collapse;">
      <tr>
        <td style="padding: 6px 0; color: #a1a1aa;">Expedition Date:</td>
        <td style="padding: 6px 0; color: #ffffff; font-weight: 700; text-align: right;">${bookingData.expeditionDate}</td>
      </tr>
      <tr>
        <td style="padding: 6px 0; color: #a1a1aa;">Shift / Time Slot:</td>
        <td style="padding: 6px 0; color: #ffffff; font-weight: 700; text-align: right;">${bookingData.timeSlot}</td>
      </tr>
      <tr>
        <td style="padding: 6px 0; color: #a1a1aa;">National Park:</td>
        <td style="padding: 6px 0; color: #34d399; font-weight: 700; text-align: right; text-transform: uppercase;">${bookingData.park}</td>
      </tr>
      <tr>
        <td style="padding: 6px 0; color: #a1a1aa;">Vehicle Specs:</td>
        <td style="padding: 6px 0; color: #ffffff; font-weight: 700; text-align: right;">${bookingData.selectedVehicle || 'Custom Luxury 4x4 Land Cruiser'}</td>
      </tr>
      <tr>
        <td style="padding: 6px 0; color: #a1a1aa;">Guest Count:</td>
        <td style="padding: 6px 0; color: #ffffff; font-weight: 700; text-align: right;">${bookingData.guestCount} Guest(s)</td>
      </tr>
      <tr>
        <td style="padding: 6px 0; color: #a1a1aa;">Customer Name:</td>
        <td style="padding: 6px 0; color: #ffffff; text-align: right;">${bookingData.customerInfo.fullName}</td>
      </tr>
      <tr>
        <td style="padding: 6px 0; color: #a1a1aa;">Phone Number:</td>
        <td style="padding: 6px 0; color: #ffffff; text-align: right;">${bookingData.customerInfo.phone}</td>
      </tr>
      ${bookingData.pickupDetails?.hotelName ? `
      <tr>
        <td style="padding: 6px 0; color: #a1a1aa;">Pickup Location:</td>
        <td style="padding: 6px 0; color: #f59e0b; font-weight: 600; text-align: right;">${bookingData.pickupDetails.hotelName}</td>
      </tr>
      ` : ''}
      <tr style="border-top: 1px solid rgba(255,255,255,0.15);">
        <td style="padding: 12px 0 6px 0; color: #ffffff; font-weight: 700; font-size: 15px;">Total Amount Paid:</td>
        <td style="padding: 12px 0 6px 0; color: #f59e0b; font-weight: 800; font-size: 18px; text-align: right;">${currencySymbol} ${bookingData.totalAmountUsd.toLocaleString()}</td>
      </tr>
    </table>
  </div>

  <div style="background-color: #040906; border-left: 3px solid #f59e0b; padding: 16px; margin: 20px 0; border-radius: 0 8px 8px 0;">
    <h4 style="margin: 0 0 6px 0; color: #f59e0b; font-size: 14px;">🎒 What to bring on your expedition:</h4>
    <p style="margin: 0; color: #a1a1aa; font-size: 13px; line-height: 1.5;">
      • Passport or Photo ID (Required at national park entrance gate)<br>
      • Neutral-toned light clothing (Khaki, green, beige)<br>
      • Sunscreen, sunglasses & camera gear/binoculars<br>
      • Chilled beverages & organic refreshments are complimentary on board your vehicle.
    </p>
  </div>

  <div style="text-align: center; margin-top: 28px;">
    <p style="color: #a1a1aa; font-size: 13px; margin-bottom: 12px;">Need to update pickup location or ask special requests?</p>
    <a href="https://wa.me/94771234567?text=Hi%20Wildking%20Safari%2C%20regarding%20my%20Booking%20${bookingId}" class="btn" target="_blank">Contact Expedition Lead via WhatsApp</a>
  </div>
${getEmailFooter()}
`;

  const text = `
WILDKING SAFARI - Sri Lanka Expeditions
BOOKING CONFIRMATION - Reference: ${bookingId}

Dear ${bookingData.customerInfo.fullName},

Your safari booking has been confirmed!

DETAILS:
- Package: ${bookingData.packageTitle}
- Park: ${bookingData.park.toUpperCase()}
- Date: ${bookingData.expeditionDate}
- Time Slot: ${bookingData.timeSlot}
- Vehicle: ${bookingData.selectedVehicle || 'Custom Luxury 4x4 Land Cruiser'}
- Guests: ${bookingData.guestCount}
- Total Paid: ${currencySymbol} ${bookingData.totalAmountUsd}

WHAT TO BRING:
- Passport/Photo ID for park gate entry
- Neutral colored clothing & sun protection
- Camera & Binoculars

WhatsApp Concierge (24/7): +94 77 123 4567
Website: https://wildking-safari.com
`;

  return { subject, html, text };
}

/**
 * 3. Inquiry Receipt Email Template
 */
export function getInquiryReceiptEmailTemplate(inquiryData: {
  name: string;
  email: string;
  phone?: string;
  preferredPark?: string;
  message: string;
}, inquiryId: string): EmailTemplateResult {
  const subject = `Inquiry Received: Wildking Safari Expeditions (Ref: ${inquiryId})`;

  const html = `
${getEmailHeader(subject)}
  <div style="text-align: center;">
    <div class="badge">Concierge Inquiry Received</div>
    <h1 style="color: #ffffff; font-size: 22px; margin-top: 8px; margin-bottom: 4px;">Thank you for contacting us, ${inquiryData.name}!</h1>
    <p style="color: #a1a1aa; font-size: 13px; margin-top: 0;">Ref: ${inquiryId}</p>
  </div>

  <p style="line-height: 1.6; color: #d4d4d8;">
    Our senior naturalist expedition planner has received your request. We will craft your custom itinerary and get back to you within <strong>2 hours</strong>.
  </p>

  <div class="card">
    <h4 style="margin-top: 0; color: #f59e0b; font-size: 14px;">Summary of your inquiry:</h4>
    <p style="color: #a1a1aa; font-size: 13px; margin: 4px 0;"><strong>Park Interest:</strong> ${inquiryData.preferredPark || 'General Expedition'}</p>
    <p style="color: #a1a1aa; font-size: 13px; margin: 4px 0;"><strong>Message:</strong></p>
    <p style="color: #ffffff; font-size: 13px; font-style: italic; background: rgba(0,0,0,0.3); padding: 10px; border-radius: 6px; margin-top: 4px;">
      "${inquiryData.message}"
    </p>
  </div>

  <div style="text-align: center; margin-top: 24px;">
    <p style="color: #a1a1aa; font-size: 13px;">For instant response or urgent safari availability:</p>
    <a href="https://wa.me/94771234567?text=Hi%20Wildking%20Safari%2C%20regarding%20inquiry%20${inquiryId}" class="btn" target="_blank">Connect on WhatsApp Hotline</a>
  </div>
${getEmailFooter()}
`;

  const text = `
WILDKING SAFARI - Inquiry Received (Ref: ${inquiryId})

Dear ${inquiryData.name},

Thank you for reaching out to Wildking Safari. Our expedition team has received your message regarding ${inquiryData.preferredPark || 'Sri Lanka Safaris'}.

Message:
"${inquiryData.message}"

We will contact you within 2 hours.
For immediate assistance: WhatsApp +94 77 123 4567
`;

  return { subject, html, text };
}
