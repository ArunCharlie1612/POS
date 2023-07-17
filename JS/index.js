
//Validation of our Form Data

var itemNoErr = document.getElementById('itemNoErr');
var itemPriceErr = document.getElementById('itemPriceErr');
var purchasedErr = document.getElementById('purchasedErr');
var itemNameErr = document.getElementById('itemNameErr');
var categoryErr = document.getElementById('categoryErr');
var fileErr = document.getElementById('fileErr');

//Item Number validation
function validateitemNo() {

    var itemNo = document.getElementById('itemNo').value;

    if (!itemNo.match(/^[0-9]/)) {
        itemNoErr.innerHTML = "Enter valid Number";
        return false;
    }
    itemNoErr.innerHTML = "";
    return true;
}

//Item Price validation
function validateitemPrice() {

    var itemPrice = document.getElementById('itemPrice').value;

    if (!itemPrice.match(/^[0-9]+$/)) {
        itemPriceErr.innerHTML = "Enter valid Number";
        return false;
    }
    itemPriceErr.innerHTML = "";
    return true;
}

//Purchased Validation

function validatepurchased() {

    var purchased = document.getElementById('purchased').value;

    if (!purchased.match(/^[0-9]+$/)) {
        purchasedErr.innerHTML = "Enter valid Number";
        return false;
    }
    purchasedErr.innerHTML = "";
    return true;
}

//Item Name Validation
function validateitemName() {
    var itemName = document.getElementById('itemName').value;

    if (itemName.length == 0) {
        itemNameErr.innerHTML = "Item Name is required";
        return false;
    }
    if (!itemName.match(/^[A-Za-z]+$/)) {
        itemNameErr.innerHTML = "Item Name must be an alphabet";

        return false;
    }
    itemNameErr.innerHTML = "";
    return true;
}

//Item Category Validation

function validateCategory() {
    var category = document.querySelector('input[type="radio"]:checked').value;

    if (!category) {
        categoryErr.innerHTML = "You must Select category";
        return false;
    }
    categoryErr.innerHTML = "";
    return true;
}

//File Validation

function validateFiles() {
    var itemImage = document.getElementById('itemImage');
    if (!itemImage.files || itemImage.files.length === 0) {
        fileErr.innerHTML = "Please Select Image";
        return false;
    }
    fileErr.innerHTML = "";
    return true;
}

//Complete Form Validation.

function completeValidation() {
    if (!validateitemNo() || !validateitemName() || !validateCategory() || !validateitemPrice() || !validatepurchased()) {
        return false;
    }
    alert("Successfully Submitted the value !");
    return true;
}

//Clear the Form
function clearForm() {
    document.getElementById('itemNo').value = "";
    document.getElementById('itemName').value = "";
    document.getElementById('purchased').value = "";
    document.getElementById('itemPrice').value = "";
    document.querySelector('input[type="radio"]').checked = false;

    document.getElementById('itemImage').value = "";
    document.querySelectorAll('.errMsges').forEach(function (errMsg) {
        errMsg.innerHTML = "";
    });
}

//Clear the Calculator Form
function ClearCalculatorForm() {
    document.getElementById('AddPartItemNumber').value = "";
    document.getElementById('AddPartQuantity').value = "";
    document.getElementById('AddParttableName').value = "";
    document.getElementById('AddPartCover').value = "";
}


// ------------------------------------End Validation-----------------------------------------------------------------


//Local Storage for getting the Images 

function itemsReadData() {
    var objectData = localStorage.getItem('objectData') ? JSON.parse(localStorage.getItem('objectData')) : [];
    var salesReport = localStorage.getItem('salesReport') ? JSON.parse(localStorage.getItem('salesReport')) : [];
    var tablesElementData = "";

    //Using map instead of forEach
    objectData.map(function (record, index) {
        
        tablesElementData += "<tr class='categoryCheck'>";
        tablesElementData += "<td>" + record.itemNo + "</td>";
        tablesElementData += "<td>" + record.itemName + "</td>";
        tablesElementData += "<td>" + record.category + "</td>";
        tablesElementData += "<td> $" + record.itemPrice + "</td>";
        tablesElementData += "<td>" + record.purchased + "</td>";

        var sold = 0;
        var stockDataValue;

        // Finding Sold Data , Stock Data
        salesReport.forEach((salesRecord) => {
            if (salesRecord.itemName === record.itemName) {
                sold += parseInt(salesRecord.quantity);
                stockDataValue = parseInt(record.purchased) - parseInt(sold);
            }
        });
        tablesElementData += "<td><p id='soldData'>" + sold + "</p></td>";
        stockDataValue = record.purchased - sold;
        tablesElementData += "<td><p id='stocksData'>" + stockDataValue + "</p></td>";

        // End Finding Sold Data , Stock Data

        //Status Data
        if (stockDataValue > 0) {
            tablesElementData += "<td><p style='color:green'>Available</p>";
        }
        else {
            tablesElementData += "<td><p style='color:red'>Unavailable</p></td>"
        }
        //End Status Data


        //   Parsing Image from base64 format to URL
        if (record.itemImage) {
            tablesElementData += "<td><img src='" + record.itemImage + "' alt='Item Image' height='50px' width='50px' class='item-image'></td>";
        } else {
            tablesElementData += "<td></td>";
        }

        //   Parsing Image from base64 format to URL

        tablesElementData += '<td class="d-flex gap-4"><button class="btn btn-success cursor-pointer" data-bs-toggle="modal" data-bs-target="#myModal" onClick="editModalFormData(' + index + ')"><i class="fa fa-pencil" aria-hidden="true"></i>';
        tablesElementData += '<button class="btn btn-danger cursor-pointer" onClick="deleteFormData(' + index + ')"><i class="fa fa-minus-circle delete_black" aria-hidden="true"></i>';
        tablesElementData += "</td></tr>";
    });

    document.getElementById('tableInventoryData').innerHTML += tablesElementData;
}

window.addEventListener('load', itemsReadData);     //Render all the Items when page loads.

// Updating Image Submit Function
function SubmitData() {
    var itemNo = document.getElementById('itemNo').value;
    var itemName = document.getElementById('itemName').value;
    var itemPrice = document.getElementById('itemPrice').value;
    var purchased = document.getElementById('purchased').value;
    var imageInput = document.getElementById('itemImage');
    var categoryRadio = document.querySelector('input[name="category"]:checked');
    var purchasedDate = document.getElementById('purchasedDate').value;
    var category = categoryRadio ? categoryRadio.value : "";

    //Check if an Image is null or undefined
    if (!imageInput.files[0]) {
        alert("Please select an image.");
        return;
    }

    
    const file = imageInput.files[0]; //If multiple file means store first file in "file" variable.
    
    const reader = new FileReader();  // File Reader like API to read the data.

    reader.onload = function (event) {
        const imageDataUrl = event.target.result;
        var objectData = localStorage.getItem('objectData') ? JSON.parse(localStorage.getItem('objectData')) : [];

        objectData.push({
            itemNo: itemNo,
            itemName: itemName,
            category: category,
            itemPrice: itemPrice,
            purchased: purchased,
            purchasedDate: purchasedDate,
            itemImage: imageDataUrl
        });

        localStorage.setItem('objectData', JSON.stringify(objectData));

        //   AddingDrinksImages();

        // Redirect after the data is saved
        window.location.href = "../Inventory/inventory.html";

        // Perform any other required actions
        itemsReadData();
        clearForm();
    };

    reader.onerror = function () {
        alert("Error reading the file. Please try again.");
    };

    reader.readAsDataURL(file); // Read the binary data and encode it as a BaseURL 
}


//Delete the item permanantly from the table 

function deleteFormData(index) {

    var objectData = localStorage.getItem("objectData") === null ? [] : JSON.parse(localStorage.getItem("objectData"));

    objectData.splice(index, 1);

    localStorage.setItem("objectData", JSON.stringify(objectData));
    itemsReadData();
}




//Clear the modal form

function clearModalForm() {
    document.getElementById('mitemNo').value = "";
    document.getElementById('mitemName').value = "";
    document.getElementById('mpurchased').value = "";
    document.getElementById('mitemPrice').value = "";
    document.querySelector('input[type="radio"]').checked = false;

    document.getElementById('mitemImage').value = "";
    document.querySelectorAll('.errMsges').forEach(function (errMsg) {
        errMsg.innerHTML = "";
    });
}

//Edit the modal form

function editModalFormData(index) {
    
    var objectData = localStorage.getItem('objectData') ? JSON.parse(localStorage.getItem('objectData')) : [];

    // console.log(objectData[index].itemName);
    document.getElementById('mitemNo').value = objectData[index].itemNo;
    document.getElementById('mitemName').value = objectData[index].itemName;
    document.getElementById('mitemPrice').value = objectData[index].itemPrice;
    document.getElementById('mpurchased').value = objectData[index].purchased;
    document.getElementById('mpurchasedDate').value = objectData[index].purchasedDate;

    var categVal = objectData[index].category;
    if (categVal === "snacks") {
        document.getElementById('msnacks').checked = true;
    }
    else if (categVal === "drinks") {
        document.getElementById('mdrinks').checked = true;
    }
    else {
        return;
    }
    document.getElementById('mupdate').addEventListener('click', function () {

        // ValidateModalFormValues();
        var objectData = localStorage.getItem("objectData") ? JSON.parse(localStorage.getItem("objectData")) : [];

        objectData[index].itemNo = document.getElementById('mitemNo').value;
        objectData[index].itemName = document.getElementById('mitemName').value;
        objectData[index].itemPrice = document.getElementById('mitemPrice').value;
        objectData[index].purchased = document.getElementById('mpurchased').value;
        objectData[index].purchasedDate = document.getElementById('mpurchasedDate').value;
        //s objectData[index].itemImage = document.getElementById('mitemImage').value;

        objectData[index].category = document.querySelector('input[name="mcategory"]:checked').value;


        localStorage.setItem("objectData", JSON.stringify(objectData))
        itemsReadData();
        window.location.href = "../Inventory/inventory.html";



    });
}

var idunique;

// Input Function

function myActiveFunction(idValue) {
    // console.log(idValue);
    idunique = idValue;
}
function clickButton(e) {
    document.getElementById(idunique).value += e;
}

// End Input Function


//AC Function

function ACCalculatorFunction() {
    document.getElementById(idunique).value = "";
}

// End AC Function




// End Left Part Add Item Calculator

//-------------------------------------------------Billing Section-------------------------------------------------


var TotalItemsPriceValue = 0;
// Clicking the Drinks Image and Get Data
function BillingReadData() {
    var BillingData = localStorage.getItem('BillingData') ? JSON.parse(localStorage.getItem('BillingData')) : [];
    var BillingContentData = "";
    var TotalPricevalue = 0;

    BillingData.forEach((record) => {

        BillingContentData += "<tr>";
        BillingContentData += "<td>" + record.itemName + "</td>";
        BillingContentData += "<td>" + record.itemQuantity + "</td>";
        BillingContentData += "<td> $" + record.itemPrice + "</td>";
        BillingContentData += "<td id='itemsTotalPrice'> $" + (record.itemQuantity * record.itemPrice) + "</td>";
        BillingContentData += "<tr>";

        TotalPricevalue += parseInt(record.itemPrice) * parseInt(record.itemQuantity);
    });

    // console.log(TotalItemsPriceValue);
    document.getElementById('BillingTableData').innerHTML = BillingContentData;
    // Update the total price in the UI
    document.getElementById('TotalPrice').innerHTML = TotalPricevalue;

}

window.addEventListener('load', BillingReadData);

var Totalamount = 0;
var BillingPriceValue = document.getElementById('BillingPriceValue');

function renderTotalAmount(amountVal) {
    Totalamount += amountVal;
    BillingPriceValue.innerHTML = Totalamount;
}


// ---------------------------Drinks Clickable Function-------------------------------------------

var itemQuantity = 1;
function AddingDrinksImages() {
    var objectData = localStorage.getItem('objectData') ? JSON.parse(localStorage.getItem('objectData')) : [];
    for (let a = 0; a < objectData.length; a++) {

    //------------------ If category value is Drinks Means--------------------------------------------------------

        if (objectData[a].category == "drinks") {
            var imageTitle = objectData[a].itemName;
            var imageSrc = objectData[a].itemImage;
            var imgMainDiv = document.createElement("button");
            var imgElement = document.createElement("img");
            var imgPara = document.createElement("p");
            imgElement.src = imageSrc;
            imgPara.innerHTML = imageTitle;
            imgElement.className = "drinksImageStyle";
            // imgElement.height = "100px";
            // imgElement.width = "100px";

            imgMainDiv.addEventListener('click', () => {

                var BillingData = localStorage.getItem('BillingData') ? JSON.parse(localStorage.getItem('BillingData')) : [];

                let currentDate = new Date().toJSON().slice(0, 10);

                var existing = BillingData.find((item1) => item1.itemName === objectData[a].itemName);
                if (existing) {
                    existing.itemQuantity += 1; // Increase the quantity of the existing item
                    existing.itemsTotalPrice = existing.itemQuantity * existing.itemPrice; // Update the total price
                } else {
                    BillingData.push({
                        "itemName": objectData[a].itemName,
                        "itemPrice": objectData[a].itemPrice,
                        "itemQuantity": itemQuantity,
                        "TotalPrice": objectData[a].itemPrice * itemQuantity,
                        "TotalBillingPrice": AddingBillingPrice,
                        "BillingDate": currentDate
                    });
                }

                // Store the updated BillingData in local storage
                localStorage.setItem('BillingData', JSON.stringify(BillingData));
                renderTotalAmount(parseFloat(objectData[a].itemPrice));

                BillingReadData();

            });

            imgMainDiv.appendChild(imgElement);
            imgMainDiv.appendChild(imgPara);
            imgMainDiv.className = "drinksImageDiv";
            document.getElementById("DrinksSection").appendChild(imgMainDiv);
        }

    //------------------ If category value is Snacks Means--------------------------------------------------------

        else{
            var snackName = objectData[a].itemName;
            var snackMainDiv = document.createElement("button");
            snackMainDiv.innerHTML = snackName;
            snackMainDiv.id = snackName;
            snackMainDiv.value = snackName;
            snackMainDiv.addEventListener('click', () => {
                var BillingData = localStorage.getItem('BillingData') ? JSON.parse(localStorage.getItem('BillingData')) : [];
                let currentDate = new Date().toJSON().slice(0, 10);
                var existing = BillingData.find((item1) => item1.itemName === objectData[a].itemName);
                if (existing) {
                    existing.itemQuantity += 1; // Increase the quantity of the existing item
                    existing.itemsTotalPrice = existing.itemQuantity * existing.itemPrice; // Update the total price
                } else {
                    BillingData.push({
                        "itemName": objectData[a].itemName,
                        "itemPrice": objectData[a].itemPrice,
                        "itemQuantity": itemQuantity,
                        "TotalPrice": objectData[a].itemPrice * itemQuantity,
                        "TotalBillingPrice": AddingBillingPrice,
                        "BillingDate": currentDate
                    });
                }

                // Store the updated BillingData in local storage
                localStorage.setItem('BillingData', JSON.stringify(BillingData));
                renderTotalAmount(parseFloat(objectData[a].itemPrice));

                BillingReadData();

            });
            document.getElementById('snacksPart').appendChild(snackMainDiv);

        }
    }
}

window.addEventListener('load', AddingDrinksImages);


// -------------------------End Clicking the Drinks Image and Get Data----------------------------------------------------

function removeTotalAmount(amountVal) {
    Totalamount -= amountVal;
    BillingPriceValue.innerHTML = Totalamount;
}


//Cancel Item From Billing Section
function CancelItem() {
    var BillingData = localStorage.getItem('BillingData') ? JSON.parse(localStorage.getItem('BillingData')) : [];

    removeTotalAmount(BillingData[BillingData.length - 1].itemPrice);
    BillingData.pop();
    localStorage.setItem('BillingData', JSON.stringify(BillingData));

    BillingReadData();

    // renderTotalAmount(ParseInt(BillingData.itemPrice));

}

//Cancel Item From Billing Section


//New Bill
function NewBill() {
    TerminateTransaction();
    DelAllBill();
}

//End New Bill
// -------------------------------------------------------------------------------------------------------------
//Delete all Transaction

function DelAllBill() {
    var BillingData = localStorage.getItem('BillingData') ? JSON.parse(localStorage.getItem('BillingData')) : [];
    BillingData.splice(0, BillingData.length);
    document.getElementById('BillingPriceValue').innerHTML = 0.00;
    localStorage.setItem('BillingData', JSON.stringify(BillingData));
    BillingReadData();

}

// End Delete all Transaction


// Onchange Function for Calculating Total Price

var AddingBillingPrice = 0.00;




// ------------------------------Adding Snacks section -------------------------------------------------

// var snackIdValue;
// function snacksAddingFunction(snackValue) {

//     var objectData = localStorage.getItem('objectData') ? JSON.parse(localStorage.getItem('objectData')) : [];
//     var BillingData = localStorage.getItem('BillingData') ? JSON.parse(localStorage.getItem('BillingData')) : [];

//     snackIdValue = document.getElementById(snackValue).value;
//     objectData.forEach((record) => {
//         // Handling Date

//         let currentDate = new Date().toJSON().slice(0, 10);


//         // var dateString = currentDate.toISOString();

//         // End Handling Date


//         if (record.itemName === snackIdValue) {
//             var selectedSnack = objectData.find((record) => record.itemName === snackIdValue);
//             if (selectedSnack) {
//                 var existing = BillingData.find((item) => item.itemName === snackIdValue);
//                 if (existing) {
//                     existing.itemQuantity += 1; // Increase the quantity of the existing item
//                     existing.TotalPrice += parseInt(record.itemPrice); // Update the total price
//                 } else {
//                     BillingData.push({
//                         "itemName": record.itemName,
//                         "itemPrice": record.itemPrice,
//                         "itemQuantity": itemQuantity,
//                         "TotalPrice": parseInt(record.itemPrice),
//                         "TotalBillingPrice": AddingBillingPrice, //Doubt
//                         "BillingDate": currentDate
//                     });
//                 }
//             }
//             // }
//             renderTotalAmount(parseInt(record.itemPrice));
//             localStorage.setItem('BillingData', JSON.stringify(BillingData));
//             BillingReadData();
//         }
//     });



// }


// ---------------------------------End Adding Snacks section-------------------------------------------


// ----------------------------------Calculator Add Item Bottom Part-----------------------------------------------
function CalculAddButton() {
    var CalculItemNo = document.getElementById('AddPartItemNumber').value;
    var CalculItemQuantity = document.getElementById('AddPartQuantity').value;
    var BillingData = localStorage.getItem('BillingData') ? JSON.parse(localStorage.getItem('BillingData')) : [];
    var objectData = localStorage.getItem('objectData') ? JSON.parse(localStorage.getItem('objectData')) : [];

    objectData.map((record) => {
        let currentDate = new Date().toJSON().slice(0, 10);
        
        if (record.itemNo === CalculItemNo) {

            //Select the item based on the itemname
            var selectedSnack = objectData.find((item) => item.itemNo === CalculItemNo); //Inventory Selected snack.

            //Calculate Sold and stock data using data in salesReport localstorage.
            var salesReport = localStorage.getItem('salesReport') ? JSON.parse(localStorage.getItem('salesReport')) : [];
            var sold = 0;

            var stockDataValue;
            salesReport.forEach((salesRecord) => {
                if (salesRecord.itemName === selectedSnack.itemName) {
                    sold += parseInt(salesRecord.quantity);
                    stockDataValue = parseInt(selectedSnack.purchased) - parseInt(sold);
                }

            });

            //If an stock Quantity is lessthan than the user needs means , there will be an alert.
            var addedQuant = BillingData.find((items) => {
                if(items.itemQuantity > (stockDataValue-1)){
                    return true;
                }
            });
            
            if (CalculItemQuantity > stockDataValue || addedQuant) {
                alert("You can't add more than the stock");
            }
            else {
                if (selectedSnack) {
                    //If already exist in the BillingData storage means , Simply increase the quantity of that item.
                    var existing = BillingData.find((item) => item.itemName === selectedSnack.itemName);
                    
                    if (existing) {
                        existing.itemQuantity += parseInt(CalculItemQuantity); // Increase the quantity of the existing item
                        existing.TotalPrice += parseInt(selectedSnack.itemPrice) * parseInt(CalculItemQuantity); // Update the total price
                    }

                    else {
                        
                        BillingData.push({
                            itemName: selectedSnack.itemName,
                            itemPrice: selectedSnack.itemPrice,
                            itemQuantity: parseInt(CalculItemQuantity),
                            TotalPrice: parseInt(selectedSnack.itemPrice) * parseInt(CalculItemQuantity),
                            TotalBillingPrice: AddingBillingPrice,
                            "BillingDate": currentDate
                        });
                    }
                    renderTotalAmount(parseInt(record.itemPrice) * parseInt(CalculItemQuantity));

                    localStorage.setItem('BillingData', JSON.stringify(BillingData));

                    BillingReadData();
                    // BillingPriceFunction();


                }
            }
        }


        ClearCalculatorForm();
    });
    


}

// -----------------------------------------------End Add Item Bottom Part--------------------------------------

// ---------------------------User's Change Money--------------------------------------------------------------

var TenderAmount1 = 0;

function TenderValueButton(e) {
    TenderAmount1 += e;
    document.getElementById('TenderValue').innerHTML = TenderAmount1;
    var ChangePriceValue = document.getElementById('ChangePriceValue');
    var ChangeMainPriceValue = document.getElementById('ChangeMainPriceValue');
    ChangePriceValue.innerHTML = (parseFloat(TenderAmount1) - parseFloat(TotalBillAmountValue.innerHTML)).toFixed(2);
    ChangeMainPriceValue.innerHTML = (parseFloat(TenderAmount1) - parseFloat(TotalBillAmountValue.innerHTML)).toFixed(2);
}

//-----------------------------------------------------------------------------------------------

// -------------------------------------Showing Bill---------------------------------------------

var TotalBillAmountValue = document.getElementById('TotalBillAmountValue');

function ShowBill() {

    // $('#BillInvoicePart').slideDown();
    $('#BillInvoicePart').fadeIn(1000);
    // BillingPriceFunction();
    var AmountValue = document.getElementById('AmountValue');
    var BillPay = document.getElementById('BillingPriceValue');

    var GSTAmountValue = document.getElementById('GSTAmountValue');
    var ChangePriceValue = document.getElementById('ChangePriceValue');
    // var BillPayable = document.getElementById('BillPayable');
    // var BillInvoicePart = document.querySelector('.BillInvoicePart');
    // var InvoicePart = document.querySelector('.InvoicePart');


    document.getElementById('BillInvoicePart').style.display = "block";
    document.getElementById('InvoicePart').style.display = "none";

    AmountValue.innerHTML = BillPay.innerHTML; // Amount Value
    GSTAmountValue.innerHTML = parseFloat((parseFloat(AmountValue.innerHTML) * 8) / 100); // GST Amount Value
    TotalBillAmountValue.innerHTML = (parseFloat(AmountValue.innerHTML) + parseFloat(GSTAmountValue.innerHTML)).toFixed(2); // Payable Amount


    ChangePriceValue.innerHTML = parseFloat(TenderAmount1) - parseFloat(TotalBillAmountValue);



}

// when refreshing the page the BillingData localStorage will delete
function DeleteBillingData() {
    localStorage.removeItem('BillingData');
    BillingReadData();
}

window.addEventListener('load', DeleteBillingData);




// ------------------------------------------End Billing Section---------------------------------------------------



// Terminate Transaction

function TerminateTransaction() {
    document.getElementById('BillInvoicePart').style.display = "none";
    document.getElementById('InvoicePart').style.display = "block";
}

// End Terminate Transaction


// -----------------------------------------Create a salesReport Page -------------------------------


function salesReportReadData() {
    var salesReport = localStorage.getItem('salesReport') ? JSON.parse(localStorage.getItem('salesReport')) : [];
    var salesTableElementData = "";
    var i = 0;
    salesReport.forEach((record) => {
        salesTableElementData += "<tr class = 'salesTableRow'>";
        salesTableElementData += "<td>" + (++i) + "</td>";
        salesTableElementData += "<td>" + record.itemName + "</td>";
        salesTableElementData += "<td>" + record.quantity + "</td>"; //Must Change //Continue with this part also
        salesTableElementData += "<td>" + record.totalPrice + "</td>";
        salesTableElementData += "</tr>";
    });
    document.getElementById('SalesReportBodyData').innerHTML = salesTableElementData;


}

window.addEventListener('load', salesReportReadData);

//Move the SalesReport values from the BillingData to SalesReport LocalStorage.
//When clicking Print Button the sold data will be stored in SalesReport localStorage.

function printBillData() {

    var BillInvoicePart = document.getElementById('BillInvoicePart').innerHTML;

    //Print the Particular Part of an window ie) Bill Invoice

    var BillingPrintData = window.open('', '', 'height:500', 'width:500');
    BillingPrintData.document.write('<html>');
    BillingPrintData.document.write('<body><h1>Billing Invoice is </h1><br>');
    BillingPrintData.document.write(BillInvoicePart);
    BillingPrintData.document.write('</body>');
    BillingPrintData.document.write('</html>');
    BillingPrintData.document.close();
    BillingPrintData.print();

    var BillingData = localStorage.getItem('BillingData') ? JSON.parse(localStorage.getItem('BillingData')) : [];
    var salesReport = localStorage.getItem('salesReport') ? JSON.parse(localStorage.getItem('salesReport')) : [];

    BillingData.forEach((record) => {
        salesReport.push({
            "date": record.BillingDate,
            "totalPrice": record.TotalPrice,
            "itemName": record.itemName,
            "quantity": record.itemQuantity,
            "itemPrice": record.itemPrice
        });
    });

    localStorage.setItem('salesReport', JSON.stringify(salesReport));
    // salesReportReadData(); 
    localStorage.setItem('BillingData', JSON.stringify(BillingData));
}

// ------------------------------Onchange Event for Date Filter in Sales Report ----------------------------------------------------

function filterDate() {
    var selectedValue = document.getElementById('dateFilter').value;
    var CustomDateDiv = document.getElementById('CustomDateDiv');
    var text_1 = document.getElementById('text-2');


    //Custom Date Selection
    if (selectedValue === "Custom") {
        CustomDateDiv.style.display = "block";
        text_1.innerHTML = selectedValue;

        var startDate = document.getElementById('fromDate').value;
        var endDate = document.getElementById('toDate').value;
        var salesReport = localStorage.getItem('salesReport') ? JSON.parse(localStorage.getItem('salesReport')) : [];
        var filteredSalesReport = salesReport.filter(function (record) {
            var recordDate = new Date(record.date);
            return recordDate >= new Date(startDate) && recordDate <= new Date(endDate);
        });



        // Update the table with the filtered data
        var salesTableElementData = "";
        var i = 0;
        filteredSalesReport.forEach(function (record) {

            salesTableElementData += "<tr'>";
            salesTableElementData += "<td>" + (++i) + "</td>";
            salesTableElementData += "<td>" + record.itemName + "</td>";
            salesTableElementData += "<td>" + record.quantity + "</td>";
            salesTableElementData += "<td>" + record.totalPrice + "</td>";
            salesTableElementData += "</tr>";
        });

        document.getElementById('SalesReportBodyData').innerHTML = salesTableElementData;



    }

    // Today Date Selection.
    else if (selectedValue === "Today") {
        CustomDateDiv.style.display = "none";
        text_1.innerHTML = selectedValue;

        const currentDate = new Date().toJSON().slice(0, 10);
        var salesReport = localStorage.getItem('salesReport') ? JSON.parse(localStorage.getItem('salesReport')) : [];

        var TodayFilterDate = salesReport.filter((item) => item.date === currentDate);

        var salesTodayElementData = "";
        var i = 0;
        TodayFilterDate.forEach(function (record) {
            salesTodayElementData += "<tr>";
            salesTodayElementData += "<td>" + (++i) + "</td>";
            salesTodayElementData += "<td>" + record.itemName + "</td>";
            salesTodayElementData += "<td>" + record.quantity + "</td>";
            salesTodayElementData += "<td>" + record.totalPrice + "</td>";
            salesTodayElementData += "</tr>";
        });

        document.getElementById('SalesReportBodyData').innerHTML = salesTodayElementData;
    }

    //This Week Filter Selection.

    else if (selectedValue === "ThisWeek") {
        CustomDateDiv.style.display = "none";
        text_1.innerHTML = selectedValue;
        const currentDate = new Date();
        const startDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() - currentDate.getDay());
        const endDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() + (6 - currentDate.getDay()));
        // console.log(startDate,endDate);
        var salesReport = localStorage.getItem('salesReport') ? JSON.parse(localStorage.getItem('salesReport')) : [];
        var thisWeekFilteredData = salesReport.filter((item) => {
            const itemDate = new Date(item.date);
            // console.log(itemDate);

            return itemDate >= startDate && itemDate <= endDate;
        });
        console.log(thisWeekFilteredData);

        var salesTodayElementData = "";
        var i = 0;
        thisWeekFilteredData.forEach(function (record) {
            salesTodayElementData += "<tr>";
            salesTodayElementData += "<td>" + (++i) + "</td>";
            salesTodayElementData += "<td>" + record.itemName + "</td>";
            salesTodayElementData += "<td>" + record.quantity + "</td>";
            salesTodayElementData += "<td>" + record.totalPrice + "</td>";
            salesTodayElementData += "</tr>";
        });

        document.getElementById('SalesReportBodyData').innerHTML = salesTodayElementData;
    }



    // Last Week Filter Selection

    else if (selectedValue === "LastWeek") {
        CustomDateDiv.style.display = "none";
        text_1.innerHTML = selectedValue;
        const currentDate = new Date();
        const lastWeekStart = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDay() - 7);
        const LastWeekEnd = new Date(lastWeekStart.getFullYear(), lastWeekStart.getMonth(), lastWeekStart.getDay() + 3);
        var salesReport = localStorage.getItem('salesReport') ? JSON.parse(localStorage.getItem('salesReport')) : [];

        var lastWeekFilterData = salesReport.filter((item) => {
            const itemDate = new Date(item.date);
            return itemDate >= lastWeekStart && itemDate <= LastWeekEnd;
        });
        console.log(lastWeekFilterData);


        var salesTodayElementData = "";
        var i = 0;
        lastWeekFilterData.forEach(function (record) {
            salesTodayElementData += "<tr>";
            salesTodayElementData += "<td>" + (++i) + "</td>";
            salesTodayElementData += "<td>" + record.itemName + "</td>";
            salesTodayElementData += "<td>" + record.quantity + "</td>";
            salesTodayElementData += "<td>" + record.totalPrice + "</td>";
            salesTodayElementData += "</tr>";
        });

        document.getElementById('SalesReportBodyData').innerHTML = salesTodayElementData;

    }

    //This Month Filter Selection
    else if (selectedValue === "ThisMonth") {
        CustomDateDiv.style.display = "none";
        text_1.innerHTML = selectedValue;
        const currentDate = new Date();

        const thisMonthStart = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
        const thisMonthEnd = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);

        var salesReport = localStorage.getItem('salesReport') ? JSON.parse(localStorage.getItem('salesReport')) : [];

        var thisMonthFilterData = salesReport.filter((item) => {
            const itemDate = new Date(item.date);

            return itemDate >= thisMonthStart && itemDate <= thisMonthEnd;
        });
        // console.log(thisMonthFilterData);

        var salesTodayElementData = "";
        var i = 0;
        thisMonthFilterData.forEach(function (record) {
            salesTodayElementData += "<tr>";
            salesTodayElementData += "<td>" + (++i) + "</td>";
            salesTodayElementData += "<td>" + record.itemName + "</td>";
            salesTodayElementData += "<td>" + record.quantity + "</td>";
            salesTodayElementData += "<td>" + record.totalPrice + "</td>";
            salesTodayElementData += "</tr>";
        });

        document.getElementById('SalesReportBodyData').innerHTML = salesTodayElementData;

    }

    //Last Month Filter Selection
    else if (selectedValue === "LastMonth") {
        CustomDateDiv.style.display = "none";
        text_1.innerHTML = selectedValue;
        const currentDate = new Date();

        const prevMonthStart = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1);
        const prevMonthEnd = new Date(currentDate.getFullYear(), currentDate.getMonth(), 0);

        var salesReport = localStorage.getItem('salesReport') ? JSON.parse(localStorage.getItem('salesReport')) : [];

        var prevMonthFilterData = salesReport.filter((item) => {
            const itemDate = new Date(item.date);
            return itemDate >= prevMonthStart && itemDate <= prevMonthEnd;
        });
        // console.log(prevMonthFilterData);
        var salesTodayElementData = "";
        var i = 0;
        prevMonthFilterData.forEach(function (record) {
            salesTodayElementData += "<tr>";
            salesTodayElementData += "<td>" + (++i) + "</td>";
            salesTodayElementData += "<td>" + record.itemName + "</td>";
            salesTodayElementData += "<td>" + record.quantity + "</td>";
            salesTodayElementData += "<td>" + record.totalPrice + "</td>";
            salesTodayElementData += "</tr>";
        });

        document.getElementById('SalesReportBodyData').innerHTML = salesTodayElementData;

    }
    // YesterDay Filter Selection
    else if (selectedValue === "Yesterday") {
        CustomDateDiv.style.display = "none";
        text_1.innerHTML = selectedValue;
        const currentDate = new Date();

        const yesterday = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate());
        var salesReport = localStorage.getItem('salesReport') ? JSON.parse(localStorage.getItem('salesReport')) : [];

        var yesterdayFilterDate = salesReport.filter((item) => item.date === yesterday.toISOString().slice(0, 10));
        // console.log(yesterdayFilterDate);

        var salesTodayElementData = "";
        var i = 0;
        yesterdayFilterDate.forEach(function (record) {
            salesTodayElementData += "<tr>";
            salesTodayElementData += "<td>" + (++i) + "</td>";
            salesTodayElementData += "<td>" + record.itemName + "</td>";
            salesTodayElementData += "<td>" + record.quantity + "</td>";
            salesTodayElementData += "<td>" + record.totalPrice + "</td>";
            salesTodayElementData += "</tr>";
        });

        document.getElementById('SalesReportBodyData').innerHTML = salesTodayElementData;
    }
    else {
        CustomDateDiv.style.display = "none";
        text_1.innerHTML = filterValue;
    }

}
// ------------------------------End Onchange Event for Date Filter in Sales Report ----------------------------------------------------



// ----------------------------------Inventory Filter------------------------------------------------

function inventoryFilter() {
    var CustomDateDiv = document.getElementById('CustomDateDiv');
    var filterValue = document.getElementById('inventoryFilter').value;
    var text_1 = document.getElementById('text-l');


    //Custom Filter
    if (filterValue === "Custom") {
        CustomDateDiv.style.display = "block";
        text_1.innerHTML = filterValue;



        var startDate = document.getElementById('fromDate').value;
        var toDate = document.getElementById('toDate').value;

        var objectData = localStorage.getItem('objectData') ? JSON.parse(localStorage.getItem('objectData')) : [];
        var salesReport = localStorage.getItem('salesReport') ? JSON.parse(localStorage.getItem('salesReport')) : [];

        var customFilterData = objectData.filter((item) => {
            const itemDate = new Date(item.purchasedDate);
            return itemDate >= new Date(startDate) && itemDate <= new Date(toDate);

        });

        console.log(customFilterData);
        var CustomElementsData = "";
        customFilterData.forEach((record, index) => {
            CustomElementsData += "<tr>";
            CustomElementsData += "<td>" + record.itemNo + "</td>";
            CustomElementsData += "<td>" + record.itemName + "</td>";
            CustomElementsData += "<td>" + record.category + "</td>";
            CustomElementsData += "<td>" + record.itemPrice + "</td>";
            CustomElementsData += "<td>" + record.purchased + "</td>";

            var sold = 0;
            var stockDataValue;

            // Finding Sold Data , Stock Data
            salesReport.forEach((salesRecord) => {
                if (salesRecord.itemName === record.itemName) {
                    sold += parseInt(salesRecord.quantity);
                    stockDataValue = parseInt(record.purchased) - parseInt(sold);
                }

            });
            CustomElementsData += "<td><p id='soldData'>" + sold + "</p></td>";
            stockDataValue = record.purchased - sold;
            CustomElementsData += "<td><p id='stocksData'>" + stockDataValue + "</p></td>";

            // End Finding Sold Data , Stock Data
            //Status Data
            if (stockDataValue > 0) {
                CustomElementsData += "<td><p style='color:green'>Available</p>";
            }
            else {
                CustomElementsData += "<td><p style='color:red'>Unavailable</p></td>"
            }
            //End Status Data

            //   Parsing Image from base64 format to URL
            if (record.itemImage) {
                CustomElementsData += "<td><img src='" + record.itemImage + "' alt='Item Image' height='50px' width='50px' class='item-image'></td>";
            } else {
                CustomElementsData += "<td></td>";
            }

            //   Parsing Image from base64 format to URL

            CustomElementsData += '<td class="d-flex gap-4"><button class="btn btn-success cursor-pointer" data-bs-toggle="modal" data-bs-target="#myModal" onClick="editModalFormData(' + index + ')"><i class="fa fa-pencil" aria-hidden="true"></i>';
            CustomElementsData += '<button class="btn btn-danger cursor-pointer" onClick="deleteFormData(' + index + ')"><i class="fa fa-minus-circle delete_black" aria-hidden="true"></i>';
            CustomElementsData += "</td></tr>";
        });

        document.getElementById('tableInventoryData').innerHTML = CustomElementsData;

    }

    //Today Filter
    else if (filterValue === "Today") {
        CustomDateDiv.style.display = "none";
        text_1.innerHTML = filterValue;
        var todayDate = new Date().toJSON().slice(0, 10);
        var objectData = localStorage.getItem('objectData') ? JSON.parse(localStorage.getItem('objectData')) : [];
        var salesReport = localStorage.getItem('salesReport') ? JSON.parse(localStorage.getItem('salesReport')) : [];

        var todayInventoryData = objectData.filter((item) => item.purchasedDate === todayDate);
        console.log(todayInventoryData);

        var tablesElementData = "";
        todayInventoryData.forEach((record, index) => {
            tablesElementData += "<tr class='categoryCheck'>";
            tablesElementData += "<td>" + record.itemNo + "</td>";
            tablesElementData += "<td>" + record.itemName + "</td>";
            tablesElementData += "<td>" + record.category + "</td>";
            tablesElementData += "<td> $" + record.itemPrice + "</td>";
            tablesElementData += "<td>" + record.purchased + "</td>";
            var sold = 0;
            var stockDataValue;

            // Finding Sold Data, Stock Data
            salesReport.forEach((salesRecord) => {
                if (salesRecord.itemName === record.itemName) {
                    sold += parseInt(salesRecord.quantity);
                    stockDataValue = parseInt(record.purchased) - parseInt(sold);
                }
            });

            tablesElementData += "<td><p id='soldData'>" + sold + "</p></td>";
            stockDataValue = record.purchased - sold;
            tablesElementData += "<td><p id='stocksData'>" + stockDataValue + "</p></td>";

            if (stockDataValue > 0) {
                tablesElementData += "<td><p style='color:green'>Available</p></td>";
            } else {
                tablesElementData += "<td><p style='color:red'>Unavailable</p></td>";
            }

            // Parsing Image from base64 format to URL
            if (record.itemImage) {
                tablesElementData += "<td><img src='" + record.itemImage + "' alt='Item Image' height='50px' width='50px' class='item-image'></td>";
            } else {
                tablesElementData += "<td></td>";
            }

            tablesElementData += '<td class="d-flex gap-4"><button class="btn btn-success cursor-pointer" data-bs-toggle="modal" data-bs-target="#myModal" onClick="editModalFormData(' + index + ')"><i class="fa fa-pencil" aria-hidden="true"></i>';
            tablesElementData += '<button class="btn btn-danger cursor-pointer" onClick="deleteFormData(' + index + ')"><i class="fa fa-minus-circle delete_black" aria-hidden="true"></i>';
            tablesElementData += "</td></tr>";
        });


        document.getElementById('tableInventoryData').innerHTML = tablesElementData;
    }

    //YesterDay Filter

    else if (filterValue === "Yesterday") {

        CustomDateDiv.style.display = "none";
        text_1.innerHTML = filterValue;
        
        const currentDate = new Date();

        const yesterday = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate());

        var objectData = localStorage.getItem('objectData') ? JSON.parse(localStorage.getItem('objectData')) : [];
        var salesReport = localStorage.getItem('salesReport') ? JSON.parse(localStorage.getItem('salesReport')) : [];

        var yesterdayInventoryData = objectData.filter((item) => item.purchasedDate === yesterday.toISOString().slice(0, 10));

        console.log(yesterdayInventoryData);
        var tablesElementData = "";
        yesterdayInventoryData.forEach((record, index) => {
            tablesElementData += "<tr class='categoryCheck'>";
            tablesElementData += "<td>" + record.itemNo + "</td>";
            tablesElementData += "<td>" + record.itemName + "</td>";
            tablesElementData += "<td>" + record.category + "</td>";
            tablesElementData += "<td> $" + record.itemPrice + "</td>";
            tablesElementData += "<td>" + record.purchased + "</td>";
            var sold = 0;
            var stockDataValue;

            // Finding Sold Data, Stock Data
            salesReport.forEach((salesRecord) => {
                if (salesRecord.itemName === record.itemName) {
                    sold += parseInt(salesRecord.quantity);
                    stockDataValue = parseInt(record.purchased) - parseInt(sold);
                }
            });

            tablesElementData += "<td><p id='soldData'>" + sold + "</p></td>";
            stockDataValue = record.purchased - sold;
            tablesElementData += "<td><p id='stocksData'>" + stockDataValue + "</p></td>";

            if (stockDataValue > 0) {
                tablesElementData += "<td><p style='color:green'>Available</p></td>";
            } else {
                tablesElementData += "<td><p style='color:red'>Unavailable</p></td>";
            }

            // Parsing Image from base64 format to URL
            if (record.itemImage) {
                tablesElementData += "<td><img src='" + record.itemImage + "' alt='Item Image' height='50px' width='50px' class='item-image'></td>";
            } else {
                tablesElementData += "<td></td>";
            }

            tablesElementData += '<td class="d-flex gap-4"><button class="btn btn-success cursor-pointer" data-bs-toggle="modal" data-bs-target="#myModal" onClick="editModalFormData(' + index + ')"><i class="fa fa-pencil" aria-hidden="true"></i>';
            tablesElementData += '<button class="btn btn-danger cursor-pointer" onClick="deleteFormData(' + index + ')"><i class="fa fa-minus-circle delete_black" aria-hidden="true"></i>';
            tablesElementData += "</td></tr>";
        });


        document.getElementById('tableInventoryData').innerHTML = tablesElementData;
    }

    //This Week Filter
    else if (filterValue === "ThisWeek") {
        CustomDateDiv.style.display = "none";
        text_1.innerHTML = filterValue;

        const currentDate = new Date();
        const startDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() - currentDate.getDay());
        const endDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() + (6 - currentDate.getDay()));

        console.log(weekNumber(currentDate));             // 24

        var objectData = localStorage.getItem('objectData') ? JSON.parse(localStorage.getItem('objectData')) : [];
        var salesReport = localStorage.getItem('salesReport') ? JSON.parse(localStorage.getItem('salesReport')) : [];



        var thisWeekInventoryData = objectData.filter((item) => {
            const itemDate = new Date(item.purchasedDate);
            // console.log(itemDate);

            return itemDate >= startDate && itemDate <= endDate;
        });
        console.log(thisWeekInventoryData);


        var tablesElementData = "";
        thisWeekInventoryData.forEach((record, index) => {
            tablesElementData += "<tr class='categoryCheck'>";
            tablesElementData += "<td>" + record.itemNo + "</td>";
            tablesElementData += "<td>" + record.itemName + "</td>";
            tablesElementData += "<td>" + record.category + "</td>";
            tablesElementData += "<td> $" + record.itemPrice + "</td>";
            tablesElementData += "<td>" + record.purchased + "</td>";
            var sold = 0;
            var stockDataValue;

            // Finding Sold Data, Stock Data
            salesReport.forEach((salesRecord) => {
                if (salesRecord.itemName === record.itemName) {
                    sold += parseInt(salesRecord.quantity);
                    stockDataValue = parseInt(record.purchased) - parseInt(sold);
                }
            });

            tablesElementData += "<td><p id='soldData'>" + sold + "</p></td>";
            stockDataValue = parseInt(record.purchased) - sold; // Added parseInt()
            tablesElementData += "<td><p id='stocksData'>" + stockDataValue + "</p></td>";

            if (stockDataValue > 0) {
                tablesElementData += "<td><p style='color:green'>Available</p></td>";
            } else {
                tablesElementData += "<td><p style='color:red'>Unavailable</p></td>";
            }

            // Parsing Image from base64 format to URL
            if (record.itemImage) {
                tablesElementData += "<td><img src='" + record.itemImage + "' alt='Item Image' height='50px' width='50px' class='item-image'></td>";
            } else {
                tablesElementData += "<td></td>";
            }

            tablesElementData += '<td class="d-flex gap-4"><button class="btn btn-success cursor-pointer" data-bs-toggle="modal" data-bs-target="#myModal" onClick="editModalFormData(' + index + ')"><i class="fa fa-pencil" aria-hidden="true"></i>';
            tablesElementData += '<button class="btn btn-danger cursor-pointer" onClick="deleteFormData(' + index + ')"><i class="fa fa-minus-circle delete_black" aria-hidden="true"></i>';
            tablesElementData += "</td></tr>";
        });

        document.getElementById('tableInventoryData').innerHTML = tablesElementData;
    }


    //Last Week
    else if (filterValue === "LastWeek") {
        CustomDateDiv.style.display = "none";
        text_1.innerHTML = filterValue;


        const currentDate = new Date();
        const lastWeekStart = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDay() - 7);
        const LastWeekEnd = new Date(lastWeekStart.getFullYear(), lastWeekStart.getMonth(), lastWeekStart.getDay() + 3);
        
        var objectData = localStorage.getItem('objectData') ? JSON.parse(localStorage.getItem('objectData')) : [];
        var salesReport = localStorage.getItem('salesReport') ? JSON.parse(localStorage.getItem('salesReport')) : [];

        var lastWeekInventoryData = objectData.filter((item) => {
            const itemDate = new Date(item.purchasedDate);
            // console.log(itemDate);

            return itemDate >= lastWeekStart && itemDate <= LastWeekEnd;
        });
        console.log(lastWeekInventoryData);


        var tablesElementData = "";
        lastWeekInventoryData.forEach((record, index) => {
            tablesElementData += "<tr class='categoryCheck'>";
            tablesElementData += "<td>" + record.itemNo + "</td>";
            tablesElementData += "<td>" + record.itemName + "</td>";
            tablesElementData += "<td>" + record.category + "</td>";
            tablesElementData += "<td> $" + record.itemPrice + "</td>";
            tablesElementData += "<td>" + record.purchased + "</td>";
            var sold = 0;
            var stockDataValue;

            // Finding Sold Data, Stock Data
            salesReport.forEach((salesRecord) => {
                if (salesRecord.itemName === record.itemName) {
                    sold += parseInt(salesRecord.quantity);
                    stockDataValue = parseInt(record.purchased) - parseInt(sold);
                }
            });

            tablesElementData += "<td><p id='soldData'>" + sold + "</p></td>";
            stockDataValue = parseInt(record.purchased) - sold; // Added parseInt()
            tablesElementData += "<td><p id='stocksData'>" + stockDataValue + "</p></td>";

            if (stockDataValue > 0) {
                tablesElementData += "<td><p style='color:green'>Available</p></td>";
            } else {
                tablesElementData += "<td><p style='color:red'>Unavailable</p></td>";
            }

            // Parsing Image from base64 format to URL
            if (record.itemImage) {
                tablesElementData += "<td><img src='" + record.itemImage + "' alt='Item Image' height='50px' width='50px' class='item-image'></td>";
            } else {
                tablesElementData += "<td></td>";
            }

            tablesElementData += '<td class="d-flex gap-4"><button class="btn btn-success cursor-pointer" data-bs-toggle="modal" data-bs-target="#myModal" onClick="editModalFormData(' + index + ')"><i class="fa fa-pencil" aria-hidden="true"></i>';
            tablesElementData += '<button class="btn btn-danger cursor-pointer" onClick="deleteFormData(' + index + ')"><i class="fa fa-minus-circle delete_black" aria-hidden="true"></i>';
            tablesElementData += "</td></tr>";
        });

        document.getElementById('tableInventoryData').innerHTML = tablesElementData;


    }

    //This Month Filter
    else if (filterValue === "ThisMonth") {
        CustomDateDiv.style.display = "none";
        text_1.innerHTML = filterValue;
        const currentDate = new Date();
        const thisMonthStart = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
        const thisMonthEnd = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0); // console.log(startDate, endDate);
        // alert(startDate,endDate);

        var objectData = localStorage.getItem('objectData') ? JSON.parse(localStorage.getItem('objectData')) : [];
        var salesReport = localStorage.getItem('salesReport') ? JSON.parse(localStorage.getItem('salesReport')) : [];

        var thisMonthFilterData = objectData.filter((item) => {
            const itemDate = new Date(item.purchasedDate);
            // console.log(itemDate);

            return itemDate >= thisMonthStart && itemDate <= thisMonthEnd;
        });
        console.log(thisMonthFilterData);

        var tablesElementData = "";
        thisMonthFilterData.forEach((record, index) => {
            tablesElementData += "<tr class='categoryCheck'>";
            tablesElementData += "<td>" + record.itemNo + "</td>";
            tablesElementData += "<td>" + record.itemName + "</td>";
            tablesElementData += "<td>" + record.category + "</td>";
            tablesElementData += "<td> $" + record.itemPrice + "</td>";
            tablesElementData += "<td>" + record.purchased + "</td>";
            var sold = 0;
            var stockDataValue;

            // Finding Sold Data, Stock Data
            salesReport.forEach((salesRecord) => {
                if (salesRecord.itemName === record.itemName) {
                    sold += parseInt(salesRecord.quantity);
                    stockDataValue = parseInt(record.purchased) - parseInt(sold);
                }
            });

            tablesElementData += "<td><p id='soldData'>" + sold + "</p></td>";
            stockDataValue = parseInt(record.purchased) - sold; // Added parseInt()
            tablesElementData += "<td><p id='stocksData'>" + stockDataValue + "</p></td>";

            if (stockDataValue > 0) {
                tablesElementData += "<td><p style='color:green'>Available</p></td>";
            } else {
                tablesElementData += "<td><p style='color:red'>Unavailable</p></td>";
            }

            // Parsing Image from base64 format to URL
            if (record.itemImage) {
                tablesElementData += "<td><img src='" + record.itemImage + "' alt='Item Image' height='50px' width='50px' class='item-image'></td>";
            } else {
                tablesElementData += "<td></td>";
            }

            tablesElementData += '<td class="d-flex gap-4"><button class="btn btn-success cursor-pointer" data-bs-toggle="modal" data-bs-target="#myModal" onClick="editModalFormData(' + index + ')"><i class="fa fa-pencil" aria-hidden="true"></i>';
            tablesElementData += '<button class="btn btn-danger cursor-pointer" onClick="deleteFormData(' + index + ')"><i class="fa fa-minus-circle delete_black" aria-hidden="true"></i>';
            tablesElementData += "</td></tr>";
        });

        document.getElementById('tableInventoryData').innerHTML = tablesElementData;

    }


    //Last Month Filter
    else if (filterValue === "LastMonth") {
        CustomDateDiv.style.display = "none";
        text_1.innerHTML = filterValue;
        const currentDate = new Date();

        const prevMonthStart = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1);
        const prevMonthEnd = new Date(currentDate.getFullYear(), currentDate.getMonth(), 0);

        var objectData = localStorage.getItem('objectData') ? JSON.parse(localStorage.getItem('objectData')) : [];
        var salesReport = localStorage.getItem('salesReport') ? JSON.parse(localStorage.getItem('salesReport')) : [];

        var lastMonthInventoryData = objectData.filter((item) => {
            const itemDate = new Date(item.purchasedDate);

            return itemDate >= prevMonthStart && itemDate <= prevMonthEnd;
        });
        console.log(lastMonthInventoryData);


        var tablesElementData = "";
        lastMonthInventoryData.forEach((record, index) => {
            tablesElementData += "<tr class='categoryCheck'>";
            tablesElementData += "<td>" + record.itemNo + "</td>";
            tablesElementData += "<td>" + record.itemName + "</td>";
            tablesElementData += "<td>" + record.category + "</td>";
            tablesElementData += "<td> $" + record.itemPrice + "</td>";
            tablesElementData += "<td>" + record.purchased + "</td>";
            var sold = 0;
            var stockDataValue;

            // Finding Sold Data, Stock Data
            salesReport.forEach((salesRecord) => {
                if (salesRecord.itemName === record.itemName) {
                    sold += parseInt(salesRecord.quantity);
                    stockDataValue = parseInt(record.purchased) - parseInt(sold);
                }
            });

            tablesElementData += "<td><p id='soldData'>" + sold + "</p></td>";
            stockDataValue = parseInt(record.purchased) - sold; // Added parseInt()
            tablesElementData += "<td><p id='stocksData'>" + stockDataValue + "</p></td>";

            if (stockDataValue > 0) {
                tablesElementData += "<td><p style='color:green'>Available</p></td>";
            } else {
                tablesElementData += "<td><p style='color:red'>Unavailable</p></td>";
            }

            // Parsing Image from base64 format to URL
            if (record.itemImage) {
                tablesElementData += "<td><img src='" + record.itemImage + "' alt='Item Image' height='50px' width='50px' class='item-image'></td>";
            } else {
                tablesElementData += "<td></td>";
            }

            tablesElementData += '<td class="d-flex gap-4"><button class="btn btn-success cursor-pointer" data-bs-toggle="modal" data-bs-target="#myModal" onClick="editModalFormData(' + index + ')"><i class="fa fa-pencil" aria-hidden="true"></i>';
            tablesElementData += '<button class="btn btn-danger cursor-pointer" onClick="deleteFormData(' + index + ')"><i class="fa fa-minus-circle delete_black" aria-hidden="true"></i></button>';
            tablesElementData += "</td></tr>";
        });

        document.getElementById('tableInventoryData').innerHTML = tablesElementData;

    }


    else {
        CustomDateDiv.style.display = "none";
        text_1.innerHTML = filterValue;
        // var objectData = localStorage.getItem('objectData') ? JSON.parse(localStorage.getItem('objectData')) : [];
        // var salesReport = localStorage.getItem('salesReport') ? JSON.parse(localStorage.getItem('salesReport')) : [];

        // var allData = objectData.map((record, index) => {
        //     var sold = 0;
        //     var stockDataValue;

        //     // Finding Sold Data, Stock Data
        //     salesReport.forEach((salesRecord) => {
        //         if (salesRecord.itemName === record.itemName) {
        //             sold += parseInt(salesRecord.quantity);
        //             stockDataValue = parseInt(record.purchased) - parseInt(sold);
        //         }
        //     });
        //     stockDataValue = record.purchased - sold;

        //     var statusElement = "";
        //     if (stockDataValue > 0) {
        //         statusElement = "<p style='color:green'>Available</p>";
        //     } else {
        //         statusElement = "<p style='color:red'>Unavailable</p>";
        //     }

        //     // Parsing Image from base64 format to URL
        //     var imageElement = "";
        //     if (record.itemImage) {
        //         imageElement = "<img src='" + record.itemImage + "' alt='Item Image' height='50px' width='50px' class='item-image'>";
        //     }

        //     var actionElements = "<td class='d-flex gap-4'><button class='btn btn-success cursor-pointer' data-bs-toggle='modal' data-bs-target='#myModal' onClick='editModalFormData(" + index + ")'><i class='fa fa-pencil' aria-hidden=true'></i><button class='btn btn-danger cursor-pointer' onClick='deleteFormData(" + index + ")'><i class='fa fa-minus-circle delete_black' aria-hidden='true'></i></td>";
        //     return "<tr><td>" + record.itemNo + "</td><td>" + record.itemName + "</td><td>" + record.category + "</td><td>" + record.itemPrice + "</td><td>" + record.purchased + "</td><td><p id='soldData'>" + sold + "</p></td><td><p id='stocksData'>" + stockDataValue + "</p></td><td>" + statusElement + "</td><td>" + imageElement + "</td>" + actionElements + "</tr>";
        // });

        // document.getElementById('tableInventoryData').innerHTML = allData.join("");
    }

}

// Date Disable function for Custom Date Range

function dateDisable() {

    var startDate = document.getElementById('fromDate').value; //string Value
    var endDate = document.getElementById('toDate');

    var intStart = new Date(startDate); //For taking date We convert it into Number

    endDate.setAttribute('min', intStart.toISOString().split('T')[0]); //Min Attribute only takes string so we again convert it into string
}

// End Date Disable function for Custom Date Range














//------------------------------------------Backup Commented Lines--------------------------------------


//Editing the Data in another Form


// function editModalFormData(index){
//     var objectData;
//     if(localStorage.getItem('objectData')== null) {
//         objectData = [];
//     }
//     else{
//         objectData = JSON.parse(localStorage.getItem('objectData'));
//     }
//    
//     var itemName = objectData[index].itemName;
//     var itemNo = objectData[index].itemNo;
//     var itemPrice = objectData[index].itemPrice;
//     var purchased = objectData[index].purchased;
//     var itemImage = objectData[index].itemImage;
//     var category = objectData[index].category;


//     document.getElementById('mitemName').value = itemName;
//     document.getElementById('mitemPrice').value = itemPrice;
//     document.getElementById('mitemNo').value = itemNo;
//     document.getElementById('mitemImage').value = itemImage;
//     document.getElementById('purchased').value = purchased;
//     document.querySelector(`input[type="${category}"]:checked`) = true;

//     localStorage.setItem('objectData',JSON.stringify(objectData));

// }

//------------------------------------------------------------------------------------------------------------
// function editFormData(index){

//     // let inx;
//     // inx = index;

//     var objectData = localStorage.getItem("objectData") === null ? [] : JSON.parse(localStorage.getItem("objectData")); 
//     if(localStorage.getItem("objectData")){

//         document.getElementById('itemNo').value = objectData[index].itemNo;
//         alert(objectData[index].itemNo)
//         document.getElementById('itemName').value = objectData[index].itemName;
//         document.getElementById('itemPrice').value = objectData[index].itemPrice;
//         document.getElementById('purchased').value = objectData[index].purchased;
//         document.getElementById('itemImage').value = objectData[index].itemImage;


//         var categoryVal = objectData[index].category;

//         console.log(categoryVal);

//         if(categoryVal == "snacks"){
//             document.getElementById('snacks').checked = true;
//         }
//         else{
//             document.getElementById('drinks').checked = true;
//         }

//         window.location.href = "./inventoryForm.html";
//     }
//     document.getElementById('update').onClick = function UpdateFormData(){

//         completeValidation();
//         var objectData = localStorage.getItem("objectData") ? JSON.parse(localStorage.getItem("objectData")) : [];

//         objectData[index].itemNo = document.getElementById('itemNo').value;
//         objectData[index].itemName = document.getElementById('itemName').value;
//         objectData[index].itemPrice = document.getElementById('itemPrice').value;
//         objectData[index].purchased = document.getElementById('purchased').value;
//         objectData[index].itemImage = document.getElementById('itemImage').value;
//         objectData[index].category = document.querySelector('input[name="category"]:checked').value;

//         localStorage.setItem("objectData",JSON.stringify(objectData))
//         itemsReadData();

//         clearForm();

//         // document.getElementById('submit').style.display = "block";
//         // document.getElementById('update').style.display = "none";
//     }
// }   

//-------------------------------------------------------------------------------------------------------------

// //Reading the Item Request Data in local Storage

// function itemsRequestReadData(){
// 
//     var itemsRequestData = localStorage.getItem('itemsRequestData') ? JSON.parse(localStorage.getItem('itemsRequestData')) : [];

//     var itemRequestElementData = "";

//     itemsRequestData.forEach(function(record){
//         itemRequestElementData += "<tr>";
//         itemRequestElementData += "<td>" + record.itemRequestNumber + "</td>";
//         itemRequestElementData += "<td>" + record.itemRequestName + "</td>";
//         itemRequestElementData += "<td>" + record.itemRequestQuantity + "</td>";
//         itemRequestElementData += "<td> $" + record.itemRequestDate + "</td>";
//         itemRequestElementData += "</tr>"

//     });

//     document.getElementById('requestElementTableData').innerHTML = itemRequestElementData;

// }
// // commonOnload(itemsRequestReadData);
// // window.onload = itemsRequestReadData();

//-----------------------------------------------------------------------------------------------------------

// //Submit the Item Request Data to local Storage

// function AddItemRequest(){

//     var itemRequestNumber = document.getElementById('itemRequestNumber').value;
//     var itemRequestName = document.getElementById('itemRequestName').value;
//     var itemRequestQuantity = document.getElementById('itemRequestQuantity').value;
//     var itemRequestDate = document.getElementById('itemRequestDate').value;

//     var itemsRequestData = localStorage.getItem('itemsRequestData') ? JSON.parse(localStorage.getItem('itemsRequestData')) : [];

//     itemsRequestData.push({
//         itemRequestNumber: itemRequestNumber,
//         itemRequestName: itemRequestName,
//         itemRequestQuantity: itemRequestQuantity,
//         itemRequestDate: itemRequestDate

//     });
//     localStorage.setItem('itemsRequestData',JSON.stringify(itemsRequestData));
//     itemsRequestReadData();
//     clearAddItemRequest();
//     // window.location.href = "/inventory.html";
// }
//--------------------------------------------------------------------------------------------------------


// //Reset the whole Data Value

// function clearItemRequest(){
//     document.getElementById('requestElementTableData').style.display = "none";
// }
// function clearAddItemRequest(){
//     document.getElementById('itemRequestNumber').value = "";
//     document.getElementById('itemRequestName').value = "";
//     document.getElementById('itemRequestQuantity').value = "";
//     document.getElementById('itemRequestDate').value = "";
// }

//-----------------------------------------------------------------------------------------------------------

// var BillingPriceValue;
// function BillingPriceFunction() {

//     var BillingData = localStorage.getItem('BillingData') ? JSON.parse(localStorage.getItem('BillingData')) : [];
//     BillingPriceValue = document.getElementById('BillingPriceValue');

//     BillingData.forEach((record) => {
//         AddingBillingPrice += record.itemsTotalPrice;
//     });
//     BillingPriceValue = AddingBillingPrice;
//     document.getElementById('BillingPriceValue').innerHTML = BillingPriceValue.toFixed(2);
// }

// End Onchange Function for Calculating TOtal Price


