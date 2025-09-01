import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Landing from './routes/landing/landing';
import JoinRoom from './routes/joinRoom/JoinRoom';
import Room from './routes/room/Room';
import SocketWrapper from './components/SocketWrapper';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Landing page as the home route */}
        <Route path="/" element={<Landing />} />
        
        {/* Join/Create Room page */}
        <Route path="/join" element={<JoinRoom />} />
        
        {/* Room page with socket wrapper */}
        <Route 
          path="/room/:roomId" 
          element={
            <SocketWrapper>
              <Room />
            </SocketWrapper>
          } 
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;