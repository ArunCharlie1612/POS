//Reading the Item Request Data in local Storage

function itemsRequestReadData() {
    
    var itemsRequestData = localStorage.getItem('itemsRequestData') ? JSON.parse(localStorage.getItem('itemsRequestData')) : [];

    var itemRequestElementData = "";

    itemsRequestData.forEach(function (record) {
        itemRequestElementData += "<tr>";
        itemRequestElementData += "<td>" + record.itemRequestNumber + "</td>";
        itemRequestElementData += "<td>" + record.itemRequestName + "</td>";
        itemRequestElementData += "<td>" + record.itemRequestQuantity + "</td>";
        itemRequestElementData += "<td>" + record.itemRequestDate + "</td>";
        itemRequestElementData += "</tr>";

    });

    document.getElementById('requestElementTableData').innerHTML = itemRequestElementData;

}
window.onload = itemsRequestReadData();


//Submit the Item Request Data to local Storage

function AddItemRequest() {
    if (finalItem()) {
        var itemRequestNumber = document.getElementById('itemRequestNumber').value;
        var itemRequestName = document.getElementById('itemRequestName').value;
        var itemRequestQuantity = document.getElementById('itemRequestQuantity').value;
        var itemRequestDate = document.getElementById('itemRequestDate').value;

        var itemsRequestData = localStorage.getItem('itemsRequestData') ? JSON.parse(localStorage.getItem('itemsRequestData')) : [];

        itemsRequestData.push({
            itemRequestNumber: itemRequestNumber,
            itemRequestName: itemRequestName,
            itemRequestQuantity: itemRequestQuantity,
            itemRequestDate: itemRequestDate

        });
        localStorage.setItem('itemsRequestData', JSON.stringify(itemsRequestData));
        itemsRequestReadData();
        clearAddItemRequest();
    }
    // window.location.href = "/inventory.html";
}

//Reset the whole Data Value

function submitItemRequest() {
    var itemsRequestData = localStorage.getItem('itemsRequestData') ? JSON.parse(localStorage.getItem('itemsRequestData')) : [];
    itemsRequestData.splice(0, itemsRequestData.length);
    localStorage.setItem('itemsRequestData', JSON.stringify(itemsRequestData));
    itemsRequestReadData();
}

function clearAddItemRequest() {
    document.getElementById('itemRequestNumber').value = "";
    document.getElementById('itemRequestName').value = "";
    document.getElementById('itemRequestQuantity').value = "";
    document.getElementById('itemRequestDate').value = "";
}

var itemRequestNumber = document.getElementById('itemRequestNumber').value;
var itemRequestName = document.getElementById('itemRequestName').value;
var itemRequestQuantity = document.getElementById('itemRequestQuantity').value;
var itemRequestDate = document.getElementById('itemRequestDate').value;

var itemErr = document.getElementById('itemErr');
var nameErr = document.getElementById('nameErr');
var quantErr = document.getElementById('quantErr');


function validateReqNo() {
    var itemRequestNumber = document.getElementById("itemRequestNumber").value; // Assuming itemRequestNumber is an input field
    var itemErr = document.getElementById("itemErr");

    if (!itemRequestNumber.match(/^[0-9]+$/)) {
        itemErr.innerHTML = '<i class="fa fa-exclamation-triangle item_err_ic" aria-hidden="true"></i>';
        return false;
    }

    if (itemRequestNumber.length === 0) {
        itemErr.innerHTML = '<i class="fa fa-exclamation-triangle item_err_ic" aria-hidden="true"></i>';
        return false;
    }

    itemErr.innerHTML = "";
    return true;
}

function validateReqName() {
    var itemRequestName = document.getElementById("itemRequestName").value; // Assuming itemRequestName is an input field
    var nameErr = document.getElementById("nameErr");

    if (!itemRequestName.match(/^[a-zA-Z]+$/)) {
        nameErr.innerHTML = '<i class="fa fa-exclamation-triangle item_err_ic" aria-hidden="true"></i>';
        return false;
    }

    if (itemRequestName.length === 0) {
        nameErr.innerHTML = '<i class="fa fa-exclamation-triangle item_err_ic" aria-hidden="true"></i>';
        return false;
    }

    nameErr.innerHTML = "";
    return true;
}

function validateQuantNo() {
    var itemRequestQuantity = document.getElementById("itemRequestQuantity").value; // Assuming itemRequestQuantity is an input field
    var quantErr = document.getElementById("quantErr");

    if (!itemRequestQuantity.match(/^[0-9]+$/)) {
        quantErr.innerHTML = '<i class="fa fa-exclamation-triangle item_err_ic" aria-hidden="true"></i>';
        return false;
    }

    if (itemRequestQuantity.length === 0) {
        quantErr.innerHTML = '<i class="fa fa-exclamation-triangle item_err_ic" aria-hidden="true"></i>';
        return false;
    }

    quantErr.innerHTML = "";
    return true;
}

function finalItem() {
    var isValidQuantNo = validateQuantNo();
    var isValidReqNo = validateReqNo();
    var isValidReqName = validateReqName();
    
    var itemRequestNumber = document.getElementById('itemRequestNumber').value;
    var itemRequestName = document.getElementById('itemRequestName').value;
    var itemRequestQuantity = document.getElementById('itemRequestQuantity').value;
    if (!itemRequestName || !itemRequestNumber || !itemRequestQuantity) {
        alert("Please fill all the fields");
        return false;
    }
    if (!isValidQuantNo || !isValidReqNo || !isValidReqName) {
        alert('Clear All Errors');
        return false;
    }
    alert('Item Request Received Successfully!..');
    return true;


}


