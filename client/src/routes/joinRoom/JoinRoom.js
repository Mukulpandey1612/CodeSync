import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4, validate } from 'uuid';
import { Toaster, toast } from 'react-hot-toast';
import './JoinRoom.css';

export default function JoinRoom() {
    const navigate = useNavigate();
    const [roomId, setRoomId] = useState("");
    const [username, setUsername] = useState("");

    const handleCreateRoom = (e) => {
        e.preventDefault();
        // If a Room ID is already entered, guide the user to join instead.
        if (roomId.trim()) {
            toast.error("You have entered a Room ID. Please click 'Join Room' instead.");
            return;
        }

        if (!username.trim() || username.trim().length < 2) {
            toast.error("Please enter a username (at least 2 characters) first.");
            return;
        }
        const newRoomId = uuidv4();
        sessionStorage.setItem('username', username.trim());
        toast.success("New room created!");
        navigate(`/room/${newRoomId}`, {
            state: { username: username.trim() },
        });
    };

    const handleJoinRoom = (e) => {
        e.preventDefault();
        if (!validate(roomId.trim())) {
            toast.error("Invalid Room ID format.");
            return;
        }
        if (!username.trim() || username.trim().length < 2) {
            toast.error("Please enter a username (at least 2 characters).");
            return;
        }
        sessionStorage.setItem('username', username.trim());
        navigate(`/room/${roomId.trim()}`, {
            state: { username: username.trim() },
        });
    };

    return (
        <div className="homePageWrapper">
            <header className="header">
                <h1>&lt;CodeSync&gt;</h1>
                <p>Real-time collaborative coding platform</p>
            </header>

            
            <section className="formContainer">
                <div className="formHeader">
                    <h2>Join or Create a Room</h2>
                </div>
                
                <div className="inputGroup">
                    <input
                        type="text"
                        className="inputBox"
                        placeholder="Enter your username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                    <input
                        type="text"
                        className="inputBox"
                        placeholder="Enter Room ID (optional)"
                        value={roomId}
                        onChange={(e) => setRoomId(e.target.value)}
                    />
                </div>
                
                <div className="btnGroup">
                    <button className="btn joinBtn" onClick={handleJoinRoom}>
                        Join Room
                    </button>
                    <button className="btn createRoomBtn" onClick={handleCreateRoom}>
                        Create Room
                    </button>
                </div>
            </section>

            <Toaster position="top-center" />
        </div>
    );
}
