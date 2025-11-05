
export interface ColoringPage {
  id: string;
  src: string;
  prompt: string;
}

export interface ChatMessage {
  id: number;
  text: string;
  sender: 'user' | 'bot';
}
