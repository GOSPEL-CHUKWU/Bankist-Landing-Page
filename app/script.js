'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

/////////////////////////////////////////////////
// Data

// DIFFERENT DATA! Contains movement, dates, currency and locaLe

const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2020-05-08T14:11:59.604Z',
    '2022-09-27T17:01:17.194Z',
    '2022-09-28T23:36:17.929Z',
    '2022-10-02T10:51:36.790Z',
  ],
  currency: 'EUR',
  locale: 'pt-PT', // de-DE
};

const account2 = {
  owner: 'Gospel Chukwu',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2022-09-26T14:43:26.374Z',
    '2022-09-27T18:49:59.371Z',
    '2022-10-02T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

const accounts = [account1, account2];

/////////////////////////////////////////////////
// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

/////////////////////////////////////////////////
// Functions
/////////////////////////////////////////////////
//Create DOM Element
const formatMovementDate = function (date, locale) {
  /////////////////////////////////////////////////
  //Adding Dates to 'Bankist' App
  const calcDaysPassed = (date1, date2) =>
    Math.round(Math.abs(date2 - date1) / (1000 * 60 * 60 * 24));

  const daysPassed = calcDaysPassed(new Date(), date);
  // console.log(daysPassed);

  if (daysPassed === 0) return 'Today';
  if (daysPassed === 1) return 'Yesterday';
  if (daysPassed <= 7) return `${daysPassed} days ago`;
  // const day = `${date.getDate()}`.padStart(2, '0');
  // const month = `${date.getMonth() + 1}`.padStart(2, '0');
  // const year = date.getFullYear();
  // return `${day}/${month}/${year}`;

  return new Intl.DateTimeFormat(locale).format(date);
};
const formatCurrency = function (value, locale, currency) {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
  }).format(value);
};

const displayMovements = function (accounts, sort = false) {
  containerMovements.innerHTML = '';

  const sortMovements = sort
    ? accounts.movements.slice().sort((a, b) => a - b)
    : accounts.movements;

  sortMovements.forEach(function (movement, index) {
    const type = movement > 0 ? 'deposit' : 'withdrawal';

    const date = new Date(accounts.movementsDates[index]);
    const displayDate = formatMovementDate(date, accounts.locale);

    const formattedMovement = formatCurrency(
      movement,
      accounts.locale,
      accounts.currency
    );

    const html = `
    <div class="movements__row">
      <div class="movements__type movements__type--${type}">${
      index + 1
    } ${type}</div>
      <div class="movements__date">${displayDate}</div>
      <div class="movements__value">${formattedMovement}</div>
    </div>
    `;
    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

// console.log(containerMovements.innerHTML);

/////////////////////////////////////////////////
// Data Transformations: REDUCE METHOD
//add total balance

const calcDisplayBalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, movement) => acc + movement, 0);
  labelBalance.textContent = `${formatCurrency(
    acc.balance,
    acc.locale,
    acc.currency
  )}`;
};

/////////////////////////////////////////////////
//The magic of chaining methods

const calcDisplaySummary = function (account) {
  const incomes = account.movements
    .filter(movement => movement > 0)
    .reduce((acc, movement) => acc + movement, 0);

  //Challenge from Array Methods practice
  // const incomes = account.movements.reduce(
  //   (acc, movement) => (movement > 0 ? acc + movement : acc),
  //   0
  // );

  labelSumIn.textContent = `${formatCurrency(
    incomes,
    account.locale,
    account.currency
  )}`;

  const outcomes = account.movements
    .filter(movement => movement < 0)
    .reduce((acc, movement) => acc + movement, 0);

  //Challenge from Array Methods practice
  // const outcomes = account.movements.reduce(
  //   (acc, movement) => (movement < 0 ? acc + movement : acc),
  //   0
  // );

  labelSumOut.textContent = `${formatCurrency(
    Math.abs(outcomes),
    account.locale,
    account.currency
  )}`;

  const interest = account.movements
    .filter(movement => movement > 0)
    .map(deposit => (deposit * account.interestRate) / 100)
    .filter((interest, i, arr) => {
      // console.log(arr);
      return interest >= 1;
    })
    .reduce((acc, movement) => acc + movement, 0);

  //Challenge from Array Methods practice
  // const interest = account.movements.reduce((acc, movement) => {
  //   if (movement > 0) {
  //     const average = (movement * account.interestRate) / 100;
  //     if (average >= 1) {
  //       acc = acc + average;
  //     }
  //   }
  //   return acc;
  // }, 0);
  labelSumInterest.textContent = `${formatCurrency(
    interest,
    account.locale,
    account.currency
  )}`;
};

/////////////////////////////////////////////////
// Data Transformations: MAP METHOD
// Computing Usernames

const createUsernames = function (accounts) {
  accounts.forEach(account => {
    account.username = account.owner
      .toLowerCase()
      .split(' ')
      .map(name => name[0])
      .join('');
  });
};
createUsernames(accounts);
// console.log(account1);
// console.log(account2);
// console.log(account3);
// console.log(account4)

////////////////////////////////////////////
//Implementing login

const updateUI = function (current) {
  //Display movements
  displayMovements(current);

  //Display balance
  calcDisplayBalance(current);

  //Display summary
  calcDisplaySummary(current);
};

/////////////////////////////////////////////////
//Implementing a Countdown Timer
const startLogOutTimer = function () {
  const tick = function () {
    const min = String(Math.trunc(time / 60)).padStart(2, '0');
    const sec = String(time % 60).padStart(2, '0');

    //in each call, print the remaining time to the UI
    labelTimer.textContent = `${min}:${sec}`;

    //when 0 seconds, stop timer and log out user
    if (time === 0) {
      clearInterval(timer);
      containerApp.style.opacity = 0;
      labelWelcome.textContent = `Log in to get started`;
    }

    //Decrease by 1s
    time--;
  };

  //Set time to 5 minutes
  let time = 120;

  //Call the timer every second
  tick();
  const timer = setInterval(tick, 1000);

  return timer;
};

////////////////////////////////////////////
//Event handlers
let currentAccount, timer;

// LOGIN
btnLogin.addEventListener('click', function (e) {
  //prevent form from submitting
  e.preventDefault();

  currentAccount = accounts.find(
    account => account.username === inputLoginUsername.value
  );
  console.log(currentAccount);

  if (currentAccount?.pin === +inputLoginPin.value) {
    //Display a welcome message and UI
    labelWelcome.textContent = `Welcome back, ${
      currentAccount.owner.split(' ')[0]
    }`;

    containerApp.style.opacity = 1;

    /////////////////////////////////////////////////
    //Adding Dates to 'Bankist' App
    //Create Current date and time
    // const now = new Date();
    // const day = `${now.getDate()}`.padStart(2, '0');
    // const month = `${now.getMonth() + 1}`.padStart(2, '0');
    // const year = now.getFullYear();
    // const hour = `${now.getHours()}`.padStart(2, '0');
    // const minutes = `${now.getMinutes()}`.padStart(2, '0');
    // console.log(day, month, year);
    // labelDate.textContent = `${day}/${month}/${year}, ${hour}:${minutes}`;

    //Experimenting with the API
    const now = new Date();
    const options = {
      hour: 'numeric',
      // hour: '2-digit',
      minute: 'numeric',
      // minute: '2-digit',
      // second: 'numeric',
      // second: '2-digit',
      day: 'numeric',
      // day: '2-digit',
      month: 'numeric',
      // month: 'long',
      // month: '2-digit',
      // month: 'short',
      // month: 'narrow',
      year: 'numeric',
      // year: '2-digit',
      // weekday: 'long',
      // weekday: 'short',
      // weekday: 'narrow',
    };
    // const locale = navigator.language;
    // console.log(locale);

    // labelDate.textContent = new Intl.DateTimeFormat(
    //   'en-US',
    //   options
    // ).format(now);

    labelDate.textContent = new Intl.DateTimeFormat(
      currentAccount.locale,
      options
    ).format(now);

    //start the logout timer
    if (timer) clearInterval(timer);
    timer = startLogOutTimer();

    //Update UI
    updateUI(currentAccount);

    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur();
  }
});

/////////////////////////////////////////////////
//Implementing Transfers
btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();

  const amount = +inputTransferAmount.value;
  const receiverAccount = accounts.find(
    account => account.username === inputTransferTo.value
  );

  inputTransferAmount.value = inputTransferTo.value = '';
  if (
    amount > 0 &&
    receiverAccount &&
    currentAccount.balance >= amount &&
    receiverAccount?.username !== currentAccount.username
  ) {
    //Doing the transfer
    currentAccount.movements.push(-amount);
    receiverAccount.movements.push(amount);

    //Add transfer data
    currentAccount.movementsDates.push(new Date().toISOString());
    receiverAccount.movementsDates.push(new Date().toISOString());

    //Update UI
    updateUI(currentAccount);

    //start the logout timer
    if (timer) clearInterval(timer);
    timer = startLogOutTimer();
  }
});

///////////////////////////////////////
//THE SOME METHOD

btnLoan.addEventListener('click', function (e) {
  e.preventDefault();

  const amount = Math.floor(inputLoanAmount.value);

  //you can do amount/10 instead of amount *0.1
  if (
    amount > 0 &&
    currentAccount.movements.some(movement => movement >= amount * 0.1)
  ) {
    setTimeout(function () {
      //Add movement
      currentAccount.movements.push(amount);

      //Add loan date
      currentAccount.movementsDates.push(new Date().toISOString());

      //Update UI
      updateUI(currentAccount);

      //start the logout timer
      if (timer) clearInterval(timer);
      timer = startLogOutTimer();
    }, 2500);
  }
  //Hide UI
  inputLoanAmount.value = '';
});

///////////////////////////////////////
//THE FINDINDEX METHOD
btnClose.addEventListener('click', function (e) {
  e.preventDefault();

  if (
    currentAccount.username === inputCloseUsername.value &&
    currentAccount.pin === +inputClosePin.value
  ) {
    const index = accounts.findIndex(
      acc => acc.username === currentAccount.username
    );
    console.log(index);
    // indexof(23)

    //Delete Account
    accounts.splice(index, 1);

    //Hide UI
    containerApp.style.opacity = 0;
  }
  inputClosePin.value = inputCloseUsername.value = '';
});

let sorted = false;
btnSort.addEventListener('click', function (e) {
  e.preventDefault();

  sorted = !sorted;
  displayMovements(currentAccount, sorted);
});
/////////////////////////////////////////////////
/////////////////////////////////////////////////
// // LECTURES

/////////////////////////////////////////////////
// //Converting and Checking
// console.log(23 === 23.0);

// //Base 10 -> 0 to 9.... 1/10 =0.1 , 3/10 = 3.33333
// //Base 2 -> 0 and 1

// console.log(0.1 * 0.2);
// console.log(0.1 + 0.2 === 0.3);

// //Conversion
// console.log(Number('23'));
// console.log(+'23');

// //Parsing
// //parseInt
// //Integer numbers
// console.log(Number.parseInt('23px', 10));
// // console.log(Number.parseInt('e23px'));
// console.log(Number.parseInt('23px', 10));

// //parseFloat
// //decimal numbers
// console.log(Number.parseFloat('  2.3px   ', 10));
// // console.log(Number.parseInt('   2.3px  '));

// // console.log(parseInt('   2.3px  '));

// //isNaN
// //Checking if value is not a number
// console.log(Number.isNaN(20));
// console.log(Number.isNaN('20'));
// console.log(Number.isNaN(+'20%'));
// console.log(Number.isNaN(23 / 0));

// //isFinite
// //Checking if value is a number
// console.log(Number.isFinite(20));
// console.log(Number.isFinite('20'));
// console.log(Number.isFinite(+'20%'));
// console.log(Number.isFinite(23 / 0));

// console.log(Number.isInteger(23));
// console.log(Number.isInteger(23.0));
// console.log(Number.isInteger(23.3));
// console.log(Number.isInteger(23 / 0));

/////////////////////////////////////////////////
// //Getting square roots
// console.log(Math.sqrt(25));
// console.log(25 ** (1 / 2));
// //Getting cubic roots
// console.log(Math.cbrt(8));
// console.log(8 ** (1 / 3));

// //Maximum value
// console.log(Math.max(5, 18, 23, 11, 2));
// console.log(Math.max(5, 18, '23', 11, 2));
// console.log(Math.max(5, 18, '23px', 11, 2));

// //minimum value
// console.log(Math.min(5, 18, '23', 11, 2));

// //How to calculate the area of a circle
// console.log(Math.PI + Number.parseFloat('10px') ** 2);

// //random numbers
// console.log(Math.trunc(Math.random() * 6) + 1);

// //turning the random into a nice function
// const randomInt = (min, max) =>
//   Math.floor(Math.random() * (max - min) + 1) + min;
// // Math.trunc(Math.random() * (max - min) + 1) + min;
// // console.log(randomInt(1, 6));

// //Rounding Imtegers
// console.log('----trunc----');
// console.log(Math.trunc(23.3));

// console.log('----round----');
// console.log(Math.round(23.3));
// console.log(Math.round(23.9));

// console.log('----ceil----');
// console.log(Math.ceil(23.3));
// console.log(Math.ceil(23.9));

// console.log('----floor----');
// console.log(Math.floor(23.3));
// console.log(Math.floor(23.9));
// // console.log(Math.floor('23.9'));

// console.log(Math.trunc(-23.3));
// console.log(Math.floor(-23.3));

// // Rounding Floating point numbers/decimal
// //toFixed Outputs a stings everytime
// console.log((2.7).toFixed(0));
// console.log((2.7).toFixed(3));
// console.log((2.345).toFixed(2));
// //turning it into number
// console.log(+(2.345).toFixed(2));

/////////////////////////////////////////////////
// //The remainder operator
// console.log(5 % 2);
// console.log(5 / 2); //5 = 2 * 2 + 1

// console.log(8 % 3);
// console.log(8 / 3); //8 = 2 * 3 + 2

// console.log(6 % 2);
// console.log(6 / 2);

// console.log(7 % 2);
// console.log(7 / 2);

// const isEven = n => n % 2 === 0;
// console.log(isEven(8));
// console.log(isEven(23));
// console.log(isEven(513));
// console.log(isEven(514));

// labelBalance.addEventListener('click', function () {
//   [...document.querySelectorAll('.movements__row')].forEach(function (row, i) {
//     i = i + 1;
//     if (i % 2 === 0) {
//       row.style.backgroundColor = 'orangered';
//     }
//     if (i % 3 === 0) {
//       row.style.backgroundColor = 'blue';
//     }
//   });
// });

/////////////////////////////////////////////////
// //Numeric Seperators
// //287,460,000,000
// const diameter = 287_460_000_000;
// console.log(diameter);

// const price = 345_99;
// console.log(price);

// const transferFee1 = 15_00;
// const transferFee2 = 1_500;

// //not alllowed before/after a fullstop or at the beginning of a number or the end and u can't place two in a row like 1__21
// const PI = 3.14_15;
// console.log(PI);

// //u can't add underscore's when turning a string to a number
// console.log(Number('230_000'));
// //only the part before the underscore will run
// console.log(parseInt('230_000'));

/////////////////////////////////////////////////
// //Working with BigInt
// console.log(2 ** 53 - 1);
// console.log(Number.MAX_SAFE_INTEGER);
// console.log(2 ** 53 + 1);
// console.log(2 ** 53 + 2);
// console.log(2 ** 53 + 3);
// console.log(2 ** 53 + 4);

// console.log(23444444444457745563423253626251252355234352n);
// console.log(BigInt(23444444444457745563423253626251252355234352));
// console.log(BigInt(23232524));

// // Operations

// console.log(10000n + 10000n);
// console.log(3032483801041747401408112470n + 10000000n);
// const huge = 324717491499646957179n;
// const num = 23;
// console.log(huge * BigInt(num));

// //NOT gon' work
// // console.log(Math.sqrt(16n));

// //Exceptions
// //Logical Operator Exception
// console.log(20n > 15);

// console.log(20n === 20);
// console.log(typeof 20n);
// console.log(20n == '20');

// //String concatenation Exception
// console.log(huge + ` is REALLY big!!!`);

// //Divisions Exception
// console.log(10n / 3n);
// console.log(10 / 3);
// console.log(12n / 3n);
// console.log(12 / 3);

/////////////////////////////////////////////////
// //Creating Dates

// //Create a date
// //There are 4 ways of creating dates in js, they all use the new date constructor function but the can accept different parameters
// //1.
// const now = new Date();
// console.log(now);

// //2.
// console.log(new Date('Mon Oct 03 2022 15:12:02 '));
// console.log(new Date('December 24, 2015'));
// console.log(new Date(account1.movementsDates[0]));

// //3.
// //The month is zero based that's why 10 gives u november
// console.log(new Date(2037, 10, 19, 15, 23, 5));
// console.log(new Date(2037, 10, 31));

// //4.
// // Takes in miliseconds
// console.log(new Date(0));
// //3days behind of Jan 1 1970
// console.log(new Date(3 * 24 * 60 * 60 * -1000));
// //3days ahead of Jan 1 1970
// console.log(new Date(3 * 24 * 60 * 60 * 1000));

// //Working with dates

// const future = new Date(2037, 10, 19, 15, 23);
// console.log(future);
// console.log(future.getFullYear());
// console.log(future.getMonth());
// console.log(future.getDate());
// console.log(future.getDay());
// console.log(future.getHours());
// console.log(future.getMinutes());
// console.log(future.getSeconds());

// console.log(future.toISOString());
// console.log(future.getTime());

// console.log(new Date(2142253380000));

// //Method to get the time stamp for right now

// console.log(Date.now());
// // console.log(new Date(Date.now()));

// //Mutating the date variable
// future.setFullYear(2040);
// future.setMonth(7);
// future.setDate(23);
// future.setHours(12);
// future.setMinutes(0);
// future.setSeconds(0);
// console.log(future);

/////////////////////////////////////////////////
//Operations With Dates
// const future = new Date(2037, 10, 19, 15, 23);
// console.log(+future);

// const daysPassed = (date1, date2) =>
//   Math.abs(date2 - date1) / (1000 * 60 * 60 * 24);

// console.log(daysPassed(new Date(2037, 3, 4), new Date(2037, 3, 14)));

/////////////////////////////////////////////////
// //Internationalizing Numbers (Intl)
// const num = 2351244.32;

// const options = {
//   style: 'currency',
//   // style: 'percent',
//   // style: 'unit',
//   unit: 'celsius',
//   // unit: 'mile-per-hour',
//   currency: 'EUR',
//   // currency: 'USD',
//   useGrouping: true,
//   // useGrouping: false,
// };

// console.log(
//   'US:'.padEnd(20, ' '),
//   new Intl.NumberFormat('en-US', options).format(num)
// );
// console.log(
//   'Germany:'.padEnd(20, ' '),
//   new Intl.NumberFormat('de-DE', options).format(num)
// );
// console.log(
//   'Great Britain:'.padEnd(20, ' '),
//   new Intl.NumberFormat('en-GB', options).format(num)
// );
// console.log(
//   'Syria:'.padEnd(20, ' '),
//   new Intl.NumberFormat('ar-SY', options).format(num)
// );
// console.log(
//   `${navigator.language}`.padEnd(20, ' '),
//   new Intl.NumberFormat(navigator.language, options).format(num)
// );

/////////////////////////////////////////////////
//Timers: setTimeout and setInterval

//setTimeout
// setTimeout(() => console.log('Here

// const ingredients = ['olives', 'spinach'];
// const pizzaTimer = setTimeout(
//   (ing1, ing2) => console.log(`Here is your pizza with ${ing1} and ${ing2} 🍕`),
//   3000,
//   ...ingredients
// );
// console.log('Waiting....');
// if (ingredients.includes('spinach')) clearTimeout(pizzaTimer);

// setInterval
// setInterval(function () {
//   const now = new Date();
//   console.log(`${now.getHours()} : ${now.getMinutes()} : ${now.getSeconds()}`);
// }, 1000);
