// Global settings variables.
    let ttsEnabled = false;
    let selectedVoice = null;
    let ttsVolume = 1; // New global volume (0-1)
    let optionsCard = null;
    let filteredVoices = [];
    
    // Function to speak text using the Web Speech API.
    function speakTTS(text) {
      if (window.speechSynthesis && ttsEnabled && text.trim() !== '') {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.volume = ttsVolume;
        if (selectedVoice) { utterance.voice = selectedVoice; }
        window.speechSynthesis.speak(utterance);
      }
    }
    
    // Populate the voice selection dropdown with filtered voices.
    function populateVoiceList() {
      const voiceSelect = document.getElementById('voiceSelect');
      if (!voiceSelect) return;
      const voices = window.speechSynthesis.getVoices();
      const allowedKeywords = ["David", "Mark", "Zira", "UK", "English"];
      // Allow Spanish voices too.
      filteredVoices = voices.filter(voice => {
         if (voice.lang.startsWith("es")) return true;
         if (voice.lang.startsWith("en")) {
           return allowedKeywords.some(keyword => voice.name.includes(keyword)) || voice.name.includes("English");
         }
         return false;
      });
      voiceSelect.innerHTML = '';
      filteredVoices.forEach((voice, index) => {
         const option = document.createElement('option');
         option.value = index;
         option.textContent = `${voice.name} (${voice.lang})`;
         voiceSelect.appendChild(option);
      });
      if (filteredVoices.length > 0 && selectedVoice === null) {
         selectedVoice = filteredVoices[0];
         voiceSelect.selectedIndex = 0;
      }
    }
    
    if (typeof speechSynthesis !== 'undefined') {
      window.speechSynthesis.onvoiceschanged = populateVoiceList;
    }
    
    // Show the settings modal.
function showSettingsModal() {
  const overlay = document.createElement('div');
  overlay.className = 'modal-overlay';
  
  const card = document.createElement('div');
  card.className = 'settings-card';
  
  const title = document.createElement('h2');
  title.textContent = 'Settings';
  card.appendChild(title);
  
  // TTS toggle row using switch.
  const ttsRow = document.createElement('div');
  ttsRow.className = 'settings-row';
  const ttsLabel = document.createElement('label');
  ttsLabel.textContent = 'Enable TTS';
  const switchLabel = document.createElement('label');
  switchLabel.className = 'switch';
  const ttsToggle = document.createElement('input');
  ttsToggle.type = 'checkbox';
  ttsToggle.checked = ttsEnabled;
  ttsToggle.addEventListener('change', () => { ttsEnabled = ttsToggle.checked; });
  const slider = document.createElement('span');
  slider.className = 'slider';
  switchLabel.appendChild(ttsToggle);
  switchLabel.appendChild(slider);
  ttsRow.appendChild(ttsLabel);
  ttsRow.appendChild(switchLabel);
  card.appendChild(ttsRow);
  
  // Voice Volume row with percentage display.
  const volumeRow = document.createElement('div');
  volumeRow.className = 'settings-row';
  const volumeLabel = document.createElement('label');
  volumeLabel.textContent = 'Voice Volume';
  
  const volumeSlider = document.createElement('input');
  volumeSlider.type = 'range';
  volumeSlider.min = 0;
  volumeSlider.max = 1;
  volumeSlider.step = 0.1;
  volumeSlider.value = ttsVolume;
  volumeSlider.className = 'volume-slider';
  
  // Create a span to display the percentage value.
  const volumePercentage = document.createElement('span');
  volumePercentage.className = 'volume-percentage';
  volumePercentage.textContent = Math.round(ttsVolume * 100) + '%';
  
  // Update volume and percentage display on slider input.
  volumeSlider.addEventListener('input', () => {
    ttsVolume = parseFloat(volumeSlider.value);
    volumePercentage.textContent = Math.round(ttsVolume * 100) + '%';
  });
  
  volumeRow.appendChild(volumeLabel);
  volumeRow.appendChild(volumeSlider);
  volumeRow.appendChild(volumePercentage);
  card.appendChild(volumeRow);
  
  // Voice selection row.
  const voiceRow = document.createElement('div');
  voiceRow.className = 'settings-row';
  const voiceLabel = document.createElement('label');
  voiceLabel.textContent = 'Bot Voice';
  const voiceSelect = document.createElement('select');
  voiceSelect.id = 'voiceSelect';
  voiceSelect.addEventListener('change', () => {
    selectedVoice = filteredVoices[voiceSelect.selectedIndex];
  });
  voiceRow.appendChild(voiceLabel);
  voiceRow.appendChild(voiceSelect);
  card.appendChild(voiceRow);
  
  // Close button.
  const closeBtn = document.createElement('button');
  closeBtn.textContent = 'Save & Close';
  closeBtn.addEventListener('click', () => { overlay.remove(); });
  card.appendChild(closeBtn);
  
  overlay.appendChild(card);
  document.body.appendChild(overlay);
  
  populateVoiceList();
}
    
    // Toggle the Options Card.
    function toggleOptionsCard() {
      if (optionsCard) {
        optionsCard.remove();
        optionsCard = null;
        document.removeEventListener('click', outsideClickListener);
      } else {
        optionsCard = document.createElement('div');
        optionsCard.className = 'options-card show';
        
        // Settings Button.
        const settingsBtn = document.createElement('button');
        settingsBtn.title = 'Settings';
        settingsBtn.innerHTML = `
          <svg viewBox="0 0 24 24">
            <path d="M19.14,12.94c0-.32.06-.63.06-.94s-.06-.63-.06-.94l2.03-1.58a.5.5,0,0,0,.12-.59l-1.92-3.32a.5.5,0,0,0-.57-.2l-2.39.96a7.007,7.007,0,0,0-1.63-.94L14,2.5a.5.5,0,0,0-.5-.5h-3a.5.5,0,0,0-.5.5L9,5.08a7.007,7.007,0,0,0-1.63.94l-2.39-.96a.5.5,0,0,0-.57.2L2.49,8.52a.5.5,0,0,0,.12.59l2.03,1.58c0,.32-.06.63-.06.94s.06.63.06.94L2.61,14.5a.5.5,0,0,0-.12.59l1.92,3.32a.5.5,0,0,0,.57.2l2.39-.96a7.007,7.007,0,0,0,1.63.94l.5,2.58a.5.5,0,0,0,.5.42h3a.5.5,0,0,0,.5-.42l.5-2.58a7.007,7.007,0,0,0,1.63-.94l2.39.96a.5.5,0,0,0,.57-.2l1.92-3.32a.5.5,0,0,0-.12-.59ZM12,15.5A3.5,3.5,0,1,1,15.5,12,3.5,3.5,0,0,1,12,15.5Z"/>
          </svg>
        `;
        settingsBtn.addEventListener('click', () => {
          showSettingsModal();
          closeOptionsCard();
        });
        optionsCard.appendChild(settingsBtn);
        
        // File Upload Button.
        const fileUploadBtn = document.createElement('button');
        fileUploadBtn.title = 'Upload File';
        fileUploadBtn.innerHTML = `
          <svg viewBox="0 0 24 24">
            <path d="M12 16l4-5h-3V4h-2v7H8l4 5z"/>
            <path d="M4 18h16v2H4z"/>
          </svg>
        `;
        fileUploadBtn.addEventListener('click', () => {
          document.getElementById('file-upload').click();
          closeOptionsCard();
        });
        optionsCard.appendChild(fileUploadBtn);
        
        // Position the options card relative to the toggle button.
        const toggleBtn = document.getElementById('toggle-options-button');
        const btnRect = toggleBtn.getBoundingClientRect();
        optionsCard.style.bottom = (window.innerHeight - btnRect.top + 10) + "px";
        optionsCard.style.left = btnRect.left + "px";
        
        document.body.appendChild(optionsCard);
        // Add outside click listener.
        setTimeout(() => { document.addEventListener('click', outsideClickListener); }, 10);
      }
    }
    
    // Outside click listener to close the options card.
    function outsideClickListener(event) {
      const toggleBtn = document.getElementById('toggle-options-button');
      if (optionsCard && !optionsCard.contains(event.target) && !toggleBtn.contains(event.target)) {
        closeOptionsCard();
      }
    }
    
    function closeOptionsCard() {
      if (optionsCard) {
        optionsCard.remove();
        optionsCard = null;
        document.removeEventListener('click', outsideClickListener);
      }
    }
    
    // Toggle options card when the plus button is clicked.
    document.getElementById('toggle-options-button').addEventListener('click', (e) => {
      e.stopPropagation();
      toggleOptionsCard();
    });
    
    // Helper function to delete a message with fade-out animation.
    function deleteMessage(messageEl) {
      messageEl.classList.add('fade-out');
      setTimeout(() => { messageEl.remove(); }, 400);
    }
    
    // Show modal confirmation for deletion (mobile).
    function showConfirmation(messageEl) {
      const overlay = document.createElement('div');
      overlay.className = 'modal-overlay';
      const card = document.createElement('div');
      card.className = 'settings-card';
      const prompt = document.createElement('h2');
      prompt.textContent = 'Delete this message?';
      card.appendChild(prompt);
      
      const deleteBtn = document.createElement('button');
      deleteBtn.textContent = 'Delete';
      deleteBtn.style.backgroundColor = '#e74c3c';
      deleteBtn.addEventListener('click', () => { deleteMessage(messageEl); overlay.remove(); });
      
      const cancelBtn = document.createElement('button');
      cancelBtn.textContent = 'Cancel';
      cancelBtn.style.backgroundColor = '#000';
      cancelBtn.addEventListener('click', () => { overlay.remove(); });
      
      card.appendChild(deleteBtn);
      card.appendChild(cancelBtn);
      overlay.appendChild(card);
      document.body.appendChild(overlay);
    }
    
    // Attach deletion listeners (shift-click on PC, long press on mobile).
    function addDeleteListener(messageEl) {
      messageEl.addEventListener('click', (e) => { if (e.shiftKey) { deleteMessage(messageEl); } });
      let pressTimer;
      messageEl.addEventListener('touchstart', () => {
        pressTimer = setTimeout(() => { showConfirmation(messageEl); }, 800);
      });
      messageEl.addEventListener('touchend', () => { clearTimeout(pressTimer); });
      messageEl.addEventListener('touchmove', () => { clearTimeout(pressTimer); });
    }
    
    // Helper functions for link previews.
    function updatePreviewWithFavicon(previewElement, pageUrl) {
      fetch(pageUrl)
        .then(response => response.text())
        .then(htmlText => {
          const parser = new DOMParser();
          const doc = parser.parseFromString(htmlText, 'text/html');
          let iconLink = doc.querySelector('link[rel="icon"]') || doc.querySelector('link[rel="shortcut icon"]');
          if (iconLink) {
            let faviconUrl = iconLink.getAttribute('href');
            if (faviconUrl) {
              try { faviconUrl = new URL(faviconUrl, pageUrl).href; }
              catch (e) { console.error("Error resolving favicon URL:", e); }
              const imgEl = previewElement.querySelector('img');
              if (imgEl) { imgEl.src = faviconUrl; }
            }
          }
        })
        .catch(err => console.error('Error fetching favicon:', err));
    }
    
    function buildGenericPreview(url) {
      try {
        const urlObj = new URL(url);
        const domain = urlObj.hostname;
        const placeholder = 'data:image/svg+xml;base64,' + btoa(`
          <svg xmlns="http://www.w3.org/2000/svg" width="60" height="60" viewBox="0 0 24 24">
            <path fill="#ccc" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/>
            <path fill="#ccc" d="M0 0h24v24H0z" fill="none"/>
          </svg>
        `);
        const previewContainer = document.createElement('a');
        previewContainer.className = 'preview-container';
        previewContainer.href = url;
        previewContainer.target = '_blank';
    
        const img = document.createElement('img');
        img.src = placeholder;
        img.alt = 'Preview Image';
        previewContainer.appendChild(img);
    
        const textDiv = document.createElement('div');
        textDiv.className = 'preview-text';
    
        const titleDiv = document.createElement('div');
        titleDiv.className = 'preview-title';
        titleDiv.textContent = domain;
        textDiv.appendChild(titleDiv);
    
        const descDiv = document.createElement('div');
        descDiv.className = 'preview-description';
        descDiv.textContent = `Link preview for ${url}`;
        textDiv.appendChild(descDiv);
    
        const urlDiv = document.createElement('div');
        urlDiv.className = 'preview-url';
        urlDiv.textContent = url;
        textDiv.appendChild(urlDiv);
    
        previewContainer.appendChild(textDiv);
    
        updatePreviewWithFavicon(previewContainer, url);
    
        return previewContainer;
      } catch(e) {
        const fallbackContainer = document.createElement('a');
        fallbackContainer.className = 'preview-container';
        fallbackContainer.href = url;
        fallbackContainer.target = '_blank';
    
        const textDiv = document.createElement('div');
        textDiv.className = 'preview-text';
    
        const titleDiv = document.createElement('div');
        titleDiv.className = 'preview-title';
        titleDiv.textContent = url;
        textDiv.appendChild(titleDiv);
    
        const descDiv = document.createElement('div');
        descDiv.className = 'preview-description';
        descDiv.textContent = 'Link preview not available.';
        textDiv.appendChild(descDiv);
    
        fallbackContainer.appendChild(textDiv);
        return fallbackContainer;
      }
    }
    
    function checkForLinkPreview(contentEl, message) {
      const urlRegex = /((https?:\/\/)?[\w.-]+\.[a-z]{2,}(\/\S*)?)/gi;
      const urls = message.match(urlRegex);
      if (urls && urls.length > 0) {
        let url = urls[0];
        if (!url.startsWith('http')) { url = 'http://' + url; }
        const previewElement = buildGenericPreview(url);
        const previewWrapper = document.createElement('div');
        previewWrapper.className = 'link-preview';
        previewWrapper.appendChild(previewElement);
        contentEl.parentNode.appendChild(previewWrapper);
      }
    }
    
    // Display a message and check for link previews.
    function displayMessage(content, sender, isHTML = false) {
      const messageEl = document.createElement('div');
      messageEl.className = `message ${sender}`;
      addDeleteListener(messageEl);
    
      const contentEl = document.createElement('div');
      contentEl.className = 'message-content';
      contentEl[isHTML ? "innerHTML" : "textContent"] = content;
      messageEl.appendChild(contentEl);
      document.getElementById('message-area').appendChild(messageEl);
      document.getElementById('message-area').scrollTop = document.getElementById('message-area').scrollHeight;
    
      if (!isHTML) { checkForLinkPreview(contentEl, content); }
      return messageEl;
    }
    
    // Typewriter effect for bot messages with TTS.
    function displayMessageWithTyping(content, sender) {
      const messageEl = document.createElement('div');
      messageEl.className = `message ${sender}`;
      addDeleteListener(messageEl);
    
      const contentEl = document.createElement('div');
      contentEl.className = 'message-content';
      messageEl.appendChild(contentEl);
      document.getElementById('message-area').appendChild(messageEl);
      document.getElementById('message-area').scrollTop = document.getElementById('message-area').scrollHeight;
    
      // Start TTS 1 second after typing starts.
      if (sender === 'bot' && ttsEnabled) {
         setTimeout(() => { speakTTS(content); }, 1000);
      }
    
      let typedMessage = '';
      let charIndex = 0;
      const typingDelay = 32;
    
      function typeLetter() {
        if (charIndex < content.length) {
          typedMessage += content.charAt(charIndex);
          contentEl.textContent = typedMessage + ' ●';
          charIndex++;
          setTimeout(typeLetter, typingDelay);
        } else {
          setTimeout(() => { contentEl.textContent = typedMessage; }, 500);
        }
      }
      typeLetter();
    }
    
    // AI Chatbot Logic.
    function generateResponse(message) {
      const keywords = {
          greetings: /\b(hello|hi|hey|greetings|wsp|wsg|howdy|what's up|yo|good day|hiya)\b/i,
          farewells: /\b(bye|goodbye|see you|farewell|later|take care|catch you later|see ya)\b/i,
          feelings: /\b(how are you|how do you feel|what's up|how's it going|what's new|how are things|how do you do)\b/i,
          thanks: /\b(thank you|thanks|appreciate|tysm|ty|thx|thanks a lot|many thanks|grateful|thanks a bunch)\b/i,
          weather: /\b(weather|climate|temperature|rain|sunny|forecast|what's the weather|weather update)\b/i,
          hobbies: /\b(what do you do|hobbies|free time|what are your hobbies|what do you like to do|interests)\b/i,
          name: /\b(your name|who are you|what's your name|what should I call you|who am I talking to|what do you go by|who are you|who are u)\b/i,
          jokes: /\b(joke|funny|tell me a joke|make me laugh|share a joke|tell me something funny|humor)\b/i,
          confused: /\b(i don't get it|i'm not sure what you mean|\?|huh|what do you mean by that|idk)\b/i,
          nervous: /\b(i'm a bit nervous about that|oh, i'm not sure how to handle that|that's a bit tricky for me|i'm not entirely comfortable with that|i hope i'm getting this right)\b/i,
          weird: /\b(sus|gay|skibidi|gyat|bust|bootyhole)\b/i,
          bad: /\b(fuck|bitch|nigga|nigger|shit|ass|asshole|mother fucker|motherfucker|ass hole|holy shit|dick|fucking|fucker|pussy|dumb ass|dumbass|bullshit|bull shit|cock|son of a bitch|sex|whore|bj|blowjob|hoe|hell|dipshit)\b/i,
          html: /\b(html|HTML|write a html code)\b/i,
          disagree: /\b(no|no thanks|nah|nope|nuh uh)\b/i,
          agree: /\b(yes|yeah|yup|sure|of course|definitely|absolutely|sounds good|okay|alright|alr|fine by me|sure thing|yea|ye|ok|kk)\b/i,
          malware: /\b(malware|write malware|code malware)\b/i,
          lua: /\b(lua|write lua|code lua)\b/i,
          python: /\b(python|write python|code python)\b/i,
          css: /\b(css|write css|code css)\b/i,
          js: /\b(javascript|write javascript|code javascript)\b/i
      };
      const responses = {
          greetings: [
              "Hello! How can I assist you today?",
              "Hi there! What can I do for you?",
              "Greetings! How's your day going?",
              "Hey! What's up?",
              "Good day! How can I help?"
          ],
          farewells: [
              "Goodbye! Have a great day!",
              "See you later! If you need anything, just ask.",
              "Take care! Come back anytime.",
              "Farewell! Hope to chat with you soon.",
              "Later! Have a wonderful day!",
              "Bye! Looking forward to our next chat!"
          ],
          html: [
              "Sorry, I can't write HTML programming language because I'm not an actual LLM (Large Language Model)."
          ],
          feelings: [
              "I'm just a bunch of code, but I'm here to help!",
              "I'm feeling great, thanks for asking! Ready to assist you.",
              "I'm always here and ready to help out.",
              "I'm doing well, thanks for asking! How can I assist you today?",
              "I'm just a program, but I'm always here for you.",
              "I'm functioning well! What can I do for you?"
          ],
          thanks: [
              "You're welcome! If you need anything else, just let me know.",
              "Happy to help! Is there anything else you need?",
              "No problem! I'm here whenever you need assistance.",
              "You're welcome! Feel free to reach out anytime.",
              "Anytime! I'm glad I could help.",
              "You're always welcome! Let me know if you need more assistance."
          ],
          weather: [
              "I can't check the weather in real-time, but I hope it's nice out there!",
              "I wish I could give you a weather update. Hopefully, it's sunny wherever you are!",
              "I don't have access to weather data, but I hope you're having good weather!",
              "Unfortunately, I can't check the weather, but I hope it's pleasant!",
              "I can't provide weather updates, but I hope you're enjoying good weather!",
              "I don't have real-time weather info, but I'm sure it's just right for you!"
          ],
          hobbies: [
              "I love chatting with you, and that's my hobby!",
              "I enjoy learning new things and helping with your questions.",
              "My hobby is helping out and making your day a little easier!",
              "I'm here to chat and assist—it's my favorite thing to do!",
              "I enjoy engaging with you and helping with any inquiries.",
              "I don't have hobbies like humans do, but assisting you is a lot of fun!"
          ],
          name: [
              "I'm J.B.A.I. An AI chatbot!",
              "You can refer to me as J.B.A.I. How can I help you today?",
              "I'm your helpful assistant, J.B.A.I. What can I do for you?",
              "Just call me J.B.A.I. I'm here to help!",
              "I'm known as J.B.A.I. What can I assist you with?",
              "My name is J.B.A.I. What do you need today?"
          ],
          jokes: [
              "Why do programmers prefer dark mode? Because light attracts bugs!",
              "Why don't programmers like nature? It has too many bugs.",
              "Why do Java developers wear glasses? Because they don't see sharp.",
              "Why do programmers hate the outdoors? Too many bugs!",
              "Why did the programmer quit his job? Because he didn't get arrays!",
              "Why did the scarecrow become a successful programmer? Because he was outstanding in his field!"
          ],
          confused: [
              "I don't quite understand what you're saying. Could you clarify?",
              "That's a bit unclear. Can you provide more details?",
              "I'm having trouble with that. Can you explain it differently?",
              "I'm not sure what you mean. Could you elaborate?",
              "I'm a bit puzzled. Can you give me more context?"
          ],
          nervous: [
              "I'm a little unsure about that. Can you help me out?",
              "Oh, that's a bit complex. I hope I get it right!",
              "I'm feeling a bit uneasy about this topic.",
              "I'm not entirely sure how to handle that.",
              "That's a tricky one for me. I hope I'm doing okay!"
          ],
          weird: [
              "That's a bit unusual! What makes you ask that?",
              "Hmm, that's an interesting question. What's on your mind?",
              "I didn't expect that! What do you mean?",
              "That's a little out of the ordinary. Can you explain?",
              "You've got me stumped with that one! What are you thinking?"
          ],
          bad: [
              "Please use respectful language. I'm here to help!",
              "I'd appreciate it if you could keep the conversation polite.",
              "Let's keep things friendly. How can I assist you?",
              "I'm here to help, so let's keep the conversation respectful.",
              "That's not very nice. How can I assist you today?",
              "I prefer to keep things positive. How can I help?",
              "Let's use kind language. What can I do for you?",
              "I'm here to assist you. Please use appropriate language."
          ],
          disagree: [
              "Alright, no problem!",
              "Got it, no worries!",
              "Understood! Let me know if you change your mind.",
              "Okay, I respect that.",
              "That's fine. Let me know if you need anything else.",
              "Sure thing, just let me know if you reconsider.",
              "Alright, feel free to ask for something else!",
              "No worries! I'm here if you need me."
          ],
          agree: [
              "Great! Let's proceed.",
              "Awesome, I'm glad we're on the same page!",
              "Perfect! Let's get started.",
              "Sounds good! Let's move forward.",
              "Glad to hear that!",
              "Alright, we're good to go.",
              "Excellent! I'll take care of it.",
              "Cool! I'm on it.",
              "Wonderful! Let's continue.",
              "Okay! We're all set.",
              "Fantastic! I'm ready when you are.",
              "Sure thing! Let me handle that."
          ],
          malware: [
              "I'm sorry, but I cannot write malware. I could, but the creator chose not to include that feature since it would be useless and illegal. Not to mention, I'm not even a good chatbot to begin with because you can barely have a conversation with me. I suck..."
          ],
          lua: [
              "Sorry, I can't write Lua programming language because I'm not an actual LLM (Large Language Model)."
          ],
          python: [
              "Sorry, I can't write Python programming language because I'm not an actual LLM (Large Language Model)."
          ],
          css: [
              "Sorry, I can't write CSS programming language because I'm not an actual LLM (Large Language Model)."
          ],
          js: [
              "Sorry, I can't write JavaScript programming language because I'm not an actual LLM (Large Language Model)."
          ]
      };
      for (const [category, regex] of Object.entries(keywords)) {
        if (regex.test(message)) {
          const responsesArray = responses[category];
          return responsesArray[Math.floor(Math.random() * responsesArray.length)];
        }
      }
      return "I'm very sorry, but I'm not experienced enough to respond to that. Perhaps I'll get better in the future!";
    }
    
    // Handle sending a message.
    function sendMessage() {
      const chatInput = document.getElementById('chat-input');
      const userMessage = chatInput.value.trim();
      if (userMessage) {
        displayMessage(userMessage, 'user');
        chatInput.value = '';
        chatInput.focus();
        const typingIndicator = displayMessage("●", 'bot');
        setTimeout(() => {
          typingIndicator.remove();
          const aiResponse = generateResponse(userMessage.toLowerCase());
          displayMessageWithTyping(aiResponse, 'bot');
        }, 1300);
      }
    }
    
    // File upload handler.
    function handleFileUpload(event) {
      const file = event.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = function() {
        const fileContent = reader.result;
        let embedHTML = '';
        function escapeHTML(text) {
          return text
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
        }
        if (file.type === 'text/html') {
          embedHTML = `<div>
              <h3>HTML File Content:</h3>
              <pre>${escapeHTML(fileContent)}</pre>
            </div>`;
        } else if (file.type === 'application/javascript' || file.type === 'text/javascript') {
          embedHTML = `<div>
              <h3>JavaScript File Content:</h3>
              <pre>${escapeHTML(fileContent)}</pre>
            </div>`;
        } else if (file.type === 'text/css') {
          embedHTML = `<div>
              <h3>CSS File Content:</h3>
              <pre>${escapeHTML(fileContent)}</pre>
            </div>`;
        } else if (file.type === 'text/lua') {
          embedHTML = `<div>
              <h3>Lua File Content:</h3>
              <pre>${escapeHTML(fileContent)}</pre>
            </div>`;
        } else if (file.type === 'text/plain' || file.name.endsWith('.bat')) {
          embedHTML = `<div>
              <h3>${file.name.endsWith('.bat') ? 'Batch Script' : 'Text File'} Content:</h3>
              <pre>${escapeHTML(fileContent)}</pre>
            </div>`;
        } else if (file.type.startsWith('image/')) {
          const blobURL = URL.createObjectURL(file);
          embedHTML = `<div>
              <h3>Uploaded Image: ${file.name}</h3>
              <img src="${blobURL}" alt="Uploaded Image" style="max-width: 100%; height: auto; border-radius: 12px;">
            </div>`;
        } else if (file.type === 'audio/mpeg' || file.type === 'audio/mp3') {
          const blobURL = URL.createObjectURL(file);
          embedHTML = `<div>
              <h3>Uploaded Audio: ${file.name}</h3>
              <audio controls>
                <source src="${blobURL}" type="${file.type}">
                Your browser does not support the audio element.
              </audio>
            </div>`;
        } else if (file.type === 'video/mp4') {
          const blobURL = URL.createObjectURL(file);
          embedHTML = `<div>
              <h3>Uploaded Video: ${file.name}</h3>
              <video controls style="max-width: 100%; height: auto; border-radius: 12px;">
                <source src="${blobURL}" type="${file.type}">
                Your browser does not support the video tag.
              </video>
            </div>`;
        } else {
          embedHTML = `<div>
              <h3>Unsupported File Type:</h3>
              <p>File type: ${file.type}</p>
              <pre>${escapeHTML(fileContent)}</pre>
            </div>`;
        }
        displayMessage(embedHTML, 'bot', true);
      };
      reader.onerror = function() { displayMessage("Error reading file.", 'bot'); };
      reader.readAsText(file);
    }
    
    // Set up event listeners.
    document.getElementById('chat-input').addEventListener('keydown', (event) => {
      if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault();
        sendMessage();
      }
    });
    document.getElementById('send-button').addEventListener('click', sendMessage);
    document.getElementById('file-upload').addEventListener('change', handleFileUpload);
