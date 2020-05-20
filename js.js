var users = [];
$(document).ready(function(){
    $.ajax({
        url: "https://reqres.in/api/users",
        type: "GET",
        datatype: "json",
        contentType: "application/json;charset=utf-8",
        success: function(response){
            // console.log("success");
            var jsonString = JSON.stringify(response);
            users = JSON.parse(jsonString).data;
            renderTable();
        },
        error: function(jqXHR, textStatus, errorThrown){
            alert('error: ' + textStatus + ': ' + errorThrown);
        }
      })
});

function renderTable() {
    $('#tableUsers').bootstrapTable({
        data: users,
        columns: [ {},{},{},{},
            {
                title: 'Avatar',
                align: 'center',
                valign: 'middle',
                clickToSelect: false,
                formatter : function(value,row,index) {
                    return "<img src='"+ value +"' width='80px' />";
                }
            }
            ,  
            {
              title: 'Edit',
              align: 'center',
              valign: 'middle',
              clickToSelect: false,
              formatter : function(value,row,index) {
                return `<button class=\'btn btn-danger \' onclick="delUser(`+ value+`)"  >Delete</button> 
                        <button class=\'btn btn-primary \' data-toggle="modal" data-target="#myModal" onclick="updateUser(`+ value +`)"  >Update</button> `;
              }
            }
        ]
    });
}
// Add user
function addUser(){

    var formData = {

        "id": 13,
        "email": $('input[name=email]').val(),
        "first_name": $('input[name=first_name]').val(),
        "last_name": $('input[name=last_name]').val(),
        "avatar": $('input[name=avatar]').val()
    };

    $.ajax({
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        url: 'https://reqres.in/api/users', 
        type : "POST", 
        dataType : 'json', 
        data : JSON.stringify(formData), 
        success : function(result) {
            alert("Add user success");
            console.log(result);
            window.location.assign("index.html");
        },
        error: function(xhr, resp, text) {
            console.log(xhr, resp, text);
        }
    })
};
// update
function updateUser($id){
    $.ajax({
        url: "https://reqres.in/api/users/"+ $id +"",
        type: "GET",
        datatype: "jsonp",
        contentType: "application/json;charset=utf-8",
        success: function(response){
            var jsonString = JSON.stringify(response);
            var user = JSON.parse(jsonString).data;
            var html="";
            html = `<thead>
                        <tr>
                            <td data-field="first_name" > FirstName :  </td>
                            <td> <input type="text" value=" `+ user.first_name +`" size="30" required> </td>
                        </tr>
                        <tr>
                            <td data-field="last_name"> LastName :  </td>
                            <td> <input type="text" value=" `+ user.last_name +`" size="30" required> </td>
                        </tr>
                        <tr>
                            <td data-field="email" > Email :  </td>
                            <td> <input type="email" value=" `+ user.email +`" size="30" required> </td>
                        </tr>
                        <tr>
                            <td data-field="avatar"> Avatar :  </td>
                            <td> <input type="file" > </td>
                        </tr>
                        <tr>
                            <td> </td>
                            <td> <img src='`+ user.avatar +`' width='100px' /> </td>
                        </tr>
                        <tr>
                            <td> </td>
                            <td>
                            <button type="button" class="btn btn-success" id="update">Update</button>
                            </td>
                        </tr>
                        
                    </thead>`;
                        
            document.getElementById('tableModal').innerHTML = html;
        },
        error: function(jqXHR, textStatus, errorThrown){
            alert('error: ' + textStatus + ': ' + errorThrown);
        }
    });
    
}

// delete
function delUser($id){
    $.ajax({
        url: "https://reqres.in/api/users/"+$id+"",
        type: "DELETE", // <- Change here
        contentType: "application/json",
        success: function() {
            alert("Delete user success");
            renderTable();
        },
        error: function() {
            alert("fail");
        }
    });
}