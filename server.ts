import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";

let aiInstance: GoogleGenAI | null = null;

function getAI() {
  if (!aiInstance) {
    const apiKey = process.env.GEMINI_API_KEY;
    aiInstance = new GoogleGenAI({
      apiKey: apiKey || "MOCK_KEY",
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return aiInstance;
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Route to generate pet fame event
  app.post("/api/viralizar", async (req, res) => {
    try {
      const { pet, format, ownerName, location, currentFollowers } = req.body;

      if (!pet || !format) {
        return res.status(400).json({ error: "Faltan datos de la mascota o del formato" });
      }

      const apiKey = process.env.GEMINI_API_KEY;
      const isMock = !apiKey || apiKey === "MY_GEMINI_API_KEY" || apiKey.trim() === "";

      let apiResponseText = "";

      const systemPrompt = `Eres un agente experto en marketing de mascotas e influencers de internet.
Tu trabajo es simular el resultado de un post viral hecho por una mascota que asiste a "Mascotas Estrellas Vecindario", una guardería de mascotas en Vecindario (Gran Canaria, España) dirigida por la fundadora/directora Mariama Kujabi.
Debes devolver el resultado strictly en formato JSON con la siguiente estructura (no envíes markdown de bloque como \`\`\`json, solo envía el string JSON plano o asegúrate de que se pueda parsear directo):
{
  "title": "Un título hiper-atractivo con emojis y jerga de internet canina/gatuna/pet",
  "script": "Una breve descripción graciosa de lo que ocurre en el video/foto (máximo 60 palabras). Involucra la personalidad de la mascota y el estilo.",
  "views": 12500, // número entero de visualizaciones simuladas (entre 2000 y 50000)
  "likes": 840,   // número entero de likes simulados
  "shares": 120,  // número de compartidos
  "followersGained": 350, // número de seguidores nuevos ganados (entre 50 y 2000)
  "comments": [
    {"user": "@usuario1", "text": "Un comentario divertidísimo con emojis, guiños a Vecindario o humor animal"},
    {"user": "@usuario2", "text": "Otro comentario divertido"},
    {"user": "@usuario3", "text": "Un tercer comentario que critique cariñosamente o adore la pose de la mascota"}
  ],
  "academyReport": "Una breve nota humorística de Mariama Kujabi valorando el progreso de la mascota en su academia (p.ej. '¡Mariama Kujabi dice que Firulais tiene el flow de Vecindario!')."
}`;

      const userPrompt = `Mascota:
- Nombre: ${pet.name}
- Especie: ${pet.species}
- Personalidad: ${pet.personality}
- Nivel de Carisma: ${pet.charisma}/100
- Nivel de Estilo: ${pet.style}/100
- Nivel de Talento: ${pet.talent}/100

Formato de contenido elegido:
- Título/Concepto del show: "${format.title}"
- Plataforma: "${format.platform}"
- Descripción: "${format.description}"

Localización de la guardería: Vecindario, Gran Canaria.
Fundadora de la Guardería: Mariama Kujabi.
Genera el resultado en español con humor y de manera que potencie sus estadísticas de ${pet.charisma} de carisma, ${pet.style} de estilo y ${pet.talent} de talento.`;

      if (isMock) {
        // Fallback robust mock response when Gemini API key is not available
        const randomViews = Math.floor(Math.random() * 15000) + 5000;
        const randomLikes = Math.floor(randomViews * 0.12);
        const randomShares = Math.floor(randomLikes * 0.25);
        const randomFollowers = Math.floor(randomViews * 0.05);

        const mockResponses: Record<string, any> = {
          title: `🔥 ¡MOMENTO ÉPICO! ${pet.name} conquista ${format.platform} con su ${format.title}! 🌟`,
          script: `Se ve a ${pet.name} luciendo un carisma de ${pet.charisma}% y un estilazo único. En el vídeo grabado en Vecindario por Mariama, la mascota hace exactamente lo que pedía el show: ${format.description}. ¡Los fans no pueden con tanta ternura!`,
          views: randomViews,
          likes: randomLikes,
          shares: randomShares,
          followersGained: randomFollowers,
          comments: [
            { user: "@vecindario_pet_lover", text: `¡Reina total! Mariama Kujabi tiene a los mejores en esa guardería. 😍` },
            { user: "@chucho_influencer", text: `Por favor, ese flow de ${pet.name} es de otro planeta. ¡Dale un contrato ya! 😂🐶` },
            { user: "@gato_con_botox", text: `¡Qué talento tan natural! El estilo superó las expectativas. 🚀✨` }
          ],
          academyReport: `📝 Reporte de Mariama Kujabi: "${pet.name} ha demostrado un nivel excelente de estilo. En Vecindario ya se habla de esta futura estrella de internet. ¡Sigue así!"`
        };

        return res.json(mockResponses);
      }

      // We have real key, call Gemini using @google/genai SDK
      const ai = getAI();
      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: userPrompt,
        config: {
          systemInstruction: systemPrompt,
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              script: { type: Type.STRING },
              views: { type: Type.INTEGER },
              likes: { type: Type.INTEGER },
              shares: { type: Type.INTEGER },
              followersGained: { type: Type.INTEGER },
              comments: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    user: { type: Type.STRING },
                    text: { type: Type.STRING }
                  },
                  required: ["user", "text"]
                }
              },
              academyReport: { type: Type.STRING }
            },
            required: ["title", "script", "views", "likes", "shares", "followersGained", "comments", "academyReport"]
          }
        }
      });

      apiResponseText = response.text || "";
      const parsedData = JSON.parse(apiResponseText);
      res.json(parsedData);
    } catch (error: any) {
      console.error("Error generating content:", error);
      res.status(500).json({ error: "Error de IA al viralizar a tu mascota: " + error.message });
    }
  });

  // Provide initial pets or config if needed
  app.get("/api/info-guarderia", (req, res) => {
    res.json({
      name: "Guardería de Mascotas Estrellas Vecindario",
      director: "Mariama Kujabi",
      location: "Vecindario, Gran Canaria, España",
      description: "Donde las mascotas de Vecindario se convierten en celebridades mundiales del internet."
    });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
