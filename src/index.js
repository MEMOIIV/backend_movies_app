import bootstrap, { app } from "./src/app.controller.js";

// تشغيل إعدادات التطبيق (قاعدة البيانات، الميدل وير، إلخ)
bootstrap();

// تصدير app لـ Vercel
export default app;
