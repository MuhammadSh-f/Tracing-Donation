"use strict";
/**
 * Write your transction processor functions here
 */
const NS = "org.block.money.net";
const factory = getFactory();
/**
 * createProjectPledge
 * @param {org.block.money.net.CreateProjectPledge} createProjectPledge
 * @transaction
 */
function createProjectPledge(txParams) {
  if (!txParams.name || (txParams.name && txParams.name === "")) {
    throw new Error("Invalid Pledge Name!!");
  }
  if (!txParams.CharityId) {
    throw new Error("Charity!!");
  }
  let pledge = null;
  return getAssetRegistry(`${NS}.ProjectPledge`)
    .then((registry) => {
      pledge = factory.newResource(NS, "ProjectPledge", txParams.pledgeId);
      pledge.name = txParams.name;
      pledge.description = txParams.description;
      pledge.needDonation = true;
      pledge.fundsRequired = txParams.fundsRequired;
      pledge.fundsReceived = 0;
      pledge.status = "INITIALSTATE";
      pledge.CharityId = txParams.CharityId;
      pledge.sendMoney = [];
      return registry.add(pledge);
    })
    .then(() => getParticipantRegistry(`${NS}.CharityOrganization`))
    .then((CharityRegistry) => {
      // save the buyer
      txParams.CharityId.projectPledge.push(pledge);
      return CharityRegistry.update(txParams.CharityId);
    });
}
/**
 * SendPledgeToGovernement
 * @param {org.block.money.net.SendPledgeToGovernement} SendPledgeToGovernement
 * @transaction
 */
function sendPledgeToGovernement(txParams) {
  if (!txParams.goverID || !txParams.pledgeId) {
    throw new Error("Invalid input parameters!!");
  }
  if (txParams.pledgeId.status !== "INITIALSTATE") {
    throw new Error("Project already reviewed!");
  }
  txParams.pledgeId.status = "GOVERNMENTREVIEW";
  return getAssetRegistry(`${NS}.ProjectPledge`)
    .then((registry) => registry.update(txParams.pledgeId))
    .then(() => getParticipantRegistry(`${NS}.Governement`))
    .then((Governmentregistry) => {
      txParams.goverID.projectPledge.push(txParams.pledgeId);
      return Governmentregistry.update(txParams.goverID);
    });
}
/**
 * ApprovePledgeFromGovernement
 * @param {org.block.money.net.ApprovePledgeFromGovernement} ApprovePledgeFromGovernement
 * @transaction
 */
function ApprovePledgeFromGovernement(txParams) {
  if (!txParams.goverID || !txParams.pledgeId) {
    throw new Error("Invalid input parameters!!");
  }
  if (txParams.pledgeId.status === "READYFORDONATION") {
    throw new Error("The Project is already approved for donation");
  }
  if (txParams.pledgeId.status !== "GOVERNMENTREVIEW") {
    throw new Error("Project needs to review first");
  }

  txParams.pledgeId.status = "READYFORDONATION";
  return getAssetRegistry(`${NS}.ProjectPledge`)
    .then((registry) => registry.update(txParams.pledgeId))
    .then(() => getParticipantRegistry(`${NS}.Governement`))
    .then((Governmentregistry) => {
      txParams.goverID.projectPledge.pop(txParams.pledgeId);
      return Governmentregistry.update(txParams.goverID);
    });
}
/**
 * CreateSendMoney
 * @param {org.block.money.net.CreateSendMoney} CreateSendMoney
 * @transaction
 */
function CreateSendMoney(txParams) {
  if (!txParams.MId || (txParams.MId && txParams.MId === "")) {
    throw new Error("Invalid MId!!");
  }
  if (!txParams.donerId) {
    throw new Error("!Doner!");
  }
  if (!txParams.pledgeId) {
    throw new Error("!Project!");
  }
  if (txParams.pledgeId.status !== "READYFORDONATION") {
    throw new Error("Project is under reveiwe");
  }
  if (!txParams.pledgeId.needDonation) {
    throw new Error("Project does not need more donation");
  }
  let sendmoney = null;
  return getAssetRegistry(`${NS}.SendMoney`)
    .then((registry) => {
      sendmoney = factory.newResource(NS, "SendMoney", txParams.MId);
      sendmoney.Amount = txParams.Amount;
      sendmoney.donerId = txParams.donerId;
      sendmoney.pledgeId = txParams.pledgeId;
      return registry.add(sendmoney);
    })
    .then(() => getAssetRegistry(`${NS}.ProjectPledge`))
    .then((PledgeRegistry) => {
      txParams.pledgeId.fundsReceived += txParams.Amount;
      txParams.pledgeId.sendMoney.push(sendmoney);
      if (txParams.pledgeId.fundsReceived >= txParams.pledgeId.fundsRequired) {
        txParams.pledgeId.needDonation = false;
        txParams.pledgeId.status = "COMPLETED";
      }
      return PledgeRegistry.update(txParams.pledgeId);
    })
    .then(() => getParticipantRegistry(`${NS}.Doner`))
    .then((DonerRegistry) => {
      txParams.donerId.sendMoney.push(sendmoney);
      txParams.donerId.projectPledge.push(txParams.pledgeId);
      return DonerRegistry.update(txParams.donerId);
    });
}
