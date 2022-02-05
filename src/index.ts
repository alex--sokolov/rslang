import './css/styles.scss';
import { navigate } from './engine/router-hash';
import NavBar from "./components/navbar/navbar";

const start = () => {
  const root = document.getElementById('root') as HTMLElement;
  root.before(NavBar());
  window.addEventListener('load', navigate);
  window.addEventListener('hashchange', navigate);
}

start();
