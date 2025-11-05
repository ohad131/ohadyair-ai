import { useEffect, useMemo, useRef, useState } from "react";
import { MessageCircle, Send, Sparkles, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { trpc } from "@/lib/trpc";
import { useLanguage } from "@/contexts/LanguageContext";
import { toast } from "sonner";

type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
};

const MAX_INPUT_LENGTH = 2000;
const SUGGESTION_KEYS = [
  "chatSuggestionExploreServices",
  "chatSuggestionProjectIdeas",
  "chatSuggestionNextSteps",
] as const;

function generateId(prefix: string) {
  return `${prefix}-${Math.random().toString(36).slice(2, 8)}-${Date.now()}`;
}

function generateSessionId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return generateId("session");
}

function MessageBubble({ message }: { message: ChatMessage }) {
  const isUser = message.role === "user";
  return (
    <div
      className={cn(
        "flex w-full",
        isUser ? "justify-end" : "justify-start"
      )}
    >
      <div
        className={cn(
          "max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-sm",
          isUser
            ? "bg-primary text-primary-foreground"
            : "bg-muted text-foreground"
        )}
      >
        {message.content}
      </div>
    </div>
  );
}

export function OIChatWidget() {
  const { t, language } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [sessionId] = useState(() => generateSessionId());
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      role: "assistant",
      content: t.chatWelcome,
    },
  ]);
  const listRef = useRef<HTMLDivElement | null>(null);

  const chatMutation = trpc.chat.converse.useMutation({
    onError: error => {
      console.error("[OI Chat] Failed to generate response", error);
      toast.error(t.chatError);
    },
  });

  useEffect(() => {
    setMessages(prev => {
      if (prev.length === 1 && prev[0]?.id === "welcome") {
        return [
          {
            ...prev[0],
            content: t.chatWelcome,
          },
        ];
      }
      return prev;
    });
  }, [t.chatWelcome]);

  useEffect(() => {
    const el = listRef.current;
    if (!el) return;
    el.scrollTop = el.scrollHeight;
  }, [messages, chatMutation.isPending]);

  const hasOnlyWelcome = messages.length === 1 && messages[0]?.id === "welcome";

  const suggestions = useMemo(() => {
    return SUGGESTION_KEYS.map(key => ({
      key,
      label: t[key],
    }));
  }, [t]);

  const sendMessage = async (content: string) => {
    const trimmed = content.trim();
    if (trimmed.length === 0) {
      return;
    }

    const userMessage: ChatMessage = {
      id: generateId("user"),
      role: "user",
      content: trimmed,
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue("");

    try {
      const response = await chatMutation.mutateAsync({
        sessionId,
        language,
        messages: [...messages, userMessage].map(({ role, content }) => ({
          role,
          content,
        })),
      });

      if (!response?.message) {
        toast.error(t.chatError);
        return;
      }

      const assistantMessage: ChatMessage = {
        id: generateId("assistant"),
        role: "assistant",
        content: response.message,
      };
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      setMessages(prev => [
        ...prev,
        {
          id: generateId("assistant-error"),
          role: "assistant",
          content: t.chatError,
        },
      ]);
    }
  };

  const handleSubmit = () => {
    if (chatMutation.isPending) return;
    void sendMessage(inputValue);
  };

  const handleKeyDown: React.KeyboardEventHandler<HTMLTextAreaElement> = event => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleSubmit();
    }
  };

  const toggleOpen = () => {
    setIsOpen(prev => !prev);
  };

  const onSuggestionClick = (suggestion: string) => {
    if (chatMutation.isPending) return;
    void sendMessage(suggestion);
    if (!isOpen) {
      setIsOpen(true);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      {isOpen && (
        <div className="flex w-[360px] max-w-[90vw] flex-col overflow-hidden rounded-3xl border border-border bg-background shadow-2xl">
          <div className="flex items-start justify-between gap-2 border-b border-border bg-primary/5 px-5 py-4">
            <div>
              <h2 className="text-base font-semibold text-foreground">
                {t.chatTitle}
              </h2>
              <p className="text-xs text-muted-foreground">
                {t.chatSubtitle}
              </p>
            </div>
            <Button variant="ghost" size="icon" onClick={toggleOpen}>
              <X className="h-5 w-5" />
              <span className="sr-only">Close chat</span>
            </Button>
          </div>

          <div
            ref={listRef}
            className="flex max-h-[420px] flex-1 flex-col gap-3 overflow-y-auto bg-background px-5 py-4"
          >
            {messages.map(message => (
              <MessageBubble key={message.id} message={message} />
            ))}

            {chatMutation.isPending && (
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Sparkles className="h-4 w-4 animate-pulse" />
                {t.chatThinking}
              </div>
            )}
          </div>

          {hasOnlyWelcome && (
            <div className="flex flex-col gap-2 border-t border-border px-5 py-3">
              <p className="text-xs font-medium text-muted-foreground">
                {t.chatSuggestionsTitle}
              </p>
              <div className="flex flex-wrap gap-2">
                {suggestions.map(suggestion => (
                  <Button
                    key={suggestion.key}
                    variant="secondary"
                    size="sm"
                    className="rounded-full"
                    onClick={() => onSuggestionClick(suggestion.label)}
                  >
                    {suggestion.label}
                  </Button>
                ))}
              </div>
            </div>
          )}

          <div className="flex flex-col gap-2 border-t border-border bg-muted/40 px-5 py-4">
            <textarea
              value={inputValue}
              onChange={event => {
                if (event.target.value.length > MAX_INPUT_LENGTH) return;
                setInputValue(event.target.value);
              }}
              onKeyDown={handleKeyDown}
              rows={3}
              placeholder={t.chatPlaceholder}
              className="w-full resize-none rounded-2xl border border-border bg-background px-4 py-3 text-sm text-foreground outline-none focus-visible:ring-2 focus-visible:ring-primary/60"
              disabled={chatMutation.isPending}
            />
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs text-muted-foreground">
                {inputValue.length}/{MAX_INPUT_LENGTH}
              </span>
              <Button
                onClick={handleSubmit}
                disabled={chatMutation.isPending || inputValue.trim().length === 0}
                className="gap-2"
              >
                {t.chatSend}
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      )}

      <Button
        size="lg"
        className={cn(
          "group flex items-center gap-2 rounded-full px-5 py-3 shadow-lg transition-transform",
          isOpen ? "bg-primary/90" : "bg-primary"
        )}
        onClick={toggleOpen}
      >
        {isOpen ? <X className="h-5 w-5" /> : <MessageCircle className="h-5 w-5" />}
        <span>{t.chatLauncherLabel}</span>
      </Button>
    </div>
  );
}

export default OIChatWidget;
