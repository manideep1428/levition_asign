import { BrowserRouter, Route, Routes } from 'react-router-dom'
import LoginForm from './pages/LoginFrom'
import RegisterPage from './pages/RegisterForm'
import { SubmissionTablePage } from './pages/Submissions'
import StepperComponent from './pages/StepperForm'
import { Toaster } from './components/ui/toaster'


function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LoginForm />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/stepper-form" element={<StepperComponent />} />
          <Route path="/test" element={<StepperComponent/>} />
          <Route path="/submissions" element={<SubmissionTablePage/>} />
        </Routes>
      </BrowserRouter>
      <Toaster /> 
    </>
  )
}

export default App