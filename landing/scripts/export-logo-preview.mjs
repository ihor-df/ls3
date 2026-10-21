import { mkdir, readFile, writeFile } from "node:fs/promises";
import ts from "typescript";
import { LOGO_GLOW_OPACITY, LOGO_INNER_PATH, LOGO_OUTER_PATH } from "../src/helpers/logo-motion.ts";

const artwork = await readFile(new URL("../src/assets/icons/logo-shine.svg", import.meta.url), "utf8");
const motion = ts.transpileModule(await readFile(new URL("../src/helpers/logo-motion.ts", import.meta.url), "utf8"), {
  compilerOptions: { target: ts.ScriptTarget.ES2020, module: ts.ModuleKind.ES2020 },
}).outputText;

function logo(id, animated = false, autoplay = false) {
  return artwork
    .replaceAll('<feComposite in2="hardAlpha" operator="out"/>', "")
    .replace(
      /<feBlend in="SourceGraphic" in2="([^"]+)"/,
      (_, glow) =>
        `<feComponentTransfer in="${glow}" result="adjustedGlow"><feFuncA type="linear" slope="${LOGO_GLOW_OPACITY}"/></feComponentTransfer><feBlend in="SourceGraphic" in2="adjustedGlow"`,
    )
    .replace(
      "<svg ",
      `<svg class="logo" ${animated ? 'data-animated-logo=""' : ""} ${autoplay ? 'data-logo-autoplay=""' : ""} aria-hidden="true" focusable="false" `,
    )
    .replace('id="a"', `id="${id}"`)
    .replace("url(#a)", `url(#${id})`)
    .replace(
      /<path fill="#fff" d="[^"]*"\/>/,
      `<path fill="#fff" d="${LOGO_OUTER_PATH}"/><path fill="#fff" data-logo-inner="" d="${LOGO_INNER_PATH}" stroke="#fff" stroke-width="0" stroke-linejoin="round"/>`,
    );
}

const html = `<!doctype html>
<!-- Generated from the production geometry. Run: node --experimental-strip-types scripts/export-logo-preview.mjs -->
<html lang="ru">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Linken Sphere · Logo motion</title>
<style>
*{box-sizing:border-box}body{margin:0;min-height:100vh;background:#0d0d0d;color:#fff;font:15px/1.5 system-ui,sans-serif}main{max-width:1080px;margin:auto;padding:44px 24px 56px}header{display:flex;align-items:center;justify-content:space-between;gap:32px;padding:0 8px 32px;border-bottom:1px solid #ffffff18}h1{font-size:19px;letter-spacing:-.03em;margin:0;font-weight:500}header span{color:#858585;font-size:12px;letter-spacing:.12em;text-transform:uppercase}.header-demo{display:flex;justify-content:center;padding:40px 0 0}.nav{display:flex;align-items:center;gap:30px;border:1px solid #ffffff1c;border-radius:50px;background:#ffffff10;padding:0 18px 0 8px;height:76px}.nav>span{color:#ddd;font-size:13px}.nav .logo{width:70.4px}.logo{display:block;width:100%;height:auto}.logo-trigger{display:block;padding:0;border:0;background:none;color:inherit;cursor:pointer;text-decoration:none}.logo-trigger:focus-visible{outline:1px solid #aaa;outline-offset:4px;border-radius:16px}.comparison{display:grid;grid-template-columns:1fr 1fr;gap:32px;margin-top:24px}.panel{text-align:center;min-width:0}.panel .logo-trigger,.panel>.logo{width:min(100%,440px);margin:auto}.label{margin-top:10px;font-size:13px;color:#999}.label strong{font-weight:500;color:#eee}.hint{text-align:center;color:#858585;font-size:12px;margin:40px 0 0}.dot{display:inline-block;width:5px;height:5px;border-radius:50%;background:#ddd;vertical-align:2px;margin-right:8px}@media(max-width:640px){main{padding:24px 12px}header{gap:12px}header span{display:none}.comparison{gap:6px}.nav{gap:16px;padding-right:16px}.nav>span{font-size:11px}.label{font-size:11px}.hint{margin-top:28px}}
</style>
</head>
<body>
<main>
<header><h1>Linken Sphere</h1><span>Logo motion / 01</span></header>
<div class="header-demo"><div class="nav"><a href="#preview" class="logo-trigger" aria-label="Анимация логотипа в хедере">${logo("header-glow", true, true)}</a><span>Platform</span><span>Use cases</span><span>Pricing</span></div></div>
<div class="comparison" id="preview">
<div class="panel">${logo("source-glow")}<div class="label">Исходное положение</div></div>
<div class="panel"><a href="#preview" class="logo-trigger" aria-label="Навести курсор или сфокусировать для вращения логотипа">${logo("motion-glow", true)}</a><div class="label"><strong>Наведи курсор</strong> · 3D вращение</div></div>
</div>
<p class="hint"><span class="dot"></span>Боковые стыки закреплены · полный оборот 2,2 с · плавное завершение</p>
</main>
<script type="module">
${motion}
document.querySelectorAll('[data-animated-logo]').forEach(svg => {
  const motion = createLogoMotion(svg);
  if (svg.hasAttribute('data-logo-autoplay')) motion.playOnce();
});
document.querySelectorAll('.logo-trigger').forEach(link => link.addEventListener('click', event => event.preventDefault()));
</script>
</body>
</html>`;

await mkdir(new URL("../design/", import.meta.url), { recursive: true });
await writeFile(new URL("../design/logo-motion-preview.html", import.meta.url), html);
console.log("Created design/logo-motion-preview.html");
