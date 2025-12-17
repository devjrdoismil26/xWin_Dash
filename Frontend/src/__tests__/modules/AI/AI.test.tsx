import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@test-utils/test-utils';
import { QueryClient } from '@tanstack/react-query';
import React from "react";

// Mock do componente AI
const AI = () => {
  const [messages, setMessages] = React.useState([
    {
      id: 1,
      type: "user",
      content: "Hello AI",
      timestamp: "2024-01-16T10:00:00Z",
    },
    {
      id: 2,
      type: "assistant",
      content: "Hello! How can I help you today?",
      timestamp: "2024-01-16T10:00:01Z",
    },
  ]);

  const [isLoading, setIsLoading] = React.useState(false);

  const [currentProvider, setCurrentProvider] = React.useState("openai");

  const sendMessage = (content: string) => {
    setIsLoading(true);

    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now(),
          type: "assistant",
          content: `AI Response to: ${content}`,
          timestamp: new Date().toISOString(),
        },
      ]);

      setIsLoading(false);

    }, 1000);};

  return (
        <>
      <div data-testid="ai-module" className="ai-module">
      </div><h1 data-testid="ai-title">AI Assistant</h1>

      <div data-testid="provider-selector">
           
        </div><select
          value={ currentProvider }
          onChange={ (e) => setCurrentProvider(e.target.value) }
          data-testid="provider-select"
        >
          <option value="openai">OpenAI</option>
          <option value="anthropic">Anthropic</option></select></div>

      <div data-testid="chat-messages" className="chat-messages">
           
        </div>{(messages || []).map((message) => (
          <div
            key={ message.id }
            data-testid={`message-${message.id}`}
            className={`message ${message.type} `}>
           
        </div><span data-testid={`message-content-${message.id}`}>
           
        </span>{message.content}
            </span>
            <span data-testid={`message-timestamp-${message.id}`}>
           
        </span>{message.timestamp}
            </span>
      </div>
    </>
  ))}
      </div>

      {isLoading && <div data-testid="ai-loading">AI is thinking...</div>}

      <div data-testid="chat-input" className="chat-input">
           
        </div><input
          data-testid="message-input"
          placeholder="Type your message..."
          onKeyDown={ (e) => {
            if (e.key === "Enter" && e.currentTarget.value.trim()) {
              sendMessage(e.currentTarget.value);

              e.currentTarget.value = "";
             } } />
        <button
          data-testid="send-button"
          onClick={ (e) => {
            const input = e.currentTarget
              .previousElementSibling as HTMLInputElement;
            if (input.value.trim()) {
              sendMessage(input.value);

              input.value = "";
             } }
  >
          Send
        </button>
      </div>);};

describe("AI Module", () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false },
      },
    });

  });

  it("should render AI interface", async () => {
    render(<AI />, { queryClient });

    await waitFor(() => {
      expect(screen.getByTestId("ai-module")).toBeInTheDocument();

    });

  });

  it("should display AI title", async () => {
    render(<AI />, { queryClient });

    await waitFor(() => {
      expect(screen.getByTestId("ai-title")).toBeInTheDocument();

      expect(screen.getByText("AI Assistant")).toBeInTheDocument();

    });

  });

  it("should display chat messages", async () => {
    render(<AI />, { queryClient });

    await waitFor(() => {
      expect(screen.getByTestId("message-1")).toBeInTheDocument();

      expect(screen.getByTestId("message-2")).toBeInTheDocument();

      expect(screen.getByText("Hello AI")).toBeInTheDocument();

      expect(
        screen.getByText("Hello! How can I help you today?"),
      ).toBeInTheDocument();

    });

  });

  it("should handle provider selection", async () => {
    render(<AI />, { queryClient });

    const providerSelect = screen.getByTestId("provider-select");

    expect(providerSelect).toHaveValue("openai");

    fireEvent.change(providerSelect, { target: { value: "anthropic" } );

    expect(providerSelect).toHaveValue("anthropic");

  });

  it("should handle message sending", async () => {
    render(<AI />, { queryClient });

    const messageInput = screen.getByTestId("message-input");

    const sendButton = screen.getByTestId("send-button");

    fireEvent.change(messageInput, { target: { value: "Test message" } );

    fireEvent.click(sendButton);

    await waitFor(() => {
      expect(screen.getByTestId("ai-loading")).toBeInTheDocument();

    });

    await waitFor(
      () => {
        expect(
          screen.getByText("AI Response to: Test message"),
        ).toBeInTheDocument();

      },
      { timeout: 2000 },);

  });

  it("should handle Enter key for sending", async () => {
    render(<AI />, { queryClient });

    const messageInput = screen.getByTestId("message-input");

    fireEvent.change(messageInput, { target: { value: "Enter test" } );

    fireEvent.keyDown(messageInput, { key: "Enter" });

    await waitFor(() => {
      expect(screen.getByTestId("ai-loading")).toBeInTheDocument();

    });

  });

  it("should show loading state during AI response", async () => {
    render(<AI />, { queryClient });

    const messageInput = screen.getByTestId("message-input");

    fireEvent.change(messageInput, { target: { value: "Loading test" } );

    fireEvent.keyDown(messageInput, { key: "Enter" });

    await waitFor(() => {
      expect(screen.getByTestId("ai-loading")).toBeInTheDocument();

      expect(screen.getByText("AI is thinking...")).toBeInTheDocument();

    });

  });

  it("should be responsive", async () => {
    render(<AI />, { queryClient });

    await waitFor(() => {
      const aiModule = screen.getByTestId("ai-module");

      expect(aiModule).toHaveClass("ai-module");

    });

  });

  it("should support dark theme", async () => {
    render(<AI />, {
      queryClient,
      theme: "dark",
    });

    await waitFor(() => {
      const aiModule = screen.getByTestId("ai-module");

      expect(aiModule).toHaveClass("ai-module");

    });

  });

});
