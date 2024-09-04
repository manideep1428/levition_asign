import { Route, Routes } from 'react-router-dom'
import LoginForm from './pages/LoginFrom'
import RegisterPage from './pages/RegisterForm'
import { SubmissionTablePage } from './pages/Submissions'
import StepperComponent from './pages/StepperForm'

function App() {
  return (
    <>
      <Routes>
      <Route path="/" element={<LoginForm />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/stepper-form" element={<StepperComponent />} />
      <Route path="/test" element={<StepperComponent/>} />
      <Route path="/submissions" element={<SubmissionTablePage/>} />
      </Routes>
    </>
  )
}

export default App