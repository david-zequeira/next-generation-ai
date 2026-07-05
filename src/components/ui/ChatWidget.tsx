"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { MessageCircle, Send, X } from "lucide-react";
import { useDict } from "@/i18n/LocaleContext";

const AGENT_URL = process.env.NEXT_PUBLIC_AGENT_URL ?? "";

type Msg = { role: "user" | "assistant"; text: string };

function getSessionId(): string {
  const KEY = "ng-chat-session";
  let id = sessionStorage.getItem(KEY);
  if (!id) {
    id = crypto.randomUUID();
    sessionStorage.setItem(KEY, id);
  }
  return id;
}

/**
 * Widget de chat conectado al ng-agent (el mismo cerebro que responde por
 * WhatsApp). Solo se renderiza si NEXT_PUBLIC_AGENT_URL está configurada.
 * El agente responde en el idioma en el que le escriba el visitante.
 */
export default function ChatWidget() {
  const t = useDict().chat;
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, open]);

  // El CTA final puede abrir el chat ("o pregúntale a nuestra IA ahora mismo")
  useEffect(() => {
    const onOpen = () => setOpen(true);
    window.addEventListener("ng:open-chat", onOpen);
    return () => window.removeEventListener("ng:open-chat", onOpen);
  }, []);

  // Calentamiento: el plan gratuito de Render duerme el backend; un ping
  // temprano lo despierta mientras el visitante navega, y el primer mensaje
  // del chat responde al instante en vez de tardar ~40 s.
  useEffect(() => {
    if (!AGENT_URL) return;
    const t = setTimeout(() => {
      fetch(`${AGENT_URL}/api/health`).catch(() => {});
    }, 2500);
    return () => clearTimeout(t);
  }, []);

  if (!AGENT_URL) return null;

  // Mensaje de bienvenida en el idioma activo (solo si aún no hay conversación)
  const displayMessages: Msg[] =
    messages.length > 0 ? messages : [{ role: "assistant", text: t.welcome }];

  const send = async () => {
    const text = input.trim();
    if (!text || busy) return;
    setInput("");
    const base = messages.length > 0 ? messages : [{ role: "assistant" as const, text: t.welcome }];
    setMessages([...base, { role: "user", text }]);
    setBusy(true);
    try {
      const res = await fetch(`${AGENT_URL}/api/chat`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ sessionId: getSessionId(), message: text }),
      });
      if (!res.ok) throw new Error(String(res.status));
      const data: { reply: string } = await res.json();
      setMessages((m) => [...m, { role: "assistant", text: data.reply }]);
    } catch {
      setMessages((m) => [...m, { role: "assistant", text: t.error }]);
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      {/* Botón flotante */}
      <motion.button
        type="button"
        aria-label={open ? t.ariaClose : t.ariaOpen}
        onClick={() => setOpen((v) => !v)}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="fixed bottom-5 right-5 z-[60] flex h-14 w-14 cursor-pointer items-center justify-center rounded-full bg-electric text-white shadow-[0_0_40px_-6px_rgba(46,107,255,0.9)] transition-all duration-300 hover:scale-105 hover:shadow-[0_0_60px_-4px_rgba(46,107,255,1)] active:scale-95"
      >
        {open ? (
          <X className="h-6 w-6" strokeWidth={1.8} />
        ) : (
          <MessageCircle className="h-6 w-6" strokeWidth={1.8} />
        )}
        {!open && (
          <span className="absolute -right-0.5 -top-0.5 h-3 w-3 rounded-full bg-neon animate-pulse-glow" />
        )}
      </motion.button>

      {/* Panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.96 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="glass fixed bottom-[5.5rem] right-5 z-[60] flex h-[min(560px,calc(100svh-8rem))] w-[min(380px,calc(100vw-2.5rem))] flex-col overflow-hidden rounded-2xl"
            role="dialog"
            aria-label={t.ariaDialog}
          >
            {/* Cabecera */}
            <div className="flex items-center gap-3 border-b border-line px-5 py-4">
              <div className="relative flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-electric to-pulse font-display text-xs font-bold text-white">
                AI
                <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-abyss bg-emerald-400" />
              </div>
              <div>
                <p className="font-display text-sm font-semibold text-frost">
                  {t.headerName}
                </p>
                <p className="text-[11px] text-mist">{t.headerSub}</p>
              </div>
            </div>

            {/* Mensajes */}
            <div ref={listRef} className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
              {displayMessages.map((m, i) => (
                <div
                  key={i}
                  className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[85%] whitespace-pre-wrap rounded-2xl px-4 py-2.5 text-[13.5px] leading-relaxed ${
                      m.role === "user"
                        ? "rounded-br-sm bg-electric text-white"
                        : "rounded-bl-sm border border-line bg-space/70 text-frost/95"
                    }`}
                  >
                    {m.text}
                  </div>
                </div>
              ))}
              {busy && (
                <div className="flex justify-start">
                  <div className="flex gap-1.5 rounded-2xl rounded-bl-sm border border-line bg-space/70 px-4 py-3">
                    {[0, 1, 2].map((i) => (
                      <motion.span
                        key={i}
                        animate={{ opacity: [0.25, 1, 0.25] }}
                        transition={{ duration: 1.1, repeat: Infinity, delay: i * 0.18 }}
                        className="h-1.5 w-1.5 rounded-full bg-neon"
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Entrada */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                void send();
              }}
              className="flex items-center gap-2 border-t border-line p-3"
            >
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={t.placeholder}
                aria-label={t.ariaInput}
                className="min-h-[44px] flex-1 rounded-full border border-line bg-void/60 px-4 text-sm text-frost placeholder:text-mist/60 focus:border-electric/60 focus:outline-none"
              />
              <button
                type="submit"
                aria-label={t.ariaSend}
                disabled={busy || !input.trim()}
                className="flex h-11 w-11 cursor-pointer items-center justify-center rounded-full bg-electric text-white transition-all duration-200 hover:bg-[#3d78ff] active:scale-90 disabled:cursor-default disabled:opacity-40"
              >
                <Send className="h-4 w-4" strokeWidth={1.8} />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
