document.addEventListener('DOMContentLoaded', function () {
    if (window.location.pathname === '/index') {
        fetchData();
    } else if (window.location.pathname === '/'){
        window.location.href = '/index';
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
    loaderHandling('show');
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
        //alert('Data successfully uploaded!');
        refreshPage();
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

function fetchData() {
    loaderHandling('show');
    
    fetch('/api/jobs')
        .then(response => response.json())
        .then(data => {
            const jobList = document.getElementById('job_list');
            const inProgressCountElement = document.getElementById('in-progress');
            const finishedCountElement = document.getElementById('finished');

            if (!jobList) {
                console.error('No job-list element found in the DOM');
                return;
            }

            const jobs = data || [];

            const inProgressJobs = jobs.filter(job => job.status == 0);
            const finishedJobs = jobs.filter(job => job.status == 1);

            if (inProgressCountElement) {
                inProgressCountElement.innerHTML = inProgressJobs.length;
            }
            if (finishedCountElement) {
                finishedCountElement.innerHTML = finishedJobs.length;
            }

            jobs.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

            jobList.innerHTML = '';

            jobs.forEach(job => {
                const classFinished = job.status == 1 ? 'bg-lime-200' : 'bg-slate-50';

                const jobItem = document.createElement('div');
                jobItem.classList.add(
                    'job',
                    classFinished,
                    'hover:bg-slate-100',
                    'flex',
                    'px-3',
                    'py-2',
                    'rounded-lg',
                    'shadow-sm',
                    'ease-in-out',
                    'duration-300',
                    'cursor-pointer'
                );

                jobItem.innerHTML = `
                    <div class="grow">
                        <div class="book-name text-lg text-lime-800">${job.bookName}</div>
                        <div class="customer text-sm text-lime-700">${job.customer}</div>
                        <div class="time text-xs text-lime-600">${new Date(job.created_at).toLocaleString()}</div>
                    </div>
                    <div class="job-status text-xs text-lime-500 p-2">
                        ${job.status == 1 ? 'Finished' : 'In Progress'}
                    </div>
                `;

                jobItem.onclick = () => fetchJobDetails(job.id);

                jobList.appendChild(jobItem);
            });

            loaderHandling('hide');
        })
        .catch(error => {
            console.error('Error fetching jobs:', error);
            loaderHandling('hide'); 
        });
}

function fetchJobDetails(jobId) {
    const main = document.getElementById('main');
    const jobDetails = document.getElementById('job-details');
    const back = document.getElementById('back');

    if (main) main.classList.add('hidden');
    if (jobDetails) jobDetails.classList.remove('hidden');
    if (back) back.classList.remove('hidden');

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
                    <div class="text-lime-800 px-3">Printing Status</div>
                    <div class="flex w-100 pr-3 pl-5 text-lime-700 py-2 my-1">
                        <div class="grow">Inner</div>
                        <div><input class="check-box" onchange="updateStatus(${job.id}, 'pInner')" type="checkbox" id="pInner" ${job.pInner ? 'checked' : ''}></div>
                    </div>
                    <div class="flex w-100 pr-3 pl-5 text-lime-700 py-2 my-1">
                        <div class="grow">Cover</div>
                        <div><input class="check-box" onchange="updateStatus(${job.id}, 'pCover')" type="checkbox" id="pCover" ${job.pCover ? 'checked' : ''}></div>
                    </div>
                    <div class="flex w-100 px-3 text-lime-800 py-2 my-1">
                        <div class="grow">Laminating</div>
                        <div><input class="check-box" onchange="updateStatus(${job.id}, 'Laminating')" type="checkbox" id="Laminating" ${job.Laminating ? 'checked' : ''}></div>
                    </div>
                    <div class="flex w-100 px-3 text-lime-800 py-2 my-1">
                        <div class="grow">Folding</div>
                        <div><input class="check-box" onchange="updateStatus(${job.id}, 'Folding')" type="checkbox" id="Folding" ${job.Folding ? 'checked' : ''}></div>
                    </div>
                    <div class="flex w-100 px-3 text-lime-800 py-2 my-1">
                        <div class="grow">Gathering</div>
                        <div><input class="check-box" onchange="updateStatus(${job.id}, 'Gathering')" type="checkbox" id="Gathering" ${job.Gathering ? 'checked' : ''}></div>
                    </div>
                    <div class="flex w-100 px-3 text-lime-800 py-2 my-1">
                        <div class="grow">Binding</div>
                        <div><input class="check-box" onchange="updateStatus(${job.id}, 'Binding')" type="checkbox" id="Binding" ${job.Binding ? 'checked' : ''}></div>
                    </div>
                    <div class="flex w-100 px-3 text-lime-800 py-2 my-1">
                        <div class="grow">Center Wiring</div>
                        <div><input class="check-box" onchange="updateStatus(${job.id}, 'centerWiring')" type="checkbox" id="centerWiring" ${job.centerWiring ? 'checked' : ''}></div>
                    </div>
                    <div class="flex w-100 px-3 text-lime-800 py-2 my-1">
                        <div class="grow">Cutting</div>
                        <div><input class="check-box" onchange="updateStatus(${job.id}, 'cutting')" type="checkbox" id="cutting" ${job.cutting ? 'checked' : ''}></div>
                    </div>
                    <div class="flex w-100 px-3 text-lime-800 py-2 my-1">
                        <div class="grow">Packing</div>
                        <div><input class="check-box" onchange="updateStatus(${job.id}, 'packing')" type="checkbox" id="packing" ${job.packing ? 'checked' : ''}></div>
                    </div>
                    <div class="flex w-100 px-3 text-lime-800 py-2 my-1">
                        <div class="grow">Delivery</div>
                        <div><input class="check-box" onchange="updateStatus(${job.id}, 'delivery')" type="checkbox" id="delivery" ${job.delivery ? 'checked' : ''}></div>
                    </div>
                    <div class="flex w-100 px-3 text-lime-800 py-2 my-1">
                        <div class="grow">Invoice</div>
                        <div><input class="check-box" onchange="updateStatus(${job.id}, 'Invoice')" type="checkbox" id="Invoice" ${job.Invoice ? 'checked' : ''}></div>
                    </div>
                    <div class="flex w-100 px-3 text-white py-2 mt-3 rounded-lg shadow-md bg-lime-500">
                        <div class="grow text-xl text-bold flex items-center gap-3">Done
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" color="#ffffff" fill="none">
                                <path d="M21.4477 8.2C21.5 9.25014 21.5 10.4994 21.5 12C21.5 16.4783 21.5 18.7175 20.1088 20.1088C18.7175 21.5 16.4783 21.5 12 21.5C7.52166 21.5 5.28249 21.5 3.89124 20.1088C2.5 18.7175 2.5 16.4783 2.5 12C2.5 7.52166 2.5 5.28249 3.89124 3.89124C5.28249 2.5 7.52166 2.5 12 2.5C13.0719 2.5 14.0156 2.5 14.85 2.51908" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
                                <path d="M8 11.5C8 11.5 9.5 11.5 11.5 15C11.5 15 16.5588 5.83333 21.5 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                            </svg>
                        </div>
                        <div><input class="check-box" onchange="updateStatus(${job.id}, 'status')" type="checkbox" id="status" ${job.status == 1 ? 'checked' : ''}></div>
                    </div>
                </div>
            `;
        })
        .catch(error => {
            console.error('Error fetching job:', error);
            jobDetails.innerHTML = `<p class="text-red-600">Error loading job details. <a href='https://wa.me/94789731507'>Please contact the developer.</a></p>`;
        });
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

function check(element){
    checkbox = element.querySelector('.check-box');
    checkbox.checked =!checkbox.checked;
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
