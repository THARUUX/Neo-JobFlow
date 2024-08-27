function checkPathAndFetchData() {
    const path = window.location.pathname.slice(1);

    if (path === 'inprogress') {
        fetchDataInProgress();
    } else if (path === 'finished') {
        fetchDataFinished();
    } else if (path === 'report') {
        fetchDataReport();
    } else if (path === 'manage') {
        fetchDataManage();
    }
}

window.addEventListener('load', checkPathAndFetchData);

//================================================================ INPROGRESS
function fetchDataInProgress() {
    loaderHandling('show');

    fetch('/api/jobs')
        .then(response => response.json())
        .then(data => {
            const tableData = document.getElementById('in-progress-table-body');

            if (!tableData) {
                console.error('No in-progress-table-body element found in the DOM');
                loaderHandling('hide'); 
                return;
            }

            tableData.innerHTML = '';

            const jobs = data || [];

            const inProgressJobs = jobs.filter(job => job.status == 0) || [];
            //console.log("inph", inProgressJobs);

            inProgressJobs.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

            inProgressJobs.forEach(job => {
                const row = document.createElement('tr');
                row.classList.add('bg-slate-50', 'hover:bg-slate-100', 'text-gray-800');

                const daysAgo = daysSince(job.created_at);

                row.innerHTML = `
                    <td class="px-4 py-2">${job.jobNo}</td>
                    <td class="px-4 py-2">${job.bookName}</td>
                    <td class="px-4 py-2">${job.customer}</td>
                    <td class="px-4 py-2">${job.status == 0 ? 'In Progress' : 'Finished'}</td>
                    <td class="px-4 py-2">${new Date(job.created_at).toLocaleString()}</td>
                    <td class="px-4 py-2">${daysAgo} Days ago</td>
                `;

                tableData.appendChild(row);
            });

            loaderHandling('hide'); 
        })
        .catch(error => {
            console.error('Error fetching jobs:', error);
            loaderHandling('hide'); 
        });
}


//================================================================ FINISHED
function fetchDataFinished() {
    loaderHandling('show');

    fetch('/api/jobs')
        .then(response => response.json())
        .then(data => {
            const tableData = document.getElementById('finished-table-body');

            if (!tableData) {
                console.error('No finished-table-body element found in the DOM');
                loaderHandling('hide'); 
                return;
            }

            const jobs = data || [];

            tableData.innerHTML = '';

            const finishedJobs = jobs.filter(job => job.status == 1) || [];
            //console.log("inph", finishedJobs);

            finishedJobs.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

            finishedJobs.forEach(job => {
                const row = document.createElement('tr');
                row.classList.add('bg-slate-50', 'hover:bg-slate-100', 'text-gray-800');

                const daysAgo = daysSince(job.created_at);

                row.innerHTML = `
                    <td class="px-4 py-2">${job.jobNo}</td>
                    <td class="px-4 py-2">${job.bookName}</td>
                    <td class="px-4 py-2">${job.customer}</td>
                    <td class="px-4 py-2">${job.status == 0 ? 'In Progress' : 'Finished'}</td>
                    <td class="px-4 py-2">${new Date(job.created_at).toLocaleString()}</td>
                    <td class="px-4 py-2">${daysAgo} Days ago</td>
                `;

                tableData.appendChild(row);
            });

            loaderHandling('hide'); 
        })
        .catch(error => {
            console.error('Error fetching jobs:', error);
            loaderHandling('hide'); 
        });
}

//================================================================ REPORT
function fetchDataReport() {
    loaderHandling('show');

    fetch('/api/jobs')
        .then(response => response.json())
        .then(data => {
            const tableData = document.getElementById('report-table-body');

            if (!tableData) {
                console.error('No report-table-body element found in the DOM');
                loaderHandling('hide'); 
                return;
            }

            const jobs = data || [];

            tableData.innerHTML = '';

            jobs.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

            jobs.forEach(job => {
                const row = document.createElement('tr');
                row.classList.add('hover:bg-slate-100', 'text-gray-800', (job.status == 0 ? 'bg-slate-50' : 'bg-lime-200'));

                const doneImg = '<img class="mx-auto" src="../assets/check.png" width="20" height="20">';
                const waitImg = '<img class="mx-auto" src="../assets/hourglass.png" width="20" height="20">';

                row.innerHTML = `
                    <td class="px-4 py-2">${job.jobNo}</td>
                    <td class="px-4 py-2 text-nowrap">${job.bookName}</td>
                    <td class="px-4 py-2 text-nowrap">${job.customer}</td>
                    <td class="px-4 py-2 text-nowrap">${job.status == 0 ? 'In Progress' : 'Finished'}</td>
                    <td class="px-4 py-2 text-nowrap">${new Date(job.created_at).toLocaleString()}</td>
                    <td class="px-4 py-2">${job.pInner == 1 ? doneImg : waitImg}</td>
                    <td class="px-4 py-2">${job.pCover == 1 ? doneImg : waitImg}</td>
                    <td class="px-4 py-2">${job.Laminating == 1 ? doneImg : waitImg}</td>
                    <td class="px-4 py-2">${job.Folding == 1 ? doneImg : waitImg}</td>
                    <td class="px-4 py-2">${job.Gathering == 1 ? doneImg : waitImg}</td>
                    <td class="px-4 py-2">${job.Binding == 1 ? doneImg : waitImg}</td>
                    <td class="px-4 py-2">${job.centerWiring == 1 ? doneImg : waitImg}</td>
                    <td class="px-4 py-2">${job.cutting == 1 ? doneImg : waitImg}</td>
                    <td class="px-4 py-2">${job.packing == 1 ? doneImg : waitImg}</td>
                    <td class="px-4 py-2">${job.delivery == 1 ? doneImg : waitImg}</td>
                    <td class="px-4 py-2">${job.Invoice == 1 ? doneImg : waitImg}</td>
                `;

                tableData.appendChild(row);
            });

            loaderHandling('hide'); 
        })
        .catch(error => {
            console.error('Error fetching jobs:', error);
            loaderHandling('hide'); 
        });
}
//================================================================ MANAGE
function fetchDataManage() {
    loaderHandling('show');

    fetch('/api/jobs')
        .then(response => response.json())
        .then(data => {
            const tableData = document.getElementById('manage-table-body');

            if (!tableData) {
                console.error('No manage-table-body element found in the DOM');
                loaderHandling('hide'); 
                return;
            }

            const jobs = data || [];

            tableData.innerHTML = '';

            jobs.sort((a, b) => new Date(a.jobNo) - new Date(b.jobNo));

            jobs.forEach(job => {
                const row = document.createElement('tr');
                row.classList.add('hover:bg-slate-100', 'text-gray-800', 'bg-slate-50');

                row.innerHTML = `
                    <td class="px-4 py-2">${job.jobNo}</td>
                    <td class="px-4 py-2 text-nowrap">${job.bookName}</td>
                    <td class="px-4 py-2 text-nowrap">${job.customer}</td>
                    <td class="px-4 py-2 text-nowrap">${job.status == 0 ? 'In Progress' : 'Finished'}</td>
                    <td class="px-4 py-2 text-nowrap">
                        <button class="bg-slate-900 p-2 rounded-lg shadow-lg" onclick="editJob('${job.id}')">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="15" height="15" color="#ffffff" fill="none">
                                <path d="M16.2141 4.98239L17.6158 3.58063C18.39 2.80646 19.6452 2.80646 20.4194 3.58063C21.1935 4.3548 21.1935 5.60998 20.4194 6.38415L19.0176 7.78591M16.2141 4.98239L10.9802 10.2163C9.93493 11.2616 9.41226 11.7842 9.05637 12.4211C8.70047 13.058 8.3424 14.5619 8 16C9.43809 15.6576 10.942 15.2995 11.5789 14.9436C12.2158 14.5877 12.7384 14.0651 13.7837 13.0198L19.0176 7.78591M16.2141 4.98239L19.0176 7.78591" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                                <path d="M21 12C21 16.2426 21 18.364 19.682 19.682C18.364 21 16.2426 21 12 21C7.75736 21 5.63604 21 4.31802 19.682C3 18.364 3 16.2426 3 12C3 7.75736 3 5.63604 4.31802 4.31802C5.63604 3 7.75736 3 12 3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
                            </svg>
                        </button>
                        <button class="bg-red-600 p-2 rounded-lg shadow-lg" onclick="deleteJob('${job.id}')">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="15" height="15" color="#ffffff" fill="none">
                                <path d="M19.5 5.5L18.8803 15.5251C18.7219 18.0864 18.6428 19.3671 18.0008 20.2879C17.6833 20.7431 17.2747 21.1273 16.8007 21.416C15.8421 22 14.559 22 11.9927 22C9.42312 22 8.1383 22 7.17905 21.4149C6.7048 21.1257 6.296 20.7408 5.97868 20.2848C5.33688 19.3626 5.25945 18.0801 5.10461 15.5152L4.5 5.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
                                <path d="M3 5.5H21M16.0557 5.5L15.3731 4.09173C14.9196 3.15626 14.6928 2.68852 14.3017 2.39681C14.215 2.3321 14.1231 2.27454 14.027 2.2247C13.5939 2 13.0741 2 12.0345 2C10.9688 2 10.436 2 9.99568 2.23412C9.8981 2.28601 9.80498 2.3459 9.71729 2.41317C9.32164 2.7167 9.10063 3.20155 8.65861 4.17126L8.05292 5.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
                                <path d="M9.5 16.5L9.5 10.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
                                <path d="M14.5 16.5L14.5 10.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
                            </svg>
                        </button>
                    </td>
                `;

                tableData.appendChild(row);
            });

            loaderHandling('hide'); 
        })
        .catch(error => {
            console.error('Error fetching jobs:', error);
            loaderHandling('hide'); 
        });
}


//================================================================ OTHER FUNCTIONS
function daysSince(date) {
    const jobDate = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0); 
    const diffInMilliseconds = today - jobDate;
    const diffInDays = Math.floor(diffInMilliseconds / (1000 * 60 * 60 * 24));
    return diffInDays;
}

function loaderHandling(status) {
    const loader = document.getElementById('loader');
    
    if (!loader) {
        console.error('Loader element not found in the DOM');
        return;
    }

    if (status === 'show') {
        loader.classList.remove('hidden');
        loader.classList.add('flex');
    } else if (status === 'hide') {
        loader.classList.remove('flex');
        loader.classList.add('hidden');
    } else {
        console.error('Invalid status value. Use "show" or "hide".');
    }
}

function filterTable() {
    //console.log('hi');
    const searchTerm = document.getElementById('search-input').value.toLowerCase();
    const rows = document.querySelectorAll('.divide-y tr');

    rows.forEach(row => {
        const cells = row.querySelectorAll('td');
        const rowText = Array.from(cells).map(cell => cell.textContent.toLowerCase()).join(' ');

        if (rowText.includes(searchTerm)) {
            row.style.display = '';
        } else {
            row.style.display = 'none';
        }
    });
}

function printDiv(divId) {
    const divToPrint = document.getElementById(divId);
    const newWindow = window.open('', '', 'height=600,width=1400');
    newWindow.document.write('<html><head><title>Report</title><script src="https://cdn.tailwindcss.com"></script>');
    newWindow.document.write('<style>.print-scale { transform: scale(0.5); transform-origin: top left; width: 200%; height: 200%; }</style>');
    newWindow.document.write('</head><body >');
    newWindow.document.write('<div class="print-scale">' + divToPrint.innerHTML + '</div>');
    newWindow.document.write('</body></html>');
    newWindow.document.close();
    newWindow.focus();
    setTimeout(() => {
        newWindow.print();
    }, 1000);
}

function updateColumnVisibility() {
    const table = document.getElementById('report-table');
    const checkboxes = {
        0: document.getElementById('col1-checkbox').checked,
        1: document.getElementById('col2-checkbox').checked,
        2: document.getElementById('col3-checkbox').checked,
        3: document.getElementById('col4-checkbox').checked,
        4: document.getElementById('col5-checkbox').checked,
        5: document.getElementById('col6-checkbox').checked,
        6: document.getElementById('col7-checkbox').checked,
        7: document.getElementById('col8-checkbox').checked,
        8: document.getElementById('col9-checkbox').checked,
        9: document.getElementById('col10-checkbox').checked,
        10: document.getElementById('col11-checkbox').checked,
        11: document.getElementById('col12-checkbox').checked,
        12: document.getElementById('col13-checkbox').checked,
        13: document.getElementById('col14-checkbox').checked,
        14: document.getElementById('col15-checkbox').checked,
        15: document.getElementById('col16-checkbox').checked
    };

    table.querySelectorAll('tr').forEach(row => {
        row.querySelectorAll('th, td').forEach((cell, index) => {
            cell.style.display = checkboxes[index] ? '' : 'none';
        });
    });
}

window.addEventListener('load', updateColumnVisibility);

function editJob(jobId) {
    fetch(`/api/job/${jobId}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
            
        })
        .then(job => {
            const jobNoInput = document.getElementById('edit-jobNo');
            const booNameInput = document.getElementById('edit-bookName');
            const customerInput = document.getElementById('edit-customer');
            const idInput = document.getElementById('edit-id');

            jobNoInput.value = job.jobNo;
            booNameInput.value = job.bookName;
            customerInput.value = job.customer;
            idInput.value = job.id;
        })
        .catch(error => {
            console.error('Error fetching job:', error);
        });
}


function update(event){
    event.preventDefault();
    const updateId = document.getElementById('edit-id').value;
    const jobNo = document.getElementById('edit-jobNo').value;
    const bookName = document.getElementById('edit-bookName').value;
    const customer = document.getElementById('edit-customer').value;

    const data = {
        id: updateId,
        jobNo: jobNo,
        bookName: bookName,
        customer: customer
    };

    fetch('/api/update-job', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(result => {
        console.log('Data updated successfully:', result);
        refreshPage();
    })
    .catch(error => {
        console.error('Error updating status:', error);
    });
}

function refreshPage() {
    window.location.reload();
}

function deleteJob(jobId) {
    alert('This function is still under development. Please contact the developer. (THARUUX)');
}