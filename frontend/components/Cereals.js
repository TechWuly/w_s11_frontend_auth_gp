import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'


export default function Cereals() {
  const [cereals, setCereals] = useState([])
  const navigate = useNavigate()

  const logout = () => {
   //wipe the token from local storage
   localStorage.removeItem('token')
   //redirecting the user back to login. How do we keep the user in the login screen after logging out? we'll need an effect that fires after first render.
   navigate('/')
  }

  useEffect(() => {
    //grab token from local storage
    const token = localStorage.getItem('token')
    //if not there navigate user back to login
    if(!token) {
      navigate('/')
    } else {
      const fetchCereals = async () => {
       try {
         const response = await axios.get(
          '/api/cereals',
          {headers:{Authorization:token}}
        )
        setCereals(response.data)//wrap up the happy path by setting response.data inside component state
       } catch (error){  //Now if the promise rejects because the response comes with a 401 unAuthorized, specifically we want to flush the stale token from local storage and kick the user back to the auth screen.
        if (error?.response?.status == 401) logout() //logging out don't require any request to the server, it's like a frontend operation only
        }
        //GET cereals, appending token to authorization header
        //if response is a 401 unauthorized perform a logout
        //if response is ok set the in component state so that they render 
      }
      fetchCereals()
    }
  }, []) 

  return (
    <div className="container">
      <h3>Cereals List <button onClick={logout}>Logout</button></h3>
      {cereals.length > 0 ? (
        <div>
          {cereals.map((cereal) => (
            <div key={cereal.id} style={{ marginBottom: '20px' }} className="cereal">
              <h4>{cereal.name}</h4>
              <p>Brand: {cereal.brand}</p>
              <p>Sugar content: {cereal.sugarContent}</p>
              <p>{cereal.history}</p>
            </div>
          ))}
        </div>
      ) : (
        <p>No cereals found.</p>
      )}
    </div>
  )
}
