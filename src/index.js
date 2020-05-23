import React from 'react'
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import App from './App';

// Require Sass file so webpack can build it
import 'bootstrap/dist/css/bootstrap.css';
import'./styles/style.css';

ReactDOM.render(<BrowserRouter><App /></BrowserRouter>, document.getElementById('root'));