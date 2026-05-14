document.addEventListener('DOMContentLoaded', () => {
  let currentStepIndex = 1;
  const currentBookingData = {};

  const allStepContainers = [1, 2, 3].map(stepNumber => document.getElementById(`formStep${stepNumber}`));
  const allProgressItems = [1, 2, 3].map(stepNumber => document.getElementById(`stepProg${stepNumber}`));
  const allProgressLines = document.querySelectorAll('.step-prog-line');

  function navigateToStep(targetStepNumber) {
    allStepContainers.forEach((stepContainer, index) => {
      const isTargetStep = index === targetStepNumber - 1;
      stepContainer.classList.toggle('active', isTargetStep);
    });

    allProgressItems.forEach((progressItem, index) => {
      progressItem.classList.remove('active', 'done');
      
      const isPastStep = index < targetStepNumber - 1;
      const isCurrentStep = index === targetStepNumber - 1;
      
      if (isPastStep) progressItem.classList.add('done');
      if (isCurrentStep) progressItem.classList.add('active');
    });

    allProgressLines.forEach((progressLine, index) => {
      const isPastLine = index < targetStepNumber - 1;
      progressLine.classList.toggle('done', isPastLine);
    });

    currentStepIndex = targetStepNumber;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function initializeAmbulanceTypeSelector() {
    const typeSelectionCards = document.querySelectorAll('.type-select-card');
    const hiddenTypeInput = document.getElementById('ambulanceType');
    
    typeSelectionCards.forEach(card => {
      card.addEventListener('click', () => {
        typeSelectionCards.forEach(c => c.classList.remove('selected'));
        card.classList.add('selected');
        
        const selectedValue = card.dataset.value;
        const selectedLabel = card.querySelector('strong')?.textContent;
        
        if (hiddenTypeInput) {
          hiddenTypeInput.value = selectedValue;
        }
        
        currentBookingData.ambulanceType = selectedValue;
        currentBookingData.ambulanceTypeLabel = selectedLabel;
      });
    });

    const urlParameters = new URLSearchParams(window.location.search);
    const preselectedType = urlParameters.get('type');
    
    if (preselectedType) {
      const matchingCard = document.querySelector(`.type-select-card[data-value="${preselectedType}"]`);
      if (matchingCard) matchingCard.click();
    }
  }

  function initializeGpsLocationDetection() {
    const gpsDetectionButton = document.getElementById('gpsBtn');
    if (!gpsDetectionButton) return;

    gpsDetectionButton.addEventListener('click', () => {
      gpsDetectionButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Detecting location...';
      gpsDetectionButton.disabled = true;

      const isGeolocationSupported = !!navigator.geolocation;
      
      if (!isGeolocationSupported) {
        gpsDetectionButton.innerHTML = '<i class="fas fa-location-crosshairs"></i> GPS Not Supported';
        gpsDetectionButton.disabled = false;
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const latitude = position.coords.latitude;
          const longitude = position.coords.longitude;
          const addressInput = document.getElementById('pickupAddress');
          
          if (addressInput) {
            addressInput.value = `Lat: ${latitude.toFixed(5)}, Lng: ${longitude.toFixed(5)}`;
          }
          currentBookingData.patientLat = latitude;
          currentBookingData.patientLng = longitude;
          
          gpsDetectionButton.innerHTML = '<i class="fas fa-check-circle"></i> Location Detected!';
          gpsDetectionButton.style.color = '#4ade80';
          gpsDetectionButton.style.borderColor = '#4ade80';
          
          setTimeout(() => {
            gpsDetectionButton.innerHTML = '<i class="fas fa-location-crosshairs"></i> Use My Current Location (GPS)';
            gpsDetectionButton.style.color = '';
            gpsDetectionButton.style.borderColor = '';
            gpsDetectionButton.disabled = false;
          }, 3000);
          
          showToast('Location detected successfully!', 'success');
        },
        () => {
          gpsDetectionButton.innerHTML = '<i class="fas fa-location-crosshairs"></i> Use My Current Location (GPS)';
          gpsDetectionButton.disabled = false;
          showToast('Could not detect location. Please enter manually.', 'error');
        }
      );
    });
  }

  function initializeStepNavigationButtons() {
    const nextStep1Button = document.getElementById('step1Next');
    if (nextStep1Button) {
      nextStep1Button.addEventListener('click', () => {
        const patientName = document.getElementById('patientName')?.value.trim();
        const phoneNumber = document.getElementById('phone')?.value.trim();
        const pickupAddress = document.getElementById('pickupAddress')?.value.trim();
        const city = document.getElementById('city')?.value.trim();
        
        const isMissingRequiredFields = !patientName || !phoneNumber || !pickupAddress || !city;
        
        if (isMissingRequiredFields) {
          showToast('Please fill all required fields.', 'error');
          return;
        }
        
        currentBookingData.name = patientName;
        currentBookingData.phone = phoneNumber;
        currentBookingData.email = document.getElementById('email')?.value.trim();
        currentBookingData.address = pickupAddress;
        currentBookingData.city = city;

        navigateToStep(2);
      });
    }

    const backToStep1Button = document.getElementById('step2Back');
    if (backToStep1Button) {
      backToStep1Button.addEventListener('click', () => navigateToStep(1));
    }

    const nextStep2Button = document.getElementById('step2Next');
    if (nextStep2Button) {
      nextStep2Button.addEventListener('click', () => {
        const ambulanceTypeInput = document.getElementById('ambulanceType');
        const emergencyTypeDropdown = document.getElementById('emergencyType');
        
        const selectedAmbulanceType = ambulanceTypeInput?.value;
        const selectedEmergencyType = emergencyTypeDropdown?.value;
        
        if (!selectedAmbulanceType) { 
          showToast('Please select an ambulance type.', 'error'); 
          return; 
        }
        if (!selectedEmergencyType) { 
          showToast('Please select the nature of emergency.', 'error'); 
          return; 
        }
        
        const selectedEmergencyOption = emergencyTypeDropdown.options[emergencyTypeDropdown.selectedIndex];
        currentBookingData.emergencyType = selectedEmergencyOption?.text;
        
        buildConfirmationSummaryScreen();
        navigateToStep(3);
      });
    }

    const backToStep2Button = document.getElementById('step3Back');
    if (backToStep2Button) {
      backToStep2Button.addEventListener('click', () => navigateToStep(2));
    }
  }

  function buildConfirmationSummaryScreen() {
    const summaryContainer = document.getElementById('confirmSummary');
    if (!summaryContainer) return;

    // Consistent random distance (3-18 km) based on address to simulate nearest hospital
    let hash = 0;
    const str = currentBookingData.address || 'default';
    for (let i = 0; i < str.length; i++) hash = str.charCodeAt(i) + ((hash << 5) - hash);
    const estimatedDistance = (Math.abs(hash) % 15) + 3;

    const baseFarePrices = { basic: 800, advanced: 1500, neonatal: 2000, mortuary: 1200 };
    const perKmRates = { basic: 10, advanced: 15, neonatal: 20, mortuary: 12 };

    const calculatedBasePrice = baseFarePrices[currentBookingData.ambulanceType] || 800;
    const ratePerKm = perKmRates[currentBookingData.ambulanceType] || 10;
    const distanceFare = estimatedDistance * ratePerKm;
    const totalFare = calculatedBasePrice + distanceFare;
    currentBookingData.totalFare = totalFare;

    const formattedPrice = `₹${Math.round(totalFare).toLocaleString('en-IN')}`;

    const fullAddressString = `${currentBookingData.address}, ${currentBookingData.city}`;
    
    let summaryHtmlContent = `
      <div class="confirm-row"><span class="label">Patient Name</span><span class="value">${currentBookingData.name || '—'}</span></div>
      <div class="confirm-row"><span class="label">Phone</span><span class="value">${currentBookingData.phone || '—'}</span></div>
      <div class="confirm-row"><span class="label">Pickup Location</span><span class="value">${fullAddressString}</span></div>
      <div class="confirm-row"><span class="label">Ambulance Type</span><span class="value">${currentBookingData.ambulanceTypeLabel || '—'}</span></div>
      <div class="confirm-row"><span class="label">Emergency</span><span class="value">${currentBookingData.emergencyType || '—'}</span></div>
      <div class="confirm-row"><span class="label">Base Fare</span><span class="value">₹${calculatedBasePrice}</span></div>
      <div class="confirm-row"><span class="label">Est. Distance (${estimatedDistance} km @ ₹${ratePerKm}/km)</span><span class="value">₹${distanceFare}</span></div>
      <div class="confirm-row confirm-total"><span class="label">Total Estimated Fare</span><span class="value">${formattedPrice}</span></div>
    `;

    summaryContainer.innerHTML = summaryHtmlContent;
  }

  function initializeConfirmBookingButton() {
    const confirmDispatchButton = document.getElementById('confirmBookBtn');
    if (!confirmDispatchButton) return;

    confirmDispatchButton.addEventListener('click', async () => {
      confirmDispatchButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Dispatching...';
      confirmDispatchButton.disabled = true;

      const selectedPaymentElement = document.querySelector('input[name="payment"]:checked');
      const storedUserSession = localStorage.getItem('rr_user');
      const parsedUser = storedUserSession ? JSON.parse(storedUserSession) : {};

      const newBookingPayload = {
        patient_name: currentBookingData.name,
        phone: currentBookingData.phone,
        email: currentBookingData.email || '',
        pickup_address: currentBookingData.address,
        city: currentBookingData.city,
        ambulance_type: currentBookingData.ambulanceType,
        emergency_type: currentBookingData.emergencyType,
        patient_lat: currentBookingData.patientLat || null,
        patient_lng: currentBookingData.patientLng || null,
        payment_method: selectedPaymentElement ? selectedPaymentElement.value : 'cash',
        user_id: parsedUser.id || null
      };

      const processBooking = async () => {
        try {
          const backendResponse = await fetch('http://localhost:4000/api/bookings', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newBookingPayload)
          });
          
          const responseData = await backendResponse.json();

          if (!backendResponse.ok) {
            throw new Error(responseData.error || 'Booking failed.');
          }

          displayBookingSuccessScreen(responseData.booking_id, responseData.eta);

        } catch (error) {
          console.warn('Backend unavailable, using offline fallback mode:', error.message);
          
          const simulatedBookingId = 'RR-' + Math.floor(100000 + Math.random() * 900000);
          const simulatedEta = `${4 + Math.floor(Math.random() * 5)}-${6 + Math.floor(Math.random() * 4)} minutes`;
          
          displayBookingSuccessScreen(simulatedBookingId, simulatedEta, true);
          
          confirmDispatchButton.innerHTML = '<i class="fas fa-ambulance"></i> Confirm & Dispatch';
          confirmDispatchButton.disabled = false;
        }
      };

      if (selectedPaymentElement && selectedPaymentElement.value === 'online') {
        const options = {
          "key": "rzp_test_demo12345", // Mock test key
          "amount": Math.round((currentBookingData.totalFare || 800) * 100), // paise
          "currency": "INR",
          "name": "Rapid Rescue",
          "description": "Ambulance Booking Fare",
          "image": "https://cdn-icons-png.flaticon.com/512/1032/1032986.png",
          "handler": function (response) {
              showToast("Payment Successful! Processing booking...", "success");
              processBooking();
          },
          "prefill": {
              "name": currentBookingData.name,
              "email": currentBookingData.email || "patient@example.com",
              "contact": currentBookingData.phone
          },
          "theme": { "color": "#ef4444" },
          "modal": {
            "ondismiss": function() {
              confirmDispatchButton.innerHTML = '<i class="fas fa-ambulance"></i> Confirm & Dispatch';
              confirmDispatchButton.disabled = false;
              showToast("Payment cancelled.", "error");
            }
          }
        };
        const rzp = new window.Razorpay(options);
        rzp.open();
      } else {
        processBooking();
      }
    });
  }

  function displayBookingSuccessScreen(generatedBookingId, estimatedArrivalTime, isOfflineMode = false) {
    document.getElementById('bookingIdDisplay').textContent = generatedBookingId;
    document.getElementById('etaDisplay').textContent = estimatedArrivalTime;

    const trackingDataToSave = {
      id: generatedBookingId, 
      eta: estimatedArrivalTime,
      name: currentBookingData.name,
      phone: currentBookingData.phone,
      address: `${currentBookingData.address}, ${currentBookingData.city}`,
      type: currentBookingData.ambulanceTypeLabel,
      emergency: currentBookingData.emergencyType,
      timestamp: Date.now()
    };
    
    localStorage.setItem('rr_booking', JSON.stringify(trackingDataToSave));

    const progressIndicator = document.getElementById('stepProgress');
    if (progressIndicator) progressIndicator.style.display = 'none';
    
    const allFormSteps = document.querySelectorAll('.form-step');
    allFormSteps.forEach(step => step.style.display = 'none');
    
    const successContainer = document.getElementById('bookingSuccess');
    if (successContainer) successContainer.style.display = 'block';
    
    const toastMessage = isOfflineMode ? 
      '🚑 Booking received! (Offline mode)' : 
      '🚑 Booking received! Waiting for provider.';
      
    showToast(toastMessage, 'success');
  }

  function initializeTrackButtonLink() {
    const trackNowButton = document.getElementById('trackNowBtn');
    if (!trackNowButton) return;

    trackNowButton.addEventListener('click', (event) => {
      const generatedBookingIdElement = document.getElementById('bookingIdDisplay');
      if (generatedBookingIdElement && generatedBookingIdElement.textContent) {
        event.preventDefault();
        window.location.href = `track.html?id=${generatedBookingIdElement.textContent}`;
      }
    });
  }

  initializeAmbulanceTypeSelector();
  initializeGpsLocationDetection();
  initializeStepNavigationButtons();
  initializeConfirmBookingButton();
  initializeTrackButtonLink();
});
