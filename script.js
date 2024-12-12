// Load tasks from the backend on page load
document.addEventListener("DOMContentLoaded", () => {
    fetch("http://127.0.0.1:5000/load")
        .then((response) => response.json())
        .then((data) => {
            const { tasks, completed_tasks } = data;

            // Populate the task lists
            Object.entries(tasks).forEach(([status, taskArray]) => {
                const section = document.getElementById(status);
                taskArray.forEach((task) => {
                    const taskElement = createTaskElement(task.id, task.title, status);
                    section.appendChild(taskElement);
                });
            });

            // Populate the completed tasks
            const completedSection = document.getElementById("tasks-completed");
            completed_tasks.forEach((task) => {
                const completedTask = createTaskElement(task.id, task.title, "completed");
                completedSection.appendChild(completedTask);
            });
        });
});

// Save tasks to the backend
function saveTasksToBackend() {
    const tasks = {};
    document.querySelectorAll(".task-list ul").forEach((ul) => {
        const status = ul.id;
        tasks[status] = Array.from(ul.children).map((li) => ({
            id: li.id,
            title: li.querySelector("span").textContent,
            status: status,
        }));
    });

    const completedTasks = Array.from(
        document.getElementById("tasks-completed").children
    ).map((li) => ({
        id: li.id,
        title: li.querySelector("span").textContent,
        status: "completed",
    }));

    fetch("http://127.0.0.1:5000/save", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ tasks, completed_tasks: completedTasks }),
    }).then((response) => response.json());
}

// Add Task Button Click Handlers for Each Section
document.querySelectorAll(".add-task-btn").forEach((button) => {
    button.addEventListener("click", (e) => {
        const targetId = e.target.getAttribute("data-target");
        const inputField = e.target.previousElementSibling;
        const title = inputField.value;

        if (title.trim()) {
            // Create a new task element with a unique ID
            const taskId = `task-${Date.now()}`;
            const task = createTaskElement(taskId, title, targetId);

            // Append task to the targeted section
            document.getElementById(targetId).appendChild(task);

            // Save tasks to backend
            saveTasksToBackend();

            // Clear the input field
            inputField.value = "";
        }
    });
});

// Enable Enter key functionality for Add Task inputs
document.querySelectorAll(".task-input").forEach((input) => {
    input.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
            const button = input.nextElementSibling; // Get the associated Add Task button
            button.click(); // Trigger the click event on the button
        }
    });
});

// Create Task Element with Buttons
function createTaskElement(id, title, status) {
    const task = document.createElement("li");

    // Set unique ID and status
    task.id = id;
    task.setAttribute("data-status", status);

    // Add task text
    const taskText = document.createElement("span");
    taskText.textContent = title;

    // Create Checkmark Button
    const checkButton = document.createElement("button");
    checkButton.textContent = "✔";
    checkButton.style.marginLeft = "10px";
    checkButton.addEventListener("click", () => {
        markTaskAsComplete(task);
    });

    // Create Delete Button
    const deleteButton = document.createElement("button");
    deleteButton.textContent = "✖";
    deleteButton.style.marginLeft = "5px";
    deleteButton.addEventListener("click", () => {
        task.remove();
        saveTasksToBackend(); // Save state after deletion
    });

    // Add buttons to the task element
    task.appendChild(checkButton);
    task.appendChild(deleteButton);
    task.appendChild(taskText);

    // Make the task draggable
    task.setAttribute("draggable", true);
    task.addEventListener("dragstart", (e) => {
        e.dataTransfer.setData("text", task.id);
        task.classList.add("dragging"); // Add a temporary class for drag tracking
    });

    return task;
}

// Mark Task as Complete
function markTaskAsComplete(task) {
    // Remove task from its current parent
    task.remove();

    // Create a new completed task entry
    const completedTask = createTaskElement(task.id, task.querySelector("span").textContent, "completed");

    // Add completed task to the list
    document.getElementById("tasks-completed").appendChild(completedTask);

    // Save tasks to backend
    saveTasksToBackend();
}

// Enable drag-and-drop functionality for all quadrants
document.querySelectorAll(".quadrant").forEach((quadrant) => {
    quadrant.addEventListener("dragover", (e) => e.preventDefault());
    quadrant.addEventListener("drop", (e) => {
        e.preventDefault();

        // Get the dragged task ID
        const draggedTaskId = e.dataTransfer.getData("text");
        const draggedTask = document.getElementById(draggedTaskId);

        if (draggedTask) {
            draggedTask.classList.remove("dragging");
            const targetStatus = e.target.querySelector("ul").id;

            // Update the task's data-status attribute
            draggedTask.setAttribute("data-status", targetStatus);

            // Append to the new quadrant
            e.target.querySelector("ul").appendChild(draggedTask);

            // Save state
            saveTasksToBackend();
        }
    });
});

