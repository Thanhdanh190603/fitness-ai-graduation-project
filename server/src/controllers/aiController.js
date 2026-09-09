import fs from 'fs';
import path from 'path';
import { GoogleGenAI } from '@google/genai';

function getGeminiClient() {
  const geminiKey = process.env.GEMINI_API_KEY;

  if (!geminiKey) {
    return null;
  }

  return new GoogleGenAI({ apiKey: geminiKey });
}

function calculateBmi(heightCm, weightKg) {
  const heightMeter = Number(heightCm) / 100;
  const weight = Number(weightKg);

  if (!heightMeter || !weight) {
    return null;
  }

  return Number((weight / (heightMeter * heightMeter)).toFixed(1));
}

function getBmiStatus(bmi, age) {
  if (Number(age) < 20) {
    return 'BMI tham khảo';
  }

  if (bmi < 18.5) {
    return 'Thiếu cân';
  }

  if (bmi < 25) {
    return 'Bình thường';
  }

  if (bmi < 30) {
    return 'Thừa cân';
  }

  return 'Béo phì';
}

function createFreeAdvice(user, bmi, bmiStatus, validImageCount) {
  const advice = [];
  const age = Number(user.age);

  if (age < 20) {
    advice.push('Vì bạn dưới 20 tuổi, BMI chỉ dùng để tham khảo và cần đánh giá theo tuổi, giới tính, quá trình phát triển.');
    advice.push('Ưu tiên vận động phù hợp lứa tuổi: bodyweight nhẹ, kỹ thuật đúng, giãn cơ và hoạt động thể thao đều đặn.');
    advice.push('Không tập tạ nặng, không ép cân và không theo chế độ tăng cơ hoặc giảm mỡ cực đoan.');
  } else if (bmiStatus === 'Thiếu cân') {
    advice.push('Ưu tiên tăng cơ, ăn đủ năng lượng và tập các bài sức mạnh cơ bản.');
  } else if (bmiStatus === 'Bình thường') {
    advice.push(`Tập trung theo mục tiêu chính của bạn: ${user.goal || 'cải thiện thể lực'}.`);
  } else {
    advice.push('Ưu tiên giảm mỡ, tăng vận động toàn thân và duy trì lịch tập đều.');
  }

  if (age < 20) {
    advice.push('Bắt đầu với buổi tập ngắn, cường độ vừa phải và tăng dần khi cơ thể thích nghi.');
  } else if (user.trainingLevel === 'beginner') {
    advice.push('Tập kỹ thuật chậm, giữ form đúng và chưa tăng cường độ quá nhanh trong giai đoạn đầu.');
  } else if (user.trainingLevel === 'medium') {
    advice.push('Tăng dần số hiệp và kết hợp nhiều nhóm cơ trong tuần để tiến bộ ổn định.');
  } else {
    advice.push('Áp dụng lịch tập nâng cao hơn và theo dõi phục hồi sau mỗi buổi tập.');
  }

  if (validImageCount > 0) {
    advice.push('Tiếp tục lưu ảnh thể trạng định kỳ để so sánh sự thay đổi theo thời gian.');
  } else {
    advice.push('Bổ sung ảnh thể trạng hợp lệ như chính diện, nghiêng hoặc sau lưng để hồ sơ đánh giá đầy đủ hơn.');
  }

  return advice;
}

function createDemoImageAnalysis(user, bmi, bmiStatus, validImageCount, invalidImageCount) {
  const age = Number(user.age);
  const focus = [];
  const direction = [];
  const postureNotes = [];
  let bodyType = 'Chưa đủ dữ liệu';
  let bodyTypeReason = 'Cần ảnh thể trạng hợp lệ để đánh giá tạng người rõ hơn.';
  let confidence = 'thấp';

  if (validImageCount >= 3) {
    postureNotes.push('Bạn đã gửi nhiều góc ảnh, dữ liệu thể trạng ban đầu tương đối đầy đủ để theo dõi tiến độ.');
  } else if (validImageCount > 0) {
    postureNotes.push('Bạn đã gửi ảnh thể trạng, nhưng nên bổ sung thêm ảnh chính diện, nghiêng và sau lưng để hồ sơ rõ hơn.');
  } else {
    postureNotes.push('Chưa có ảnh thể trạng hợp lệ, hệ thống chỉ phân tích dựa trên số liệu đã nhập.');
  }

  if (invalidImageCount > 0) {
    postureNotes.push('Một số ảnh đã tải lên được đánh dấu là ảnh khác hoặc chưa phân loại nên không dùng để đánh giá thể trạng.');
  }

  if (age < 20) {
    bodyType = 'Đang phát triển';
    bodyTypeReason = 'Người dưới 20 tuổi không nên kết luận tạng người như người trưởng thành.';
    confidence = 'trung bình';
    focus.push('Xây nền thể lực an toàn');
    focus.push('Giữ kỹ thuật đúng');
    focus.push('Tăng vận động đều đặn');
    direction.push('Tập bodyweight nhẹ như squat không tạ, plank ngắn, chống đẩy biến thể dễ.');
    direction.push('Kết hợp giãn cơ và hoạt động thể thao vui để duy trì thói quen.');
    direction.push('Không tập tạ nặng, không ép cân và không theo lịch cường độ cao.');
  } else if (bmiStatus === 'Thiếu cân') {
    bodyType = 'Gầy';
    bodyTypeReason = 'BMI đang thấp, cần ưu tiên tăng cân và xây cơ nền tảng.';
    confidence = validImageCount > 0 ? 'trung bình' : 'thấp';
    focus.push('Tăng cơ nền tảng');
    focus.push('Ăn đủ năng lượng');
    focus.push('Tập sức mạnh cơ bản');
    direction.push('Ưu tiên các bài compound nhẹ và bodyweight có kiểm soát.');
    direction.push('Tăng dần số hiệp khi form đã ổn định.');
    direction.push('Theo dõi cân nặng và sức mạnh mỗi tuần.');
  } else if (bmiStatus === 'Bình thường') {
    bodyType = validImageCount > 0 ? 'Cần AI ảnh để xác định rõ' : 'Bình thường theo BMI';
    bodyTypeReason = 'BMI ở vùng bình thường; cần ảnh thật hoặc tự đánh giá thêm để phân biệt cân đối hay skinny fat.';
    confidence = 'thấp';
    focus.push(user.goal || 'Cải thiện thể lực');
    focus.push('Tăng chất lượng vận động');
    focus.push('Duy trì lịch tập đều');
    direction.push('Chia lịch theo nhóm cơ hoặc theo mục tiêu calisthenics/gym.');
    direction.push('Kết hợp sức mạnh, core và giãn cơ.');
    direction.push('Tăng độ khó theo từng tuần thay vì thay đổi quá nhanh.');
  } else {
    bodyType = 'Tích mỡ cao';
    bodyTypeReason = 'BMI đang cao hơn vùng khuyến nghị, nên ưu tiên giảm mỡ bền vững.';
    confidence = validImageCount > 0 ? 'trung bình' : 'thấp';
    focus.push('Giảm mỡ bền vững');
    focus.push('Tăng vận động toàn thân');
    focus.push('Xây thói quen tập đều');
    direction.push('Ưu tiên bài toàn thân, cardio nhẹ và bài bodyweight dễ kiểm soát.');
    direction.push('Tập 3-4 buổi mỗi tuần với cường độ vừa phải.');
    direction.push('Theo dõi tiến độ bằng cân nặng, ảnh và cảm giác khi tập.');
  }

  return {
    bodyType,
    bodyTypeReason,
    confidence,
    visualSummary:
      validImageCount > 0
        ? 'Hệ thống đã ghi nhận ảnh thể trạng hợp lệ và kết hợp với số liệu để đưa ra đánh giá tham khảo.'
        : 'Hệ thống chưa có ảnh thể trạng hợp lệ nên đánh giá hiện tại dựa trên tuổi, BMI, mục tiêu và trình độ tập luyện.',
    postureNotes,
    priorityFocus: focus,
    trainingDirection: direction,
    safetyNote:
      'Kết quả này dùng để tham khảo trong tập luyện, không thay thế tư vấn y tế hoặc huấn luyện viên trực tiếp.'
  };
}

function getUserImages(user) {
  const imageItems = Array.isArray(user.bodyImageItems) ? user.bodyImageItems : [];
  const validTypes = ['front', 'side', 'back'];
  const images = imageItems.length > 0
    ? imageItems
        .filter((item) => validTypes.includes(item.type))
        .map((item) => item.url)
    : Array.isArray(user.bodyImages)
      ? user.bodyImages
      : user.bodyImage
        ? [user.bodyImage]
        : [];

  return images.slice(0, 3);
}

function getImageStats(user) {
  const imageItems = Array.isArray(user.bodyImageItems) ? user.bodyImageItems : [];
  const validTypes = ['front', 'side', 'back'];

  if (imageItems.length === 0) {
    const oldImages = Array.isArray(user.bodyImages)
      ? user.bodyImages.length
      : user.bodyImage
        ? 1
        : 0;

    return {
      total: oldImages,
      valid: oldImages,
      invalid: 0
    };
  }

  const valid = imageItems.filter((item) => validTypes.includes(item.type)).length;

  return {
    total: imageItems.length,
    valid,
    invalid: imageItems.length - valid
  };
}

function imageToBase64Part(imagePath) {
  const fileName = path.basename(imagePath);
  const fullPath = path.join(process.cwd(), 'uploads', fileName);

  if (!fs.existsSync(fullPath)) {
    return null;
  }

  const ext = path.extname(fileName).toLowerCase();
  const mimeType = ext === '.png'
    ? 'image/png'
    : ext === '.webp'
      ? 'image/webp'
      : 'image/jpeg';
  const base64 = fs.readFileSync(fullPath).toString('base64');

  return {
    inlineData: {
      mimeType,
      data: base64
    }
  };
}

function parseAiJson(text) {
  const cleaned = text
    .replace(/```json/g, '')
    .replace(/```/g, '')
    .trim();

  const objectStart = cleaned.indexOf('{');
  const objectEnd = cleaned.lastIndexOf('}');
  const jsonText = objectStart >= 0 && objectEnd > objectStart
    ? cleaned.slice(objectStart, objectEnd + 1)
    : cleaned;

  return JSON.parse(jsonText);
}

async function createRealAiAnalysis(user, bmi, bmiStatus, isUnder20) {
  const gemini = getGeminiClient();

  if (process.env.USE_REAL_AI !== 'true' || process.env.AI_PROVIDER !== 'gemini' || !gemini) {
    return null;
  }

  const imageParts = getUserImages(user)
    .map(imageToBase64Part)
    .filter(Boolean)

  if (imageParts.length === 0) {
    return null;
  }

  const prompt = `
Bạn là AI fitness coach trong website đồ án.
Hãy phân tích ảnh thể trạng ở mức tham khảo, không chẩn đoán bệnh, không ước lượng phần trăm mỡ, không kết luận BMI từ ảnh.
Bạn phải phân loại tạng người theo ảnh và số liệu. Các nhãn hợp lệ:
- "gầy"
- "skinny fat"
- "cân đối"
- "tăng cơ tốt"
- "thừa cân/tích mỡ"
- "khó xác định"

Dấu hiệu "skinny fat": BMI hoặc cân nặng không quá cao, tay/chân/ngực/vai chưa nhiều cơ, nhưng vùng bụng/eo có mỡ mềm hoặc bụng nhô rõ hơn so với lượng cơ tổng thể.
Với nam giới, nếu vai/ngực/tay/chân còn mỏng, đường nét cơ chưa rõ, nhưng bụng dưới hoặc vòng eo nhô nhẹ so với ngực/vai ở ảnh chính diện hoặc góc nghiêng, hãy phân loại là "skinny fat". Không cần bụng phải to rõ mới gọi là skinny fat.
Nếu thấy dấu hiệu này, hãy ghi bodyType là "skinny fat". Không dùng từ mập/béo miệt thị.
Khi phân loại tạng người, hãy ưu tiên quan sát từ ảnh hơn BMI. BMI thấp hoặc bình thường không được tự động kết luận là "gầy" nếu ảnh cho thấy cơ tổng thể mỏng nhưng vùng bụng/eo vẫn nhô hoặc tích mỡ mềm.
Chỉ ghi "gầy" khi cơ thể mỏng đều, bụng/eo phẳng rõ và không có dấu hiệu bụng dưới hoặc eo nhô so với thân trên.
Nếu phân vân giữa "gầy" và "skinny fat", hãy chọn "skinny fat" khi mục tiêu tập luyện nên là tăng cơ đồng thời kiểm soát mỡ vùng bụng.

Thông tin user:
- Tuổi: ${user.age}
- Giới tính: ${user.gender}
- Chiều cao: ${user.heightCm} cm
- Cân nặng: ${user.weightKg} kg
- BMI đã tính từ số liệu: ${bmi}
- Nhãn BMI: ${bmiStatus}
- Mục tiêu: ${user.goal}
- Trình độ: ${user.trainingLevel}
- Dưới 20 tuổi: ${isUnder20 ? 'có' : 'không'}

Yêu cầu trả về JSON thuần, không markdown:
{
  "bodyType": "một trong các nhãn hợp lệ ở trên",
  "bodyTypeReason": "giải thích ngắn vì sao chọn tạng người đó",
  "confidence": "thấp | trung bình | cao",
  "visualSummary": "nhận xét tổng quan từ ảnh, nói chắc nhưng không quá đà",
  "postureNotes": ["nhận xét 1", "nhận xét 2"],
  "priorityFocus": ["ưu tiên 1", "ưu tiên 2", "ưu tiên 3"],
  "trainingDirection": ["hướng tập 1", "hướng tập 2", "hướng tập 3"],
  "safetyNote": "lưu ý an toàn ngắn gọn"
}
`;

  const response = await gemini.models.generateContent({
    model: process.env.GEMINI_MODEL || 'gemini-3.6-flash',
    contents: [
      {
        role: 'user',
        parts: [
          {
            text: prompt
          },
          ...imageParts
        ]
      }
    ]
  });

  return parseAiJson(response.text);
}

async function freeAnalysis(req, res) {
  try {
    const user = req.user;
    const userImages = getUserImages(user);
    const imageStats = getImageStats(user);
    const imageCount = imageStats.valid;
    const bmi = calculateBmi(user.heightCm, user.weightKg);

    if (!bmi) {
      return res.status(400).json({
        message: 'Vui lòng cập nhật chiều cao và cân nặng trước khi phân tích'
      });
    }

    const bmiStatus = getBmiStatus(bmi, user.age);
    const advice = createFreeAdvice(user, bmi, bmiStatus, imageStats.valid);
    const isUnder20 = Number(user.age) < 20;
    let imageAnalysis = null;
    let aiMode = 'demo';

    try {
      imageAnalysis = await createRealAiAnalysis(user, bmi, bmiStatus, isUnder20);

      if (imageAnalysis) {
        aiMode = 'real-image-ai';
      }
    } catch (error) {
      aiMode = 'demo-fallback';
    }

    if (!imageAnalysis) {
      imageAnalysis = createDemoImageAnalysis(
        user,
        bmi,
        bmiStatus,
        imageStats.valid,
        imageStats.invalid
      );
    }

    res.json({
      type: 'free',
      title: 'Phân tích AI miễn phí',
      aiMode,
      bmi,
      bmiStatus,
      isUnder20,
      imageCount,
      totalImageCount: imageStats.total,
      invalidImageCount: imageStats.invalid,
      imageAnalysis,
      goal: user.goal,
      summary: isUnder20
        ? 'Đây là phân tích tham khảo cho người dưới 20 tuổi. BMI ở độ tuổi này cần được xem theo tuổi và giới tính, không kết luận như người trưởng thành.'
        : 'Đây là phân tích tổng quát dựa trên BMI, mục tiêu, trình độ tập luyện và ảnh thể trạng đã gửi.',
      advice,
      limitation: ''
    });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi phân tích AI miễn phí' });
  }
}

async function mealAnalysis(req, res) {
  let uploadedPath = req.file?.path;

  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Vui lòng chọn ảnh món ăn.' });
    }

    const gemini = getGeminiClient();

    if (process.env.USE_REAL_AI !== 'true' || process.env.AI_PROVIDER !== 'gemini' || !gemini) {
      return res.status(503).json({
        message: 'AI phân tích món ăn chưa được bật hoặc chưa có GEMINI_API_KEY.'
      });
    }

    const imagePart = imageToBase64Part(req.file.filename);

    if (!imagePart) {
      return res.status(400).json({ message: 'Không đọc được ảnh món ăn vừa gửi.' });
    }

    const prompt = `
Bạn là AI hỗ trợ dinh dưỡng trong website fitness. Hãy nhìn ảnh món ăn và đưa ra ước tính tham khảo.
Không được khẳng định con số chính xác vì ảnh không cho biết chắc khối lượng, nguyên liệu và cách chế biến.
Nếu ảnh không phải món ăn, ảnh quá mờ hoặc không đủ để nhận diện, hãy trả về isFood là false và không tự bịa số liệu.
Hãy trả về đúng JSON thuần, không markdown, không thêm lời giải thích bên ngoài JSON.

Thông tin người dùng:
- Mục tiêu: ${req.user.goal || 'cải thiện thể lực'}
- Cân nặng: ${req.user.weightKg || 'chưa cập nhật'} kg

Định dạng bắt buộc:
{
  "isFood": true,
  "dishName": "tên món ăn dễ hiểu bằng tiếng Việt",
  "caloriesEstimate": 0,
  "caloriesRange": "khoảng 0-0 kcal",
  "proteinGram": 0,
  "carbGram": 0,
  "fatGram": 0,
  "portionNote": "nhận xét ngắn về khẩu phần nhìn thấy",
  "advice": "gợi ý ngắn, dứt khoát để món phù hợp hơn với mục tiêu"
}

caloriesEstimate, proteinGram, carbGram và fatGram là số dự đoán, không ghi đơn vị trong giá trị.
Nếu isFood là false, dùng dishName là "Chưa nhận diện được món ăn", đặt các số thành null,
caloriesRange là "Chưa thể ước tính", portionNote và advice phải nói rõ cần gửi ảnh món ăn rõ hơn.
`;

    const response = await gemini.models.generateContent({
      model: process.env.GEMINI_MODEL || 'gemini-3.6-flash',
      contents: [
        {
          role: 'user',
          parts: [
            { text: prompt },
            imagePart
          ]
        }
      ]
    });

    const result = parseAiJson(response.text);

    return res.json({
      ...result,
      note: 'Đây là calo và dinh dưỡng ước tính từ hình ảnh, không phải số đo chính xác.'
    });
  } catch (error) {
    return res.status(500).json({
      message: 'AI chưa phân tích được ảnh món ăn. Hãy thử ảnh rõ hơn và thấy trọn món ăn.'
    });
  } finally {
    if (uploadedPath && fs.existsSync(uploadedPath)) {
      fs.unlinkSync(uploadedPath);
    }
  }
}

function createDemoMealTextAnalysis(mealName) {
  const normalizedName = mealName
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/\s+/g, ' ');
  const mealOptions = [
    { keyword: 'com ga', dishName: 'Cơm gà', caloriesEstimate: 550, caloriesRange: 'khoảng 450-650 kcal', proteinGram: 30, carbGram: 70, fatGram: 16 },
    { keyword: 'bun bo', dishName: 'Bún bò', caloriesEstimate: 550, caloriesRange: 'khoảng 450-650 kcal', proteinGram: 28, carbGram: 68, fatGram: 18 },
    { keyword: 'pho ga', dishName: 'Phở gà', caloriesEstimate: 450, caloriesRange: 'khoảng 350-550 kcal', proteinGram: 28, carbGram: 58, fatGram: 10 },
    { keyword: 'pho bo', dishName: 'Phở bò', caloriesEstimate: 500, caloriesRange: 'khoảng 400-650 kcal', proteinGram: 28, carbGram: 60, fatGram: 14 },
    { keyword: 'pho chay', dishName: 'Phở chay', caloriesEstimate: 350, caloriesRange: 'khoảng 280-450 kcal', proteinGram: 12, carbGram: 58, fatGram: 8 },
    { keyword: 'pho', dishName: 'Phở', caloriesEstimate: 450, caloriesRange: 'khoảng 350-550 kcal', proteinGram: 25, carbGram: 58, fatGram: 12 },
    { keyword: 'com tam', dishName: 'Cơm tấm', caloriesEstimate: 650, caloriesRange: 'khoảng 550-750 kcal', proteinGram: 32, carbGram: 80, fatGram: 22 },
    { keyword: 'com chien', dishName: 'Cơm chiên', caloriesEstimate: 650, caloriesRange: 'khoảng 550-800 kcal', proteinGram: 20, carbGram: 82, fatGram: 24 },
    { keyword: 'com suon', dishName: 'Cơm sườn', caloriesEstimate: 700, caloriesRange: 'khoảng 600-850 kcal', proteinGram: 32, carbGram: 78, fatGram: 25 },
    { keyword: 'com thit kho', dishName: 'Cơm thịt kho', caloriesEstimate: 680, caloriesRange: 'khoảng 580-800 kcal', proteinGram: 30, carbGram: 76, fatGram: 24 },
    { keyword: 'com ca', dishName: 'Cơm cá', caloriesEstimate: 580, caloriesRange: 'khoảng 480-700 kcal', proteinGram: 32, carbGram: 70, fatGram: 16 },
    { keyword: 'com tron', dishName: 'Cơm trộn', caloriesEstimate: 550, caloriesRange: 'khoảng 450-650 kcal', proteinGram: 22, carbGram: 75, fatGram: 16 },
    { keyword: 'com chay', dishName: 'Cơm chay', caloriesEstimate: 450, caloriesRange: 'khoảng 350-550 kcal', proteinGram: 14, carbGram: 72, fatGram: 12 },
    { keyword: 'bun thit nuong', dishName: 'Bún thịt nướng', caloriesEstimate: 620, caloriesRange: 'khoảng 520-750 kcal', proteinGram: 28, carbGram: 78, fatGram: 20 },
    { keyword: 'bun chay', dishName: 'Bún chay', caloriesEstimate: 400, caloriesRange: 'khoảng 320-500 kcal', proteinGram: 12, carbGram: 65, fatGram: 10 },
    { keyword: 'hu tieu', dishName: 'Hủ tiếu', caloriesEstimate: 480, caloriesRange: 'khoảng 380-600 kcal', proteinGram: 24, carbGram: 62, fatGram: 12 },
    { keyword: 'mi tom', dishName: 'Mì tôm', caloriesEstimate: 420, caloriesRange: 'khoảng 350-550 kcal', proteinGram: 10, carbGram: 52, fatGram: 20 },
    { keyword: 'mi goi', dishName: 'Mì gói', caloriesEstimate: 325, caloriesRange: 'khoảng 325 kcal', proteinGram: 10, carbGram: 52, fatGram: 20 },
    { keyword: 'mi xao chay', dishName: 'Mì xào chay', caloriesEstimate: 450, caloriesRange: 'khoảng 350-550 kcal', proteinGram: 14, carbGram: 65, fatGram: 14 },
    { keyword: 'mi xao bo', dishName: 'Mì xào bò', caloriesEstimate: 650, caloriesRange: 'khoảng 550-800 kcal', proteinGram: 30, carbGram: 72, fatGram: 24 },
    { keyword: 'mi xao hai san', dishName: 'Mì xào hải sản', caloriesEstimate: 620, caloriesRange: 'khoảng 520-750 kcal', proteinGram: 28, carbGram: 70, fatGram: 20 },
    { keyword: 'mi y', dishName: 'Mì Ý', caloriesEstimate: 550, caloriesRange: 'khoảng 450-700 kcal', proteinGram: 20, carbGram: 78, fatGram: 16 },
    { keyword: 'mi bo', dishName: 'Mì bò', caloriesEstimate: 550, caloriesRange: 'khoảng 450-700 kcal', proteinGram: 28, carbGram: 65, fatGram: 18 },
    { keyword: 'nui xao bo', dishName: 'Nui xào bò', caloriesEstimate: 600, caloriesRange: 'khoảng 500-750 kcal', proteinGram: 28, carbGram: 68, fatGram: 20 },
    { keyword: 'nui xao hai san', dishName: 'Nui xào hải sản', caloriesEstimate: 580, caloriesRange: 'khoảng 480-700 kcal', proteinGram: 26, carbGram: 66, fatGram: 18 },
    { keyword: 'chao', dishName: 'Cháo thịt', caloriesEstimate: 350, caloriesRange: 'khoảng 280-450 kcal', proteinGram: 18, carbGram: 48, fatGram: 8 },
    { keyword: 'xoi', dishName: 'Xôi', caloriesEstimate: 450, caloriesRange: 'khoảng 350-600 kcal', proteinGram: 12, carbGram: 72, fatGram: 12 },
    { keyword: 'banh cuon', dishName: 'Bánh cuốn', caloriesEstimate: 380, caloriesRange: 'khoảng 300-500 kcal', proteinGram: 16, carbGram: 55, fatGram: 10 },
    { keyword: 'banh bao', dishName: 'Bánh bao thịt', caloriesEstimate: 350, caloriesRange: 'khoảng 280-450 kcal', proteinGram: 14, carbGram: 48, fatGram: 12 },
    { keyword: 'goi cuon chay', dishName: 'Gỏi cuốn chay', caloriesEstimate: 150, caloriesRange: 'khoảng 100-220 kcal', proteinGram: 6, carbGram: 24, fatGram: 3 },
    { keyword: 'goi cuon', dishName: 'Gỏi cuốn', caloriesEstimate: 180, caloriesRange: 'khoảng 120-260 kcal', proteinGram: 10, carbGram: 24, fatGram: 5 },
    { keyword: 'banh mi', dishName: 'Bánh mì', caloriesEstimate: 420, caloriesRange: 'khoảng 300-550 kcal', proteinGram: 18, carbGram: 52, fatGram: 15 },
    { keyword: 'mi xao', dishName: 'Mì xào', caloriesEstimate: 600, caloriesRange: 'khoảng 500-750 kcal', proteinGram: 22, carbGram: 75, fatGram: 22 },
    { keyword: 'bibimbap', dishName: 'Bibimbap', caloriesEstimate: 550, caloriesRange: 'khoảng 450-700 kcal', proteinGram: 22, carbGram: 78, fatGram: 16 },
    { keyword: 'kimbap', dishName: 'Kimbap', caloriesEstimate: 450, caloriesRange: 'khoảng 350-550 kcal', proteinGram: 16, carbGram: 65, fatGram: 12 },
    { keyword: 'tokbokki', dishName: 'Tokbokki', caloriesEstimate: 400, caloriesRange: 'khoảng 300-500 kcal', proteinGram: 8, carbGram: 75, fatGram: 8 },
    { keyword: 'tteokbokki', dishName: 'Tteokbokki', caloriesEstimate: 400, caloriesRange: 'khoảng 300-500 kcal', proteinGram: 8, carbGram: 75, fatGram: 8 },
    { keyword: 'japchae', dishName: 'Japchae', caloriesEstimate: 450, caloriesRange: 'khoảng 350-600 kcal', proteinGram: 14, carbGram: 65, fatGram: 14 },
    { keyword: 'mandu', dishName: 'Mandu', caloriesEstimate: 350, caloriesRange: 'khoảng 280-450 kcal', proteinGram: 15, carbGram: 40, fatGram: 12 },
    { keyword: 'kimchi', dishName: 'Kimchi', caloriesEstimate: 20, caloriesRange: 'khoảng 15-30 kcal', proteinGram: 1, carbGram: 4, fatGram: 0 },
    { keyword: 'ga ran han quoc', dishName: 'Gà rán Hàn Quốc', caloriesEstimate: 550, caloriesRange: 'khoảng 450-700 kcal', proteinGram: 32, carbGram: 45, fatGram: 26 },
    { keyword: 'dau hu chien', dishName: 'Đậu hũ chiên', caloriesEstimate: 250, caloriesRange: 'khoảng 180-350 kcal', proteinGram: 16, carbGram: 8, fatGram: 16 },
    { keyword: 'dau hu sot ca', dishName: 'Đậu hũ sốt cà', caloriesEstimate: 220, caloriesRange: 'khoảng 160-300 kcal', proteinGram: 14, carbGram: 12, fatGram: 12 },
    { keyword: 'nam xao', dishName: 'Nấm xào', caloriesEstimate: 180, caloriesRange: 'khoảng 120-260 kcal', proteinGram: 6, carbGram: 12, fatGram: 10 },
    { keyword: 'canh rau cu', dishName: 'Canh rau củ', caloriesEstimate: 150, caloriesRange: 'khoảng 100-220 kcal', proteinGram: 4, carbGram: 24, fatGram: 4 },
    { keyword: 'trung luoc', dishName: 'Trứng luộc', caloriesEstimate: 150, caloriesRange: 'khoảng 140-170 kcal', proteinGram: 13, carbGram: 1, fatGram: 10 },
    { keyword: 'uc ga', dishName: 'Ức gà', caloriesEstimate: 280, caloriesRange: 'khoảng 220-350 kcal', proteinGram: 45, carbGram: 0, fatGram: 10 },
    { keyword: 'ca hoi', dishName: 'Cá hồi', caloriesEstimate: 350, caloriesRange: 'khoảng 280-450 kcal', proteinGram: 34, carbGram: 0, fatGram: 23 },
    { keyword: 'thit bo', dishName: 'Thịt bò', caloriesEstimate: 320, caloriesRange: 'khoảng 250-420 kcal', proteinGram: 34, carbGram: 0, fatGram: 20 },
    { keyword: 'khoai lang', dishName: 'Khoai lang', caloriesEstimate: 180, caloriesRange: 'khoảng 130-240 kcal', proteinGram: 3, carbGram: 41, fatGram: 0 },
    { keyword: 'chuoi', dishName: 'Chuối', caloriesEstimate: 105, caloriesRange: 'khoảng 90-130 kcal', proteinGram: 1, carbGram: 27, fatGram: 0 },
    { keyword: 'tao', dishName: 'Táo', caloriesEstimate: 95, caloriesRange: 'khoảng 80-120 kcal', proteinGram: 0, carbGram: 25, fatGram: 0 },
    { keyword: 'sua chua', dishName: 'Sữa chua', caloriesEstimate: 120, caloriesRange: 'khoảng 90-170 kcal', proteinGram: 5, carbGram: 14, fatGram: 4 },
    { keyword: 'bot whey', dishName: 'Một khẩu phần whey protein', caloriesEstimate: 120, caloriesRange: 'khoảng 100-150 kcal', proteinGram: 24, carbGram: 4, fatGram: 2 },
    { keyword: 'sua tuoi', dishName: 'Sữa tươi 250ml', caloriesEstimate: 150, caloriesRange: 'khoảng 120-180 kcal', proteinGram: 8, carbGram: 12, fatGram: 8 },
    { keyword: 'salad', dishName: 'Salad', caloriesEstimate: 280, caloriesRange: 'khoảng 180-380 kcal', proteinGram: 15, carbGram: 24, fatGram: 12 },
    { keyword: 'nuoc loc', dishName: 'Nước lọc', caloriesEstimate: 0, caloriesRange: '0 kcal', proteinGram: 0, carbGram: 0, fatGram: 0 },
    { keyword: 'tra da', dishName: 'Trà đá', caloriesEstimate: 0, caloriesRange: '0-5 kcal', proteinGram: 0, carbGram: 0, fatGram: 0 },
    { keyword: 'tra xanh khong duong', dishName: 'Trà xanh không đường', caloriesEstimate: 2, caloriesRange: 'khoảng 0-5 kcal', proteinGram: 0, carbGram: 0, fatGram: 0 },
    { keyword: 'ca phe den', dishName: 'Cà phê đen', caloriesEstimate: 5, caloriesRange: 'khoảng 0-10 kcal', proteinGram: 0, carbGram: 0, fatGram: 0 },
    { keyword: 'ca phe sua', dishName: 'Cà phê sữa', caloriesEstimate: 120, caloriesRange: 'khoảng 100-180 kcal', proteinGram: 4, carbGram: 18, fatGram: 4 },
    { keyword: 'bac xiu', dishName: 'Bạc xỉu', caloriesEstimate: 180, caloriesRange: 'khoảng 140-240 kcal', proteinGram: 5, carbGram: 25, fatGram: 7 },
    { keyword: 'tra sua', dishName: 'Trà sữa', caloriesEstimate: 350, caloriesRange: 'khoảng 250-500 kcal', proteinGram: 5, carbGram: 55, fatGram: 12 },
    { keyword: 'nuoc ngot', dishName: 'Nước ngọt có gas 330ml', caloriesEstimate: 140, caloriesRange: 'khoảng 130-150 kcal', proteinGram: 0, carbGram: 35, fatGram: 0 },
    { keyword: 'nuoc cam', dishName: 'Nước cam', caloriesEstimate: 110, caloriesRange: 'khoảng 90-150 kcal', proteinGram: 2, carbGram: 25, fatGram: 0 },
    { keyword: 'nuoc ep cam', dishName: 'Nước ép cam', caloriesEstimate: 110, caloriesRange: 'khoảng 90-150 kcal', proteinGram: 2, carbGram: 25, fatGram: 0 },
    { keyword: 'sinh to bo', dishName: 'Sinh tố bơ', caloriesEstimate: 320, caloriesRange: 'khoảng 250-450 kcal', proteinGram: 5, carbGram: 35, fatGram: 18 },
    { keyword: 'sinh to chuoi', dishName: 'Sinh tố chuối', caloriesEstimate: 230, caloriesRange: 'khoảng 180-320 kcal', proteinGram: 6, carbGram: 38, fatGram: 6 },
    { keyword: 'nuoc tang luc', dishName: 'Nước tăng lực 330ml', caloriesEstimate: 150, caloriesRange: 'khoảng 120-180 kcal', proteinGram: 0, carbGram: 38, fatGram: 0 }
  ];
  const matchedMeal = mealOptions.find((meal) => normalizedName.includes(meal.keyword));

  if (matchedMeal) {
    const { keyword, ...mealResult } = matchedMeal;
    return mealResult;
  }

  return {
    dishName: mealName,
    caloriesEstimate: 450,
    caloriesRange: 'khoảng 350-600 kcal',
    proteinGram: 20,
    carbGram: 55,
    fatGram: 15
  };
}

async function mealTextAnalysis(req, res) {
  const mealName = String(req.body.mealName || '').trim();

  if (!mealName) {
    return res.status(400).json({ message: 'Vui lòng nhập tên món ăn.' });
  }

  const demoAnalysis = createDemoMealTextAnalysis(mealName);

  return res.json({
    ...demoAnalysis,
    aiMode: 'demo-ai',
    note: 'Calo được AI demo ước tính theo tên món, khẩu phần thực tế có thể khác.'
  });
}

function createDemoMealPlan(user, meals, variation) {
  const goal = String(user.goal || '').toLowerCase();
  const isFatLoss = goal.includes('giảm mỡ') || goal.includes('giam mo');
  const isRecomp = goal.includes('tăng cơ giảm mỡ')
    || goal.includes('tang co giam mo');
  const isGain = !isRecomp && (goal.includes('tăng cân')
    || goal.includes('tang can')
    || goal.includes('tăng cơ')
    || goal.includes('tang co'));
  const isEndurance = goal.includes('tăng sức bền')
    || goal.includes('tang suc ben');
  const isCalisthenics = goal.includes('calisthenics');
  const menuSets = isRecomp
    ? [
      [
        ['Bữa sáng', 'Yến mạch, trứng và sữa chua Hy Lạp', 520, 'Đạm cao, tinh bột vừa đủ cho mục tiêu giữ cơ giảm mỡ'],
        ['Bữa trưa', 'Ức gà, cơm gạo lứt và rau xanh', 680, 'Cân bằng đạm, tinh bột và chất xơ'],
        ['Bữa phụ', 'Phô mai tươi và một quả táo', 220, 'Bổ sung đạm nhẹ giữa buổi'],
        ['Bữa tối', 'Cá, khoai lang và salad', 560, 'No lâu nhưng không dư năng lượng']
      ],
      [
        ['Bữa sáng', 'Bánh mì nguyên cám, trứng và sữa', 500, 'Cân bằng đạm và tinh bột'],
        ['Bữa trưa', 'Thịt nạc, khoai tây và rau củ', 650, 'Ưu tiên đạm nạc và chất xơ'],
        ['Bữa phụ', 'Sữa chua không đường và hạt', 240, 'Hỗ trợ phục hồi sau tập'],
        ['Bữa tối', 'Tôm, đậu phụ và rau luộc', 520, 'Giàu đạm, nhẹ bụng']
      ]
    ]
    : isEndurance
      ? [
        [
          ['Bữa sáng', 'Yến mạch, sữa chua và chuối', 560, 'Nạp tinh bột ổn định cho buổi tập sức bền'],
          ['Bữa trưa', 'Cơm, ức gà và rau củ', 760, 'Bổ sung glycogen và đạm'],
          ['Bữa phụ', 'Chuối, sữa và bánh mì nguyên cám', 300, 'Nạp nhanh trước hoặc sau tập'],
          ['Bữa tối', 'Cá, mì ống và rau xanh', 700, 'Phục hồi năng lượng sau vận động']
        ],
        [
          ['Bữa sáng', 'Khoai lang, trứng và sữa', 540, 'Tinh bột tốt cho sức bền'],
          ['Bữa trưa', 'Cơm, thịt nạc, trứng và canh rau', 780, 'Đủ năng lượng cho ngày vận động'],
          ['Bữa phụ', 'Sinh tố chuối và yến mạch', 320, 'Bù năng lượng dễ tiêu'],
          ['Bữa tối', 'Cá hồi, cơm và salad', 680, 'Đạm tốt cho hồi phục']
        ]
      ]
      : isCalisthenics
        ? [
          [
            ['Bữa sáng', 'Bánh mì nguyên cám, trứng, sữa và chuối', 600, 'Đạm và tinh bột cho bài tập trọng lượng cơ thể'],
            ['Bữa trưa', 'Cơm, thịt bò, rau xanh và canh', 720, 'Hỗ trợ sức mạnh và phục hồi'],
            ['Bữa phụ', 'Sữa chua, yến mạch và trái cây', 300, 'Bổ sung năng lượng trước buổi tập'],
            ['Bữa tối', 'Ức gà, khoai lang và rau củ', 620, 'Đủ đạm để sửa chữa cơ bắp']
          ],
          [
            ['Bữa sáng', 'Yến mạch, trứng và bơ đậu phộng', 580, 'Năng lượng ổn định cho buổi tập kỹ thuật'],
            ['Bữa trưa', 'Cơm, cá, đậu phụ và rau', 700, 'Cân bằng đạm thực vật và động vật'],
            ['Bữa phụ', 'Sữa và một quả chuối', 260, 'Hỗ trợ buổi tập xà, đẩy'],
            ['Bữa tối', 'Thịt nạc, cơm vừa đủ và salad', 640, 'Phục hồi sau tập']
          ]
        ]
        : isFatLoss
    ? [
      [
        ['Bữa sáng', 'Yến mạch, 2 trứng và 1 quả chuối', 420, 'Đủ đạm và no lâu, không quá nhiều năng lượng'],
        ['Bữa trưa', 'Ức gà, cơm vừa đủ và rau xanh', 560, 'Cân bằng đạm, tinh bột và chất xơ'],
        ['Bữa phụ', 'Sữa chua không đường và một ít hạt', 180, 'Bổ sung nhẹ giữa hai bữa'],
        ['Bữa tối', 'Cá hấp, khoai lang và rau luộc', 430, 'Nhẹ bụng và phù hợp mục tiêu giảm mỡ']
      ],
      [
        ['Bữa sáng', 'Bánh mì nguyên cám, trứng và sữa chua', 400, 'Bữa sáng gọn, có đạm'],
        ['Bữa trưa', 'Thịt nạc, cơm gạo lứt và rau củ', 570, 'Giữ khẩu phần tinh bột vừa đủ'],
        ['Bữa phụ', '1 quả táo và sữa chua Hy Lạp', 160, 'Hạn chế đồ ngọt nhưng vẫn đủ no'],
        ['Bữa tối', 'Đậu phụ, tôm và salad', 390, 'Ưu tiên đạm nạc và rau xanh']
      ]
    ]
    : isGain
      ? [
        [
          ['Bữa sáng', 'Bánh mì trứng, sữa và 1 quả chuối', 620, 'Tăng năng lượng và đạm cho đầu ngày'],
          ['Bữa trưa', 'Cơm, thịt bò, trứng và rau xanh', 760, 'Đủ năng lượng cho mục tiêu tăng cân tăng cơ'],
          ['Bữa phụ', 'Sinh tố chuối, sữa và yến mạch', 420, 'Bổ sung năng lượng dễ dùng'],
          ['Bữa tối', 'Cá, cơm và rau củ', 680, 'Hỗ trợ phục hồi sau tập']
        ],
        [
          ['Bữa sáng', 'Yến mạch, trứng, sữa và bơ đậu phộng', 650, 'Nhiều năng lượng nhưng vẫn có đạm'],
          ['Bữa trưa', 'Cơm, ức gà, đậu phụ và canh rau', 740, 'Tăng đạm từ nhiều nguồn'],
          ['Bữa phụ', 'Sữa chua, hạt và trái cây', 380, 'Bổ sung năng lượng giữa buổi'],
          ['Bữa tối', 'Thịt nạc, khoai tây và rau củ', 660, 'Đủ chất cho quá trình hồi phục']
        ]
      ]
      : [
        [
          ['Bữa sáng', 'Bánh mì trứng và sữa', 520, 'Khởi động ngày với đạm và tinh bột'],
          ['Bữa trưa', 'Cơm, cá và rau xanh', 650, 'Bữa chính cân bằng'],
          ['Bữa phụ', 'Trái cây và sữa chua', 220, 'Bổ sung nhẹ giữa buổi'],
          ['Bữa tối', 'Thịt nạc, khoai lang và rau củ', 560, 'Hỗ trợ phục hồi']
        ],
        [
          ['Bữa sáng', 'Phở gà và 1 quả trứng', 480, 'Đủ năng lượng cho buổi sáng'],
          ['Bữa trưa', 'Cơm, thịt nạc, canh và rau', 640, 'Đủ đạm và chất xơ'],
          ['Bữa phụ', 'Chuối và một ly sữa', 250, 'Phù hợp trước hoặc sau buổi tập'],
          ['Bữa tối', 'Cá thu, cơm vừa đủ và salad', 590, 'Bổ sung đạm tốt cho cơ thể']
        ]
      ];
  const selectedSet = menuSets[(Math.max(variation, 1) - 1) % menuSets.length];
  const weight = Number(user.weightKg);
  const baseCalories = weight > 0 ? weight * 30 : 2000;
  const calorieAdjustment = isFatLoss
    ? -300
    : isGain
      ? 300
      : isEndurance
        ? 150
        : isCalisthenics
          ? 100
          : 0;
  const rawTarget = baseCalories + calorieAdjustment;
  const dailyCalorieTarget = Math.max(1400, Math.round(rawTarget / 50) * 50);
  const totalCalories = meals.reduce((total, meal) => total + (Number(meal.calories) || 0), 0);
  const remainingCalories = Math.max(dailyCalorieTarget - totalCalories, 0);
  const mealRatios = {
    'Bữa sáng': 0.25,
    'Bữa trưa': 0.35,
    'Bữa phụ': 0.15,
    'Bữa tối': 0.25
  };
  const loggedMealTypes = new Set(meals.map((meal) => meal.type));
  const availableRatio = selectedSet
    .filter(([meal]) => !loggedMealTypes.has(meal))
    .reduce((total, [meal]) => total + mealRatios[meal], 0);
  const mealSuggestions = selectedSet.map(([meal, food, caloriesEstimate, reason]) => {
    const loggedMeals = meals.filter((item) => item.type === meal);
    const loggedMeal = loggedMeals[0];

    if (!loggedMeal) {
      const adjustedCalories = availableRatio > 0
        ? Math.round((remainingCalories * mealRatios[meal] / availableRatio) / 10) * 10
        : 0;

      return {
        meal,
        food,
        caloriesEstimate: adjustedCalories || caloriesEstimate,
        reason: adjustedCalories > 0
          ? `${reason}, đã chia trong ${remainingCalories} kcal còn lại của ngày`
          : 'Mục tiêu kcal hôm nay đã đủ, chỉ dùng khẩu phần nhẹ nếu thật sự đói'
      };
    }

    const loggedCalories = loggedMeals.reduce(
      (total, item) => total + (Number(item.calories) || 0),
      0
    );
    const hasLoggedCalories = loggedMeals.some(
      (item) => item.calories !== undefined && item.calories !== null
    );

    return {
      meal,
      food: loggedMeals.map((item) => item.name).join(', '),
      caloriesEstimate: hasLoggedCalories ? loggedCalories : caloriesEstimate,
      reason: 'Đã ghi nhận trong nhật ký. Các bữa còn lại được cân đối theo món này.'
    };
  });

  return {
    dailySummary: totalCalories > 0
      ? `Mục tiêu hôm nay là ${dailyCalorieTarget} kcal. Bạn đã ghi ${totalCalories} kcal, còn lại ${remainingCalories} kcal cho các bữa chưa ăn.`
      : `Mục tiêu hôm nay là ${dailyCalorieTarget} kcal. AI đã chia năng lượng cho từng bữa.`,
    dailyCalorieTarget,
    consumedCalories: totalCalories,
    remainingCalories,
    mealSuggestions,
    aiMode: 'demo-ai'
  };
}

async function mealPlanAnalysis(req, res) {
  const meals = Array.isArray(req.body.meals) ? req.body.meals.slice(-20) : [];
  const variation = Number(req.body.variation) || 1;

  return res.json(createDemoMealPlan(req.user, meals, variation));
}

function createSleepFallback(sleepHours, energyLevel) {
  const energyAdvice = energyLevel === 'low'
    ? ' Mức năng lượng đang thấp nên ưu tiên tập nhẹ hoặc nghỉ ngơi.'
    : energyLevel === 'high'
      ? ' Mức năng lượng tốt không thay thế cho việc ngủ đủ.'
      : '';

  if (sleepHours < 4) {
    return {
      sleepStatus: 'Thiếu ngủ nghiêm trọng',
      recoveryImpact: 'Cơ thể chưa hồi phục đủ. Tập nặng hôm nay sẽ làm tăng mệt mỏi và giảm chất lượng kỹ thuật.',
      advice: `Hôm nay không tập nặng. Ưu tiên nghỉ ngơi, uống đủ nước và ngủ bù hợp lý tối nay.${energyAdvice}`
    };
  }

  if (sleepHours < 6) {
    return {
      sleepStatus: 'Thiếu ngủ',
      recoveryImpact: 'Khả năng hồi phục và tập trung có thể giảm so với bình thường.',
      advice: `Giảm cường độ buổi tập, tập kỹ thuật, đi bộ nhẹ hoặc giãn cơ thay cho bài nặng.${energyAdvice}`
    };
  }

  if (sleepHours < 8) {
    return {
      sleepStatus: 'Chưa đủ 8 giờ',
      recoveryImpact: 'Cơ thể chưa có nền tảng hồi phục đầy đủ cho buổi tập nặng.',
      advice: `Hôm nay chỉ tập nhẹ, tập kỹ thuật, đi bộ hoặc giãn cơ. ${sleepHours} giờ ngủ chưa đủ 8 giờ nên không tăng cường độ, dù bạn cảm thấy năng lượng tốt. Cố gắng ngủ sớm hơn tối nay.${energyAdvice}`
    };
  }

  if (sleepHours <= 9) {
    return {
      sleepStatus: 'Đủ giấc',
      recoveryImpact: 'Nền tảng hồi phục hôm nay phù hợp cho buổi tập theo kế hoạch.',
      advice: 'Giữ lịch ngủ ổn định và bắt đầu buổi tập với phần khởi động đầy đủ.'
    };
  }

  return {
    sleepStatus: 'Ngủ nhiều hơn thường lệ',
    recoveryImpact: 'Thời lượng ngủ dài hơn bình thường có thể đi kèm cảm giác uể oải khi thức dậy.',
    advice: 'Theo dõi thêm chất lượng giấc ngủ và giữ giờ thức dậy ổn định.'
  };
}

async function sleepAnalysis(req, res) {
  const sleepHours = Number(req.body.sleepHours);

  if (!Number.isFinite(sleepHours) || sleepHours < 0 || sleepHours > 24) {
    return res.status(400).json({ message: 'Số giờ ngủ phải nằm trong khoảng từ 0 đến 24 giờ.' });
  }

  const energyLevel = req.body.energyLevel || '';
  const fallback = createSleepFallback(sleepHours, energyLevel);

  // Dưới 8 giờ luôn ưu tiên an toàn hồi phục, không phụ thuộc vào câu trả lời của AI.
  if (sleepHours < 8) {
    return res.json({ ...fallback, aiMode: 'rule-based-sleep-safety' });
  }

  const gemini = getGeminiClient();

  if (process.env.USE_REAL_AI !== 'true' || process.env.AI_PROVIDER !== 'gemini' || !gemini) {
    return res.json({ ...fallback, aiMode: 'rule-based-fallback' });
  }

  try {
    const prompt = `
Bạn là AI PT hỗ trợ theo dõi giấc ngủ và kế hoạch tập luyện.
Hãy đánh giá số giờ ngủ của người dùng dựa trên dữ liệu bên dưới.
Nếu ngủ dưới 4 giờ, bắt buộc dùng trạng thái "Thiếu ngủ nghiêm trọng" và khuyên không tập nặng.
Nếu ngủ từ 4 đến dưới 6 giờ, dùng "Thiếu ngủ".
Nếu ngủ từ 6 đến dưới 8 giờ, dùng "Chưa đủ 8 giờ".
Nếu ngủ từ 8 đến 9 giờ, dùng "Đủ giấc".
Nếu trên 9 giờ, dùng "Ngủ nhiều hơn thường lệ".
Nếu ngủ dưới 8 giờ, bắt buộc khuyên tập nhẹ, tập kỹ thuật, đi bộ hoặc giãn cơ, kể cả khi người dùng chọn mức năng lượng "Tốt".
Trả lời dứt khoát, dễ hiểu, không chẩn đoán bệnh.

Số giờ ngủ: ${sleepHours}
Mức năng lượng hôm nay: ${energyLevel || 'chưa đánh giá'}
Mục tiêu tập luyện: ${req.user.goal || 'cải thiện thể lực'}

Trả về JSON thuần, không markdown:
{
  "sleepStatus": "một trong các trạng thái ở trên",
  "recoveryImpact": "ảnh hưởng ngắn gọn đến khả năng hồi phục và tập luyện",
  "advice": "hướng xử lý cụ thể cho hôm nay"
}
`;

    const response = await gemini.models.generateContent({
      model: process.env.GEMINI_MODEL || 'gemini-3.6-flash',
      contents: [{
        role: 'user',
        parts: [{ text: prompt }]
      }]
    });

    return res.json({ ...parseAiJson(response.text), aiMode: 'real-ai' });
  } catch (error) {
    return res.json({ ...fallback, aiMode: 'rule-based-fallback' });
  }
}

function createChatFallback(message, user) {
  const normalizedMessage = message.toLowerCase();

  if (normalizedMessage.includes('ngủ') || normalizedMessage.includes('ngu')) {
    return 'Hãy ưu tiên ngủ đủ 8 giờ. Nếu đêm qua ngủ dưới 8 giờ, hôm nay giảm cường độ, tập kỹ thuật, đi bộ nhẹ hoặc giãn cơ.';
  }

  if (normalizedMessage.includes('ăn') || normalizedMessage.includes('dinh dưỡng') || normalizedMessage.includes('calo')) {
    return `Mục tiêu của bạn là ${user.goal || 'cải thiện thể lực'}. Hãy ưu tiên đủ đạm, tinh bột vừa đủ, rau xanh và ghi lại các bữa ăn để điều chỉnh chính xác hơn.`;
  }

  if (normalizedMessage.includes('tập') || normalizedMessage.includes('bài')) {
    return 'Hãy bắt đầu bằng khởi động 5-10 phút, tập đúng kỹ thuật và tăng dần số hiệp khi cơ thể đã thích nghi.';
  }

  return 'Hãy hỏi cụ thể về lịch tập, bài tập, dinh dưỡng, giấc ngủ hoặc cách cải thiện thể trạng để nhận hướng dẫn phù hợp hơn.';
}

async function chatWithAi(req, res) {
  const message = String(req.body.message || '').trim();

  if (!message) {
    return res.status(400).json({ message: 'Vui lòng nhập câu hỏi.' });
  }

  const gemini = getGeminiClient();

  if (process.env.USE_REAL_AI !== 'true' || process.env.AI_PROVIDER !== 'gemini' || !gemini) {
    return res.json({ reply: createChatFallback(message, req.user), aiMode: 'rule-based-fallback' });
  }

  try {
    const history = Array.isArray(req.body.history) ? req.body.history.slice(-8) : [];
    const historyText = history
      .map((item) => `${item.from === 'user' ? 'Người dùng' : 'AI PT'}: ${String(item.text || '')}`)
      .join('\n');
    const prompt = `
Bạn là AI PT trong website Fitness AI. Hãy trả lời bằng tiếng Việt, thân thiện, rõ ràng và dứt khoát.
Bạn hỗ trợ các chủ đề: gym, calisthenics, bài tập tại nhà, kỹ thuật tập, dinh dưỡng cơ bản, giấc ngủ và phục hồi.
Hãy dựa vào hồ sơ người dùng nếu phù hợp, nhưng không chẩn đoán bệnh và không thay thế bác sĩ hoặc chuyên gia y tế.
Nếu người dùng dưới 18 tuổi, ưu tiên an toàn, kỹ thuật và không khuyên ép cân hoặc tập quá sức.
Không nói rằng bạn chỉ ghi nhận câu hỏi. Hãy trả lời trực tiếp đúng nội dung được hỏi.

Hồ sơ người dùng:
- Tên: ${req.user.fullName || 'người dùng'}
- Tuổi: ${req.user.age || 'chưa cập nhật'}
- Chiều cao: ${req.user.heightCm || 'chưa cập nhật'} cm
- Cân nặng: ${req.user.weightKg || 'chưa cập nhật'} kg
- Mục tiêu: ${req.user.goal || 'chưa cập nhật'}
- Trình độ: ${req.user.trainingLevel || 'chưa cập nhật'}

Lịch sử chat gần đây:
${historyText || 'Chưa có'}

Câu hỏi mới:
${message}
`;

    const response = await gemini.models.generateContent({
      model: process.env.GEMINI_MODEL || 'gemini-3.6-flash',
      contents: [{ role: 'user', parts: [{ text: prompt }] }]
    });

    return res.json({ reply: response.text.trim(), aiMode: 'real-ai' });
  } catch (error) {
    return res.json({ reply: createChatFallback(message, req.user), aiMode: 'rule-based-fallback' });
  }
}

export { freeAnalysis, mealAnalysis, mealTextAnalysis, mealPlanAnalysis, sleepAnalysis, chatWithAi };
