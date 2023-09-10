document.addEventListener("deviceready", displayData);

function displayData() {
  //getting reference for div id
  var apptList = document.getElementById("appt-list");
  var upcomingAppts = 0;
  var missedAppts = 0;

  // Clear previous content
  apptList.innerHTML = "";

  //firebase config
  const firebaseConfig = {
    apiKey: "AIzaSyAt4SUmSwvkHdas68AYQdjOe7fkfL547gQ",
    authDomain: "dosemanager-d0236.firebaseapp.com",
    projectId: "dosemanager-d0236",
    storageBucket: "dosemanager-d0236.appspot.com",
    messagingSenderId: "373646054095",
    appId: "1:373646054095:web:89660fa48e041a7d231dba",
    measurementId: "G-XDL965JQ9H",
  };

  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  var firestore = firebase.firestore();
  //var apptsCollection = firestore.collection("Appointments");

  function getProfileIdFromURL() {
    var urlParams = new URLSearchParams(window.location.search);
    var params = {};
    params.id = urlParams.get("id");
    params.pic = urlParams.get("pic");
    return params;
  }

  profile = getProfileIdFromURL();
  var addApptsButton = document.getElementById("addApptBtn");
  var medicationFooterButton = document.getElementById("medication-footer");
  var appointmentFooterButton = document.getElementById("appointment-footer");
  var profileFooterButton = document.getElementById("profile-footer");

  addApptsButton.addEventListener("click", handleAddApptsButtonClick);
  medicationFooterButton.addEventListener("click", handleMedFooterButtonClick);
  appointmentFooterButton.addEventListener(
    "click",
    handleApptFooterButtonClick
  );
  profileFooterButton.addEventListener("click", handleProfileFooterButtonClick);

  function handleAddApptsButtonClick() {
    var profile = getProfileIdFromURL();
    console.log(profile);
    window.location.href = `addNewAppt.html?id=${profile.id}&pic=${profile.pic}`;
  }

  function handleMedFooterButtonClick() {
    var profile = getProfileIdFromURL();
    console.log(profile);
    window.location.href = `home.html?id=${profile.id}&pic=${profile.pic}`;
  }

  function handleApptFooterButtonClick() {
    var profile = getProfileIdFromURL();
    console.log(profile);
    window.location.href = `upcomingappt.html?id=${profile.id}&pic=${profile.pic}`;
  }

  function handleProfileFooterButtonClick() {
    var profile = getProfileIdFromURL();
    console.log(profile);
    window.location.href = `profile.html?id=${profile.id}&pic=${profile.pic}`;
  }

  var mainProfileId = profile.id;
  var mainProfileRef = firestore.collection("Profiles").doc(mainProfileId);
  var subCollectionRef = mainProfileRef.collection("Appointments");

  //retrieving data from firebase by timestamp
  //orderBy("apptDateTime") ensures the data is displaying the earliest appt first
  subCollectionRef
    .orderBy("apptDateTime")
    .get()
    .then(function (querySnapshot) {
      querySnapshot.forEach(function (subDoc) {
        var subDocData = subDoc.data();
        var apptDateTime = subDocData.apptDateTime;
        var currentDateTime = new Date().toJSON();
        var id = subDoc.id;
        var formattedDate = formatDate(apptDateTime);

        console.log(id);
        if (apptDateTime > currentDateTime) {
          //populating html page with each appointment card details
          var apptCard = `
        <div id = "upcomingAppt" class="card mt-4 rounded-5">
            <div class="card-body">
                <h5 class="card-title">${subDocData.apptLocation}</h5>
                <p id="apptDateTime" class="card-text">${formattedDate}</p>
                <p id="docName" class="card-text">${subDocData.docName}</p>
                <p id="upcomingApptStat" class="rounded">Appointment Status: Upcoming</p>  
            </div>
        </div>
        <br>
        <div>
          <button class="edit-button btn btn-primary" id="editButton" data-item-id="${subDoc.id}">Edit</button>
          <button class="delete-button btn btn-primary" id="deleteButton" data-item-id="${subDoc.id}">Delete</button>
        </div>
        `;
          //Add to the upcoming appointment counter to be displayed at the top of the page
          upcomingAppts++;
        } else if (apptDateTime < currentDateTime) {
          //populating html page with each appointment card details
          var apptCard = `
        <div id = "missedAppt" class="card mt-4 rounded-5">
            <div class="card-body">
                <h5 class="card-title" id="apptLocation">${subDocData.apptLocation}</h5>
                <p id="apptDateTime" class="card-text">${formattedDate}</p>
                <p id="docName" class="card-text">${subDocData.docName}</p>
                <p id="missedApptStat" class="rounded">Appointment Status: Missed</p>  
            </div>
        </div>
        <br>
        <div>
          <button class="delete-button btn btn-primary" id="deleteButton" data-item-id="${subDoc.id}">Delete</button>
          <!-- <button class="reschedule-button btn btn-primary" id="rescheduleButton" data-item-id="${subDoc.id}">Reschedule</button> -->
          </div>
        `;

          //Add to the missed appointment counter to be displayed at the top of the page
          missedAppts++;
        }

        apptList.innerHTML += apptCard;
        updateUpcomingApptsHtml(upcomingAppts);
        updateMissedApptsHtml(missedAppts);

        //delete buttons
        var deleteButton = document.getElementsByClassName("delete-button");

        Array.from(deleteButton).forEach(function (button) {
          button.addEventListener("click", handleDeleteButtonClick);
        });

        function handleDeleteButtonClick(event) {
          var itemId = event.target.getAttribute("data-item-id");
          if (itemId) {
            if (confirm("Are you sure you want to delete this appointment?")) {
              // Delete the document from Firestore
              subCollectionRef
                .doc(itemId)
                .delete()
                .then(function () {
                  console.log("Item deleted successfully");
                  window.location.href = `upcomingappt.html?id=${profile.id}&pic=${profile.pic}`;
                })
                .catch(function (error) {
                  console.log("Error deleting item:", error);
                });
            }
          }
        }

        //edit buttons
        var editButtons = document.getElementsByClassName("edit-button");
        Array.from(editButtons).forEach(function (button) {
          button.addEventListener("click", handleEditButtonClick);
        });

        function handleEditButtonClick(event) {
          var itemId = event.target.getAttribute("data-item-id");
          console.log(itemId);
          if (itemId) {
            window.location.href = `editAppt.html?id=${profile.id}&apptId=${itemId}&pic=${profile.pic}`;
          } else {
            console.log("Item ID not found in the button");
          }
        }
      });
    })
    .catch(function (error) {
      console.error("Error getting appointment documents: ", error);
    });

  function updateUpcomingApptsHtml(upcomingAppts) {
    var totalUpcomingAppts = document.getElementById("upcoming-appts");
    totalUpcomingAppts.textContent = upcomingAppts;
  }

  function updateMissedApptsHtml(missedAppts) {
    var totalMissedAppts = document.getElementById("missed-appts");
    totalMissedAppts.textContent = missedAppts;
  }

  function formatDate(inputDate) {
    const options = {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    return new Date(inputDate).toLocaleDateString("en-US", options);
  }
}
function googleTranslateElementInit() {
  new google.translate.TranslateElement(
    { pageLanguage: "en" },
    "google_translate_element"
  );
}
