var btnLoadJQuery = document.createElement("a");
document.getElementsByClassName("pageheaderlinks")[0].append("|  ");
document
  .getElementsByClassName("pageheaderlinks")[0]
  .appendChild(btnLoadJQuery);
btnLoadJQuery.innerText = "🔎COURSES SEARCH++🚀";

var calendar = null;
var calendarEl = null;
//=======
let html = `<div id="popup" class="popup-container">
<div class="popup-content">
  <span class="close-btn">&times;</span>
  <h2>The amazin Add'n Drop Filter</h2>
  <div>
  <label for="txtFilterSelect" >Inform Course</label>
  <textarea type="text" id="txtFilterSelect" ></textarea>
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
    <button style="display:none" id="btnFilter">Filter</button>
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
  //will do something in the future
});
const triggerEvent = (el, eventType, detail) =>
  el.dispatchEvent(new CustomEvent(eventType, { detail }));

selectCourse.addEventListener("change", function (e) {
  console.log($(e.target).find(":selected").val());
  let search = "";
  $(e.target)
    .find(":selected")
    .each((l, e) => {
      let obj = JSON.parse(e.dataset.obj);
      search += `"${obj.location2}.*${obj.subj}.*${obj.crse}" `;
    });
  txtFilterSelect.value = search; // $(e.target).val().join(" ");
  triggerEvent(txtFilterSelect, "keydown", { doNotChangeSelect: true });
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

    //this property will be true when the user directly click on the select elemnt, on this moment is not intened to change it self. it will be updates only when the event coment from the change of the text field
    if (!e.detail?.doNotChangeSelect) {
      updateCourseOptionsOnSelecElement(filterData);
    }
    initializeOrUpdateCalendar(filterData);
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
function initializeOrUpdateCalendar(filterData) {
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
}

function updateCourseOptionsOnSelecElement(filterData) {
  let coursesItemsArray = Array.from(filterData);
  var coursesItemsUnique = coursesItemsArray.filter(function (
    item,
    i,
    sites
  ) {
    return (
      i ==
      sites
        .map((l, e) => l.location2 + l.subj + l.crse)
        .indexOf(item.location2 + item.subj + item.crse)
    );
  });

  $("#selectCourse").empty();
  $(coursesItemsUnique.sort()).each((l, e) => {
    const newOption = document.createElement("option");
    newOption.value = e.crse;
    newOption.innerText = e.title2;
    newOption.dataset.obj = JSON.stringify(e);
    $("#selectCourse").append(newOption);
  });
}

Date.prototype.addHours = function (h) {
  this.setTime(this.getTime() + h * 60 * 60 * 1000);
  return this;
};


const myArrayCourseBackGRoungColor = {};

btnLoadJQuery.onclick = () => {
  popup.style.display = "block";

  if (!dataSource0) {
    dataSource0 = $(
      // ".datadisplaytable tr:contains('1112'), tr:contains('2003'), tr:contains('1008'), tr:contains('1054'), tr:contains('2017'), tr:contains('1006'):gt(1)"
      ".datadisplaytable tr:has(td)"
    )
      .map((l, e) => {
        return {
          crse: $(e).find("td:eq(3)").text().trim(),
          name: $(e).find("td:eq(7)").text().trim(),
          day: $(e).find("td:eq(8)").text().trim(),
          time: $(e).find("td:eq(9)").text().trim(),
          instructor: $(e).find("td:eq(13)").text().trim(),
          location: $(e).find("td:eq(15)").text().trim(),
          crn: $(e).find("td:eq(1)").text().trim(),
          subj: $(e).find("td:eq(2)").text().trim(),
          cmp: $(e).find("td:eq(5)").text().trim(),
        };
      })
      .map((l, ee) => {
        ee.title =
          ee.crn + "\n" + ee.crse + "\n" + ee.name + "\n" + ee.location;
        ee.location2 = ee.location.split(" ")[0];
        ee.title2 =
          ee.location2 + " - " + ee.subj + " - " + ee.crse + " - " + ee.name;

        //some improvements must be made about the color of each event in order to prevent different courses same color and make the student confuse
        let key = ee.location2 + ee.subj + ee.crse;
        if (!myArrayCourseBackGRoungColor[key]) {
          let newValue = Math.trunc(Math.random() * 360);

          for (let variable in myArrayCourseBackGRoungColor) {
            if (myArrayCourseBackGRoungColor[variable] == newValue) {
              newValue = Math.trunc(Math.random() * 360);
            }
          }
          myArrayCourseBackGRoungColor[key] = newValue;
        }
        let rgbColor = `hsl(${myArrayCourseBackGRoungColor[key]},50%,50%)`;
        console.log(rgbColor);

        ee.backgroundColor = rgbColor;

        let timeArray1 = ee.time.split("-").map((e, i, l) => {
          let timeArray2 = e.split(" ");
          let firstDayWeek = 14;
          let newDay = new Date(
            2024,
            3,
            ee.day == "M"
              ? firstDayWeek + 1
              : ee.day == "T"
              ? firstDayWeek + 2
              : ee.day == "W"
              ? firstDayWeek + 3
              : ee.day == "R"
              ? firstDayWeek + 4
              : ee.day == "F"
              ? firstDayWeek + 5
              : ee.day == "S"
              ? firstDayWeek + 6
              : firstDayWeek,
            parseInt(timeArray2[0].split(":")[0]),
            parseInt(timeArray2[0].split(":")[1])
          );

          return timeArray2[1] == "pm" && timeArray2[0].split(":")[0] != "12"
            ? newDay?.addHours(12)
            : newDay;
        });
        ee.start = timeArray1[0];
        ee.end = timeArray1[1];

        return ee;
      });

      if (calendarEl == null) {
        calendarEl = document.createElement("div");
        document.getElementsByClassName("popup-content")[0].appendChild(calendarEl);
      }
      initializeOrUpdateCalendar([]);
    /*
      calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: "timeGridWeek",
        headerToolbar: {
          left: "",
          center: "",
          right: "",
        },
        initialDate: Date.now(),
        // events: dataSource,
      });
    
      calendar.render();
      */
      
      updateCourseOptionsOnSelecElement(dataSource0);
     /* let coursesItemsArray = Array.from(dataSource0);
  var coursesItemsUnique = coursesItemsArray.filter(function (item, i, sites) {
    return (
      i ==
      sites
        .map((l, e) => l.location2 + l.subj + l.crse)
        .indexOf(item.location2 + item.subj + item.crse)
    );
  });

  $("#selectCourse").empty();
  $(coursesItemsUnique.sort()).each((l, e) => {
    const newOption = document.createElement("option");
    newOption.value = e.crse;
    newOption.innerText = e.title2;
    newOption.dataset.obj = JSON.stringify(e);
    $("#selectCourse").append(newOption);
  });*/

  }
  
  /*
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
    newOption.dataset.obj=JSON.stringify(e);
    $("#selectLocation").append(newOption);
  });
*/
  // let dataSource = Array.from(dataSource0);

 

  //$(".headerwrapperdiv").hide();
};
