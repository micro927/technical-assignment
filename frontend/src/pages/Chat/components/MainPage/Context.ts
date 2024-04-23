import { createContext } from 'react';
import type { ChatContextType } from '@/types/chat';

const MainPageChatContext = createContext({} as ChatContextType);
export default MainPageChatContext;
