import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Main CSS
import './App.css';

// Redux
import store, { persistor } from './Redux/store'
import { PersistGate } from 'redux-persist/integration/react';
import { Provider } from 'react-redux'
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from './Redux/store';
import { setIsLoggedIn } from './Redux/features/authSlice';

// Pages
import Landing from './Pages/Landing/landing';
import Home from './Pages/Home/home';
import SetProfile from './Pages/SetProfile/setprofile';

// Components
import TopNav from './Components/TopNav/topnav';
import PersistLogin from './Components/PersistLogin';

// Hooks
import useAxiosPrivate from "./Hooks/usePrivate"

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
  const dispatch = useDispatch<AppDispatch>();
  const isLoggedIn = useSelector((state: RootState) => state.auth.isLoggedIn);
  const axiosPrivateInstance = useAxiosPrivate()

  useEffect(() => {
    const checkAuthentication = async () => {
      try {
        const { data } = await axiosPrivateInstance.get('users/verify/')
        dispatch(setIsLoggedIn(true));

        // console.log(data)

      } catch (error:any) {
        dispatch(setIsLoggedIn(false));
      }
    }

    checkAuthentication()
  }, [dispatch])

  return (
    <div className='private-routes'>
      {isLoggedIn ? (
        <Routes>
          <Route path='/' element={<PersistLogin />}>
            <Route path="/home" element={home()} />
            <Route path="/setprofile" element={setprofile()} />
            
            {/* Page Doesnt Exists */}
            <Route path='*' element={<div>404 doesnt exists</div>} />
          </Route>
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

    healthChecker();
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
    <Provider store={store}>
      <PersistGate loading={<div>Loading...</div>} persistor={persistor}>
      <div className='wrapper'>
        <Router>
          <Routes> 
            {/* Routes With Topnav */}
            <Route path='/' element={<ComponentsWithNav />} />

            {/* Private Routes */}
            <Route path='/*' element={<PrivateRoutes />} />

            {/* Backend Disabled */}
            <Route path='/sitenotfound' element={<div>site is under constarction</div>} />

            {/* Page Doesnt Exists */}
            <Route path='*' element={<div>404 doesnt exists</div>} />
          </Routes>

        </Router>
      </div>
      </PersistGate>
    </Provider>

  );
}

export default App;
