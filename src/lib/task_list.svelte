<style>
    task-list {
        display: grid;
    }

    .add_task {
        height: 50px;
        margin-top: -80px;
    }

    .Title {
        text-align: center;
        font-size: 50px;
        border-bottom: 3px solid black;
        margin: 10px 20px 0px 20px;
        padding: 20px 0px 20px 0px;
    }

    .task-list-container {
        overflow: scroll;
        height: 680px;
        overflow-x: hidden;
        padding-bottom: 100px;
        min-height: 82vh;
    }

    .overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.5); /* Semi-transparent black */
        z-index: 10; /* Place the overlay above other elements */
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .task-form {
        width: 90%;
        max-width: 500px; /* Limit the maximum width for larger screens */
        padding: 20px;
        background-color: #cccccc;
        z-index: 20; /* Place the form above the overlay */
        border-radius: 10px;
        display: grid;
        grid-template:
            "Name DueDate"
            "Desc TimeSpecific"
            "Button CancelButton";
        justify-content: space-around;
        justify-items: center;
        align-items: center;
        gap: 10px;

        & .Name {
            grid-area: Name;
        }

        & .DueDate {
            grid-area: DueDate;
        }

        & .TimeSpecific {
            grid-area: TimeSpecific;
        }

        & .Desc {
            grid-area: Desc;
        }

        & .Button {
            grid-area: Button;
            height: 40px;
            width: 90%;
            border: none;
            cursor: pointer;
            margin-top: 10px;
            border-radius: 5px;
        }

        & input[type="text"] {
            height: 30px;
            width: 90%;
        }

        & input[type="checkbox"] {
            width: 30px;
            height: 30px;
        }

        & .cancel-button {
            grid-area: CancelButton;
            height: 40px;
            width: 90%;
            background-color: #e74c3c; /* Red color for cancel */
            color: white;
            border: none;
            cursor: pointer;
            margin-top: 10px;
            border-radius: 5px;
        }
    }

    @media (max-width: 768px) {
        .Title {
            font-size: 30px;
            margin: 5px;
            padding: 10px 0px 10px 0px;
        }

        .task-form {
            grid-template:
                "Name"
                "DueDate"
                "Desc"
                "TimeSpecific"
                "Button"
                "Button";
        }
    }

    @media (max-width: 480px) {
        .add_task {
            height: 40px;
            margin-top: -60px;
        }

        .task-list-container {
            height: 480px;
            padding-bottom: 50px;
        }

        .task-form {
            padding: 10px;
            grid-template:
                "Name"
                "DueDate"
                "Desc"
                "TimeSpecific"
                "Button"
                "Button";
        }

        & .cancel-button,
        & .Button {
            width: 80%;
        }
    }
</style>

<script lang="ts">
    import Task from "./task";
    import TaskView from "./task_view.svelte";
    import { onMount } from "svelte";

    export let tasks = [];
    let creatingTask = false;
    let newTaskText = '';
    let newTaskDescription = '';
    let newTaskDueDate = new Date().toISOString().substring(0, 10); // Default to today
    let newTaskTimeSpecific = false;

    function toggleTaskCreation() {
        creatingTask = !creatingTask;
        if (!creatingTask) {
            resetForm();
        }
    }

    function resetForm() {
        newTaskText = '';
        newTaskDescription = '';
        newTaskDueDate = new Date().toISOString().substring(0, 10);
        newTaskTimeSpecific = false;
    }

    function addTask(text, description, dueDate, timeSpecific, completed = false) {
        const dueDateObj = dueDate instanceof Date ? dueDate : new Date(dueDate);
        tasks = [...tasks, new Task(text, description, dueDateObj, timeSpecific, completed)];
        creatingTask = false;
        resetForm();
        save();
    }

    function deleteTask(taskIndex: number) {
        tasks.splice(taskIndex, 1);
        tasks = [...tasks];
        save();
    }

    function checkTimeSpecificTasks() {
        const today = new Date();
        const todayStr = today.toISOString().slice(0, 10); // Normalize today's date to YYYY-MM-DD format

        tasks.forEach(task => {
            if (task.timeSpecific && task.dueDate) {
                const dueDateStr = new Date(task.dueDate).toISOString().slice(0, 10); // Normalize dueDate
                if (dueDateStr <= todayStr) {
                    alert(`Time-Specific Task Due: ${task.text}`);
                }
            }
        });
    }

    let save = function() {
        localStorage.setItem('tasks', JSON.stringify(tasks.map(task => ({
            ...task,
            dueDate: task.dueDate.toISOString(), // Save as ISO string
            completed: task.completed
        }))));
    }

    onMount(() => {
        let loadedTasks = JSON.parse(localStorage.getItem('tasks')) || [];
        tasks = loadedTasks.map(task => ({
            ...task,
            dueDate: new Date(task.dueDate), // Convert the dueDate back to a Date object
            completed: task.completed === true
        }));
        checkTimeSpecificTasks();
    });
</script>

<div class="Title">
    Task Manager
</div>

<task-list class="task-list-container">
    {#each tasks as task, index}
        <TaskView task={task} on:deleteTask={() => deleteTask(index)} on:save={save}></TaskView>
    {/each}
</task-list>

{#if creatingTask}
    <div class="overlay">
        <div class="task-form">
            <input class="Name" type="text" placeholder="Task Name" bind:value={newTaskText}>
            <input class="Desc" type="text" placeholder="Description" bind:value={newTaskDescription}>
            <input class="DueDate" type="date" bind:value={newTaskDueDate}>
            <span class="TimeSpecific"><input type="checkbox" bind:checked={newTaskTimeSpecific}> Time Specific?</span>
            <button class="Button" on:click={() => {
                if (newTaskText.trim() === "") {
                    newTaskText = "Untitled Task"; // Set default here instead of in addTask
                }
                if (newTaskDescription.trim() === "") {
                    newTaskDescription = "No Description Set"; // Set default here instead of in addTask
                }
                addTask(newTaskText, newTaskDescription, new Date(newTaskDueDate), newTaskTimeSpecific);
            }}>Create Task</button>
            <button class="cancel-button" on:click={toggleTaskCreation}>Cancel</button>
        </div>
    </div>
{/if}

<button class="add_task" on:click={toggleTaskCreation}>+ Create Task</button>
