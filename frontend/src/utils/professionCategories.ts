export const DOMAIN_PROFESSION_CATEGORIES: Record<string, string[]> = {
  'Software Developer': [
    'Software & SaaS Subscriptions',
    'Cloud Infrastructure & Hosting (AWS/GCP/Vercel)',
    'Dev Hardware & Workstations',
    'API Services & AI Tokens',
    'Domain Names & SSL Certificates',
    'Internet & High-Speed Fiber',
    'Learning, Books & Technical Courses',
    'Office & Desk Supplies'
  ],
  'Designer': [
    'Design Software (Figma/Adobe Creative Cloud)',
    'Assets, Stock Images & Premium Fonts',
    'Display Hardware & Color Calibrators',
    'Printing & Prototype Packaging',
    'Portfolio Hosting & Website',
    'Internet & Phone',
    'Studio & Workspace Supplies'
  ],
  'Content Creator': [
    'Camera & Audio Recording Equipment',
    'Video Editing Software (Premiere/DaVinci)',
    'Studio Lighting & Acoustics',
    'Props & Set Decor',
    'Social Media Ads & Promotions',
    'Travel & Location Shoots',
    'Music & Stock Video Licensing'
  ],
  'Photographer / Videographer': [
    'Camera Lenses & Body Rigging',
    'SD Cards, Hard Drives & Cloud Storage',
    'Studio Rental & Location Fees',
    'Lighting & Grip Gear',
    'Client Deliverable Packaging / USBs',
    'Editing Software & Color Grading Plugins',
    'Equipment Insurance'
  ],
  'Writer / Journalist': [
    'Writing Software & Grammar Tools',
    'Research Subscriptions & Paid Archives',
    'Laptops, Keyboards & Tablets',
    'Travel, Interviews & Press Field Trips',
    'Book Printing & Proofreading',
    'Internet & Mobile Data',
    'Co-working & Coffee Meetings'
  ],
  'Tutor / Coach': [
    'Teaching Materials, Textbooks & Guides',
    'LMS & Online Class Tools (Zoom/Teachable)',
    'Whiteboards, Webcams & Stylus Pens',
    'Classroom Rent & Electricity',
    'Student Marketing & Flyer Printing',
    'Testing & Assessment Software'
  ],
  'Consultant': [
    'Client Meeting & Dining Expenses',
    'Travel, Flights, Cabs & Hotel Stays',
    'Co-working Space Membership',
    'Zoom, CRM & Productivity Tools',
    'Professional Insurance & Dues',
    'Advisory Research & Reports'
  ],
  'Digital Marketer': [
    'Ad Spend (Meta Ads / Google Ads)',
    'SEO & Competitor Analytics (SEMrush/Ahrefs)',
    'Email Marketing Platforms (Mailchimp/Klaviyo)',
    'Copywriting & Creative Assets',
    'Client Reporting & Dashboard Tools',
    'Communication & Internet'
  ],
  'Doctor / Healthcare': [
    'Medical Supplies & Consumables',
    'Clinic Equipment & Servicing',
    'Medical Practice Software & Teleconsulting',
    'CME Seminars & Medical Conferences',
    'Clinic Rent, Sanitation & Utilities',
    'Staff Uniforms & Protective Gear',
    'Professional Indemnity Insurance'
  ],
  'CA / Legal Professional': [
    'Tax & Audit Software (Tally/Computax)',
    'Legal Journals, Acts & Gazette Subscriptions',
    'Court Fee Stamps & Official Filing Fees',
    'Client Consultation & Travel',
    'Office Printing, Paper & Heavy-Duty Printers',
    'Professional Association Dues (ICAI/Bar Council)',
    'Office Rent & Utilities'
  ],
  'Real Estate Agent': [
    'Property Portal Paid Listings (MagicBricks/99acres)',
    'Client Site Travel & Fuel Expenses',
    'Property Banner & Signage Printing',
    'Client Hospitality & Refreshments',
    'RERA & Brokerage License Fees',
    'Photography & Drone Property Tours'
  ],
  'E-commerce / Retailer': [
    'Inventory Purchase & Wholesale Goods',
    'Courier, Express Shipping & Packaging Boxes',
    'Payment Gateway Commissions & Fees',
    'Shop / Warehouse Rent & Electricity',
    'Social Media Marketing & Influencer Samples',
    'Store POS Software & Thermal Roll Paper'
  ],
  'Fitness / Sports Trainer': [
    'Gym Equipment & Workout Accessories',
    'Nutrition Supplements & Samples',
    'Music & Fitness Coaching Apps',
    'Personal Trainer Certifications & CPR',
    'Apparel, Footwear & Uniforms',
    'Client Progress Tracking Apps'
  ],
  'Restaurant / Cafe Owner': [
    'Raw Grocery & Kitchen Ingredients',
    'Kitchen Commercial Appliances & Utensils',
    'Commercial LPG Gas & Utility Bills',
    'Food Packaging Boxes & Cutlery',
    'Delivery Partner Commissions (Zomato/Swiggy)',
    'Staff Uniforms & Hygiene Cleaning Supplies'
  ],
  'Independent Professional': [
    'Software & Subscriptions',
    'Internet & Phone',
    'Travel & Fuel',
    'Office Supplies & Stationery',
    'Equipment & Hardware',
    'Marketing & Advertising',
    'Professional Dues & Licenses',
    'Utilities'
  ],
  'Other Small Business': [
    'Software & Tools',
    'Internet & Phone',
    'Travel & Commute',
    'Food & Client Dining',
    'Equipment & Machinery',
    'Marketing & Ads',
    'Office Supplies',
    'Professional Services',
    'Utilities',
    'Other Expenses'
  ]
};

export const STANDARD_GENERAL_CATEGORIES = [
  'Software & Tools',
  'Internet & Phone',
  'Travel',
  'Food & Dining',
  'Equipment',
  'Marketing & Advertising',
  'Office Supplies',
  'Professional Services',
  'Education & Books',
  'Utilities',
  'Other Expenses'
];

export const PROFESSIONS_LIST = [
  'Software Developer',
  'Designer',
  'Content Creator',
  'Photographer / Videographer',
  'Writer / Journalist',
  'Tutor / Coach',
  'Consultant',
  'Digital Marketer',
  'Doctor / Healthcare',
  'CA / Legal Professional',
  'Real Estate Agent',
  'E-commerce / Retailer',
  'Fitness / Sports Trainer',
  'Restaurant / Cafe Owner',
  'Independent Professional',
  'Other Small Business'
];

export function getDomainCategoriesForProfession(profession?: string | null): string[] {
  if (!profession) return STANDARD_GENERAL_CATEGORIES;
  const match = Object.keys(DOMAIN_PROFESSION_CATEGORIES).find(
    (key) => key.toLowerCase() === profession.trim().toLowerCase()
  );
  if (match) {
    return DOMAIN_PROFESSION_CATEGORIES[match];
  }
  return STANDARD_GENERAL_CATEGORIES;
}
