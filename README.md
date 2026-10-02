# Jaime's Path — Development Build

**Every Step Counts.** A mobile-first, ladybug-red calorie, macronutrient and weight tracker.

## Included
- Calories-only entry (macros unknown rather than zero)
- Protein, carbs and fat entry, with automatic 4/4/9 calorie calculation
- Food diary with Breakfast, Lunch, Dinner and Snacks, editing, deleting and repeat
- Weight measurements and 7/30/90/180/365-day and all-time charts
- Configurable nutrition and weight goals
- Typed UPC/EAN barcode lookup via Open Food Facts where records exist (no camera required)
- Local storage and manual JSON backup and restore
- Offline shell and manual entry once installed

## No camera or AI subscriptions
Photo capture, photo analysis, and the OpenAI Worker have intentionally been removed. No OpenAI API key, Cloudflare Worker or paid photo-recognition setup is needed.

## Running on iPhone
Website: https://lazythomas.github.io/Jaimes-Path/
In Safari, open the URL, select Share → Add to Home Screen.

## Limitations
This is still a development build. Browser-local data **does not synchronize between phones** and can be lost if Safari site data is cleared. Export a JSON backup regularly before moving data between devices. No private user authentication or cloud sync is implemented. Barcode search requires internet access and manual typing. The full approved illustrated ladybug graphic is not yet embedded in the web app; a ladybug emoji appears in the header. Complete device testing and security review are pending.
