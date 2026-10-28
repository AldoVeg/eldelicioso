// Revisión de JavaScript del sitio (npm run lint, y parte de npm test). Reglas recomendadas más las que evitan restos sin uso.
import js from "@eslint/js";
import globals from "globals";

export default [
  { ignores: ["node_modules/", "propuestas/", "archivo/", "fotos-kekes/", "img/", "fonts/"] },
  js.configs.recommended,
  {
    // La página: módulos de navegador (src/ y src/ui/)
    files: ["src/**/*.js"],
    languageOptions: { ecmaVersion: 2023, sourceType: "module", globals: globals.browser },
    rules: {
      "no-unused-vars": ["error", { args: "after-used", caughtErrors: "none" }],
      "eqeqeq": ["error", "always"],
      "no-var": "error",
      "prefer-const": "error"
    }
  },
  {
    // Herramientas y pruebas: Node
    files: ["tools/**/*.js", "tests/**/*.js", "eslint.config.js"],
    languageOptions: { ecmaVersion: 2023, sourceType: "module", globals: globals.node },
    rules: { "no-unused-vars": ["error", { args: "after-used", caughtErrors: "none" }], "eqeqeq": ["error", "always"], "no-var": "error", "prefer-const": "error" }
  },
  {
    // Service worker
    files: ["sw.js"],
    languageOptions: { ecmaVersion: 2023, sourceType: "script", globals: globals.serviceworker },
    rules: { "no-unused-vars": ["error", { args: "after-used", caughtErrors: "none" }], "eqeqeq": ["error", "always"], "no-var": "error", "prefer-const": "error" }
  }
];
