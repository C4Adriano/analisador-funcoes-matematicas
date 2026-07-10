// scripts/bump-version.js
import fs from "fs"
import path from "path"
import { execSync } from "child_process"
import { fileURLToPath } from "url"

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const msgFile = process.argv[2]
const message = fs
    .readFileSync(msgFile, "utf8")
    .replace(/^\uFEFF/, "") // remove o BOM se existir
    .trim()
const firstLine = message.split("\n")[0]

const pkgPath = path.join(__dirname, "..", "package.json")
const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf8"))

let [major, minor, patch] = pkg.version.split(".").map(Number)

const isMajor = /^feat:\s*:fire:/.test(firstLine)
const isMinor = !isMajor && /^feat:/.test(firstLine)

if (isMajor) {
    major += 1
    minor = 0
    patch = 0
} else if (isMinor) {
    minor += 1
    patch = 0
} else {
    patch += 1
}

const newVersion = `${major}.${minor}.${patch}`
pkg.version = newVersion
fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + "\n")

const versionFileContent =
    `// Arquivo gerado automaticamente pelo hook de commit. Não editar manualmente.\n` +
    `export const VERSION: string = '${newVersion}';\n`
fs.writeFileSync(path.join(__dirname, "..", "src", "version.ts"), versionFileContent)

execSync("git add package.json src/version.ts")

console.log(`[version-bump] ${pkg.version} <- "${firstLine}"`)
