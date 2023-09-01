//checks for cordova deviceready before calling functions
document.addEventListener("deviceready", addMeds);

//function to add medicine into DB
function addMeds() {
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
  var medsCollection = firestore.collection("Medicine");

  //getting reference for form element
  var form = document.getElementById("formData");

  form.addEventListener("submit", function (event) {
    // Prevent the default form submission behavior
    event.preventDefault();

    //Get the values of the input fields by their IDs
    var medNameInput = document.getElementById("medName");
    var medDescInput = document.getElementById("medDesc");

    //Retrieve the values from the input fields
    var medName = medNameInput.value;
    var medDesc = medDescInput.value;

    //object to store details of med
    var newMeds = {
      name: medName,
      description: medDesc,
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
    };

    // Add medicine to Firestore collection
    medsCollection
      .add(newMeds)
      .then((docRef) => {
        console.log("Profile added with ID: ", docRef.id);
      })
      .then(() => {
        //navigate to home.html after submit button pressed
        window.location.href = "home.html";
      })
      .catch((error) => {
        console.error("Error adding profile: ", error);
      });
  });
}

function keyPress() {
  //getting reference to input box
  var dataList = document.getElementById("medList");

  //search term
  var input = medName.value;

  //calling api function
  fetchAutocompleteResults(input).then((data) => {
    if (data) {
      //result array
      var medResult = data[1];

      //add each value as suggestions to input boxs
      medResult.forEach((medicine) => {
        const option = document.createElement("option");
        option.value = medicine;
        dataList.appendChild(option);
      });
    }
  });
}

//api call to NLM database
async function fetchAutocompleteResults(searchTerm) {
  const apiUrl = `https://clinicaltables.nlm.nih.gov/api/rxterms/v3/search?terms=${encodeURIComponent(
    searchTerm
  )}`;

  try {
    const response = await fetch(apiUrl);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching autocomplete results:", error);
    return null;
  }
}