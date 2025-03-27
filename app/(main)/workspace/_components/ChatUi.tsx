"use client";
import React, { useContext, useEffect, useRef, useState } from "react";
import EmptyChatState from "./EmptyChatState";
import { Button } from "@/components/ui/button";
import { Loader2Icon, Send } from "lucide-react";
import { Input } from "@/components/ui/input";
import AiModelOptions from "@/services/AiModelOptions";
import { AssistantContext } from "@/context/AssistantContext";
import axios from "axios";
import Image from "next/image";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { AuthContext } from "@/context/AuthContext";
import { ASSISTANT } from "../../ai-assistants/page";

type MESSAGE = {
  role: string;
  content: string;
};

function ChatUi() {
  const [input, setInput] = useState<string>("");
  const { assistant } = useContext(AssistantContext);
  const [messages, setMessages] = useState<MESSAGE[]>([]);
  const [loading, setLoading] = useState(false);
  const chatRef = useRef<HTMLDivElement>(null);
  const {user, setUser}=useContext(AuthContext)
  const UpdateTokens=useMutation(api.users.UpdateTokens);

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    setMessages([]);
  }, [assistant?.id]);

  const onSendMessage = async () => {
    if (!input.trim()) return; // Prevent empty messages
    setLoading(true);

    const userMessage: MESSAGE = {
      role: "user",
      content: input,
    };

    const loadingMessage: MESSAGE = {
      role: "assistant",
      content: "Loading...",
    };

    setMessages((prev) => [...prev, userMessage, loadingMessage]);

    const userInput = input;
    setInput("");

    const AIModel = AiModelOptions.find(
      (item) => item.name === assistant.aiModelId
    );

    try {
      const result = await axios.post<{ content: string }>("/api/eden-ai-model", {
        provider: AIModel?.edenAi,
        userInput: `${userInput}: ${assistant?.instruction}: ${assistant?.userInstruction}`,
        aiResp: messages[messages?.length - 1]?.content,
      });

      if (result?.data?.content) {
        setMessages((prev) => [
          ...prev.slice(0, -1),
          { role: "assistant", content: result.data.content },
        ]);
        updateUserToken(result.data.content);
      } else {
        throw new Error("Invalid response from AI model");
      }
    } catch (error) {
      setMessages((prev) => [
        ...prev.slice(0, -1),
        { role: "assistant", content: "Error fetching response." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const updateUserToken = async (resp: string) => {
    const tokenCount = resp.trim() ? resp.trim().split(/\s+/).length : 0;
    console.log(tokenCount);
    // Update User token logic here
    const result=await UpdateTokens({
      credits:user?.credits-tokenCount,
      uid:user?._id
    })
    setUser((prev:ASSISTANT)=>({
      ...prev,
      credits:user?.credits-tokenCount,
    }))
    console.log(result);
    
  };

  return (
    <div className="mt-20 p-6 relative h-[88vh]">
      {messages?.length === 0 && <EmptyChatState />}

      <div ref={chatRef} className="h-[74vh] overflow-y-scroll scrollbar-hide">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex mb-2 ${
              msg.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div className="flex gap-3">
              {msg.role === "assistant" && assistant?.image && (
                <Image
                  src={assistant.image}
                  alt="assistant"
                  width={30}
                  height={30}
                  className="h-[30px] w-[30px] rounded-full object-cover"
                />
              )}
              <div
                className={`p-3 rounded-lg flex gap-2 ${
                  msg.role === "user"
                    ? "bg-gray-200 text-black rounded-lg"
                    : "bg-gray-100 text-black"
                }`}
              >
                {msg.content === "Loading..." ? (
                  <Loader2Icon className="animate-spin" />
                ) : (
                  <h2>{msg.content}</h2>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-between p-5 gap-5 absolute bottom-5 w-[94%]">
        <Input
          placeholder="Start typing here..."
          value={input}
          disabled={loading||user?.credits<=0}
          onChange={(event) => setInput(event.target.value)}
          onKeyPress={(e) => e.key === "Enter" && onSendMessage()}
        />
        <Button onClick={onSendMessage} disabled={loading||user?.credits<=0}>
          {loading ? <Loader2Icon className="animate-spin" /> : <Send />}
        </Button>
      </div>
    </div>
  );
}

export default ChatUi;
