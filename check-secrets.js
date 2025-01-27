const fs = require("fs");
const path = require("path");

// Expressões regulares para detectar padrões de chaves críticas
const patterns = [
  /AWS_ACCESS_KEY_ID\s*=\s*[A-Z0-9]{20}/g,
  /AWS_SECRET_ACCESS_KEY\s*=\s*[A-Za-z0-9/+=]{40}/g,
  /GOOGLE_API_KEY\s*=\s*[A-Za-z0-9-_]{35}/g,
  /PRIVATE_KEY\s*=\s*-----BEGIN\s*PRIVATE\s*KEY-----/g,
];

// Lê os arquivos que estão sendo preparados para o commit
const stagedFiles = require("child_process")
  .execSync("git diff --cached --name-only", { encoding: "utf8" })
  .split("\n")
  .filter(Boolean);

let hasSecrets = false;

// Verifica cada arquivo no stage
stagedFiles.forEach((file) => {
  const filePath = path.resolve(file);
  if (fs.existsSync(filePath) && fs.lstatSync(filePath).isFile()) {
    const content = fs.readFileSync(filePath, "utf8");
    patterns.forEach((pattern) => {
      if (pattern.test(content)) {
        console.error(`Possible key or secret detected in file: ${file}`);
        hasSecrets = true;
      }
    });
  }
});

// Se encontrar segredos, impede o commit
if (hasSecrets) {
  console.error("Commit blocked. Remove the keys/secrets before continuing");
  process.exit(1);
} else {
  console.log("No secrets were detected. Commit allowed.");
}
