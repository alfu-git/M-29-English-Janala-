// get id
const getId = (id) => document.getElementById(id);

function pronounceWord(word) {
  const utterance = new SpeechSynthesisUtterance(word);
  utterance.lang = "en-US"; // English
  window.speechSynthesis.speak(utterance);
}

///// set all levels /////
const allLevels = async () => {
  const url = "https://openapi.programming-hero.com/api/levels/all";
  const res = await fetch(url);
  const json = await res.json();
  renderAllLevels(json.data);
};

const renderAllLevels = (allData) => {
  const levelContainer = getId("level-container");
  levelContainer.innerHTML = "";

  allData.forEach((data) => {
    const levelBtnLi = document.createElement("li");

    levelBtnLi.innerHTML = `
    <button id="lesson-btn-${data.level_no}" onclick = showWords(${data.level_no}) class="btn btn-outline btn-primary lesson-btn">
    <i class="fa-solid fa-book-open"></i> Lesson - ${data.level_no}
    </button>
    `;
    levelContainer.appendChild(levelBtnLi);
  });
};
allLevels();

///// set loading feature /////
const loading = (status) => {
  if (status === true) {
    getId("loading").classList.remove("hidden");
    getId("show-word").classList.add("hidden");
  } else {
    getId("loading").classList.add("hidden");
    getId("show-word").classList.remove("hidden");
  }
};

///// show words by level /////
const showWords = async (levelNo) => {
  loading(true);
  const url = `https://openapi.programming-hero.com/api/level/${levelNo}`;
  const response = await fetch(url);
  const json = await response.json();
  renderWords(json.data);

  const allBtns = document.querySelectorAll(".lesson-btn");
  allBtns.forEach((btn) => {
    btn.classList.remove("active");
  });
  const clickBtn = document.getElementById(`lesson-btn-${levelNo}`);
  clickBtn.classList.add("active");
};

const renderWords = (allWords) => {
  const wordsContainer = getId("words-container");
  wordsContainer.innerHTML = "";

  if (allWords.length === 0) {
    wordsContainer.innerHTML = `
      <div class="col-span-3 my-7">
        <img class="mx-auto mb-2" src="./images/alert-error.png">
        <p class="mb-3 font-bangla text-[#79716B] text-sm">
          এই Lesson এ এখনো কোন Vocabulary যুক্ত করা হয়নি।
        </p>
        <h4 class="text-[#292524] font-bangla text-3xl font-medium">
          নেক্সট Lesson এ যান
        </h4>
      </div>
    `;
    loading(false);
    return;
  }

  allWords.forEach((word) => {
    const wordCard = document.createElement("div");
    wordCard.className = "bg-white rounded-lg p-8 sm:p-6 lg:p-6 xl:p-10";
    wordCard.innerHTML = `
    <div class="mb-7.5 sm:mb-10 space-y-4 sm:space-y-6">
      <span class="block text-3xl font-bold">${word.word ? word.word : "No word found"}</span>
      <span class="block text-lg md:text-xl font-medium">Meaning/Pronunciation</span>
      <span class="block text-3xl font-semibold font-bangla">${word.meaning ? word.meaning : "অর্থ পাওয়া যাইনি "}/${word.pronunciation ? word.pronunciation : "উচ্চারণ পাওয়া যাইনি"}</span>
    </div>

    <div class="flex justify-between">
      <button id="show-dt-btn" onclick="loadWordDetails(${word.id})" class="flex items-center justify-center bg-[#1A91FF]/10 hover:bg-[#1A91FF]/50 w-10 h-10 rounded-sm text-[#374957]">
        <i class="fa-solid fa-circle-info"></i>
      </button>
      <button onclick=pronounceWord('${word.word}') class="flex items-center justify-center bg-[#1A91FF]/10 hover:bg-[#1A91FF]/50 w-10 h-10 rounded-sm text-[#374957]">
        <i class="fa-solid fa-volume-high"></i>
      </button>
    </div>
    `;
    wordsContainer.appendChild(wordCard);
  });
  loading(false);
};

///// show word details /////
const loadWordDetails = async (wordId) => {
  const url = `https://openapi.programming-hero.com/api/word/${wordId}`;
  const response = await fetch(url);
  const json = await response.json();
  renderWordDetails(json.data);
  const wordModal = getId("word-modal");
  wordModal.showModal();
};

const renderWordDetails = (wordDetails) => {
  const wordDetailsContainer = getId("word-details-container");
  wordDetailsContainer.innerHTML = "";

  const dtCard = document.createElement("div");
  dtCard.className = "flex flex-col justify-start";
  dtCard.innerHTML = `
    <h5 class="mb-8 text-4xl text-[#000000] font-semibold">${wordDetails.word} (<i onclick=pronounceWord('${wordDetails.word}') class="fa-solid fa-microphone-lines"></i> : ${wordDetails.pronunciation})</h5>

    <div class="mb-3 space-y-2">
      <span class="block text-left text-[#000000] text-2xl font-medium">Meaning</span>
      <span class="block text-left font-bangla text-2xl text-[#000000] font-medium">${wordDetails.meaning}</span>
    </div>

    <div class="mb-3 space-y-2">
      <span class="block text-left text-[#000000] text-2xl font-medium">Example</span>
      <p class="text-2xl text-left text-[#000000] opacity-80">${wordDetails.sentence}</p>
    </div>

    <div class="mb-3 space-y-2">
      <span class="block text-left font-bangla text-[#000000] text-2xl font-medium">সমার্থক শব্দ গুলো</span>
      <div class="text-left space-x-2 space-y-2">
        ${showSynonyms(wordDetails.synonyms)}
      </div>
    </div>
  `;
  wordDetailsContainer.appendChild(dtCard);
};

///// show synonyms /////
const showSynonyms = (arr) => {
  const synonyms = arr.map(
    (el) =>
      `<span class="inline-block bg-[#EDF7FF] border border-[#D7E4EF] rounded-sm py-1.5 px-3 text-xl text-[#000000] opacity-80">${el}</span>`,
  );
  return synonyms.join(" ");
};

///// set search function /////
const searchBtn = getId("search-btn");

searchBtn.addEventListener("click", async () => {
  loading(true);
  const allBtns = document.querySelectorAll(".lesson-btn");
  allBtns.forEach((btn) => {
    btn.classList.remove("active");
  });

  const searchWord = document.getElementById("searching-word").value.trim().toLowerCase();

  const url = 'https://openapi.programming-hero.com/api/words/all';
  const response = await fetch(url);
  const json = await response.json();
  
  const allWords = json.data;

  const showWord = allWords.filter(word => word.word.toLowerCase().includes(searchWord));
  renderWords(showWord);
  loading(false);
});
