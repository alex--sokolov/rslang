import { openAuthModal } from './authorization';
import { navigate } from '../../engine/router-hash';
import { clearLocationHashParams } from '../../utils/parse-url';

const signOut = async () => {
  const headerButton = document.querySelector('.navbar-auth') as HTMLFormElement;
  const headerName = document.querySelector('.navbar-name') as HTMLSpanElement;

  localStorage.clear();
  headerButton.innerText = 'Войти';
  headerName.innerText = '';
  headerButton.removeEventListener('click', signOut);
  headerButton.addEventListener('click', openAuthModal);
  await navigate();
  // location.hash = clearLocationHashParams(location.hash);
}

export { signOut };
