import React, { useState, useEffect, useRef } from "react";
import axios from "axios";


const Login = ({ onLogin }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `https://66ublhyq3d4dmlljm5iqfasb6i0vykgu.lambda-url.us-west-2.on.aws/?username=${username}&password=${password}`
      );
      if (response.data.success) {
        localStorage.setItem("authToken", "authenticated");
        onLogin();
      } else {
        setError("Invalid credentials");
      }
    } catch (err) {
      setError("Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-white">
      <div className="p-6 bg-white rounded-lg shadow-lg w-96 border border-gray-300">
        <h2 className="text-2xl font-semibold mb-4 text-black">Login</h2>
        {error && <p className="text-red-500">{error}</p>}
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="border border-black p-3 rounded-lg w-full mb-2"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border border-black p-3 rounded-lg w-full mb-2"
        />
        <button 
          onClick={handleLogin} 
          className="bg-black text-white px-4 py-2 rounded-lg w-full"
          disabled={loading}
        >
          {loading ? "Loading..." : "Login"}
        </button>
      </div>
    </div>
  );
};

const ChatBot = ({ onLogout }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const chatContainerRef = useRef(null);

  const sendMessage = () => {
    if (!input.trim()) return;
    setLoading(true);

    axios
      .get(`https://66ublhyq3d4dmlljm5iqfasb6i0vykgu.lambda-url.us-west-2.on.aws/prompt?question=${encodeURIComponent(input)}`)
      .then((response) => {
        setMessages((prev) => [...prev, { sender: "You", text: input }, { sender: "Bot", text: response.data.response }]);
        setLoading(false);
        setInput("");
      })
      .catch((error) => {
        setMessages((prev) => [...prev, { sender: "Bot", text: "Error: Response not found." }]);
        setLoading(false);
      });
  };

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="flex flex-col h-screen w-full bg-white">
      <header className="bg-black text-white p-6 text-3xl font-semibold shadow-md flex justify-between items-center">
        <div className="flex-1 text-center" style={{marginLeft:"10%"}}>Medical Assistant ChatBot</div>
        <button onClick={onLogout} style={{ fontSize: "60%" }}>
          Logout
        </button>
      </header>

      {/* Chat History Container with scrollable area */}
      <div className="flex flex-col items-center justify-between flex-grow p-6 overflow-hidden">
        <div
          className="flex flex-col w-full max-w-3xl h-full bg-white rounded-lg shadow-lg p-6 overflow-y-auto border border-gray-200"
          ref={chatContainerRef}
        >
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`p-3 my-2 rounded-lg w-fit max-w-md ${msg.sender === "You" ? "bg-black text-white self-end" : "bg-gray-200 text-black self-start"}`}
            >
              <strong>{msg.sender}: </strong>{msg.text}
            </div>
          ))}
          {loading && <div className="text-gray-500 italic">Bot is typing...</div>}
        </div>

        {/* Input and Send button */}
        <div className="p-4 flex items-center w-full max-w-3xl border-t bg-white rounded-b-lg shadow-sm">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="border border-black p-3 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-black transition duration-200"
            placeholder="Type your message..."
          />
          <button
            onClick={sendMessage}
            className="ml-4 bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 focus:ring-4 focus:ring-black-200 transition duration-200"
          >
            Send
          </button>
        </div>
      </div>

      <footer className="bg-black text-white text-center p-3 text-sm">
        &copy; 2025 Medi Assistant
      </footer>
    </div>
  );
};


const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(localStorage.getItem("authToken") !== null);

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    setIsAuthenticated(false);
  };

  return isAuthenticated ? <ChatBot onLogout={handleLogout} /> : <Login onLogin={handleLogin} />;
};

export default App;
