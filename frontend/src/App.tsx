import { Route, Routes, useNavigate } from 'react-router-dom'
import LoginForm from './pages/LoginFrom'
import RegisterPage from './pages/RegisterForm'
import { SubmissionTablePage } from './pages/Submissions'
import StepperComponent from './pages/StepperForm'
import { useEffect } from 'react'

function App() {
  const navigate  = useNavigate();
  
  useEffect(() => {
      navigate("/login")
  })

  return (
    <>
      <Routes>
      <Route path="/login" element={<LoginForm />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/stepper-form" element={<StepperComponent />} />
      <Route path="/test" element={<StepperComponent/>} />
      <Route path="/submissions" element={<SubmissionTablePage/>} />
      </Routes>
    </>
  )
}

export default App