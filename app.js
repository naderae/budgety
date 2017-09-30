
/// you want to divide the app into logical units, or moduels.
// for our app, we will have a user interface module , a data manipulation module, and controller module (event handler)

// module pattern
// you want to make your code private so that no other code can override it. we use an iffY FOR THAT.
// public methods and can be accessed and used publicly.

/// we want to implement a module pattern.


// creating a module: it is an IFFY, because it is emmidately invoked when its declared.

// var budgetController = (function(){
//
//   var x = 23;
//
//   var add = function(a) { // this add function and variable x are private and cant be accessed from the outside (from the console)
//     return x + a
//   }
//   return {
//     publicMethod: function(b){ // this module pattern returns a set of public methods that can be used on the outside.
//       return add(b); // on the other hand, using the publicMethod, we can access the add method!!!
//
//     }
//   }
// })();

// after this runs, the variable budgetController now includes publicMethod.
// publicMethod has access to var x and the add function, which is due to closures!!!


// /

/// we are seperating concerns, these two modules are stand-alone. oneof them keep note of the budget, the other gets user information.
// we need a third to add the user info to the budget.

// var controller = (function(budgetCtrl, UICtrl){
//   var z = budgetController.publicMethod(5);
//     return {
//       anotherPublic: function(){
//         return console.log(z);
//       }
//     }
// })(budgetController, UIController); //now the app controller knows about the other controllers., and can use their code.



/////////////////////////////////////////////


// !!!!!!!!!!!!!!! focus on the idea that you have to return functions to mak them public, and then you can use these functions o communicate across modules.


////////////////////////////////////////BUDGET CONTROLLER////////////////////////////////////////////////////////////////////////


var budgetController = (function(){



  var Expense = function(id, description, value) {
      this.id = id; // the id should be the id that we pass in
      this.description = description; // the description should be the description that we pass in
      this.value = value;
      this.percentage = -1;
    };

    // this function calculates the percentage of total income
    Expense.prototype.calcPercentage = function(totalIncome){
      if (totalIncome > 0) {
        this.percentage = Math.round((this.value / totalIncome) * 100);
      } else {
        this.percentage = -1;
      }
    };
    // this function returns the percentage of total income
    Expense.prototype.getPercentage = function(){
        return this.percentage;
    };

  var Income = function(id, description, value) {
    this.id = id; // the id should be the id that we pass in
    this.description = description; // the description should be the description that we pass in
    this.value = value;
  };

  var calculateTotal = function(type) {
      var sum = 0;
      data.allItems[type].forEach(function(cur) { // the forEach accepts currentelement, index, and the whole array). curr refers to either income or the expense object.
          sum += cur.value; // .value is defined above, it is where we store the monetary values of item.
      });
      data.totals[type] = sum;
  };



  var data = {
      allItems: {
          exp: [],
          inc: []
      },
      totals: {
          exp: 0,
          inc: 0
      },
      budget: 0,
      percentage: -1
  };

  return {
    addItem: function(type, des, val) {
        var newItem, ID;

        // Create new ID
        if (data.allItems[type].length > 0) {
            ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
        } else {
            ID = 0;
        }

        // Create new item based on 'inc' or 'exp' type
        if (type === 'exp') {
            newItem = new Expense(ID, des, val);
        } else if (type === 'inc') {
            newItem = new Income(ID, des, val);
        }

        // Push it into our data structure
        data.allItems[type].push(newItem);

        // Return the new element
        return newItem;
    },

    deleteItem: function(type, id){
      var ids, index;
      ids = data.allItems[type].map(function(current){ // map also takes 3 arguments, the current item ,the index, and the whole array.
        return current.id;
      });

      index = ids.indexOf(id);

      if (index !== -1) {
        data.allItems[type].splice(index, 1) // 1st argument is position number you want to start deleting, 2ns is number of elemetns you want to delete.
      }
    },

    calculateBudget: function() {

        // calculate total income and expenses
        calculateTotal('exp');
        calculateTotal('inc');

        // Calculate the budget: income - expenses
        data.budget = data.totals.inc - data.totals.exp;

        // calculate the percentage of income that we spent
        if (data.totals.inc > 0) {
            data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);
        } else {
            data.percentage = -1;
        }
    },

    calculatePercentages: function() {

      data.allItems.exp.forEach(function(current){
        current.calcPercentage(data.totals.inc);
      });
    },

    getPercentages: function() {
      var allPerc = data.allItems.exp.map(function(current){
        return current.getPercentage();
      });
      return allPerc;
    },



    getBudget: function(){
      return { //calculateBudget returns 4 things, so we store them in an object
        budget: data.budget,
        totalInc: data.totals.inc,
        totalExp: data.totals.exp,
        percentage: data.percentage
      };

    }

  };



})();





////////////////////////////////////////USER INTERFACE CONTROLLER////////////////////////////////////////////////////////////////////////



var UIController = (function(){

  var DOMStrings = {
    inputType: '.add__type',
    inputDescription: '.add__description',
    inputValue: '.add__value',
    inputButton: '.add__btn',
    incomeContainer: '.income__list',
    expensesContainer: '.expenses__list',
    budgetLabel: '.budget__value',
    incomeLabel: '.budget__income--value',
    expensesLabel: '.budget__expenses--value',
    percentageLabel: '.budget__expenses--percentage',
    container: '.container',
    expensesPercLabel: '.item__percentage'
  };

/// you want to write functions that will return functions, which can be used publicly. closure baby! getInput can now be used in other controllers.
  return {
    getInput: function(){
      return {
        type: document.querySelector(DOMStrings.inputType).value, /// save the value they input as 'type', it will be either 'inc' or 'exp'
        description: document.querySelector(DOMStrings.inputDescription).value, // this method return an object with these properties.
        value: parseFloat(document.querySelector(DOMStrings.inputValue).value)
      };
    },

    getDOMstrings: function(){
      return DOMStrings;      /// all this does is return the DOM strings, so we can now use them publicly in other controllers.
    },

    addListItem: function(obj, type){

      var html, newHtml, element;


      //create HTML string with placeholder text

      if (type === 'inc') {
        element = DOMStrings.incomeContainer;
        html = '<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
      } else if (type === 'exp') {
        element = DOMStrings.expensesContainer;
          html = '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
      }



      //replace the placeholder with some actual data
      newHtml = html.replace('%id%', obj.id);
      newHtml  = newHtml.replace('%description%', obj.description);
      newHtml = newHtml.replace('%value%', obj.value);


      //insert the HTML into the DOM
      document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);
    },
    deleteListItem: function(selectorID){

      var element = document.getElementById(selectorID)
      element.parentNode.removeChild(document.getElementById(selectorID)) // we can only remove things by using removeChild, so we must insert the parent before it, and the nthe child in the parentheses.
    },

    clearFields: function(){

      var fields, fieldsArr;

      fields = document.querySelectorAll(DOMStrings.inputDescription + ', ' + DOMStrings.inputValue);

      fieldsArr = Array.prototype.slice.call(fields); // trick it into thinking fields is an array, when its a list. we return it as an array

      fieldsArr.forEach(function(current, index, array) {
          current.value = "";
      });

      fieldsArr[0].focus();
    },

    displayBudget: function(obj){
      document.querySelector(DOMStrings.budgetLabel).textContent = obj.budget;
      document.querySelector(DOMStrings.incomeLabel).textContent = obj.totalInc;
      document.querySelector(DOMStrings.expensesLabel).textContent = obj.totalExp;


      if (obj.percentage > 0) {
          document.querySelector(DOMStrings.percentageLabel).textContent = obj.percentage + '%';
      } else {
        document.querySelector(DOMStrings.percentageLabel).textContent = '---'
      }
    },

    displayPercentages: function(percentages) {
      var fields = document.querySelectorAll(DOMStrings.expensesPercLabel); // returns a node list from the DOM. a node is just an html element. you cant call forEach on a node list, so we create our own foreach loop for node lists

      var nodeListForEach = function(list, callback){ //simply defining what the forEach loop does.
        for (var i = 0; i < list.length; i++) {
          callback(list[i], i);
        }
      };

      nodeListForEach(fields, function(current, index){  // here you are calling the function, and specifying what the callback will do.
        if (percentages[index] > 0) {
          current.textContent = percentages[index] + '%';
        } else {
          current.textContent = '---';
        }
      });

    },


  };
})();





////////////////////////////////////////GLOBAL CONTROLLER////////////////////////////////////////////////////////////////////////




var Controller = (function(budgetCtrl, UICtrl){ // this is the master controller! you can write functions in other controllers, but they are called in this controller


  var setupEventListeners = function(){   /// create a function where all of our event listeners are placed.
    var DOM = UIController.getDOMstrings(); // in this DOM variable, we have the DOM strings!! we can now use them.

    document.querySelector(DOM.inputButton).addEventListener('click', ctrlAddItem);

    document.addEventListener('keypress', function(event){  // pressing 'ENTER' doesnt happen on an element, it happens on the global document
        if (event.keyCode === 13) {
          ctrlAddItem();
        }
    });

    document.querySelector(DOM.container).addEventListener('click', ctrlDeleteItem); // we dont have access to DOMStrings, so we use getDOMStrings, and its saved as DOM, as shown above.
  };



  var ctrlAddItem = function() {

    var input, newItem;

    // get the field input data
    input = UICtrl.getInput();    // getInput is the public method we can access.

    if (input.description !== "" && !isNaN(input.value) && input.value > 0) { // this is to make sure things are typed into the field. // !isNaN ('is not NOT' a number, so 'is a number') to make sure there is  a number in the value field.         before executing!

      // add item to the budget controller
      newItem = budgetCtrl.addItem(input.type, input.description, input.value);

      //add new item to the user interface
      UICtrl.addListItem(newItem, input.type);

      //clear the field
      UICtrl.clearFields();

      //calculate and update budget
      updateBudget();

      //calculate and update percentages
      updatePercentages();
    }

  };

    var ctrlDeleteItem = function(event){ // we need to pass in the event because we need to know what the target element is!!, which is included in the event(event.taget)
      var itemID, splitID, type, ID;
      itemID = event.target.parentNode.parentNode.parentNode.parentNode.id; //because you want to delete the item, not only the target element, we have to use parentNode, and then get the id of the item.

      if (itemID) {
        //inc-1
        splitID = itemID.split('-'); // return [" "inc, "1"]
        type = splitID[0]; // the type is the first object in the array
        ID = parseInt(splitID[1]) ;

        // 1. delete item from data structure
        budgetCtrl.deleteItem(type, ID);
        //2. delete from UI
        UICtrl.deleteListItem(itemID);
        //3. update and show the new budget
        updateBudget();
        //4.calculate and update percentages
        updatePercentages();
      }
  };


  var updateBudget = function(){
    // 1.calculate the budget
    budgetCtrl.calculateBudget();
    //2. return the budget
    var  budget = budgetCtrl.getBudget();
    //3. display the budget on the UI
    UICtrl.displayBudget(budget);

  };

  var updatePercentages = function() {
    // 1.calculate the percentages
    budgetCtrl.calculatePercentages();
    // 2. read them from the budgetController
    var percentages = budgetCtrl.getPercentages();
    //3. update the UI with new percentages
    UIController.displayPercentages(percentages);

  };

  return { // because we are returning a function, we can use it publicly!
    init: function() {    //// we  return an init function that can be used publicly, (remember functions returning functions)
      console.log('App has started');
      UICtrl.displayBudget({
        budget: 0,
        totalInc: 0,
        totalExp: 0,
        percentage: -1
      });
      setupEventListeners();
    }
  };


  })(budgetController, UIController);



  Controller.init(); /// here, we call the init function that we setup. only line of code outside the modules.
