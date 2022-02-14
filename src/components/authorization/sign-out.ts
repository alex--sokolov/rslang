import { openAuthModal } from './authorization';
import { navigate } from '../../engine/router-hash';

function signOut() {
  const headerButton = document.querySelector('.navbar-auth') as HTMLFormElement;
  const headerName = document.querySelector('.navbar-name') as HTMLSpanElement;

  localStorage.clear();
  headerButton.innerText = 'Войти';
  headerName.innerText = '';
  headerButton.removeEventListener('click', signOut);
  headerButton.addEventListener('click', openAuthModal);
  navigate();
}

export { signOut };
