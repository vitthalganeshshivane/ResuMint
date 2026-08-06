import React, { useContext } from "react";
import { UserContext } from "../../context/userContext";
import { useNavigate } from "react-router-dom";

const ProfileInfoCard = () => {
  const { user, clearUser } = useContext(UserContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    clearUser();
    navigate("/");
  };

  return (
    user && (
      <div className="flex items-center gap-3">
        <div
          className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0"
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
        <div>
          <div
            className="text-[14px] font-medium leading-3"
            style={{ color: "var(--color-ink)" }}
          >
            {user.name || ""}
          </div>
          <button
            className="text-[12px] font-medium cursor-pointer hover:underline"
            style={{ color: "var(--color-signal-orange)" }}
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      </div>
    )
  );
};

export default ProfileInfoCard;
