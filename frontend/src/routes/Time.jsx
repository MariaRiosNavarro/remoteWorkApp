import { useState } from "react";
import MainWrapper from "../components/MainWrapper";
import Header from "../components/Header";
import useFetch from "./../hooks/useFetch";
import StopSvg from "../components/SVG/StopSvg";
import PlaySvg from "../components/SVG/PlaySvg";
import PlaySvgDisable from "../components/SVG/PlaySvgDisable";
import StopSvgDisable from "../components/SVG/StopSvgDisable";
import { Link } from "react-router-dom";
import { useUser } from "./../context/userProvider";

const Time = () => {
  const [start, setStart] = useState(false);
  const [timeId, setTimeId] = useState("");
  const [toast, setToast] = useState("");
  const { fetchData, loading } = useFetch();

  const { user } = useUser();

  const toggleTimeValue = async () => {
    if (start) {
      await fetchTimeStop();
      setStart(false);
    } else {
      await fetchTimeStart();
      setStart(true);
    }
  };

  const headerText = start ? "Stop" : "Start";
  const buttonSvgStar = start ? <PlaySvgDisable /> : <PlaySvg />;
  const buttonSvgStop = start ? <StopSvg /> : <StopSvgDisable />;

  const fetchTimeStart = async () => {
    const { ok, data } = await fetchData(`/api/time/${user.id}`, "POST");

    if (ok) {
      setTimeId(data.data._id);
      setToast(data.message);
      setTimeout(() => setToast(""), 1500);
    }
  };

  const fetchTimeStop = async () => {
    const { ok, data } = await fetchData(
      `/api/time/${user.id}/${timeId}`,
      "PUT"
    );

    if (ok) {
      setToast(data.message);
      setTimeout(() => setToast(""), 1500);
      setTimeId("");
    }
  };

  return (
    <>
      <MainWrapper>
        <Header title={headerText} />

        <article className="border  border-primary p-4 min-h-[750px]  min-w-[400px]   flex-col justify-between gap-10 h-[750px]">
          <div className="flex justify-center items-center gap-12 p-10 w-[100%] ">
            <button onClick={toggleTimeValue}>{buttonSvgStar}</button>
            <button onClick={toggleTimeValue}>{buttonSvgStop}</button>
          </div>

          <div className="flex justify-center items-center py-4 h-16">
            {loading && (
              <span className="loading loading-spinner text-secondary"></span>
            )}
          </div>

          <div className="flex justify-center items-center">
            <Link to="/overview" className="btn btn-active btn-primary">
              Übersicht
            </Link>
          </div>

          <div className="flex-col justify-center items-center w-[100%] h-16 ">
            {toast && (
              <span className="alert alert-success text-base-100 mt-8">
                {toast}
              </span>
            )}
          </div>
        </article>
      </MainWrapper>
    </>
  );
};

export default Time;
