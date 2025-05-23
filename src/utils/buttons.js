export const changeTooltipColor = async (color) => {
  setTimeout(() => {
    const element = document.getElementsByClassName("p-tooltip-text");
    if (element.length > 0) {
      element[0].className = "p-tooltip-text";
      element[0].classList.add("text-" + color);
      element[0].classList.add("bg-" + color);
    }
  }, 50);
};
