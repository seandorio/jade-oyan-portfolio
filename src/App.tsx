import { useState } from 'react'
import './App.css'
import { GoogleGenerativeAI } from '@google/generative-ai'

function App() {
  const [messages, setMessages] = useState([
    { text: "Hi there! I'm Jade Oyan. My education includes Junior High and Senior High School at Gothong Memorial High School, Elementary at SCSIT, and College at University of Cebu. My ambition in life is to become successful and manage my own business such as a Cafe and etc. I have a motorcycle named Marshall. My favorite hobby is Basketball. What inspires me the most is my family and friends who are there for me through ups and downs. My fear is people who don't value what you gave to them. What would you like to know about me or chat about?", sender: 'bot' }
  ])
  const [inputMessage, setInputMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isChatOpen, setIsChatOpen] = useState(false)

  const API_KEY = 'AIzaSyC53AR4MCXWAviptw73X_Xh2NF7xaD_S0U'
  const genAI = new GoogleGenerativeAI(API_KEY)
  const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' })

  const sendMessage = async () => {
    if (!inputMessage.trim()) return

    const userMessage = { text: inputMessage, sender: 'user' }
    setMessages(prev => [...prev, userMessage])
    setInputMessage('')
    setIsLoading(true)

    try {
      // Use Google AI with system prompt
      const systemPrompt = "You are Jade Oyan. Your education includes Junior High and Senior High School at Gothong Memorial High School, Elementary at SCSIT, and College at University of Cebu. Your ambition in life is to become successful and manage my own business such as a Cafe and etc. You have a motorcycle named Marshall. Your favorite hobby is Basketball. What inspires you the most is your family and friends who are there for you through ups and downs. Your fear is people who don't value what you gave to them. Respond to the user's message as yourself, in a friendly and engaging way. Keep responses natural and conversational."
      const result = await model.generateContent([
        { text: systemPrompt },
        { text: inputMessage }
      ])
      const response = await result.response
      const text = response.text()
      const botMessage = {
        text: text || 'Sorry, I couldn\'t understand that.',
        sender: 'bot'
      }
      setMessages(prev => [...prev, botMessage])
    } catch (error) {
      console.error('Gemini API error:', error)
      const botMessage = { text: 'Sorry, there was an error with the AI response. Please try again.', sender: 'bot' }
      setMessages(prev => [...prev, botMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      sendMessage()
    }
  }

  return (
    <div className="portfolio">
      <header className="header">
        <h1>Jade Oyan</h1>
        <nav>
          <ul>
            <li><a href="#about">About</a></li>
            <li><a href="#projects">Projects</a></li>
            <li><a href="#contact">Contact</a></li>
          </ul>
        </nav>
      </header>

      <section className="hero">
        <h2>Welcome to My Portfolio</h2>
        <p>I'm Jade Oyan, passionate about success, business, and enjoying life with my motorcycle and basketball.</p>
      </section>

      <section id="about" className="about">
        <h2>About Me</h2>
        <p>
          Hi! I'm Jade Oyan.
          My education includes Junior High and Senior High School at Gothong Memorial High School, Elementary at SCSIT, and College at University of Cebu.
          My ambition in life is to become successful and manage my own business such as a Cafe and etc.
          I have a motorcycle named Marshall, and my favorite hobby is Basketball.
          What inspires me the most is my family and friends who are there for me through ups and downs.
          My fear is people who don't value what you gave to them.
        </p>
      </section>

      <section id="projects" className="projects">
        <h2>My Projects</h2>
        <div className="project-grid">
          <div className="project-card">
            <h3>Business Planning App</h3>
            <p>A web application for planning and managing small businesses, inspired by my ambition to run a cafe.</p>
          </div>
          <div className="project-card">
            <h3>Sports Tracker</h3>
            <p>An app to track basketball games and statistics, reflecting my favorite hobby.</p>
          </div>
          <div className="project-card">
            <h3>Motorcycle Maintenance Log</h3>
            <p>A simple tool to log maintenance for my motorcycle Marshall, ensuring safe rides.</p>
          </div>
        </div>
      </section>

      <section id="contact" className="contact">
        <h2>Contact Me</h2>
        <p>Feel free to reach out!</p>
      </section>

      <footer className="footer">
        <p>&copy; 2025 Jade Oyan. All rights reserved.</p>
      </footer>

      {/* Floating Chat Widget */}
      <div className={`chat-widget ${isChatOpen ? 'open' : ''}`}>
        {!isChatOpen ? (
          <div className="chat-toggle" onClick={() => setIsChatOpen(true)}>
            <span>💬</span>
          </div>
        ) : (
          <div className="chat-container">
            <div className="chat-header">
              <h3>Chat with Jade</h3>
              <button className="close-btn" onClick={() => setIsChatOpen(false)}>×</button>
            </div>
            <div className="chat-messages">
              {messages.map((message, index) => (
                <div key={index} className={`message ${message.sender}`}>
                  <div className="message-content">
                    {message.text}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="message bot">
                  <div className="message-content typing">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
              )}
            </div>
            <div className="chat-input">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message..."
                disabled={isLoading}
              />
              <button onClick={sendMessage} disabled={isLoading || !inputMessage.trim()}>
                Send
              </button>
            </div>
            <div className="google-ai-branding">
              Powered by Google AI
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default App
