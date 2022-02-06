import { openAuthModal } from './authorization';

function signOut() {
  const headerButton = document.querySelector('.navbar-auth') as HTMLFormElement;
  const headerName = document.querySelector('.navbar .navbar-name') as HTMLSpanElement;

  localStorage.clear();
  headerButton.innerText = 'Войти';
  headerName.innerText = '';
  headerButton.addEventListener('click', openAuthModal);
}

export { signOut };
