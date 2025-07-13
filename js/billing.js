document.addEventListener('DOMContentLoaded', () => {
  const tableBody = document.querySelector('.billing-table tbody');
  const searchInput = document.querySelector('.search-input');
  const addPaymentBtn = document.getElementById('add-payment-btn');
  const paymentModal = document.getElementById('payment-modal');
  const paymentForm = document.getElementById('payment-form');
  const cancelBtn = document.getElementById('cancel-btn');
  const modalTitle = document.getElementById('modal-title');

  let billingData = JSON.parse(localStorage.getItem('billingData')) || [];
  let editingIndex = -1;

  
  function renderTable(data) {
    tableBody.innerHTML = '';

    if (data.length === 0) {
      const row = document.createElement('tr');
      row.innerHTML = `<td colspan="6" class="no-data">No data</td>`;
      tableBody.appendChild(row);
      return;
    }

    data.forEach((entry, index) => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${entry.name}</td>
        <td>${entry.type}</td>
        <td>${entry.mode}</td>
        <td>${entry.amount}</td>
        <td>${entry.description}</td>
        <td class="actions">
          <button class="edit-btn" data-index="${index}">✏️ Edit</button>
          <button class="delete-btn" data-index="${index}">🗑️ Delete</button>
        </td>
      `;
      tableBody.appendChild(row);
    });
  }

  
  addPaymentBtn.addEventListener('click', () => {
    modalTitle.textContent = 'Add Payment';
    paymentForm.reset();
    editingIndex = -1;
    paymentModal.style.display = 'flex';
  });

 
  function closeModal() {
    paymentModal.style.display = 'none';
    paymentForm.reset();
    editingIndex = -1;
  }

 
  cancelBtn.addEventListener('click', closeModal);

  
  paymentModal.addEventListener('click', (e) => {
    if (e.target === paymentModal) {
      closeModal();
    }
  });


  paymentForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const formData = new FormData(paymentForm);
    const paymentData = {
      name: formData.get('memberName'),
      type: formData.get('paymentType'),
      mode: formData.get('paymentMode'),
      amount: formData.get('amount'),
      description: formData.get('description')
    };

    if (editingIndex >= 0) {
      billingData[editingIndex] = paymentData;
    } else {
      
      billingData.push(paymentData);
    }

    localStorage.setItem('billingData', JSON.stringify(billingData));
    renderTable(billingData);
    closeModal();
  });

  
  tableBody.addEventListener('click', (e) => {
    if (e.target.classList.contains('delete-btn')) {
      const index = e.target.dataset.index;
      billingData.splice(index, 1);
      localStorage.setItem('billingData', JSON.stringify(billingData));
      renderTable(billingData);
    } else if (e.target.classList.contains('edit-btn')) {
      const index = e.target.dataset.index;
      const entry = billingData[index];
      
     
      document.getElementById('memberName').value = entry.name;
      document.getElementById('paymentType').value = entry.type;
      document.getElementById('paymentMode').value = entry.mode;
      document.getElementById('amount').value = entry.amount;
      document.getElementById('description').value = entry.description;
      
      modalTitle.textContent = 'Edit Payment';
      editingIndex = index;
      paymentModal.style.display = 'flex';
    }
  });


  searchInput.addEventListener('input', () => {
    const query = searchInput.value.toLowerCase();
    const filtered = billingData.filter(entry =>
      entry.name.toLowerCase().includes(query) ||
      entry.type.toLowerCase().includes(query) ||
      entry.mode.toLowerCase().includes(query) ||
      entry.description.toLowerCase().includes(query)
    );
    renderTable(filtered);
  });

  renderTable(billingData);
});