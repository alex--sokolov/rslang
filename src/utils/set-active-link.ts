const setActiveLink = (hash: string) => {
  const links = document.getElementsByClassName('navbar-item') as HTMLCollectionOf<HTMLLinkElement>;
  [...links].forEach((link: HTMLLinkElement, i) => {
    const pageName = link?.getAttribute('href')?.substr(1);
    pageName === hash ? link.classList.add('active') : link.classList.remove('active');
  })
}

export default setActiveLink;
