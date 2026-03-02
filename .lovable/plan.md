
# MOBILUS — Vehicle Rental Management System (React Conversion)

## Overview
Convert the existing Vue 3 MOBILUS app into a fully functional React + TypeScript application with secure admin authentication, preserving all features and the dark cinematic UI theme.

---

## 1. Authentication & Security
- **Hardcoded super admin login**: `admin@admin.ma` / `admin` (validated client-side for now, ready for Supabase later)
- Protected dashboard route — redirects to login if not authenticated
- Session state managed via React context
- Logout clears session and returns to login

## 2. Login Page
- Dark themed login screen with MOBILUS branding (🚗 logo + title)
- Email & password form with validation
- "Create Agency" button leading to the agency setup wizard
- Error messages for invalid credentials

## 3. Agency Creation Wizard
- 4-step wizard: Legal Entity → Manager Account → Settings → Confirmation
- Moroccan provinces, legal forms, currency options
- Auto-generated credentials display on completion
- Navigation back to login or forward to dashboard

## 4. Dashboard Layout
- Top header with contract number, date, insurance info, and owner/agency details
- Tab-based navigation with 7 tabs:
  - 👤 Client
  - 🚗 Vehicle
  - 📋 Contract
  - 🔧 Damage Inspection
  - 📡 GPS Tracking
  - 👁 Contract Preview
  - 🏢 Agency Profile

## 5. Client Management Tab
- Toggle between Physical Person / Legal Entity
- Search existing clients with auto-fill
- Full Moroccan-compliant forms (CIN validation, license format `XX/XXXXXXX`)
- Nationality auto-detection (Moroccan → CIN, Foreign → Passport)
- Driver 1 & Driver 2 management with "same as renter" option
- Add new client to the list

## 6. Vehicle Management Tab
- Search and select vehicles from inventory
- Vehicle details form (model, plate, color, fuel type, VIN, insurance)
- Initial state: mileage, fuel level (radio buttons), km limit type
- Equipment checklist (spare wheel, horn, radio, wipers, jack, etc.)
- Vehicle list modal + CSV import modal
- Edit/delete vehicles inline

## 7. Contract Tab
- Rental period (start/end dates with datetime-local)
- Auto-calculated duration and total amount
- Daily rate, km limit, extra km price, late hour price, deposit
- General terms and conditions display
- Save, reset, and preview buttons

## 8. Damage Inspection Tab
- Interactive SVG car diagram with clickable zones (Front, Rear, Left, Right, Roof)
- Add damage descriptions with position markers
- Damage list with remove capability
- General condition textareas (exterior, interior, remarks)

## 9. GPS Tracking Tab
- Sidebar with fleet list (5 vehicles with emoji icons)
- Filter by status: Available, Rented, Maintenance
- Search by brand/model/plate/driver
- SVG-based map with vehicle markers and route lines
- Real-time simulation (movement, speed, fuel updates every 2.5s)
- Selected vehicle detail panel (speed, coordinates, fuel, battery, destination)
- Status indicators with color coding

## 10. Contract Preview Tab
- Print-ready contract layout (white background for PDF)
- All contract sections: Lessor, Renter, Driver, Vehicle, Terms, Damages
- Signature blocks for both parties
- PDF generation button (using jsPDF + html2canvas)

## 11. Agency Profile Tab
- Company info display/edit (name, ICE, fiscal ID, commerce register, patent)
- Contact details (responsible person, phone, email, website)
- Statistics dashboard (total vehicles, active contracts, occupation rate)
- Logo upload functionality
- Edit/Save/Cancel toggle

## 12. Styling & Theme
- Port the entire dark cinematic CSS theme (677 lines) to Tailwind + custom CSS
- Orbitron, Rajdhani, DM Mono font families via Google Fonts
- Dark void background with glass-morphism cards
- Red accent color scheme with green/amber/blue status colors
- Smooth transitions and animations
- Fully responsive layout

## 13. Data & State Management
- React context for global app state (auth, contract data, vehicles, clients, GPS)
- Sample data pre-loaded (4 clients, 4 vehicles, 5 GPS-tracked vehicles)
- Moroccan reference data (cities, provinces, nationalities, legal forms)
- All computed values (filtered lists, rental days, total amount) as derived state

---

**Result**: A complete, production-ready React app matching the original Vue MOBILUS system feature-for-feature, with secure admin login, dark premium UI, and clean code ready for GitHub.
