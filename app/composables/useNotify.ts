import 'simple-notify/dist/simple-notify.css';

export const useNotify = () => {
  const success = async (title: string, text: string = '') => {
    const Notify = (await import('simple-notify')).default;

    new Notify({
      status: 'success',
      title: title,
      text: text,
      effect: 'slide',
      speed: 300,
      showIcon: true,
      showCloseButton: true,
      autoclose: true,
      autotimeout: 3000,
      type: 'outline',
      position: 'right top',
      customClass: 'custom-notify'
    });
  };

  const error = async (title: string, text: string = '') => {
    const Notify = (await import('simple-notify')).default;

    new Notify({
      status: 'error',
      title: title,
      text: text,
      effect: 'slide',
      speed: 300,
      showIcon: true,
      showCloseButton: true,
      autoclose: true,
      autotimeout: 3000,
      type: 'outline',
      position: 'right top',
      customClass: 'custom-notify'
    });
  };

  return {
    success,
    error
  };
};
