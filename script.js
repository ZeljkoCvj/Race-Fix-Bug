let niz = [];

class filterInput {
  constructor(input, dataContainer) {
    this.input = input;
    this.dataContainer = dataContainer;
    this.nameRace = document.querySelector(".vozaci");
    this.input.addEventListener("input", this.filterData.bind(this));
    this.init();
  }

  filterData() {
    const inputText = this.input.value.toLowerCase();

    dataContainer.innerHTML = "";

    let listaVozaca = document.querySelector(".listaVozaca");
    listaVozaca.style.display = "none";

    fetch("car.json")
      .then((response) => response.json())
      .then((data) => {
        const filteredItems = data.filter((item) =>
          item.name.toLowerCase().includes(inputText)
        );

        const itemsHTML = filteredItems.map((item) => {
          const domElement = document.createElement("div");
          domElement.classList.add("car");

          const front = document.createElement("div");
          front.classList.add("front");

          const back = document.createElement("div");
          back.classList.add("back");

          domElement.appendChild(front);
          domElement.appendChild(back);
          front.innerHTML = `${item.name} <img src="${item.picture}">`;

          back.innerHTML = `${item.brzina} km ${item.opis} <img src="${item.picture}">`;
          this.dataContainer.appendChild(domElement);
          if (input.value.length === 0) {
            dataContainer.innerHTML = "";
          }
          domElement.addEventListener("click", () => {
            dataContainer.innerHTML = "";
            namec.style.display = "none";
            const button = document.querySelector(".sttart");
            button.setAttribute("style", " visibility: visible;");
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

            if (contHolder.children.length === 6) {
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
            const removemvEl = document.createElement("button");
            removemvEl.innerHTML = "x";
            removemvEl.classList.add("buttonn");
            cars.appendChild(removemvEl);

            removemvEl.addEventListener("click", () => {
              cars.remove();

              if (contHolder.children.length === 0) {
                contHolder.style.visibility = "hidden";
                contHolder.style.transition = "0s";
                button.style.visibility = "hidden";
                button.style.transition = "0s";
              }
            });

            domElement.style.opacity = 0;
            domElement.style.transform = "rotateX(-180deg)";

            setTimeout(() => {
              domElement.remove();
            }, 500);

            let brojac = 0;

            button.addEventListener("click", () => {
              this.nameRace.disabled = "true";
              removemvEl.style.display = "none";
              this.input.disabled = "true";
              this.input.placeholder =
                "Posele pocetka trke nije moguce pretrazivati nove vozace!";

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
              button.textContent = "Nova trka";
              if (brojac > 1) {
                button.textContent = "Nova trka";
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

class nameRace {
  constructor(element) {
    this.element = element;
    this.namec = document.querySelector(".vozac");
    this.copy = document.querySelectorAll(".copy");
    this.bindEvents();
    this.copyElement();
  }

  bindEvents() {
    this.element.addEventListener("mouseover", () => {
      this.element.innerHTML = "Klikni za imena vozaca";
    });

    this.element.addEventListener("mouseleave", () => {
      this.element.innerHTML = "Imena";
    });

    this.element.addEventListener("click", () => {
      this.namec.style.display = "flex";
    });
  }
  copyElement() {
    this.copy.forEach((item) => {
      item.addEventListener("click", () => {
        navigator.clipboard.writeText(item.textContent);

        Toastify({
          text: "Tekst je kopiran",
          gravity: "top",
          position: "center",
          duration: 1,
          color: "white",
        }).showToast();
        this.element.innerHTML = "Imena";
        this.namec.style.display = "none";
      });
    });
  }
}

const input = document.querySelector(".input");
const dataContainer = document.querySelector(".contentHolder");
const nameRacee = document.querySelector(".vozaci");
const namec = document.querySelector(".vozac");
const inputValidator = new filterInput(input, dataContainer);
const nameRaceInstance = new nameRace(nameRacee);
