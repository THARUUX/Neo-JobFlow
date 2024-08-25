function fetchJobDetails() {
    const jobId = window.location.pathname.split('/').pop(); // Get the last part of the URL

    fetch(`/api/job/${jobId}`)
        .then(response => response.json())
        .then(job => {
            const jobDetailsDiv = document.getElementById('job-details');

            if (!jobDetailsDiv) {
                console.error('No job-details element found in the DOM');
                return;
            }

            // Insert job details into the HTML
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

