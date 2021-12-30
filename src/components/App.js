import React from "react";
import { Route, Switch } from "react-router-dom";
import HomePage from "./home/HomePage";
import AboutPage from "./about/AboutPage";
import Header from "./common/Header";
import PageNotFound from "./common/PageNotFound";
import Tomatoes from "./tomato/TomatoesPage";
import Contexts from "./context/ContextsPage";
import ContextsEdit from "./context/ContextsEdit";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <div className="container-fluid">
      <Header />
      <Switch>
        <Route exact path="/" component={HomePage}></Route>
        <Route path="/about" component={AboutPage}></Route>
        <Route path="/tomatoes" component={Tomatoes}></Route>
        <Route path="/contexts/:id" component={ContextsEdit}></Route>
        <Route path="/contexts" component={Contexts}></Route>
        <Route component={PageNotFound}></Route>
      </Switch>
      <ToastContainer autoClose={3000} hideProgressBar></ToastContainer>
    </div>
  );
}

export default App;
