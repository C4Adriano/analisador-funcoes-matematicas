import { execFileSync } from "node:child_process"
import { closeSync, fstatSync, openSync, readSync, writeFileSync } from "node:fs"
import pkg from "../package.json" with { type: "json" }

const gitPath = process.platform == "win32" ? String.raw`C:\Program Files\Git\cmd\git.exe` : "/usr/bin/git",
    msgFile = process.argv[2],
    message = msgFile
        ? (() => {
              const fileDescriptor = openSync(msgFile, "r")
              try {
                  const { size } = fstatSync(fileDescriptor),
                      buffer = Buffer.alloc(size)
                  readSync(fileDescriptor, buffer, 0, size, 0)
                  return buffer
                      .toString("utf8")
                      .replace(/^\u{FEFF}/v, "")
                      .trim()
              } finally {
                  closeSync(fileDescriptor)
              }
          })()
        : execFileSync(gitPath, ["log", "-1", "--pretty=%B"])
              .toString()
              .replace(/^\u{FEFF}/v, "")
              .trim(),
    firstLine = message.split("\n", 1)[0],
    isMajor = firstLine.startsWith("feat: :fire:"),
    isMinor = !isMajor && firstLine.startsWith("feat:"),
    isPatch = !isMajor && !isMinor && firstLine.startsWith("fix:")

if (!isMajor && !isMinor && !isPatch) {
    console.warn(`[version-bump] ignorado (sem prefixo fix:/feat:) <- "${firstLine}"`)
    throw new Error("Nenhuma alteração de versão necessária")
}

let [major, minor, patch] = pkg.version.split(".").map(Number)

if (isMajor) {
    major++
    minor = 0
    patch = 0
} else if (isMinor) {
    minor++
    patch = 0
} else patch++

const version = `${major}.${minor}.${patch}`
pkg.version = version
writeFileSync(new URL("../package.json", import.meta.url), `${JSON.stringify(pkg, null, 2)}\n`)

const versionFileContent = `export const VERSION = "${version}"\n`
writeFileSync(new URL("../src/version.js", import.meta.url), versionFileContent)

console.warn(`[version-bump] ${pkg.version} <- "${firstLine}"`)
