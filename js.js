var users = [],
  total_page,
  page = 1,
  isRenderTable = false;
$(document).ready(function () {
  getData(page);
});
function InitPaging() {
  actionPage();
  let html = `<li class="page-item ">
                <a class="page-link" id="btn_pre" href="javascript: void(0)" aria-label="Previous">
                  <span aria-hidden="true">&laquo;</span>
                  <span class="sr-only">Previous</span>
                </a>
              </li>`;
  for (var i = 1; i <= total_page; i++) {
    if( i == page  ){
      html +=
      `<li class="page-item active"><a class="page-link  " href="javascript: void(0)"  data-index="` +
      i +
      `" >` +
      i +
      `</a></li>`;
    }else{
    html +=
      `<li class="page-item"><a class="page-link " href="javascript: void(0)"  data-index="` +
      i +
      `" >` +
      i +
      `</a></li>`;
    }
  }
  $("#pagination").html(html + `<li class="page-item" id="li_paging">
                                  <a class="page-link" id="btn_next" href="javascript: void(0)"  aria-label="Next">
                                    <span aria-hidden="true">&raquo;</span>
                                    <span class="sr-only">Next</span>
                                  </a>
                                </li>`
   );
  actionPage();
  
}
function actionPage() {
  $(".page-link").on("click", function () {
    page = $(this).attr("data-index");
    if(page > 0)
      getData(page);
  });
  var pageTemp = page;
  $("#btn_next").on("click", function(){
    if(pageTemp < total_page){
      getData(parseInt(pageTemp) + 1);
   }
  });
  $("#btn_pre").on("click", function(){
    if(pageTemp > 1){
      getData(parseInt(pageTemp) - 1);
   }
  });
}

function getData($id = 1) {
  $.ajax({
    url: "https://reqres.in/api/users?page=" + $id + " ",
    type: "GET",
    datatype: "json",
    contentType: "application/json;charset=utf-8",
    success: function (response) {
      users = response.data;
      total_page = response.total_pages;
      if (!isRenderTable) {
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
                return "<img src='" + value + "' width='100px' />";
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
      } else {
        renderTable();
      }
      isRenderTable = true;
      InitPaging();
    },
    error: function (jqXHR, textStatus, errorThrown) {
      alert("error: " + textStatus + ": " + errorThrown);
    },
  });
}
function renderTable() {
  $("#tableUsers").bootstrapTable("load", users);
}
// Add user
function addUser() {
  var formData = {
    id: "",
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
      
      console.log( users );
      //   auto close Modal after 0s
      setTimeout(function () {
        $("#ModalAdd").modal("hide");
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
      var user = response.data;
      var html =
        `<thead>
            <tr>
                <td data-field="first_name" > FirstName :  </td>
                <td> <input type="text" value=" ` +
        user.first_name +
        `" name="txtfirst_name" size="30" required> </td>
            </tr>
            <tr>
                <td data-field="last_name"> LastName :  </td>
                <td> <input type="text" value=" ` +
        user.last_name +
        `" size="30" name="txtlast_name" required> </td>
            </tr>
            <tr>
                <td data-field="email" > Email :  </td>
                <td> <input type="email" value=" ` +
        user.email +
        `" size="30" name="txtemail" required> </td>
            </tr>
            <tr>
                <td data-field="avatar"> Avatar :  </td>
                <td> <input type="file" name="txtavatar" > </td>
            </tr>
            <tr>
                <td> </td>
                <td> <img src='` +
        user.avatar +
        `' width='100px' /> </td>
            </tr>
            <tr>
                <td> </td>
                <td>
                <button type="button" class="btn btn-success" id="update" onclick="updateData(` +
        user.id +
        `)">Update</button>
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
function updateData($id) {
  var formUpdateData = {
    first_name: $("input[name=txtfirst_name]").val(),
    last_name: $("input[name=txtlast_name]").val(),
    email: $("input[name=txtemail]").val(),
    avatar: $("input[name=txtavatar]").val(),
  };
  for (var i = 0; i < users.length; i++) {
    if (users[i].id == $id) {
      users[i].first_name = formUpdateData.first_name;
      users[i].last_name = formUpdateData.last_name;
      users[i].email = formUpdateData.email;
      if (formUpdateData.avatar) {
        users[i].avatar = formUpdateData.avatar;
      }
    }
  }
  //   auto close Modal after 0s
  setTimeout(function () {
    $("#myModalUpdate").modal("hide");
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
      renderTable();
      // document.querySelector('#tableUsers tbody').removeChild(document.getElementById(`btn-delete-${$id}`).parentNode.parentNode);
    },
    error: function () {
      alert("fail");
    },
  });
}
