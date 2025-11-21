#fetch these telegram mini app docs:
- https://docs.telegram-mini-apps.com/platform/authorizing-user
- https://docs.telegram-mini-apps.com/platform/creating-new-app


- https://docs.telegram-mini-apps.com/platform/launch-parameters
- https://docs.telegram-mini-apps.com/platform/start-parameter
- https://docs.telegram-mini-apps.com/platform/init-data

Now based on the conversation i make with gpt, readme and all the other doumentations i attached, CAN YOU PREPARE A PARTIALLY HIGH-LEVEL ROADMAP TO STEPUP, CREATE, AND LAUNCH A TELEGRAM MINI APP USING THIS 'nextjs-template' REPOSITORY AS A STARTING POINT? PLEASE BREAK IT DOWN INTO CLEAR PHASES AND STEPS. THIS ROADMAP SHOULD BE COMPREHENSIVE AND COVER EVERYTHING FROM INITIAL SETUP TO FINAL DEPLOYMENT, INCLUDING KEY CONSIDERATIONS AND BEST PRACTICES MENTIONED IN THE DOCUMENTATIONS. BUT IT DOESN'T NEED TO BE TOO DETAILED, AND DOESN'T HAVE TO COVER EVERY LITTLE THING. HOWEVER IT SHOULD LIST ALL THE TODOS TO COMPLETE THE PROJECT SUCCESSFULLY. AFTER YOU PREPARE THE ROADMAP, NEXT I WILL PROVIDE YOU EACH PHASES AND STEPS ONE BY ONE TO IMPLEMENT THEM.

============================
Checklist completions from past phases:
 ✅ Documented MVP scope: “Auth-first TMA with basic profile, theme-aware UI, and start-param onboarding; server validates init data.”
 ✅ Target platforms: Android, iOS, Web (WebK), Desktop.
 ✅ Feature set & integrations:
 Authentication: Include (server-side init data validation).
 TON Connect: Defer (add in later phase).
 Payments (Stars): Defer (post-MVP).
 Storage: CloudStorage (sync KV) + DeviceStorage (prefs) + SecureStorage (secrets).
 Deep linking: Use startapp/startattach.
 ✅ Security & data flow: Edge/API validates signature + 1h expiry; don’t log raw init data; CSP + rate limiting.
 ✅ Hosting platform: Vercel (prod), local HTTPS for dev/test.
 ✅ Access pattern: Both (Direct Link and Menu Button).

Now for ## Phase 3: Core App Adaptation & Launch Parameters Handling, i want you to provide prepare a .md file contains a detailed implementation guide for each step listed in these phases. The guide should include specific commands, code snippets, configuration settings, and any other relevant technical details needed to successfully complete each step. Ensure that the instructions are clear and easy to follow, catering to developers who may be new to Telegram Mini Apps development. Also since i am new to telegram mini apps development, please include explanations, descriptions and purpose of the Phase & its Steps as well.

TO ALWAYS ENSURE YOUR RESPONSES ARE BASED ON THE TELEGRAM MINI APPS DOCUMENTATIONS I PROVIDED EARLIER, PLEASE REGULARLY REFERENCE THEM THROUGHOUT THE IMPLEMENTATION GUIDE AND ALSO REFER THIS 'https://github.com/Telegram-Mini-Apps/tma.js' REPOSITORY AS AN OFFICIAL SOURCE OF TRUTH FOR TELEGRAM MINI APPS DEVELOPMENT.(USE GitHub's MCP server and it's tools to reference the repository content if needed). THIS WILL HELP MAINTAIN ACCURACY AND ALIGNMENT WITH OFFICIAL GUIDELINES.

MAIN GOAL: One final note, our goal doesn't involve creating a next js app from scratch, but rather to effectively utilize the existing 'nextjs-template' repository as a foundation for building our Telegram Mini App. Therefore, the implementation guide should focus on how to adapt and extend this template to meet the requirements of a Telegram Mini App, rather than starting from zero.

Once you complete the implementation guide for these two phases, please let me know so i can provide you the next phases to implement.

## Corrections to be made for the next implementation guides:
 - The implementation guide tries to cover all the essential steps and considerations needed but it is not concise and consists of some unwanted and unnecessary details, obvious over-explanations and redundancies. These should be removed in your next implementation guides.

===============================