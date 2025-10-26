import { useState } from 'react'
import './App.css'
import { GoogleOAuthProvider } from '@react-oauth/google'
import AppRoute from './AppRoute'
function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <GoogleOAuthProvider clientId="YOUR_GOOGLE_CLIENT_ID">
        {/* <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-secondary/20 flex items-center justify-center p-4">
        <div className="w-full max-w-md"> */}
          <AppRoute />
        {/* </div>
        </div> */}
      </GoogleOAuthProvider>
    </>
  )
}

export default App
