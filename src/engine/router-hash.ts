import { routes } from './routes';
import setActiveLink from '../utils/set-active-link';
import { makeLogger } from 'ts-loader/dist/logger';

const router = async (route: string[] = routes['/']) => {
  const currentView = await import(`../views/${route[0]}/${route[0]}`);
  const root = document.getElementById('root') as HTMLElement;
  const pageContent = await currentView[route[0]]();
  root.innerText = '';
  root.append(pageContent);
};

const navigate = async () => {
  let hash: string = location.hash === '' ? '/' : location.hash.substr(1);
  if (!routes.hasOwnProperty(hash)) hash = '404';
  setActiveLink(hash);
  await router(routes[hash]);
};

export { router, navigate };
