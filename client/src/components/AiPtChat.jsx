import { useState } from 'react';
import api from '../api';

function AiPtChat({ user }) {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState([
    {
      from: 'ai',
      text: `Chào ${user.fullName}, bạn muốn hỏi gì về buổi tập hôm nay?`
    }
  ]);

  const plan = 'Member';

  async function handleSubmit(event) {
    event.preventDefault();

    const trimmedMessage = message.trim();

    if (!trimmedMessage || isLoading) {
      return;
    }

    const history = messages.slice(-8);
    setMessages((currentMessages) => [...currentMessages, { from: 'user', text: trimmedMessage }]);
    setMessage('');
    setIsLoading(true);

    try {
      const response = await api.post('/ai/chat', {
        message: trimmedMessage,
        history
      });

      setMessages((currentMessages) => [
        ...currentMessages,
        { from: 'ai', text: response.data.reply }
      ]);
    } catch (error) {
      setMessages((currentMessages) => [
        ...currentMessages,
        { from: 'ai', text: error.response?.data?.message || 'AI PT đang bận, bạn thử lại sau nhé.' }
      ]);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <>
      <button
        className="ai-pt-float-button"
        type="button"
        title="Mở chat AI PT"
        aria-label="Mở chat AI PT"
        onClick={() => setIsOpen(!isOpen)}
      >
        <img src="/ai-pt-icon.png" alt="" />
        <span>AI PT</span>
      </button>

      {isOpen && (
        <section className="ai-chat-panel" aria-label="Chat với AI PT">
          <div className="ai-chat-header">
            <div>
              <strong>AI PT - {plan}</strong>
            </div>
            <button
              className="chat-close-button"
              type="button"
              title="Đóng chat"
              aria-label="Đóng chat"
              onClick={() => setIsOpen(false)}
            >
              ×
            </button>
          </div>

          <div className="ai-chat-messages">
            {messages.map((item, index) => (
              <p className={`chat-message ${item.from}`} key={`${item.from}-${index}`}>
                {item.text}
              </p>
            ))}
          </div>

          <form className="ai-chat-form" onSubmit={handleSubmit}>
            <input
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              placeholder={isLoading ? 'AI PT đang trả lời...' : 'Nhập câu hỏi...'}
              aria-label="Nhập câu hỏi cho AI PT"
              disabled={isLoading}
            />
            <button type="submit" disabled={isLoading}>{isLoading ? '...' : 'Gửi'}</button>
          </form>
        </section>
      )}
    </>
  );
}

export default AiPtChat;
