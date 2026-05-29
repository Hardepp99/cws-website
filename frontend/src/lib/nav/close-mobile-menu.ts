/** Close Bootstrap mobile navbar if open */
export function closeMobileMenu() {
  const collapse = document.getElementById("navbarNav");
  const toggler = document.querySelector<HTMLButtonElement>(".navbar-toggler");
  if (collapse?.classList.contains("show") && toggler) {
    toggler.click();
  }
}
