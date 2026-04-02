import { useParams, useNavigate } from "react-router-dom";
import PageHeader from "@/components/shared/PageHeader";
import BottomNav from "@/components/shared/BottomNav";

const legalContent: Record<string, { title: string; content: string[] }> = {
  "terms-of-service": {
    title: "Terms of Service",
    content: [
      "Last updated: April 2, 2026",
      "Welcome to PlateWise. By accessing or using our platform, you agree to be bound by these Terms of Service. Please read them carefully.",
      "1. Acceptance of Terms\nBy creating an account or using PlateWise, you confirm that you are at least 18 years old and agree to comply with these terms. If you do not agree, please do not use the platform.",
      "2. Description of Service\nPlateWise is a marketplace platform that connects restaurants and food businesses with consumers to reduce food waste. Businesses list surplus food at discounted prices, and consumers purchase and pick up these items.",
      "3. User Accounts\nYou are responsible for maintaining the confidentiality of your account credentials. You must provide accurate and complete information during registration. You may not share your account with others or create multiple accounts.",
      "4. Orders & Payments\nAll orders placed through PlateWise are binding. Prices are set by the businesses and may change without notice. Payment is processed securely through our payment partners. Refunds are handled on a case-by-case basis.",
      "5. Pickup Policy\nConsumers must pick up their orders within the specified pickup window. Failure to pick up an order may result in forfeiture of the order without refund. A unique pickup code is provided for verification.",
      "6. User Conduct\nYou agree not to: use the platform for any unlawful purpose, interfere with the platform's operation, attempt to gain unauthorized access, post false or misleading content, or harass other users.",
      "7. Business Responsibilities\nBusinesses listing on PlateWise must ensure all food items comply with local health and safety regulations. Listings must accurately describe the items being sold, including allergen information.",
      "8. Intellectual Property\nAll content on PlateWise, including logos, text, graphics, and software, is the property of PlateWise or its licensors and is protected by intellectual property laws.",
      "9. Limitation of Liability\nPlateWise is not liable for the quality, safety, or legality of items listed by businesses. We are not responsible for any disputes between buyers and sellers. Our liability is limited to the amount paid for the specific order in question.",
      "10. Termination\nWe may suspend or terminate your account at any time for violation of these terms. You may delete your account at any time through your account settings.",
      "11. Changes to Terms\nWe reserve the right to modify these terms at any time. Continued use of the platform after changes constitutes acceptance of the updated terms.",
      "12. Contact Us\nIf you have questions about these Terms of Service, please contact us at legal@platewise.com.",
    ],
  },
  "privacy-policy": {
    title: "Privacy Policy",
    content: [
      "Last updated: April 2, 2026",
      "PlateWise is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information.",
      "1. Information We Collect\nPersonal Information: Name, email address, phone number, and delivery address when you create an account.\nPayment Information: Credit card details processed securely through Stripe. We do not store full card numbers.\nLocation Data: With your permission, we collect location data to show nearby listings.\nUsage Data: We collect information about how you use the app, including pages visited, features used, and interactions.",
      "2. How We Use Your Information\nTo provide and maintain our service, process transactions and send related information, send promotional communications (with your consent), improve our platform and user experience, comply with legal obligations, and detect and prevent fraud.",
      "3. Information Sharing\nWe share your information only in the following circumstances: with businesses when you place an order (limited to what's necessary for fulfillment), with payment processors to complete transactions, with service providers who assist in operating our platform, and when required by law or to protect our rights.",
      "4. Data Security\nWe implement industry-standard security measures including encryption (TLS/SSL), secure password hashing, regular security audits, and access controls. However, no method of transmission over the internet is 100% secure.",
      "5. Data Retention\nWe retain your personal information for as long as your account is active or as needed to provide services. You may request deletion of your data at any time.",
      "6. Your Rights\nYou have the right to: access your personal data, correct inaccurate data, request deletion of your data, opt out of marketing communications, and export your data in a portable format.",
      "7. Cookies & Tracking\nWe use cookies and similar technologies for authentication, preferences, and analytics. See our Cookie Policy for more details.",
      "8. Children's Privacy\nPlateWise is not intended for users under 18. We do not knowingly collect information from children.",
      "9. Changes to This Policy\nWe will notify you of any material changes to this policy via email or in-app notification.",
      "10. Contact Us\nFor privacy-related inquiries, contact us at privacy@platewise.com.",
    ],
  },
  "cookie-policy": {
    title: "Cookie Policy",
    content: [
      "Last updated: April 2, 2026",
      "This Cookie Policy explains how PlateWise uses cookies and similar tracking technologies.",
      "1. What Are Cookies?\nCookies are small text files stored on your device when you visit a website. They help the website remember your preferences and improve your experience.",
      "2. Types of Cookies We Use\n\nEssential Cookies: Required for the platform to function. These include authentication tokens, session management, and security cookies. You cannot opt out of these.\n\nFunctional Cookies: Remember your preferences such as language, theme (dark/light mode), and location settings.\n\nAnalytics Cookies: Help us understand how users interact with our platform, which pages are most popular, and how to improve user experience. These are anonymized.\n\nMarketing Cookies: Used to deliver relevant advertisements and track campaign effectiveness. These are only set with your explicit consent.",
      "3. Third-Party Cookies\nWe may use third-party services that set their own cookies, including: Stripe (payment processing), Google Analytics (usage analytics), and mapping services for location features.",
      "4. Managing Cookies\nYou can manage cookie preferences through your browser settings. Note that disabling essential cookies may affect platform functionality. Most browsers allow you to: view stored cookies, delete all or specific cookies, block cookies from specific sites, and set preferences for future cookies.",
      "5. Do Not Track\nWe respect 'Do Not Track' browser signals. When detected, we limit tracking to essential cookies only.",
      "6. Updates to This Policy\nWe may update this Cookie Policy periodically. Changes will be posted on this page with an updated revision date.",
      "7. Contact Us\nFor questions about our use of cookies, contact us at privacy@platewise.com.",
    ],
  },
  "community-guidelines": {
    title: "Community Guidelines",
    content: [
      "Last updated: April 2, 2026",
      "PlateWise is built on the shared goal of reducing food waste while creating value for businesses and consumers. These guidelines help maintain a safe, respectful, and trustworthy community.",
      "1. For Consumers\n• Be respectful to business staff during pickup.\n• Arrive within the specified pickup window.\n• Provide honest and constructive reviews.\n• Do not resell items purchased through PlateWise.\n• Report any food safety concerns immediately.\n• Do not abuse voucher or rewards systems.",
      "2. For Businesses\n• List items accurately with correct descriptions, allergens, and dietary information.\n• Maintain food safety standards in compliance with local regulations.\n• Honor all confirmed orders.\n• Keep pickup instructions clear and up to date.\n• Respond promptly to customer inquiries and complaints.\n• Do not list expired or unsafe food items.",
      "3. Reviews & Ratings\n• Reviews should be honest, relevant, and based on real experiences.\n• Do not post offensive, discriminatory, or abusive content.\n• Do not post fake reviews or incentivize biased reviews.\n• Businesses may respond to reviews professionally and constructively.",
      "4. Prohibited Activities\n• Fraudulent transactions or chargebacks.\n• Creating fake accounts or listings.\n• Harassment, threats, or discrimination.\n• Sharing others' personal information.\n• Attempting to circumvent platform fees.\n• Any activity that violates local laws.",
      "5. Enforcement\nViolations may result in: a warning, temporary suspension, permanent account ban, or legal action in severe cases. We review reported violations and take action within 48 hours.",
      "6. Reporting\nIf you encounter a violation, report it through the app's 'Help with an Order' feature or email community@platewise.com. All reports are treated confidentially.",
      "7. Our Commitment\nPlateWise is committed to fostering an inclusive, sustainable, and fair marketplace for everyone. We continuously update these guidelines based on community feedback.",
    ],
  },
  licenses: {
    title: "Licenses",
    content: [
      "Last updated: April 2, 2026",
      "PlateWise is built with the help of many open source libraries and tools. We are grateful to the open source community and acknowledge the following licenses.",
      "1. Frontend Framework\n• React (MIT License) — Copyright (c) Meta Platforms, Inc.\n• React Router (MIT License) — Copyright (c) Remix Software Inc.\n• Vite (MIT License) — Copyright (c) Evan You.",
      "2. UI Components\n• Radix UI (MIT License) — Copyright (c) WorkOS.\n• shadcn/ui (MIT License) — Copyright (c) shadcn.\n• Lucide Icons (ISC License) — Copyright (c) Lucide Contributors.\n• Tailwind CSS (MIT License) — Copyright (c) Tailwind Labs.",
      "3. Data & State Management\n• TanStack React Query (MIT License) — Copyright (c) Tanner Linsley.\n• Zod (MIT License) — Copyright (c) Colin McDonnell.\n• React Hook Form (MIT License) — Copyright (c) Beier Luo.",
      "4. Charts & Visualization\n• Recharts (MIT License) — Copyright (c) Recharts Group.",
      "5. Backend & Infrastructure\n• Supabase (Apache 2.0 License) — Copyright (c) Supabase Inc.\n• Stripe.js (MIT License) — Copyright (c) Stripe Inc.",
      "6. Maps\n• Mapbox GL JS (BSD-3-Clause License) — Copyright (c) Mapbox Inc.",
      "7. Utilities\n• date-fns (MIT License) — Copyright (c) Sasha Koss.\n• class-variance-authority (Apache 2.0 License) — Copyright (c) Joe Bell.\n• clsx (MIT License) — Copyright (c) Luke Edwards.\n• tailwind-merge (MIT License) — Copyright (c) Dany Castillo.",
      "8. PlateWise License\nThe PlateWise application, excluding the open source components listed above, is proprietary software. All rights reserved. © 2024-2026 PlateWise.",
      "For the full text of each license, please visit the respective project's repository on GitHub.",
    ],
  },
};

const LegalDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const page = slug ? legalContent[slug] : null;

  if (!page) {
    return (
      <div className="min-h-screen bg-background pb-20">
        <PageHeader title="Not Found" />
        <div className="p-8 text-center">
          <p className="text-muted-foreground">Page not found.</p>
        </div>
        <BottomNav />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      <PageHeader title={page.title} />

      <div className="p-4 max-w-3xl mx-auto space-y-4">
        {page.content.map((paragraph, i) => (
          <div key={i} className={i === 0 ? "text-sm text-muted-foreground" : ""}>
            {paragraph.split("\n").map((line, j) => (
              <p
                key={j}
                className={`${
                  j === 0 && i > 1 ? "font-semibold mt-2" : ""
                } text-sm leading-relaxed ${i > 0 && j > 0 ? "mt-1.5 text-muted-foreground" : ""}`}
              >
                {line}
              </p>
            ))}
          </div>
        ))}
      </div>

      <BottomNav />
    </div>
  );
};

export default LegalDetail;
