// Create a style element for our custom CSS
const styleElement = document.createElement('style');
styleElement.textContent = `
  .custom-input-field {
    position: absolute;
    min-width: 100px;
    min-height: 20px;
    padding: 0;
    border: 1px dashed rgba(255, 0, 0, 0.3);
    background-color: rgba(255, 0, 0, 0.05);
    resize: both;
    overflow: auto;
    z-index: 1000;
  }
  
  .custom-input-field:hover {
    border: 1px dashed rgba(255, 0, 0, 0.7);
    background-color: rgba(255, 0, 0, 0.1);
  }
  
  /* Add a visible resize handle */
  .custom-input-field::after {
    content: '';
    position: absolute;
    bottom: 0;
    right: 0;
    width: 10px;
    height: 10px;
    background-color: rgba(255, 0, 0, 0.3);
    cursor: nwse-resize;
  }
  
  .custom-button {
    position: absolute;
    width: 80px;
    height: 30px;
    background-color: rgba(150, 150, 150, 0.3);
    color: rgba(255, 255, 255, 0.8);
    border: none;
    cursor: pointer;
    z-index: 1000;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 12px;
  }
  
  .add-button, .export-button {
    position: fixed;
    background-color: rgba(150, 150, 150, 0.3);
    color: rgba(255, 255, 255, 0.5);
    border: none;
    cursor: pointer;
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1001;
  }
  
  .add-button {
    bottom: 20px;
    right: 20px;
    width: 40px;
    height: 40px;
    font-size: 18px;
  }
  
  .export-button {
    bottom: 20px;
    right: 70px;
    width: 70px;
    height: 40px;
    font-size: 14px;
  }
  
  .url-input-container {
    position: fixed;
    bottom: 70px;
    right: 20px;
    display: flex;
    background-color: rgba(150, 150, 150, 0.1);
    padding: 5px;
    z-index: 1001;
    width: 300px;
  }
  
  .url-input-label {
    font-size: 12px;
    color: rgba(150, 150, 150, 0.7);
    margin-right: 5px;
  }
  
  .url-input-field {
    flex-grow: 1;
    border: 1px solid rgba(200, 200, 200, 0.3);
    background-color: rgba(255, 255, 255, 0.1);
    color: rgba(0, 0, 0, 0.8);
    font-size: 12px;
    padding: 3px;
  }
`;
document.head.appendChild(styleElement);

// Create and add the + button
const addButton = document.createElement('button');
addButton.className = 'add-button';
addButton.textContent = '+';
document.body.appendChild(addButton);

// Create export button
const exportButton = document.createElement('button');
exportButton.className = 'export-button';
exportButton.textContent = 'Export';
document.body.appendChild(exportButton);

// Create URL input field
const urlContainer = document.createElement('div');
urlContainer.className = 'url-input-container';

const urlLabel = document.createElement('span');
urlLabel.className = 'url-input-label';
urlLabel.textContent = 'Example URL:';
urlContainer.appendChild(urlLabel);

const urlInput = document.createElement('input');
urlInput.className = 'url-input-field';
urlInput.type = 'text';
urlInput.value = 'https://example.com';
urlInput.placeholder = 'Enter URL for form submission';
urlContainer.appendChild(urlInput);

document.body.appendChild(urlContainer);

// Create submit button
const submitButton = document.createElement('button');
submitButton.className = 'custom-button';
submitButton.textContent = 'Submit';
submitButton.style.top = '80px';
submitButton.style.left = '20px';
document.body.appendChild(submitButton);

// Make the submit button draggable
makeDraggable(submitButton);

// Counter to create unique IDs for input fields
let fieldCounter = 0;

// Add click event to the + button
addButton.addEventListener('click', () => {
  createInputField();
});

// Add click event to the export button
exportButton.addEventListener('click', () => {
  exportFormAsHTML();
});

function createInputField() {
  fieldCounter++;
  
  // Create a container for the input field
  const fieldContainer = document.createElement('div');
  fieldContainer.className = 'custom-input-field';
  fieldContainer.style.top = `${100 + (fieldCounter * 50)}px`;
  fieldContainer.style.left = '100px';
  fieldContainer.style.width = '200px';  // Initial width
  fieldContainer.style.height = '30px';  // Initial height
  
  // Create the actual input field - using a regular input instead of textarea
  const inputField = document.createElement('input');
  inputField.type = 'text';
  inputField.style.width = '100%';
  inputField.style.height = '100%';
  inputField.style.boxSizing = 'border-box';
  inputField.style.border = 'none';
  inputField.style.padding = '5px';
  inputField.style.background = 'transparent';
  inputField.style.outline = 'none';
  fieldContainer.appendChild(inputField);
  
  // Add the field to the document
  document.body.appendChild(fieldContainer);
  
  // Make the field container draggable
  makeDraggable(fieldContainer);
  
  // Focus the new input field
  inputField.focus();
  
  // Add resize observer to adjust input field size when container is resized
  const resizeObserver = new ResizeObserver(() => {
    inputField.style.width = '100%';
    inputField.style.height = '100%';
  });
  
  resizeObserver.observe(fieldContainer);
}

function makeDraggable(element) {
  let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
  
  element.onmousedown = dragMouseDown;
  
  function dragMouseDown(e) {
    // If it's an input element and the user is trying to enter text, don't start dragging
    if (e.target.tagName === 'INPUT') {
      // Only start dragging if the click was very close to the edge of the container
      const rect = element.getBoundingClientRect();
      const edgeThreshold = 10; // pixels from the edge to consider as "edge"
      
      const isNearLeftEdge = e.clientX - rect.left < edgeThreshold;
      const isNearRightEdge = rect.right - e.clientX < edgeThreshold;
      const isNearTopEdge = e.clientY - rect.top < edgeThreshold;
      const isNearBottomEdge = rect.bottom - e.clientY < edgeThreshold;
      
      if (!(isNearLeftEdge || isNearRightEdge || isNearTopEdge || isNearBottomEdge)) {
        return; // Let the user enter text
      }
    }
    
    e.preventDefault();
    // Get the mouse cursor position at startup
    pos3 = e.clientX;
    pos4 = e.clientY;
    document.onmouseup = closeDragElement;
    // Call a function whenever the cursor moves
    document.onmousemove = elementDrag;
  }
  
  function elementDrag(e) {
    e.preventDefault();
    // Calculate the new cursor position
    pos1 = pos3 - e.clientX;
    pos2 = pos4 - e.clientY;
    pos3 = e.clientX;
    pos4 = e.clientY;
    // Set the element's new position
    element.style.top = (element.offsetTop - pos2) + "px";
    element.style.left = (element.offsetLeft - pos1) + "px";
  }
  
  function closeDragElement() {
    // Stop moving when mouse button is released
    document.onmouseup = null;
    document.onmousemove = null;
  }
}

// Function to export the form as an HTML file
function exportFormAsHTML() {
  // Get all input fields
  const inputFields = document.querySelectorAll('.custom-input-field');
  const submitBtn = document.querySelector('.custom-button');
  
  // Get the target URL for form submission
  const targetURL = document.querySelector('.url-input-field').value || 'https://example.com';
  
  // Get the current URL
  const currentURL = window.location.href;
  
  // Get viewport dimensions for percentage calculations
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;
  
  // Create HTML content
  let htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Exported Form</title>
  <style>
    body, html {
      margin: 0;
      padding: 0;
      height: 100%;
      overflow: hidden;
    }
    iframe {
      width: 100%;
      height: 100%;
      border: none;
      position: absolute;
      top: 0;
      left: 0;
      z-index: 1;
    }
    .form-input {
      position: absolute;
      z-index: 10;
      background: transparent;
      border: none;
      outline: none;
      color: black; /* Make text visible */
    }
    .form-input:focus {
      outline: none;
      border: none;
      background: transparent;
    }
    .submit-button {
      position: absolute;
      z-index: 10;
      width: 80px;
      height: 30px;
      background-color: transparent;
      color: transparent;
      border: none;
      cursor: pointer;
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 12px;
    }
  </style>
  <script>
    window.onload = function() {
      // Get all form inputs
      const inputs = document.querySelectorAll('.form-input');
      
      // Hover effect to make elements temporarily visible when debugging
      const addHoverEffects = false; // Set to true for debugging
      
      if (addHoverEffects) {
        inputs.forEach(input => {
          input.addEventListener('mouseover', function() {
            this.style.border = '1px dashed rgba(255, 0, 0, 0.3)';
            this.style.background = 'rgba(255, 0, 0, 0.05)';
          });
          
          input.addEventListener('mouseout', function() {
            this.style.border = 'none';
            this.style.background = 'transparent';
          });
        });
        
        const submitBtn = document.querySelector('.submit-button');
        submitBtn.addEventListener('mouseover', function() {
          this.style.backgroundColor = 'rgba(150, 150, 150, 0.3)';
          this.style.color = 'rgba(255, 255, 255, 0.8)';
        });
        
        submitBtn.addEventListener('mouseout', function() {
          this.style.backgroundColor = 'transparent';
          this.style.color = 'transparent';
        });
      }
      
      // Add event listener to the submit button
      document.querySelector('.submit-button').addEventListener('click', function() {
        // Base URL for the form submission
        let targetUrl = "${targetURL}";
        
        // Create URL parameters from input values
        const params = new URLSearchParams();
        
        // Add each input's value to the URL parameters
        inputs.forEach((input, index) => {
          params.append('field' + (index + 1), input.value || '');
        });
        
        // Construct the final URL with parameters
        const finalUrl = targetUrl + (targetUrl.includes('?') ? '&' : '?') + params.toString();
        
        // Redirect to the URL with parameters
        window.location.href = finalUrl;
      });
    };
  </script>
</head>
<body>
  <iframe src="${currentURL}" sandbox="allow-same-origin allow-scripts"></iframe>
`;

  // Add each input field with percentage-based positioning
  inputFields.forEach((field, index) => {
    const inputElement = field.querySelector('input');
    const rect = field.getBoundingClientRect();
    const value = inputElement ? inputElement.value : '';
    
    // Convert pixel positions to percentages
    const topPercent = (rect.top / viewportHeight) * 100;
    const leftPercent = (rect.left / viewportWidth) * 100;
    const widthPercent = (rect.width / viewportWidth) * 100;
    const heightPercent = (rect.height / viewportHeight) * 100;
    
    htmlContent += `
  <input type="text" class="form-input" style="top: ${topPercent}%; left: ${leftPercent}%; width: ${widthPercent}%; height: ${heightPercent}%;" value="${value}" />`;
  });
  
  // Add submit button with percentage-based positioning
  if (submitBtn) {
    const submitRect = submitBtn.getBoundingClientRect();
    
    // Convert pixel positions to percentages
    const topPercent = (submitRect.top / viewportHeight) * 100;
    const leftPercent = (submitRect.left / viewportWidth) * 100;
    const widthPercent = (submitRect.width / viewportWidth) * 100;
    const heightPercent = (submitRect.height / viewportHeight) * 100;
    
    htmlContent += `
  <button class="submit-button" style="top: ${topPercent}%; left: ${leftPercent}%; width: ${widthPercent}%; height: ${heightPercent}%;">Submit</button>`;
  }
  
  // Close the HTML
  htmlContent += `
</body>
</html>`;

  // Create a blob and download
  const blob = new Blob([htmlContent], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'exported-form.html';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

console.log('✅ Minimal input fields system initialized. Click the + button to add fields, E to export!');
