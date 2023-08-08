
console.log("a")
$(document).ready(function() {
    const photoGallery = $('.photo-gallery');
    const indicators = $('.carousel-indicators');
    const searchInput = $('#search');
    const viewAllButton = $('#viewAll');

    // Function to fetch and display photos
    function fetchPhotos() {
        $.get('/api/photos', function(photos) {
            photoGallery.empty();
            var count = 0;
            photos.forEach(photo => {
                let indicator = $(``)
                const title =  $(`<h5 class="card-title">${photo.title}</h5>`);
                let item =  $(`<div class="carousel-item"></div>`)
                if(count == 0){
                    item = $(`<div class="carousel-item active photos"></div>`);
                    indicator = $(`<li data-target="#photo-gallery" data-slide-to="${count}" class="active"></li>`)
                }else{
                    item = $(`<div class="carousel-item photos"></div>`);
                    indicator = $(`<li data-target="#photo-gallery" data-slide-to="${count}"></li>`)
                }
                indicators.append(indicator)
                const card = $(`<div class="photos"></div>`);
                card.append(`
                    <div class="photo-card">
                        <img class="card-img-top" src="${photo.before_path}"  alt="${photo.title}">
                        <div class="card-body">
                            <p><strong>Method Used (Before):</strong> ${photo.before_method}</p>
                            <p><strong>Description (Before):</strong> ${photo.before_description}</p>
                            <button class="btn btn-primary view-details" data-id="${photo.id}">View Details</button>
                        </div>
                    </div>
                `);                
                card.append(`
                <div class="photo-card">
                    <img class="card-img-top" src="${photo.after_path}" alt="${photo.title}">
                    <div class="card-body">
                        <p><strong>Method Used (Before):</strong> ${photo.after_method}</p>
                        <p><strong>Description (Before):</strong> ${photo.after_description}</p>
                        <button class="btn btn-primary view-details" data-id="${photo.id}">View Details</button>
                    </div>
                </div>`);
                item.append(title)
                item.append(card)

                photoGallery.append(item);
                count ++;
            });
        });
    }

    // Fetch and display photos on page load
    fetchPhotos();

    /* Function to filter photos by search input
    function filterPhotos(searchValue) {
        const filteredPhotos = photos.filter(photo => {
            return photo.title.toLowerCase().includes(searchValue.toLowerCase());
        });
        renderPhotos(filteredPhotos);
    }

    /* Load all photos on page load

    // Search functionality
    searchInput.on('input', function() {
        const searchValue = $(this).val();
        filterPhotos(searchValue);
    });*/

    // View all photos button
    viewAllButton.on('click', function() {
        renderPhotos(photos);
    });

    // Mock admin access check
    const isAdmin = confirm('Are you an admin?');
    if (isAdmin) {
        $('.btn-primary').show(); // Show admin button
        // Handle admin button click
        $('.btn-primary').on('click', function() {
            // Redirect to admin page (you can implement this as needed)
            window.location.href = '/admin';
        });
    }
});
