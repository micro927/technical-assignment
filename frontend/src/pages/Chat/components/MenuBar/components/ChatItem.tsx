import { AuthenticationContext } from '@/core/authentication/Context';
import type { ChatInfoWithUnread } from '@/types/chat';
import { LayoutOutletContext } from '@/types/userInterface';
import clsx from 'clsx';
import { useContext } from 'react';
import {
  HiOutlineUsers,
  HiOutlineViewGrid,
  HiUsers,
  HiViewGrid,
} from 'react-icons/hi';
import { NavLink, useOutletContext } from 'react-router-dom';

function ChatItem({ chatInfo }: { chatInfo: ChatInfoWithUnread }) {
  const { userInformation } = useContext(AuthenticationContext);
  const { isMobile, setIsOpenMenuBar } =
    useOutletContext<LayoutOutletContext>();
  const membersLength = chatInfo.members.length;
  const isGroupChat = membersLength > 2;

  const Icon = isGroupChat ? HiOutlineViewGrid : HiOutlineUsers;
  const ActiveIcon = isGroupChat ? HiViewGrid : HiUsers;

  const counter = isGroupChat ? `(${membersLength})` : '';

  const friendNames = chatInfo.members
    .filter((member) => member.id !== userInformation?.id)
    .map((member) => member.name);

  const title = isGroupChat
    ? ` ${counter} ${friendNames.join(', ')}`
    : friendNames[0];

  return (
    <NavLink
      to={chatInfo.id}
      onClick={() => isMobile && setIsOpenMenuBar(false)}
    >
      {({ isActive }) => (
        <div
          className={clsx(
            'flex w-full cursor-pointer items-center justify-between rounded-lg p-2 transition duration-100 ',
            isActive
              ? 'bg-gray-200 font-bold dark:bg-gray-700'
              : 'hover:bg-gray-200 dark:hover:bg-gray-700',
          )}
        >
          <div className="flex w-fit flex-auto items-center gap-2 overflow-hidden">
            <div>{isActive ? <ActiveIcon /> : <Icon />}</div>
            <p className="truncate text-sm text-slate-700 dark:text-slate-100">
              {title}
            </p>
          </div>
          {chatInfo.unread && (
            <div className="min-w-fit">
              <div className="text-xxs rounded-full bg-rose-600 px-2.5 py-1 font-bold text-white shadow">
                N
              </div>
            </div>
          )}
        </div>
      )}
    </NavLink>
  );
}

export default ChatItem;
