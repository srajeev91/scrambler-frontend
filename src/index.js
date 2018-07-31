import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import './index.css';
import App from './App';
import { ActionCableProvider } from 'react-actioncable-provider'
import registerServiceWorker from './registerServiceWorker';

// console.log('actionCable', actionCable)

// const AppCable = {}
//
// AppCable.cable = actionCable.createConsumer('ws://localhost:3000/cable')

// console.log('AppCable', AppCable)


ReactDOM.render(<ActionCableProvider url={'ws://localhost:3000/cable'}><Router><App/></Router></ActionCableProvider>, document.getElementById('root'));
