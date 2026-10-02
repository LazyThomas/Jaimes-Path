# Jaime's Path — v0.1 Development Build

Mobile-first calorie and macro tracker, local food diary, weight charts, backup export/import, and typed-barcode lookup.

## Deployment
This repository is **private**. Depending on account plan, GitHub Pages may not be available for a private repository. If Pages is available, go to **Settings → Pages → Deploy from branch → main / root**. Then load the HTTPS Pages URL in Safari and choose **Share → Add to Home Screen**. Do not assume the Pages site is online until its status confirms deployment.

## Limitations
- The approved ladybug image is not yet embedded; the site uses a ladybug emoji placeholder.
- **Photo capture is now enabled** on iPhone: choose Camera or Photo Library, preview the image, then use manual meal entry or the Analyze button. Automatic AI analysis is **not live** until the owner deploys a trusted HTTPS analysis backend and configures its URL under Settings. A photo is not uploaded unless Analyze is explicitly pressed and an endpoint is configured.
- The interface now uses a ladybug-red color palette. PWA cache was upgraded to v2.
- Automatic AI food recognition (backend pending), camera barcode scanning, secure accounts, and phone-to-phone synchronization are not yet implemented.
- Nutrition and weight data are held in browser-local storage, **not GitHub**. Export a JSON backup before clearing browser storage or transferring phones. Local storage isn't suitable as the sole storage for irreplaceable records.
- Do not place private data or API keys in this repository, especially if making it public for free GitHub Pages.

## Test checklist
Check calories-only save, all-three-macros formula (35 g protein, 40 g carbohydrate, 15 g fat = 435 calories), food edit/delete/repeat, weight graph time ranges, browser restart retention, offline manual logging, and backup export/import.

## Next
Host on HTTPS, run iPhone tests, add approved artwork, then implement authenticated private cloud sync and a secure rate-limited image analysis backend.

## Activate AI photo recognition
Set up a separate HTTPS image-analysis service with server-side provider credentials, authentication, allowed-origin restrictions, request limits, and usage caps. It must accept POST JSON `{\"image\":\"data:image/jpeg;base64,...\"}` and return `{\"foods\":[{\"name\":\"Chicken\",\"calories\":240,\"protein\":40,\"carbs\":0,\"fat\":6}]}`. Configure its full endpoint URL under Settings → AI Photo Recognition. **Do not insert provider secrets into the public repository or browser.** The browser permits manual entry while no service is configured. Photographs and AI estimates are not persisted unless the user confirms a food entry; uploaded images are processed by the selected backend according to its policy.
