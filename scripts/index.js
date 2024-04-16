var btnLoadJQuery = document.createElement("a");
document.getElementsByClassName("pageheaderlinks")[0].append("|  ");
document
  .getElementsByClassName("pageheaderlinks")[0]
  .appendChild(btnLoadJQuery);
btnLoadJQuery.innerText = "Load Jquery";
btnLoadJQuery.onclick = () => {
  var jq = document.createElement("script");
  jq.src = "https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js";
  document.getElementsByTagName("head")[0].appendChild(jq);

  var calendarScriptEl = document.createElement("script");
  calendarScriptEl.src =
    "https://cdn.jsdelivr.net/npm/fullcalendar-scheduler@6.1.11/index.global.min.js";
  document.getElementsByTagName("head")[0].appendChild(calendarScriptEl);

  btnLoadJQuery.innerText = "Ready Todo the Job";

  btnLoadJQuery.onclick = btnStarJob;
};
btnStarJob = () => {
  $(".datadisplaytable tr:not(:contains('LT_GC')):gt(1)").each((l, e) =>
    $(e).remove()
  );

  $(
    ".datadisplaytable tr:not(:contains('1112'):contains('COMP')):not(:contains('2003'):contains('COMP')):not(:contains('1008'):contains('COMP')):not(:contains('1054'):contains('COMP')):not(:contains('2017'):contains('COMM')):not(:contains('1006'):contains('COMP')):gt(1)"
  ).each((l, e) => $(e).remove());

  var calendarEl = document.createElement("div");
  document.getElementsByTagName("body")[0].appendChild(calendarEl);

  var calendar = new FullCalendar.Calendar(calendarEl, {
    initialView: "timeGridWeek",
    headerToolbar: {
      left: "prev,next today",
      center: "title",
      right: "dayGridMonth,timeGridWeek,timeGridDay,listWeek",
    },
    initialDate: Date.now(),
    events: Array.from(
      $(
        ".datadisplaytable tr:contains('1112'), tr:contains('2003'), tr:contains('1008'), tr:contains('1054'), tr:contains('2017'), tr:contains('1006'):gt(1)"
      )
        .map((l, e) => {
          return {
            crse: $(e).find("td:eq(3)").text(),
            title:
              $(e).find("td:eq(3)").text() +
              "\n" +
              $(e).find("td:eq(7)").text() +
              "\n" +
              $(e).find("td:eq(15)").text(),
            day: $(e).find("td:eq(8)").text(),
            time: $(e).find("td:eq(9)").text(),
            instructor: $(e).find("td:eq(13)").text(),
            location: $(e).find("td:eq(15)").text(),
          };
        })
        .map((l, ee) => {
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
    ),
  });
  calendar.render();

  $(".headerwrapperdiv").hide();
};
//$(".pageheaderlinks").append("| <a id='linkLoadJquery' onclick='alert(3)'  class='submenulinktext2'>Load Jquery</a>")
