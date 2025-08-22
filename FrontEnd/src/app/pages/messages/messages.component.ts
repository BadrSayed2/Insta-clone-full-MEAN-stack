import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";

interface Chat {
  id: number;
  username: string;
  fullName: string;
  avatar: string;
  lastMessage: string;
  timestamp: string;
  isOnline: boolean;
  unreadCount: number;
}

interface Message {
  id: number;
  senderId: number;
  text: string;
  timestamp: string;
  isOwn: boolean;
}

@Component({
  selector: "app-messages",
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="max-w-6xl mx-auto py-8 px-4">
      <div
        class="bg-white dark:bg-gray-900 border border-instagram-border dark:border-gray-800 rounded-lg overflow-hidden h-[600px] flex"
      >
        <!-- Chat List -->
        <div class="w-1/3 border-r border-instagram-border">
          <!-- Header -->
          <div class="p-4 border-b border-instagram-border">
            <h2 class="text-xl font-semibold">Messages</h2>
          </div>

          <!-- Chat List -->
          <div class="overflow-y-auto h-full">
            <div
              *ngFor="let chat of chats"
              (click)="selectChat(chat)"
              class="flex items-center p-4 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition-colors"
              [ngClass]="{
                'bg-gray-100': selectedChat?.id === chat.id,
                'dark:bg-gray-800': selectedChat?.id === chat.id,
              }"
            >
              <div class="relative mr-3">
                <div class="w-12 h-12 bg-gray-300 rounded-full"></div>
                <div
                  *ngIf="chat.isOnline"
                  class="absolute bottom-0 right-0 w-4 h-4 bg-green-500 border-2 border-white rounded-full"
                ></div>
              </div>

              <div class="flex-1 min-w-0">
                <div class="flex justify-between items-center">
                  <h3 class="font-semibold text-sm truncate">
                    {{ chat.fullName }}
                  </h3>
                  <span
                    class="text-instagram-gray dark:text-gray-400 text-xs"
                    >{{ chat.timestamp }}</span
                  >
                </div>
                <div class="flex justify-between items-center">
                  <p
                    class="text-instagram-gray dark:text-gray-300 text-sm truncate"
                  >
                    {{ chat.lastMessage }}
                  </p>
                  <div
                    *ngIf="chat.unreadCount > 0"
                    class="bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center ml-2"
                  >
                    {{ chat.unreadCount }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Chat Area -->
        <div class="flex-1 flex flex-col" *ngIf="selectedChat">
          <!-- Chat Header -->
          <div
            class="p-4 border-b border-instagram-border dark:border-gray-800 flex items-center justify-between"
          >
            <div class="flex items-center space-x-3">
              <div class="relative">
                <div class="w-10 h-10 bg-gray-300 rounded-full"></div>
                <div
                  *ngIf="selectedChat.isOnline"
                  class="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"
                ></div>
              </div>
              <div>
                <h3 class="font-semibold text-sm">
                  {{ selectedChat.fullName }}
                </h3>
                <p
                  class="text-instagram-gray text-xs"
                  *ngIf="selectedChat.isOnline"
                >
                  Active now
                </p>
              </div>
            </div>

            <div class="flex items-center space-x-2">
              <button
                class="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full"
              >
                <svg
                  class="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                  ></path>
                </svg>
              </button>
              <button
                class="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full"
              >
                <svg
                  class="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                  ></path>
                </svg>
              </button>
              <button
                class="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full"
              >
                <svg
                  class="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  ></path>
                </svg>
              </button>
            </div>
          </div>

          <!-- Messages -->
          <div class="flex-1 overflow-y-auto p-4 space-y-4">
            <div
              *ngFor="let message of messages"
              class="flex"
              [class.justify-end]="message.isOwn"
            >
              <div
                class="max-w-xs px-4 py-2 rounded-2xl"
                [class.bg-instagram-blue]="message.isOwn"
                [class.text-white]="message.isOwn"
                [class.bg-gray-100]="!message.isOwn"
                [class.text-gray-900]="!message.isOwn"
              >
                <p class="text-sm">{{ message.text }}</p>
                <p class="text-xs mt-1 opacity-70">{{ message.timestamp }}</p>
              </div>
            </div>
          </div>

          <!-- Message Input -->
          <div
            class="p-4 border-t border-instagram-border dark:border-gray-800"
          >
            <div class="flex items-center space-x-3">
              <button
                class="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full"
              >
                <svg
                  class="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
                  ></path>
                </svg>
              </button>

              <input
                type="text"
                [(ngModel)]="newMessage"
                placeholder="Message..."
                class="flex-1 px-4 py-2 bg-gray-100 dark:bg-gray-800 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 rounded-full outline-none focus:ring-2 focus:ring-instagram-blue"
                (keypress)="onKeyPress($event)"
              />

              <button
                (click)="sendMessage()"
                [disabled]="!newMessage.trim()"
                class="text-instagram-blue font-semibold hover:text-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Send
              </button>
            </div>
          </div>
        </div>

        <!-- No Chat Selected -->
        <div
          *ngIf="!selectedChat"
          class="flex-1 flex items-center justify-center text-center text-instagram-gray"
        >
          <div>
            <svg
              class="w-16 h-16 mx-auto mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
              ></path>
            </svg>
            <h3 class="text-lg font-semibold mb-2">Your Messages</h3>
            <p>Send private photos and messages to a friend or group.</p>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class MessagesComponent {
  selectedChat: Chat | null = null;
  newMessage = "";

  chats: Chat[] = [
    {
      id: 1,
      username: "jane_smith",
      fullName: "Jane Smith",
      avatar: "",
      lastMessage: "Hey! How are you doing?",
      timestamp: "2m",
      isOnline: true,
      unreadCount: 2,
    },
    {
      id: 2,
      username: "mike_jones",
      fullName: "Mike Jones",
      avatar: "",
      lastMessage: "Thanks for sharing that photo!",
      timestamp: "1h",
      isOnline: false,
      unreadCount: 0,
    },
    {
      id: 3,
      username: "sarah_wilson",
      fullName: "Sarah Wilson",
      avatar: "",
      lastMessage: "Can't wait to see you this weekend",
      timestamp: "3h",
      isOnline: true,
      unreadCount: 1,
    },
    {
      id: 4,
      username: "alex_brown",
      fullName: "Alex Brown",
      avatar: "",
      lastMessage: "That was an amazing concert!",
      timestamp: "1d",
      isOnline: false,
      unreadCount: 0,
    },
  ];

  messages: Message[] = [
    {
      id: 1,
      senderId: 2,
      text: "Hey there! How's your day going?",
      timestamp: "2:30 PM",
      isOwn: false,
    },
    {
      id: 2,
      senderId: 1,
      text: "Going great! Just finished a photography session.",
      timestamp: "2:32 PM",
      isOwn: true,
    },
    {
      id: 3,
      senderId: 2,
      text: "That sounds awesome! Can't wait to see the photos.",
      timestamp: "2:35 PM",
      isOwn: false,
    },
    {
      id: 4,
      senderId: 1,
      text: "I'll share them on my story later today!",
      timestamp: "2:37 PM",
      isOwn: true,
    },
  ];

  selectChat(chat: Chat) {
    this.selectedChat = chat;
    chat.unreadCount = 0;
  }

  sendMessage() {
    if (this.newMessage.trim() && this.selectedChat) {
      const message: Message = {
        id: this.messages.length + 1,
        senderId: 1, // Current user
        text: this.newMessage.trim(),
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        isOwn: true,
      };

      this.messages.push(message);

      // Update the last message in chat list
      this.selectedChat.lastMessage = this.newMessage.trim();
      this.selectedChat.timestamp = "now";

      this.newMessage = "";
    }
  }

  onKeyPress(event: KeyboardEvent) {
    if (event.key === "Enter") {
      this.sendMessage();
    }
  }
}
