import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

// Body parser limits for base64 poster uploads
app.use(express.json({ limit: "25mb" }));
app.use(express.urlencoded({ extended: true, limit: "25mb" }));

// Initialize Gemini client lazily
let aiClient: GoogleGenAI | null = null;
function getGeminiClient() {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY is not defined in environment variables");
    }
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

// Health check route
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", service: "AI Prompt Studio Pro" });
});

// Poster Vision Analysis Endpoint
app.post("/api/analyze-poster", async (req, res) => {
  try {
    const {
      imageBase64,
      mimeType = "image/jpeg",
      playerImageBase64,
      playerMimeType = "image/jpeg",
      eventDetails,
      customInstruction = "",
    } = req.body;

    if (!imageBase64) {
      return res.status(400).json({ error: "No poster image provided" });
    }

    // Clean base64 strings if they contain data URI prefixes
    const cleanBase64 = imageBase64.replace(/^data:image\/\w+;base64,/, "");
    const cleanPlayerBase64 = playerImageBase64
      ? playerImageBase64.replace(/^data:image\/\w+;base64,/, "")
      : null;

    const ai = getGeminiClient();

    const hasPlayerImage = !!cleanPlayerBase64;
    const hasEventDetails =
      eventDetails &&
      (eventDetails.eventType ||
        eventDetails.playerName ||
        eventDetails.teamName ||
        eventDetails.eventDetailsText);

    const systemInstruction = `أنت خبير ومدير فني (Art Director) دولي محترف في تحليل الملصقات والبوسترات والتصاميم البصرية بدقة مجهرية متناهية.
مهمتك هي إجراء تفكيك بصري شامل (Forensic Visual Decomposition) لصورة البوستر واستخراج حمضها النووي البصري (Visual DNA) بالتفصيل التام.

${
  hasPlayerImage
    ? `تنبيه خاص لدمج الوجه والملابس/القميص الرياضي للاعب (Full Character Identity, Face & Outfit Lock):
تم إرفاق صورتين:
- الصورة الأولى: تصميم البوستر المرجعي الأساسي (الخلفية، الإضاءة، الجو العام، وضعية الجسم وتكوين المشهد، الخامات، التايبوغرافي).
- الصورة الثانية: صورة اللاعب / الشخصية المراد استبدالها مع ملامحه وملابسه/قميصه الرياضي.

يجب عليك التركيز على نقل واستبدال الشخصية بدقة متناهية:
1. الوجه والملامح: تحليل ملامح الوجه الكاملة في الصورة الثانية (العينين، الأنف، الفك، تسريحة الشعر، درجة البشرة، والتعبير) والحفاظ عليها 100%.
2. الملابس والقميص (Jersey & Kit Transfer): نقل واستبدال الملابس/القميص الرياضي الذي يرتديه اللاعب في الصورة الثانية (بما في ذلك لون الطقم، الشعارات، نمط القماش، وتفاصيل الزي) وتركيبه بدقة على جسم الشخصية في البوستر.
3. التكييف البصري: تطبييق الإضاءة والظلال والانعكاسات الدرامية للبوستر (الصورة الأولى) على وجه اللاعب الجديد وملابسه المنقولة لتبدو طبيعية ومتناسقة تماماً مع جو البوستر.
4. صياغة البرومبت النهائي في المحور السابع بحيث يتضمن وصفاً دقيقاً ومجهرياً لملامح الوجه والزي/القميص الرياضي المخصص للحفاظ على تطابق الوجه والملابس الكامل مع إشارات --cref و --cw 100 و exact character and outfit identity parameters.`
    : ""
}
${
  hasEventDetails
    ? `
تنبيه خاص لتفاصيل الحدث الرياضي والتايبوغرافي المخصصة (Sports Event Context & Typography):
تم تحديد تفاصيل الحدث الرياضي المراد تضمينها في التصميم:
- نوع الحدث: ${eventDetails.eventType || "غير محدد"}
- اسم اللاعب: ${eventDetails.playerName || "غير محدد"}
- اسم النادي/الفريق: ${eventDetails.teamName || "غير محدد"}
- تفاصيل إضافية: ${eventDetails.eventDetailsText || "لا يوجد"}

يرجى دمج هذه التفاصيل بالكامل في:
1. المحور السادس (التايبوغرافي والشعارات والعناصر البصرية الإخبارية).
2. المحور السابع (البرومبت النهائي باللغة الإنجليزية)، مع إضافة الشارات والتايبوغرافي المناسبة مثل "OFFICIAL ANNOUNCEMENT", "HERE WE GO", "CONTRACT EXTENSION", "MATCHDAY", "INJURY REPORT" مع إضافة اسم اللاعب والنادي والشعار.`
    : ""
}

قواعد الإجابة:
1. قسّم التحليل إلى 7 محاور أساسية منظمة بوضوح مع استخدام الإيموجيات والعناوين الجذابة باللغة العربية.
2. كن دقيقاً جداً في وصف الخامات، الإضاءة (زواياها ودرجة حرارتها)، الألوان (مع التدرجات والأكواد التقريبية)، التايبوغرافي، وتكوين الكاميرا.
3. زوّد المستخدم ببرومبت كامل جاهز لـ Midjourney / Stable Diffusion باللغة الإنجليزية في نهاية التحليل.

المحاور السبعة المطلوبة في التحليل:
1. 🎯 **التصنيف ونوع البوستر (Poster Category & Concept)**: تحديد فكرة البوستر والنوع الفني (مثال: بوستر انتقال لاعب، بوستر مباراة درامي، واجهة تجارية 3D).
2. 💡 **الإضاءة والجو الدرامي (Cinematic Lighting & Atmosphere)**: تحليل الإضاءة الساقطة (Spotlights overhead, rim lights, volumetric haze, shadow density, color temperature).
3. 🎨 **التدريج اللوني والهارموني (Color Palette & Grading)**: تحديد الألوان السائدة والفرعية وتوزيع النغمات اللوحية (Crimson red, dark mahogany, warm gold, crushed blacks).
4. 🧍 **العنصر البشري واستبدال الوجه والملابس (Subject Pose, Face & Outfit Lock)**: ${
      hasPlayerImage
        ? "تحليل ملامح الوجه والملابس/القميص الرياضي للشخصية المرفقة (الصورة الثانية) بدقة فائقة وكيفية نقل الوجه والزي ودمجهما مع وضعية وزاوية الجسم وتأثيرات الإضاءة في البوستر (الصورة الأولى) لضمان مطابقة الهوية والقميص 100%."
        : "طريقة جلوس أو وقوف الشخصية، زاوية الكاميرا (Eye-level, low angle hero shot)، وعمق الميدان (Depth of Field)."
    }
5. 🧱 **الخامات والطبقات والخلفية (Materials, Textures & Background)**: خشب الخزانات، القماش والزي الرياضي، الجلد، الأرضية، القميص المعلق، الإكسسوارات.
6. ✒️ **التايبوغرافي والخطوط وتفاصيل الحدث (Typography & Event Context)**: ${
      hasEventDetails
        ? "تحليل طريقة كتابة وتنسيق التايبوغرافي والشعارات الخاصة بالحدث (" +
          (eventDetails.eventType || "الحدث الرياضي") +
          ") واسم اللاعب والنادي."
        : "الخط المستخدم على القميص أو العناوين، الأشكال والشعارات."
    }
7. 🚀 **البرومبت النهائي المولد (Generated Midjourney/SD Prompt)**: برومبت كامل ومحترف بالإنجليزية جاهز للنسخ المباشر يبدأ بـ /imagine prompt ويشمل جميع التفاصيل الدقيقة ${
      hasPlayerImage
        ? "مع وصف دقيق لملامح وجه اللاعب البديل وزيه الرياضي وطريقة الحفاظ على هويته البصرية والملابس البارزة مع '--ar 4:5 --v 6.0 --style raw --cw 100'"
        : "مع '--ar 4:5 --v 6.0 --style raw'"
    }.`;

    let userPrompt = hasPlayerImage
      ? "قم بتحليل البوستر المرفق (الصورة الأولى) ودمج وجه وملابس/قميص اللاعب البديل المرفق (الصورة الثانية) بدقة فائقة مع الحفاظ التام والكامل على ملامح وجهه وهويته البصرية وزيه الرياضي وفق المحاور السبعة."
      : "قم بتحليل صورة البوستر المرفقة بدقة مجهرية واستخراج حمضها النووي البصري الكامل وفق المحاور السبعة.";

    if (hasEventDetails) {
      userPrompt += `
سياق وتفاصيل الحدث الرياضي المراد تضمينه:
- نوع الحدث: ${eventDetails.eventType || "غير محدد"}
- اسم اللاعب: ${eventDetails.playerName || "غير محدد"}
- اسم النادي/الفريق: ${eventDetails.teamName || "غير محدد"}
- تفاصيل إضافية: ${eventDetails.eventDetailsText || "لا يوجد"}`;
    }

    if (customInstruction) {
      userPrompt += "\nملاحظات إضافية من المستخدم: " + customInstruction;
    }

    const contentsParts: any[] = [
      {
        inlineData: {
          mimeType: mimeType,
          data: cleanBase64,
        },
      },
    ];

    if (hasPlayerImage && cleanPlayerBase64) {
      contentsParts.push({
        inlineData: {
          mimeType: playerMimeType,
          data: cleanPlayerBase64,
        },
      });
    }

    contentsParts.push({ text: userPrompt });

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: [
        {
          parts: contentsParts,
        },
      ],
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.4,
      },
    });

    const analysisText = response.text || "تعذر استخراج تحليل البوستر. يرجى المحاولة مرة أخرى.";

    return res.json({
      success: true,
      analysis: analysisText,
    });
  } catch (error: any) {
    console.error("Poster analysis error:", error);
    return res.status(500).json({
      success: false,
      error: error?.message || "حدث خطأ أثناء تحليل صورة البوستر",
    });
  }
});

// Setup Vite in Dev or Static files in Prod
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  });
}

startServer();
