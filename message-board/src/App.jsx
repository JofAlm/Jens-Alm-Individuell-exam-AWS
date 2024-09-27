import React, { useState, useEffect } from "react";
import axios from "axios";

const App = () => {
  const [messages, setMessages] = useState([]);
  const [username, setUsername] = useState("");
  const [text, setText] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [currentMessage, setCurrentMessage] = useState(null);
  const [updatedText, setUpdatedText] = useState("");
  const [showModal, setShowModal] = useState(false);

  const apiUrl =
    "https://jdjkvxagu1.execute-api.eu-north-1.amazonaws.com/dev/messages";

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      const response = await axios.get(apiUrl);
      setMessages(response.data);
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  const handlePublish = async () => {
    if (username && text) {
      try {
        const newMessage = { username, text };
        await axios.post(apiUrl, newMessage);
        fetchMessages();
        setUsername("");
        setText("");
      } catch (error) {
        console.error("Error publishing message:", error);
      }
    } else {
      alert("Både användarnamn och meddelande krävs!");
    }
  };

  const handleEdit = (message) => {
    setIsEditing(true);
    setCurrentMessage(message);
    setUpdatedText(message.text);
    setShowModal(true); // Öppna modalrutan
  };

  const handleUpdate = async () => {
    if (updatedText) {
      try {
        await axios.put(
          `${apiUrl}/${currentMessage.username}/${currentMessage.id}`,
          {
            text: updatedText,
          }
        );
        setIsEditing(false);
        setCurrentMessage(null);
        setUpdatedText("");
        setShowModal(false); // Stäng modalrutan
        fetchMessages();
      } catch (error) {
        console.error("Error updating message:", error);
      }
    }
  };

  const closeModal = () => {
    setIsEditing(false);
    setCurrentMessage(null);
    setUpdatedText("");
    setShowModal(false); // Stäng modalrutan
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>The Message</h1>

      {/* Publiceringssektionen för nytt meddelande */}
      <div style={styles.inputContainer}>
        <textarea
          style={styles.textArea}
          placeholder="Skriv ditt meddelande här..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <input
          style={styles.input}
          type="text"
          placeholder="Ange användarnamn"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <button style={styles.button} onClick={handlePublish}>
          Publicera
        </button>
      </div>

      {/* Lista med alla meddelanden */}
      <div style={styles.messageList}>
        {messages.length > 0 ? (
          messages.map((message) => (
            <div key={message.id} style={styles.messageCard}>
              <p style={styles.createdAt}>
                {new Date(message.createdAt).toLocaleString()}
              </p>
              <p style={styles.messageText}>{message.text}</p>
              <div style={styles.messageFooter}>
                <span style={styles.username}>{message.username}</span>
                <span
                  style={styles.editLink}
                  onClick={() => handleEdit(message)}
                >
                  Ändra
                </span>
              </div>
            </div>
          ))
        ) : (
          <p>Inga meddelanden att visa.</p>
        )}
      </div>

      {/* Modal-rutan för att redigera meddelandet */}
      {showModal && (
        <div style={styles.modalOverlay}>
          <div style={styles.modal}>
            <h2>Redigera meddelande</h2>
            <textarea
              style={styles.textArea}
              value={updatedText}
              onChange={(e) => setUpdatedText(e.target.value)}
            />
            <button style={styles.button} onClick={handleUpdate}>
              Spara ändringar
            </button>
            <button style={styles.closeButton} onClick={closeModal}>
              Avbryt
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// Stilar för layout och element
const styles = {
  container: {
    backgroundColor: "#19274A",
    minHeight: "100vh",
    padding: "20px",
    color: "white",
    fontFamily: "Arial, sans-serif",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  heading: {
    color: "#00B2FF",
    textAlign: "center",
  },
  inputContainer: {
    marginBottom: "20px",
    width: "100%",
    maxWidth: "600px", // Begränsar bredden på input-området
    textAlign: "center",
  },
  textArea: {
    width: "100%",
    height: "100px",
    backgroundColor: "white",
    color: "black",
    padding: "10px",
    marginBottom: "10px",
    border: "none",
    borderRadius: "5px",
    fontSize: "16px",
  },
  input: {
    width: "100%",
    padding: "10px",
    backgroundColor: "white",
    color: "black",
    marginBottom: "10px",
    border: "none",
    borderRadius: "5px",
    fontSize: "16px",
  },
  button: {
    backgroundColor: "red",
    color: "white",
    padding: "10px 20px",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    fontSize: "16px",
    margin: "10px",
  },
  closeButton: {
    backgroundColor: "gray",
    color: "white",
    padding: "10px 20px",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    fontSize: "16px",
    margin: "10px",
  },
  messageList: {
    marginTop: "20px",
    width: "100%",
    maxWidth: "590px", // 10px mindre än tidigare (600px - 10px)
  },
  messageCard: {
    backgroundColor: "white",
    color: "#000",
    padding: "15px",
    borderRadius: "5px",
    marginBottom: "10px",
    margin: "0 auto",
    width: "100%",
  },
  createdAt: {
    fontSize: "12px",
    color: "gray",
    marginBottom: "5px",
  },
  messageText: {
    fontSize: "16px",
    marginBottom: "10px",
  },
  messageFooter: {
    display: "flex",
    justifyContent: "space-between",
    fontSize: "14px",
  },
  username: {
    fontWeight: "bold",
  },
  editLink: {
    color: "#00B2FF",
    cursor: "pointer",
  },
  modalOverlay: {
    position: "fixed",
    top: "0",
    left: "0",
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  modal: {
    backgroundColor: "white",
    padding: "20px",
    borderRadius: "10px",
    textAlign: "center",
    maxWidth: "400px",
    width: "100%",
    position: "relative", // För att möjliggöra centrerad positionering
    top: "-50px", // Flyttar popup-modalen 50px uppåt från meddelandekorten
  },
};

export default App;
