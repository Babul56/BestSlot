# Live Support Chat Implementation Plan

## Backend (API Routes)
-   [ ] **`POST /api/support/conversations`**: Create a new conversation. This should create a new conversation in the database and return the `conversationId`.
-   [ ] **`GET /api/support/conversations`**: Fetch all conversations for the support agent dashboard.
-   [ ] **`GET /api/support/conversations/[conversationId]`**: Fetch messages for a specific conversation.
-   [ ] **`POST /api/support/conversations/[conversationId]/messages`**: Send a new message. This endpoint will receive the message, save it to the database, and then publish it to the appropriate Ably channel.
-   [ ] **`GET /api/ably/auth`**: Create an API endpoint to authenticate clients with Ably. This is crucial for securing the chat.

## Frontend (React Components & Hooks)

### User-Facing Chat
-   [ ] Create a `SupportButton` component that, when clicked, initiates a new chat conversation.
-   [ ] Create a `UserChatBox` component that appears when a chat is active.
-   [ ] Inside `UserChatBox`, implement logic to:
    -   [ ] Fetch chat history.
    -   [ ] Connect to the conversation's Ably channel.
    -   [ ] Display messages.
    -   [ ] Send new messages via the API.
    -   [ ] Receive real-time messages from the agent.

### Agent-Facing Dashboard
-   [ ] **`app/support/agent/chat-sidebar.tsx`**:
    -   [ ] Fetch and display a list of all support conversations.
    -   [ ] Indicate which conversations have unread messages.
    -   [ ] Allow agents to select a conversation to view.
-   [ ] **`app/support/agent/[conversationId]/chat-conversation.tsx`**:
    -   [ ] Fetch and display the message history for the selected conversation.
    -   [ ] Connect to the conversation's Ably channel.
    -   [ ] Implement a message input form to send replies.
    -   [ ] Receive real-time messages from the user.
-   [ ] **`app/support/agent/[conversationId]/chat-header.tsx`**:
    -   [ ] Display information about the user in the current conversation.

## Ably Real-time Integration
-   [ ] **Ably Provider**: Create an `AblyProvider` component to wrap the application and provide an Ably client instance.
-   [ ] **`hooks/use-ably-channel.ts`**: Create a custom hook to encapsulate the logic for subscribing to an Ably channel, receiving messages, and unsubscribing on component unmount.
-   [ ] **Publishing from Backend**: Ensure the `POST /api/support/conversations/[conversationId]/messages` endpoint correctly publishes messages to the Ably channel after saving them.
-   [ ] **Client-side Subscriptions**: Use the `use-ably-channel.ts` hook in both the user and agent chat components to receive messages in real-time.

## Database (Prisma Schema)
-   [ ] **`Conversation` model**:
    -   `id` (PK)
    -   `userId` (FK to User)
    -   `createdAt`
    -   `updatedAt`
    -   `status` (e.g., `OPEN`, `CLOSED`)
-   [ ] **`Message` model**:
    -   `id` (PK)
    -   `content` (String)
    -   `createdAt`
    -   `conversationId` (FK to Conversation)
    -   `senderId` (FK to User - could be user or agent)
    -   `read` (Boolean, to track if the message has been read)
-   [ ] Update `prisma/schema.prisma` and run `prisma migrate`.
