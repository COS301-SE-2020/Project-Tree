const notificationHandler = require('../api/notificationApi/notificationHandler');

test('Should return ids of recipients sent to function as an array', () => {
    let data = [{id:1, email:'will@'}, {id:2, email:'damian@'}, {id:3, email:'brandon@'}]
    expect(notificationHandler.getIds(data)).toStrictEqual([1, 2, 3]);
});

test('Should return ids of recipients sent to function as an array (Epmty array sent, empty array sent back expected)', () => {
    let data = []
    expect(notificationHandler.getIds(data)).toStrictEqual([]);
});

test('Should return emails of recipients sent to function as an array', () => {
    let data = [{id:1, email:'will@'}, {id:2, email:'damian@'}, {id:3, email:'brandon@'}]
    expect(notificationHandler.getEmails(data)).toStrictEqual("will@,damian@,brandon@");
});

test('Should return emails of recipients sent to function as an array (Epmty array sent, empty array sent back expected)', () => {
    let data = []
    expect(notificationHandler.getEmails(data)).toStrictEqual("");
});

test('x', () => {
    let packMan = [
        {
            id: 312,
            name: 'William',
            surname: 'Agar',
            email: 'wda199@',
            profilePicture: 'storage/default.jpg'
        }
    ]

    let resPer =  [
        {
            id: 299,
            name: 'Amber',
            surname: 'Grill',
            email: 'u1816@',       
            profilePicture: 'storage/default.jpg'
        }
    ]

    let res = [
        {
            id: 307,
            name: 'Damiian',
            surname: 'Venter',
            email: 'u1807@',
            profilePicture: 'storage/default.jpg'
        },
        {
            id: 199,
            name: 'Dayne',
            surname: 'Michael',
            email: 'daynemoon@',
            profilePicture: 'storage/default.jpg'
        }
    ]

    let data = {
        timestamp: '2020-08-18T10:20:40.700Z',
        projName: 'Project William_',
        projID: 303,
        taskName: 'Task check',
        type: 'auto',
        mode: 0
    }

    expect(notificationHandler.formatAutoAssignData(packMan, resPer, res, data)).toStrictEqual({
        "packMan": {
            "fromName": "Project Tree", 
            "message": "You have been assigned as a package manager to task: Task check", 
            "mode": 2, 
            "projID": 303, 
            "projName": "Project William_", 
            "recipients": [{"email": "wda199@", "id": 312}], 
            "taskName": undefined, 
            "timestamp": "2020-08-18T10:20:40.700Z", 
            "type": "auto"
        }, 
        "res": {
            "fromName": "Project Tree", 
            "message": "You have been assigned as a resource to task: Task check", 
            "mode": 2, 
            "projID": 303, 
            "projName": "Project William_", 
            "recipients": [{"email": "u1807@", "id": 307}, {"email": "daynemoon@", "id": 199}], 
            "taskName": undefined, "timestamp": "2020-08-18T10:20:40.700Z", 
            "type": "auto"
        }, 
        "resPer": {
            "fromName": "Project Tree", 
            "message": "You have been assigned as a responsible person to task: Task check", 
            "mode": 2, 
            "projID": 303, 
            "projName": "Project William_", 
            "recipients": [{"email": "u1816@", "id": 299}], 
            "taskName": undefined, 
            "timestamp": "2020-08-18T10:20:40.700Z", 
            "type": "auto"
        }
    });
});

