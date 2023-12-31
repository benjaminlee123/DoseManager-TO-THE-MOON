document.addEventListener("deviceready", editAppts);

function editAppts() {

  var profilesCollection = firestore.collection("Profiles");
  function getParametersFromURL() {
    var urlParams = new URLSearchParams(window.location.search);
    var profile = {};
    profile.id = urlParams.get("id");
    profile.pic = urlParams.get("pic");

    var apptId = urlParams.get("apptId");
    return { profile, apptId };
  }

  var { profile, apptId } = getParametersFromURL();

  console.log("profId:", profile.id);
  console.log("apptId:", apptId);

  const mainCollectionDocID = profile.id;
  const mainCollectionRef = firestore
    .collection("Profiles")
    .doc(mainCollectionDocID);
  const subcollectionName = "Appointments";
  const subcollectionRef = mainCollectionRef
    .collection(subcollectionName)
    .doc(apptId);

  var apptLocationInput = document.getElementById("editApptLocation");
  var apptDateTimeInput = document.getElementById("editApptDateTime");
  var docNameInput = document.getElementById("editDocName");
  var updateButton = document.getElementById("update-button");
  var deleteButton = document.getElementById("delete-button");
  var backButton = document.getElementById("back-button");

  subcollectionRef
    .get()
    .then(function (doc) {
      if (doc.exists) {
        var itemData = doc.data();
        apptLocationInput.value = itemData.apptLocation;
        apptDateTimeInput.value = itemData.apptDateTime;
        docNameInput.value = itemData.docName;
      } else {
        console.log("Item not found");
      }
    })
    .catch(function (error) {
      console.log("Error retrieving item: ", error);
    });

  var editForm = document.getElementById("editData");

  editForm.addEventListener("submit", function (event) {
    // Prevent the default form submission behavior
    event.preventDefault();
  });

  updateButton.addEventListener("click", function () {
     // Validate input fields to prevent empty submission
 if (apptLocationInput.value.trim() === '' || apptDateTimeInput.value.trim() === '' || docNameInput.value.trim() === '') {
  alert("Please fill out all fields.");
  return;
}
    var newApptLocation = apptLocationInput.value;
    var newApptDateTime = apptDateTimeInput.value;
    var newDocName = docNameInput.value;

    subcollectionRef
      .update({
        apptLocation: newApptLocation,
        apptDateTime: newApptDateTime,
        docName: newDocName,
      })

      .then(function () {
        console.log("Item Updated Successfully");
        window.location.href = `upcomingappt.html?id=${profile.id}&pic=${profile.pic}`;
      })
      .catch(function (error) {
        console.log("Error updating item:", error);
      });
  });

  deleteButton.addEventListener("click", function () {
    if (confirm("Are you sure you want to delete this appointment?")) {
      // Delete the document from Firestore
      subcollectionRef
        .delete()
        .then(function () {
          console.log("Item deleted successfully");
          window.location.href = `upcomingappt.html?id=${profile.id}&pic=${profile.pic}`;
        })
        .catch(function (error) {
          console.log("Error deleting item:", error);
        });
    }
  });

  backButton.addEventListener("click", function () {
    window.location.href = `upcomingappt.html?id=${profile.id}&pic=${profile.pic}`;
  });
}
function googleTranslateElementInit() {
  new google.translate.TranslateElement(
    { pageLanguage: "en" },
    "google_translate_element"
  );
}