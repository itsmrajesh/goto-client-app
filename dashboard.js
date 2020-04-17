
const base_url = 'https://api.getgo.com/G2M/rest';

const previousMeetingBtn = document.querySelector("#previousMeeting");

const create = document.querySelector("#createMeeting");

create.addEventListener('click', (event) => {
    event.preventDefault();
    const meetingForm = document.querySelector("#createMeetingFrom");
    let subject = meetingForm.subject.value;
    let sDate = meetingForm.startDate.value;
    let sTime = meetingForm.startTime.value;
    let eDate = meetingForm.endDate.value;
    let eTime = meetingForm.endTime.value;
    let pwdReq = meetingForm.pwdReq.value;
    let cc = meetingForm.cc.value;
    let meetingType = meetingForm.meetingType.value;
    let keys = meetingForm.okey.value;
    let coorganizerKeys = [];

    if (keys.length > 0 && keys.split(",").length >= 0) {
        coorganizerKeys = keys.split(",");
    }


    console.log(subject, sDate, sTime, eDate, eTime, pwdReq, cc, meetingType, coorganizerKeys);

    pwdReq = (pwdReq === 'true'); // converting to boolean



    let arr = getDate(sDate, sTime);

    let startDateTimeObj = new Date(arr[0], arr[1], arr[2], arr[3], 0, 0);
    let startDateTime = startDateTimeObj.toISOString();

    arr = getDate(eDate, eTime);

    let endDateTimeObj = new Date(arr[0], arr[1], arr[2], arr[3], 0, 0);
    let endDateTime = endDateTimeObj.toISOString();

    const meetingObj = {
        "subject": subject,
        "starttime": startDateTime,
        "endtime": endDateTime,
        "passwordrequired": pwdReq,
        "conferencecallinfo": cc,
        "timezonekey": '',
        "meetingtype": meetingType,
        "coorganizerKeys": coorganizerKeys
    }

    console.log(meetingObj);
    meetingForm.reset();
    createMeeting(meetingObj);

})

function getAccessToken() {
    let accessToken = localStorage.getItem('accessToken');
    if (accessToken)
        return accessToken;
    else
        window.location.href = "index.html";
}


function getHeaders() {
    const header = new Headers();
    header.append('Accept', 'application/json');
    header.append("Authorization", `${getAccessToken()}`);
    header.append('Content-Type', 'application/json');
    return header;
}


function createMeeting(meetingObj) {
    fetch(`${base_url}/meetings`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(meetingObj),
    })
        .then((response) => response.json())
        .then((data) => {
            console.log('Success:', data);
            getUpcomingMeetings();
            alert("Meeting Created Successfully..");
        })
        .catch((error) => {
            console.error('Error:', error);
        });
}

function getUpcomingMeetings() {
    fetch(`${base_url}/upcomingMeetings`, {
        method: 'GET',
        headers: {
            'accept': 'application/json',
            'Authorization': getAccessToken()
        },
    })
        .then((response) => response.json())
        .then((data) => {
            console.log('Success:', data);
            try {
                paintToUI(data)
            } catch (error) {
                generateNewAccessToken();
                getUpcomingMeetings();
            }
        })
        .catch((error) => {
            console.error('Error:', error);
        });
}



function paintToUI(myData) {

    let str = '';

    myData.forEach(obj => {
        let subject = obj.subject;
        let meetingID = obj.meetingId;
        let pwdReq = obj.passwordRequired;
        let meetingType = obj.meetingType;
        let st = obj.startTime;
        let et = obj.endTime;
        let meetingLink = `https://global.gotomeeting.com/join/${meetingID}`;
        str += `<tr> 
        <td onclick="startMeetingByID('${meetingID}')"> ${subject} <i class="fa fa-play-circle"></i></td> 
        <td onclick="viewMeetingInfo('${meetingID}')"s> ${meetingID} <i class="fa fa-info-circle" style="color:blue"></i></td>
        <td> ${pwdReq} </td>
        <td> ${meetingType} </td>
        <td> ${st} </td> 
        <td> ${et} </td>
        <td> <i class="fa fa-trash" style="font-size:25px;color:red" onclick="deleteMeetingByID('${meetingID}')"></i> </td>
        </tr>`;
    })

    //<button class="btn btn-info btn-sm" onclick = "copyURL('${meetingLink}')" > Copy URL</button>

    document.querySelector("#tBody").innerHTML = str;

}


function copyURL(url) {

    let msg = `Join this Meeting via this url ${url}`

    var copyText = document.createElement("input");
    copyText.type = "text";

    copyText.value = msg;

    copyText.select();
    copyText.setSelectionRange(0, 99999); /*For mobile devices*/

    /* Copy the text inside the text field */
    document.execCommand("copy");

    /* Alert the copied text */
    alert("Copied the text: " + copyText.value);

}

function viewMeetingInfo(id) {
    localStorage.setItem("meetingid", id);
    window.location.href = "viewmeetinginfo.html";
}


getUpcomingMeetings();

function getDate(date, time) {
    let arr = [];
    arr = date.split("-");
    time.split(":").forEach(ele => {
        arr.push(ele);
    })
    return arr;
}

function deleteMeetingByID(id) {
    let status = confirm(`Are you sure to delete this meeting with ID ${id}`);
    if (status) {
        fetch(`${base_url}/meetings/${id}`, {
            method: 'DELETE',
            headers: {
                'accept': 'application/json',
                'Authorization': getAccessToken()
            },
        }).then(res => {
            alert("Meeting Deleted successfully")
            getUpcomingMeetings();
        }).catch(error => {
            getUpcomingMeetings();
        })
    }
}

function startMeetingByID(id) {
    let status = confirm(`Do you like to start meeting with ID ${id}`);
    if (status) {
        fetch(`${base_url}/meetings/${id}/start`, {
            method: 'GET',
            headers: {
                'accept': 'application/json',
                'Authorization': getAccessToken()
            },
        }).then((response) => response.json())
            .then((data) => {
                console.log(data)
                let hostURL = data.hostURL;
                if (hostURL && hostURL !== '') {
                    window.open(hostURL, '_blank');
                }else{
                    alert("Not able start meeting")
                }
            })
            .catch((error) => {
                console.log('Error', error);
            })
    }
}