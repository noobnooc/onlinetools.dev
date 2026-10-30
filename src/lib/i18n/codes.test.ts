import { describe, expect, it } from "vitest";
import { joinSentences } from "./codes";

describe("joinSentences", () => {
  it("uses a period and a space for Latin-script locales", () => {
    expect(joinSentences("Format JSON", "Runs locally.", "en")).toBe(
      "Format JSON. Runs locally.",
    );
    expect(joinSentences("Formater du JSON", "Local.", "fr")).toBe(
      "Formater du JSON. Local.",
    );
  });

  it("uses a full-width stop with no space for Chinese and Japanese", () => {
    expect(joinSentences("格式化 JSON", "完全在浏览器中运行。", "zh")).toBe(
      "格式化 JSON。完全在浏览器中运行。",
    );
    expect(joinSentences("JSON を整形", "ブラウザ内で動作。", "ja")).toBe(
      "JSON を整形。ブラウザ内で動作。",
    );
  });

  it("uses the danda for Hindi and a bare space for Thai", () => {
    expect(joinSentences("JSON फ़ॉर्मैट करें", "स्थानीय।", "hi")).toBe(
      "JSON फ़ॉर्मैट करें। स्थानीय।",
    );
    expect(joinSentences("จัดรูปแบบ JSON", "ทำงานในเครื่อง", "th")).toBe(
      "จัดรูปแบบ JSON ทำงานในเครื่อง",
    );
  });

  it("does not double an existing stop", () => {
    expect(joinSentences("Already done.", "Next.", "en")).toBe(
      "Already done. Next.",
    );
    expect(joinSentences("已结束。", "下一句。", "zh")).toBe(
      "已结束。下一句。",
    );
  });
});
