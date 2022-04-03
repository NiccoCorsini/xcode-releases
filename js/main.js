const tBody = document.querySelector("tbody");
const scrollable = document.getElementById("scrollable");
const goTop = document.querySelector(".go-top");

let originList = [];
let list = [];

const printList = (list) => {
  list.forEach((e) => {
    const row = document.createElement("tr");
    let options = { day: "2-digit", month: "short", year: "numeric" };
    let date = new Date(e.date.year, e.date.month, e.date.day).toLocaleString(
      "en-GB",
      options
    );

    row.innerHTML = `<td>${e.version.number}</td>
        <td>${
          e.version.release.release
            ? "Release"
            : e.version.release.rc
            ? "RC" + e.version.release.rc
            : e.version.release.beta
            ? "Beta" + (e.version.release.beta ? e.version.release.beta : "")
            : "GM"
        }</td>
        <td>${e.version.build}</td>
        <td>${date}</td>
        <td>MacOS ${e.requires}+</td>`;

    e.sdks && e.sdks.macOS
      ? (row.innerHTML += `<td>${
          (e.sdks.macOS[0].number ? e.sdks.macOS[0].number : "") +
          " (" +
          (e.sdks.macOS[0].build ? e.sdks.macOS[0].build : "?") +
          ")"
        }</td>`)
      : (row.innerHTML += "<td></td>");

    e.sdks && e.sdks.iOS
      ? (row.innerHTML += `<td>${
          (e.sdks.iOS[0].number ? e.sdks.iOS[0].number : "") +
          " (" +
          (e.sdks.iOS[0].build ? e.sdks.iOS[0].build : "?") +
          ")"
        }</td>`)
      : (row.innerHTML += "<td></td>");

    e.sdks && e.sdks.watchOS
      ? (row.innerHTML += `<td>${
          (e.sdks.watchOS[0].number ? e.sdks.watchOS[0].number : "") +
          " (" +
          e.sdks.watchOS[0].build +
          ")"
        }</td>`)
      : (row.innerHTML += "<td></td>");

    e.sdks && e.sdks.tvOS
      ? (row.innerHTML += `<td>${
          (e.sdks.tvOS[0].number ? e.sdks.tvOS[0].number : "") +
          " (" +
          e.sdks.tvOS[0].build +
          ")"
        }</td>`)
      : (row.innerHTML += "<td></td>");

    e.links && e.links.download
      ? (row.innerHTML += `<td><a href="${e.links.download.url}">Download</a></td>`)
      : (row.innerHTML += "<td></td>");

    e.links && e.links.notes
      ? (row.innerHTML += `<td><a href="${e.links.notes.url}">Release Notes</a></td>`)
      : (row.innerHTML += "<td></td>");

    tBody.appendChild(row);
  });
};

const clearList = () => {
  while (tBody.hasChildNodes()) {
    tBody.removeChild(tBody.firstChild);
  }
};

const getList = async () => {
  const result = await fetch("https://xcodereleases.com/data.json");
  const data = await result.json();

  list = [...data];
  originList = [...data];

  printList(list);
};

getList();

const filterList = (filter = null) => {
  if (filter == "beta") {
    clearList();
    list = originList.filter((e) => e.version.release.beta);
  } else if (filter == "stable") {
    clearList();
    list = originList.filter((e) => !e.version.release.beta);
  } else {
    clearList();
    list = originList;
  }

  printList(list);
};

scrollable.addEventListener("scroll", (event) => {
  scrollable.scrollTop > 0
    ? (goTop.style.display = "flex")
    : (goTop.style.display = "none");
});

const scrollNow = () => {
  scrollable.scrollTop = 0;
};
