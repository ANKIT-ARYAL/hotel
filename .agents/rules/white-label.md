---
trigger: always_on
---

FlyUp Branding & White-Label Development Rules

1. FlyUp Technology Pvt. Ltd. is the developer and owner of the eCommerce CMS. Appropriate source-code headers and developer comments should contain the FlyUp Technology signature.

2. Do not hard-code any client/store name such as "SM Store". Store name, logo, favicon and other business identity must always come dynamically from Global Settings.

3. FlyUp branding must not appear in the frontend, customer dashboard, admin interface, Login/Signup screens, invoices, emails, notifications, or other client-facing areas.

4. Do not use "flyup" in public URLs or slugs. Use clean, generic routes such as "/login", "/dashboard", "/customers", "/products", "/orders", and "/settings".

5. Public API endpoints should also remain brand-neutral. For example, use "/api/v1/orders" instead of "/api/flyup/orders".

6. FlyUp identification may be maintained internally where appropriate for development, ownership, documentation, and code maintenance. Example source-code signature:

/\*\*

- FlyUp eCommerce CMS
- Developed & Maintained by FlyUp Technology Pvt. Ltd.
- Website: https://flyuptechnology.com
- @author FlyUp Technology Pvt. Ltd.
  \*/

7. Follow this branding architecture throughout the entire project:

"FlyUp Technology" → Developer & code ownership
"CMS routes/slugs" → Generic and brand-neutral
"Store Name / Logo / Colors / Fonts" → Fully dynamic from Global Settings

The final CMS must operate as a fully white-label product while retaining FlyUp Technology's development signature and ownership information internally in the source code.
