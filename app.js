// app.js

const challenges = [
    { id: 1, text: "Post a picture of your breakfast with a funny caption!" },
    { id: 2, text: "Share a photo of your favorite hobby." },
    { id: 3, text: "Post a picture of your pet doing something funny." },
  ];
  
  // Function to display challenges
  function displayChallenges() {
    const challengeList = document.getElementById('challenge-list');
    const challengeSelect = document.getElementById('challenge-select');
  
    challenges.forEach(challenge => {
      const challengeItem = document.createElement('div');
      challengeItem.innerHTML = `<p>${challenge.text}</p>`;
      challengeList.appendChild(challengeItem);
  
      // Add challenge to the select dropdown
      const option = document.createElement('option');
      option.value = challenge.id;
      option.textContent = challenge.text;
      challengeSelect.appendChild(option);
    });
  }
  
  // Function to submit a challenge response
  document.getElementById('submit-btn').addEventListener('click', function () {
    const userName = document.getElementById('user-name').value.trim();
    const imageFile = document.getElementById('image-upload').files[0];
    const selectedChallengeId = document.getElementById('challenge-select').value;
  
    if (userName === '') {
      alert('Please enter your name!');
      return;
    }
  
    if (!imageFile) {
      alert('Please upload an image!');
      return;
    }
  
    const reader = new FileReader();
    reader.onload = function (e) {
      const submission = {
        name: userName,
        image: e.target.result,
        challengeId: selectedChallengeId,
      };
  
      saveSubmission(submission);
      displaySubmissions();
      
      // Clear input fields
      document.getElementById('user-name').value = '';
      document.getElementById('image-upload').value = '';
      document.getElementById('challenge-select').value = challenges[0].id; // Reset to first challenge
    };
  
    reader.readAsDataURL(imageFile);
  });
  
  // Function to save submission to local storage
  function saveSubmission(submission) {
    const submissions = JSON.parse(localStorage.getItem('submissions')) || [];
    submissions.push(submission);
    localStorage.setItem('submissions', JSON.stringify(submissions));
  }
  
  // Function to display all submissions
  function displaySubmissions() {
    const submissionList = document.getElementById('submission-list');
    submissionList.innerHTML = ''; // Clear previous submissions
    const submissions = JSON.parse(localStorage.getItem('submissions')) || [];
  
    submissions.forEach(sub => {
      const submissionItem = document.createElement('div');
      submissionItem.innerHTML = `
        <strong>${sub.name}</strong> - Challenge ID: ${sub.challengeId}<br>
        <img src="${sub.image}" alt="${sub.name}'s submission" style="max-width: 100px; max-height: 100px;"/>
      `;
      submissionList.appendChild(submissionItem);
    });
  }
  
  // Initialize app
  window.onload = function () {
    displayChallenges();
    displaySubmissions();
  };
  