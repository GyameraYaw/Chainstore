document.addEventListener("DOMContentLoaded", function() {
  console.log("DOM loaded, initializing members page...");


  const membersTable = document.querySelector(".member-table tbody");
  const modal = document.querySelector(".modal");
  const addMemberBtn = document.querySelector(".add-member-btn");
  const cancelBtn = document.querySelector(".cancel-btn");
  const saveBtn = document.querySelector(".save-btn");
  const searchInput = document.querySelector(".search-input");
  const modalForm = document.querySelector("#member-form");
  const nameInput = document.querySelector("#fullName");
  const emailInput = document.querySelector("#email");
  const dobInput = document.querySelector("#dob");

  
  console.log("Elements found:", {
    membersTable: !!membersTable,
    modal: !!modal,
    addMemberBtn: !!addMemberBtn,
    cancelBtn: !!cancelBtn,
    saveBtn: !!saveBtn,
    searchInput: !!searchInput,
    modalForm: !!modalForm,
    nameInput: !!nameInput,
    emailInput: !!emailInput,
    dobInput: !!dobInput
  });


  if (!addMemberBtn) {
    console.error("Add member button not found!");
    return;
  }
  if (!modal) {
    console.error("Modal not found!");
    return;
  }
  if (!modalForm) {
    console.error("Modal form not found!");
    return;
  }

  let members = JSON.parse(localStorage.getItem("members")) || [];
  let editingIndex = null;

  function renderMembers(filteredMembers = members) {
    if (!membersTable) return;
    
    membersTable.innerHTML = "";

    if (filteredMembers.length === 0) {
      const row = document.createElement("tr");
      row.classList.add("no-data");
      row.innerHTML = `<td colspan="4">No data</td>`;
      membersTable.appendChild(row);
      return;
    }

    filteredMembers.forEach((member, index) => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${member.name}</td>
        <td>${member.email}</td>
        <td>${member.dob}</td>
        <td class="actions">
          <button class="edit-btn" data-index="${index}">✏️ Edit</button>
          <button class="delete-btn" data-index="${index}">🗑️ Delete</button>
        </td>
      `;
      membersTable.appendChild(row);
    });
  }

  function openModal(editIndex = null) {
    console.log("Opening modal...", editIndex);
    
    if (!modal) {
      console.error("Modal element not found!");
      return;
    }

    modal.classList.add("open");
    
    if (editIndex !== null) {
      const member = members[editIndex];
      if (nameInput) nameInput.value = member.name;
      if (emailInput) emailInput.value = member.email;
      if (dobInput) dobInput.value = member.dob;
      editingIndex = editIndex;
      document.getElementById("modalTitle").textContent = "Edit Member";
    } else {
      if (modalForm) modalForm.reset();
      editingIndex = null;
      document.getElementById("modalTitle").textContent = "Add Member";
    }
  }

  function closeModal() {
    console.log("Closing modal...");
    if (modal) modal.classList.remove("open");
    if (modalForm) modalForm.reset();
    editingIndex = null;
  }

  function saveMember(e) {
    e.preventDefault();
    console.log("Saving member...");
    
    const newMember = {
      name: nameInput ? nameInput.value.trim() : "",
      email: emailInput ? emailInput.value.trim() : "",
      dob: dobInput ? dobInput.value : "",
    };

    if (!newMember.name || !newMember.email || !newMember.dob) {
      alert("Please fill in all fields");
      return;
    }

    if (editingIndex !== null) {
      members[editingIndex] = newMember;
    } else {
      members.push(newMember);
    }
    
    localStorage.setItem("members", JSON.stringify(members));
    renderMembers();
    closeModal();
  }

  function handleTableClick(e) {
    if (e.target.classList.contains("edit-btn")) {
      const index = parseInt(e.target.dataset.index);
      openModal(index);
    } else if (e.target.classList.contains("delete-btn")) {
      const index = parseInt(e.target.dataset.index);
      if (confirm("Are you sure you want to delete this member?")) {
        members.splice(index, 1);
        localStorage.setItem("members", JSON.stringify(members));
        renderMembers();
      }
    }
  }

  function searchMembers() {
    if (!searchInput) return;
    
    const keyword = searchInput.value.toLowerCase();
    const filtered = members.filter(
      (m) =>
        m.name.toLowerCase().includes(keyword) ||
        m.email.toLowerCase().includes(keyword)
    );
    renderMembers(filtered);
  }

  
  if (addMemberBtn) {
    addMemberBtn.addEventListener("click", function(e) {
      console.log("Add member button clicked!");
      e.preventDefault();
      openModal();
    });
  }

  if (cancelBtn) {
    cancelBtn.addEventListener("click", function(e) {
      console.log("Cancel button clicked!");
      e.preventDefault();
      closeModal();
    });
  }

  if (modalForm) {
    modalForm.addEventListener("submit", saveMember);
  }

  if (membersTable) {
    membersTable.addEventListener("click", handleTableClick);
  }

  if (searchInput) {
    searchInput.addEventListener("input", searchMembers);
  }


  renderMembers();
  
  console.log("Members page initialized successfully!");
});