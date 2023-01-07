let niz = [];

class InputValidator {
  constructor(input, dataContainer) {
    this.input = input;
    this.src = src;
    this.dataContainer = dataContainer;
    this.input.addEventListener("input", this.filterData.bind(this));
    this.src.addEventListener("input", this.filterData.bind(this));
  }

  filterData() {
    const inputText = this.input.value.toLowerCase();

    dataContainer.innerHTML = "";

    let njet = document.querySelector(".no");
    njet.style.display = "none";

    fetch("car.json")
      .then((response) => response.json())
      .then((data) => {
        const filteredItems = data.filter((item) =>
          item.name.toLowerCase().includes(inputText)
        );

        const itemsHTML = filteredItems.map((item) => {
          const carElement = document.createElement("div");
          carElement.classList.add("car");

          const front = document.createElement("div");
          front.classList.add("front");

          const back = document.createElement("div");
          back.classList.add("back");

          carElement.appendChild(front);
          carElement.appendChild(back);
          front.innerHTML = `${item.name} <img src="${item.picture}">`;

          back.innerHTML = `${item.brzina} km ${item.opis} <img src="${item.picture}">`;
          this.dataContainer.appendChild(carElement);
          if (input.value.length === 0) {
            dataContainer.innerHTML = "";
          }
          carElement.addEventListener("click", () => {
            namec.style.display = "none";

            const btn = document.querySelector(".sttart");
            btn.setAttribute("style", " visibility: visible;");

            const carImg = document.createElement("img");
            carImg.src = item.picture;

            const cars = document.createElement("p");
            cars.style.transition = "1s";
            cars.classList.add("raceCar");
            cars.appendChild(carImg);

            const contHolder = document.querySelector(".race");

            contHolder.setAttribute("style", " visibility: visible;");
            contHolder.appendChild(cars);

            input.value = "";
            // console.log(mrg.children.length);
            if (mrg.children.length === 6) {
              cars.remove();
              Toastify({
                text: "Nije moguce izabrati vise od 5 vozila",
                gravity: "top",
                position: "center",

                close: true,
                duration: 1,
                backgroundcolor: "red",
                color: "white",
                duration: 1000,
              }).showToast();
            }
            const rmvEl = document.createElement("button");
            rmvEl.innerHTML = "x";
            rmvEl.classList.add("buttonn");
            cars.appendChild(rmvEl);

            rmvEl.addEventListener("click", () => {
              cars.remove();

              if (mrg.children.length === 0) {
                mrg.style.visibility = "hidden";
                mrg.style.transition = "0s";
                btn.style.visibility = "hidden";
                btn.style.transition = "0s";
              }
            });

            carElement.style.opacity = 0;
            carElement.style.transform = "rotateX(-180deg)";

            setTimeout(() => {
              carElement.remove();
            }, 500);

            let brojac = 0;

            btn.addEventListener("click", () => {
              nameRace.disabled = "true";
              rmvEl.style.display = "none";
              this.input.disabled = "true";
              this.input.placeholder =
                "Posele pocetka trke nije moguce pretrazivati nove vozace!";

              dataContainer.innerHTML = "";
              const speed = item.brzina;
              const targetDistance = cars.offsetWidth - 158;
              let startTime;

              const moveRight = (timestamp) => {
                if (!startTime) startTime = timestamp;
                const progress = timestamp - startTime;
                const distance = (progress / 1000) * speed;
                carImg.style.left = `${distance}px`;

                if (distance >= targetDistance) {
                  niz.push(item.brzina);
                  const max = Math.max(...niz);
                  const min = Math.min(...niz);

                  for (let i = 0; i < niz.length; i++) {
                    if (niz[i] === max) {
                      carImg.classList.add("first");
                    } else if (niz[i] === min) {
                      carImg.classList.add("second");
                    } else {
                      carImg.classList.add("third");
                    }
                  }
                }

                if (distance < targetDistance) {
                  requestAnimationFrame(moveRight);
                }
              };
              requestAnimationFrame(moveRight);
              brojac++;
              btn.textContent = "Nova trka";
              if (brojac > 1) {
                btn.textContent = "Nova trka";
                location.reload();
              }
            });
          });
        });
      });
  }

  validateInput(inputStr) {
    const regex = /^[a-zA-Z\s]+$/;
    return regex.test(inputStr);
  }

  init() {
    this.input.addEventListener("input", () => {
      const inputStr = this.getInputValue();
      if (!this.validateInput(inputStr)) {
        Toastify({
          text: "Uneti tekst nije validan",
          gravity: "top",
          position: "center",
          duration: 1,

          color: "white",
        }).showToast();
      }
    });
  }

  getInputValue() {
    return this.input.value;
  }
}
let mrg = document.querySelector(".race");
const nameRace = document.querySelector(".vozaci");
const input = document.querySelector(".input");
const dataContainer = document.querySelector(".contentHolder");
const src = document.querySelector(".sttart");
const inputValidator = new InputValidator(input, dataContainer);

inputValidator.init();

const rcar = document.querySelector(".race");

const namec = document.querySelector(".vozac");

const copy = document.querySelectorAll(".copy");
nameRace.addEventListener("mouseover", () => {
  nameRace.innerHTML = "Klikni za imena vozaca";
});

nameRace.addEventListener("mouseleave", () => {
  nameRace.innerHTML = "Imena";
});

nameRace.addEventListener("click", () => {
  namec.style.display = "flex";
});

copy.forEach((item) => {
  item.addEventListener("click", () => {
    navigator.clipboard.writeText(item.textContent);

    // Obavijestite korisnika da je tekst uspješno kopiran
    Toastify({
      text: "Tekst je kopiran",
      gravity: "top",
      position: "center",
      duration: 1,

      color: "white",
    }).showToast();
    nameRace.innerHTML = "Imena";
    namec.style.display = "none";
  });
});
