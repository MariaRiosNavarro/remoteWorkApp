import PasswordSvg from "./SVG/PasswordSvg";
import HiddenPasswordSvg from "./SVG/HiddenPasswordSvg";
import ShowPasswordSvg from "./SVG/ShowPasswordSvg";
import EmailSvg from "./SVG/EmailSvg";
import { useState, useRef } from "react";
import { useUser } from "./../context/userProvider";
import { useNavigate } from "react-router-dom";
import useFetch from "./../hooks/useFetch";

const UserLogin = () => {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");
  const { setUser } = useUser();
  const { fetchData, loading, error } = useFetch();

  const emailRef = useRef();
  const passwordRef = useRef();
  const navigate = useNavigate();

  // ---------------------------------------------------------handleLogin
  const handleLogin = async () => {
    const user = {
      email: emailRef.current.value,
      password: passwordRef.current.value,
    };

    const { ok, data } = await fetchData("/api/auth/login", "POST", user);

    if (ok) {
      let { email, id } = data;
      setUser({ email, id });
      navigate("/time");
    } else {
      setMessage("You are not registered or your password/user is wrong");
    }
  };

  // ---------------------------------------------------------handleSubmit

  const handleSubmit = (e) => {
    e.preventDefault();
    handleLogin();
  };

  return (
    <>
      <section className="p-6 pb-12 min-h-[750px] min-w-[400px] flex flex-col justify-between items-center border border-primary rounded-md">
        <div className="flex flex-col gap-6 pt-[6rem] max-w-[500px]">
          {/* -----------------------------------------------------------------EMAIL INPUT */}
          <div className="flex items-center input input-bordered input-primary w-full max-w-xs">
            <EmailSvg />
            <input
              ref={emailRef}
              type="text"
              placeholder="Email"
              required
              className="bg-transparent focus:border-none focus:outline-none w-[100%] px-6 py-4"
            />
          </div>
          {/* -----------------------------------------------------------------PASSWORD INPUT */}
          <div className="flex items-center input input-bordered input-primary w-full max-w-xs">
            <PasswordSvg />
            <input
              // required
              ref={passwordRef}
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="bg-transparent w-[100%] px-6 py-4  focus:border-none focus:outline-none"
            />
            <label htmlFor="check">
              {showPassword ? <ShowPasswordSvg /> : <HiddenPasswordSvg />}
            </label>
            <input
              id="check"
              type="checkbox"
              className="hidden"
              value={showPassword}
              onChange={() => setShowPassword((prev) => !prev)}
            />
          </div>

          {/* -----------------------------------------------------------------SUBMIT BUTTON */}
          <input
            type="submit"
            onClick={handleSubmit}
            value="Login"
            className="btn btn-active btn-primary"
          />

          {/* --------------------------------------------------------------------------------------MESSAGE STATE */}
          {message && <p className="p8 rounded-xl bg-warning">{message}</p>}
        </div>
      </section>
    </>
  );
};

export default UserLogin;
