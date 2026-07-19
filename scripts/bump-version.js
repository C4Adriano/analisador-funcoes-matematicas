/* eslint-disable no-console */
// scripts/bump-version.js
import { execSync } from "child_process"
import fs from "fs"
import path from "path"
import { fileURLToPath } from "url"

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const msgFile = process.argv[2]
const message = msgFile
    ? fs
          .readFileSync(msgFile, "utf8")
          .replace(/^\uFEFF/, "")
          .trim()
    : execSync("git log -1 --pretty=%B")
          .toString()
          .replace(/^\uFEFF/, "")
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
    `export const VERSION = '${newVersion}';\n`
fs.writeFileSync(path.join(__dirname, "..", "src", "version.js"), versionFileContent)

console.log(`[version-bump] ${pkg.version} <- "${firstLine}"`)
