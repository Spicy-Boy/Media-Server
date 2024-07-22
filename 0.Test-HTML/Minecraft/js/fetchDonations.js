console.log('Fetching donations from api.......');

const route = "/api/donations/getDonations";
const base = "http://localhost:8080";

async function fetchDonations()
{
    try 
    {
        const response = await fetch(base+route);

        if (!response.ok)
        {
            throw new Error("Failed to fetch donations! Try reloading the page!");
        }

        const data = await response.json();

        console.log(data);
        createDonationCards(data.payload);
    }
    catch(error)
    {
        console.error("Error fetching donations!",error)
    }
}

async function createDonationCards(donations)
{
    //STEP 1: update totals and do breakdown math!
    let totalPrize = 0;
    donations.forEach((donation) => {
        totalPrize += donation.amount;
    });

    const poolTotal = document.getElementById('pool-total');
    poolTotal.textContent = "$"+totalPrize;
    
    const first = document.getElementById('pool-1st');
    const second = document.getElementById('pool-2nd');
    const third = document.getElementById('pool-3rd');
    const special = document.getElementById('special-prize');

    console.log(first,second,third,special);

    first.textContent = "$"+(totalPrize*.45).toFixed(2);
    second.textContent = "$"+(totalPrize*.30).toFixed(2);
    third.textContent = "$"+(totalPrize*.15).toFixed(2);
    special.textContent = "$"+(totalPrize*.10).toFixed(2);

    //STEP 2: create dom elements for individual donation cards!

    donations.forEach((donation) => {

        const donationBox = document.getElementById('donation-box');

        const donationCard = document.createElement('div');
        donationCard.className = "donation";

        const pOne = document.createElement('p');
        pOne.textContent = donation.name+" donated $"+donation.amount;
        donationCard.append(pOne);

        const pTwo = document.createElement('p');
        //set up date properly
        const dateUploaded = new Date(donation.created);
        let month = dateUploaded.getMonth() + 1;
        let day = dateUploaded.getDate();
        let year = dateUploaded.getFullYear();
        let calendarDate = `${month}/${day}/${year}`;
        pTwo.textContent = calendarDate;
        donationCard.append(pTwo);

        //only append an image to the card if such a thing exists!
        if (donation.img)
        {
            const imageLink = document.createElement('a');
            imageLink.className = "image-enlargement";
            imageLink.setAttribute('data-img-width', donation.imgWidth);
            imageLink.setAttribute('data-img-height', donation.imgWidth);
            imageLink.href = "#";

            const imgElement = document.createElement('img');
            imgElement.src = base+"/images/donation-images/"+donation.img;
            imgElement.className = "post-thumbnail";
            
            imageLink.append(imgElement);
            donationCard.append(imageLink);
        }

        pThree = document.createElement('p');
        pThree.className = "post-message";
        pThree.textContent = donation.message;
        donationCard.append(pThree);

        donationBox.append(donationCard);

    });

    const enlargeImageScript = document.createElement("script");
    enlargeImageScript.src = "js/enlargeImage.js";
    enlargeImageScript.onload = () => {
        console.log('Executing enlargeImage script');
    }
    document.head.appendChild(enlargeImageScript);
}

fetchDonations();

