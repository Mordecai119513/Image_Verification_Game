document.addEventListener("DOMContentLoaded", function () {
  const grid = document.querySelector("#grid");
  const scoreDisplay = document.querySelector(".score");
  const timerDisplay = document.querySelector(".timer");
  let score = 0;
  let timeLeft = 5;
  let timerInterval = null;

  const images = [
    "/images/1r.jpg",
    "/images/2r.jpg",
    "/images/3r.png",
    "/images/4r.jpg",
    "/images/5.jpg",
    "/images/6.jpg",
    "/images/7.jpg",
    "/images/8.jpg",
    "/images/9.jpg",
    "/images/10.jpg",
    "/images/11.jpg",
    "/images/12.jpg",
    "/images/13.jpg",
    "/images/14.jpg",
  ];
  const correctImages = images.filter((image) => image.includes("r"));

  function startTimer() {
    timerInterval = setInterval(() => {
      timeLeft--;
      timerDisplay.textContent = timeLeft;
      if (timeLeft <= 0) {
        clearInterval(timerInterval);
        timeOut();
      }
    }, 1000);
  }

  function resetTimer() {
    clearInterval(timerInterval);
    timeLeft = 5;
    timerDisplay.textContent = timeLeft;
    startTimer();
  }

  function timeOut() {
    alert("時間到！請再試一次。");
    score = Math.max(0, score - 1);
    scoreDisplay.textContent = `分數: ${score}`;
    createGrid();
  }

  function createGrid() {
    resetTimer();

    const chosenImages = [];
    const correctCount = Math.floor(Math.random() * 3) + 1;
    const incorrectCount = 9 - correctCount;

    let availableCorrectImages = [...correctImages];
    let availableIncorrectImages = images.filter(
      (image) => !image.includes("r")
    );

    while (
      chosenImages.length < correctCount &&
      availableCorrectImages.length > 0
    ) {
      const index = Math.floor(Math.random() * availableCorrectImages.length);
      chosenImages.push(availableCorrectImages[index]);
      availableCorrectImages.splice(index, 1);
    }

    while (chosenImages.length < 9 && availableIncorrectImages.length > 0) {
      const index = Math.floor(Math.random() * availableIncorrectImages.length);
      chosenImages.push(availableIncorrectImages[index]);
      availableIncorrectImages.splice(index, 1);
    }

    chosenImages.sort(() => Math.random() - 0.5);

    grid.innerHTML = "";
    chosenImages.forEach((image) => {
      const img = document.createElement("img");
      img.src = image;
      img.alt = "Image could not be loaded";
      img.onerror = function () {
        console.error("Failed to load image at " + img.src);
        img.style.display = "none";
      };
      img.classList.add("image-tile");
      img.onclick = () => selectImage(img);
      grid.appendChild(img);
    });
  }

  function selectImage(img) {
    img.classList.toggle("selected");
  }

  function verifySelection() {
    clearInterval(timerInterval);

    const displayedImages = [...grid.querySelectorAll("img")];
    const currentCorrectImages = displayedImages.filter((img) => {
      let imgUrl = new URL(img.src);
      return correctImages.some((correctSrc) =>
        imgUrl.pathname.endsWith(correctSrc)
      );
    });
    const currentCorrectCount = currentCorrectImages.length;

    const selectedImages = [...grid.querySelectorAll(".selected")];
    let correctSelections = 0;

    selectedImages.forEach((img) => {
      let imgUrl = new URL(img.src);
      if (
        correctImages.some((correctSrc) => imgUrl.pathname.endsWith(correctSrc))
      ) {
        correctSelections++;
      }
    });

    let resultModal;
    if (
      correctSelections === currentCorrectCount &&
      selectedImages.length === correctSelections
    ) {
      score += correctSelections;
      scoreDisplay.textContent = `分數: ${score}`;
      createGrid();
      resultModal = new bootstrap.Modal(
        document.getElementById("successModal"),
        { keyboard: false }
      );
      resultModal.show();
    } else {
      score = Math.max(0, score - 1);
      scoreDisplay.textContent = `分數: ${score}`;
      createGrid();
      resultModal = new bootstrap.Modal(
        document.getElementById("failureModal"),
        { keyboard: false }
      );
      resultModal.show();
    }
  }

  createGrid();

  const verifyButton = document.querySelector(".verify");
  verifyButton.addEventListener("click", verifySelection);
});

//測試git用