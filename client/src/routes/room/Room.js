import { useEffect, useState, useCallback, useRef, useMemo } from "react";
import AceEditor from "react-ace";
import { Toaster, toast } from 'react-hot-toast';
import { useNavigate } from "react-router-dom";
import { generateColor } from "../../utils";
import './Room.css';
import { useSocket } from '../../components/SocketWrapper';

// Ace Editor imports
import "ace-builds/src-noconflict/mode-javascript";
import "ace-builds/src-noconflict/mode-typescript";
import "ace-builds/src-noconflict/mode-python";
import "ace-builds/src-noconflict/mode-java";
import "ace-builds/src-noconflict/mode-golang";
import "ace-builds/src-noconflict/mode-c_cpp";
import "ace-builds/src-noconflict/keybinding-emacs";
import "ace-builds/src-noconflict/keybinding-vim";
import "ace-builds/src-noconflict/theme-monokai";
import "ace-builds/src-noconflict/ext-language_tools";
import "ace-builds/src-noconflict/ext-searchbox";

// Simple Custom Dropdown Component
const SimpleDropdown = ({ label, options, value, onChange, id }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [focusedIndex, setFocusedIndex] = useState(-1);
    const dropdownRef = useRef(null);
    const buttonRef = useRef(null);

    const selectedOption = options.find(opt => opt.value === value) || options[0];

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
                setFocusedIndex(-1);
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen]);

    const handleToggle = () => {
        setIsOpen(!isOpen);
        setFocusedIndex(-1);
    };

    const handleSelect = (option) => {
        onChange(option.value);
        setIsOpen(false);
        setFocusedIndex(-1);
        buttonRef.current?.focus();
    };

    const handleKeyDown = (e) => {
        if (!isOpen) {
            if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowDown') {
                e.preventDefault();
                setIsOpen(true);
                setFocusedIndex(0);
            }
            return;
        }

        switch (e.key) {
            case 'Escape':
                e.preventDefault();
                setIsOpen(false);
                setFocusedIndex(-1);
                buttonRef.current?.focus();
                break;
            case 'ArrowDown':
                e.preventDefault();
                setFocusedIndex(prev => (prev + 1) % options.length);
                break;
            case 'ArrowUp':
                e.preventDefault();
                setFocusedIndex(prev => prev <= 0 ? options.length - 1 : prev - 1);
                break;
            case 'Enter':
            case ' ':
                e.preventDefault();
                if (focusedIndex >= 0) {
                    handleSelect(options[focusedIndex]);
                }
                break;
            default:
                break;
        }
    };

    return (
        <div className="dropdown-container">
            <label className="dropdown-label">{label}</label>
            <div ref={dropdownRef} className="simple-dropdown">
                <button
                    ref={buttonRef}
                    type="button"
                    className="dropdown-button"
                    onClick={handleToggle}
                    onKeyDown={handleKeyDown}
                    aria-expanded={isOpen}
                    aria-haspopup="listbox"
                >
                    <span>{selectedOption.label}</span>
                    <span className={`dropdown-arrow ${isOpen ? 'open' : ''}`}>▼</span>
                </button>
                
                {isOpen && (
                    <ul className="dropdown-menu" role="listbox">
                        {options.map((option, index) => (
                            <li
                                key={option.value}
                                className={`dropdown-item ${
                                    selectedOption.value === option.value ? 'selected' : ''
                                } ${focusedIndex === index ? 'focused' : ''}`}
                                onClick={() => handleSelect(option)}
                                role="option"
                                aria-selected={selectedOption.value === option.value}
                            >
                                {option.label}
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
};

export default function Room() {
    const { socket, isConnected, username, roomId } = useSocket();
    const navigate = useNavigate();
    const editorRef = useRef(null);

    // Component states
    const [fetchedUsers, setFetchedUsers] = useState([]);
    const [fetchedCode, setFetchedCode] = useState("");
    const [language, setLanguage] = useState("javascript");
    const [codeKeybinding, setCodeKeybinding] = useState("default");
    const [output, setOutput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [aiResponse, setAiResponse] = useState("");
    const [isAiLoading, setIsAiLoading] = useState(false);
    const [typingUsers, setTypingUsers] = useState([]);
    const typingTimeoutRef = useRef(null);

    // Memoized options to prevent unnecessary re-renders
    const languageOptions = useMemo(() => [
        { value: "javascript", label: "JavaScript" },
        { value: "typescript", label: "TypeScript" },
        { value: "python", label: "Python" },
        { value: "java", label: "Java" },
        { value: "c_cpp", label: "C++" },
        { value: "golang", label: "Golang" }
    ], []);

    const keybindingOptions = useMemo(() => [
        { value: "default", label: "Default" },
        { value: "emacs", label: "Emacs" },
        { value: "vim", label: "Vim" }
    ], []);

    // Code change handler with typing indicators
    const onChange = useCallback((newValue) => {
        if (socket) {
            setFetchedCode(newValue);
            socket.emit("update code", { roomId, code: newValue });
        }
        
        if (socket && username) {
            if (typingTimeoutRef.current) {
                clearTimeout(typingTimeoutRef.current);
            } else {
                socket.emit('typing-start', { roomId, username });
            }
            
            typingTimeoutRef.current = setTimeout(() => {
                socket.emit('typing-stop', { roomId, username });
                typingTimeoutRef.current = null;
            }, 1500);
        }
    }, [socket, roomId, username]);

    // Language change handler
    const handleLanguageChange = useCallback((newLanguage) => {
        setLanguage(newLanguage);
        if (socket) {
            socket.emit("update language", { roomId, languageUsed: newLanguage });
        }
    }, [socket, roomId]);

    // Keybinding change handler
    const handleCodeKeybindingChange = useCallback((value) => {
        setCodeKeybinding(value);
    }, []);

    // Leave room handler
    const handleLeave = useCallback(() => {
        if (typingTimeoutRef.current) {
            clearTimeout(typingTimeoutRef.current);
        }
        sessionStorage.removeItem('username');
        if (socket) {
            socket.emit("leave room", { roomId });
        }
        navigate('/', { replace: true, state: {} });
    }, [socket, roomId, navigate]);

    // Copy room ID to clipboard
    const copyToClipboard = useCallback(async () => {
        if (!roomId) return;
        try {
            await navigator.clipboard.writeText(roomId);
            toast.success('Room ID copied to clipboard');
        } catch (error) {
            console.error('Clipboard error:', error);
            toast.error('Failed to copy room ID');
        }
    }, [roomId]);

    // Run code handler
    const handleRunCode = useCallback(async () => {
        if (isLoading) return;
        
        setIsLoading(true);
        setOutput("Executing code...");
        
        try {
            const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';
            const response = await fetch(`${apiUrl}/execute`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    language: language,
                    code: fetchedCode
                })
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const result = await response.json();
            
            if (result.stdout) {
                setOutput(result.stdout);
            } else if (result.stderr) {
                setOutput(result.stderr);
            } else if (result.compile_output) {
                setOutput(result.compile_output);
            } else {
                setOutput("Execution finished with no output.");
            }
        } catch (error) {
            console.error('Code execution error:', error);
            setOutput("An error occurred. Could not run the code.");
        } finally {
            setIsLoading(false);
        }
    }, [isLoading, language, fetchedCode]);

    // AI request handler
    const handleAiRequest = useCallback(async (prompt) => {
        const editor = editorRef.current?.editor;
        if (!editor) {
            toast.error("Editor not available.");
            return;
        }

        const selectedCode = editor.getSelectedText();
        if (!selectedCode) {
            toast.error("Please select a block of code first.");
            return;
        }

        if (isAiLoading) return;

        setIsAiLoading(true);
        setAiResponse(`AI is thinking about: "${prompt}"...`);

        try {
            const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';
            const response = await fetch(`${apiUrl}/ask-ai`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    code: selectedCode,
                    prompt: prompt
                })
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const result = await response.json();
            setAiResponse(result.response || "No response from AI.");
        } catch (error) {
            console.error('AI request error:', error);
            setAiResponse("An error occurred. Could not get a response from the AI.");
        } finally {
            setIsAiLoading(false);
        }
    }, [isAiLoading]);

    // Socket event handlers
    useEffect(() => {
        if (!socket) return;

        const handleUpdateClientList = ({ userslist }) => {
            setFetchedUsers(userslist || []);
        };

        const handleLanguageChangeSocket = ({ languageUsed }) => {
            if (languageUsed) {
                setLanguage(languageUsed);
            }
        };

        const handleCodeChange = ({ code }) => {
            setFetchedCode(code || "");
        };

        socket.on("updating client list", handleUpdateClientList);
        socket.on("on language change", handleLanguageChangeSocket);
        socket.on("on code change", handleCodeChange);

        return () => {
            socket.off("updating client list", handleUpdateClientList);
            socket.off("on language change", handleLanguageChangeSocket);
            socket.off("on code change", handleCodeChange);
        };
    }, [socket]);

    // Typing indicators
    useEffect(() => {
        if (!socket) return;

        const handleUserTypingStart = ({ username: typingUsername }) => {
            if (typingUsername && typingUsername !== username) {
                setTypingUsers(prev => [...new Set([...prev, typingUsername])]);
            }
        };

        const handleUserTypingStop = ({ username: typingUsername }) => {
            setTypingUsers(prev => prev.filter(u => u !== typingUsername));
        };

        socket.on('user-typing-start', handleUserTypingStart);
        socket.on('user-typing-stop', handleUserTypingStop);

        return () => {
            socket.off('user-typing-start', handleUserTypingStart);
            socket.off('user-typing-stop', handleUserTypingStop);
        };
    }, [socket, username]);

    // Connection monitoring
    useEffect(() => {
        if (!isConnected || !socket) {
            const timer = setTimeout(() => {
                if (!socket?.connected) {
                    toast.error("Connection lost. Returning to home page.");
                    navigate('/', { replace: true });
                }
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [isConnected, socket, navigate]);

    // Editor auto-scroll
    useEffect(() => {
        const editor = editorRef.current?.editor;
        if (!editor) return;

        const handleChange = () => {
            const lastLine = editor.session.getLength();
            editor.scrollToLine(lastLine, true, true, () => {});
        };

        editor.on("change", handleChange);
        return () => editor.off("change", handleChange);
    }, []);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (typingTimeoutRef.current) {
                clearTimeout(typingTimeoutRef.current);
            }
        };
    }, []);

    return (
        <div className="room">
            {/* Sidebar */}
            <div className="roomSidebar">
                <div className="roomSidebarHeader">
                    <div className="room-logo">
                        
                        <span>&lt;CodeSync&gt;</span>
                    </div>
                    <h3>Room ID: {roomId ? roomId.substring(0, 12) + '...' : 'Loading...'}</h3>
                    <p>Collaborative coding session</p>
                </div>
                
                <div className="roomSidebarContent">
                    <SimpleDropdown
                        label="Programming Language"
                        options={languageOptions}
                        value={language}
                        onChange={handleLanguageChange}
                        id="language-dropdown"
                    />

                    <SimpleDropdown
                        label="Editor Keybinding"
                        options={keybindingOptions}
                        value={codeKeybinding}
                        onChange={handleCodeKeybindingChange}
                        id="keybinding-dropdown"
                    />

                    <div className="usersSection">
                        <div className="usersTitle">
                            Active Members ({fetchedUsers.length})
                        </div>
                        <div className="roomSidebarUsers">
                            {fetchedUsers.length === 0 ? (
                                <div className="no-users">No users connected</div>
                            ) : (
                                fetchedUsers.map((user) => (
                                    <div key={user} className="roomSidebarUsersEach">
                                        <div 
                                            className="roomSidebarUsersEachAvatar" 
                                            style={{ 
                                                background: `linear-gradient(135deg, ${generateColor(user)}, ${generateColor(user + 'dark')})` 
                                            }}
                                        >
                                            {user.slice(0, 2).toUpperCase()}
                                        </div>
                                        <div className="roomSidebarUsersEachName">
                                            {user}
                                            {user === username && <span className="youLabel">You</span>}
                                            {typingUsers.includes(user) && user !== username && (
                                                <span className="typing-indicator">typing...</span>
                                            )}
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>

                <div className="roomSidebarActions">
                    <button 
                        className="roomSidebarCopyBtn" 
                        onClick={copyToClipboard}
                        disabled={!roomId}
                    >
                        Copy Room ID
                    </button>
                    <button 
                        className="roomSidebarBtn runBtn" 
                        onClick={handleRunCode} 
                        disabled={isLoading || !fetchedCode.trim()}
                    >
                        {isLoading ? '⏳ Running...' : 'Run Code'}
                    </button>
                    <button className="roomSidebarBtn leaveBtn" onClick={handleLeave}>
                        Leave Room
                    </button>
                </div>
            </div>

            {/* Main Editor Section */}
            <div className="editorSection">
                <div className="editorControls">
                    <h4>Your Coding Playground</h4>
                    <div className="aiControls">
                        <button 
                            className="aiBtn askBtn" 
                            onClick={() => handleAiRequest("Explain this code")} 
                            disabled={isAiLoading}
                        >
                            Ask AI ✨
                        </button>
                        <button 
                            className="aiBtn bugBtn" 
                            onClick={() => handleAiRequest("Find potential bugs and suggest improvements")} 
                            disabled={isAiLoading}
                        >
                            Find Bugs 🐞
                        </button>
                    </div>
                </div>

                <div className="editorWrapper">
                    <AceEditor
                        ref={editorRef}
                        className="roomCodeEditor"
                        mode={language}
                        keyboardHandler={codeKeybinding === "default" ? undefined : codeKeybinding}
                        theme="monokai"
                        name="collabEditor"
                        width="100%"
                        height="100%"
                        value={fetchedCode}
                        onChange={onChange}
                        fontSize={15}
                        enableLiveAutocompletion={true}
                        enableBasicAutocompletion={true}
                        editorProps={{ $blockScrolling: true }}
                        setOptions={{ 
                            showLineNumbers: true, 
                            showPrintMargin: false,
                            highlightActiveLine: true,
                            highlightSelectedWord: true,
                            cursorStyle: "ace",
                            mergeUndoDeltas: false,
                            behavioursEnabled: true,
                            wrapBehavioursEnabled: true,
                            showFoldWidgets: true,
                            foldStyle: "markbegin"
                        }}
                        placeholder="Start typing your code here..."
                    />
                </div>

                {/* Output Panels */}
                <div className="outputContainer">
                    <div className="outputPanel">
                        <h4>Console Output</h4>
                        <pre className="outputBox">
                            {output || "Run your code to check output here..."}
                        </pre>
                    </div>
                    <div className="aiPanel">
                        <h4>Your AI Assistant</h4>
                        <div className="outputBox">
                            {aiResponse || "Select some code and click an ASK AI to get started!"}
                        </div>
                    </div>
                </div>
            </div>
            
            <Toaster 
                position="top-right"
                toastOptions={{
                    duration: 4000,
                    style: {
                        background: 'rgba(255, 255, 255, 0.1)',
                        backdropFilter: 'blur(20px)',
                        color: '#f0f2f5',
                        border: '1px solid rgba(255, 255, 255, 0.12)',
                        borderRadius: '16px',
                        fontSize: '0.9rem',
                        fontWeight: '500',
                    },
                    success: {
                        iconTheme: {
                            primary: '#10b981',
                            secondary: '#ffffff',
                        },
                    },
                    error: {
                        iconTheme: {
                            primary: '#ef4444',
                            secondary: '#ffffff',
                        },
                    },
                }}
            />
        </div>
    );
}