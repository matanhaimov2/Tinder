import React, {useEffect, useState} from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Main CSS
import './App.css';

// Pages
import Landing from './Pages/Landing/landing';
import Login from './Pages/Login/login';
import Register from './Pages/Register/register';
import Home from './Pages/Home/home';

// Components
import TopNav from './Components/TopNav/topnav';

// Services
import { healthCheck } from './Services/administrationService';

// Functions
function landing() {
  return <Landing />;
}

function login() {
  return <Login />;
}

function register() {
  return <Register />;
}

function home() {
  return <Home />;
}


// For Components With Topnav
const ComponentsWithNav = () => {
  return (
    <div className='com-with-nav-wrapper'>

      <div className='com-wrapper'>
        <div className='com-with-nav'>
          <TopNav />
        </div>

        <div className='com-with-nav-item'>
          <Routes>
            <Route path='/' element={landing()} />
          </Routes>
        </div>
      </div>

      {/* <div className='com-with-footer'>
        <Footer />
      </div> */}
    </div>
  );
}

// For Pages that are private
const PrivateRoutes = () => {

  const [isLoggedIn, setIsLoggedIn] = useState(true);

  useEffect(() => {
    const checkAuthentication = async () => {
      // setIsLoggedIn(await isAuthenticated())
    }

    checkAuthentication()
  })

  return (
    <div className='private-routes'>
      {isLoggedIn ? (
        <Routes>
          <Route path="/home" element={home()} />
        </Routes>
      ) : (
        <Navigate to="/login" />
      )}
    </div>
  );
};

// Main Function
function App() {

  // Health check to see if back is alive
  useEffect(() => {
    const healthChecker = async () => {
      let res = await healthCheck();

      if (!res && window.location.pathname !== '/sitenotfound') {
        window.location.href = '/sitenotfound';
      }
    }

    // healthChecker();
  }, [])

  return (
    <div className="outer-wrapper">
      <div className='wrapper'>
        <Router>
          <Routes>
            {/* Routes With Topnav */}
            <Route path='/' element={<ComponentsWithNav />} />

            <Route path='/login' element={login()} />
            <Route path='/register' element={register()} />

            {/* Private Routes */}
            <Route path='/*' element={ <PrivateRoutes /> } />

            {/* Backend Disabled */}
            <Route path='/sitenotfound' element={<div>site is under constarction</div>} />

            {/* Page Doesnt Exists */}
            <Route path='/*' element={<div>404 doesnt exists</div>} />
          </Routes>

        </Router>
      </div>
    </div>
  );
}

export default App;
