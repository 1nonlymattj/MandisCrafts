// ************************************************
// Shopping Cart API
// ************************************************

var shoppingCart = (function() {
   // =============================
   // Private methods and propeties
   // =============================
   cart = [];

   // Constructor
   function Item(name, price, count) {
      this.name = name;
      this.price = price;
      this.count = count;
   }

   // Save cart
   function saveCart() {
      sessionStorage.setItem('shoppingCart', JSON.stringify(cart));
   }

   // Load cart
   function loadCart() {
      cart = JSON.parse(sessionStorage.getItem('shoppingCart'));
   }
   if (sessionStorage.getItem("shoppingCart") != null) {
      loadCart();
   }

   // =============================
   // Public methods and propeties
   // =============================
   var obj = {};

   // Add to cart
   obj.addItemToCart = function(name, price, count) {
      for ( var item in cart) {
         if (cart[item].name === name) {
            cart[item].count++;
            saveCart();
            return;
         }
      }
      var item = new Item(name, price, count);
      cart.push(item);
      saveCart();
   }
   // Set count from item
   obj.setCountForItem = function(name, count) {
      for ( var i in cart) {
         if (cart[i].name === name) {
            cart[i].count = count;
            break;
         }
      }
   };
   // Remove item from cart
   obj.removeItemFromCart = function(name) {
      for ( var item in cart) {
         if (cart[item].name === name) {
            cart[item].count--;
            if (cart[item].count === 0) {
               cart.splice(item, 1);
            }
            break;
         }
      }
      saveCart();
   }

   // Remove all items from cart
   obj.removeItemFromCartAll = function(name) {
      for ( var item in cart) {
         if (cart[item].name === name) {
            cart.splice(item, 1);
            break;
         }
      }
      saveCart();
   }

   // Clear cart
   obj.clearCart = function() {
      cart = [];
      saveCart();
   }

   // Count cart
   obj.totalCount = function() {
      var totalCount = 0;
      for ( var item in cart) {
         totalCount += cart[item].count;
      }
      return totalCount;
   }

   // Total cart
   obj.totalCart = function() {
      var totalCart = 0;
      for ( var item in cart) {
         totalCart += cart[item].price * cart[item].count;
      }
      return Number(totalCart.toFixed(2));
   }

   // List cart
   obj.listCart = function() {
      var cartCopy = [];
      for (i in cart) {
         item = cart[i];
         itemCopy = {};
         for (p in item) {
            itemCopy[p] = item[p];

         }
         itemCopy.total = Number(item.price * item.count).toFixed(2);
         cartCopy.push(itemCopy)
      }
      return cartCopy;
   }

   // cart : Array
   // Item : Object/Class
   // addItemToCart : Function
   // removeItemFromCart : Function
   // removeItemFromCartAll : Function
   // clearCart : Function
   // countCart : Function
   // totalCart : Function
   // listCart : Function
   // saveCart : Function
   // loadCart : Function
   return obj;
})();

// *****************************************
// Triggers / Events
// *****************************************
// Add item
$('.add-to-cart').click(function(event) {
   event.preventDefault();
   var name = $(this).data('name');
   var price = Number($(this).data('price'));
   shoppingCart.addItemToCart(name, price, 1);
   displayCart();
});

// Clear items
$('.clear-cart').click(function() {
   shoppingCart.clearCart();
   displayCart();
});

function displayCart() {
   var cartArray = shoppingCart.listCart();
   var output = "";
   for ( var i in cartArray) {
      output += "<tr>" + "<td>" + cartArray[i].name + "</td>" + "<td>(" + cartArray[i].price + ")</td>"
            + "<td><div class='input-group'><button class='minus-item input-group-addon btn btn-primary' data-name="
            + cartArray[i].name + ">-</button>" + "<input type='number' class='item-count form-control' data-name='"
            + cartArray[i].name + "' value='" + cartArray[i].count + "'>"
            + "<button class='plus-item btn btn-primary input-group-addon' data-name=" + cartArray[i].name
            + ">+</button></div></td>" + "<td><button class='delete-item btn btn-danger' data-name="
            + cartArray[i].name + ">X</button></td>" + " = " + "<td>" + cartArray[i].total + "</td>" + "</tr>";
   }
   $('.show-cart').html(output);
   $('.total-cart').html(shoppingCart.totalCart());
   $('.total-count').html(shoppingCart.totalCount());
}

// Delete item button

$('.show-cart').on("click", ".delete-item", function(event) {
   var name = $(this).data('name')
   shoppingCart.removeItemFromCartAll(name);
   displayCart();
})

// -1
$('.show-cart').on("click", ".minus-item", function(event) {
   var name = $(this).data('name')
   shoppingCart.removeItemFromCart(name);
   displayCart();
})
// +1
$('.show-cart').on("click", ".plus-item", function(event) {
   var name = $(this).data('name')
   shoppingCart.addItemToCart(name);
   displayCart();
})

// Item count input
$('.show-cart').on("change", ".item-count", function(event) {
   var name = $(this).data('name');
   var count = Number($(this).val());
   shoppingCart.setCountForItem(name, count);
   displayCart();
});

displayCart();

var placeSearch, autocomplete;

//List all address components (corresponds to form field IDs and Google address object)
var componentForm = {
autocomplete: ['street_number', 'route'],
inputCity: 'locality',
inputState: 'administrative_area_level_1',
inputZip: 'postal_code',
inputCounty: 'administrative_area_level_2',
inputCountry: 'country'
};

//Create autocomplete object based on the autocomplete ("street") field
//Location type restricted to geocode
function initAutocomplete() {
autocomplete = new google.maps.places.Autocomplete(
   /** @type {!HTMLInputElement} */ (document.getElementById('autocomplete')),
   {type: ['geocode']});

 // Call fillInAddress when user selects an address from dropdown
autocomplete.addListener('place_changed', fillInAddress);
}

//Fill fields with values from Google Maps autocomplete object
function fillInAddress() {

// Get place data from autocomplete object
var place = autocomplete.getPlace();
console.log(place);

// Enable each field, then fill them with the corresponding value from the place object
for (var component in componentForm) {
 document.getElementById(component).disabled = false;
 document.getElementById(component).value = search(componentForm[component], place.address_components);
}

 // Original Google Implementation - do not use
// Get each component of the address from the place
// object and fill the corresponding field
//for (var i = 0; i < place.address_components.length; i++) {

//  var addressType = place.address_components[i].types[0];

//  if (componentForm[addressType]) {
//    var val = place.address_components[i][componentForm[addressType]];
//    document.getElementById(addressType).value = val;
//  }
//}

// Fill the autocomplete field with values from the place object
// If a street number is not found, set the field to route only.
if (search("street_number", place.address_components) != "") {
 document.getElementById("autocomplete").value = search("street_number", place.address_components) + " ";
}
document.getElementById("autocomplete").value += search("route", place.address_components);

// Search the passed object for a specified address component/type and return the short_name value of the matched component/type
// If requested type does not exist in the placeObject, return an empty string
function search(type, placeObject) {
 for (var i = 0; i < placeObject.length; i++) {
   if (placeObject[i].types[0] === type) {
     return placeObject[i].short_name;
   } else if (i === placeObject.length - 1) {
     return "";
   }
 }
}
}

$('#paymentPref').change(function () {
    if($(this).is(':checked')) {
        $('#paymentPref').attr('required');
    } else {
        $('#paymentPref').removeAttr('required');
    }
});

function sendMail() {
   var body = JSON.stringify(sessionStorage.getItem('shoppingCart'), null, '&nbsp').split(',').join('%0D%0A');
   var bodyPretty = JSON.parse(body);
   var notice = "Please Attach Photos If Ordering Lanterns";
   var info = "Please Fill Out Information Below: ";
   var customer = "Name: ";
   var phone = "Phone: ";
   var address = "Address: ";
   var items = "Items Purchased: ";
   var totalDue = "Total Amount Due When Item(s) Are Complete: "
   var total = shoppingCart.totalCart();
   var payment = item.value;
   //var bodyString = info + '%0D%0A' + customer + '%0D%0A' + phone + '%0D%0A' + address + '%0D%0A %0D%0A';
   var bodyString = 'Please Fill Out Information Below: %0D%0A Name: %0D%0A Phone: %0D%0A Address: %0D%0A %0D%0A'
   window.open('mailto:mattj5609@gmail.com?cc=mandimay5609@gmail.com&subject=Mandis Craft Boutique Order Form&body='
         + notice + '%0D%0A %0D%0A' + bodyString 
         + 'preferred payment type: %0D%0A' + payment + 'Venmo Name if selected: ' + '%0D%0A %0D%0A'
         + items + '%0D%0A' + bodyPretty + '%0D%0A %0D%0A' + totalDue + total);
}



//Array to store our Snowflake objects
var snowflakes = [];

// Global variables to store our browser's window size
var browserWidth;
var browserHeight;

// Specify the number of snowflakes you want visible
var numberOfSnowflakes = 300;

// Flag to reset the position of the snowflakes
var resetPosition = false;

// Handle accessibility
var enableAnimations = false;
var reduceMotionQuery = matchMedia("(prefers-reduced-motion)");

// Handle animation accessibility preferences 
function setAccessibilityState() {
  if (reduceMotionQuery.matches) {
    enableAnimations = false;
  } else { 
    enableAnimations = true;
  }
}
setAccessibilityState();

reduceMotionQuery.addListener(setAccessibilityState);

//
// It all starts here...
//
function setup() {
  if (enableAnimations) {
    window.addEventListener("DOMContentLoaded", generateSnowflakes, false);
    window.addEventListener("resize", setResetFlag, false);
  }
}
setup();

//
// Constructor for our Snowflake object
//
function Snowflake(element, speed, xPos, yPos) {
  // set initial snowflake properties
  this.element = element;
  this.speed = speed;
  this.xPos = xPos;
  this.yPos = yPos;
  this.scale = 1;

  // declare variables used for snowflake's motion
  this.counter = 0;
  this.sign = Math.random() < 0.5 ? 1 : -1;

  // setting an initial opacity and size for our snowflake
  this.element.style.opacity = (.1 + Math.random()) / 3;
}

//
// The function responsible for actually moving our snowflake
//
Snowflake.prototype.update = function () {
  // using some trigonometry to determine our x and y position
  this.counter += this.speed / 2000;
  this.xPos += this.sign * this.speed * Math.cos(this.counter) / 40;
  this.yPos += Math.sin(this.counter) / 40 + this.speed / 30;
  this.scale = .5 + Math.abs(10 * Math.cos(this.counter) / 20);

  // setting our snowflake's position
  setTransform(Math.round(this.xPos), Math.round(this.yPos), this.scale, this.element);

  // if snowflake goes below the browser window, move it back to the top
  if (this.yPos > browserHeight) {
    this.yPos = -50;
  }
}

//
// A performant way to set your snowflake's position and size
//
function setTransform(xPos, yPos, scale, el) {
  el.style.transform = `translate3d(${xPos}px, ${yPos}px, 0) scale(${scale}, ${scale})`;
}

//
// The function responsible for creating the snowflake
//
function generateSnowflakes() {

  // get our snowflake element from the DOM and store it
  var originalSnowflake = document.querySelector(".snowflake");

  // access our snowflake element's parent container
  var snowflakeContainer = originalSnowflake.parentNode;
  snowflakeContainer.style.display = "block";

  // get our browser's size
  browserWidth = document.documentElement.clientWidth;
  browserHeight = document.documentElement.clientHeight;

  // create each individual snowflake
  for (var i = 0; i < numberOfSnowflakes; i++) {

    // clone our original snowflake and add it to snowflakeContainer
    var snowflakeClone = originalSnowflake.cloneNode(true);
    snowflakeContainer.appendChild(snowflakeClone);

    // set our snowflake's initial position and related properties
    var initialXPos = getPosition(50, browserWidth);
    var initialYPos = getPosition(50, browserHeight);
    var speed = 5 + Math.random() * 40;

    // create our Snowflake object
    var snowflakeObject = new Snowflake(snowflakeClone,
      speed,
      initialXPos,
      initialYPos);
    snowflakes.push(snowflakeObject);
  }

  // remove the original snowflake because we no longer need it visible
  snowflakeContainer.removeChild(originalSnowflake);

  moveSnowflakes();
}

//
// Responsible for moving each snowflake by calling its update function
//
function moveSnowflakes() {

  if (enableAnimations) {
    for (var i = 0; i < snowflakes.length; i++) {
      var snowflake = snowflakes[i];
      snowflake.update();
    }      
  }

  // Reset the position of all the snowflakes to a new value
  if (resetPosition) {
    browserWidth = document.documentElement.clientWidth;
    browserHeight = document.documentElement.clientHeight;

    for (var i = 0; i < snowflakes.length; i++) {
      var snowflake = snowflakes[i];

      snowflake.xPos = getPosition(50, browserWidth);
      snowflake.yPos = getPosition(50, browserHeight);
    }

    resetPosition = false;
  }

  requestAnimationFrame(moveSnowflakes);
}

//
// This function returns a number between (maximum - offset) and (maximum + offset)
//
function getPosition(offset, size) {
  return Math.round(-1 * offset + Math.random() * (size + 2 * offset));
}

//
// Trigger a reset of all the snowflakes' positions
//
function setResetFlag(e) {
  resetPosition = true;
}
