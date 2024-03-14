const createReservation = (clientName, tableSize, dateTime) => ({
    clientName,
    tableSize,
    dateTime
});

const addReservationToList = (reservation) => {
    const reservationList = document.querySelector("#reservationList");
    const listItem = document.createElement("li");
    listItem.className = "list-group-item";
    listItem.textContent = `Client: ${reservation.clientName}, Table: ${reservation.tableSize}, Date: ${reservation.dateTime.dayOfMonth}-${reservation.dateTime.month}-${reservation.dateTime.year}-${reservation.dateTime.hour}-${reservation.dateTime.minute}${reservation.dateTime.second}`;
    reservationList.appendChild(listItem);
};

const saveReservation = async (reservation) => {
    try {
        const response = await fetch("http://localhost:52254/restaurant/reserve", {
            method: "POST",
            body: JSON.stringify(reservation),
            headers: {"Content-type": "application/json; charset=UTF-8"}
        });
        const json = await response.json();
        console.log(json);
    } catch (error) {
        console.log(error);
    }
};

const searchReservationsByDate = async (searchDateTime) => {
    try {
        if (!searchDateTime) {
            throw new Error('Date must not be null or undefined');
        }
        const response = await fetch(`http://localhost:52254/restaurant/reservations?dateTime=${searchDateTime}`);
        if (!response.ok) {
            throw new Error("Error retrieving reservations by date.");
        }
        const data = await response.json();
        console.log("Reservations by date:", data);
        document.querySelector("#reservationList").innerHTML = "";
        data.forEach(reservation => {
            addReservationToList(reservation);
        });
    } catch (error) {
        console.log(error);
    }
};

document.querySelector("#reservationForm").addEventListener("submit", async (event) => {
    event.preventDefault();
    const clientName = document.querySelector("#clientName").value;
    const tableSize = parseInt(document.querySelector("#tableSize").value);
    const reservationDateTime = document.querySelector("#reservationDateTime").value;

    if (clientName && tableSize && reservationDateTime) {
        const reservation = createReservation(clientName, tableSize, reservationDateTime);
        await saveReservation(reservation);
        document.querySelector("#reservationForm").reset();
    } else {
        alert("Please fill in all the form fields.");
    }
});

document.querySelector("#searchButton").addEventListener("click", async () => {
    const searchDateTime = document.querySelector("#searchDateTime").value;
    if (searchDateTime) {
        await searchReservationsByDate(searchDateTime);
    } else {
        alert("Please select a date and time for searching.");
    }
});

window.onload = () => {
    searchReservationsByDate();
};
