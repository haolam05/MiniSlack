export const disabledSubmitButton = () => {
  document.querySelector("button[type=submit]").setAttribute("disabled", "");
}

export const enabledSubmitButton = () => {
  document.querySelector("button[type=submit]").removeAttribute("disabled");
}

export const select = e => {
  const parentElement = e.target.closest(".workspaces-list");
  if (!parentElement) return;
  const children = Array.from(parentElement.children);

  children.forEach(el => el.classList.remove("selected"));
  e.target.classList.add("selected");
}
