import Header from "../components/Header";
import MainWrapper from "../components/MainWrapper";
import UserLogin from "../components/UserLogin";

const Login = () => {
  return (
    <>
      <MainWrapper>
        <Header title="Login" />
        <UserLogin />
      </MainWrapper>
    </>
  );
};

export default Login;
