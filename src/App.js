// import logo from './logo.svg';
import './App.css';
import AuthComponent from './AuthComponent';
import UserDetailsComponent from './UserDetailsComponent';
function App() {

  // Initialize an empty object to store the state of goals and initiatives
  let goalState = {};
  // Declare selectedGoal as a global variable
  let selectedGoal;


  // Function to save goalState to localStorage
  function saveData() {
    try {
      localStorage.setItem("goalState", JSON.stringify(goalState));
    } catch (e) {
      console.error("Failed to save data to localStorage:", e);
      // showModal("Failed to save data. Storage might be full.");
    }
  }
  // Function to clear saved data from localStorage
  function clearSavedData() {
    console.log("clearSavedData function called");
    localStorage.removeItem("goalState");
  }
  // Event listener for DOMContentLoaded
  document.addEventListener("DOMContentLoaded", function () {
    // Script to load saved parameter names from localStorage
    document.querySelectorAll("td").forEach((td, index) => {
      const savedName = localStorage.getItem(`paramName${index}`);
      if (savedName) {
        td.firstChild.textContent = savedName;
      }
    });
    // Function to load saved goalState from localStorage
    function loadData() {
      const savedGoalState = localStorage.getItem("goalState");
      if (savedGoalState) {
        goalState = JSON.parse(savedGoalState);
      } else {
        initializeGoalsAndInitiatives();
        console.log("Initialized goalState with default values:", goalState);
      }
      updateInitiativesDropdown();
      replotPoints();
    }
    // Function to display error messages
    function showError(message) {
      document.getElementById("error-message").textContent = message;
    }

    // DOM references
    const sliders = document.querySelectorAll(".slider");
    const goalDropdown = document.getElementById("goal");
    goalDropdown.setAttribute("multiple", "multiple");
    const initativeDropdown = document.getElementById("initiative");
    const graphContainer = document.getElementById("graphContainer");
    // Buttons for creating, deleting, and renaming initiatives
    const createInitiativeBtn = document.getElementById("createInitiative");
    const deleteInitiativeBtn = document.getElementById("deleteInitiative");
    const renameInitiativeBtn = document.getElementById("renameInitiative");
    const createGoalBtn = document.getElementById("createGoal");
    const deleteGoalBtn = document.getElementById("deleteGoal");
    const editGoalBtn = document.getElementById("editGoal");

    // event listeners for goals
    createInitiativeBtn.addEventListener("click", createInitiative);
    deleteInitiativeBtn.addEventListener("click", deleteInitiative);
    renameInitiativeBtn.addEventListener("click", renameInitiative);

    createGoalBtn.addEventListener("click", createGoal);
    deleteGoalBtn.addEventListener("click", deleteGoal);
    editGoalBtn.addEventListener("click", editGoal);

    function createGoal() {
      // Ask the user for the name of the new goal
      const goalName = prompt("Please enter the name of the new goal");
      if (!goalName) {
        showModal("A goal must have a name");
        return;
      }

      // Check if the goal already exists
      if (goalState[goalName]) {
        showModal(
          `The goal "${goalName}" already exists. Please choose a different name.`
        );
        return;
      }

      // Create a new goal in the goalState object
      goalState[goalName] = {
        color: goalColors[goalName] || "#000000", // Default to black if color is not set
        initiatives: {},
      };

      // Add the new goal to the goal dropdown
      const option = document.createElement("option");
      option.value = goalName;
      option.textContent = goalName;
      goalDropdown.appendChild(option);

      // Save the data after creating the goal
      saveData();
    }

    function deleteGoal() {
      const selectedGoal = goalDropdown.value;

      // Confirm with the user before deleting
      const isConfirmed = window.confirm("Are you sure you want to delete this goal?");
      if (!isConfirmed) {
        showModal("Goal deletion cancelled.");
        return;
      }

      // Delete the goal from the goalState object
      delete goalState[selectedGoal];

      // Remove the goal from the goal dropdown
      const goalOption = Array.from(goalDropdown.options).find(
        (option) => option.value === selectedGoal
      );
      if (goalOption) {
        goalDropdown.removeChild(goalOption);
      }

      showModal("Goal deleted successfully");
      saveData();
    }


    function editGoal() {
      const selectedGoal = goalDropdown.value;

      // Ask the user for the new name
      const newName = prompt(
        `Rename the goal "${selectedGoal}". Please enter the new name:`
      );

      if (!newName || newName.trim() === "") {
        showModal("Invalid name provided. Renaming cancelled.");
        return;
      }

      if (goalState[newName]) {
        showModal(
          "A goal with this name already exists. Please choose a different name."
        );
        return;
      }

      // Rename the goal in the goalState object
      goalState[newName] = goalState[selectedGoal];
      delete goalState[selectedGoal];

      // Update the goal in the goal dropdown
      const goalOption = Array.from(goalDropdown.options).find(
        (option) => option.value === selectedGoal
      );
      if (goalOption) {
        goalOption.value = newName;
        goalOption.textContent = newName;
      }

      showModal("Goal renamed successfully!");
      saveData();
    }

    function showModal(message) {
      alert(message);
    }

    function createInitiative() {
      const selectedGoals = Array.from(goalDropdown.selectedOptions).map(
        (opt) => opt.value
      );

      // Check if at least one goal is selected
      if (selectedGoals.length === 0) {
        showModal("Please select at least one goal first!");
        return;
      }

      // Ask the user for the name
      const initiativeName = prompt(
        "Please enter the name of the new initiative"
      );
      if (!initiativeName) {
        showModal("An initiative must have a name");
        return;
      }

      selectedGoals.forEach((selectedGoal) => {
        if (!goalState[selectedGoal]) {
          // Unique color
          const goalColor = goalColors[selectedGoal] || "#000000"; // Default to white if color is not set
          goalState[selectedGoal] = { color: goalColor, initiatives: {} };
        }

        // Check if name is already existing
        if (goalState[selectedGoal].initiatives[initiativeName]) {
          showModal(
            `The name "${initiativeName}" already exists under the selected goal(s). Please choose a different name.`
          );
          return;
        }

        // Add the new initiative to the goalState object
        goalState[selectedGoal].initiatives[initiativeName] = {
          color: goalState[selectedGoal].color, // Use the color from the corresponding goal
          x: null,
          y: null,
        };
      });

      // Add the new initiative to the initiatives dropdown
      const option = document.createElement("option");
      option.value = initiativeName;
      option.textContent = initiativeName;
      initativeDropdown.appendChild(option);

      // Optionally, reset the sliders
      sliders.forEach((slider) => {
        slider.value = slider.min;
      });

      // Save the data after creating the initiative
      saveData();
    }

    function deleteInitiative() {
      const selectedGoal = goalDropdown.value;
      const selectedInitiative = initativeDropdown.value;

      if (
        !goalState[selectedGoal] ||
        !goalState[selectedGoal].initiatives[selectedInitiative]
      ) {
        showModal("יש לבחור יוזמה למחיקה");
        return;
      }

      // Confirm with the user before deleting
      const isConfirmed = window.confirm("האם אתם בטוחים שאתם רוצים למחוק?");
      if (!isConfirmed) {
        showModal("Initiative deletion cancelled.");
        return;
      }

      // Delete the initiative from the goalState object
      delete goalState[selectedGoal].initiatives[selectedInitiative];

      // Remove the initiative from the initiatives dropdown
      const initiativeOption = Array.from(initativeDropdown.options).find(
        (option) => option.value === selectedInitiative
      );
      if (initiativeOption) {
        initativeDropdown.removeChild(initiativeOption);
      }

      // Clear the graph point for this initiative
      const existingPoint = document.getElementById(
        `point-${selectedInitiative}`
      );
      if (existingPoint) {
        graphContainer.removeChild(existingPoint);
      }

      showModal("היוזמה נמחקה בהצלחה");
      saveData();
    }


    function renameInitiative() {
      const selectedGoal = goalDropdown.value;
      const selectedInitiative = initativeDropdown.value;

      if (
        !goalState[selectedGoal] ||
        !goalState[selectedGoal].initiatives[selectedInitiative]
      ) {
        showModal("Please select a valid initiative to rename!");
        return;
      }

      // Ask the user for the new name
      const newName = prompt(
        `Rename the initiative "${selectedInitiative}". Please enter the new name:`
      );

      if (!newName || newName.trim() === "") {
        alert("Invalid name provided. Renaming cancelled.");
        return;
      }

      if (goalState[selectedGoal][newName]) {
        alert(
          "An initiative with this name already exists. Please choose a different name."
        );
        return;
      }

      // Rename the initiative in the goalState object
      goalState[selectedGoal].initiatives[newName] =
        goalState[selectedGoal].initiatives[selectedInitiative];
      delete goalState[selectedGoal].initiatives[selectedInitiative];

      // Update the initiative in the initiatives dropdown
      const initiativeOption = Array.from(initativeDropdown.options).find(
        (option) => option.value === selectedInitiative
      );
      if (initiativeOption) {
        initiativeOption.value = newName;
        initiativeOption.textContent = newName; // Set the displayed text to the new name
      }

      // Update the graph point id for this initiative
      const existingPoint = document.getElementById(
        `point-${selectedInitiative}`
      );
      if (existingPoint) {
        existingPoint.id = `point-${newName}`;
      }

      alert("Initiative renamed successfully!");

      saveData();
    }

    // Event listeners for goal and initiative dropdowns
    goalDropdown.addEventListener("change", updateInitiativesDropdown);
    initativeDropdown.addEventListener("change", updateSliders);

    // Event listeners for sliders
    sliders.forEach((slider) => {
      slider.addEventListener("input", plotPoint);
    });

    const goalColors = {
      goal1: "#FF0000", // Red
      goal2: "#00FF00", // Green
      goal3: "#0000FF", // Blue
      goal4: "#FFFF00", // Yellow
      goal5: "#FF00FF", // Magenta
      goal6: "#00FFFF", // Cyan
      goal7: "#C0C0C0", // Silver
    };

    // Initialize the goal dropdown
    initializeGoalsAndInitiatives();
    updateGoalDropdownWithColors();
    updateInitiativesDropdown();

    function handleRegistration(event) {
      event.preventDefault();
    }

    function handleLogin(event) {
      event.preventDefault();
    }

    function updateGoalDropdownWithColors() {
      const goalDropdown = document.getElementById("goal");
      const goals = Array.from(goalDropdown.options);

      goals.forEach((optionElement, index) => {
        const goal = optionElement.value;
        const color = goalState[goal] ? goalState[goal].color : "#FFFFFF"; // Default to white if color is not set

        // Create a color box element
        const colorBox = document.createElement("span");
        colorBox.style.backgroundColor = color;
        colorBox.style.width = "20px";
        colorBox.style.height = "20px";
        colorBox.style.display = "inline-block";
        colorBox.style.borderRadius = "100%";
        colorBox.style.marginLeft = "10px";

        // Append the color box to the option element
        optionElement.innerHTML = `${optionElement.text}<span>${colorBox.outerHTML}</span>`;
      });
    }

    function initializeGoalsAndInitiatives() {
      const goals = Array.from(goalDropdown.options).map((opt) => opt.value);
      let goalInitiativeList = [
        {
          goal: "goal1",
          initiatives: ["E.N.Data", "סרט דוקו לחשיפת המחקר ", "מדד פל״א רשותי"],
        },
        {
          goal: "goal2",
          initiatives: ["Jobeek – job week"],
        },
        {
          goal: "goal3",
          initiatives: ["MamaWork"],
        },
        {
          goal: "goal4",
          initiatives: ["מתכלל תעסוקה ", "מש״א יחד נגב", "תתחברי"],
        },
        {
          goal: "goal5",
          initiatives: ["עצמאיות בחורה", "הצלחתך, הצלחתי"],
        },
        {
          goal: "goal6",
          initiatives: ["חוגי עברית "],
        },
        {
          goal: "goal7",
          initiatives: [
            "הדבר הבא: מורשת דימונה",
            "הסעה ליעד הבא ",
            "מורתי / معلمي ",
          ],
        },
      ];

      goals.forEach((goal) => {
        if (!goalState[goal]) {
          // Unique color for each goal:
          const goalColor = goalColors[goal] || "#000000"; // Default to black if color is not set
          goalState[goal] = { color: goalColor, initiatives: {} };

          // Find the matching goal in the goalInitiativeList
          const matchingGoal = goalInitiativeList.find((g) => g.goal === goal);
          if (matchingGoal) {
            matchingGoal.initiatives.forEach((initiativeName) => {
              if (!goalState[goal].initiatives[initiativeName]) {
                // Check if the initiative already exists before creating it
                goalState[goal].initiatives[initiativeName] = {
                  color: goalColor,
                  x: null,
                  y: null,
                };
              }
            });
          }
        }
      });
    }

    function updateInitiativesDropdown() {
      const selectedGoals = Array.from(goalDropdown.selectedOptions).map(
        (opt) => opt.value
      );
      let initiatives = [];

      selectedGoals.forEach((selectedGoal) => {
        initiatives.push(
          ...Object.keys(goalState[selectedGoal]?.initiatives || {})
        );
      });

      // Remove duplicates
      const uniqueInitiatives = [...new Set(initiatives)];

      // Clear the initiatives dropdown
      initativeDropdown.innerHTML = "";

      // Populate the dropdown with initiatives for the selected goals
      uniqueInitiatives.forEach((initiative) => {
        const option = document.createElement("option");
        option.value = initiative;
        option.textContent = initiative;
        initativeDropdown.appendChild(option);
      });

      // Clear all points from the graph
      clearGraph();

      // Re-plot the points for the selected goals' initiatives
      selectedGoals.forEach((selectedGoal) => {
        const goalInitiatives = Object.keys(
          goalState[selectedGoal]?.initiatives || {}
        );
        goalInitiatives.forEach((initiative) => {
          if (
            goalState[selectedGoal].initiatives &&
            goalState[selectedGoal].initiatives[initiative] &&
            goalState[selectedGoal].initiatives[initiative].x !== null &&
            goalState[selectedGoal].initiatives[initiative].y !== null
          ) {
            plotStoredPoint(
              initiative,
              goalState[selectedGoal].initiatives[initiative].x,
              goalState[selectedGoal].initiatives[initiative].y,
              goalState[selectedGoal].initiatives[initiative].color,
              selectedGoal // Pass the current goal here
            );
          }
        });
      });
    }

    function replotPoints() {
      const goals = Array.from(goalDropdown.selectedOptions).map(
        (opt) => opt.value
      );
      console.log("Replotting points for goals:", goals);
      clearGraph();
      goals.forEach((goal) => {
        const initiatives = Object.keys(goalState[goal]?.initiatives || {});
        initiatives.forEach((initiative) => {
          const initiativeData = goalState[goal]?.initiatives[initiative];
          if (
            initiativeData &&
            initiativeData.x !== null &&
            initiativeData.y !== null
          ) {
            plotStoredPoint(
              initiative,
              initiativeData.x,
              initiativeData.y,
              initiativeData.color,
              goal // Pass the current goal here
            );
          }
        });
      });
    }

    function clearGraph() {
      const points = document.querySelectorAll("#graphContainer > div");
      points.forEach((point) => {
        graphContainer.removeChild(point);
      });
    }
    // Existing function to plot points
    function plotStoredPoint(initiative, x, y, color, currentGoal) {
      if (
        !goalState[currentGoal] ||
        !goalState[currentGoal].initiatives ||
        !goalState[currentGoal].initiatives[initiative]
      ) {
        console.error("No data for the current goal:", currentGoal);
        return;
      }

      // Get the initiative data using the currentGoal parameter
      const initiativeData = goalState[currentGoal].initiatives[initiative];

      // Create a new div element to represent the point
      const point = document.createElement("div");
      point.id = `point-${initiative}`;
      point.style.width = "15px";
      point.style.height = "15px";
      point.style.backgroundColor = goalState[currentGoal].color; // Use the color assigned to the current goal
      point.style.borderRadius = "50%";
      point.style.position = "absolute";
      point.style.transform = "translate(-50%, -50%)"; // This centers the dot on the exact coordinates

      // Calculate the adjusted x and y values based on the graph container dimensions
      const adjustedX = (graphContainer.clientWidth - 10) * (x / 50);
      const adjustedY = (graphContainer.clientHeight - 10) * (1 - y / 50); // Subtracting from 1 to invert the Y-axis

      // Set the left and top style properties to position the point based on the adjusted x and y values
      point.style.left = `${adjustedX}px`;
      point.style.top = `${adjustedY}px`;

      // Create a new div element to display the initiative name below the point
      const text = document.createElement("div");
      text.textContent = initiative;
      text.style.position = "absolute";
      text.style.transform = "translate(-50%, -50%)";
      text.style.left = "50%";
      text.style.bottom = "-20px";
      text.style.fontSize = "18px"; // Increase this value to make the text larger
      text.style.color = "#000";

      // Append the text element as a child of the point element
      point.appendChild(text);

      // Append the point element as a child of the graph container
      graphContainer.appendChild(point);
    }

    // plotting points on the graph based on the selected goal and initiative.
    function plotPoint() {
      const selectedGoal = goalDropdown.value;
      const selectedInitiative = initativeDropdown.value;

      // Ensure the selected goal exists in the goalState object
      if (!goalState[selectedGoal]) {
        console.error(`Goal "${selectedGoal}" does not exist in the goalState.`);
        return;
      }

      // Ensure the selected initiative exists under the selected goal in the goalState object
      if (
        !goalState[selectedGoal].initiatives ||
        !goalState[selectedGoal].initiatives[selectedInitiative]
      ) {
        console.error(
          `Initiative "${selectedInitiative}" does not exist under the goal "${selectedGoal}" in the goalState.`
        );
        return;
      }

      // Get the stored configurations for the selected initiative
      const initiativeData =
        goalState[selectedGoal].initiatives[selectedInitiative];

      let x = 0,
        y = 0;

      sliders.forEach((slider) => {
        let sliderValue = parseInt(slider.value);
        if (
          slider.id === "param2" ||
          slider.id === "param4"
        ) {
          sliderValue = 100 - sliderValue;
        }

        if (
          slider.id.includes("param1") ||
          slider.id.includes("param2") ||
          slider.id.includes("param3") ||
          slider.id.includes("param4") ||
          slider.id.includes("param5")
        ) {
          x += sliderValue;
        } else if (
          slider.id.includes("param6") ||
          slider.id.includes("param7") ||
          slider.id.includes("param8") ||
          slider.id.includes("param9") ||
          slider.id.includes("param10")
        ) {
          y += sliderValue;
        }
      });

      x /= 10;
      y /= 10;

      const existingPoint = document.getElementById(
        `point-${selectedInitiative}`
      );
      if (existingPoint) {
        graphContainer.removeChild(existingPoint);
      }

      plotStoredPoint(
        selectedInitiative,
        x,
        y,
        goalState[selectedGoal].color,
        selectedGoal
      );

      document.getElementById("xValueDisplay").textContent = x.toFixed(0);
      document.getElementById("yValueDisplay").textContent = y.toFixed(0);

      const sum = x + y;
      const meanX = x / 5
      const meanY = y / 5


      document.getElementById("sum").textContent = sum.toFixed(0);
      document.getElementById("meanX").textContent = meanX.toFixed(0);
      document.getElementById("meanY").textContent = meanY.toFixed(0);

      goalState[selectedGoal].initiatives[selectedInitiative].x = x;
      goalState[selectedGoal].initiatives[selectedInitiative].y = y;

      // Save the current slider values to the initialConfig property
      goalState[selectedGoal].initiatives[selectedInitiative].initialConfig = {
        sliders: Array.from(sliders).map((slider) => slider.value),
      };

      saveData();
    }

    function updateSliders() {
      const selectedGoal = goalDropdown.value;
      const selectedInitiative = initativeDropdown.value;

      // Check if the selected goal and initiative exist in the goalState object
      if (
        goalState[selectedGoal] &&
        goalState[selectedGoal].initiatives &&
        goalState[selectedGoal].initiatives[selectedInitiative]
      ) {
        // Get the stored configurations for the selected initiative
        const initiativeData = goalState[selectedGoal].initiatives[selectedInitiative];

        // If the initiative has been set before (has x and y values), set the sliders accordingly
        if (initiativeData.x !== null && initiativeData.y !== null) {
          sliders.forEach((slider, index) => {
            slider.value = initiativeData.initialConfig ? initiativeData.initialConfig.sliders[index] : 5;
          });
        } else {
          // If the initiative hasn't been set before, set all sliders to 5
          sliders.forEach((slider) => {
            slider.value = 5;
          });
          // Trigger the plotPoint function to set the dot in the middle of the graph
          plotPoint();
        }
      } else {
        // If the initiative doesn't exist, set all sliders to 5
        sliders.forEach((slider) => {
          slider.value = 5;
        });
      }
    }





    // Get the dropdown element
    const initiativeDropdown = document.getElementById("initiative");

    // Get the span element where the current initiative will be displayed
    const currentInitiativeSpan = document.getElementById("currentInitiative");

    // Function to update the current initiative
    function updateCurrentInitiative() {
      const selectedOption = initiativeDropdown.options[initiativeDropdown.selectedIndex].text;
      currentInitiativeSpan.textContent = "יוזמה: " + selectedOption;
    }

    // Update the current initiative when the page loads
    updateCurrentInitiative();

    // Add an event listener to the dropdown
    initiativeDropdown.addEventListener("change", updateCurrentInitiative);



    // Function to load saved parameter names from localStorage
    function loadSavedParameterNames() {
      document.querySelectorAll(".rename-target").forEach((spanElement) => {
        const paramId = spanElement.closest("tr").querySelector(".slider").id;
        const savedName = localStorage.getItem(paramId);
        if (savedName) {
          spanElement.textContent = savedName;
        }
      });
    }

    // Load saved parameter names when the page loads
    window.addEventListener("DOMContentLoaded", loadSavedParameterNames);

    // Edit the names of the parameters
    document.querySelectorAll(".edit-icon").forEach((icon) => {
      icon.addEventListener("click", (e) => {
        const parentElement = e.target.closest("td");
        if (parentElement) {
          const spanElement = parentElement.querySelector(".rename-target");
          const paramId = parentElement.closest("tr").querySelector(".slider").id;
          const newName = prompt(
            "Enter a new name:",
            spanElement.textContent.trim()
          );
          if (newName && newName.length <= 60) {
            spanElement.textContent = newName;
            // Save the new name to localStorage
            localStorage.setItem(paramId, newName);
          }
        } else {
          console.error("No parent element with the specified class found");
        }
      });
    });

    //----------------------------------------------------------------
    loadData();
  
  });



  return (
    <div className="App">

      <div>
        <h3>users:</h3>
        {/* <AuthComponent /> */}
        <UserDetailsComponent/>
      </div>
      <div className='container'>
        <div className='left'>

          <div className='black-background'>
            <h2> בחירת מטרה</h2>
            <select id='goal'>
              <option value="goal1"> חשיפה ומודעות למחקר ונתוני התעסוקה</option>
              <option value="goal2"> חשיפה להזדמנויות, תנאי העסקה ומצב השוק</option>
              <option value="goal3"> התפתחות והתקדמות מקצועית לצד האמהות</option>
              <option value="goal4"> רשת אזורית לקידום ופיתוח מקצועי לתעסוקה איכותית</option>
              <option value="goal5"> סביבה תומכת, מעודדת ונותנת השראה והשפעה בדרך לתעסוקה איכותית</option>
              <option value="goal6">צמצום פערי השפה בחברה הבדואית לטובת קידום תעסוקת נשים</option>
              <option value="goal7"> ניעות תעסוקתית לאורך הקריירה בחייה של אישה</option>
            </select>
            <div>
              <button id='createGoal'>יצירת מטרה חדשה</button>
              <button id='deleteGoal'>מחיקת מטרה נוכחית</button>
              <button id='editGoal'>עריכת שם מטרה</button>
            </div>

            <h3>בחירת יוזמה</h3>
            <div>
              <button id='deleteInitiative'>מחיקת יוזמה</button>

              <button id="renameInitiative">עריכת יוזמה</button>

              <button id='createInitiative'>יצירת מטרה חדשה</button>

              <select id="initiative"></select>
            </div>

            <div className='green-background'>

              <div style={{ textAlign: 'right', display: 'flex', justifyContent: 'space-between' }}>
                <h4>ישימות נמוכה</h4>
                <h4>ישימות גבוהה</h4>
                <h2>מדדי ישימות</h2>
              </div>
              <table>
                <tbody>

                  {/* demo --> */}
                  <tr>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        <span>1</span>
                        <input type='range' min={1} max={100} className='slider' id="param1" list='tickmarks' style={{ flexGrow: 1, margin: '0 10px' }} />
                        <span>10</span>
                      </div>
                    </td>
                    <td>
                      <span className='rename-target'>מימון ומשאבים</span>
                      <span className="edit-icon">✏️</span>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        <span>1</span>
                        <input type='range' min={1} max={100} className='slider' id="param2" list='tickmarks' style={{ flexGrow: 1, margin: '0 10px' }} />
                        <span>10</span>
                      </div>
                    </td>
                    <td>
                      <span className='rename-target'>מורכבות וזמן עד הוצאה לפועל</span>
                      <span className="edit-icon">✏️</span>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        <span>1</span>
                        <input type='range' min={1} max={100} className='slider' id="param3" list='tickmarks' style={{ flexGrow: 1, margin: '0 10px' }} />
                        <span>10</span>
                      </div>
                    </td>
                    <td>
                      <span className='rename-target'>מידת מחויבות האונר והארגון</span>
                      <span className="edit-icon">✏️</span>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        <span>1</span>
                        <input type='range' min={1} max={100} className='slider' id="param4" list='tickmarks' style={{ flexGrow: 1, margin: '0 10px' }} />
                        <span>10</span>
                      </div>
                    </td>
                    <td>
                      <span className='rename-target'>מורכבות בירוקרטית וחוקתית</span>
                      <span className="edit-icon">✏️</span>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        <span>1</span>
                        <input type='range' min={1} max={100} className='slider' id="param5" list='tickmarks' style={{ flexGrow: 1, margin: '0 10px' }} />
                        <span>10</span>
                      </div>
                    </td>
                    <td>
                      <span className='rename-target'>מידת גיוס ורתימת שותפים</span>
                      <span className="edit-icon">✏️</span>
                    </td>
                  </tr>



                </tbody>
              </table>


              <datalist id='tickmarks'>
                <option value="10"></option>
                <option value="20"></option>
                <option value="30"></option>
                <option value="40"></option>
                <option value="50"></option>
                <option value="60"></option>
                <option value="70"></option>
                <option value="80"></option>
                <option value="90"></option>
                <option value="100"></option>
              </datalist>
            </div>

            <div className='orange-background'>
              <div style={{ textAlign: 'right', display: 'flex', justifyContent: 'space-between' }}>
                <h4>אימפקט נמוך</h4>
                <h4>אימפקט גבוה</h4>
                <h2>מדדי אימפקט</h2>
              </div>

              <table>
                <tbody>
                  <tr>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                        <span>1</span>
                        <input
                          type="range"
                          min="1"
                          max="100"
                          className="slider"
                          id="param6"
                          list="tickmarks2"
                          style={{ margin: '0 10px' }}
                        />
                        <span>10 </span>
                      </div>
                    </td>
                    <td>
                      <span className="rename-target">עד כמה היוזמה עונה למטרת הביניים</span>
                      <span className="edit-icon">✏️</span>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                        <span>1</span>
                        <input
                          type="range"
                          min="1"
                          max="100"
                          className="slider"
                          id="param7"
                          list="tickmarks2"
                          style={{ margin: '0 10px' }}
                        />
                        <span>10 </span>
                      </div>
                    </td>
                    <td>
                      <span className="rename-target">כמות תושבים שהיוזמה תשפיע עליהם</span>
                      <span className="edit-icon">✏️</span>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                        <span>1</span>
                        <input
                          type="range"
                          min="1"
                          max="100"
                          className="slider"
                          id="param8"
                          list="tickmarks2"
                          style={{ margin: '0 10px' }}
                        />
                        <span>10 </span>
                      </div>
                    </td>
                    <td>
                      <span className="rename-target">מידת השפעת היוזמה על תושב\ת בודדים</span>
                      <span className="edit-icon">✏️</span>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                        <span>1</span>
                        <input
                          type="range"
                          min="1"
                          max="100"
                          className="slider"
                          id="param9"
                          list="tickmarks2"
                          style={{ margin: '0 10px' }}
                        />
                        <span>10 </span>
                      </div>
                    </td>
                    <td>
                      <span className="rename-target">מידת נחיצות היוזמה ליצירת שינוי במרחב</span>
                      <span className="edit-icon">✏️</span>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                        <span>1</span>
                        <input
                          type="range"
                          min="1"
                          max="100"
                          className="slider"
                          id="param10"
                          list="tickmarks2"
                          style={{ margin: '0 10px' }}
                        />
                        <span>10 </span>
                      </div>
                    </td>
                    <td>
                      <span className="rename-target">כמות הרשויות עליהן היוזמה תשפיע</span>
                      <span className="edit-icon">✏️</span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <datalist id='tickmarks2'>
              <option value={10}></option>
              <option value={20}></option>
              <option value={30}></option>
              <option value={40}></option>
              <option value={50}></option>
              <option value={60}></option>
              <option value={70}></option>
              <option value={80}></option>
              <option value={90}></option>
              <option value={100}></option>
            </datalist>
          </div>
        </div>

        <div className='right'>

          <div id="graph">
            <div className="crosshair-vertical">
              <span className="crosshair-label">
                <h3>אימפקט</h3>
              </span>
            </div>
            <div className="crosshair-horizontal">
              <span className="crosshair-label">
                <h3>יְשִׁימוּת</h3>
              </span>
            </div>

            <div className="axis x-axis">
              <div className="tick" style={{ '--i': 10 }}><span className="tick-label">10</span></div>
              <div className="tick" style={{ '--i': 20 }}><span className="tick-label">20</span></div>
              <div className="tick" style={{ '--i': 30 }}><span className="tick-label">30</span></div>
              <div className="tick" style={{ '--i': 40 }}><span className="tick-label">40</span></div>
              <div className="tick" style={{ '--i': 50 }}><span className="tick-label">50</span></div>
            </div>
            <div className="axis y-axis">
              <div className="tick" style={{ '--i': 10 }}><span className="tick-label">10</span></div>
              <div className="tick" style={{ '--i': 20 }}><span className="tick-label">20</span></div>
              <div className="tick" style={{ '--i': 30 }}><span className="tick-label">30</span></div>
              <div className="tick" style={{ '--i': 40 }}><span className="tick-label">40</span></div>
              <div className="tick" style={{ '--i': 50 }}><span className="tick-label">50</span></div>
            </div>

            <div className="graph-text-box top-left-box">הצלחות פורצות דרך</div>
            <div className="graph-text-box top-right-box">הצלחות בטוחות</div>
            <div className="graph-text-box bottom-left-box">לא רלוונטי</div>
            <div className="graph-text-box bottom-right-box">הצלחות מהירות</div>

            <div id="graphContainer" style={{ position: 'relative', width: '100%', height: '100%' }}>
              {/* Dot will be appended here */}
            </div>

            {/* graph description box */}
            <div style={{ textAlign: 'right' }} className="graph-description-box">
              <span id="currentInitiative" className="current-initiative">Current Initiative: </span>
              <br />
              ישימות <span id="xValueDisplay">0</span><br />
              ממוצא מדד ישימות <span id="meanX">0</span><br />
              <br />
              אימפקט <span id="yValueDisplay">0</span><br />
              <span id="meanY">0</span> ממוצא מדד אימפקט<br />
              <br />
              <span id="sum">0</span> סכום אימפקט + ישימות
              <br />
              {/* <button id="clearButton" onClick={clearSavedData}>מחיקת כל הנקודות שעל הגרף</button> */}
            </div>

          </div>

          <aside style={{ alignItems: 'center', display: 'flex', flexDirection: 'column' }}>
            <img src="civixLogo.PNG" alt="Civix Logo" />
            <img src="NegevLogo.PNG" alt="Negev Logo" />
          </aside>


          {/* classname- right */}
        </div>
        {/* classname container */}
      </div>


      <footer>
        <p>All rights reserved to Yaniv Almagor &copy</p>
      </footer>
    </div>
  );
}

export default App;
