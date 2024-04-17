var btnLoadJQuery = document.createElement("a");
document.getElementsByClassName("pageheaderlinks")[0].append("|  ");
document
  .getElementsByClassName("pageheaderlinks")[0]
  .appendChild(btnLoadJQuery);
btnLoadJQuery.innerText = "Open Amazin Search PopUp 🥳";

var calendar = null;
var calendarEl =null;
//=======
let html = `<div id="popup" class="popup-container">
<div class="popup-content">
  <span class="close-btn">&times;</span>
  <h2>The amazin Add'n Drop Filter</h2>
  <div>
  <label for="txtFilterSelect" >Inform Course</label>
  <input type="text" id="txtFilterSelect" >
  <br>
  <label for="selectCourse">Select Course</label>
  <select id="selectCourse" multiple>
  <option>none</option>  
  </select>

  <label  style="display:none"  for="txtFilterLocation">Inform Location</label>
  <input   type="text" id="txtFilterLocation"/>
  <br>
  <label style="display:none" for="selectLocation">Select Location</label>
  <select  id="selectLocation" multiple>
  <option>none</option>  
  </select>
  <br>
    <button id="btnFilter">Filter</button>
  </div>
</div>
</div>
`;
//<button id="open-popup">Open Popup</button>
const newDiv = document.createElement("div");
newDiv.innerHTML = html;

document.body.appendChild(newDiv);

//=================

const selectLocation = document.getElementById("selectLocation");
const txtFilterSelect = document.getElementById("txtFilterSelect");
const txtFilterLocation = document.getElementById("txtFilterLocation");
const btnFilter = document.getElementById("btnFilter");

//const openPopupBtn = document.getElementById("open-popup");
const popup = document.getElementById("popup");
const closeBtn = document.querySelector(".close-btn");

btnFilter.addEventListener("click", function (e) {

  


});

//openPopupBtn.addEventListener("click", function () {
//  popup.style.display = "block";
//});
var token = null;
txtFilterSelect.addEventListener("keydown", function (e) {
  if (token != null) clearTimeout(token);
  token = setTimeout(() => {
    console.log(e);

    let regex = new RegExp(
      e.target.value
        .toLowerCase()
        .split(`"`)
        .map((l, e) => l.trim().split(` `))
        .filter((e) => e != ``)
        .flat()
        .map((e) => e.replace("+", " "))
        .join("|")
    );
    let filterData = dataSource0.filter((i, ee) =>
      regex.test(ee.title2.toLowerCase())
    );

    $("#selectCourse").empty();
    $(filterData.sort()).each((l, e) => {
      const newOption = document.createElement("option");
      newOption.value = e.crse;
      newOption.innerText = e.title2;
      $("#selectCourse").append(newOption);
    });

    calendar = new FullCalendar.Calendar(calendarEl, {
      initialView: "timeGridWeek",
      headerToolbar: {
        left: "",
        center: "",
        right: "",
      },
      initialDate: Date.now(),
      events: Array.from(filterData),
    });
  
    calendar.render();


  }, 1000);
});

var token2 = null;
txtFilterLocation.addEventListener("keydown", function (e) {
  if (token2 != null) clearTimeout(token2);
  token2 = setTimeout(() => {
    console.log(e);
  }, 500);
});

closeBtn.addEventListener("click", function () {
  popup.style.display = "none";
});

// Optional: Close when clicking outside the popup
window.addEventListener("click", function (event) {
  if (event.target === popup) {
    popup.style.display = "none";
  }
});
let dataSource0 = null;
btnLoadJQuery.onclick = () => {
  popup.style.display = "block";

  dataSource0 = $(
    // ".datadisplaytable tr:contains('1112'), tr:contains('2003'), tr:contains('1008'), tr:contains('1054'), tr:contains('2017'), tr:contains('1006'):gt(1)"
    ".datadisplaytable tr:has(td)"
  )
    .map((l, e) => {
      return {
        crse: $(e).find("td:eq(3)").text(),
        name: $(e).find("td:eq(7)").text(),
        day: $(e).find("td:eq(8)").text(),
        time: $(e).find("td:eq(9)").text(),
        instructor: $(e).find("td:eq(13)").text(),
        location: $(e).find("td:eq(15)").text(),
        crn: $(e).find("td:eq(1)").text(),
        subj: $(e).find("td:eq(2)").text(),
        cmp: $(e).find("td:eq(5)").text(),
      };
    })
    .map((l, e) => {
      e.title = e.crse + "\n" + e.name + "\n" + e.location;
      e.location2 = e.location.split(" ")[0];
      e.title2 = e.location2 + " - " + e.subj + " - " + e.crse + " - " + e.name;
      return e;
    });

  let coursesItemsArray = Array.from(dataSource0);
  var coursesItemsUnique = coursesItemsArray.filter(function (item, i, sites) {
    return i == sites.indexOf(item);
  });

  $("#selectCourse").empty();
  $(coursesItemsUnique.sort()).each((l, e) => {
    const newOption = document.createElement("option");
    newOption.value = e.crse;
    newOption.innerText = e.title2;
    $("#selectCourse").append(newOption);
  });

  let locationItemsArray = Array.from(
    $(jQuery.unique(dataSource0.map((l, e) => e.location2)))
  );
  var locationItemsUnique = locationItemsArray.filter(function (
    item,
    i,
    sites
  ) {
    return i == sites.indexOf(item);
  });

  $("#selectLocation").empty();
  $(locationItemsUnique.sort()).each((l, e) => {
    const newOption = document.createElement("option");
    newOption.value = e;
    newOption.innerText = e;
    $("#selectLocation").append(newOption);
  });

  let dataSource = Array.from(
    dataSource0.map((l, ee) => {
      let timeArray1 = ee.time.split("-").map((e, i, l) => {
        let timeArray2 = e.split(" ");
        return timeArray2[1] == "pm" && timeArray2[0].split(":")[0] != "12"
          ? new Date(
              2024,
              3,
              ee.day == "M"
                ? 15
                : ee.day == "T"
                ? 16
                : ee.day == "W"
                ? 17
                : ee.day == "R"
                ? 18
                : ee.day == "F"
                ? 19
                : ee.day == "S"
                ? 20
                : 14,
              parseInt(timeArray2[0].split(":")[0]) + 12,
              parseInt(timeArray2[0].split(":")[1])
            )
          : new Date(
              2024,
              3,
              ee.day == "M"
                ? 15
                : ee.day == "T"
                ? 16
                : ee.day == "W"
                ? 17
                : ee.day == "R"
                ? 18
                : ee.day == "F"
                ? 19
                : ee.day == "S"
                ? 20
                : 14,
              parseInt(timeArray2[0].split(":")[0]),
              parseInt(timeArray2[0].split(":")[1])
            );
      });
      ee.start = timeArray1[0];
      ee.end = timeArray1[1];
      ee.backgroundColor =
        ee.crse == "1006"
          ? "red"
          : ee.crse == "2017"
          ? "blue"
          : ee.crse == "1054"
          ? "gray"
          : ee.crse == "1008"
          ? "pink"
          : ee.crse == "2003"
          ? "black"
          : ee.crse == "1112"
          ? "green"
          : "purple";
      return ee;
    })
  );

  if (calendarEl == null) {
     calendarEl = document.createElement("div");
    document.getElementsByClassName("popup-content")[0].appendChild(calendarEl);
  }
  calendar = new FullCalendar.Calendar(calendarEl, {
    initialView: "timeGridWeek",
    headerToolbar: {
      left: "",
      center: "",
      right: "",
    },
    initialDate: Date.now(),
    events: dataSource,
  });

  calendar.render();

  //$(".headerwrapperdiv").hide();
};
