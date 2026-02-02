interface ConfirmConfig {
  title?: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
}

const isOpen = ref(false);
const isLoading = ref(false);
const config = ref<ConfirmConfig>({
  message: '',
});

let resolvePromise: (value: boolean) => void;

export const useConfirm = () => {
  const ask = (params: ConfirmConfig | string) => {
    if (typeof params === 'string') {
      config.value = { message: params };
    } else {
      config.value = params;
    }
    
    isOpen.value = true;
    isLoading.value = false;
    
    return new Promise<boolean>((resolve) => {
      resolvePromise = resolve;
    });
  };

  const confirm = () => {
    isOpen.value = false;
    resolvePromise(true);
  };

  const cancel = () => {
    isOpen.value = false;
    resolvePromise(false);
  };

  return {
    isOpen,
    isLoading,
    config,
    ask,
    confirm,
    cancel
  };
};
