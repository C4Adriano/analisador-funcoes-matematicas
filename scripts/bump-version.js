import { execSync } from "child_process"
import fs from "fs"
import path from "path"
import { fileURLToPath } from "url"

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const msgFile = process.argv[2],
    message = msgFile
        ? fs
              .readFileSync(msgFile, "utf8")
              .replace(/^\uFEFF/, "")
              .trim()
        : execSync("git log -1 --pretty=%B")
              .toString()
              .replace(/^\uFEFF/, "")
              .trim()

const firstLine = message.split("\n")[0]

const isMajor = /^feat: :fire:/.test(firstLine),
    isMinor = !isMajor && /^feat:/.test(firstLine),
    isPatch = !isMajor && !isMinor && /^fix:/.test(firstLine)

if (!isMajor && !isMinor && !isPatch) {
    console.warn(`[version-bump] ignorado (sem prefixo fix:/feat:) <- "${firstLine}"`)
    process.exit(0)
}

const pkgPath = path.join(__dirname, "..", "package.json"),
    pkg = JSON.parse(fs.readFileSync(pkgPath, "utf8"))

let [major, minor, patch] = pkg.version.split(".").map(Number)

if (isMajor) {
    major++
    minor = 0
    patch = 0
} else if (isMinor) {
    minor++
    patch = 0
} else patch++

const newVersion = `${major}.${minor}.${patch}`
pkg.version = newVersion
fs.writeFileSync(pkgPath, `${JSON.stringify(pkg, null, 2)}\n`)

const versionFileContent = `export const VERSION = "${newVersion}"\n`
fs.writeFileSync(path.join(__dirname, "..", "src", "version.js"), versionFileContent)

console.warn(`[version-bump] ${pkg.version} <- "${firstLine}"`)
