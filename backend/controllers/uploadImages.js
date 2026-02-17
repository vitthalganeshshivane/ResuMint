const cloudinary = require("../config/cloudinary");
const streamifier = require("streamifier");
const Resume = require("../models/Resume");

const uploadToCloudinary = (buffer, folder) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      },
    );

    streamifier.createReadStream(buffer).pipe(stream);
  });
};

const uploadResumeImages = async (req, res) => {
  try {
    const resume = await Resume.findById(req.params.id);

    if (!resume) {
      return res.status(404).json({ message: "Resume not found" });
    }

    let thumbnailLink = resume.thumbnailLink;
    let profilePreviewUrl = resume.profileInfo.profilePreviewUrl;

    // Upload thumbnail
    if (req.files?.thumbnail) {
      const result = await uploadToCloudinary(
        req.files.thumbnail[0].buffer,
        "resume-thumbnails",
      );
      thumbnailLink = result.secure_url;
    }

    // Upload profile image
    if (req.files?.profileImage) {
      const result = await uploadToCloudinary(
        req.files.profileImage[0].buffer,
        "resume-profiles",
      );
      profilePreviewUrl = result.secure_url;
    }

    resume.thumbnailLink = thumbnailLink;
    resume.profileInfo.profilePreviewUrl = profilePreviewUrl;

    await resume.save();

    res.json({ thumbnailLink, profilePreviewUrl });
  } catch (error) {
    console.error("Cloudinary Upload Error:", error);
    res.status(500).json({ message: "Upload failed" });
  }
};

module.exports = { uploadResumeImages };

// const fs = require("fs");
// const path = require("path");
// const Resume = require("../models/Resume");
// const upload = require("../middlewares/uploadMiddleware");

// const uploadResumeImages = async (req, res) => {
//   try {
//     upload.fields([{ name: "thumbnail" }, { name: "profileImage" }])(
//       req,
//       res,
//       async (err) => {
//         if (err) {
//           return res
//             .status(400)
//             .json({ message: "File upload failed", error: err.message });
//         }

//         const resumeId = req.params.id;

//         const resume = await Resume.findOne({
//           _id: resumeId,
//           userId: req.user._id,
//         });

//         if (!resume) {
//           return res
//             .status(404)
//             .json({ message: "Resume not found or unauthorized" });
//         }

//         const uploadsFolder = path.join(__dirname, "..", "uploads");
//         const baseUrl = `${req.protocol}://${req.get("host")}`;

//         const newThumbnail = req.files?.thumbnail?.[0];
//         const newProfileImage = req.files?.profileImage?.[0];

//         if (newThumbnail) {
//           if (resume.thumbnailLink) {
//             const oldThumbnail = path.join(
//               uploadsFolder,
//               path.basename(resume.thumbnailLink),
//             );
//             if (fs.existsSync(oldThumbnail)) fs.unlinkSync(oldThumbnail);
//           }

//           resume.thumbnailLink = `${baseUrl}/uploads/${newThumbnail.filename}`;
//         }

//         if (newProfileImage) {
//           if (resume.profileInfo?.profilePreviewUrl) {
//             const oldProfile = path.join(
//               uploadsFolder,
//               path.basename(resume.profileInfo.profilePreviewUrl),
//             );
//             if (fs.existsSync(oldProfile)) fs.unlinkSync(oldProfile);
//           }

//           resume.profileInfo.profilePreviewUrl = `${baseUrl}/uploads/${newProfileImage.filename}`;
//         }

//         await resume.save();

//         res.status(200).json({
//           message: "Images uploaded successfully",
//           thumbnailLink: resume.thumbnailLink,
//           profilePreviewUrl: resume.profileInfo.profilePreviewUrl,
//         });
//       },
//     );
//   } catch (error) {
//     console.log("Error uploading images", error);
//     res.status(500).json({
//       message: "Failed to upload images",
//       error: error.message,
//     });
//   }
// };

// module.exports = { uploadResumeImages };
