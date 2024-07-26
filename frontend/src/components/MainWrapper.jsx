/* eslint-disable react/prop-types */
const MainWrapper = ({ children }) => {
  return (
    <section className=" min-w-[450px]   bg-base-100 p-4 max-w-screen-md m-auto my-8 flex-col justify-center items-center min-h-[750px] border border-primary rounded-md">
      {children}
    </section>
  );
};

export default MainWrapper;
