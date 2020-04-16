const base_url = 'https://api.getgo.com/G2M/rest';

let meetingID = localStorage.getItem('meetingid');

let accessCode = localStorage.getItem('accessToken');

function showMeetingInfo() {
    fetch(`${base_url}/meetings/${meetingID}/attendees`, {
        method: 'GET',
        headers: {
            'accept': 'application/json',
            'Authorization': accessCode
        }
    })
        .then((response) => response.json())
        .then((data) => {
            console.log('Success:', data);
            try {
                paintToUI(data)
            } catch (error) {
            }
        })
        .catch((error) => {
            console.error('Error:', error);
        });
}


showMeetingInfo();

function paintToUI(data) {
    
    let str = '';
    data.forEach(obj => {
        let subject = obj.subject;
        let attendeeName = obj.attendeeName;
        let duration = obj.duration;
        let attendeeEmail = obj.attendeeEmail;
        let st = obj.startTime;
        let jt = obj.joinTime;
        let lt = obj.leaveTime;
        let et = obj.endTime;
        str += '<tr>'
        str += `<td> ${subject} </td>
                <td> ${attendeeName} </td>
                <td> ${duration} </td>
                <td> ${attendeeEmail} </td>
                <td> ${st} </td>
                <td> ${jt} </td>
                <td> ${lt} </td>
                <td> ${et} </td>`
        str += '</tr>'        
    })

    document.querySelector("#meetingBody").innerHTML = str;
}