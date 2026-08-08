import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const compat = new FlatCompat({
  baseDirectory: dirname(fileURLToPath(import.meta.url)),
});

// eslint-config-next todavía se publica en el formato antiguo, así que se adapta con FlatCompat.
const eslintConfig = [
  {
    ignores: [".next/**", "out/**", "build/**", "next-env.d.ts"],
  },
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    // Las primitivas de src/components/ui/ las genera el CLI de shadcn: se regeneran al
    // actualizarlas, así que corregir su estilo aquí se pierde en la siguiente generación.
    files: ["src/components/ui/**"],
    rules: {
      "@typescript-eslint/no-empty-object-type": "off",
    },
  },
];

export default eslintConfig;
