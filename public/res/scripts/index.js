/*NOTE: All response from API Call will contain the following structure
/*
    {
        "status": "success",=====> will contain either 'success' or 'failure'
        "code": 200,======> status code Ex:404,500,200
        "data": {},====>>requested data
        "error": ""====>>if any errors
    }
*/


/*Global Variables Section*/
var product_list;
var productId;

//Declare your Global Variables inside this block

/*End of Global Variables*/

// A $(document).ready() block.
$(document).ready(function() {
    
    //code block for free text search.
      $("#searchText").keyup(function() {
       
        var value = $(this).val().toLowerCase();
    $("#product-list div").filter(function() {
      $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
    });
  
        
    });
     $(document).on("click", "button[id^='edit-product-']", function () {
        productId = this.id.substr(13);
        $("#panel-header").html("Edit Product");
        $("#save-products").replaceWith("<button id='update-product' name='success' class='btn btn-success'>Update</button>");
        $.each(product_list, function (key, element) {
            if (element._id == productId) {
                $("#product-name").val(element.name);
                $("#product-price").val(element.price);
                $("#product-category").val(element.category);
                $("#product-description").val(element.description);
            }
        });

        $(document).on("click", "#update-form", function () {
           
                editProduct(productId);
            
        });
    });

});

function validateProductDetails() {
var name = $("#product-name").val();
var category = $("#product_category").val();
alert(category);
var price = $("#product-price").val();
var description = $("#product-description").val();

   if(!name || !category || !price ||  !description ){
      alert("why");
      $("#success-info").empty();
      $("#success-info").append("Please fill all the fields").attr("class", "btn btn-danger").attr("style", "text-align:center;width:200px;"); //append information to #success-info
      return false;
   } else{
     return{name: name,
          category: category,
          price : price,
          description : description }  
   }
    }

//Get List of Products from the database
function getProducts() {
alert("test");
    $("#button-categories").empty();
    $("#product-list").empty();

    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
      
        if (this.readyState == 4 && this.status == 200) {
          
            //JSON.parse is used to convert response String into JSON object
            responseObj = JSON.parse(this.response);
            //User cannot print JSON Object directly, so require JQuery to iterate
            // and show it in HTML
            //product_template="<table>";
            var cat_array = [];
           
            $.each(responseObj, function (i, item) {
                if (i == "data") {
                    
                    product_list = item;
                    $.each(item, function (key, value) {
                        //Right Code to update in the Product Template
                        product_template += "<div class='col-md-12 panel panel-default'>"
                            + "<div class='col-lg-3 col-md-3'><div>"
                            + "<img id='image-div-" + value._id + "' src=" + value.productImg.filePath.substr(9) + " style='width:100%'></div>"
                            + "<div id='upload'><button class='btn btn-link' style='padding-left: 45%' id='upload-" + value._id + "'>"
                            + "<span class='fa fa-upload' onclick='uploadImage()'> Upload</button></div></div>"
                            + "<div id='" + value.category + "-" + value._id + "' class='col-lg-9 col-md-9'>"
                            + "<h4>" + value.name + "</h4>"
                            + "<p>" + value.description + "</p>"
                            + "<p><span class='label label-default'><i id='product-category'>" + value.category + "</i></span></p>"
                            + "<b style='color: brown'>Rs. <i>" + value.price + "</i></b></div>"
                            + "<div class='col-lg-12 panel-footer'><div>"
                            + "<button id='remove-product-" + value._id + "' class='btn btn-danger' onclick='removeProduct(this.id)'>"
                            + "<span class='glyphicon glyphicon-trash'></span> Remove</button>"
                            + "<button id='edit-product-" + value._id + "' class='btn btn-success'>"
                            + "<span class='glyphicon glyphicon-edit'></span> Edit</button></div></div></div>"
                        cat_array.push(value.category);
                    });
                }
            });
        } else if (this.status == 404) {
            document.getElementById("product-list").innerHTML = "<h4>No Products Available</h4>"
        }

        $.each(jQuery.unique(cat_array), function (i, value) {
            button_categories += "<button id='drag-" + value + "' class='btn btn-success draggable' draggable='true' ondragstart='drag(event)' value = " + value + ">" + value + "</button>";
        });

        document.getElementById("product-list").innerHTML = product_template;
        document.getElementById("button-categories").innerHTML = button_categories;
    };
    xhttp.open("GET", "products", true);
    xhttp.send();
     product_template = "";
    button_categories = "";
    
    /***
    Write your code for fetching the list of product from the database
    
    Using AJAX call the webservice http://localhost:3000/products in GET method
    It will return an Array of objects as follows
    
        {
            [
                {
                    "_id" : "57b6fabb977a336f514e73ef",
                    "price" : 200,
                    "description" : "Great pictures make all the difference. That’s why there’s the new Moto G Plus, 4th Gen. It gives you a 16 MP camera with laser focus and a whole lot more, so you can say goodbye to blurry photos and missed shots. Instantly unlock your phone using your unique fingerprint as a passcode. Get up to 6 hours of power in just 15 minutes of charging, along with an all-day battery. And get the speed you need now and in the future with a powerful octa-core processor.",
                    "category" : "Smartphones",
                    "name" : "Moto G Plus, 4th Gen (Black, 32 GB)",
                    "productImg" : {
                    "fileName" : "57b6fabb977a336f514e73ef_Product.png",
                    "filePath" : "./public/images/Product/57b6fabb977a336f514e73ef_Product.png",
                    "fileType" : "png"
                },
                {
                    //Next Product and so on
                }
            ]
        }

    Using jQuery
    Iterate through this response array and dynamically create the products list
    using JavaScript DOM and innerHTML.
    ***/
}

//Initial call to populate the Products list the first time the page loads
getProducts();


/*
 
 Write a generic click even capture code block 
 to capture the click events of all the buttons in the HTML page

 If the button is remove
 -----------------------
 Popup an alert message to confirm the delete
 if confirmed
 Call the API
    http://localhost:3000/product/<id>
    with method = DELETE
    replace <id> with the _id in the product object

 Show the success/failure message in a message div with the corresponding color green/red


 If the button is add
 -----------------------
 Using jQuery Validate the form
 All fields are mandatory.
 Call the API
    http://localhost:3000/product
    with method=POST
    For this call data should be in following structure
    {
         name:'',
         category:'',
         description:'',
         price:''
    }

 Show the success/failure messages in a message div with the corresponding color green/red
 Reset the form and set the mode to Add

 
 If the button is edit
 ---------------------
 Change the Form to Edit Mode
 Populate the details of the product in the form
 
 
 If the button is Update
 -----------------------
 Using jQuery Validate the form
 All fields are mandatory.
 Call the API
    http://localhost:3000/product/:id    
    with method=PUT
    replace <id> with the _id in the product object
    For this call data should be in following structure
     {
     name:'',
     category:'',
     description:'',
     price:''
     }

 Show the success/failure messages in a message div with the corresponding color green/red
 Reset the Form
 Set the Form back to Add mode

 if the button is Cancel
 -----------------------
 Reset the form
 Set the mode to Add

 */

/*Remove Product*/
function removeProduct(id) {
   var id = id.substr(15);
    if(window.confirm("Are you sure you want to remove this product")){
            $.ajax({
    url: "http://localhost:3000/product/" + id,
    method: 'DELETE',
    contentType: 'application/json',
    success: function(data,status) {
    // handle success
    $("#alert-banner").empty();
    $("#alert-banner").append("Successfully removed").attr("class", "btn btn-success").attr("style", "text-align:left;width:970px;");
    getProducts();
    },
    error: function(data,status) {
    // handle failure
     $("#alert-banner").empty();
     $("#alert-banner").append("The product cannot be removed").attr("class", "btn btn-danger").attr("style", "text-align:left;width:970px;");
    }
});
        } else {
            return false;
        }
    }

/*Update Product*/
function editProduct(id) {

    //write your code here to update the product and call when update button clicked

}

function createProduct() {
  var formData = validateProductDetails();
  $.post("http://localhost:3000/product",
        formData,
        function(data,status){
            alert("Data: " + data + "\nStatus: " + status);
            
        }).done(function() {
    $("#success-info").empty();
    $("#success-info").append("Products saved successfully").attr("class", "btn btn-success"); //append information to #success-info 
    getProducts();
  });
        

}


/* 
    //Code Block for Drag and Drop Filter

    //Write your code here for making the Category List
    Using jQuery
    From the products list, create a list of unique categories
    Display each category as an individual button, dynamically creating the required HTML Code

    
    //Write your code here for filtering the products list on Drop 
    Using jQuery
    Show the category button with a font-awesome times icon to its right in the filter list
    A category should appear only once in the filter list
    Filter the products list with, products belonging to the selected categories only


    //Write your code to remove a category from the filter list
    Using jQuery
    When the user clicks on the x icon
    Remove the category button from the filter list
    Filter the products list with, products belonging to the selected categories only

 */





//Code block for Image Upload

function uploadImage(){
     $("#my_file").click();
}

/*
    //Write your Code here for the Image Upload Feature
    Make the product image clickable in the getProducts() method.
    When the user clicks on the product image
    Open the file selector window
    Display the selected image as a preview in the product tile
    
    //Image Upload
    When the user clicks Upload
    Using AJAX
    Update the product image using the following api call
        Call the api
            http://localhost:3000/product/id/ProductImg
            method=PUT
            the data for this call should be as FormData
            eg:
            var formData = new FormData();
            formData.append('file', file, file.name);
    
    Refresh the products list to show the new image
 */
