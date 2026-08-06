import React from "react";

const Modal = ({
  children,
  isOpen,
  onClose,
  title,
  hideHeader,
  showActionBtn,
  actionBtnIcon = null,
  actionBtnText,
  onActionClick,
}) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex justify-center items-center w-full h-full bg-black/40 backdrop-blur-sm">
      <div
        className="relative flex flex-col overflow-hidden animate-fade-in"
        style={{
          backgroundColor: "var(--color-cream-lifted)",
          borderRadius: "40px",
          boxShadow: "rgba(0, 0, 0, 0.25) 0px 70px 110px 0px",
          maxWidth: "90vw",
          maxHeight: "90vh",
        }}
      >
        {!hideHeader && (
          <div
            className="flex items-center justify-between px-6 py-4"
            style={{ borderBottom: "1px solid var(--color-dust)" }}
          >
            <h3
              className="text-lg font-medium"
              style={{ color: "var(--color-ink)", letterSpacing: "-0.005em" }}
            >
              {title}
            </h3>

            {showActionBtn && (
              <button className="btn-small mr-12" onClick={() => onActionClick()}>
                {actionBtnIcon} {actionBtnText}
              </button>
            )}
          </div>
        )}

        <button
          type="button"
          className="flex justify-center items-center absolute top-4 right-5 w-8 h-8 rounded-full cursor-pointer transition-all duration-200"
          style={{
            backgroundColor: "var(--color-cream)",
            color: "var(--color-slate)",
          }}
          onClick={onClose}
        >
          <svg
            className="w-3 h-3"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 14 14"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M1 1l6 6m0 0l6 6M7 7l6-6M7 7l-6 6"
            />
          </svg>
        </button>

        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;
