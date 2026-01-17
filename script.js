const defaultWords = [
  "Cat",
  "Dog",
  "Sun",
  "Moon",
  "Ball",
  "Star",
  "Fish",
  "Tree",
  "Duck",
  "Car",
  "Book",
  "Milk",
  "Cake",
  "Bird",
  "Bear",
  "Ship",
];

const targetWordEl = document.getElementById("target-word");
const boardEl = document.getElementById("board");
const feedbackEl = document.getElementById("feedback");
const scoreEl = document.getElementById("score");
const triesEl = document.getElementById("tries");
const newRoundBtn = document.getElementById("new-round");
const resetBtn = document.getElementById("reset");
const soundBtn = document.getElementById("sound-btn");
const customWordsEl = document.getElementById("custom-words");
const useCustomBtn = document.getElementById("use-custom");
const loadRandomBtn = document.getElementById("load-random");
const wordStatusEl = document.getElementById("word-status");

let score = 0;
let tries = 0;
let currentWord = "";
let wordBank = [...defaultWords];

const shuffle = (array) => {
  const result = array.slice();
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
};

const pickWords = () => {
  const shuffled = shuffle(wordBank);
  const roundWords = shuffled.slice(0, 6);
  currentWord = roundWords[Math.floor(Math.random() * roundWords.length)];
  return roundWords;
};

const speakWord = () => {
  if (!window.speechSynthesis) {
    feedbackEl.textContent = "Your browser cannot play the word aloud.";
    return;
  }
  const utterance = new SpeechSynthesisUtterance(currentWord);
  utterance.rate = 0.8;
  utterance.pitch = 1.1;
  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(utterance);
};

const updateScoreboard = () => {
  scoreEl.textContent = score;
  triesEl.textContent = tries;
};

const setFeedback = (message, tone = "") => {
  feedbackEl.textContent = message;
  feedbackEl.className = `feedback ${tone}`.trim();
};

const setWordStatus = (message, tone = "") => {
  wordStatusEl.textContent = message;
  wordStatusEl.className = `settings__status ${tone}`.trim();
};

const normalizeWords = (raw) =>
  raw
    .split(/[\n,]+/)
    .map((word) => word.trim())
    .filter((word) => word.length > 0);

const applyWordBank = (words, sourceLabel) => {
  const uniqueWords = Array.from(new Set(words));
  if (uniqueWords.length < 6) {
    setWordStatus(
      "Please provide at least 6 unique words.",
      "settings__status--warn"
    );
    return false;
  }
  wordBank = uniqueWords;
  setWordStatus(`Using ${uniqueWords.length} words from ${sourceLabel}.`);
  buildBoard();
  return true;
};

const loadRandomWords = async () => {
  setWordStatus("Loading random words...", "settings__status--loading");
  try {
    const response = await fetch(
      "https://random-word-api.herokuapp.com/word?number=12&swear=0"
    );
    if (!response.ok) {
      throw new Error("Request failed");
    }
    const words = await response.json();
    const cleaned = words
      .map((word) => word.replace(/[^a-zA-Z]/g, "").trim())
      .filter((word) => word.length > 0)
      .map((word) => word[0].toUpperCase() + word.slice(1).toLowerCase());
    const unique = Array.from(new Set(cleaned));
    if (applyWordBank(unique, "the internet")) {
      customWordsEl.value = unique.join(", ");
    }
  } catch (error) {
    setWordStatus(
      "Could not load random words. Check your connection or try again.",
      "settings__status--warn"
    );
  }
};

const buildBoard = () => {
  boardEl.innerHTML = "";
  const roundWords = pickWords();
  targetWordEl.textContent = currentWord;
  setFeedback("Make a match!", "");

  roundWords.forEach((word) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "card";
    button.textContent = word;
    button.addEventListener("click", () => handleGuess(word, button));
    boardEl.appendChild(button);
  });
};

const handleGuess = (word, button) => {
  tries += 1;
  if (word === currentWord) {
    score += 1;
    button.classList.add("card--correct");
    setFeedback("Great job! You found it!", "feedback--success");
    setTimeout(buildBoard, 900);
  } else {
    button.classList.add("card--wrong");
    setFeedback("Try again! Look for the same word.", "feedback--try");
  }
  updateScoreboard();
};

newRoundBtn.addEventListener("click", buildBoard);
resetBtn.addEventListener("click", () => {
  score = 0;
  tries = 0;
  updateScoreboard();
  setFeedback("Score reset. Ready for a new word?", "");
});

soundBtn.addEventListener("click", speakWord);
useCustomBtn.addEventListener("click", () => {
  const customWords = normalizeWords(customWordsEl.value);

  if (!Array.isArray(customWords) || customWords.length < 3) {
    setWordStatus(
      "Please provide at least 3 words. Keeping the current word list.",
      "settings__status--warn"
    );
    customWordsEl.value = wordBank.join(", ");
    return;
  }
  if (!applyWordBank(customWords, "your custom list")) {
    customWordsEl.value = wordBank.join(", ");
  }
});
loadRandomBtn.addEventListener("click", loadRandomWords);

buildBoard();
updateScoreboard();
setWordStatus("Using the default word list.");
