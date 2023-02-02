let currentWeek = getCurrentWeek();
const currentDay = new Date().getDay() || 7;
const weekList = document.getElementById('week-list');

function getCurrentWeek() {
  const currentDate = new Date();
  startDate = new Date(currentDate.getFullYear(), 0, 1);
  const days = Math.floor((currentDate - startDate) / (24 * 60 * 60 * 1000));

  return Math.ceil(days / 7);
}

function buildWeek(weekNum) {
  const storedWeek = getStoredWeek(weekNum);
  const current = weekNum === currentWeek ? 'current' : '';
  const weekInnerHTML = `
    <span class="week-number" id="week-number-${weekNum}">${weekNum}</span>
    <input ${storedWeek[1] && 'checked'} disabled class="day-checkbox" type="checkbox" name="monday" />
    <input ${storedWeek[2] && 'checked'} disabled class="day-checkbox" type="checkbox" name="tuesday" />
    <input ${storedWeek[3] && 'checked'} disabled class="day-checkbox" type="checkbox" name="wednesday" />
    <input ${storedWeek[4] && 'checked'} disabled class="day-checkbox" type="checkbox" name="thursday" />
    <input ${storedWeek[5] && 'checked'} disabled class="day-checkbox" type="checkbox" name="friday" />
    <input ${storedWeek[6] && 'checked'} disabled class="day-checkbox" type="checkbox" name="saturday" />
    <input ${storedWeek[7] && 'checked'} disabled class="day-checkbox" type="checkbox" name="sunday" />
  `;

  const week = document.createElement('div');
  week.className = `week ${current}`;

  week.innerHTML = weekInnerHTML;
  return week;
}

function setStoredWeek(weekNum, week) {
  const key = `week-${weekNum}`;
  const storedWeek = JSON.stringify(week) ?? {};
  localStorage.setItem(key, storedWeek);
}

function getStoredWeek(weekNum) {
  const key = `week-${weekNum}`;
  const storedWeekString = localStorage.getItem(key);
  const storedWeek = JSON.parse(storedWeekString) ?? {};
  return storedWeek;
}

function scrollToWeek(weekNum) {
  const REM = 16;
  const weekRowHeight = REM * 3;
  const weekRowGap = REM;
  const dayLetterRowHeight = REM;
  const scrollTop = dayLetterRowHeight + weekRowGap + (weekRowHeight + weekRowGap) * (weekNum - 1);
  window.scroll({
    top: scrollTop,
    behavior: 'smooth',
  });
}
function render() {
  for (let i = 0; i < 52; i++) {
    const week = buildWeek(i + 1);
    weekList.appendChild(week);
  }
}

setTimeout(() => {
  scrollToWeek(currentWeek);
}, 500);

render();

const weekRow = document.querySelector('.week.current');
const dayLabel = document.querySelector(`#week-list #day-number-${currentDay}`).classList.add('current');
const day = weekRow.children.item(currentDay);
day.classList.add('current');
day.removeAttribute('disabled');
day.addEventListener('change', function (e) {
  const storedWeek = getStoredWeek(currentWeek);
  storedWeek[currentDay] = e.target.checked;
  setStoredWeek(currentWeek, storedWeek);
});
