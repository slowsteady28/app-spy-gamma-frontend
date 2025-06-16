import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import MainLayout from "../layouts/MainLayout";

import MarketCommentary from "./MarketCommentary";

import CallWallsTopFive from "../components/walls/CallWallsTopFive";
import CW1AppReady from "../components/walls/CW1/CW1AppReady";
import CW2AppReady from "../components/walls/CW2/CW2AppReady";
import CW3AppReady from "../components/walls/CW3/CW3AppReady";
import CW4AppReady from "../components/walls/CW4/CW4AppReady";
import CW5AppReady from "../components/walls/CW5/CW5AppReady";

import PutWallsTopFive from "../components/walls/PutWallsTopFive";
import PW1AppReady from "../components/walls/PW1/PW1AppReady";
import PW2AppReady from "../components/walls/PW2/PW2AppReady";
import PW3AppReady from "../components/walls/PW3/PW3AppReady";
import PW4AppReady from "../components/walls/PW4/PW4AppReady";
import PW5AppReady from "../components/walls/PW5/PW5AppReady";

import AbsGammaTopThree from "../components/walls/AbsGammaTopThree";
import AGS1AppReady from "../components/walls/AG1/AGS1AppReady";
import AGS2AppReady from "../components/walls/AG2/AGS2AppReady";
import AGS3AppReady from "../components/walls/AG3/AGS3AppReady";

import GammaFlip from "../components/RegimeChange/GammaFlip";

function Dashboard() {
  const CallWalls = [
    {
      path: "/cw1",
      CallWall: CW1AppReady,
    },
    {
      path: "/cw2",
      CallWall: CW2AppReady,
    },
    {
      path: "/cw3",
      CallWall: CW3AppReady,
    },
    {
      path: "/cw4",
      CallWall: CW4AppReady,
    },
    {
      path: "/cw5",
      CallWall: CW5AppReady,
    },
  ];
  const PutWalls = [
    {
      path: "/pw1",
      PutWall: PW1AppReady,
    },
    {
      path: "/pw2",
      PutWall: PW2AppReady,
    },
    {
      path: "/pw3",
      PutWall: PW3AppReady,
    },
    {
      path: "/pw4",
      PutWall: PW4AppReady,
    },
    {
      path: "/pw5",
      PutWall: PW5AppReady,
    },
  ];
  const AbsoluteGammaStrikes = [
    {
      path: "/absgamma1",
      ABSWall: AGS1AppReady,
    },
    {
      path: "/absgamma2",
      ABSWall: AGS2AppReady,
    },
    {
      path: "/absgamma3",
      ABSWall: AGS3AppReady,
    },
  ];
  return (
    <Router>
      <MainLayout>
        <Routes>
          <Route path="/" element={<CallWallsTopFive />} />
          <Route path="/commentary" element={<MarketCommentary />} />
          <Route path="/cw-top-5" element={<CallWallsTopFive />} />
          {CallWalls.map((Wall, index) => {
            const { path, CallWall } = Wall;
            return <Route key={index} path={path} element={<CallWall />} />;
          })}
          <Route path="/pw-top-5" element={<PutWallsTopFive />} />
          {PutWalls.map((Wall, index) => {
            const { path, PutWall } = Wall;
            return <Route key={index} path={path} element={<PutWall />} />;
          })}
          <Route path="/abs-gamma-top-3" element={<AbsGammaTopThree />} />
          {AbsoluteGammaStrikes.map((Wall, index) => {
            const { path, ABSWall } = Wall;
            return <Route key={index} path={path} element={<ABSWall />} />;
          })}
          <Route path="/gamma-flip" element={<GammaFlip />} />
        </Routes>
      </MainLayout>
    </Router>
  );
}

export default Dashboard;
