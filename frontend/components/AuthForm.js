import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

export default function AuthForm() {
  const navigate = useNavigate()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')


  const handleUsernameChange = (event) => {
    setUsername(event.target.value)
  }
  const handlePasswordChange = (event) => {
    setPassword(event.target.value)
  }
  const handleSubmit = async (event) => {
    event.preventDefault() //prevent default behaviour
     setError('')         //clear any old errors and get the try catch going
     try {
        const {data} = await axios.post( //argument passed: endpoint path & credentials, username and password obtained from component state. 
          '/api/auth/login',
          {username, password}//because we're using axios, we don't need to turn these to actual JSON
        )
        localStorage.setItem('token', data.token)//after retrieving the data, call local storage, set key'token' and the value which comes from data.token
        navigate('/cereals')
     } catch (err) {
      setError(
      err?.response?.data?.message ||
      'An error occurred. Please try again '
    )
     }
    //post username and password to the login endpoint 
    //if fail, set error message in state so that it renders to the jsx
  //if ok,
  // 1. save token to local storage
  // 2. redirect the user to the cereals route 

  }

  return (
    <div className="container">
      <div aria-live="polite"></div>
      <div aria-live="assertive" style={{ color: 'red' }}>{error}</div>
      <h3>Login Form</h3>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            name="username"
            value={username}
            onChange={handleUsernameChange}
            required
          />
        </div>
        <div>
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            name="password"
            value={password}
            onChange={handlePasswordChange}
            required
          />
        </div>
        <button type="submit">Login</button>
      </form>
    </div>
  )
}
