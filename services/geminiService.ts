import { GoogleGenAI, Modality } from "@google/genai";
import { Season } from "../types";

// Helper to convert File to Base64 string
const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        // Remove the Data URL prefix (e.g., "data:image/jpeg;base64,")
        const base64String = reader.result.split(',')[1];
        resolve(base64String);
      } else {
        reject(new Error('Failed to read file'));
      }
    };
    reader.onerror = error => reject(error);
  });
};

export const generatePixelCharacter = async (imageFile: File, season: Season): Promise<string> => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API key is not configured");
  }

  const ai = new GoogleGenAI({ apiKey });
  const base64Image = await fileToBase64(imageFile);

  // Prompt engineering for the specific request
  const prompt = `
    Strictly follow these instructions:
    Transform the person in this image into a cute, high-quality 3D voxel art character (3D pixel art style).
    
    Parameters:
    - Season Theme: ${season}
    
    Key requirements:
    1. Style: Voxel art, 3D render, isometric view, cute "chibi" proportions (big head). High fidelity 3D pixels.
    2. Fidelity: Maintain the person's key recognizable features (glasses, hair style, hair color, facial expression) but stylized.
    3. Theme Adaptation:
       - If Spring: Add floral elements, pastel colors, light clothing.
       - If Summer: Bright lighting, sunglasses, summer outfit, maybe ice cream or beach vibe accessories.
       - If Autumn: Warm colors, scarf, sweater, autumn leaves.
       - If Winter: Cool tones, beanie, scarf, puffer jacket, maybe snow elements.
    4. Background: STRICTLY PURE WHITE BACKGROUND (#FFFFFF). No complex scenery. The character should be isolated.
    5. Lighting: Soft, warm, global illumination studio lighting suitable for 3D art.
    6. Output: A single high-quality image of the character standing.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          {
            inlineData: {
              data: base64Image,
              mimeType: imageFile.type,
            },
          },
          {
            text: prompt,
          },
        ],
      },
      config: {
        responseModalities: [Modality.IMAGE],
      },
    });

    // Extract image from response
    const candidates = response.candidates;
    if (!candidates || candidates.length === 0) {
      throw new Error("No candidates returned");
    }

    const parts = candidates[0].content.parts;
    let generatedBase64 = '';

    // Look for inlineData in parts
    for (const part of parts) {
      if (part.inlineData && part.inlineData.data) {
        generatedBase64 = part.inlineData.data;
        break;
      }
    }

    if (!generatedBase64) {
      throw new Error("No image data found in response");
    }

    return `data:image/png;base64,${generatedBase64}`;

  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};