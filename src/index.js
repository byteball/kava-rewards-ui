import {
  Routes,
  Route,
  unstable_HistoryRouter as HistoryRouter,
} from "react-router-dom";
import React from 'react';
import ReactDOM from 'react-dom/client';
import ga4 from "react-ga4";

import './index.css';

import { MainPage } from "pages";

import { historyInstance } from "historyInstance";

import appConfig from "appConfig";

const root = ReactDOM.createRoot(document.getElementById('root'));

if (appConfig.GA_MEASUREMENT_ID) {
	console.log('log: GA inited');
	ga4.initialize(appConfig.GA_MEASUREMENT_ID);
}

root.render(
  <React.StrictMode>
    <HistoryRouter history={historyInstance}>
      <Routes>
        <Route path="/:period?" element={<MainPage />} />
      </Routes>
    </HistoryRouter>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
