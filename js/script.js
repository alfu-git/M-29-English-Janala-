///// helping function /////
// get id
const getId = (id) => document.getElementById(id);

// get innerText
const innerText = (id) => document.getElementById(id).innerText;

// get value
const value = (id) => document.getElementById(id).value;


///// all levels /////
const allLevels = async () => {
  const url = 'https://openapi.programming-hero.com/api/levels/all';
  const res = await fetch(url);
  const json = await res.json();
  renderAllLevels(json.data);
}

const renderAllLevels = (allData) => {
  const levelContainer = getId('level-container');
  levelContainer.innerHTML = '';

  allData.forEach(data => {
    const levelBtnLi = document.createElement('li');
    levelBtnLi.innerHTML = `
    <button class = "btn btn-outline btn-primary">
    <i class="fa-solid fa-book-open"></i> Lesson - ${data.level_no}
    </button>
    `
    levelContainer.appendChild(levelBtnLi);
  })
}
allLevels();