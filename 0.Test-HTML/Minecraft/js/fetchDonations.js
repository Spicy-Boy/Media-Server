console.log('Fetching donations from api.......');

async function fetchDonations()
{
    const route = "http://localhost:8080/api/donations/getDonations";

    try 
    {
        const response = await fetch(route);

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
        const dateUploaded = donation.created;
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
            a.setAttrivute('data-img-width', donation.imgWidth);
        }


    });
}

fetchDonations();

