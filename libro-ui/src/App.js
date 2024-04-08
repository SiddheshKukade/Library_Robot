import React from "react";
import RobotUI from "./components/RobotUI/RobotUI";
import { Routes, Route, useNavigate } from "react-router-dom";
import BookDes from "../src/components/BookDescription/BookDes";
const App = () => {
  return (
    <Routes>
    <Route exact={true} path="/" Component={RobotUI} />
    <Route exact={true} path="/Description" Component={BookDes} />
  </Routes>
  );
};

export default App;
