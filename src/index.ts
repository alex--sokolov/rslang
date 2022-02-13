import './css/styles.scss';
import { navigate } from './engine/router-hash';
import Header from './components/header/header';

const start = () => {
  const root = document.getElementById('root') as HTMLElement;
  root.before(Header());
  window.addEventListener('load', navigate);
  window.addEventListener('hashchange', navigate);
};

start();
