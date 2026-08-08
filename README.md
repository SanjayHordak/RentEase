# RentEase 🏠

<div align="center">
  <p><strong>Rental Agreement & Tenant Management Platform</strong></p>
</div>

> RentEase is a mobile-first, dual-role digital platform purpose-built for the Indian rental housing market[cite: 3]. It eliminates the chaos of WhatsApp-managed agreements, handwritten rent receipts, and verbal dispute resolution by serving both landlords and tenants within a single application[cite: 3].

---

## ✨ Key Features

### 👑 For Landlords
* **Property Portfolio Manager:** Track single units or multi-property portfolios[cite: 3].
* **Rent Ledger & Auto-Receipts:** Confirm payments and automatically dispatch stamped digital receipts via WhatsApp/Email[cite: 3].
* **Agreement Wizard:** Generate legally formatted rental agreements ready for stamp paper[cite: 3].
* **Tenant History:** Maintain complete records per tenant, including lease duration, payment history, and notes[cite: 3].

### 📱 For Tenants
* **Receipt Vault:** Download, export, or submit stamped PDF receipts directly to HR[cite: 3].
* **Document Access:** Instant access to executed digital lease agreements anytime[cite: 3].
* **1-Tap Maintenance Request:** Upload up to 5 photos per ticket with real-time status updates[cite: 3].
* **Rent Reminders:** Opt-in push notifications 3 days before the rent due date[cite: 3].

### 💻 Web Dashboard (Portfolio Landlords)
* High-density overview for multi-unit owners with property-wide filters[cite: 3].
* Bulk rent receipt export (PDF or CSV) for accounting and tax purposes[cite: 3].
* Advanced tenant analytics tracking average tenancy duration and payment reliability[cite: 3].

---

## 🛠️ Technology Stack

| Layer | Technology | Purpose |
| :--- | :--- | :--- |
| **Mobile App** | React Native | Cross-platform iOS & Android mobile client[cite: 3] |
| **Web Dashboard** | React (Vite) | Web-based portfolio management dashboard[cite: 3] |
| **API Server** | Node.js + Express | Core REST API for auth, tenants, payments, and maintenance[cite: 3] |
| **PDF Service** | Java Spring Boot | Legal agreement & receipt PDF generation via iText/Apache PDFBox[cite: 3] |
| **Database** | MongoDB Atlas | Primary data store (documents, schemas, indexes)[cite: 3] |
| **Storage** | AWS S3 / Cloudflare R2 | Storage for maintenance photos, agreements, and receipts[cite: 3] |
| **Auth/Alerts** | Firebase / MSG91 / SendGrid | OTP verification, Push Notifications, and Email delivery[cite: 3] |

---

## 🏗️ System Architecture

RentEase follows a modular microservices-lite architecture[cite: 3]:
1. **Client Interaction:** Users interact with the React Native app or React web dashboard[cite: 3].
2. **API Gateway:** Clients send authenticated REST requests to the Node/Express monolith handling core business logic[cite: 3].
3. **PDF Generation:** When a PDF is required, the Node API calls the stateless Java Spring microservice with a structured payload[cite: 3].
4. **Storage & Notifications:** The generated binary PDF is stored in S3/R2, and asynchronous notifications are dispatched via FCM (push), WhatsApp Business API, or SendGrid[cite: 3].

---

## 🚀 API Strategy

* All endpoints are RESTful, versioned under `/api/v1/`[cite: 3].
* Authentication uses JWT Bearer tokens with a 7-day expiration (OTP-based login via SMS)[cite: 3].
* Standard response envelope: `{ success, data, error, meta }`[cite: 3].
* Pagination is available on all list endpoints via `?page=&limit=` query parameters[cite: 3].

---

## 🗺️ Roadmap

* **Phase 1 (MVP):** OTP authentication, Property/Tenant onboarding, Agreement Wizard, Rent Tracker, PDF Generation[cite: 3].
* **Phase 2 (V2.0):** Maintenance Hub, Web Dashboard, Rent Reminders, CSV Exports[cite: 3].
* **Phase 3 (V3.0):** UPI rent payment integration, Legal eStamp API integration, Multi-language support, AI Rent Assistant[cite: 3].

---

## 🔒 Confidentiality & License

This document and the associated software are **Confidential — Internal Use Only**[cite: 3].  
Prepared by the Product & Architecture Team[cite: 3].
