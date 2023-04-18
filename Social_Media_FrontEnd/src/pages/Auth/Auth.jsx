import React, { useState } from "react";
import './Auth.css';
import Logo from '../../img/logo.png';
import { useDispatch } from 'react-redux';
import { logIn, signUp } from "../../actions/AuthAction";
import { useSelector } from "react-redux";

const Auth = () =>
{
  const dispatch = useDispatch();
  const loading = useSelector((state) => state.authReducer.loading);

  const [isSignup, setIsSignUp] = useState(true);
  console.log(loading);

  const [data, setData] = useState({ firstname: "", lastname: "", password: "", confirmpass: "", username: "" });

  const [confirmPass, setConfirmPass] = useState(true);

  const handleChange = (e) =>
  {
    setData({ ...data, [e.target.name]: e.target.value })
  }


  const handleSubmit = (e) =>
  {
    e.preventDefault();

    if (isSignup) {
      data.password === data.confirmpass ? dispatch(signUp(data)) : setConfirmPass(false);
    } else {
      dispatch(logIn(data));
    }
  }

  const resetForm = () =>
  {
    setConfirmPass(true);
    setData({ firstname: "", lastname: "", password: "", confirmpass: "", username: "" });
  }

  return (

    <div className="Auth">


      {/* Left side */}

      <div className="a-left">
        <img src={Logo} alt="" />
        <div className="Webname">
          <h1>Social Media</h1>
          <h6>Explore the social media</h6>
        </div>
      </div>

      {/* Right Side */}

      <div className="a-right">
        <form className="infoForm authForm" onSubmit={handleSubmit}>

          <h3>{isSignup ? "Sign up" : "Log In"}</h3>

          {isSignup && (
            <div>
              <input type="text" placeholder="First Name"
                className="infoInput" name="firstname" value={data.firstname}
                onChange={handleChange}
              />

              <input type="text" placeholder="Last Name" value={data.lastname}
                className="infoInput" name="lastname"
                onChange={handleChange} />
            </div>
          )}


          <div>
            <input type="text" className="infoInput" name="username" value={data.username}
              placeholder="Usernames"
              onChange={handleChange} />
          </div>

          <div>
            <input type="password" className="infoInput" name="password" value={data.password}
              placeholder="Password"
              onChange={handleChange} />


            {isSignup &&
              <input type="password" className="infoInput" name="confirmpass" value={data.confirmpass}
                placeholder="Confirm Password"
                onChange={handleChange} />
            }

          </div>

          <span style={{ display: confirmPass ? "none" : "block", color: 'red', fontSize: '12px', alignSelf: "flex-end", marginRight: "5px" }}>
            Confirm Password is not same
          </span>

          <div>
            <span style={{ fontSize: '12px', cursor: "pointer" }} onClick={() => { setIsSignUp((prev) => !prev); resetForm() }}>
              {isSignup ? "Already have an account. Login!" : "Don't have an account? Sign Up"}
            </span>
          </div>

          <button className="button infoButton" type="submit" disabled={loading}>
            {loading ? "Lodading..." : isSignup ? "Sign up" : "Log In"}
          </button>

        </form>
      </div >

    </div >
  )
}



export default Auth;