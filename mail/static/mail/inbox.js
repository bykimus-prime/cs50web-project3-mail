// runs javascript after html has all loaded, to prevent issues
document.addEventListener('DOMContentLoaded', function() {

   // Use buttons to toggle between views
   document.querySelector('#inbox').addEventListener('click', () => load_mailbox('inbox'));
   document.querySelector('#sent').addEventListener('click', () => load_mailbox('sent'));
   document.querySelector('#archived').addEventListener('click', () => load_mailbox('archive'));
   document.querySelector('#compose').addEventListener('click', compose_email);

   // submit handler
   document.querySelector('#compose-form').addEventListener('submit', send_email);

   // By default, load the inbox
   load_mailbox('inbox');
});

function compose_email() {

   // Show compose view and hide other views
   document.querySelector('#emails-view').style.display = 'none';
   document.querySelector('#compose-view').style.display = 'block';

   // Clear out composition fields
   document.querySelector('#compose-recipients').value = '';
   document.querySelector('#compose-subject').value = '';
   document.querySelector('#compose-body').value = '';
}

function load_mailbox(mailbox) {

   // Show the mailbox and hide other views
   document.querySelector('#emails-view').style.display = 'block';
   document.querySelector('#compose-view').style.display = 'none';

   // Show the mailbox name
   document.querySelector('#emails-view').innerHTML = `<h3>${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)}</h3>`;

   // get emails for mailbox and user
   fetch(`/emails/${mailbox}`)
      .then(response => response.json())
      .then(emails => {
         // loop through emails and create div for each
         emails.forEach(singleEmail => {
            // create div for each email
            const newEmail = document.createElement('div');
            newEmail.className = "list-group-item";
            newEmail.innerHTML = `
               <h5>Sender: ${singleEmail.sender}</h5>
               <h4>Subject: ${singleEmail.subject}</h4>
               <p>${singleEmail.timestamp}</p>
               <p>${singleEmail.read}</p>
            `;
            // change background color if email is read or not
            // if statement format: if singleEmail.read is true (?) then change class to read, else (:) change to unread style
            newEmail.className = singleEmail['read'] ? 'read': 'unread';
            // Add click event to view email
            newEmail.addEventListener('click', function () {
               console.log('This element has been clicked!')
            });
            document.querySelector('#emails-view').append(newEmail);
            // doesn't work in firefox with css, so had to do this? because of bootstrap and initial distribution?
            document.querySelector('.read').style.backgroundColor = 'lightgreen';
            document.querySelector('.unread').style.backgroundColor = 'lightblue';
         })
      });
}

function send_email(event) {
   // prevent from loading too fast and not running the console.log
   event.preventDefault();
   
   // store fields
   const recipients = document.querySelector('#compose-recipients').value;
   const subject = document.querySelector('#compose-subject').value;
   const body = document.querySelector('#compose-body').value;

   // send data to backend
   fetch('/emails', {
      method: 'POST',
      body: JSON.stringify({
         recipients: recipients,
         subject: subject,
         body: body
      })
   })
      .then(response => response.json())
      .then(result => {
         // Print result
         console.log(result);
         load_mailbox('sent');
      });
}

