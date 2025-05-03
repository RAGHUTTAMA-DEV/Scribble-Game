import { useEffect,useState } from 'react';
import './App.css';
import { socket } from './socket';

function App() {
  const [message, setMessage] = useState('');
  function Onclick(){
  
    socket.on('message', (message: string) => {
      console.log('Message from server:', message);
      setMessage(message);
    });
  }
  useEffect(() => {
    // Connect once on mount
    socket.connect();

    // Setup event listeners
    socket.on('connect', () => {
      console.log('Connected to server');
    });

    socket.on('disconnect', () => {
      console.log('Disconnected from server');
    });

    socket.on('message', (message: string) => {
      console.log('Message from server:', message);
      socket.emit('message', 'Hello from client!');
      setMessage(message);
    });

    // Cleanup on unmount
    return () => {
      socket.off('connect');
      socket.off('disconnect');
      socket.off('message');
      socket.disconnect();
    };
  }, []);

  // Send a message to the server when the client connects (optional)
  useEffect(() => {
    if (socket.connected) {
      socket.emit('message', 'Hello from React client!');
    }
  }, [socket.connected]);

  return (
    <div className="App">
      <h1>Socket.IO with React + TypeScript</h1>
      <button onClick={() => socket.emit('message', 'Hi Servereee')}>
  Send to Server
</button>

       

      <p>Message from server: {message}</p>
    </div>
  );
}

export default App;


