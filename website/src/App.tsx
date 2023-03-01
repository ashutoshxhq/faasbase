import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Layout from './Layout'
import Login from './pages/AuthN/Login'
import LoginCallback from './pages/AuthN/LoginCallback'
import Home from './pages/Home/Home'
import PrivacyPolicy from './pages/Legal/PrivacyPolicy'
import TermsOfService from './pages/Legal/TermsOfService'

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/auth/login" element={<Login />} />
          <Route path="/auth/callback" element={<LoginCallback />} />
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="legal/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="legal/terms-of-service" element={<TermsOfService />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App
