import React, { useContext } from "react";
import { UserContext } from "../../context/userContext";
import { useNavigate } from "react-router-dom";

const ProfileInfoCard = () => {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();

  return (
    user && (
      <button
        onClick={() => navigate("/profile")}
        className="flex items-center gap-3 cursor-pointer"
      >
        <div
          className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0 transition-all duration-200 hover:opacity-80"
          style={{ backgroundColor: "var(--color-dust)" }}
        >
          {user?.profileImageUrl ? (
            <img
              src={user.profileImageUrl}
              alt=""
              className="w-full h-full object-cover"
            />
          ) : (
            <div
              className="w-full h-full flex items-center justify-center text-sm font-semibold"
              style={{ color: "var(--color-slate)" }}
            >
              {user.name?.charAt(0)?.toUpperCase()}
            </div>
          )}
        </div>
        <span
          className="text-[14px] font-medium leading-3 hidden md:block"
          style={{ color: "var(--color-ink)" }}
        >
          {user.name || ""}
        </span>
      </button>
    )
  );
};

export default ProfileInfoCard;
