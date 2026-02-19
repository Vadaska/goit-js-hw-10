import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

const refs = {
  input: document.querySelector('#datetime-picker'),
  startBtn: document.querySelector('[data-start]'),
  days: document.querySelector('[data-days]'),
  hours: document.querySelector('[data-hours]'),
  minutes: document.querySelector('[data-minutes]'),
  seconds: document.querySelector('[data-seconds]'),
};

refs.startBtn.disabled = true;
let userSelectedDate = null;
let timerId = null;

const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    const selectedDate = selectedDates[0];
    if (!selectedDate) return;

    const now = Date.now();

    if (selectedDate.getTime() <= now) {
      iziToast.error({
        title: 'Error',
        message: 'Please choose a date in the future',
        position: 'topRight',
      });
      userSelectedDate = null;
      refs.startBtn.disabled = true;
    } else {
      userSelectedDate = selectedDate;
      refs.startBtn.disabled = false;
    }
  },
};

flatpickr(refs.input, options);

refs.startBtn.addEventListener('click', onStartBtnClick);

function onStartBtnClick() {
  refs.startBtn.disabled = true;
  refs.input.disabled = true;

  timerId = setInterval(() => {
    const now = Date.now();
    const deltaTime = userSelectedDate.getTime() - now;

    if (deltaTime <= 0) {
      updateTimerDisplay(0, 0, 0, 0);
      clearInterval(timerId);
      timerId = null;

      refs.input.disabled = false;
      return;
    }
    const timeObj = convertMs(deltaTime);
    updateTimerDisplay(
      timeObj.days,
      timeObj.hours,
      timeObj.minutes,
      timeObj.seconds
    );
  }, 1000);
}

function addLeadingZero(value) {
  return String(value).padStart(2, '0');
}
function updateTimerDisplay(days, hours, minutes, seconds) {
  refs.days.textContent = days;
  refs.hours.textContent = addLeadingZero(hours);
  refs.minutes.textContent = addLeadingZero(minutes);
  refs.seconds.textContent = addLeadingZero(seconds);
}

function convertMs(ms) {
  // Number of milliseconds per unit of time
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  // Remaining days
  const days = Math.floor(ms / day);
  // Remaining hours
  const hours = Math.floor((ms % day) / hour);
  // Remaining minutes
  const minutes = Math.floor(((ms % day) % hour) / minute);
  // Remaining seconds
  const seconds = Math.floor((((ms % day) % hour) % minute) / second);

  return { days, hours, minutes, seconds };
}
