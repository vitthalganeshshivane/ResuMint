import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { validateEmail } from "../../utils/helper";
import Input from "../../components/inputs/Input";
import ProfilePhotoSelector from "../../components/inputs/ProfilePhotoSelector";
import { UserContext } from "../../context/userContext";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import uploadImage from "../../utils/uploadImage";

const SignUp = ({ setCurrentPage }) => {
  const [profilePic, setProfilePic] = useState(null);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState();

  const { updateUser } = useContext(UserContext);
  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();

    let profileImageUrl = "";

    if (!fullName) {
      setError("Please enter full name.");
      return;
    }

    if (!validateEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    if (!password) {
      setError("Please enter the password");
      return;
    }

    setError("");

    try {
      if (profilePic) {
        const imgUploadRes = await uploadImage(profilePic);
        profileImageUrl = imgUploadRes.imageUrl || "";
      }

      const response = await axiosInstance.post(API_PATHS.AUTH.REGISTER, {
        name: fullName,
        email,
        password,
        profileImageUrl,
      });

      const { token } = response.data;

      if (token) {
        localStorage.setItem("token", token);
        updateUser(response.data);
        navigate("/dashboard");
      }
    } catch (error) {
      if (error.response && error.response.data.message) {
        setError(error.response.data.message);
      } else {
        setError("Something went wrong. Please try again");
      }
    }
  };

  return (
    <div className="w-[90vw] md:w-[380px] p-8 flex flex-col justify-center">
      <h3
        className="text-xl font-medium"
        style={{ color: "var(--color-ink)", letterSpacing: "-0.01em" }}
      >
        Create An Account
      </h3>
      <p
        className="text-sm mt-1 mb-5"
        style={{ color: "var(--color-slate)", fontWeight: 450 }}
      >
        Join us today by entering your details below.
      </p>

      <form onSubmit={handleSignUp}>
        <ProfilePhotoSelector image={profilePic} setImage={setProfilePic} />

        <div className="grid grid-cols-1 gap-1">
          <Input
            value={fullName}
            onChange={({ target }) => setFullName(target.value)}
            label="Full Name"
            placeholder="John"
            type="text"
          />
          <Input
            value={email}
            onChange={({ target }) => setEmail(target.value)}
            label="Email Address"
            placeholder="john@example.com"
            type="text"
          />
          <Input
            value={password}
            onChange={({ target }) => setPassword(target.value)}
            label="Password"
            placeholder="Min 8 Characters"
            type="password"
          />
        </div>

        {error && (
          <p className="text-xs pb-2.5" style={{ color: "var(--color-signal-orange)" }}>
            {error}
          </p>
        )}

        <button type="submit" className="btn-primary">
          SIGN UP
        </button>

        <p className="text-[13px] mt-4" style={{ color: "var(--color-slate)" }}>
          Already have an account?{" "}
          <button
            className="font-medium cursor-pointer underline"
            style={{ color: "var(--color-ink)" }}
            onClick={() => setCurrentPage("login")}
          >
            Login
          </button>
        </p>
      </form>
    </div>
  );
};

export default SignUp;
