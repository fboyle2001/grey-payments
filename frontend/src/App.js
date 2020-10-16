import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';

import LoginPage from './components/pages/LoginPage';

import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <div>
          <Route exact path="/login" component={LoginPage} />
        </div>
      </div>
    </Router>
  );
}

export default App;
