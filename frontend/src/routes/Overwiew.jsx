import Header from "../components/Header";
import MainWrapper from "../components/MainWrapper";

const Overview = () => {
  const detailTitle = (
    <>
      Übersicht für <span className="text-primary">USER-EMAIL</span>
    </>
  );
  return (
    <>
      <MainWrapper>
        <Header title={detailTitle} />
        <h2>Overview</h2>
      </MainWrapper>
    </>
  );
};

export default Overview;
