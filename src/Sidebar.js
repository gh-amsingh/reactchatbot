import { useState } from "react";

const Sidebar = () => {
  const [showModal, setShowModal] = useState(false);
  const [selectedTag, setSelectedTag] = useState(null);
  const [input, setInput] = useState("");
  
  // Sample questions to be displayed in the modal
  const sampleQuestions = [
    "What is your name?",
    "What is your age?",
    "Where do you live?",
  ];

  const tags = ["Tag 1", "Tag 2", "Tag 3"];

  // Open modal on tag click
  const handleTagClick = (tag) => {
    setSelectedTag(tag);
    setShowModal(true); // Open modal
  };

  // Pass selected question to the input
  const handleQuestionSelect = (question) => {
    setInput(question);  // Set the selected question to input
    setShowModal(false); // Close modal
  };

  return (
    <div>
      {/* Sidebar with tags */}
      <aside className="w-64 bg-blue-900 text-white p-6 hidden md:flex flex-col fixed left-0 top-16 h-[calc(100vh-4rem)] overflow-y-auto shadow-lg rounded-lg">
        <h2 className="text-2xl font-bold mb-4 text-center font-sans">Tags</h2>
        <div className="flex flex-wrap space-x-2">
          {tags.map((tag, index) => (
            <button
              key={index}
              className="p-2 bg-white bg-opacity-20 hover:bg-opacity-50 rounded-lg text-white hover:text-blue-900 cursor-pointer transition duration-300"
              onClick={() => handleTagClick(tag)}
            >
              {tag}
            </button>
          ))}
        </div>
      </aside>

      {/* Modal for selecting a question */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h3 className="text-xl font-semibold mb-4">Select a Question for {selectedTag}</h3>
            <ul className="space-y-2">
              {sampleQuestions.map((question, index) => (
                <li
                  key={index}
                  className="p-3 bg-gray-200 hover:bg-gray-300 rounded-lg cursor-pointer transition duration-300"
                  onClick={() => handleQuestionSelect(question)}
                >
                  {question}
                </li>
              ))}
            </ul>
            <button
              className="mt-4 p-2 bg-red-600 text-white rounded-lg w-full"
              onClick={() => setShowModal(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Input field */}
      <div className="mt-4 p-4 bg-blue-900 text-white rounded-lg">
        <h3 className="text-xl">Selected Question:</h3>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="w-full p-2 rounded-lg mt-2"
          placeholder="Select a question"
        />
      </div>
    </div>
  );
};

export default Sidebar;
