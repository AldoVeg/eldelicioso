// ESLint como parte de npm test: un solo comando revisa pruebas, duplicados, recursos y errores de JavaScript.
import test from "node:test";
import assert from "node:assert/strict";
import { ESLint } from "eslint";

test("el JavaScript del sitio no tiene errores de ESLint", async () => {
  const resultados = await new ESLint().lintFiles(["src", "tools", "tests", "sw.js", "eslint.config.js"]);
  const problemas = resultados.flatMap((r) => r.messages.map((m) => `${r.filePath.split(/[\\/]/).slice(-3).join("/")}:${m.line} ${m.ruleId}: ${m.message}`));
  assert.deepEqual(problemas, []);
});
