import Header from "../components/Header";
import MainWrapper from "../components/MainWrapper";
import { useUser } from "./../context/userProvider";
import MyCalendar from "../components/MyCalendar";

const Overview = () => {
  const { user } = useUser();
  console.log(user);
  const detailTitle = (
    <>
      Übersicht für <span className="text-primary">{user?.email}</span>
    </>
  );
  return (
    <>
      <MainWrapper>
        <Header title={detailTitle} />
        <article className="min-h-[600px] flex justify-center items-center">
          <MyCalendar />
        </article>
      </MainWrapper>
    </>
  );
};

export default Overview;
