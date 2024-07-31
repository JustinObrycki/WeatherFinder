<style>
    :root {
        --disabled-button-color: red;
        --button-color: rgb(0, 157, 255);  /* Primary color for buttons */
        --button-disabled-opacity: 0.5;  /* Opacity level when disabled */
    }

    .Tasks {
        display: grid;
        grid-template-areas:
            "checkbox name time"
            "desc desc time"
            "desc desc delete";
        padding: 20px;
        border: 2px solid black;
        border-radius: 10px;
        box-shadow: 1px 5px 10px 1px rgb(188, 188, 188);
        margin: 50px 10px 0px 10px;
        height: 180px;
        align-items: center;
        justify-items: center;
    }

    ion-checkbox {
        width: 32px;
        height: 32px;
        grid-area: checkbox;
        --size: 32px;
        --checkbox-background-checked: rgb(21, 132, 236);
    }

    .task-name {
        grid-area: name;
        font-weight: 600;
        font-size: 20px;
        text-align: center;
    }

    .task-desc {
        grid-area: desc;
        text-align: center;
        font-size: 14px;
    }

    .task-time {
        grid-area: time;
        text-align: center;
    }

    .delete {
        width: 3cm;
        height: 70%;
        grid-area: delete;
        padding: 8px 16px;
        margin-top: 10px;
        cursor: pointer;
        background-color: var(--button-color);
        color: white;
        border: none;
    }

    .due-today {
        color: red;
        font-weight: 800;
    }

    .due-today-button {
        background-color: red;
        font-weight: 800;
    }

    .disabled-button {
        opacity: var(--button-disabled-opacity);  /* Dim the button */
        cursor: not-allowed;  /* Change cursor to indicate it's disabled */
        background-color: #e8e8e821; /* Change background to a lighter shade */
    }

    @media (max-width: 768px) {
        .Tasks {
            grid-template-areas:
                "checkbox name time"
                "desc desc delete";
            height: 160px;
            margin: 20px;
        }

        .task-name {
            font-size: 16px;
        }

        .task-desc {
            font-size: 12px;
        }

        .delete {
            width: 70%;
        }
    }

    @media (max-width: 480px) {
        .Tasks {
            grid-template-areas:
                "checkbox name"
                "desc delete"
                "time delete";
            height: 150px;
            margin: 15px;
        }

        .task-name {
            font-size: 14px;
        }

        .task-desc {
            font-size: 10px;
        }

        .delete {
            width: 60%;
            margin-top: 5px;
        }
    }
</style>

<script lang="ts">
    import { createEventDispatcher } from "svelte";
    import type Task from "./task";

    export let task: Task;
    const dispatch = createEventDispatcher();

    function isDueToday(dueDate) {
        const todayStr = new Date().toISOString().slice(0, 10); // Get today's date in YYYY-MM-DD format
        const dueDateStr = new Date(dueDate).toISOString().slice(0, 10); // Normalize the due date
        return dueDateStr === todayStr;
    }

    function handleDelete() {
        dispatch('deleteTask');
    }

    function handleCheckboxChange(event) {
        task.completed = event.detail.checked;
        dispatch('save');  // Trigger saving after update
    }
</script>

<div class="Tasks">
    <ion-checkbox checked={task.completed} on:ionChange={handleCheckboxChange}></ion-checkbox>
    <div class="task-name">{task.text}</div>
    <div class="task-desc">{task.description}</div>
    <div class="task-time {isDueToday(task.dueDate) ? 'due-today' : ''}">Finish By: <br><br>{task.dueDate ? task.dueDate.toISOString().substring(0, 10) : 'No Due Date'}</div>
    <button class="delete {isDueToday(task.dueDate) ? 'due-today-button' : ''} {task.completed ? '' : 'disabled-button'}" disabled={!task.completed} on:click={handleDelete} title={!task.completed ? 'Complete the task to enable this button' : ''}>Finish Task</button>
</div>
