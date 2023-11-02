// script.js

let startTime, endTime, intervalId;

const a_big = new Audio('1.mp3');
const a_small = new Audio('a.mp3');
const a_pivot = new Audio('1.mp3'); // Sound for selecting the pivot
const a_partition = new Audio('a.mp3'); // Sound for partitioning

let speed = 50;

function adjustColumns() {
    const slider = document.getElementById("columnSlider");
    const sliderValue = document.getElementById("sliderValue");
    const numColumns = slider.value;
    sliderValue.textContent = numColumns;

    generateRandomLines(numColumns);
}

function generateRandomLines(numColumn) {
    const lineContainer = document.querySelector(".line-container");
    lineContainer.innerHTML = "";

    for (let i = 0; i < numColumn; i++) {
        const line = document.createElement("div");
        line.className = "line";
        line.style.height = Math.floor(Math.random() * 500) + "px";
        line.style.width = (numColumn * 10) + "px";
        lineContainer.appendChild(line);
    }
}

async function bubbleSort() {
    document.getElementById("bubbleSortButton").disabled = true; // Disable the button
    startTime = performance.now();
    // intervalId = startTimer();
    let lines = Array.from(document.querySelectorAll(".line"));
    let n = lines.length;
    let swapped;

    async function swap(i, j) {
        // Apply the "changing" class to changing columns
        lines[i].classList.add("line-swapped-big");
        lines[j].classList.add("line-swapped-small");

        a_big.play();

        // Temporarily store the heights
        let height1 = lines[i].style.height;
        let height2 = lines[j].style.height;

        // Swap the columns
        lines[i].style.height = height2;
        lines[j].style.height = height1;

        a_small.play();

        await new Promise(resolve => setTimeout(resolve, speed)); // Adjust the delay (300ms in this example)

        // Remove the "changing" class to change the color back
        lines[i].classList.remove("line-swapped-big");
        lines[j].classList.remove("line-swapped-small");
    }

    async function complete(){
    
        for (let i = 0; i < lines.length; i++){
            lines[i].classList.add("sort-complete");
            await new Promise(resolve => setTimeout(resolve, 50));
        }
        for (let i = lines.length-1; i >=0 ; i--){
            await new Promise(resolve => setTimeout(resolve, 50));
            lines[i].classList.remove("sort-complete");
        }
    }

    async function performSort() {
        do {
            swapped = false;
            for (let i = 0; i < n - 1; i++) {
                if (parseInt(lines[i].style.height) > parseInt(lines[i + 1].style.height)) {
                    await swap(i, i + 1);
                    swapped = true;
                }
            }
            n--;
        } while (swapped);
        complete();
    }

    // Start sorting and enable the sorting button when it's finished
    await performSort();

    document.getElementById("bubbleSortButton").disabled = false; // Enable the button
    endTime = performance.now();
    displayTime();
    clearInterval(intervalId);
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function quicksort_main() {
    document.getElementById("quicksortButton").disabled = true; // Disable the button
    startTime = performance.now();
    let lines = Array.from(document.querySelectorAll(".line"));
    let n = lines.length;

    async function complete(){
    
        for (let i = 0; i < lines.length; i++){
            lines[i].classList.add("sort-complete");
            await new Promise(resolve => setTimeout(resolve, 50));
        }
        for (let i = lines.length-1; i >=0 ; i--){
            await new Promise(resolve => setTimeout(resolve, 50));
            lines[i].classList.remove("sort-complete");
        }
    }

    async function swap(i, j) {
        const line1 = lines[i];
        const line2 = lines[j];

        // Apply the "changing" class to changing columns
        line1.classList.add("line-swapped-big");
        line2.classList.add("line-swapped-small");

        a_big.play();

        // Temporarily store the heights
        let height1 = line1.style.height;
        let height2 = line2.style.height;

        // Swap the columns
        line1.style.height = height2;
        line2.style.height = height1;

        a_small.play();

        await new Promise(resolve => setTimeout(resolve, speed)); // Delay for visualization

        // Remove the "changing" class to change the color back
        line1.classList.remove("line-swapped-big");
        line2.classList.remove("line-swapped-small");
    }

    async function quickSort(start, end) {
        if (start >= end) {
            return;
        }

        var piv_ind = Math.floor(Math.random() * (end - start + 1) + start);
        var pivot = lines[piv_ind].style.height;
        lines[piv_ind].classList.add("pivot");
        var i = start;
        var j = end;

        while (i <= j) {
            while (parseInt(lines[i].style.height) < parseInt(pivot)) {
                i++;
            }
            while (parseInt(lines[j].style.height) > parseInt(pivot)) {
                j--;
            }
            if (i <= j) {
                await swap(i, j);
                i++;
                j--;
            }
        }

        lines[piv_ind].classList.remove("pivot");
        await quickSort(start, j);
        await quickSort(i, end);
    }

    await quickSort(0, n - 1);

    document.getElementById("quicksortButton").disabled = false; // Enable the button
    endTime = performance.now();
    displayTime();
    clearInterval(intervalId);
    complete();
}

async function mergesort_main(){
    document.getElementById("mergeSortButton").disabled = true; // Disable the button
    startTime = performance.now();
    let lines = Array.from(document.querySelectorAll(".line"));
    let n = lines.length;

    async function complete(){
    
        for (let i = 0; i < lines.length; i++){
            lines[i].classList.add("sort-complete");
            await new Promise(resolve => setTimeout(resolve, 50));
        }
        for (let i = lines.length-1; i >=0 ; i--){
            await new Promise(resolve => setTimeout(resolve, 50));
            lines[i].classList.remove("sort-complete");
        }
    }

    async function mergeSort(start, end) {
        if (start < end) {
            const mid = Math.floor((start + end) / 2);

            await mergeSort(start, mid);
            await mergeSort(mid + 1, end);
            await merge(start, mid, end);
        }
    }

    async function merge(start, mid, end) {
        const leftLength = mid - start + 1;
        const rightLength = end - mid;

        const leftArray = new Array(leftLength);
        const rightArray = new Array(rightLength);

        for (let i = 0; i < leftLength; i++) {
            leftArray[i] = lines[start + i].style.height;
        }

        for (let i = 0; i < rightLength; i++) {
            rightArray[i] = lines[mid + 1 + i].style.height;
        }

        let i = 0;
        let j = 0;
        let k = start;

        while (i < leftLength && j < rightLength) {
            if (parseInt(leftArray[i]) <= parseInt(rightArray[j])) {
                lines[k].style.height = leftArray[i];
                lines[k].classList.add("line-swapped-big");
                a_big.play();
                i++;
            } else {
                lines[k].style.height = rightArray[j];
                lines[k].classList.add("line-swapped-small");
                a_big.play();
                j++;
            }
            k++;
            await new Promise(resolve => setTimeout(resolve, speed)); // Delay for visualization
            lines[k-1].classList.remove("line-swapped-small")
            lines[k-1].classList.remove("line-swapped-big")
        }

        while (i < leftLength) {
            lines[k].classList.add("line-swapped-big")
            lines[k].style.height = leftArray[i];
            a_big.play();
            i++;
            k++;
            await new Promise(resolve => setTimeout(resolve, speed)); // Delay for visualization
            lines[k-1].classList.remove("line-swapped-big")
        }

        while (j < rightLength) {
            lines[k].classList.add("line-swapped-small")
            lines[k].style.height = rightArray[j];
            a_big.play();
            j++;
            k++;
            await new Promise(resolve => setTimeout(resolve, speed)); // Delay for visualization
            lines[k-1].classList.remove("line-swapped-small")
        }
    }

    await mergeSort(0, n - 1);

    document.getElementById("mergeSortButton").disabled = false; // Enable the button
    endTime = performance.now();
    displayTime();
    clearInterval(intervalId);
    a_small.play();
    complete(); 
}

function mergesort_button(){
    document.getElementById("mergeSortButton").disabled = true; // Disable the button
    clearInterval(intervalId);
    startTimer();
    mergesort_main();  
}

function quicksort_button() {
    document.getElementById("quicksortButton").disabled = true; // Disable the button
    clearInterval(intervalId);
    startTimer();
    quicksort_main();
}

function bubblesort_button(){
    document.getElementById("bubbleSortButton").disabled = true; // Disable the button
    clearInterval(intervalId);
    startTimer();
    bubbleSort();
    // endTime = performance.now();
    // displayTime();
    // clearInterval(intervalId);
};

function displayTime() {
    const timeElapsed = ((endTime - startTime) / 1000).toFixed(2); // Calculate elapsed time in seconds
    const sortingTimeDiv = document.getElementById("sorting-time");
    sortingTimeDiv.textContent = `Sorting time: ${timeElapsed} seconds`; // Update the time display
}

// Function to update the timer
function updateTimer() {
    const currentTime = ((performance.now() - startTime) / 1000).toFixed(2);
    const sortingTimeDiv = document.getElementById("sorting-time");
    sortingTimeDiv.textContent = `Sorting time: ${currentTime} seconds`;
}

// Start the timer after sorting begins
function startTimer() {
    clearInterval(intervalId);
    intervalId = setInterval(updateTimer, 10); // Update every 10 milliseconds
}

function reset() {
    clearInterval(intervalId);
    adjustColumns();
}

generateRandomLines();
