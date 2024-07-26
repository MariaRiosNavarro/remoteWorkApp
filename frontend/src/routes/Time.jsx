import MainWrapper from "../components/MainWrapper";
import Header from "../components/Header";

const Time = () => {
  const detailTitle = (
    <>
      Übersicht für <span className="text-primary">START/STOP</span>
    </>
  );
  return (
    <>
      <MainWrapper>
        <Header title={detailTitle} />
        <h2>Time</h2>
      </MainWrapper>
    </>
  );
};

export default Time;
