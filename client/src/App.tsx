import React, { Suspense } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import RecallProvider from "./contexts/RecallProvider";
import LandingPage from "./pages/LandingPage";
import Loading from "./components/Loading";

const InsightsPage = React.lazy(() => import("./pages/InsightsPage"));

function App() {
  return (
    <RecallProvider>
      <Router>
        <Routes>
          <Route element={<LandingPage />} path="/" />
          <Route
            element={
              <Suspense fallback={<Loading />}>
                <InsightsPage />
              </Suspense>
            }
            path="/insights"
          />
        </Routes>
      </Router>
    </RecallProvider>
  );
}

export default App;
