const mongoose = require("mongoose");
const { encrypt, decrypt } = require("../utils/encryption");

const AIConfigSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    provider: {
      type: String,
      enum: ["internal", "openai", "gemini", "openrouter", "nvidia", "custom"],
      default: "internal",
    },
    apiKey: {
      type: String,
      default: "",
    },
    baseUrl: {
      type: String,
      default: "",
    },
    model: {
      type: String,
      default: "",
    },
  },
  { timestamps: true },
);

// Encrypt apiKey before saving
AIConfigSchema.pre("save", function () {
  if (this.isModified("apiKey") && this.apiKey) {
    if (!this.apiKey.includes(":")) {
      this.apiKey = encrypt(this.apiKey);
    }
  }
});

// Encrypt apiKey on findOneAndUpdate
AIConfigSchema.pre("findOneAndUpdate", function () {
  const update = this.getUpdate();
  if (update?.apiKey && typeof update.apiKey === "string" && !update.apiKey.includes(":")) {
    update.apiKey = encrypt(update.apiKey);
  }
});

// Decrypt apiKey after reading
function decryptDoc(doc) {
  if (doc && doc.apiKey && doc.apiKey.includes(":")) {
    doc.apiKey = decrypt(doc.apiKey);
  }
  return doc;
}

AIConfigSchema.post("findOne", function (doc) {
  decryptDoc(doc);
});

AIConfigSchema.post("findOneAndUpdate", function (doc) {
  decryptDoc(doc);
});

module.exports = mongoose.model("AIConfig", AIConfigSchema);
