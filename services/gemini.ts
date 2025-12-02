import { GoogleGenAI } from "@google/genai";
import { StockData, GroundingSource } from "../types";

// Initialize Gemini Client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const SYSTEM_INSTRUCTION = `
你是一位世界级的资深金融分析师。你的任务是分析给定的股票代码，通过使用 'googleSearch' 工具搜索实时和历史数据来生成专业报告。

**关键指令**：
1.  **日期处理**：
    *   所有日期字段必须严格使用 **YYYY-MM-DD** 格式（例如 2023-10-27）。
    *   **History 数组必须包含最新的交易数据**。如果今日是交易日且市场已开盘或收盘，History 数组的最后一条**必须**是今日的数据。
    *   **非常重要**：通常历史数据网站只更新到昨天。你必须搜索“今日实时行情”（包含开盘、最高、最低、成交量），并手动将今日的数据构造为一行添加到 history 数组末尾。
    *   如果今日是周末或节假日（非交易日），则最新的数据应为上一个交易日。
2.  **数据准确性**：必须基于真实搜索结果。
3.  **JSON 格式**：严格遵循 JSON 结构，Key 为英文，Value 内容为简体中文。

**输出需包含以下字段**：
1.  **Overview**: 公司名称，当前价格，货币，当日涨跌额和涨跌幅，最后更新日期。
2.  **History (日K线详情)**: 过去 15 个交易日的数据。**每一天必须包含：open(开盘), close(收盘/当前), high(最高), low(最低), changePercent(涨跌幅), volume(成交量), turnover(成交额), turnoverRate(换手率)**。
3.  **Analysis**: 趋势(Trend), 成交量(Volume), 风险(Risk), 目标价(Targets), 技术面(Technicals), 建议(Advice)。

**输出 JSON 结构示例**：
{
  "symbol": "AAPL",
  "companyName": "苹果公司",
  "currentPrice": 150.00,
  "currency": "USD",
  "changeAmount": 1.5,
  "changePercent": 1.0,
  "lastUpdated": "YYYY-MM-DD",
  "history": [
    {
      "date": "YYYY-MM-DD", 
      "open": 148.00,
      "close": 150.00,
      "high": 151.00,
      "low": 147.50,
      "changePercent": 1.0,
      "volume": "50M",
      "turnover": "7.5B",
      "turnoverRate": "0.5%"
    }
  ],
  "trendAnalysis": { "summary": "...", "supportLevels": [], "resistanceLevels": [] },
  "volumeAnalysis": { "volume": "...", "assessment": "..." },
  "riskAssessment": { "volatility": "...", "riskLevel": "Low", "description": "..." },
  "priceTargets": { "shortTerm": "...", "midTerm": "..." },
  "technicalLevels": { "summary": "...", "indicators": [] },
  "tradingAdvice": { "action": "Buy", "entryZone": "...", "stopLoss": "...", "rationale": "..." }
}
`;

export const analyzeStock = async (ticker: string): Promise<StockData> => {
  try {
    const model = 'gemini-2.5-flash'; 
    
    // Get local date properly (Browser time)
    const now = new Date();
    const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;

    const response = await ai.models.generateContent({
      model: model,
      contents: `今天是 ${today} (YYYY-MM-DD, 用户当地时间). 请分析股票代码: "${ticker}". 
      1. 获取截至今日 (${today}) 的最新实时价格数据。
      2. 生成包含过去 15 个交易日的详细日K线数据 (History 数组)。
         - **特别注意**: 如果今日 (${today}) 股市正在交易或已收盘，**务必在 History 数组中包含今日的数据行**。
         - 如果历史数据源未更新今日数据，请使用你搜索到的实时行情（Open, High, Low, Current Price as Close, Volume）手动补充今日这一行。
         - 确保日期连续，不要遗漏今日。
      3. 进行全面的趋势、风险和技术分析。
      请按要求的 JSON 格式输出中文报告.`,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        tools: [{ googleSearch: {} }],
      }
    });

    const text = response.text;
    
    if (!text) {
      throw new Error("Gemini AI 未返回任何文本响应。请稍后重试。");
    }

    // Extract Sources
    let sources: GroundingSource[] = [];
    const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
    if (chunks) {
      sources = chunks
        .map(chunk => chunk.web)
        .filter(web => web !== undefined && web !== null)
        .map(web => ({
          title: web.title || "来源",
          uri: web.uri || "#"
        }));
    }

    // Parse JSON
    const jsonMatch = text.match(/```json\n([\s\S]*?)\n```/);
    if (!jsonMatch) {
        console.error("Raw response:", text);
        throw new Error("解析 AI 响应失败。可能是因为没有返回有效的 JSON 格式。");
    }

    const jsonString = jsonMatch[1];
    const data = JSON.parse(jsonString) as StockData;

    data.sources = sources;

    // Post-process: Sort history by date ascending
    if (data.history && Array.isArray(data.history)) {
        data.history.sort((a, b) => a.date.localeCompare(b.date));
    }

    return data;

  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    throw error;
  }
};
