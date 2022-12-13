/* eslint-disable jsx-a11y/anchor-is-valid */
import { useEffect, useState } from "react";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "./App.css";
import Swal from "sweetalert2";
import Snowfall from "react-snowfall";
import Loading from "./Loading";
import "react-lazy-load-image-component/src/effects/blur.css";

const apiURL = "https://api.apispreadsheets.com/data/NgI8dqq84Jv0OAYp/";
const shortToast = Swal.mixin({
  toast: true,
  position: "top-right",
  timer: "2000",
  showConfirmButton: false,
});

const randomCardURL = () => {
  const randomNum = Math.floor(Math.random() * 100 + 1);
  if (randomNum % 2 === 0) {
    return "/card1.png";
  } else {
    return "/card2.png";
  }
};

const SUBMIT_STATUS = {
  none: 0,
  pending: 1,
  success: 2,
};

function App() {
  const [name, setName] = useState("");
  const [submitStatus, setSubmitStatus] = useState(SUBMIT_STATUS.none);
  const [lcStatus, setlcStatus] = useState(SUBMIT_STATUS.none);

  const [url] = useState(randomCardURL());

  useEffect(() => {
    const lcSmTt = localStorage.getItem("sm_tt");
    if (lcSmTt) {
      setlcStatus(parseInt(lcSmTt));
    } else {
      setlcStatus(SUBMIT_STATUS.none);
    }
  }, []);

  const successAction = () => {
    localStorage.setItem("sm_tt", 2);
    setSubmitStatus(SUBMIT_STATUS.success);
    setlcStatus(SUBMIT_STATUS.success);
  };

  const failAction = () => {
    localStorage.setItem("sm_tt", 0);
    setSubmitStatus(SUBMIT_STATUS.none);
    setlcStatus(SUBMIT_STATUS.none);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitStatus(SUBMIT_STATUS.pending);
    const data = { Name: name, Created_at: new Date().toLocaleString() };
    fetch(apiURL, {
      method: "POST",
      body: JSON.stringify({ data }),
    }).then((res) => {
      if (res.status === 201) {
        successAction();
        shortToast.fire(
          "Success! Your submission has been saved! ",
          "",
          "success"
        );
      } else {
        failAction();
        shortToast.fire("An unexpected error occurred", "", "error");
      }
    });
  };

  const isDisabled = submitStatus !== SUBMIT_STATUS.none;

  return (
    <div className="app">
      <img src="/logo-exe.svg" alt="logo executionlab" className="logo-te" />
      <Snowfall />
      {lcStatus === SUBMIT_STATUS.none ? (
        <div className="app-form">
          <form onSubmit={handleSubmit}>
            <div className="text-field">
              <label htmlFor="name">Your name</label>
              <input
                type="text"
                id="name"
                placeholder="Enter your name"
                autoComplete="off"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="button" disabled={isDisabled}>
              Submit
            </button>
            {submitStatus === SUBMIT_STATUS.pending && (
              <div className="loading">
                <Loading />
              </div>
            )}
          </form>
        </div>
      ) : (
        <div className="submitted">
          <h2>Your submission has been saved!</h2>
          <button className="button" onClick={failAction}>
            Resubmit
          </button>
        </div>
      )}
      <div className="christmas-card-wrapper">
        <LazyLoadImage
          alt="card christmas"
          height="auto"
          src={url}
          width="100%"
          effect="blur"
        />
      </div>
    </div>
  );
}

export default App;
