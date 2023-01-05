let niz = [];
class InputValidator {
  constructor(input, dataContainer) {
    this.input = input;
    this.dataContainer = dataContainer;
    this.input.addEventListener("input", this.filterData.bind(this));
  }

  filterData() {
    const inputText = this.input.value;
    fetch("car.json")
      .then((response) => response.json())
      .then((data) => {
        const filteredData = data.filter((item) =>
          item.name.includes(inputText)
        );
        for (const item of filteredData) {
          if (inputText == item.name) {
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

            let count = 0;
            carElement.addEventListener("click", () => {
              const btn = document.querySelector(".sttart");
              btn.setAttribute("style", " visibility: visible;");
              const raceHolder = document.createElement("div");
              const carImg = document.createElement("img");
              carImg.src = item.picture;

              const cars = document.createElement("p");
              cars.classList.add("raceCar");
              cars.appendChild(carImg);
              if (count < 5) {
                const contHolder = document.querySelector(".race");
                contHolder.setAttribute("style", " visibility: visible;");
                contHolder.appendChild(cars);

                input.value = "";
                count++;
              } else {
                alert("Nije moguce uneti vise od 5 vozila");
              }
              let broj;
              btn.addEventListener("click", () => {
                btn.disabled = true;
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

                carElement.style.pointerEvents = "none";
              });
            });
          }
        }
      });
  }

  validateInput(inputStr) {
    const regex = /^[a-zA-Z\s]+$/;
    return regex.test(inputStr);
  }

  init() {
    this.input.addEventListener("keyup", () => {
      const inputStr = this.getInputValue();
      if (!this.validateInput(inputStr)) {
        alert("Uneti tekst nije validan.");
      }
    });
  }

  getInputValue() {
    return this.input.value;
  }
}

const input = document.querySelector(".input");
const dataContainer = document.querySelector(".contentHolder");

const inputValidator = new InputValidator(input, dataContainer);

inputValidator.init();
