

var plusMinus = document.querySelector('.add__type');
var summary = document.querySelector('.add__description');
var amount = document.querySelector('.add__value');

var addButton = document.querySelector('.add__btn');

var deleteButton = document.querySelectorAll('.item__delete');
var sumElement = document.querySelector('.budget__value');
var income = document.querySelector('.budget__income--value');
var expensesContainer = document.querySelector('.budget__expenses--value');

var monthContainer = document.querySelector('.budget__title--month');


var data = [];
var id = 0;
var totalIncome = 0;
//var totalExpenses = 0;




function calcSum(){
  var sum = 0;
  for (var i = 0; i < data.length ; i++) {
    if (data[i].type === 'inc') {
      sum += parseInt(data[i].value);

    }else if (data[i].type === 'exp') {
        sum -= parseInt(data[i].value);
    }
  }
  return sum;
};

function calcIncome(){
  var totalInc = 0
  for (var i = 0; i < data.length; i++) {
    if (data[i].type === 'inc') {
      totalInc += parseInt(data[i].value);
    } else {
      continue;
    }
  }
  totalIncome = totalInc;
  return totalInc;
};

function calcExpenses(){
  var totalExp = 0
  for (var i = 0; i < data.length; i++) {
    if (data[i].type === 'exp') {
      totalExp += parseInt(data[i].value);
    } else {
      continue;
    }
  }
  return totalExp;
};

function calcPercExp(){
  var allExpenses = calcExpenses();
  var allIncome = calcIncome();
  var PercentExpenses = ((allExpenses / allIncome) * 100).toFixed(1);

  var expensePercContainer = document.querySelector('.budget__expenses--percentage');
  expensePercContainer.innerHTML = PercentExpenses + '%';
}

function displayIndivPercent(){

 percentContainer = document.querySelectorAll('.item__percentage');
 for (var i = 0; i < percentContainer.length; i++) {
   var value = percentContainer[i].parentNode.firstChild.innerText; /// this is the value, its the same as input.value, but you access it from the outside
   percentContainer[i].innerHTML = ((Number(value) / totalIncome) * 100).toFixed(1) + '%';
 }
};

function findMonth(){
  var monthNames = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"];

  var date = new Date();
  var month = monthNames[date.getMonth()];

  return  month

};


function displayMonth(){
  var currentMonth =  findMonth();
  monthContainer.textContent = currentMonth;
};



function getInput(){

  var actualplusMinus = plusMinus.value;
  var actualSummary = summary.value;
  var actualAmount = amount.value;


  data.push(
   input = {
    type: actualplusMinus,
    description: actualSummary,
    value: actualAmount,
    id: id++
   }
  );



  return input;
};





function displayInput(){

  var input = getInput();
  console.log(data);

  if (input.type === 'inc') {
    var element = document.querySelector('.income__list')
    var html = document.createElement('div')



    html.innerHTML = `<div class="item clearfix" id="income-${input.id}"><div class="item__description">${input.description}</div><div class="right clearfix"><div class="item__value">${input.value}</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>`

    element.appendChild(html);

    //calc total income
    var totInc = calcIncome();
    income.innerHTML = totInc;


    // get sum and put in UI
    var total = calcSum();
    sumElement.innerHTML = total + ' Dollar(s)'

    //display expense as percentage of total income
    calcPercExp();




    //update individual expenses
    displayIndivPercent();


    // setup event handler for delete button here.

    var deleteButton = html.querySelector('.item__delete');
    deleteButton.addEventListener('click', function(){
      element.removeChild(html);

      var id = input.id;
      for (var i = 0; i < data.length; i++) {
        if (data[i].id === id) {
          data.splice(i, 1);
        }

      }
      var totInc = calcIncome();
      income.innerHTML = totInc;


      var total = calcSum();
      sumElement.innerHTML = total + ' Dollar(s)'

      calcPercExp();
    })
  };






  if (input.type === 'exp') {

    var element = document.querySelector('.expenses__list');
    var html = document.createElement('div');




    html.innerHTML = `<div class="item clearfix" id="expense-${input.id}"><div class="item__description">${input.description}</div><div class="right clearfix"><div class="item__value">${input.value}</div><div class="item__percentage">%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>`

    element.appendChild(html);

    // calculate total expenses
    var expenses = calcExpenses();
    expensesContainer.innerHTML = '-' + expenses;


    // calculate sum
    var total = calcSum();
    sumElement.innerHTML = total + ' Dollar(s)'

    calcPercExp();

     displayIndivPercent();




    // delete a input
    var deleteButton = html.querySelector('.item__delete');

    deleteButton.addEventListener('click', function(){
      element.removeChild(html);
      var id = input.id;
      for (var i = 0; i < data.length; i++) {
        if (data[i].id === id) {
          data.splice(i, 1);

        }
      }


    var expenses = calcExpenses();
    expensesContainer.innerHTML = '-' + expenses;


    var total = calcSum();
    sumElement.innerHTML = total + ' Dollar(s)'

    calcPercExp();
    })
  }
};



function init(){
  displayMonth();
  sumElement.innerHTML = 0;
  income.innerHTML = 0;
  expensesContainer.innerHTML = 0;
}


init();

addButton.addEventListener('click', displayInput);
