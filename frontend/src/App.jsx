import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./routes/Login";
import { UserProvider } from "./context/userProvider";
import Time from "./routes/Time";
import Overwiew from "./routes/Overwiew";

function App() {
  return (
    <>
      <UserProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/time" element={<Time />} />
            <Route path="/overview" element={<Overwiew />} />
          </Routes>
        </BrowserRouter>
      </UserProvider>
    </>
  );
}

export default App;
