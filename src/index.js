import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import './index.css';
import App from './App';
import actionCable from 'actioncable'
import registerServiceWorker from './registerServiceWorker';

// console.log('actionCable', actionCable)

const AppCable = {}

AppCable.cable = actionCable.createConsumer('ws://localhost:3000/cable')

// console.log('AppCable', AppCable)


ReactDOM.render(<Router><App AppCable={AppCable}/></Router>, document.getElementById('root'));
