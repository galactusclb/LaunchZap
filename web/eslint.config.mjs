import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import boundaries from "eslint-plugin-boundaries";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  {
    plugins: { 
      boundaries
    },
    settings: {
      "boundaries/elements": [
        {
          type: "feature",
          pattern: "src/features/!(views)/*",
          mode: "folder",
          capture: ["elementName"], 
        },
        {
          type: "views",
          pattern: "src/features/views/*/*",
          mode: "folder",
          capture: ["viewGroup", "elementName"],
        },
      ],
    },
    rules: {
      "boundaries/dependencies": [
        "error", 
        {
          // disallow all cross-element imports by default
          default: "disallow",
          // checkInternals: false,
          rules: [
            {
              // ✅ features can import their local files
              from: { type: "feature" },
              allow: {
                to: { type: "feature", captured: { elementName: "{{ elementName }}" } },
              },
            },
            {
              // ✅ views can import their local files
              from: { type: "views" },
              allow: {
                to: { type: "views", captured: { viewGroup: "{{ viewGroup }}" } },
              },
            },
            {
              // ✅ features can import other features (via barrel only)
              from: { type: "feature" },
              allow: {
                to: { type: "feature", internalPath: [null] },
              },
            },
            {
              // ✅ views can import features (via barrel only)
              from: { type: "views" },
              allow: {
                to: { type: "feature", internalPath: [null] },
              },
            },
          ]
        }
      ],
      "no-restricted-imports": ["error", {
        patterns: [
          {
            // block deep feature imports from anywhere
            group: ["@/features/*/**", "!@/features/views/**"],
            message: "Use the feature entry-point (barrel import) (@/features/<name>) instead of deep imports.",
          },
          {
            // block deep view imports from anywhere
            group: ["@/features/views/*/*/**"],
            message: "Use the view entry-point (@/features/views/<group>/<name>) instead of deep imports.",
          },
        ]
      }]
    },
  },
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
]);

export default eslintConfig;
