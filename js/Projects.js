const IP = localStorage.getItem("IP");
const xhr = new XMLHttpRequest(),
  method = "GET",
  url = `http://${IP}:3000/api/ProjectPledge`;

xhr.open(method, url, true);
xhr.onreadystatechange = () => {
  // In local files, status is 0 upon success in Mozilla Firefox
  if (xhr.readyState === XMLHttpRequest.DONE) {
    let data = JSON.parse(xhr.responseText);
    console.log(data);
    for (let i = 0; i < data.length; i++) {
      if (data[i].needDonation && data[i].status === "READYFORDONATION") {
        document.getElementById(`project${i}1`).innerHTML = data[i].name;
        document.getElementById(`project${i}2`).innerHTML =
          "ID: " + data[i].pledgeId;
        document.getElementById(`project${i}3`).innerHTML = data[i].description;
        document.getElementById(
          `project${i}4`
        ).innerHTML = `Raised: ${data[i].fundsReceived}`;
        document.getElementById(
          `project${i}5`
        ).innerHTML = `Goal:$\ ${data[i].fundsRequired}`;
        document.querySelector(`.donate_project${i}`).dataset.id =
          data[i].pledgeId;
      }
    }
  }
};
xhr.send();

document.querySelectorAll(".donate_btn").forEach((btn) => {
  btn.addEventListener("click", handleDonateBtn);
});
function handleDonateBtn(e) {
  const btnID = e.target.getAttribute("data-id");
  localStorage.setItem("donateId", btnID);
}
