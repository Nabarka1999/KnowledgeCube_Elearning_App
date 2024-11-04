import React from 'react';
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { UserContextProvider } from './context/UserContext.jsx';
import { CourseContextProvider } from './context/CourseContext.jsx';

export const server = 'https://knowledgecube-server.onrender.com'


// "https://4af9-103-102-117-125.ngrok-free.app"

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <UserContextProvider>
      <CourseContextProvider>
        <App />
      </CourseContextProvider>
    </UserContextProvider>
  </React.StrictMode>,
)
