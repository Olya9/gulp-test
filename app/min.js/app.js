const content = document.querySelector(".content");
const diamondItems = content.querySelectorAll(".diamond__item");

function ಠ_ಠ725() {
  diamondItems.forEach((item) => item.classList.add("diamond__pointer"));
  diamondItems.forEach((item) =>
    item.addEventListener("mouseover", () => {
      content.classList.add("bg-color");
    })
  );
  diamondItems.forEach((item) =>
    item.addEventListener("mouseout", () => {
      content.classList.remove("bg-color");
    })
  );
}

diamondItems.forEach((item) => item.addEventListener("click", ಠ_ಠ725));
