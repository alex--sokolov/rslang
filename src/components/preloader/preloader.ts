const getPreloader = (): HTMLElement => {
  return document.getElementById('holder') as HTMLDivElement;
};

export const addPreloader = (): void => {
  document.body.onload = () => {
    setTimeout(() => {
      const preloader = getPreloader();
      if (!preloader.classList.contains('hide')) {
        preloader.classList.add('hide');
      }
    }, 500);
  };
};

export const showPreloader = (): void => {
  const preloader = getPreloader();
  // root = document.getElementById('root') as HTMLElement;
  //root.style.filter = 'blur(5px)';
  preloader?.classList.remove('hide');
};

export const hidePreloader = (): void => {
  const preloader = getPreloader();
  //const root = document.getElementById('root') as HTMLElement;
  if (!preloader?.classList.contains('hide')) {
    preloader.classList.add('hide');
  }
  //root.style.filter = '';
};
