import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { motion } from "framer-motion";


const background_image = "url('')";
const Login = ({ onLogin }) => {
  const [ username, setUsername ] = useState("");
  const [ password, setPassword ] = useState("");
  const [ error, setError ] = useState("");
  const [ loading, setLoading ] = useState(false);

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
    <div
    className="flex flex-col items-center justify-center h-screen bg-cover bg-center"
    style={{ backgroundImage: background_image }} // Replace with your desired image URL
  >
    <div className="p-6 bg-white bg-opacity-90 rounded-lg shadow-lg w-97 border border-gray-300" style={{ marginLeft: '7%' }}>
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
        className="bg-[#005cb9] text-white hover:bg-red-600 hover:text-white px-4 py-2 rounded-lg w-full transition duration-300"
        disabled={loading}
      >
        {loading ? "Loading..." : "Login"}
      </button>
    </div>
  </div>
  
  
  );
  
};


const ChatBot = ({ onLogout }) => {
  const [ messages, setMessages ] = useState([]);
  const [ input, setInput ] = useState("");
  const [ loading, setLoading ] = useState(false);
  const chatContainerRef = useRef(null);

  const sampleQuestions = [
    "Total number of patients ?",
    "List all scans of patient John Doe"
    , "List all medications of patient John Doe"
    , "List all therapies of patient John Doe"
    , "Summary of treatment history of patient John Doe"
  ];

  const sendMessage = () => {
    if (!input.trim()) return;
    setLoading(true);
    setMessages((prev) => [ ...prev, { sender: "You", text: input } ]);
    axios
      .get(`https://66ublhyq3d4dmlljm5iqfasb6i0vykgu.lambda-url.us-west-2.on.aws/prompt?question=${encodeURIComponent(input)}`)
      .then((response) => {
        if (!response.data.response) {
          setMessages((prev) => [ ...prev, { sender: "Assistant", text: "Response not found." } ]);
          setLoading(false);
          setInput("");
          return;
        }
        setMessages((prev) => [ ...prev,{ sender: "Assistant", text: response.data.response } ]);
        setLoading(false);
        setInput("");
      })
      .catch(() => {
        setMessages((prev) => [ ...prev, { sender: "Assistant", text: "Response not found." } ]);
        setLoading(false);
      });
  };

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [ messages ]);

  return (
    <div  className="flex flex-col items-center justify-center h-screen bg-cover bg-center"
    style={{ backgroundImage: background_image }} // Replace with your desired image URL
  >
      {/* Sidebar for Sample Questions */}
      <aside className="w-64 bg-[#005cb9] text-white p-6 hidden md:flex flex-col fixed left-0 top-16 h-[calc(100vh-4rem)] overflow-y-auto shadow-lg rounded-lg">
  <h2 className="text-2xl font-bold mb-4 text-center font-sans">Sample Questions</h2>
  <ul className="space-y-2">
    {sampleQuestions.map((question, index) => (
      <li
        key={index}
        className="p-3 bg-white bg-opacity-20 hover:bg-opacity-50 rounded-lg text-white hover:text-blue-900 cursor-pointer transition duration-300 ease-in-out transform hover:scale-105"
        onClick={() => setInput(question)}
      >
        {question}
      </li>
    ))}
  </ul>
</aside>



      {/* Main Chat Section */}
      <div className="flex flex-col w-full ml-64"> {/* Adjust margin to avoid sidebar overlap */}
        {/* Header */}
        <header className="bg-[#005cb9] text-white p-6 text-3xl font-semibold shadow-md flex justify-between items-center fixed top-0 left-0 right-0 z-10">
  <div className="flex-1 text-center" style={{ marginLeft: "10%" }}>
    Medical Assistant ChatBot
  </div>
  <button onClick={onLogout} className="text-sm bg-red-600 text-white px-3 py-2 rounded shadow-md hover:bg-red-700">
    Logout
  </button>
</header>

        {/* Chat Area (Adjust Height to Avoid Overlap) */}
        <div className="flex flex-col flex-grow items-center justify-between p-6 overflow-hidden mt-20 mb-16 h-[calc(100vh-8rem)]">
  {messages.length>0?<div
    className="flex flex-col w-full max-w-3xl h-full rounded-lg shadow-lg p-6 overflow-y-auto border border-gray-200 bg-white bg-opacity-90"
    ref={chatContainerRef}
  >
    {messages.map((msg, index) => (
      <motion.div
        key={index}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: index * 0.1 }}
        className={`relative p-4 my-2 rounded-2xl w-fit max-w-md text-lg shadow-lg ${
          msg.sender === "You"
            ? "bg-[#005cb9] text-white self-end hover"
            : "bg-gradient-to-r from-blue-500 to-purple-500 text-white self-start"
        }`}
        
      >
        <strong
          className={`block font-bold ${
            msg.sender !== "You"
              ? "text-yellow-300 drop-shadow-lg"
              : "text-gray-200"
          }`}
        >
          {msg.sender}
        </strong>
        <p className="mt-1 text-[15px] font-semibold tracking-wide">
  {msg.text.split("\n").map((line, i) => (
    <React.Fragment key={i}>
      {line.replace('\\n', '')}
      <br />
    </React.Fragment>
  ))}
</p>

      </motion.div>
    ))}
    {loading && (
      <motion.div
        className="text-gray-500 italic flex items-center space-x-1"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 1, repeat: Infinity, repeatType: "reverse" }}
      >
        <span style={{color:"black"}}>Assistant is typing</span>
        <motion.span
          className="dot"
          animate={{ opacity: [0, 1, 0] }}
          transition={{ duration: 0.8, repeat: Infinity, delay: 0.2 }}
        >
          .
        </motion.span>
        <motion.span
          className="dot"
          animate={{ opacity: [0, 1, 0] }}
          transition={{ duration: 0.8, repeat: Infinity, delay: 0.4 }}
        >
          .
        </motion.span>
        <motion.span
          className="dot"
          animate={{ opacity: [0, 1, 0] }}
          transition={{ duration: 0.8, repeat: Infinity, delay: 0.6 }}
        >
          .
        </motion.span>
      </motion.div>
    )}
  </div>:""}
  <br />
  {/* Input and Send button */}
  {messages.length>0?<div className="p-4 flex items-center w-full max-w-3xl border-t bg-white bg-opacity-90 rounded-b-lg shadow-sm fixed bottom-10">
    <input
      type="text"
      value={input}
      onChange={(e) => setInput(e.target.value)}
      className="border border-black p-3 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-black transition duration-200"
      placeholder="Ask your question..."
    />
     <button
  onClick={sendMessage}
  className="ml-4 bg-[#005cb9] text-white hover:bg-red-600 hover:text-white focus:ring-4 focus:ring-blue-200 px-6 py-3 rounded-lg transition duration-300"
>
  🚀
</button>
  </div>:<div className="p-4 flex items-center w-full max-w-3xl border-t bg-white bg-opacity-60 rounded-b-lg shadow-sm fixed bottom-10"
  style={{marginBottom:'20%'}}>
    <input
      type="text"
      value={input}
      onChange={(e) => setInput(e.target.value)}
      className="border border-black p-3 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-black transition duration-200"
      placeholder="Ask your question..."
    />
  <button
  onClick={sendMessage}
  className="ml-4 bg-[#005cb9] text-white hover:bg-red-600 hover:text-white focus:ring-4 focus:ring-blue-200 px-6 py-3 rounded-lg transition duration-300"
>
  🚀
</button>

  </div>}
</div>


        {/* Footer */}
        <footer className="bg-[#005cb9] text-white text-center p-4 text-sm fixed bottom-0 left-0 right-0 z-10">
  &copy; 2025 Medi Assistant
</footer>

      </div>
    </div>
  );
};



const App = () => {
  const [ isAuthenticated, setIsAuthenticated ] = useState(localStorage.getItem("authToken") !== null);

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    setIsAuthenticated(false);
  };

  const loginscreen = <div className="flex flex-col h-screen w-full bg-white">
   <header className="bg-[#005cb9] text-white p-6 text-3xl font-semibold shadow-md flex justify-between items-center">
  <div className="flex-1 text-center" style={{ marginLeft: "5%" }}>Medical Assistant ChatBot</div>
</header>

    {isAuthenticated ? <ChatBot onLogout={handleLogout} /> : <Login onLogin={handleLogin} />}
    <footer className="bg-[#005cb9] text-white text-center p-4 text-sm" >
  &copy; 2025 Medi Assistant
</footer>

  </div>;

  return (
    !isAuthenticated ? loginscreen : <ChatBot onLogout={handleLogout} />
  )
};

export default App;
