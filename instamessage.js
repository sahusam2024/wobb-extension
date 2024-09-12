function showMessage() {
  // Create the overlay
  const overlay = document.createElement('div');
  overlay.style.position = 'fixed';
  overlay.style.top = '0';
  overlay.style.right = '0';
  overlay.style.width = '100%';
  overlay.style.height = '100%';
  overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
  overlay.style.zIndex = '99999999999';

  // Create the alert box
  const alertBox = document.createElement('div');
  alertBox.style.backgroundColor = '#fff';
  alertBox.style.boxShadow = '0 0 10px rgba(0, 0, 0, 0.1)';
  alertBox.style.padding = '20px';
  alertBox.style.textAlign = 'center';
  alertBox.style.width = '500px';
  alertBox.style.marginLeft = 'auto';
  alertBox.style.fontFamily = '"Poppins", sans-serif'; // Use Google Font Poppins

  // Add Google Font stylesheet to the document head
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = 'https://fonts.googleapis.com/css2?family=Poppins:wght@400;600&display=swap';
  document.head.appendChild(link);

  // Create the heading
  const heading = document.createElement('h2');
  heading.textContent = 'Wobb.ai';
  heading.style.marginTop = '0';
  heading.style.color = '#0026FF'; // Change heading color
  heading.style.fontSize = '24px'; // Adjust font size if needed
 

  // Create the message
  const message = document.createElement('p');
  message.textContent = 'You need to open a profile of the user inside Instagram to see their profile analysis.';
  message.style.marginBottom = '20px';
  message.style.color = '#666';
  message.style.width = '80%';
  message.style.margin = 'auto';
  message.style.fontSize = '16px'; // Adjust font size if needed
  message.style.marginTop = '20px';

  // Create the close button
  const closeButton = document.createElement('button');
  closeButton.textContent = 'Close';
  closeButton.style.padding = '10px 20px';
  closeButton.style.border = 'none';
  closeButton.style.backgroundColor = '#0026FF';
  closeButton.style.color = '#fff';
  closeButton.style.borderRadius = '4px';
  closeButton.style.cursor = 'pointer';
  closeButton.style.fontFamily = '"Poppins", sans-serif';  // Use Google Font Poppins
  closeButton.style.marginTop = '20px';

  window.messageScriptLoaded = true;

  // Add event listener to close button
  closeButton.addEventListener('click', () => {
    document.body.removeChild(overlay);
    window.messageScriptLoaded = false;
  });

  // Append elements
  alertBox.appendChild(heading);
  alertBox.appendChild(message);
  alertBox.appendChild(closeButton);
  overlay.appendChild(alertBox);
  document.body.appendChild(overlay);
}

// Execute the function to show the alert
showMessage();
