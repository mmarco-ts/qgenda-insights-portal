import { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Minimize2, Send, Stethoscope } from 'lucide-react';
import { useSpotterAgent, SpotterMessage } from '@thoughtspot/visual-embed-sdk/react';
import { QGENDA_MODEL_ID } from '../lib/thoughtspot';
import '../lib/thoughtspot';

interface TextMessage {
  id: string;
  type: 'user' | 'bot' | 'system';
  content: string;
  timestamp: Date;
}

interface SpotterResponseMessage {
  id: string;
  type: 'spotter';
  query: string;
  message: {
    worksheetId: string;
    convId: string;
    messageId: string;
    sessionId: string;
    genNo: number;
    acSessionId: string;
    acGenNo: number;
  };
  timestamp: Date;
}

type Message = TextMessage | SpotterResponseMessage;

const DATA_QUESTION_KEYWORDS = [
  'show', 'display', 'chart', 'graph', 'compare', 'comparison',
  'how much', 'how many', 'what is the', 'what are the',
  'total', 'sum', 'average', 'avg', 'count', 'number of',
  'top', 'bottom', 'highest', 'lowest', 'best', 'worst',
  'by unit', 'by department', 'by location', 'by provider', 'by physician', 'by specialty', 'by role',
  'breakdown', 'distribution', 'trend', 'over time',
  'schedule', 'scheduling', 'shift', 'shifts', 'on-call', 'oncall',
  'staffing', 'staffed', 'overstaffed', 'understaffed', 'coverage',
  'utilization', 'capacity', 'overtime', 'float', 'fte',
  'credential', 'credentialing', 'license',
  'vs', 'versus', 'compared to', 'relative to',
  'percentage', 'ratio', 'proportion', '%',
  'list', 'rank', 'sort', 'order by',
  'per', 'each', 'all', 'every',
  'quarterly', 'monthly', 'yearly', 'annual', 'weekly', 'daily',
  'performance', 'metrics', 'kpi', 'statistics',
  'cost', 'hours', 'time', 'attendance'
];

const GENERAL_QUESTION_KEYWORDS = [
  'tell me about', 'explain', 'what does', 'what is',
  'describe', 'help me understand', 'can you explain',
  'why', 'how does this work', 'what should',
  'meaning of', 'definition', 'interpret',
  'suggest', 'recommend', 'advice', 'should i',
  'hello', 'hi', 'hey', 'thanks', 'thank you',
  'who', 'when was', 'where is'
];

function classifyQuestion(question: string): { isDataQuestion: boolean; confidence: number } {
  const lowerQuestion = question.toLowerCase();
  let dataScore = 0;
  let generalScore = 0;

  for (const keyword of DATA_QUESTION_KEYWORDS) {
    if (lowerQuestion.includes(keyword)) dataScore += 1;
  }
  for (const keyword of GENERAL_QUESTION_KEYWORDS) {
    if (lowerQuestion.includes(keyword)) generalScore += 1;
  }
  if (lowerQuestion.match(/\d+/) || lowerQuestion.includes('$')) dataScore += 1;
  if (lowerQuestion.length < 15) generalScore += 1;

  const totalScore = dataScore + generalScore;
  const isDataQuestion = dataScore > generalScore;
  const confidence = totalScore > 0 ? Math.max(dataScore, generalScore) / totalScore : 0.5;
  return { isDataQuestion, confidence };
}

function generateTextResponse(question: string): string {
  const lowerQuestion = question.toLowerCase();

  if (lowerQuestion.match(/^(hi|hello|hey|good morning|good afternoon)/)) {
    return "Hello! I'm your QGenda Insights assistant. I can help you explore workforce, scheduling, and staffing data.\n\nTry asking me:\n• \"Show shift coverage by unit this week\"\n• \"Which departments have the most overtime?\"\n• \"Top providers by hours scheduled\"\n\nOr ask me to explain workforce metrics.";
  }

  if (lowerQuestion.match(/(thanks|thank you)/)) {
    return "You're welcome! Let me know if you have any other questions about your workforce data.";
  }

  if (lowerQuestion.includes('tell me about') || lowerQuestion.includes('explain') || lowerQuestion.includes('what is')) {
    if (lowerQuestion.includes('data') || lowerQuestion.includes('portal') || lowerQuestion.includes('insights')) {
      return "QGenda Insights gives healthcare leaders a real-time view of their workforce:\n\n👩‍⚕️ **Scheduling**: Shift coverage, on-call rotations, capacity gaps\n📊 **Utilization**: Provider hours, productivity, FTE trends\n💸 **Cost & Overtime**: Where labor spend is concentrated\n📋 **Credentialing**: Compliance status and expirations\n\nTry asking a specific question like \"Show overtime hours by department\" to see live visualizations.";
    }
    if (lowerQuestion.includes('overtime')) {
      return "**Overtime** is hours worked beyond standard scheduled shifts. In healthcare it's a leading indicator of:\n\n• Under-staffed units or shifts\n• Credentialing or float-pool gaps\n• Demand surges (census spikes, seasonality)\n\nAsk \"Show overtime by department this month\" to see where it's concentrated.";
    }
    if (lowerQuestion.includes('utiliz') || lowerQuestion.includes('capacity')) {
      return "**Utilization** measures how much of available provider capacity is actually being used. Low utilization means open capacity to absorb more cases; high utilization can signal burnout risk.\n\nAsk \"Show utilization by specialty\" or \"Which units are over 90% utilized?\".";
    }
  }

  if (lowerQuestion.includes('help') || lowerQuestion.includes('what can you do')) {
    return "I can help you with:\n\n📊 **Data Questions** - Ask me to show charts and comparisons:\n• \"Show shifts by unit this week\"\n• \"Top providers by hours\"\n• \"Compare overtime across departments\"\n\n💡 **Insights** - Ask me to explain metrics:\n• \"What is utilization?\"\n• \"Explain credentialing status\"\n\n🔍 **Analysis** - Explore your workforce data:\n• \"Which units are understaffed?\"\n• \"Show scheduling trends over time\"";
  }

  return "I can help answer questions about your workforce data.\n\nFor **data visualizations**, try:\n• \"Show shift coverage by unit\"\n• \"Top departments by overtime hours\"\n\nFor **explanations**, try:\n• \"What is utilization?\"\n• \"Explain how float-pools work\"\n\nWhat would you like to know?";
}

export default function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const chatMessagesRef = useRef<HTMLDivElement>(null);

  const { sendMessage } = useSpotterAgent({
    worksheetId: QGENDA_MODEL_ID,
  });

  useEffect(() => {
    if (isOpen && !isMinimized && messages.length === 0) {
      setMessages([{
        id: 'welcome',
        type: 'bot',
        content: "Hello! I'm your QGenda Insights assistant. 🩺\n\nTry asking:\n• \"Show shift coverage by unit\"\n• \"Which departments have the most overtime?\"\n• \"Top providers by hours scheduled\"",
        timestamp: new Date(),
      }]);
    }
  }, [isOpen, isMinimized, messages.length]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
    return () => clearTimeout(timeoutId);
  }, [messages]);

  useEffect(() => {
    if (isOpen && !isMinimized) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen, isMinimized]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isLoading) return;

    const userMessage: TextMessage = {
      id: `user-${Date.now()}`,
      type: 'user',
      content: inputValue.trim(),
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    const question = inputValue.trim();
    setInputValue('');
    setIsLoading(true);

    try {
      const { isDataQuestion } = classifyQuestion(question);

      if (isDataQuestion) {
        try {
          const result = await sendMessage(question);

          if (result.error) {
            const textResponse = generateTextResponse(question);
            const botMessage: TextMessage = {
              id: `bot-${Date.now()}`,
              type: 'bot',
              content: `I couldn't query the data: ${result.error}\n\n${textResponse}`,
              timestamp: new Date(),
            };
            setMessages(prev => [...prev, botMessage]);
          } else if (result.message) {
            const spotterMessage: SpotterResponseMessage = {
              id: `spotter-${Date.now()}`,
              type: 'spotter',
              query: result.query || question,
              message: result.message,
              timestamp: new Date(),
            };
            setMessages(prev => [...prev, spotterMessage]);
          } else {
            const textResponse = generateTextResponse(question);
            const botMessage: TextMessage = {
              id: `bot-${Date.now()}`,
              type: 'bot',
              content: textResponse,
              timestamp: new Date(),
            };
            setMessages(prev => [...prev, botMessage]);
          }
        } catch (spotterError: unknown) {
          const errorMsg = spotterError instanceof Error ? spotterError.message : 'Unknown error';
          const textResponse = generateTextResponse(question);
          const botMessage: TextMessage = {
            id: `bot-${Date.now()}`,
            type: 'bot',
            content: `Sorry, I couldn't query the data (${errorMsg}).\n\n${textResponse}`,
            timestamp: new Date(),
          };
          setMessages(prev => [...prev, botMessage]);
        }
      } else {
        const textResponse = generateTextResponse(question);
        const botMessage: TextMessage = {
          id: `bot-${Date.now()}`,
          type: 'bot',
          content: textResponse,
          timestamp: new Date(),
        };
        setMessages(prev => [...prev, botMessage]);
      }
    } catch (error) {
      console.error('Error processing message:', error);
      const errorMessage: TextMessage = {
        id: `error-${Date.now()}`,
        type: 'system',
        content: 'Sorry, something went wrong. Please try again.',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggle = () => {
    if (isMinimized) {
      setIsMinimized(false);
    } else {
      setIsOpen(!isOpen);
    }
  };

  const handleMinimize = () => {
    setIsMinimized(true);
  };

  const handleClose = () => {
    setIsOpen(false);
    setIsMinimized(false);
    setMessages([]);
  };

  const renderMessageContent = (content: string) => {
    const parts = content.split('\n');
    return parts.map((part, index) => {
      let formatted = part.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
      if (formatted.startsWith('• ') || formatted.startsWith('- ')) {
        formatted = `<span style="display: block; padding-left: 8px;">${formatted}</span>`;
      }
      return (
        <span
          key={index}
          dangerouslySetInnerHTML={{ __html: formatted }}
          style={{ display: 'block', marginBottom: part === '' ? '8px' : '2px' }}
        />
      );
    });
  };

  return (
    <>
      {isOpen && !isMinimized && (
        <div className="chatbot-panel">
          <div className="chatbot-header">
            <div className="chatbot-title">
              <Stethoscope size={18} />
              <span>Insights AI Assistant</span>
            </div>
            <div className="chatbot-actions">
              <button className="chatbot-action-btn" onClick={handleMinimize} aria-label="Minimize">
                <Minimize2 size={16} />
              </button>
              <button className="chatbot-action-btn" onClick={handleClose} aria-label="Close">
                <X size={16} />
              </button>
            </div>
          </div>

          <div className="chatbot-messages" ref={chatMessagesRef}>
            {messages.map((message) => {
              if (message.type === 'spotter') {
                return (
                  <div key={message.id} className="chatbot-message bot spotter-response">
                    <div className="chatbot-bubble bot spotter-intro">
                      <span>Here's what I found for: "{message.query}"</span>
                    </div>
                    <div className="spotter-message-container">
                      <SpotterMessage
                        message={message.message}
                        query={message.query}
                      />
                    </div>
                  </div>
                );
              }

              return (
                <div
                  key={message.id}
                  data-message-id={message.id}
                  className={`chatbot-message ${message.type}`}
                >
                  <div className={`chatbot-bubble ${message.type}`}>
                    {renderMessageContent(message.content)}
                  </div>
                </div>
              );
            })}

            {isLoading && (
              <div className="chatbot-message bot">
                <div className="chatbot-bubble bot">
                  <div className="chatbot-typing">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          <form className="chatbot-input-area" onSubmit={handleSubmit}>
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Ask about your workforce data..."
              disabled={isLoading}
              className="chatbot-input"
            />
            <button
              type="submit"
              disabled={!inputValue.trim() || isLoading}
              className="chatbot-send-btn"
            >
              <Send size={18} />
            </button>
          </form>
        </div>
      )}

      <button
        className={`chatbot-fab ${isOpen && !isMinimized ? 'active' : ''}`}
        onClick={handleToggle}
        aria-label="Open Insights AI Assistant"
      >
        {isOpen && !isMinimized ? (
          <X size={24} />
        ) : (
          <>
            <MessageCircle size={24} />
            {!isOpen && <span className="chatbot-fab-badge">AI</span>}
          </>
        )}
      </button>
    </>
  );
}
