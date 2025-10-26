import { useState } from 'react'
import './App.css'
import { GoogleOAuthProvider } from '@react-oauth/google'
import AppRoute from './AppRoute'
function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <GoogleOAuthProvider clientId="919886091004-mdne53v66e3dl718f835g3cn7aj8mb79.apps.googleusercontent.com">
          <AppRoute />
      </GoogleOAuthProvider>
    </>
  )
}

export default App
