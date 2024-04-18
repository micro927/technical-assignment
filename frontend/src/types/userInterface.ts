import { SetState } from './utils';

export type NavbarContext = {
  open: boolean;
  mobileOpen: boolean;
  foldedOpen: boolean;
  setOpen: SetState<boolean>;
  setMobileOpen: SetState<boolean>;
  setFoldedOpen: SetState<boolean>;
  toggle: () => void;
  toggleMobile: () => void;
};

export type UserInterfaceContextType = {
  navbar: NavbarContext;
};

export type UserInterfaceProviderType = ({
  children,
}: {
  children: JSX.Element;
}) => JSX.Element;
