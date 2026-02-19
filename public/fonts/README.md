# Söhne Font Files

This project is configured to use **Söhne** (by Klim Type Foundry), the same
typeface used on stripe.dev. Stripe calls it `sohne-var` in their CSS.

Söhne is a commercial font — you'll need to provide the files from Stripe's
internal font assets or from a Klim license.

## Expected files

Drop these `.woff2` files into this directory and the `@font-face` rules in
`src/index.css` will pick them up automatically:

| File                            | Weight | Style  |
|---------------------------------|--------|--------|
| `sohne-var.woff2`               | 100–900 (variable) | normal |
| `sohne-var-italic.woff2`        | 100–900 (variable) | italic |

If you only have static weights, add individual files and update the
`@font-face` blocks in `src/index.css` accordingly.

## Fallback stack

Until font files are present, the browser falls back to:
`"Helvetica Neue", Arial, sans-serif`
(the exact fallbacks Stripe uses on stripe.com)
