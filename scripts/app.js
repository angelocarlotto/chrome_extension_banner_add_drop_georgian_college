var btnLoadJQuery = document.createElement("a");
document.getElementsByClassName("pageheaderlinks")[0].append("|  ");
document
  .getElementsByClassName("pageheaderlinks")[0]
  .appendChild(btnLoadJQuery);
btnLoadJQuery.innerText = "🔎COURSES SEARCH++🚀";

var calendar = null;
var calendarEl = null;
let timeTableEventsCourse = [];
var tokenRefreshSearching = null;
let dataSource0 = null;
//=======
let html = `
<div id="popup" class="popup-container">
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
            
            <hr>
            <div id="divTimeTable">
            If you want to load your current time table, please inform the date <input id="inputDateTimeTable" type="date"/> of semester's first week, then click <button id="btnLoadTimeTable">Load Time table</button> OR <button id="btnRemoveTimeTable">Remove Time Table</button><label id="lblTimeTable"></label>
            </div>
            <hr>
            If the colors of each Course is confused try <button id="btnRefreshColors">Refresh Colors</button> OOR you can click over a especific course and changes only its color. <label id="lblRefreshColors"></label>
            <hr>
            <div>
              <label style="display:none"  id="lblTimer">Searching will begin in 2s...</label>
            </div>
        </div>
    </div>
</div>
`;
const newDiv = document.createElement("div");
newDiv.innerHTML = html;

document.body.appendChild(newDiv);

//=================

const lblTimer = document.getElementById("lblTimer");
const txtFilterSelect = document.getElementById("txtFilterSelect");
const inputDateTimeTable = document.getElementById("inputDateTimeTable");
const btnLoadTimeTable = document.getElementById("btnLoadTimeTable");
const btnRefreshColors = document.getElementById("btnRefreshColors");
const lblTimeTable = document.getElementById("lblTimeTable");
const lblRefreshColors = document.getElementById("lblRefreshColors");
const btnRemoveTimeTable = document.getElementById("btnRemoveTimeTable");
const popup = document.getElementById("popup");
const closeBtn = document.querySelector(".close-btn");

btnRefreshColors.addEventListener("click", function (e) {
  console.log(
    `Entered: ${arguments.callee.name} ${arguments[0]?.currentTarget?.id} ${arguments[0]?.type}`
  );
  lblRefreshColors.innerText = "Loading...";
  localStorage.setItem("myArrayCourseBackGRoungColor", null);
  dataSource0.each((a, b) => {
    b.generateBackGroundColorToCourse();
  });

  triggerEvent(txtFilterSelect, "keydown", {});
});

btnRemoveTimeTable.addEventListener("click", function (e) {
  timeTableEventsCourse.forEach((a, b, c) => a.remove());
});

btnLoadTimeTable.addEventListener("click", function (e) {
  console.log(
    `Entered: ${arguments.callee.name} ${arguments[0]?.currentTarget?.id} ${arguments[0]?.type}`
  );
  lblTimeTable.innerText = "Loading...";
  if (inputDateTimeTable.value) {
    $.ajax({
      url: "https://sis-ssb.georgiancollege.ca:9110/GEOR/bwskfshd.P_CrseSchd",
      success: (responseAux, b) => {
        timeTableEventsCourse.forEach((a, b, c) => a.remove());
        let linkWithContent = $(
          $(responseAux)
            .filter("div.headerwrapperdiv")
            .map(
              (i, e) =>
                $($(e.children).filter("div.pagebodydiv")[0].children).filter(
                  "table.datadisplaytable"
                )[0]
            )[0]
        ).find("td:has(a)");

        let tabelCells = linkWithContent.map((i, e) => ({
          td: e,
          cellIndex: e.cellIndex,
          parentHasTH: $(e.parentElement.children).filter("th").length,
        }));
        tabelCells.each((i, e) => {
          e.cellIndex += e.parentHasTH ? 0 : 1;
          e.textContent = [...e.td.children[0].childNodes]
            .filter((i, e) => i.innerText != "")
            .map((e) => e.data);
        });

        let dados = tabelCells.map((i, e) => {
          let dadosFirstPos = e.textContent[0]
            .split(" ")
            .map((e) => e.split("-"))
            .flat();
          let subj = dadosFirstPos[0];
          let crse = dadosFirstPos[1];
          let crn = e.textContent[1].replace("Class", "").trim();

          let time = e.textContent[2]; //3:30 pm-6:20 pm
          let day = "";
          switch (e.cellIndex) {
            case 1:
              day = "M";
              break;
            case 2:
              day = "T";
              break;
            case 3:
              day = "W";
              break;
            case 4:
              day = "R";
              break;
            case 5:
              day = "F";
              break;
            case 5:
              day = "S";
              break;
          }

          let location = e.textContent[3];
          let location2 = location?.split(" ")[0];
          let key = subj + crse + location2;
          let name = getMyArrayCourseBackGroungColor(key, true);
          return new Course(crse, crn, name, day, time, "", location, subj, "");
        });

        lblTimeTable.innerText = `Was found ${dados.length} courses`;
        console.log(tabelCells);
        dados.each((i, e) => {
          e.borderColor = "red";
          let eventAux = calendar.addEvent(e);
          timeTableEventsCourse.push(eventAux);
        });
      },
      data: {
        start_date_in: new Date(inputDateTimeTable.value).toLocaleDateString(),
      },
    });
  } else {
    lblTimeTable.innerText = "MAKE SURE YOU SELECTED A VALID DATE";
  }
});

const triggerEvent = (el, eventType, detail) =>
  el.dispatchEvent(new CustomEvent(eventType, { detail }));

selectCourse.addEventListener("change", function (e) {
  console.log(
    `Entered: ${arguments.callee.name} ${arguments[0]?.currentTarget?.id} ${arguments[0]?.type}`
  );
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

txtFilterSelect.addEventListener("keydown", function (e) {
  console.log(
    `Entered: ${arguments.callee.name} ${arguments[0]?.currentTarget?.id} ${arguments[0]?.type}`
  );
  localStorage.setItem("bannerQuarry", e.target.value);
  if (tokenRefreshSearching != null) clearTimeout(tokenRefreshSearching);
  tokenRefreshSearching = setTimeout(() => {
    //console.log(e);

    let regex = new RegExp(
      e.target.value
        .toLowerCase()
        .split(/\“|\"/)
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
    lblTimer.style.display = "none";
    lblRefreshColors.innerText = "";
  }, 1000);

  lblTimer.style.display = "block";
});

closeBtn.addEventListener("click", function () {
  console.log(
    `Entered: ${arguments.callee.name} ${arguments[0]?.currentTarget?.id} ${arguments[0]?.type}`
  );
  popup.style.display = "none";
  localStorage.setItem("isWindowOpen", false);
});

// Optional: Close when clicking outside the popup
window.addEventListener("click", function (event) {
  console.log(
    `Entered: ${arguments.callee.name} ${arguments[0]?.currentTarget?.id} ${arguments[0]?.type}`
  );
  if (event.target === popup) {
    popup.style.display = "none";
  }
});
function clickOnEventOnCalendar(info) {
  console.log("Event: " + info.event.title);
  console.log(
    `Entered: ${arguments.callee.name} ${arguments[0]?.currentTarget?.id} ${arguments[0]?.type}`
  );
  lblRefreshColors.innerText = "Loading...";
  let key=info.event.extendedProps.key;
  //dataSource0.each((a, b) => {
    //b.generateBackGroundColorToCourse();
  //});

    let newValue = Math.trunc(Math.random() * 360);
    setMyArrayCourseBackGroungColor(key, newValue);


  dataSource0.filter((i,e)=>e.key==info.event.extendedProps.key).each((i,e)=>e.generateBackGroundColorToCourse());

  triggerEvent(txtFilterSelect, "keydown", {});


}
function initializeOrUpdateCalendar(filterData) {
  console.log(
    `Entered: ${arguments.callee.name} ${arguments[0]?.currentTarget?.id} ${arguments[0]?.type}`
  );
  calendar = new FullCalendar.Calendar(calendarEl, {
    initialView: "timeGridWeek",
    headerToolbar: {
      left: "",
      center: "",
      right: "",
    },
    dayHeaderFormat: { weekday: "short" },
    stickyHeaderDates: true,
    stickyFooterScrollbar: true,
    allDaySlot: false,
    slotMinTime: "07:00:00",
    slotMaxTime: "20:00:00",
    initialDate: Date.now(),
    events: Array.from(filterData),
    eventClick: clickOnEventOnCalendar,
  });

  calendar.render();
}

function updateCourseOptionsOnSelecElement(filterData) {
  console.log(
    `Entered: ${arguments.callee.name} ${arguments[0]?.currentTarget?.id} ${arguments[0]?.type}`
  );
  let coursesItemsArray = Array.from(filterData);
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
    newOption.innerText =
      e.title2 + `(${dataSource0.filter((i, ee) => e.key == ee.key).length})`;
    newOption.dataset.obj = JSON.stringify(e);
    $("#selectCourse").append(newOption);
  });
}

Date.prototype.addHours = function (h) {
  this.setTime(this.getTime() + h * 60 * 60 * 1000);
  return this;
};

function getMyArrayCourseBackGroungColor(key, isGetNameValue) {
  console.log(
    `Entered: ${arguments.callee.name} ${arguments[0]?.currentTarget?.id} ${arguments[0]?.type}`
  );
  let myArrayCourseBackGRoungColor = JSON.parse(
    localStorage.getItem("myArrayCourseBackGRoungColor")
  );
  if (myArrayCourseBackGRoungColor == null) myArrayCourseBackGRoungColor = {};
  localStorage.setItem(
    "myArrayCourseBackGRoungColor",
    JSON.stringify(myArrayCourseBackGRoungColor)
  );

  return key
    ? myArrayCourseBackGRoungColor[key]
      ? isGetNameValue
        ? myArrayCourseBackGRoungColor[key].name
        : myArrayCourseBackGRoungColor[key].value
      : null
    : myArrayCourseBackGRoungColor;
}
function setMyArrayCourseBackGroungColor(key, value, name) {
  console.log(
    `Entered: ${arguments.callee.name} ${arguments[0]?.currentTarget?.id} ${arguments[0]?.type}`
  );
  let myArrayCourseBackGRoungColor = JSON.parse(
    localStorage.getItem("myArrayCourseBackGRoungColor")
  );
  if (myArrayCourseBackGRoungColor == null) myArrayCourseBackGRoungColor = {};

  myArrayCourseBackGRoungColor[key] = { value: value?value:myArrayCourseBackGRoungColor[key]?.value, name: name?name:myArrayCourseBackGRoungColor[key]?.name };

  localStorage.setItem(
    "myArrayCourseBackGRoungColor",
    JSON.stringify(myArrayCourseBackGRoungColor)
  );
}

class Course {
  crse;
  crn;
  name;
  day;
  time;
  instructor;
  location;
  subj;
  cmp;
  location;
  location2;
  key;
  //the followinf properties will be used to the callendar component
  backgroundColor;
  title;
  start;
  end;
  extendedProps;
  constructor(crse, crn, name, day, time, instructor, location, subj, cmp) {
    this.crse = crse;
    this.crn = crn;
    this.name = name;
    this.day = day;
    this.time = time;
    this.instructor = instructor;
    this.location = location;
    this.subj = subj;
    this.cmp = cmp;

    this.title =
      this.crn + "\n" + this.crse + "\n" + this.name + "\n" + this.location;

    this.location2 = this.location?.split(" ")[0];
    this.title2 =
      this.location2 +
      " - " +
      this.subj +
      " - " +
      this.crse +
      " - " +
      this.name;

    this.key = this.subj + this.crse + this.location2;

    this.generateBackGroundColorToCourse();

    //this.backgroundColor = rgbColor;

    let timeArray1 = this.time.split("-").map((e, i, l) => {
      let timeArray2 = e.split(" ");
      let lastSunday = this.getLastSunday();

      let firstDayWeek = lastSunday.getDate();

      let newDay = new Date(
        lastSunday.getYear() + 1900,
        lastSunday.getMonth(),
        this.day == "M"
          ? firstDayWeek + 1
          : this.day == "T"
          ? firstDayWeek + 2
          : this.day == "W"
          ? firstDayWeek + 3
          : this.day == "R"
          ? firstDayWeek + 4
          : this.day == "F"
          ? firstDayWeek + 5
          : this.day == "S"
          ? firstDayWeek + 6
          : firstDayWeek,
        parseInt(timeArray2[0].split(":")[0]),
        parseInt(timeArray2[0].split(":")[1])
      );

      return timeArray2[1] == "pm" && timeArray2[0].split(":")[0] != "12"
        ? newDay?.addHours(12)
        : newDay;
    });
    this.start = timeArray1[0];
    this.end = timeArray1[1];

    this.extendedProps={key:this.key};
  }

  getLastSunday() {
    const date = new Date();
    const today = date.getDate();
    const currentDay = date.getDay();
    const newDate = date.setDate(today - (currentDay || 7));
    return new Date(newDate);
  }

  generateBackGroundColorToCourse() {
    if (!getMyArrayCourseBackGroungColor(this.key) ) {
      let newValue = Math.trunc(Math.random() * 360);
      setMyArrayCourseBackGroungColor(this.key, newValue, this.name);
    }
    let rgbColor = `hsl(${getMyArrayCourseBackGroungColor(this.key)},50%,50%)`;
    this.backgroundColor = rgbColor;
    return this.backgroundColor;
  }
}

function loadData() {
  console.log(
    `Entered: ${arguments.callee.name} ${arguments[0]?.currentTarget?.id} ${arguments[0]?.type}`
  );
  if (!dataSource0) {
    dataSource0 = $(".datadisplaytable tr:has(td)")
      .filter((i, e, list) => $(e).find("td:eq(1)").text().trim() != "")
      .map((l, e) => {
        return new Course(
          $(e).find("td:eq(3)").text().trim(),
          $(e).find("td:eq(1)").text().trim(),
          $(e).find("td:eq(7)").text().trim(),
          $(e).find("td:eq(8)").text().trim(),
          $(e).find("td:eq(9)").text().trim(),
          $(e).find("td:eq(13)").text().trim(),
          $(e).find("td:eq(15)").text().trim(),
          $(e).find("td:eq(2)").text().trim(),
          $(e).find("td:eq(5)").text().trim()
        );
      });

    if (calendarEl == null) {
      calendarEl = document.createElement("div");
      document
        .getElementsByClassName("popup-content")[0]
        .appendChild(calendarEl);
    }
    initializeOrUpdateCalendar([]);

    updateCourseOptionsOnSelecElement(dataSource0);

    txtFilterSelect.innerText = localStorage.getItem("bannerQuarry");
    triggerEvent(txtFilterSelect, "keydown", {});
  }
}

//this timmer is just to make sure the jquery was loaded
setTimeout(() => {
  $(document).ready(() => {
    if (localStorage.getItem("isWindowOpen") == "true") {
      popup.style.display = "block";
      loadData();

      txtFilterSelect.innerText = localStorage.getItem("bannerQuarry");
      triggerEvent(txtFilterSelect, "keydown", {});
    }
  });
}, 1000);
function consoleLog(arguments) {
  console.log(
    `Entered: ${arguments.callee.name} ${arguments[0]?.currentTarget?.id} ${arguments[0]?.type}`
  );
}
btnLoadJQuery.onclick = () => {
  console.log(
    `Entered: ${arguments.callee.name} ${arguments[0]?.currentTarget?.id} ${arguments[0]?.type}`
  );
  localStorage.setItem("isWindowOpen", true);
  popup.style.display = "block";
  loadData();
};
