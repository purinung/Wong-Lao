import { GoogleGenAI, Type } from "@google/genai";
import { CardType, GameContent, Player, GameMode } from "../types";

// Initialize the client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateCardContent = async (
  type: CardType, 
  players: Player[],
  currentPlayer: Player,
  mode: GameMode = 'HARD',
  previousContent: string[] = []
): Promise<GameContent> => {
  const modelId = 'gemini-2.5-flash';

  // Extract other players' names to feed into the prompt
  const otherPlayers = players.filter(p => p.id !== currentPlayer.id).map(p => p.name);
  const otherPlayersList = otherPlayers.length > 0 ? otherPlayers.join(', ') : "เพื่อนในจินตนาการ";

  // Construct the "Avoid List" string
  const avoidList = previousContent.length > 0 
    ? `
    CRITICAL - DO NOT REPEAT THESE RECENT TASKS:
    ${previousContent.map((c, i) => `- ${c}`).join('\n')}
    
    INSTRUCTION: GENERATE SOMETHING COMPLETELY DIFFERENT FROM THE LIST ABOVE.
    ` 
    : "";

  // Define mode-specific instructions
  let modeInstructions = "";
  if (mode === 'SOFT') {
    modeInstructions = `
    Vibe: Cute, Wholesome, Funny, Ice-breaking, Lighthearted.
    Target Audience: New drinkers, shy friends, casual gathering (Safe for beginners).
    Language: Thai (Casual, Cute, Polite-ish, "แก/เธอ/เรา/พี่/น้อง").
    
    ${type === 'DARE' ? `
    - GENERATE FUNNY, CUTE, OR EMBARRASSING (BUT SAFE) DARES.
    - **Funny / Performance:**
      - "เต้นท่าไก่ย่างถูกเผา 1 รอบเพลง" (Funny dance)
      - "ทำหน้าตาตลกที่สุดแล้วให้ [Random Name] ถ่ายรูปเก็บไว้" (Funny face)
      - "ร้องเพลงชาติไทยด้วยเสียงเป็ด" (Singing)
      - "เดินแบบนางงามไปรอบวง 1 รอบ" (Catwalk)
    - **Friendly / Social:**
      - "จ้องตา [Random Name] 10 วินาที ห้ามหลบตา ห้ามขำ" (Stare contest)
      - "ชมข้อดีของ [Random Name] มา 3 ข้อ" (Compliment)
      - "ขอจับมือ [Random Name] แล้วพูดว่า 'ยินดีที่ได้รู้จักนะ'" (Handshake)
      - "โทรหาแม่แล้วบอกรักแม่" (Wholesome call)
    ` : `
    - GENERATE LIGHTHEARTED, NOSTALGIC, OR FUNNY TRUTHS.
    - **Preferences / Childhood:**
      - "ตอนเด็กๆ เคยมีฉายาว่าอะไร?" (Childhood nickname)
      - "สเปคหนุ่ม/สาว ในฝันเป็นแบบไหน?" (Ideal type)
      - "ถ้าถูกลอตเตอรี่รางวัลที่ 1 จะเอาเงินไปทำอะไรเป็นอย่างแรก?"
      - "อาหารเมนูไหนที่กินแล้วต้องคายทิ้ง?"
    - **Impressions:**
      - "ใครในวงนี้ดูเรียบร้อยที่สุด?"
      - "ความประทับใจแรกที่มีต่อ [Random Name] คืออะไร?"
      - "ถ้าต้องติดเกาะ อยากติดกับใครในวงนี้มากที่สุด?"
    `}
    `;
  } else {
    // HARD MODE
    modeInstructions = `
    Vibe: Wild, Chaotic, Flirty, Spicy, Dirty, Hardcore (สไตล์วัยรุ่นพิเรนๆ ถึงเนื้อถึงตัว).
    Target Audience: Close friends, Drinking Party Animals.
    Language: Thai (Slang, "กู/มึง", "อิหยังวะ", "แซ่บ", Raw & Entertaining).

    ${type === 'DARE' ? `
    - GENERATE EXTREMELY BOLD, PHYSICAL, FLIRTY, OR CHAOTIC DARES.
    - **Physical / Intimate (Touchy):**
      - "หอมแก้ม [Random Name] 1 ที" (Kiss cheek)
      - "ไปนั่งตัก [Random Name] จนกว่าจะวนมาถึงตาตัวเองอีกรอบ" (Sit on lap)
      - "ให้ [Random Name] กัดแขนเบาๆ หรือทำรอยจูบที่คอ" (Bite/Hickey)
      - "จับมือกับ [Random Name] แบบสอดนิ้วตลอด 1 ตา" (Hold hands)
      - "ให้คนทางซ้ายมือล้วงหาเหรียญในเสื้อคุณ" (Search body)
      - "เอาหน้าไปใกล้ๆ [Random Name] ห่างแค่ 1 ซม. ค้างไว้ 10 วินาที"
      - "อุ้ม [Random Name] ในท่าเจ้าสาวหมุน 3 รอบ"
    - **Scenarios / "18+" Vibes:**
      - "พา [Random Name] เข้าไปอยู่ในห้องน้ำด้วยกัน 2 นาที (ห้ามล็อค, ปิดไฟมืด)" (Bathroom)
      - "ทำเสียงครางชื่อ [Random Name] ดังๆ จนกว่าเพื่อนจะพอใจ" (Moan name)
      - "นอนหนุนตักคนทางขวาจนกว่าจะตาถัดไป"
      - "กินป๊อกกี้กับ [Random Name] ให้เหลือสั้นที่สุด (ห้ามปากโดนกัน)" (Pocky game)
    - **Social Suicide / Pranks:**
      - "ทักแชทไปบอกแฟนเก่าว่า 'คิดถึงนะ'" (Text Ex)
      - "เปิดรูปในอัลบั้มล่าสุดให้ [Random Name] ดู 1 รูป" (Show photo)
      - "โทรหาแม่แล้วร้องไห้บอกว่าทำผู้หญิงท้อง / ท้องไม่มีพ่อ" (Prank call)
      - "เต้นท่าที่ทุเรศที่สุดกลางวง"
    ` : `
    - GENERATE DEEP, DARK, SECRETIVE, OR EMBARRASSING TRUTHS.
    - **Romantic / Sexual:**
      - "ถ้าต้องเลือก one night stand กับคนในวง จะเลือก [Random Name] หรือ [Random Name]?" (Choice)
      - "เคยจินตนาการเรื่องบนเตียงกับ [Random Name] หรือไม่?" (Fantasize)
      - "ถ้าโลกแตก ต้องเหลือรอดกับคนในวงคนเดียว จะเลือกใคร?"
      - "ให้คะแนนความแซ่บของ [Random Name] เต็ม 10 ได้เท่าไหร่?"
    - **Friendship / Toxic:**
      - "ใครในวงนี้ที่คุณคิดว่า 'เจ้าชู้' ที่สุด?"
      - "ความลับของ [Random Name] ที่คุณรู้แล้วเหยียบไว้มิดคืออะไร?" (Secret)
      - "สิ่งที่คุณเกลียดที่สุดในตัวคนทางขวามือคืออะไร?"
      - "เคยนินทา [Random Name] ว่าอะไรบ้าง? สารภาพมา"
    `}
    `;
  }

  const prompt = `
    You are a party game master for a Thai drinking circle ("Wong Lao").
    
    CURRENT SITUATION:
    - **Active Player:** "${currentPlayer.name}"
    - **Other Friends:** [${otherPlayersList}]
    - **Selected Mode:** ${mode} (${mode === 'SOFT' ? 'Innocent/Cute' : 'Hardcore/Wild'})

    TASK:
    Create a unique ${type} challenge for "${currentPlayer.name}" based on the selected mode.

    CRITICAL INSTRUCTIONS FOR TARGETS (MANDATORY):
    1. **USE SPECIFIC NAMES:** Randomly pick specific names from the "Other Friends" list.
       - BAD: "person next to you"
       - GOOD: "${otherPlayers[0] || 'friend'}"
    2. **USE SPECIFIC DIRECTIONS:** If you don't use a name, specify "Person on the LEFT" (คนทางซ้าย) or "Person on the RIGHT" (คนทางขวา).
    3. **NO AMBIGUITY.**

    ${avoidList}

    ${modeInstructions}

    Requirements:
    1. Title: Short & Catchy (Thai).
    2. Description: The command with SPECIFIC NAMES/DIRECTIONS.
    3. Penalty: A drinking penalty.
  `;

  try {
    const response = await ai.models.generateContent({
      model: modelId,
      contents: prompt,
      config: {
        maxOutputTokens: 300,
        temperature: 1.1, // High creativity to avoid repetition
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            description: { type: Type.STRING },
            penalty: { type: Type.STRING },
          },
          required: ["title", "description", "penalty"],
        },
      },
    });

    if (response.text) {
      const data = JSON.parse(response.text);
      return {
        type,
        title: data.title,
        description: data.description,
        penalty: data.penalty,
      };
    }
    
    throw new Error("No content generated");
  } catch (error) {
    console.warn("API Call failed or blocked, using fallback pool. Error:", error);
    
    // Smart Fallback with VARIETY POOL
    const targetName = otherPlayers.length > 0 
        ? otherPlayers[Math.floor(Math.random() * otherPlayers.length)] 
        : "คนทางซ้าย";
    
    // Fallback pools to ensure variety even when API fails
    const fallbackActions = mode === 'SOFT' 
      ? [
          `เต้นท่าตลกๆ ให้ ${targetName} ดู`,
          `ร้องเพลงช้างแบบโอเปร่า`,
          `ทำท่าเลียนแบบ ${targetName} จนกว่าเพื่อนจะทายถูก`,
          `พูดคำว่า 'รักนะ' กับ ${targetName} ด้วยน้ำเสียงที่ตลกที่สุด`,
          `เดินแบบรอบวง 1 รอบ`,
        ]
      : [
          `หอมแก้ม ${targetName} 1 ที`,
          `นั่งตัก ${targetName} จนกว่าจะตาถัดไป`,
          `ดื่มเหล้าแบบคล้องแขนกับ ${targetName} (Love Shot)`,
          `ให้ ${targetName} สั่งทำอะไรก็ได้ 1 อย่าง`,
          `เข้าไปในห้องน้ำกับ ${targetName} 1 นาที`,
          `จับมือกับ ${targetName} ตลอดตาหน้า`
      ];

    const fallbackQuestions = mode === 'SOFT'
      ? [
         `ฉายาตอนเด็กคืออะไร?`,
         `ชอบส่วนไหนของร่างกายตัวเองที่สุด?`,
         `ถ้าเป็นสัตว์ได้ อยากเป็นตัวอะไร?`,
         `ความประทับใจแรกที่มีต่อ ${targetName}`,
         `ถ้ามีเงิน 1 ล้านบาทจะทำอะไร?`
      ]
      : [
         `เคยแอบชอบใครในวงนี้ไหม?`,
         `เซ็กส์ที่ห่วยที่สุด/ดีที่สุด เป็นยังไง?`,
         `ชอบท่าไหนที่สุด?`,
         `ใครในวงนี้ที่น่าจะเจ้าชู้ที่สุด?`,
         `เคยจูบกับคนแปลกหน้าไหม?`,
         `เรื่องที่น่าอายที่สุดบนเตียงคืออะไร?`
      ];

    const list = type === 'DARE' ? fallbackActions : fallbackQuestions;
    const randomDesc = list[Math.floor(Math.random() * list.length)];

    return {
      type,
      title: mode === 'SOFT' ? "วัดดวง" : "วัดใจ",
      description: randomDesc,
      penalty: "หมดแก้ว",
    };
  }
};