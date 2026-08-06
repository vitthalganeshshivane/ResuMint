import React, { useRef, useState } from "react";
import { LuTrash, LuUpload, LuUser } from "react-icons/lu";

const ProfilePhotoSelector = ({ image, setImage, preview, setPreview }) => {
  const inputRef = useRef(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setImage(file);
      const preview = URL.createObjectURL(file);
      if (setPreview) setPreview(preview);
      setPreviewUrl(preview);
    }
  };

  const handleRemoveImage = () => {
    setImage(null);
    setPreviewUrl(null);
    if (setPreview) setPreview(null);
    inputRef.current.value = "";
  };

  const onChooseFile = () => {
    inputRef.current.click();
  };

  return (
    <div className="flex justify-center mb-6">
      <input
        type="file"
        accept="image/*"
        ref={inputRef}
        onChange={handleImageChange}
        className="hidden"
      />

      {!image ? (
        <div
          className="w-20 h-20 flex items-center justify-center rounded-full relative cursor-pointer"
          style={{
            backgroundColor: "var(--color-cream)",
            border: "2px dashed var(--color-dust)",
          }}
        >
          <LuUser className="text-3xl" style={{ color: "var(--color-dust)" }} />

          <button
            type="button"
            className="w-8 h-8 flex items-center justify-center text-white rounded-full absolute -bottom-1 -right-1 cursor-pointer"
            style={{ backgroundColor: "var(--color-ink)" }}
            onClick={onChooseFile}
          >
            <LuUpload size={14} />
          </button>
        </div>
      ) : (
        <div className="relative">
          <img
            src={preview || previewUrl}
            alt="profile photo"
            className="w-20 h-20 rounded-full object-cover"
          />
          <button
            type="button"
            className="w-8 h-8 flex items-center justify-center text-white rounded-full absolute -bottom-1 -right-1 cursor-pointer"
            style={{ backgroundColor: "var(--color-signal-orange)" }}
            onClick={handleRemoveImage}
          >
            <LuTrash size={14} />
          </button>
        </div>
      )}
    </div>
  );
};

export default ProfilePhotoSelector;
