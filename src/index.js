import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { MainRouter } from "./router/router";
import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(<App />, document.getElementById('root'));
registerServiceWorker();
