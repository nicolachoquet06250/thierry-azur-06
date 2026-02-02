export const useAdminSidebar = () => {
  const isOpen = useState('admin_sidebar_open', () => false);

  const toggle = () => {
    isOpen.value = !isOpen.value;
  };

  const close = () => {
    isOpen.value = false;
  };

  const open = () => {
    isOpen.value = true;
  };

  return {
    isOpen,
    toggle,
    close,
    open
  };
};
