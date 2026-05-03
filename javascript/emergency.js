let selectedType = 'Accident / Trauma';

const firstAid = {
  'Accident / Trauma': [
    'Keep the pet as still as possible. Avoid moving the spine or neck.',
    'If bleeding, apply gentle pressure with a clean cloth — do not remove it.',
    'Keep the pet warm with a blanket. Shock causes rapid heat loss.',
    'Do not offer food or water until the vet has assessed them.',
    'Speak calmly and stay close. Your presence reduces their stress.'
  ],
  'Poisoning': [
    'Do NOT induce vomiting unless instructed by the vet.',
    'Note what they may have eaten — bring the label or packaging if possible.',
    'Keep the pet calm and away from other animals.',
    'Rinse mouth gently with water if they ate something corrosive.',
    'Watch for drooling, trembling, or collapse — tell us when you arrive.'
  ],
  'Breathing Issue': [
    'Keep the pet calm and in a cool, well-ventilated area.',
    'Do not restrict the chest or neck — let them find a comfortable position.',
    'Do not muzzle the pet — they need maximum airflow.',
    'If unconscious and not breathing, gently extend the neck to open the airway.',
    'Drive carefully but quickly — breathing issues can deteriorate fast.'
  ],
  'Seizure': [
    'Do not restrain the pet during a seizure — you may get bitten.',
    'Clear the area of hard objects to prevent injury.',
    'Note the time — seizure duration is important for the vet.',
    'After the seizure, keep the pet quiet and in a darkened room.',
    'Do not put your fingers near the mouth — pets do not swallow their tongue.'
  ],
  'Bleeding': [
    'Apply firm, continuous pressure with a clean cloth or gauze.',
    'Do not remove the cloth — add more on top if it soaks through.',
    'Keep the wound elevated above heart level if possible.',
    'Do not use a tourniquet unless absolutely necessary.',
    'Keep the pet as still and calm as possible during transport.'
  ],
  'Other / Unsure': [
    'Keep the pet calm and away from noise and other animals.',
    'Do not give any medication unless directed by the vet.',
    'Keep them warm and comfortable during transport.',
    'Note any recent changes — food, environment, behaviour — to share with the vet.',
    'Call us if the situation changes while you are on the way.'
  ]
};

function selectType(el) {
  document.querySelectorAll('.type-btn').forEach(b => b.classList.remove('selected'));
  el.classList.add('selected');
  selectedType = el.dataset.type;
}

function detectLocation() {
  const status = document.getElementById('gpsStatus');
  if (!navigator.geolocation) {
    status.textContent = 'GPS not available on this device.';
    return;
  }
  status.textContent = 'Detecting your location...';
  navigator.geolocation.getCurrentPosition(
    pos => {
      const { latitude, longitude } = pos.coords;
      status.textContent = `Detected: ${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;
      document.getElementById('address').value = `${latitude.toFixed(5)}, ${longitude.toFixed(5)}`;
      document.getElementById('city').value = 'Auto-detected';
      document.getElementById('mapBox').innerHTML = `
        <iframe width="100%" height="140" style="border:0;border-radius:8px;" loading="lazy"
          src="https://www.openstreetmap.org/export/embed.html?bbox=${longitude-0.01},${latitude-0.01},${longitude+0.01},${latitude+0.01}&layer=mapnik&marker=${latitude},${longitude}">
        </iframe>`;
    },
    () => { status.textContent = 'Could not detect. Please type your address.'; }
  );
}

function goStep(n) {
  document.querySelectorAll('.step-panel').forEach((p, i) => p.classList.toggle('active', i === n - 1));
  ['p1', 'p2', 'p3'].forEach((id, i) => document.getElementById(id).classList.toggle('active', i < n));
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function goStep2() {
  if (
    !document.getElementById('petName').value.trim() ||
    !document.getElementById('species').value ||
    !document.getElementById('ownerName').value.trim() ||
    !document.getElementById('phone').value.trim() ||
    !document.getElementById('situation').value.trim()
  ) {
    alert('Please fill in all required fields (*) before continuing.');
    return;
  }
  goStep(2);
}

function goStep3(e) {
  if (e) e.preventDefault();
  if (
    !document.getElementById('address').value.trim() ||
    !document.getElementById('city').value.trim()
  ) {
    alert('Please enter your street address and city.');
    return;
  }
  document.getElementById('h_type').value      = selectedType;
  document.getElementById('h_petname').value   = document.getElementById('petName').value;
  document.getElementById('h_species').value   = document.getElementById('species').value;
  document.getElementById('h_breed').value     = document.getElementById('breed').value;
  document.getElementById('h_age').value       = document.getElementById('petAge').value;
  document.getElementById('h_situation').value = document.getElementById('situation').value;
  document.getElementById('h_owner').value     = document.getElementById('ownerName').value;
  document.getElementById('h_phone').value     = document.getElementById('phone').value;
  document.getElementById('h_address').value   = document.getElementById('address').value;
  document.getElementById('h_locality').value  = document.getElementById('locality').value;
  document.getElementById('h_city').value      = document.getElementById('city').value;
  document.getElementById('h_landmark').value  = document.getElementById('landmark').value;
  submitForm();
}

async function submitForm() {
  const btn = document.querySelector('#step2 .btn-primary');
  btn.disabled = true;
  btn.innerHTML = '<span class="spinner"></span>Notifying clinic...';
  const form = document.getElementById('emergencyForm');
  try {
    const res = await fetch(form.action, {
      method: 'POST',
      body: new FormData(form),
      headers: { 'Accept': 'application/json' }
    });
    if (res.ok) {
      showConfirmation();
    } else {
      alert('Something went wrong. Please call us directly at +91 98765 43210.');
      btn.disabled = false;
      btn.textContent = 'Notify the clinic →';
    }
  } catch {
    alert('Network error. Please call us directly at +91 98765 43210.');
    btn.disabled = false;
    btn.textContent = 'Notify the clinic →';
  }
}

function showConfirmation() {
  const petName  = document.getElementById('petName').value;
  const species  = document.getElementById('species').value;
  const breed    = document.getElementById('breed').value;
  const address  = document.getElementById('address').value;
  const locality = document.getElementById('locality').value;
  const city     = document.getElementById('city').value;

  document.getElementById('s_type').textContent     = selectedType;
  document.getElementById('s_pet').textContent      = `${petName} · ${species}${breed ? ' · ' + breed : ''}`;
  document.getElementById('s_owner').textContent    = document.getElementById('ownerName').value;
  document.getElementById('s_phone').textContent    = document.getElementById('phone').value;
  document.getElementById('s_location').textContent = `${address}${locality ? ', ' + locality : ''}, ${city}`;
  document.getElementById('confirmMsg').textContent =
    `Head to the clinic now. Our team has been alerted for ${petName}. The emergency bay will be ready on arrival.`;

  const tips = firstAid[selectedType] || firstAid['Other / Unsure'];
  document.getElementById('faTitle').textContent = `While you travel — first aid for ${selectedType.toLowerCase()}`;
  document.getElementById('faList').innerHTML = tips.map((t, i) =>
    `<div class="fa-item"><div class="fa-num">${i + 1}</div><div>${t}</div></div>`
  ).join('');

  goStep(3);
}