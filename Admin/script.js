// (async () => {
//   const rawResponse = await fetch("http://localhost:3000/api/Charity", {
//     method: "POST",
//     headers: {
//       Accept: "application/json",
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify({
//       $class: "org.block.track.net.Charity",
//       CharityId: "777",
//       projectPledge: [],
//     }),
//   });
//   const content = await rawResponse.json();

//   console.log(content);
// })();
const form = document.querySelector(".charity-form");
const idInput = document.querySelector("#id");
form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const id = idInput.value;
  const rawResponse = await fetch("http://localhost:3000/api/Charity", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      $class: "org.block.track.net.Charity",
      CharityId: id,
      projectPledge: [],
    }),
  });
  const content = await rawResponse.json();
  console.log(content);
});

const pledgeForm = document.querySelector(".pledge-form");
const pledgeIdInput = document.querySelector("#pledgeId");
const charityNameInput = document.querySelector("#charityName");
const descriptionInput = document.querySelector("#description");
const fundsRequiredInput = document.querySelector("#fundsRequired");
const charityIdInput = document.querySelector("#charityId");

pledgeForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const pledgeId = pledgeIdInput.value;
  const charityName = charityNameInput.value;
  const description = descriptionInput.value;
  const fundsRequired = fundsRequiredInput.value;
  const charityId = charityIdInput.value;

  const rawResponse = await fetch(
    "http://localhost:3000/api/CreateProjectPledge",
    {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        $class: "org.block.track.net.CreateProjectPledge",
        pledgeId: pledgeId,
        name: charityName,
        decription: description,
        fundsRequired: fundsRequired,
        Charity: `resource:org.block.track.net.Charity#${charityId}`,
        transactionId: "",
        timestamp: "2022-06-19T14:23:26.083Z",
      }),
    }
  );
  const response = await rawResponse.json();

  console.log(response);
});
