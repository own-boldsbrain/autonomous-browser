// Type definitions for ai-elements
declare module "ai-elements" {
  import { ComponentType } from "react";

  export interface MessageProps {
    role: "user" | "assistant";
    content: string;
    timestamp?: Date;
  }

  export interface PromptInputProps {
    value: string;
    onChange: (value: string) => void;
    onSubmit: (message: string) => void;
    placeholder?: string;
    disabled?: boolean;
  }

  export interface ConversationProps {
    messages: Array<{
      id: string;
      role: "user" | "assistant";
      content: string;
    }>;
    onSendMessage: (message: string) => void;
  }

  export const Message: ComponentType<MessageProps>;
  export const PromptInput: ComponentType<PromptInputProps>;
  export const Conversation: ComponentType<ConversationProps>;
}