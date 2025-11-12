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
        <div
          id="oi-chat-panel"
          className="flex w-[360px] max-w-[90vw] flex-col overflow-hidden rounded-3xl border border-border bg-background shadow-2xl"
        >
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
        type="button"
        size="lg"
        onClick={toggleOpen}
        aria-expanded={isOpen}
        aria-controls="oi-chat-panel"
        className={cn(
          "group relative flex items-center gap-4 overflow-hidden rounded-full border border-white/15 px-6 py-4 text-left text-white shadow-[0_18px_45px_rgba(56,189,248,0.35)] backdrop-blur-md transition-all duration-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary/60 focus-visible:ring-offset-background",
          "before:absolute before:inset-0 before:-z-10 before:rounded-full before:bg-gradient-to-r before:from-white/40 before:via-white/10 before:to-transparent before:opacity-0 before:transition-opacity before:duration-500 before:content-['']",
          "after:pointer-events-none after:absolute after:inset-y-0 after:-left-1/3 after:h-full after:w-1/2 after:translate-x-[-130%] after:bg-white/25 after:blur-2xl after:transition-transform after:duration-700 after:content-['']",
          isOpen
            ? "bg-gradient-to-r from-primary/90 via-primary to-indigo-600 shadow-[0_24px_70px_rgba(99,102,241,0.45)] before:opacity-70"
            : "bg-gradient-to-r from-sky-500 via-primary to-fuchsia-500 hover:-translate-y-1 hover:shadow-[0_30px_85px_rgba(56,189,248,0.55)] hover:before:opacity-100 hover:after:translate-x-[220%]"
        )}
      >
        <span className="relative flex h-12 w-12 items-center justify-center rounded-full bg-white/15 text-white shadow-inner transition-all duration-500 group-hover:scale-110 group-hover:rotate-3">
          <span
            aria-hidden
            className="absolute inset-0 rounded-full bg-white/20 opacity-0 transition-all duration-700 group-hover:opacity-100 group-hover:animate-ping"
          />
          <span className="relative flex h-9 w-9 items-center justify-center rounded-full bg-white/20 text-white">
            {isOpen ? <X className="h-5 w-5" /> : <MessageCircle className="h-5 w-5" />}
          </span>
        </span>
        <div className="flex flex-col items-start text-white">
          <span className="text-xs uppercase tracking-[0.35em] text-white/70">
            {t.chatLauncherLabelShort}
          </span>
          <span className="text-lg font-semibold leading-tight drop-shadow">{t.chatLauncherLabel}</span>
          <span className="hidden text-xs text-white/80 sm:block">{t.chatLauncherTagline}</span>
        </div>
        <span
          aria-hidden
          className="pointer-events-none absolute -top-3 right-6 h-16 w-16 rounded-full bg-sky-300/40 blur-3xl transition-transform duration-700 group-hover:scale-[1.4]"
        />
        <span aria-hidden className="pointer-events-none absolute -top-1 right-3 text-xl text-amber-200 transition-transform duration-700 group-hover:-translate-y-1 group-hover:scale-110">
          ✨
        </span>
      </Button>
    </div>
  );
}

export default OIChatWidget;
