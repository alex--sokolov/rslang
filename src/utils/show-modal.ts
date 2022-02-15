import './show-modal.scss';
import { addElement, addTextElement } from './add-element';
import { navigate } from '../engine/router-hash';

export const showModal = (element: HTMLElement): void => {
  const overlay = document.querySelector('.overlay') as HTMLElement;
  const overlayFadeInClass = 'overlay-fadeIn';
  const modalClass = 'modal-window';
  const modalOld = document.getElementById(modalClass);
  const activeModalClass = 'modal-active';
  const closeModalClass = 'modal-close';
  const modal = addElement('div', modalClass, modalClass);
  const closeModal = addTextElement('button', closeModalClass, 'Закрыть');
  modal.classList.add(activeModalClass);
  overlay.classList.add(overlayFadeInClass);

  const removeModal = async (modalEl: HTMLElement, overlayListener?: void) => {
    modalEl.remove();
    if (overlay.classList.contains(overlayFadeInClass)) overlay.classList.remove(overlayFadeInClass);
    if (overlayListener) overlay.removeEventListener('click', overlayListener);
    //await navigate();
  };

  if (modalOld) removeModal(modalOld);

  closeModal.addEventListener(
    'click',
    async () => {
      removeModal(modal);
      await navigate();
    },
    { once: true }
  );

  const overlayListener = overlay.addEventListener(
    'click',
    () => {
      removeModal(modal, overlayListener);
    },
    { once: true }
  );

  const root = document.getElementById('root') as HTMLDivElement;
  modal.append(element);
  modal.append(closeModal);
  root.append(modal);
};
