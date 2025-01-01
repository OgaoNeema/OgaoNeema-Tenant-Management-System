import { Route, Routes } from 'react-router-dom';
import './App.css';
import { Dashboard } from './pages';
import SignInPage from "./pages/Auth/Login/SignInPage";
import HowItWorks from "./pages/HowItWorks";
import UserTypeSelection from "./pages/UserTypeSelection";
import LandingPage from "./pages/LandingPage";
import LogoutPage from "./pages/LogoutPage";
import ResetPasswordForm from "./pages/ResetPasswordForm";
// import DashboardLayout from "./pages/DashboardLayout";
import MessageDashboard from "./pages/MessageDashboard";
import Settings from "./pages/Settings";
import SuccessModal from "./pages/SuccessModal";
import MaintenanceDashboard from "./pages/MaintenanceDashboard";
import MaintenanceDescription from "./pages/MaintenanceDescription";
import PaymentTenant from "./pages/PaymentTenant";
import TermsAndDocs from "./pages/TermsAndDocs";
import { useDispatch } from 'react-redux';
import { checkIsLoggedIn } from './redux/ActionCreators/authActionsCreator';
import { useEffect } from 'react';
import ReportMaintenance from './pages/Maintenance/ReportMaintenance'
import TenantDashboard from './pages/Dashboard/TenantDashboard';
import SignUpPage from './pages/Auth/SignUp/SignUpPage';
import SendAlert from './pages/Notices';

const App = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(checkIsLoggedIn());
  }, [dispatch]);

  return (
    <div className="App">
      <Routes>
        {/* <Route path="/" element={<HomePage />} /> */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/Dashboard" element={<Dashboard />} />
        <Route path="/Login" element={<SignInPage />} />
        <Route path="/SignUp" element={<SignUpPage/>} />
        <Route path="/ResetPasswordForm" element={<ResetPasswordForm />} />
        <Route path="/HowItWorks" element={<HowItWorks />} />
        <Route path="/UserTypeSelection" element={<UserTypeSelection />} />
        <Route path="/LandingPage" element={<LandingPage />} />
        <Route path="/LogoutPage" element={<LogoutPage />} />
        <Route path="/DashboardTenant" element={<TenantDashboard />} />
        <Route path="/MessageTenant" element={<MessageDashboard/>} />
        <Route path="/Settings" element={<Settings/>} />
        <Route path="/ResetSuccess" element={<SuccessModal/>} />
        <Route path="/MaintenanceDashboard" element={<MaintenanceDashboard/>} />
        <Route path="/MaintenanceDescription" element={<MaintenanceDescription/>} />
        <Route path="/PaymentTenant" element={<PaymentTenant/>} />
        <Route path="/TermsAndDocs" element={<TermsAndDocs/>} />
        <Route path='/Report Issue' element={<ReportMaintenance/>}/> 
        <Route path='/Send Alert' element={<SendAlert/>} />
        <Route path='/Tenant Dashboard' element={<TenantDashboard/>}/> 
        <Route path='/Access Denied' element={<accessDenied/>}/> 

      </Routes>
    </div>
  );
};

export default App;
