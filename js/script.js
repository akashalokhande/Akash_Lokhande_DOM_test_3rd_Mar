document.addEventListener('DOMContentLoaded', function () {
    const ipSpan = document.getElementById('ip');
    const latitudeSpan = document.getElementById('latitude');
    const longitudeSpan = document.getElementById('longitude');
    const citySpan = document.getElementById('city');
    const regionSpan = document.getElementById('region');
    const timezoneSpan = document.getElementById('timezone');
    const getDataBtn = document.getElementById('getDataBtn');
    const mapDiv = document.getElementById('map');
    const postOfficeList = document.getElementById('postOfficeList');
    const searchBox = document.getElementById('searchBox');

    // Function to fetch user's IP address
    async function getUserIP() {
        const response = await fetch('https://api64.ipify.org?format=json');
        const data = await response.json();
        return data.ip;
    }

    // Function to get user's location details
    async function getLocationDetails(ip) {
        const response = await fetch(`https://ipinfo.io/${ip}/geo`);
        const data = await response.json();
        return data;
    }

    // Function to get time zone
    async function getTimeZone(timezone) {
        const date = new Date().toLocaleString("en-US", {timeZone: timezone});
        return date;
    }

    // Function to get post offices by pincode
    async function getPostOffices(pincode) {
        const response = await fetch(`https://api.postalpincode.in/pincode/${pincode}`);
        const data = await response.json();
        return data;
    }

    // Event listener for Get Data button click
    getDataBtn.addEventListener('click', async () => {
        const userIP = await getUserIP();
        ipSpan.textContent = userIP;
        
        const locationDetails = await getLocationDetails(userIP);
        latitudeSpan.textContent = locationDetails.loc.split(',')[0];
        longitudeSpan.textContent = locationDetails.loc.split(',')[1];
        citySpan.textContent = locationDetails.city;
        regionSpan.textContent = locationDetails.region;
        timezoneSpan.textContent = locationDetails.timezone;

        const mapUrl = `https://maps.google.com/maps?q=${locationDetails.loc}&output=embed`;
        mapDiv.innerHTML = `<iframe width="600" height="450" frameborder="0" style="border:0;padding:2rem; background-color: black;" src="${mapUrl}" allowfullscreen></iframe>`;

        const currentTime = await getTimeZone(locationDetails.timezone);
        console.log(currentTime); // Display the current time in the console

        const pincode = locationDetails.postal;
        const postOffices = await getPostOffices(pincode);
        if (postOffices[0].Status === "Success") {
            postOffices[0].PostOffice.forEach(postOffice => {
                const li = document.createElement('li');
                li.textContent = `${postOffice.Name} - ${postOffice.BranchType}`;
                postOfficeList.appendChild(li);
            });
        }
    });

    // Event listener for search box
    searchBox.addEventListener('input', function () {
        const searchValue = searchBox.value.toLowerCase();
        const postOfficeItems = postOfficeList.querySelectorAll('li');
        postOfficeItems.forEach(item => {
            const text = item.textContent.toLowerCase();
            if (text.includes(searchValue)) {
                item.style.display = 'block';
            } else {
                item.style.display = 'none';
            }
        });
    });
});
