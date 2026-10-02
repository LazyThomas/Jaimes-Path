# Jaime's Path — v0.1 Development Build

Mobile-first calorie and macro tracker, local food diary, weight charts, backup export/import, and typed-barcode lookup.

## Deployment
This repository is **private**. Depending on account plan, GitHub Pages may not be available for a private repository. If Pages is available, go to **Settings → Pages → Deploy from branch → main / root**. Then load the HTTPS Pages URL in Safari and choose **Share → Add to Home Screen**. Do not assume the Pages site is online until its status confirms deployment.

## Limitations
- The approved ladybug image is not yet embedded; the site uses a ladybug emoji placeholder.
- AI food photography, camera barcode scanning, secure accounts, and phone-to-phone synchronization are not yet implemented.
- Nutrition and weight data are held in browser-local storage, **not GitHub**. Export a JSON backup before clearing browser storage or transferring phones. Local storage isn't suitable as the sole storage for irreplaceable records.
- Do not place private data or API keys in this repository, especially if making it public for free GitHub Pages.

## Test checklist
Check calories-only save, all-three-macros formula (35 g protein, 40 g carbohydrate, 15 g fat = 435 calories), food edit/delete/repeat, weight graph time ranges, browser restart retention, offline manual logging, and backup export/import.

## Next
Host on HTTPS, run iPhone tests, add approved artwork, then implement authenticated private cloud sync and a secure rate-limited image analysis backend.
