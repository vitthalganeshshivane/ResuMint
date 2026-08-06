const crypto = require("crypto");

const ALGORITHM = "aes-256-gcm";
const IV_LENGTH = 16;
const SALT_LENGTH = 64;
const TAG_LENGTH = 16;
const KEY_LENGTH = 32;
const ITERATIONS = 100000;

function getEncryptionKey() {
  const secret = process.env.ENCRYPTION_KEY;
  if (!secret) {
    throw new Error(
      "ENCRYPTION_KEY env var is required. Generate one with: node -e \"console.log(crypto.randomBytes(32).toString('hex'))\"",
    );
  }
  return secret;
}

function deriveKey(secret, salt) {
  return crypto.pbkdf2Sync(secret, salt, ITERATIONS, KEY_LENGTH, "sha512");
}

function encrypt(plaintext) {
  if (!plaintext) return "";

  const secret = getEncryptionKey();
  const salt = crypto.randomBytes(SALT_LENGTH);
  const iv = crypto.randomBytes(IV_LENGTH);
  const key = deriveKey(secret, salt);

  const cipher = crypto.createCipheriv(ALGORITHM, key, iv);
  let encrypted = cipher.update(plaintext, "utf8", "hex");
  encrypted += cipher.final("hex");

  const tag = cipher.getAuthTag();

  // Format: salt:iv:tag:ciphertext (all hex, colon-separated)
  return [
    salt.toString("hex"),
    iv.toString("hex"),
    tag.toString("hex"),
    encrypted,
  ].join(":");
}

function decrypt(ciphertext) {
  if (!ciphertext) return "";

  // If it doesn't contain colons, it's likely unencrypted (legacy data)
  if (!ciphertext.includes(":")) return ciphertext;

  const secret = getEncryptionKey();
  const parts = ciphertext.split(":");

  if (parts.length !== 4) return ciphertext;

  const [saltHex, ivHex, tagHex, encrypted] = parts;

  const salt = Buffer.from(saltHex, "hex");
  const iv = Buffer.from(ivHex, "hex");
  const tag = Buffer.from(tagHex, "hex");
  const key = deriveKey(secret, salt);

  const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
  decipher.setAuthTag(tag);

  let decrypted = decipher.update(encrypted, "hex", "utf8");
  decrypted += decipher.final("utf8");

  return decrypted;
}

module.exports = { encrypt, decrypt };
