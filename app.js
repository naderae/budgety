
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


// !!!!!!!!!!!!!!! focus on the idea that you have to return funcions to mak them public, and then you can use these functions o communicate across modules.

var budgetController = (function(){



  var Expense = function(id, description, value) {
      this.id = id; // the id should be the id that we pass in
      this.description = description; // the description should be the description that we pass in
      this.value = value;
    };

  var Income = function(id, description, value) {
    this.id = id; // the id should be the id that we pass in
    this.description = description; // the description should be the description that we pass in
    this.value = value;
  };

  var data = {
      allItems: {
          exp: [],
          inc: []
      },
      totals: {
          exp: 0,
          inc: 0
      }
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
      }
  };



})();









var UIController = (function(){

  var DOMStrings = {
    inputType: '.add__type',
    inputDescription: '.add__description',
    inputValue: '.add__value',
    inputButton: '.add__btn',
    incomeContainer: '.income__list',
    expensesContainer: '.expenses__list'
  };

/// you want to write functions that will return functions, which can be used publicly. closure baby! getInput can now be used in other controllers.
  return {
    getInput: function(){
      return {
        type: document.querySelector(DOMStrings.inputType).value, /// save the value they input as 'type', it will be either 'inc' or 'exp'
        description: document.querySelector(DOMStrings.inputDescription).value, // this method return an object with these properties.
        value: document.querySelector(DOMStrings.inputValue).value
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
        html = '<div class="item clearfix" id="income-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
      } else if (type === 'exp') {
        element = DOMStrings.expensesContainer;
          html = '<div class="item clearfix" id="expense-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
      }



      //replace the placeholder with some actual data
      newHtml = html.replace('%id%', obj.id);
      newHtml  = newHtml.replace('%description%', obj.description);
      newHtml = newHtml.replace('%value%', obj.value);


      //insert the HTML into the DOM
      document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);
    },

    clearFields: function(){

      var fields, fieldsArr;

      fields = document.querySelectorAll(DOMStrings.inputDescription + ', ' + DOMStrings.inputValue);

      fieldsArr = Array.prototype.slice.call(fields); // trick it into thinking fields is an array, when its a list. we return it as an array

      fieldsArr.forEach(function(current, index, array) {
          current.value = "";
      });

      fieldsArr[0].focus();
    }


  };
})();










var Controller = (function(budgetCtrl, UICtrl){ // this is the master controller! you can write functions in other controllers, but they are called in this controller


  var setupEventListeners = function(){   /// create a function where all of our event listeners are placed.
    var DOM = UIController.getDOMstrings(); // in this DOM variable, we have the DOM strings!! we can now use them.

    document.querySelector(DOM.inputButton).addEventListener('click', ctrlAddItem);

    document.addEventListener('keypress', function(event){  // pressing 'ENTER' doesnt happen on an element, it happens on the global document
        if (event.keyCode === 13) {
          ctrlAddItem();
        }
    });
  };



  var ctrlAddItem = function() {

    var input, newItem;
    // get the field input data
    input = UICtrl.getInput();    // getInput is the public method we can access.

    // add item to the budget controller
    newItem = budgetCtrl.addItem(input.type, input.description, input.value);

    //add new item to the user interface
    UICtrl.addListItem(newItem, input.type);

    //clear the field
    UICtrl.clearFields();

    //calculate and update budget
    updateBudget();

  };


  var updateBudget = function(){
    // 1.calculate the budget

    //2. return the budget

    //3. display the budget on the UI


  };

  return { // because we are returning a function, we can use it publicly!
    init: function() {    //// we  return an init function that can be used publicly, (remember functions returning functions)
      console.log('App has started');
      setupEventListeners();
    }
  };


  })(budgetController, UIController);



  Controller.init(); /// here, we call the init function that we setup. only line of code outside the modules.
