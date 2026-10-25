function randomPromise() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (Math.random() > 0.5) {
        resolve("success, Hello World");
      } else {
        reject("failed, Error occurred");
      }
    }, 1000);
  });
}

// for exercise logic
randomPromise()
  .then((message) => {
    console.log(message);
  })
  .catch((error) => {
    console.error(error);
  });

function fetchData() {
  return new Promise((resolve) => {
    setTimeout(() => {
      const randomNumber = Math.floor(Math.random() * 10) + 1;
      resolve(randomNumber);
    }, 500);
  });
}

function doubleAndAdd(onNumbers = () => {}) {
  return Promise.all([fetchData(), fetchData()]).then((results) => {
    const firstNumber = results[0];
    const secondNumber = results[1];
    onNumbers(firstNumber, secondNumber);
    if (firstNumber < 2 || secondNumber < 2) {
      throw new RangeError("Not in valid range");
    }
    const finalResult = firstNumber * 2 + secondNumber;
    return finalResult;
  });
}

// for exercise logic
doubleAndAdd()
  .then((result) => {
    console.log(result);
  })
  .catch((error) => {
    console.error(error.message);
  });

const randomButton = document.querySelector("#random-button");
const promisePanel = document.querySelector("#promise-panel");
const randomStatus = document.querySelector("#random-status");
const randomResult = document.querySelector("#random-result");
const randomCaption = document.querySelector("#random-caption");
const calculationButton = document.querySelector("#calculation-button");
const calculationStatus = document.querySelector("#calculation-status");

randomButton.addEventListener("click", () => {
  randomButton.disabled = true;
  promisePanel.dataset.state = "pending";
  randomStatus.textContent = "Running...";
  randomStatus.dataset.state = "pending";
  randomResult.textContent = "…";
  randomCaption.textContent = "Waiting for the promise to settle.";

  randomPromise()
    .then((message) => {
      promisePanel.dataset.state = "success";
      randomStatus.textContent = "Resolved";
      randomStatus.dataset.state = "success";
      randomResult.textContent = message.replace("success, ", "");
      randomCaption.textContent = "The promise resolved successfully.";
    })
    .catch((error) => {
      promisePanel.dataset.state = "error";
      randomStatus.textContent = "Rejected";
      randomStatus.dataset.state = "error";
      randomResult.textContent = error.replace("failed, ", "");
      randomCaption.textContent = "The promise was rejected.";
    })
    .finally(() => {
      randomButton.disabled = false;
    });
});

calculationButton.addEventListener("click", () => {
  calculationButton.disabled = true;
  calculationStatus.textContent = "Fetching two numbers...";
  calculationStatus.dataset.state = "pending";
  document.querySelector("#final-result").textContent = "# …";

  doubleAndAdd((first, second) => {
    document.querySelector("#first-number").textContent = first;
    document.querySelector("#second-number").textContent = second;
  })
    .then((result) => {
      document.querySelector("#final-result").textContent = `# ${result}`;
      calculationStatus.textContent = "Calculation completed successfully.";
      calculationStatus.dataset.state = "success";
    })
    .catch((error) => {
      document.querySelector("#final-result").textContent = "# —";
      calculationStatus.textContent =
        error instanceof RangeError
          ? "Not in a valid range. Both numbers must be at least 2."
          : error.message;
      calculationStatus.dataset.state = "error";
    })
    .finally(() => {
      calculationButton.disabled = false;
    });
});
