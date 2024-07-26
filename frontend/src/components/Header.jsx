const Header = ({ title }) => {
  return (
    <header className="flex justify-between items-center  p-4 pb-8">
      <h2 className="text-[28px] font-semibold  w-[80%] leading-[110%]">
        HomeOffice CheckIn - {title}
      </h2>
      <div className="flex flex-col items-center justify-center"></div>
      <label className="flex cursor-pointer gap-2">
        <svg
          className="fill-primary stroke-primary"
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle
            className="fill-primary stroke-primary"
            cx="12"
            cy="12"
            r="5"
          />
          <path d="M12 1v2M12 21v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M1 12h2M21 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4" />
        </svg>
        <input
          type="checkbox"
          className="toggle theme-controller border-primary toggle-primary"
          value="night"
        />
        <svg
          className="fill-primary stroke-primary"
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
        </svg>
      </label>
    </header>
  );
};

export default Header;
