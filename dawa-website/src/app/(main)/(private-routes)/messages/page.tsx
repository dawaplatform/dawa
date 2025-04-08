import ChatApp from '@/views/pages/messages/ChatApp';
import { ChatProvider } from '@/contexts/ChatContext';

const page = () => {
  return (
    <ChatProvider>
      <ChatApp />
    </ChatProvider>
  );
};

export default page;
