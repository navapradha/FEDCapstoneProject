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
var product_filter = [];
var initial_drop_id = "";

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
        $("#save-products").replaceWith("<button id='update-form' name='success' class='btn btn-success'>Update</button>");
        $.each(product_list, function (key, element) {
            if (element._id == productId) {
                alert(element._id);
                alert(productId);
                $("#product-name").val(element.name);
                $("#product-price").val(element.price);
                $("#product_category").val(element.category);
                $("#product-description").val(element.description);
            }
        });

        $(document).on("click", "#update-form", function () {
           alert("inside edit");
                editProduct(productId);
            
        });
    });

      $(document).on("click", "i[id^='close-']", function () {
        var category = this.id.substr(6);
        $("#drop-" + category).remove();
        $("#close-" + category).remove();
        initial_drop_id = "";

        product_filter = product_filter.filter(function (value) {
            return value != category;
        });

        filterProducts();
    });

      $(document).on("click", "button[id^='upload-']", function () {
          alert("test image");
        upload_id = this.id.substr(7);
        uploadImage(upload_id, image_file);
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
     $('#clear-form').click();
    $("#dropped-categories").empty();
    $("#searchText").val('');
     product_filter = [];

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
                        product_template += "<div class='col-lg-12 panel panel-default dashboard_graph' id = 'test-filter'>"
                        + "<div class='col-lg-3'><div>"
                            + "<img id='image-div-" + value._id + "' src=" + value.productImg.filePath.substr(9) + " style='width:100%'></div>"
                            + "<div id='upload'><button class='btn btn-link' style='padding-left: 45%' id='upload-" + value._id + "'>"
                            + "<span class='fa fa-upload'> Upload</button></div></div>"
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
  alert("inside edit");
        $.ajax({
        url: "product/" + id,
        type: 'PUT',
        dataType: 'json',
        data: validateProductDetails(),
        success: function (data, status, jqXmlHttpRequest) {
            console.log("Status: ", status);
            alert(status);
        },
        complete: function (data) {
            $('#alert-banner-form').empty();
            $("#alert-banner-form").html('<div class="alert alert-success alert-dismissable fade in" role="alert"><button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>Updated Successfully</div>');
            
            $('#alert-banner-form').slideUp(1000, function () {
                $(this).empty().show();
            });
            getProducts();
        }
    });

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


function allowDrop(ev) {
    
    ev.preventDefault();
}

function drag(ev) {
    ev.dataTransfer.setData("text", ev.target.id);
}

function drop(ev) {
    alert("inside");
    ev.preventDefault();
    $("#searchText").val('');
    var data = ev.dataTransfer.getData("text");
    alert(data);
    if (initial_drop_id != data) {
        alert("inside if");
        initial_drop_id = data;
        var categoryName = $('#' + data).val();
        alert(categoryName);
        product_filter.push(categoryName);

        var button_element = document.createElement('button');
        button_element.type = "button";
        button_element.value = categoryName;
        button_element.className = "btn btn-success";
        button_element.innerHTML = categoryName;
        button_element.id = "drop-" + categoryName;

        var spanElement = document.createElement('i');
        spanElement.className = "fa fa-times-circle";
        spanElement.id = "close-" + categoryName;
        spanElement.style.color = "#a50b0b";
        spanElement.setAttribute("aria-hidden", "true");
        spanElement.appendChild(document.createTextNode("     "))

        ev.target.appendChild(button_element);
        ev.target.appendChild(spanElement);

        filterProducts();

    }

}


function filterProducts() {
    $.each(product_filter, function (i, category_name) {

        $("#product-list #test-filter").each(function (key, productListDiv) {
            if ($(productListDiv).text().search(category_name) < 0) {
                $(productListDiv).hide();
            }
        });
    });

    $.each(product_filter, function (i, category_name) {
        $("#product-list #test-filter").each(function (key, productListDiv) {
            if ($(productListDiv).text().search(category_name) > 0) {
                $(productListDiv).show();
            }
        });
    });

    if (product_filter.length == 0) {
        $("#product-list #test-filter").show();
    }
}





function uploadImage(id, file) {
    alert("test img");
    var formData = new FormData();
    formData.append('file', file);
    console.log(formData.get);
    $.ajax({
        url: "product/" + id + "/ProductImg",
        type: 'PUT',
        data: formData,
        contentType: false,
        processData: false,
        success: function (data, status, jqXmlHttpRequest) {
            $('#alert-banner').empty();
            $("#alert-banner").html('<div class="alert alert-success alert-dismissable fade in" role="alert"><button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>Image Uploaded Successfully</div>');

            $('#alert-banner').slideUp(1000, function () {
                $(this).empty().show();
            });

            getProducts();
        }
    });
}
