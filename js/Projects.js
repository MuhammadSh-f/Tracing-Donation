const IP = localStorage.getItem("IP");
const projectCard = document.getElementById("projects");
let projects = [];
const xhr = new XMLHttpRequest(),
  method = "GET",
  url = `http://${IP}:3000/api/ProjectPledge`;

xhr.open(method, url, true);
xhr.onreadystatechange = () => {
  // In local files, status is 0 upon success in Mozilla Firefox
  if (xhr.readyState === XMLHttpRequest.DONE) {
    let data = JSON.parse(xhr.responseText);
    // console.log(data);
    for (let i = 0; i < data.length; i++) {
      if (data[i].needDonation && data[i].status === "READYFORDONATION") {
        projects.push(data[i]);
        projectCard.innerHTML = projects
          .sort((a, b) => a.pledgeId.split("#")[1] - b.pledgeId.split("#")[1])
          .map((project) => {
            return `<div class="col-lg-4 col-md-6">
      <div class="card">
          <div class="card-body">
              <figure>
                  <img class="card-img-top img-fluid" id="project${i}" src="./images/p0.jpg" alt="Card image cap">
              </figure>
              <div class="card_inner_body">
                  <h4 class="card-title" id="project${i}1">${project.name}</h4>
                  <b><p class="card-text" id="project${i}2">ID: ${project.pledgeId}</p></b>
                  <p class="card-text" id="project${i}3">${project.description}</p>
                  <div class="d-flex justify-content-between raised_goal">
                      <p id="project${i}4">Raised: ${project.fundsReceived}</p>
                      <p><span id="project${i}5">Goal:$\ ${project.fundsRequired}</span></p>
                  </div>
                  <div class="d-flex justify-content-between donation align-items-center">
                  <a href="javascript:Money();"  class="primary_btn donate_btn"  data-id="${project.pledgeId}">donate</a>
                      <p><span class="lnr lnr-heart"></span> 55 Donors</p>
                  </div>

              </div>
          </div>
      </div>
  </div>`;
          })
          .join("");
      }
    }
    console.log(projects);
  }
};
xhr.send();
// document.querySelectorAll(".donate_btn").forEach((btn) => {
//   btn.addEventListener("click", handleDonateBtn);
// });
function addIdToLocalStorage() {
  document.querySelectorAll(".donate_btn").forEach((btn) => {
    btn.addEventListener("click", handleDonateBtn);
  });
  function handleDonateBtn(e) {
    const btnID = e.target.getAttribute("data-id");
    localStorage.setItem("donateId", btnID);
  }
}
document.addEventListener("DOMContentLoaded", addIdToLocalStorage);
