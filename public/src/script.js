document.addEventListener('DOMContentLoaded', function () {
    if (window.location.pathname === '/') {
        fetchData();
    }

    const path = window.location.pathname;
    const main = document.getElementById('main');
    const jobDetails = document.getElementById('job-details');

    if (path.startsWith('/job/')) {
        fetchJobDetails();
        console.log('Fetching job details');

        if (main) main.classList.add('hidden');
        if (jobDetails) jobDetails.classList.remove('hidden');
    } else {
        if (jobDetails) jobDetails.classList.add('hidden');
        if (main) main.classList.remove('hidden');
    }
});

function upload(event) {
    event.preventDefault();
    const jobNo = document.getElementById('ji-job-no').value;
    const bookName = document.getElementById('ji-book-name').value;
    const customer = document.getElementById('ji-customer').value;

    if (!jobNo || !bookName || !customer) {
        alert('Please fill out all fields.');
        return;
    }

    fetch('/api/upload', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ jobNo, bookName, customer })
    })
    .then(response => response.json())
    .then(data => {
        console.log('Success:', data);
        alert('Data successfully uploaded!');
        refreshPage();
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

function fetchData() {
    fetch('/api/jobs')
        .then(response => response.json())
        .then(data => {
            const jobList = document.getElementById('job_list');

            if (!jobList) {
                console.error('No job-list element found in the DOM');
                return;
            }

            jobList.innerHTML = '';

            data.forEach(job => {
                const jobItem = document.createElement('div');
                jobItem.classList.add('job', 'bg-slate-50', 'hover:bg-slate-100', 'flex', 'px-3', 'py-2', 'rounded-lg', 'shadow-sm', 'ease-in-out', 'duration-300', 'cursor-pointer');
                jobItem.innerHTML = `
                    <div class="grow">
                        <div class="book-name text-lg text-lime-800">${job.bookName}</div>
                        <div class="customer text-sm text-lime-700">${job.customer}</div>
                        <div class="time text-xs text-lime-600">${new Date(job.created_at).toLocaleString()}</div>
                    </div>
                    <div class="job-status text-xs text-lime-500 p-2">${job.status}</div>
                `;
                jobItem.onclick = () => fetchJobDetails(job.id);
                jobList.appendChild(jobItem);
            });
        })
        .catch(error => {
            console.error('Error fetching jobs:', error);
        });
}

function fetchJobDetails(jobId) {
    const main = document.getElementById('main');
    const jobDetails = document.getElementById('job-details');

    if (main) main.classList.add('hidden');
    if (jobDetails) jobDetails.classList.remove('hidden');

    fetch(`/api/job/${jobId}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(job => {
            const jobDetailsDiv = document.getElementById('job-details');

            if (!jobDetailsDiv) {
                console.error('No job-details element found in the DOM');
                return;
            }

            jobDetailsDiv.innerHTML = `
                <div class="w-100 text-wrap text-lime-800 text-xl mt-2 px-3">Book: ${job.bookName}</div>
                <div class="w-100 text-wrap text-lime-700 px-3">Customer: ${job.customer}</div>
                <div class="w-100 text-wrap text-lime-700 px-3 mb-2">Created at: ${new Date(job.created_at).toLocaleString()}</div>
                <hr>
                <div class="w-100 px-3 my-2">
                    <div class="text-lime-800">Printing Status</div>
                    ${generateStatusCheckboxes(job)}
                </div>
            `;
        })
        .catch(error => {
            console.error('Error fetching job:', error);
            jobDetails.innerHTML = `<p class="text-red-600">Error loading job details. Please try again later.</p>`;
        });
}

function generateStatusCheckboxes(job) {
    const statuses = [
        { label: 'Inner', key: 'pInner' },
        { label: 'Cover', key: 'pCover' },
        { label: 'Laminating', key: 'Laminating' },
        { label: 'Folding', key: 'Folding' },
        { label: 'Gathering', key: 'Gathering' },
        { label: 'Binding', key: 'Binding' },
        { label: 'Center Wiring', key: 'centerWiring' },
        { label: 'Cutting', key: 'cutting' },
        { label: 'Packing', key: 'packing' },
        { label: 'Delivery', key: 'delivery' },
        { label: 'Invoice', key: 'Invoice' }
    ];

    return statuses.map(status => `
        <div class="flex w-100 px-3 text-lime-800 py-2 my-1">
            <div class="grow">${status.label}</div>
            <div>
                <input onchange="updateStatus(${job.id}, '${status.key}')" type="checkbox" id="${status.key}" ${job[status.key] ? 'checked' : ''}>
            </div>
        </div>
    `).join('');
}


function refreshPage() {
    window.location.reload();
}

function updateStatus(jobId, statusType) {
    const checkbox = document.getElementById(statusType);
    const statusValue = checkbox.checked;

    const data = {
        id: jobId,
        [statusType]: statusValue
    };

    fetch('/api/update-job-status', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(result => {
        console.log('Status updated successfully:', result);
    })
    .catch(error => {
        console.error('Error updating status:', error);
    });
}

function search(element) {
    const query = element.value.toLowerCase();
    const jobItems = document.querySelectorAll('.job');

    jobItems.forEach(item => {
        const bookName = item.querySelector('.book-name').textContent.toLowerCase();
        const customer = item.querySelector('.customer').textContent.toLowerCase();

        if (bookName.includes(query) || customer.includes(query)) {
            item.classList.remove('hidden');
        } else {
            item.classList.add('hidden');
        }
    });
};
