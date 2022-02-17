import './Home.scss';
import { addElement, addTextElement } from '../../utils/add-element';

export const Home = (): HTMLElement => {
  const home = addElement('main', 'home-page container') as HTMLElement;
  const pageTitle = addTextElement('h1', 'page-title home-page__logo', 'RS Lang') as HTMLElement;

  const mainDescription = addTextElement('p', 'home-page__main-description', 'Это приложение поможет вам освоить 3600 наиболее часто употребляемых слов английского языка.');
  const featureTitle = addTextElement('p', 'home-page__feature-title', 'В наличии:');

  const featureList = `
    <p class="home-page__feature-item"><a class="home-page__link" href="/dictionary">Учебник</a>, в котором ты можешь просматировать все слова, слушать произношение, и отмечать слова как сложные или изученные.<br></p>
    <p class="home-page__feature-item">Игра <a class="home-page__link" href="/gameSprint">Спринт</a>, где необходимо выбрать правильное слово из двух предложенных на время.<br></p>
    <p class="home-page__feature-item">Игра <a class="home-page__link" href="/gameAudioCall">Аудиовызов</a>, в которой необходимо выбрать произнесённое слово из шести предложенных вариантов.</p>
    <p class="home-page__feature-item"><a class="home-page__link" href="/stat">Статистика</a>, в которой ты можешь увидеть прогресс своего обучения.</p>
  `;

  home.append(pageTitle, mainDescription, featureTitle);
  home.insertAdjacentHTML('beforeend', featureList);
  return home;
};
