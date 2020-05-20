var users = [];
function getData($id) {
  $.ajax({
    url: "https://reqres.in/api/users?page="+$id+"",
    type: "GET",
    datatype: "json",
    contentType: "application/json;charset=utf-8",
    success: function (response) {
      // console.log("success");
      var jsonString = JSON.stringify(response);
      users = JSON.parse(jsonString).data;
      $("#tableUsers").bootstrapTable({
        data: users,
        columns: [
          {},
          {},
          {},
          {},
          {
            title: "Avatar",
            align: "center",
            valign: "middle",
            clickToSelect: false,
            formatter: function (value, row, index) {
              return "<img src='" + value + "' width='80px' />";
            },
          },
          {
            title: "Edit",
            align: "center",
            valign: "middle",
            clickToSelect: false,
            formatter: function (value, row, index) {
              return (
                `<button class=\'btn btn-danger \' id="btn-delete-${value}" onclick="delUser(` +
                value +
                `)"  >Delete</button> 
                                <button class=\'btn btn-primary \' data-toggle="modal" data-target="#myModalUpdate" onclick="getDataUpdateUser(` +
                value +
                `)"  >Update</button> `
              );
            },
          },
        ],
      });
    },
    error: function (jqXHR, textStatus, errorThrown) {
      alert("error: " + textStatus + ": " + errorThrown);
    },
  });
};

function renderTable() {
  $("#tableUsers").bootstrapTable("load", users);
}
// Add user
function addUser() {
  var formData = {
    id: 13,
    email: $("input[name=email]").val(),
    first_name: $("input[name=first_name]").val(),
    last_name: $("input[name=last_name]").val(),
    avatar: $("input[name=avatar]").val(),
  };

  $.ajax({
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    url: "https://reqres.in/api/users",
    type: "POST",
    dataType: "json",
    data: JSON.stringify(formData),
    success: function (result) {
      alert("Add user success");
      users.push(result);
      renderTable();
    //   auto close Modal after 0s
      setTimeout(function(){
        $('#ModalAdd').modal('hide')
      }, 0);
    },
    error: function (xhr, resp, text) {
      console.log(xhr, resp, text);
    },
  });
}
// update
function getDataUpdateUser($id) {
  $.ajax({
    url: "https://reqres.in/api/users/" + $id + "",
    type: "GET",
    datatype: "jsonp",
    contentType: "application/json;charset=utf-8",
    success: function (response) {
      var jsonString = JSON.stringify(response);
      var user = JSON.parse(jsonString).data;
      var html =
        `<thead>
            <tr>
                <td data-field="first_name" > FirstName :  </td>
                <td> <input type="text" value=" ` + user.first_name + `" name="first_name" size="30" required> </td>
            </tr>
            <tr>
                <td data-field="last_name"> LastName :  </td>
                <td> <input type="text" value=" ` + user.last_name + `" size="30" name="last_name" required> </td>
            </tr>
            <tr>
                <td data-field="email" > Email :  </td>
                <td> <input type="email" value=" ` + user.email + `" size="30" name="email" required> </td>
            </tr>
            <tr>
                <td data-field="avatar"> Avatar :  </td>
                <td> <input type="file" name="avatar" > </td>
            </tr>
            <tr>
                <td> </td>
                <td> <img src='` + user.avatar + `' width='100px' /> </td>
            </tr>
            <tr>
                <td> </td>
                <td>
                <button type="button" class="btn btn-success" id="update" onclick="updateData(`+ user.id+`)">Update</button>
                </td>
            </tr>
            
        </thead>`;

      document.getElementById("tableModal").innerHTML = html;
    },
    error: function (jqXHR, textStatus, errorThrown) {
      alert("error: " + textStatus + ": " + errorThrown);
    },
  });
}
function updateData($id){
    var formUpdateData = {
        first_name: $("input[name=first_name]").val(),
        last_name: $("input[name=last_name]").val(),
        email: $("input[name=email]").val(),
        avatar: $("input[name=avatar]").val(),
      };
    for (var i = 0; i < users.length; i++) {
        if (users[i].id == $id) {
          users[i].first_name = formUpdateData.first_name;
          users[i].last_name = formUpdateData.last_name;
          users[i].email = formUpdateData.email;
          if(formUpdateData.avatar){
              users[i].avatar = formUpdateData.avatar;
          }
        }
    }
    //   auto close Modal after 0s
    setTimeout(function(){
        $('#myModalUpdate').modal('hide')
    }, 0);
    renderTable();
}
// delete
function delUser($id) {
  $.ajax({
    url: "https://reqres.in/api/users/" + $id + "",
    type: "DELETE", // <- Change here
    contentType: "application/json",
    success: function () {
      alert("Delete user success");
      for (var i = 0; i < users.length; i++) {
        if (users[i].id == $id) {
          users.splice(i, 1);
        }
      }
      console.log(users);
      renderTable();
      // document.querySelector('#tableUsers tbody').removeChild(document.getElementById(`btn-delete-${$id}`).parentNode.parentNode);
    },
    error: function () {
      alert("fail");
    },
  });
}
