// No Interaction Between budgetController and UIController//

var budgetController = (function(){

	var Expense = function(id, description, value){
		this.id = id;
		this.description = description;
		this.value = value;
		this.percentage = -1;
	}; 
	
	Expense.prototype.calcPercentage = function(totalIncome){
		
		if(totalIncome>0){
			this.percentage = Math.round((this.value / totalIncome) * 100 );
		} else{
			this.percentage = -1;
		}
	};
	Expense.prototype.getPercentage = function(){
		return this.percentage;
	};
		

	var Income = function(id, description, value){
		this.id = id;
		this.description = description;
		this.value = value;
	}; 

	var data = {			// data is simply an object that has 
		allItems: { 		//allItems as an object then it has two arrays stores instances of Expense and Income
			exp: [],
			inc: []	
		},
		totals: {			//totals is an obj that has totalexpenses and total incomes
			exp: 0,
			inc: 0 
		},
		budget: 0,
		percentage: -1


	};

	var calculateTotal = function(type){
		var sum = 0;
		data.allItems[type].forEach(function(cur){
			sum = sum+cur.value;

		});

		data.totals[type] = sum;



	};


	//Add a public method so that allows the other modules to add the dataStructure

	return {
		addItem: function(type, des, val) {
			var newItem, ID;

			//[1 2 3 4 5], next ID = 6
			//[1 2 4 6 8], next ID = 9
			// ID = last ID + 1

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

			//console.log(data);

			// Return the new element
			return newItem;
		},

		deleteItem: function(type, id){
			var ids, index;
			// inc = [1,3,5,6,9] 
			// data.alltems[type][id] ==> gives you element at A[3] i.e.,6 but not 3


			// ids = [1,3,5,6,9] 
			ids = data.allItems[type].map(function(current){
				return current.id;
			});


			index = ids.indexOf(id);

			if(index !== -1){
				data.allItems[type].splice(index, 1);
			}

		},



		calculateBudget: function(){



			//Calculate Total income and expenses
			calculateTotal('exp');
			calculateTotal('inc');



			//Calculate the budget: income - expenses
			data.budget = data.totals.inc - data.totals.exp;


			//calculate the percentage of income that we spent
			if(data.totals.inc>0){
				data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);
			}
			else{
				data.percentage = -1;
			}



		},

		getBudget: function(){
			return{
				budget: data.budget,
				percentage: data.percentage,
				totalInc: data.totals.inc,
				totalExp: data.totals.exp,
			}
		},
		
		
		
		
		
		
		
		calculatePercentages: function(){
		
			data.allItems.exp.forEach(function(cur) {
				cur.calcPercentage(data.totals.inc);
			})
		},

		
		getPercentages: function(){
			var allperc = data.allItems.exp.map(function(cur){
				return cur.getPercentage();	
			});
			return allperc;
		},
		
		
		
		
		
		
		testing: function(){
			console.log(data);
		}
	};



})();


















//UI CONTROLLER
var UIController = (function(){

	var DOMstrings = {
		inputType: '.add__type',
		inputDescription: '.add__description',
		inputValue: '.add__value',
		inputBtn: '.add__btn',
		incomeContainer: '.income__list',
		expensesContainer: '.expenses__list',
		budgetLabel: '.budget__value',
		incomeLabel: '.budget__income--value',
		expensesLabel: '.budget__expenses--value',
		percentageLabel: '.budget__expenses--percentage',
		container: '.container' ,
		expensesPercLabel: '.item__percentage',
		dateLabel: '.budget__title--month'

	};

	return{
		getInput: function(){
			return{													//Should return everything in one single object
				type: document.querySelector(DOMstrings.inputType).value,  				 //will be either inc or exp
				description: document.querySelector(DOMstrings.inputDescription).value,
				value: parseFloat(document.querySelector(DOMstrings.inputValue).value), //String is converted to floating number
			};
		},





		getDOMstrings: function(){
			return DOMstrings;
		},




		addListItem: function(obj,type){

			var html, element;
			//Create HTML string with placeholder text

			if(type === 'inc'){
				element = DOMstrings.incomeContainer;
				html = '<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div> ';

			}
			else if(type === 'exp'){
				element = DOMstrings.expensesContainer;
				html = '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>' ;
			}


			//Replace the placeholder text with some actual data
			var newHtml;

			newHtml = html.replace('%id%', obj.id);

			newHtml = newHtml.replace('%value%', obj.value);

			newHtml = newHtml.replace('%description%', obj.description);


			//Insert the HTML into the DOM
			document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);

		},


		deleteListItem: function(selectorId){
			var el = document.getElementById(selectorId);
			el.parentNode.removeChild(el); 
		},


		clearFields: function(){


			//querySelectorAll returns a nodelist of all elements on webpage from DOM
			var fields = document.querySelectorAll(DOMstrings.inputDescription + ', ' + DOMstrings.inputValue);

			
			//Slice is a ArrayMethod that can create a copy of list or array into an Array
			var fieldsArr = Array.prototype.slice.call(fields);

			//Looping in an Array. forEach can have max 3 arg
			fieldsArr.forEach(function(current, index, array){
				current.value = "";
				//console.log('Working');
			});
			
			fields[0].focus();



		},


		displayBudget: function(obj){

			//var type;

			//obj.budget > 0 ? type = 'inc' : type = 'exp';

			document.querySelector(DOMstrings.budgetLabel).textContent = obj.budget ;

			document.querySelector(DOMstrings.incomeLabel).textContent = obj.totalInc ;

			document.querySelector(DOMstrings.expensesLabel).textContent = obj.totalExp;

			if (obj.percentage > 0) {
				document.querySelector(DOMstrings.percentageLabel).textContent = obj.percentage + '%';
			} else {
				document.querySelector(DOMstrings.percentageLabel).textContent = '---';
			}




		},
		
		displayPercentages: function(percentages){ 
			
			var fields = document.querySelectorAll(DOMstrings.expensesPercLabel); //returns NodeList
			
			//created new foreach(user defined :) 
			//to get the list and call nodelistforeach function
			var nodeListForEach = function(list, callback){
				for(var i=0; i<list.length; i++){
					callback(list[i], i)
				}
			};
				
			nodeListForEach(fields, function(current, index){
				
				if(percentages[index]>0){
					current.textContent = percentages[index] + '%';
				}else{
					current.textContent = '---';
				}
				
			});
			},
		
		displayDate: function(){
			
			var now = new Date();
			

			//var newyear = new Date(2019, 0, 01); 
			
			var calender = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
			var month = now.getMonth();
			var year = now.getFullYear();
			document.querySelector(DOMstrings.dateLabel).textContent = calender[month] +' '+ year;
			
		}
		

	};


})();











// GLOBAL APP CONTROLLER
// Controller Module interacts with other two controller and acts as a bridge				

var controller = (function(budgetCtrl, UICtrl){

	var setupEventListeneres = function(){

		var DOM = UICtrl.getDOMstrings();
		document.querySelector(DOM.inputBtn).addEventListener('click',ctrlAddItem);

		//Keycode for Enterkey is 13
		document.addEventListener('keypress', function(event){
			if(event.keycode===13 || event.which===13 ){        //Not all browser's has keyboard property
				ctrlAddItem();
			}
		});



		// Use of Event Delegation
		document.querySelector(DOM.container).addEventListener('click',ctrlDeleteItem); 
	};

	/*document.querySelector('.container').addEventListener('click', function(event){
		console.log(event.target.parentNode);
	}); */





	/*var ctrlAddItem = function(){

		//1. Get the field input Data
		var input = UICtrl.getInput();					


		//Validate the False inputs 
		if(input.description !== "" && !isNaN(input.value) && input.value>0){

			//2. Add the item to Budget Controller
			var newItem = budgetCtrl.addItem(input.type, input.description, input.value);

			//3. Add the item to UI
			UICtrl.addListItem(newItem, input.type);

			//4. clear the Input fields
			UICtrl.clearFields();

			//Cal and Update the budget
			updateBudget();


		}



	}; */

	var updatePercentages = function(){

		//1. calculate Percentages
		budgetCtrl.calculatePercentages(); //data.totals.inc = budget.totalInc

		//2. Read the percentages from the budget controller
		var percentages = budgetCtrl.getPercentages();
		console.log(percentages);

		//3. Update the UI with the new percentages
		UICtrl.displayPercentages(percentages);
	};

	var ctrlAddItem = function() {
		var input, newItem;

		// 1. Get the field input data
		input = UICtrl.getInput();        

		if (input.description !== "" && !isNaN(input.value) && input.value > 0) {
			// 2. Add the item to the budget controller
			newItem = budgetCtrl.addItem(input.type, input.description, input.value);
			//console.log(newItem);

			// 3. Add the item to the UI
			UICtrl.addListItem(newItem, input.type);

			// 4. Clear the fields
			UICtrl.clearFields();

			// 5. Calculate and update budget
			updateBudget();

			// 6. Calculate and update percentages
			updatePercentages();
		}
	};




	//Event is where which the Target element is, CallBack function always has access to event object
	var ctrlDeleteItem = function(event){
		var itemId, splitID, type, ID;

		//We need to move $times up to reach Parent node
		itemId = event.target.parentNode.parentNode.parentNode.parentNode.id;
		// console.log(itemId); // Format result: inc-0 / exp-0

		if(itemId){

			splitID = itemId.split('-'); //retuns an array of type string where 1st(splitID[0]) element will be inc/exc based on the target element and 2nd(splitID[1]) will be the id.
			type = splitID[0];
			ID = parseInt(splitID[1]);
		}


		//1. Delete item from DataStructure
		budgetCtrl.deleteItem(type, ID);


		//2. Delete from UI

		UICtrl.deleteListItem(itemId);


		//3. Update and show new budget on UI
		updateBudget();

		// 4. Calculate and update percentages
		updatePercentages();
	}; 





	var updateBudget = function(){

		//5. Calculate the Budget
		budgetCtrl.calculateBudget();

		//6. Return the budget
		var budget = budgetCtrl.getBudget();

		//console.log(budget);

		//7. Display/Update the Budget on UI
		UICtrl.displayBudget(budget);  

	};




	return{


		init: function(){

			UICtrl.displayDate();
			UICtrl.displayBudget({
				budget: 0,
				totalInc: 0,
				totalExp: 0,
				percentage: -1
			}); 


			setupEventListeneres();

		}	


	};
})(budgetController, UIController);


controller.init();




