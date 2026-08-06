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

// Instance method to decrypt apiKey
AIConfigSchema.methods.decryptKey = function () {
  if (this.apiKey && this.apiKey.includes(":")) {
    this.apiKey = decrypt(this.apiKey);
  }
  return this;
};

// Static method to find and decrypt
AIConfigSchema.statics.findDecrypted = async function (query) {
  const doc = await this.findOne(query);
  if (doc) {
    doc.decryptKey();
  }
  return doc;
};

module.exports = mongoose.model("AIConfig", AIConfigSchema);
