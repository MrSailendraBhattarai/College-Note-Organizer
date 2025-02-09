document.addEventListener("DOMContentLoaded", function () {
    const semestersContainer = document.getElementById("semesters");
    const notesContainer = document.getElementById("notesContainer");
    const addNoteModal = document.getElementById("addNoteModal");
    const addNoteForm = document.getElementById("addNoteForm");
    const addNoteBtn = document.getElementById("addNoteBtn");
    const backButton = document.getElementById("backButton");
    const notesSection = document.getElementById("notesSection");
    const notesHeader = document.getElementById("notesHeader");

    let selectedSemester = null;
    let selectedSubject = null;
    const data = JSON.parse(localStorage.getItem("notes")) || {};

    // Populate semesters
    const semesters = Array.from({ length: 8 }, (_, i) => i + 1);
    semesters.forEach(semester => {
        const semesterDiv = document.createElement("div");
        semesterDiv.className = "grid-item";
        semesterDiv.textContent = `Semester ${semester}`;
        semesterDiv.addEventListener("click", () => showSubjects(semester));
        semestersContainer.appendChild(semesterDiv);
    });

    // Display subjects for the selected semester
    function showSubjects(semester) {
        selectedSemester = semester;
        notesContainer.innerHTML = "";
        notesHeader.textContent = `Semester ${semester}`;
        notesSection.style.display = "block";
        semestersContainer.style.display = "none";

        const subjects = data[semester] || {};
        for (const subject in subjects) {
            const subjectDiv = document.createElement("div");
            subjectDiv.className = "grid-item";
            subjectDiv.textContent = subject;
            subjectDiv.addEventListener("click", () => showNotes(subject));
            notesContainer.appendChild(subjectDiv);
        }
    }

    // Show all notes for a selected subject
    function showNotes(subject) {
        selectedSubject = subject;
        notesContainer.innerHTML = "";
        notesHeader.textContent = `Semester ${selectedSemester} - ${subject}`;
        const notes = data[selectedSemester]?.[subject] || [];
        for (const note of notes) {
            const noteDiv = document.createElement("div");
            noteDiv.className = "grid-item";
            noteDiv.innerHTML = `
                <p>${note.name}</p>
                <div class="note-actions">
                    <button class="view-btn" onclick="viewNote('${note.url}')">View</button>
                    <button class="delete-btn" onclick="deleteNote('${note.name}')">Delete</button>
                </div>
            `;
            notesContainer.appendChild(noteDiv);
        }
    }

    // View Note (Open in new tab)
    window.viewNote = function (url) {
        window.open(url, '_blank');
    };

    // Delete Note
    window.deleteNote = function (noteName) {
        if (selectedSemester && selectedSubject) {
            const notes = data[selectedSemester][selectedSubject];
            const noteIndex = notes.findIndex(note => note.name === noteName);
            if (noteIndex !== -1) {
                notes.splice(noteIndex, 1); // Remove the note
                localStorage.setItem("notes", JSON.stringify(data));
                showNotes(selectedSubject); // Refresh the notes display
            }
        }
    };

    // Add New Note
    addNoteBtn.addEventListener("click", function () {
        addNoteModal.style.display = "block";
    });

    // Close Add Note Modal
    document.querySelector(".close").addEventListener("click", function () {
        addNoteModal.style.display = "none";
    });

    // Handle Add Note Form Submission
    addNoteForm.addEventListener("submit", function (event) {
        event.preventDefault();

        const semester = document.getElementById("semester").value;
        const subject = document.getElementById("subject").value;
        const noteFile = document.getElementById("noteFile").files[0];

        if (noteFile && semester && subject) {
            const fileUrl = URL.createObjectURL(noteFile);
            const note = {
                name: noteFile.name,
                url: fileUrl,
            };

            if (!data[semester]) {
                data[semester] = {};
            }

            if (!data[semester][subject]) {
                data[semester][subject] = [];
            }

            data[semester][subject].push(note);
            localStorage.setItem("notes", JSON.stringify(data));

            addNoteModal.style.display = "none"; // Close Modal
            showSubjects(semester); // Refresh subject list
        }
    });

    // Back to Semesters
    backButton.addEventListener("click", function () {
        notesSection.style.display = "none";
        semestersContainer.style.display = "block";
    });
});