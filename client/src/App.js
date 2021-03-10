import React, { useEffect } from 'react';
import { HashRouter as Router, Route, Switch } from 'react-router-dom';

import 'materialize-css';
import 'materialize-css/dist/css/materialize.min.css';
import M from 'materialize-css/dist/js/materialize.min.js';

import ErrorCatcher from './components/ErrorCatcher';

import Header from './components/Header';
import Footer from './components/Footer';

import HomeScreen from './components/screens/HomeScreen';
import PlacesScreen from './components/screens/PlacesScreen/PlacesScreen';
import ListScreen from './components/screens/ListScreen';
import PlaceScreen from './components/screens/PlaceScreen/PlaceScreen';
import ProfileScreen from './components/screens/ProfileScreen/ProfileScreen';
import ErrorScreen from './components/screens/ErrorScreen';

import Login from './components/forms/auth/Login';
import Register from './components/forms/auth/Register';
import EditProfile from './components/forms/auth/EditProfile';
import ForgotPassword from './components/forms/auth/ForgotPassword';
import ChangePassword from './components/forms/auth/ChangePassword';
import ResetPassword from './components/forms/auth/ResetPassword';

import AddPlace from './components/forms/place/AddPlace';
import EditPlace from './components/forms/place/EditPlace';
import AddCleaning from './components/forms/cleaning/AddCleaning';
import EditCleaning from './components/forms/cleaning/EditCleaning';

const App = () => {
  useEffect(() => {
    // Initialize Materialize
    M.AutoInit();
  });

  return (
    <>
      <Router>
        <ErrorCatcher>
          <Route path='/' exact>
            <HomeScreen />
          </Route>
          <Route path='/error' exact>
            <ErrorScreen />
          </Route>

          {/* AUTH ROUTES  */}
          <Route path='/login' exact>
            <Header />
            <Login />
          </Route>
          <Route path='/register' exact>
            <Header />
            <Register />
          </Route>
          <Route path='/forgotPassword' exact>
            <Header />
            <ForgotPassword />
          </Route>
          <Route path='/changePassword' exact>
            <Header />
            <ChangePassword />
          </Route>
          <Route path='/resetPassword/:slug' exact>
            <Header />
            <ResetPassword />
          </Route>

          {/* PLACES ROUTES */}
          <Route path='/places' exact>
            <Header />
            <PlacesScreen />
          </Route>
          <Route path='/addPlace' exact>
            <Header />
            <AddPlace />
          </Route>
          <Route path='/places/list/:slug' exact>
            <Header />
            <ListScreen />
          </Route>
          <Route path='/places/edit/:id' exact>
            <Header />
            <EditPlace />
          </Route>
          <Route path='/places/:id' exact>
            <Header />
            <PlaceScreen />
          </Route>
          <Route path='/clean/edit/:id' exact>
            <Header />
            <EditCleaning />
          </Route>
          <Route path='/clean/:id' exact>
            <Header />
            <AddCleaning />
          </Route>

          {/* PROFILE ROUTES  */}
          <Route path='/editProfile' exact>
            <Header />
            <EditProfile />
          </Route>
          <Route path='/users/:id' exact>
            <Header />
            <ProfileScreen />
          </Route>

          {/* NOT FOUND */}
          {/* <Route component={ErrorScreen} /> */}
        </ErrorCatcher>
      </Router>
      <Footer />
    </>
  );
};

export default App;
