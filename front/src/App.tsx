import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { TokenManagement } from './Hooks/useTokenManagement';

// Main CSS
import './App.css';

// Pages
import Landing from './Pages/Landing/landing';
import Home from './Pages/Home/home';
import SetProfile from './Pages/SetProfile/setprofile';

// Components
import TopNav from './Components/TopNav/topnav';

// Services
import { healthCheck } from './Services/administrationService';

// Functions
function landing() {
  return <Landing />;
}

function home() {
  return <Home />;
}

function setprofile() {
  return <SetProfile />;
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
          <Route path="/setprofile" element={setprofile()} />
        </Routes>
      ) : (
        <Navigate to="/" />
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

  // load google maps api script to an head
  useEffect(() => {
    const loadGoogleMapsScript = () => {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.REACT_APP_GOOGLE_API_KEY}&libraries=places&callback=initMap`;
      script.async = true;
      script.defer = true;
      document.head.appendChild(script);
    };

    loadGoogleMapsScript();
  }, []);


  return (
    <div className='wrapper'>
      <Router>
        {/* <TokenManagement /> */}

        <Routes> 
          {/* Routes With Topnav */}
          <Route path='/' element={<ComponentsWithNav />} />

          {/* Private Routes */}
          <Route path='/*' element={<PrivateRoutes />} />

          {/* Backend Disabled */}
          <Route path='/sitenotfound' element={<div>site is under constarction</div>} />

          {/* Page Doesnt Exists */}
          <Route path='/*' element={<div>404 doesnt exists</div>} />
        </Routes>

      </Router>
    </div>
  );
}

export default App;
