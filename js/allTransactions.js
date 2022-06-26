const IP = localStorage.getItem("IP");
const transactionContainer = document.getElementById("transaction-table");
const searchContainer = document.getElementById("search-table");
const searchTable = document.getElementById("searchTable");
/******************************************************/
const fragment = new DocumentFragment();
/******************************************************/
function getHistory() {
  let transactions = [];
  transactionContainer.innerHTML = "";
  const xhr = new XMLHttpRequest(),
    method = "GET",
    url = `http://${IP}:3000/api/system/historian`;
  xhr.open(method, url, true);
  xhr.onreadystatechange = () => {
    // In local files, status is 0 upon success in Mozilla Firefox
    if (xhr.readyState === XMLHttpRequest.DONE) {
      let data = JSON.parse(xhr.responseText);
      for (let i = 0; i < data.length; i++) {
        transactions.push(data[i]);
        let transactiontype = transactions[i].transactionType.split(".")[4];
        switch (transactiontype) {
          case "CreateSendMoney":
            transactions[i].Participant = "Doner";
            break;
          case ("SendPledgeToGovernement", "CreateProjectPledge"):
            transactions[i].Participant = "Charity Organization";
            break;
          case "ApprovePledgeFromGovernement":
            transactions[i].Participant = "Government";
            break;
          default:
            transactions[i].Participant = "Admin";
            break;
        }
      }
      for (let i = 0; i < transactions.length; i++) {
        const row = document.createElement("tr");
        const col1 = document.createElement("td");
        col1.innerText = transactions[i].Participant;
        const col2 = document.createElement("td");
        col2.innerText = transactions[i].transactionType.split(".")[4];
        const col3 = document.createElement("td");
        col3.innerText = transactions[i].transactionTimestamp;
        const col4 = document.createElement("td");
        col4.innerText = transactions[i].transactionId;
        row.append(col1, col2, col3, col4);
        fragment.appendChild(row);
      }
      transactionContainer.appendChild(fragment);
    }
  };
  xhr.send();
}
function search() {
  let id = document.getElementById("transactionId").value;
  searchTable.innerText = " ";
  searchContainer.innerText = " ";
  const xhr = new XMLHttpRequest(),
    method = "GET",
    url = `http://${IP}:3000/api/system/historian/${id}`;
  xhr.open(method, url, true);
  xhr.onreadystatechange = () => {
    // In local files, status is 0 upon success in Mozilla Firefox
    if (xhr.readyState === XMLHttpRequest.DONE) {
      let data1 = JSON.parse(xhr.responseText);
      const transactiontype = data1.transactionType.split(".")[4];
      const xhr2 = new XMLHttpRequest(),
        method = "GET",
        url = `http://${IP}:3000/api/${transactiontype}/${id}`;
      xhr2.open(method, url, true);
      xhr2.onreadystatechange = () => {
        if (xhr2.readyState === XMLHttpRequest.DONE) {
          let data2 = JSON.parse(xhr2.responseText);
          if (transactiontype === "CreateSendMoney") {
            let mrow = document.createElement("tr");
            let mcol1 = document.createElement("td");
            mcol1.innerText = "Doner ID";
            let mcol2 = document.createElement("td");
            mcol2.innerText = "Project ID";
            let mcol3 = document.createElement("td");
            mcol3.innerText = "Money ID";
            let mcol4 = document.createElement("td");
            mcol4.innerText = "Date & Time";
            mrow.append(mcol1, mcol2, mcol3, mcol4);
            searchTable.replaceWith(mrow);
            let row = document.createElement("tr");
            let col1 = document.createElement("td");
            col1.innerText = data2.donerId.split("#")[1];
            let col2 = document.createElement("td");
            col2.innerText = data2.pledgeId.split("#")[1];
            let col3 = document.createElement("td");
            col3.innerText = data2.MId;
            let col4 = document.createElement("td");
            col4.innerText = data2.timestamp;
            row.append(col1, col2, col3, col4);
            searchContainer.replaceWith(row);
          } else if (transactiontype === "CreateProjectPledge") {
            let mrow = document.createElement("tr");
            let mcol1 = document.createElement("td");
            mcol1.innerText = "Project ID";
            let mcol2 = document.createElement("td");
            mcol2.innerText = "Project Name";
            let mcol3 = document.createElement("td");
            mcol3.innerText = "Charity ID";
            let mcol4 = document.createElement("td");
            mcol4.innerText = "Funds Needed";
            let mcol5 = document.createElement("td");
            mcol5.innerText = "Date & Time";
            mrow.append(mcol1, mcol2, mcol3, mcol4, mcol5);
            searchTable.replaceWith(mrow);
            let row = document.createElement("tr");
            let col1 = document.createElement("td");
            col1.innerText = data2.pledgeId;
            let col2 = document.createElement("td");
            col2.innerText = data2.name;
            let col3 = document.createElement("td");
            col3.innerText = data2.CharityId.split("#")[1];
            let col4 = document.createElement("td");
            col4.innerText = data2.fundsRequired;
            let col5 = document.createElement("td");
            col5.innerText = data2.timestamp;
            row.append(col1, col2, col3, col4, col5);
            searchContainer.replaceWith(row);
          } else if (
            transactiontype === "ApprovePledgeFromGovernement" ||
            transactiontype === "SendPledgeToGovernement"
          ) {
            let mrow = document.createElement("tr");
            let mcol1 = document.createElement("td");
            mcol1.innerText = "Government ID";
            let mcol2 = document.createElement("td");
            mcol2.innerText = "Project ID";
            let mcol3 = document.createElement("td");
            mcol3.innerText = "Date & Time";
            mrow.append(mcol1, mcol2, mcol3);
            searchTable.replaceWith(mrow);
            let row = document.createElement("tr");
            let col1 = document.createElement("td");
            col1.innerText = data2.goverID.split("#")[1];
            let col2 = document.createElement("td");
            col2.innerText = data2.pledgeId.split("#")[1];
            let col3 = document.createElement("td");
            col3.innerText = data2.timestamp;
            row.append(col1, col2, col3);
            searchContainer.replaceWith(row);
          } else {
          }
        }
      };
      xhr2.send();
    }
  };
  xhr.send();
}
