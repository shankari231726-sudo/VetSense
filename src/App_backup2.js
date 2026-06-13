import React from "react";
import { jsPDF } from "jspdf";
import lab from "./images/lab.jpg";
import german from "./images/german.jpg";
import golden from "./images/golden.jpg";
import pug from "./images/pug.jpg";
import beagle from "./images/beagle.jpg";
import rottweiler from "./images/rottweiler.jpg";
import dobermann from "./images/dobermann.webp";
import husky from "./images/husky.jpg";
import shihtzu from "./images/shihtzu.jpg";
import pomeranian from "./images/pomerainan.jpg";
import dachshund from "./images/dachshund.jpg";
import boxer from "./images/boxer.jpg";
import greatdane from "./images/greatdane.jpg";
import cocker from "./images/cockerspaniel.jpg";
import saint from "./images/saintbernard.jpg";
import rajapalayam from "./images/rajapalayam.jpg";
import kombai from "./images/kombai.jpg";
import kanni from "./images/kanni.jpg";
import chippiparai from "./images/chipiparai.jpg";
import pariah from "./images/paraih.jpg";
import bordercollie from "./images/bordercollie.jpg";
import australiansphe from "./images/australiansphe.jpg";
import belgian from "./images/belgian.jpg";
import bullterrier from "./images/Bull Terrier.jpg";
import bassethound from "./images/Basset Hound.jpg";
import bloodhound from "./images/Bloodhound.jpg";
import bostonterrier from "./images/Boston Terrier.jpg";
import chihuahua from "./images/Chihuahua.jpg";
import dalmatian from "./images/Dalmatian.jpg";
import englishbulldog from "./images/English Bulldog.jpg";
import frenchbulldog from "./images/french Bulldog.jpg";
import akita from "./images/akita.jpg";
import americaneskimo from "./images/American Eskimo.jpg";
import bernesemountain from "./images/Bernese Mountain.jpg";
import bichonfrise from "./images/Bichon Frise.jpg";
import canecorso from "./images/Cane Corso.jpg";
import chowchow from "./images/Chow Chow.jpg";
import englishcocker from "./images/English Cocker Spaniel.jpg";
import englishspringer from "./images/English Springer Spaniel.jpg";
import flatcoated from "./images/Flat-Coated Retriever.jpg";
import jackrussell from "./images/Jack Russell Terrier.jpg";
import newfoundland from "./images/Newfoundland.jpg";
import papillon from "./images/Papillon.jpg";
import pekingese from "./images/Pekingese.jpg";
import samoyed from "./images/Samoyed.jpg";
import scottishterrier from "./images/Scottish Terrier.jpg";
import sharpei from "./images/Shar Pei.jpg";
import weimaraner from "./images/Weimaraner.jpg";
import whippet from "./images/Whippet.jpg";
import yorkshire from "./images/Yorkshire Terrier.jpg";
import schnauzer from "./images/Miniature Schnauzer.jpg";
import logo from "./images/logo.png";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useNavigate,
  useLocation
} from "react-router-dom";

const API = "http://13.49.229.134:5000";

// ================= NAVBAR =================
function Navbar() {
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user_id");
    localStorage.removeItem("name");
    alert("Logged out successfully!");
    navigate("/login");
  };
  return (
    <nav className="navbar">
      <div className="logo">🐾 VetSense</div>
      <ul>
        <li><Link to="/home">Home</Link></li>
        <li><Link to="/about">About</Link></li>
        <li><Link to="/consult">Consult</Link></li>
        <li><Link to="/reminder">Reminder</Link></li>
        <li><Link to="/feedback">Feedback</Link></li>
        <li><button className="logout-btn" onClick={handleLogout}>Logout</button></li>
      </ul>
    </nav>
  );
}

// ================= REGISTER PAGE =================
function RegisterPage() {
  const navigate = useNavigate();
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [phone, setPhone] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  const handleRegister = async () => {
    if (!name || !email || !phone || !password) {
      alert("Please fill all fields!");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${API}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, phone, password })
      });
      const data = await res.json();
      if (data.token) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user_id", data.user_id);
        localStorage.setItem("name", data.name);
        alert(`✅ Welcome ${data.name}! Registration Successful! SMS sent to your phone.`);
        navigate("/login");
      } else {
        alert("❌ " + (data.error || "Registration failed"));
      }
    } catch (e) {
      alert("❌ Server error. Please try again.");
    }
    setLoading(false);
  };

  return (
    <div className="video-page">
      <video className="video-bg" autoPlay muted loop playsInline preload="auto">
        <source src={require("./images/Registerpg.mp4")} type="video/mp4" />
      </video>
      <div className="overlay"></div>
      <div className="glass-card">
        <h1>Create Account 🐾</h1>
        <p>Join VetSense and protect your furry friend smarter.</p>
        <input type="text" placeholder="Full Name" value={name} onChange={e => setName(e.target.value)} />
        <input type="email" placeholder="Email Address" value={email} onChange={e => setEmail(e.target.value)} />
        <input type="tel" placeholder="Phone Number (with 91)" value={phone} onChange={e => setPhone(e.target.value)} />
        <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />
        <button onClick={handleRegister} disabled={loading}>
          {loading ? "Registering..." : "Register"}
        </button>
        <h3>Already have account? <Link to="/login"> Login</Link></h3>
      </div>
    </div>
  );
}

// ================= LOGIN PAGE =================
function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      alert("Please enter email and password!");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${API}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (data.token) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user_id", data.user_id);
        localStorage.setItem("name", data.name);
        navigate("/home");
      } else {
        alert("❌ " + (data.error || "Login failed"));
      }
    } catch (e) {
      alert("❌ Server error. Please try again.");
    }
    setLoading(false);
  };

  return (
    <div className="video-page">
      <video className="video-bg" autoPlay muted loop playsInline preload="auto">
        <source src={require("./images/Loginpg.mp4")} type="video/mp4" />
      </video>
      <div className="overlay"></div>
      <div className="glass-card">
        <h1>Welcome Back 🐶</h1>
        <p>Login to continue your VetSense journey.</p>
        <input type="email" placeholder="Enter Email" value={email} onChange={e => setEmail(e.target.value)} />
        <input type="password" placeholder="Enter Password" value={password} onChange={e => setPassword(e.target.value)} />
        <button onClick={handleLogin} disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>
        <h3>Don't have account? <Link to="/"> Register</Link></h3>
      </div>
    </div>
  );
}

// ================= HOME PAGE =================
function HomePage() {
  return (
    <div className="home-page">
      <Navbar />
      <section className="hero-section">
        <div className="hero-left">
          <h1>AI-Powered Healthcare<br />For Dogs 🐕</h1>
          <p>VetSense helps dog owners identify breeds, monitor health conditions, diagnose diseases, and connect with nearby veterinary clinics using Artificial Intelligence.</p>
          <Link to="/consult"><button className="hero-btn">Start Consultation</button></Link>
        </div>
        <div className="hero-right">
          <img src="https://images.unsplash.com/photo-1517849845537-4d257902454a" alt="dog" />
        </div>
      </section>
      <section className="stats-section">
        <div className="stat-card"><h1>93%+</h1><p>Prediction Accuracy</p></div>
        <div className="stat-card"><h1>50+</h1><p>Dog Breeds Supported</p></div>
        <div className="stat-card"><h1>8</h1><p>AI Modules</p></div>
        <div className="stat-card"><h1>24/7</h1><p>Health Monitoring</p></div>
      </section>
      <section className="features-section">
        <h1>Core Features</h1>
        <div className="features-grid">
          <div className="feature-card"><h2>🐶 Breed Identification</h2><p>Identify dog breeds using CNN models trained on real-world datasets.</p></div>
          <div className="feature-card"><h2>🩺 Normal Health Checkup</h2><p>Analyze age, weight and activity levels using Machine Learning.</p></div>
          <div className="feature-card"><h2>🚨 Sick Dog Diagnosis</h2><p>Predict diseases using symptoms, images and NLP processing.</p></div>
          <div className="feature-card"><h2>⚠ Emergency Alerts</h2><p>Notify users when immediate veterinary attention is required.</p></div>
          <div className="feature-card"><h2>📋 Health History</h2><p>Store previous diagnoses and prescriptions securely.</p></div>
          <div className="feature-card"><h2>💉 Vaccination Reminder</h2><p>Generate automatic vaccination schedules and reminders.</p></div>
          <div className="feature-card"><h2>📍 Nearby Vet Finder</h2><p>Locate nearby veterinary clinics using location services.</p></div>
          <div className="feature-card"><h2>📄 PDF Reports</h2><p>Download complete diagnosis reports for future reference.</p></div>
        </div>
      </section>
      <section className="why-section">
        <div className="why-left"><img src="https://images.unsplash.com/photo-1587300003388-59208cc962cb" alt="dog" /></div>
        <div className="why-right">
          <h1>Why Choose VetSense?</h1>
          <p>VetSense combines Artificial Intelligence, Machine Learning and veterinary assistance into one smart platform.<br /><br />✔ Accurate breed identification<br />✔ AI-powered disease diagnosis<br />✔ Vaccination reminders<br />✔ Nearby vet clinic support<br />✔ Health history tracking</p>
        </div>
      </section>
      <section className="workflow-section">
        <h1>How VetSense Works</h1>
        <div className="workflow-grid">
          <div className="workflow-card"><h2>1️⃣ Select Breed</h2><p>Choose your dog breed from the breed library.</p></div>
          <div className="workflow-card"><h2>2️⃣ Health Checkup</h2><p>Provide dog health information and symptoms.</p></div>
          <div className="workflow-card"><h2>3️⃣ AI Analysis</h2><p>AI models analyze health conditions and diseases.</p></div>
          <div className="workflow-card"><h2>4️⃣ Get Report</h2><p>Download reports and consult nearby veterinarians.</p></div>
        </div>
      </section>
      <footer className="footer"><h2>VetSense 🐾</h2><p>AI-Powered Canine Diagnosis & Health Monitoring Platform</p></footer>
    </div>
  );
}

// ================= ABOUT PAGE =================
function AboutPage() {
  return (
    <div className="about-page">
      <Navbar />
      <div className="about-container">
        <h1>About VetSense 🐾</h1>
        <p>VetSense is an AI-powered canine diagnosis and health monitoring platform developed to help dog owners understand and manage their pet's health efficiently using modern Artificial Intelligence technologies.</p>
        <div className="about-grid">
          <div className="about-card"><h2>🐶 Breed Identification</h2><p>Users can identify dog breeds using Convolutional Neural Network (CNN) models trained on real-world datasets.</p></div>
          <div className="about-card"><h2>🩺 Health Monitoring</h2><p>VetSense analyzes dog age, weight and activity levels to predict health conditions and provide personalized care suggestions.</p></div>
          <div className="about-card"><h2>🚨 Disease Diagnosis</h2><p>The system supports image-based and symptom-based disease diagnosis using AI, Machine Learning and NLP techniques.</p></div>
          <div className="about-card"><h2>💉 Vaccination Reminder</h2><p>Smart reminders help dog owners track vaccination schedules based on breed and age information.</p></div>
          <div className="about-card"><h2>📍 Nearby Vet Support</h2><p>Users can quickly locate nearby veterinary clinics during emergency situations using live location services.</p></div>
          <div className="about-card"><h2>📄 Health Report Download</h2><p>Complete diagnosis and health reports can be downloaded as PDF documents for future veterinary reference.</p></div>
        </div>
        <div className="about-bottom">
          <h2>Smart Healthcare For Every Dog ❤️</h2>
          <p>VetSense does not replace professional veterinary consultation. It acts as an intelligent assistant that helps dog owners identify possible health conditions early and seek timely medical attention.</p>
        </div>
      </div>
    </div>
  );
}

// ================= CONSULT PAGE =================
function ConsultPage() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = React.useState("");
  const dogs = [
    { name: "Labrador Retriever", image: lab },
    { name: "German Shepherd", image: german },
    { name: "Golden Retriever", image: golden },
    { name: "Pug", image: pug },
    { name: "Beagle", image: beagle },
    { name: "Rottweiler", image: rottweiler },
    { name: "Dobermann", image: dobermann },
    { name: "Siberian Husky", image: husky },
    { name: "Shih Tzu", image: shihtzu },
    { name: "Pomeranian", image: pomeranian },
    { name: "Dachshund", image: dachshund },
    { name: "Boxer", image: boxer },
    { name: "Great Dane", image: greatdane },
    { name: "Cocker Spaniel", image: cocker },
    { name: "Saint Bernard", image: saint },
    { name: "Rajapalayam", image: rajapalayam },
    { name: "Kombai", image: kombai },
    { name: "Kanni", image: kanni },
    { name: "Chippiparai", image: chippiparai },
    { name: "Indian Pariah", image: pariah },
    { name: "Border Collie", image: bordercollie },
    { name: "Australian Shepherd", image: australiansphe },
    { name: "Belgian Malinois", image: belgian },
    { name: "Bull Terrier", image: bullterrier },
    { name: "Basset Hound", image: bassethound },
    { name: "Bloodhound", image: bloodhound },
    { name: "Boston Terrier", image: bostonterrier },
    { name: "Chihuahua", image: chihuahua },
    { name: "Dalmatian", image: dalmatian },
    { name: "English Bulldog", image: englishbulldog },
    { name: "French Bulldog", image: frenchbulldog },
    { name: "Akita", image: akita },
    { name: "American Eskimo Dog", image: americaneskimo },
    { name: "Bernese Mountain Dog", image: bernesemountain },
    { name: "Bichon Frise", image: bichonfrise },
    { name: "Cane Corso", image: canecorso },
    { name: "Chow Chow", image: chowchow },
    { name: "English Cocker Spaniel", image: englishcocker },
    { name: "English Springer Spaniel", image: englishspringer },
    { name: "Flat-Coated Retriever", image: flatcoated },
    { name: "Jack Russell Terrier", image: jackrussell },
    { name: "Newfoundland", image: newfoundland },
    { name: "Papillon", image: papillon },
    { name: "Pekingese", image: pekingese },
    { name: "Samoyed", image: samoyed },
    { name: "Scottish Terrier", image: scottishterrier },
    { name: "Shar Pei", image: sharpei },
    { name: "Weimaraner", image: weimaraner },
    { name: "Whippet", image: whippet },
    { name: "Yorkshire Terrier", image: yorkshire },
    { name: "Miniature Schnauzer", image: schnauzer }
  ];

  return (
    <div className="consult-page">
      <Navbar />
      <h1>🐶 Select Dog Breed</h1>
      <div className="search-container">
        <input type="text" placeholder="🔍 Search Dog Breed..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="search-bar" />
      </div>
      <div className="breed-grid">
        {dogs.filter((dog) => dog.name.toLowerCase().includes(searchTerm.toLowerCase())).map((dog, index) => (
          <div className="breed-card" key={index}>
            <img src={dog.image} alt={dog.name} className="breed-image" />
            <h2>{dog.name}</h2>
            <button onClick={() => navigate("/dashboard", { state: { breed: dog.name } })}>Open Dashboard</button>
          </div>
        ))}
      </div>
      {dogs.filter((dog) => dog.name.toLowerCase().includes(searchTerm.toLowerCase())).length === 0 && (
        <h2 className="not-found">❌ No Breed Found</h2>
      )}
    </div>
  );
}

// ================= NEARBY VETS MAP =================
function NearbyVetsMap({ vets, onClose }) {
  return (
    <div style={{ marginTop: "30px", background: "#fff5f5", border: "2px solid red", borderRadius: "20px", padding: "25px" }}>
      <h2 style={{ color: "red", textAlign: "center" }}>🚨 Emergency! Nearby Veterinary Clinics</h2>
      <p style={{ textAlign: "center", color: "#666", marginBottom: "20px" }}>Please visit the nearest vet immediately!</p>
      {vets.map((vet, i) => (
        <div key={i} style={{ background: "#fff", padding: "15px", borderRadius: "12px", marginBottom: "12px", boxShadow: "0 3px 10px rgba(0,0,0,0.1)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <h3 style={{ color: "#5c3d2e", margin: 0 }}>📍 {vet.name}</h3>
            <p style={{ color: "#888", margin: "5px 0" }}>{vet.address}</p>
            <p style={{ color: "#888", margin: 0 }}>📞 {vet.phone}</p>
          </div>
          <div style={{ textAlign: "right" }}>
            <p style={{ color: "#b08968", fontWeight: "bold" }}>{vet.distance_km} km away</p>
            <a href={`https://www.google.com/maps/search/${encodeURIComponent(vet.name + " " + vet.address)}`} target="_blank" rel="noreferrer">
              <button style={{ width: "auto", padding: "8px 15px", marginTop: "5px", background: "#4CAF50" }}>🗺️ Open Map</button>
            </a>
          </div>
        </div>
      ))}
      <button onClick={onClose} style={{ background: "#888", marginTop: "10px" }}>Close</button>
    </div>
  );
}

// ================= DASHBOARD PAGE =================
function DashboardPage() {
  const location = useLocation();
  const selectedBreed = location.state?.breed || "Unknown Breed";
  const [showGeneral, setShowGeneral] = React.useState(false);
  const [showSick, setShowSick] = React.useState(false);
  const [prediction, setPrediction] = React.useState("");
  const [dogName, setDogName] = React.useState("");
  const [dogAge, setDogAge] = React.useState("");
  const [dogWeight, setDogWeight] = React.useState("");
  const [address, setAddress] = React.useState("");
  const [activityLevel, setActivityLevel] = React.useState("moderate");
  const [imagePreview, setImagePreview] = React.useState(null);
  const [imageFile, setImageFile] = React.useState(null);
  const [severity, setSeverity] = React.useState("");
  const [confidence, setConfidence] = React.useState("");
  const [prescription, setPrescription] = React.useState("");
  const [treatment, setTreatment] = React.useState([]);
  const [emergency, setEmergency] = React.useState(false);
  const [nearbyVets, setNearbyVets] = React.useState([]);
  const [showVets, setShowVets] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [selectedSymptoms, setSelectedSymptoms] = React.useState([]);
  const [recommendations, setRecommendations] = React.useState([]);

  const user_id = localStorage.getItem("user_id") || 1;

  const symptoms = ["fever", "vomiting", "skin_rash", "tick", "eye_discharge", "loss_of_appetite", "lethargy", "diarrhea", "seizure", "breathing_difficulty"];
  const symptomLabels = { fever: "Fever", vomiting: "Vomiting", skin_rash: "Skin Rash", tick: "Tick Infestation", eye_discharge: "Eye Infection", loss_of_appetite: "Loss of Appetite", lethargy: "Lethargy", diarrhea: "Diarrhea", seizure: "Seizure ⚠️", breathing_difficulty: "Breathing Difficulty ⚠️" };

  const toggleSymptom = (s) => {
    setSelectedSymptoms(prev => prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s]);
  };

  const fetchNearbyVets = () => {
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        try {
          const res = await fetch(`${API}/nearby-vets?lat=${latitude}&lng=${longitude}`);
          const data = await res.json();
          setNearbyVets(data.vets || []);
          setShowVets(true);
        } catch (e) {
          // fallback to Madurai coords
          const res = await fetch(`${API}/nearby-vets?lat=9.9252&lng=78.1198`);
          const data = await res.json();
          setNearbyVets(data.vets || []);
          setShowVets(true);
        }
      },
      async () => {
        const res = await fetch(`${API}/nearby-vets?lat=9.9252&lng=78.1198`);
        const data = await res.json();
        setNearbyVets(data.vets || []);
        setShowVets(true);
      }
    );
  };

  const handleGeneralCheckup = async () => {
    if (!dogName || !dogAge || !dogWeight) {
      alert("Please fill Dog Name, Age and Weight!");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${API}/health-checkup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ dog_name: dogName, age: dogAge, weight: dogWeight, activity_level: activityLevel, user_id })
      });
      const data = await res.json();
      setPrediction(data.health_status);
      setRecommendations(data.recommendations || []);
    } catch (e) {
      alert("❌ Server error!");
    }
    setLoading(false);
  };

  const handleSickDiagnosis = async () => {
    if (!dogName) { alert("Please enter Dog Name!"); return; }
    setLoading(true);
    try {
      let diseaseResult = null;

      // Image diagnosis using CNN
      if (imageFile) {
        const formData = new FormData();
        formData.append("image", imageFile);
        formData.append("dog_name", dogName);
        formData.append("user_id", user_id);
        const res = await fetch(`${API}/skin-diagnosis`, { method: "POST", body: formData });
        diseaseResult = await res.json();
        setPrediction(diseaseResult.predicted_disease);
        setConfidence(diseaseResult.confidence + "%");
        setPrescription(diseaseResult.prescription);
        setTreatment(diseaseResult.treatment || []);
        setEmergency(diseaseResult.emergency);
        setSeverity(diseaseResult.emergency ? "High" : "Moderate");
      }

      // Symptom diagnosis
      if (selectedSymptoms.length > 0) {
        const topSymptom = selectedSymptoms[0];
        const res = await fetch(`${API}/diagnose`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ dog_name: dogName, symptoms: selectedSymptoms.join(", "), category: topSymptom, user_id })
        });
        const data = await res.json();
        if (!diseaseResult) {
          setPrediction(data.diagnosis);
          setPrescription(data.prescription);
          setTreatment(data.treatment || []);
          setEmergency(data.emergency);
          setSeverity(data.emergency ? "High" : "Moderate");
          setConfidence("N/A");
        }
        // Emergency → auto show nearby vets
        if (data.emergency) {
          fetchNearbyVets();
        }
      }

      if (!imageFile && selectedSymptoms.length === 0) {
        alert("Please upload an image or select symptoms!");
        setLoading(false);
        return;
      }

    } catch (e) {
      alert("❌ Server error!");
    }
    setLoading(false);
  };

  const generatePDF = () => {
    const doc = new jsPDF();
    doc.setFillColor(18, 18, 18);
    doc.rect(0, 0, 210, 30, "F");
    doc.addImage(logo, "PNG", 10, 5, 18, 18);
    doc.setTextColor(255, 193, 7);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(26);
    doc.text("VetSense", 105, 14, { align: "center" });
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(11);
    doc.text("AI-Powered Canine Diagnosis & Health Monitoring Platform", 105, 23, { align: "center" });
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(11);
    doc.text(`Report ID : VS-${Math.floor(Math.random() * 100000)}`, 15, 40);
    doc.text(`Consult Date : ${new Date().toLocaleDateString()}`, 130, 40);
    doc.setFillColor(255, 193, 7);
    doc.roundedRect(10, 50, 190, 10, 2, 2, "F");
    doc.setFontSize(14);
    doc.text("DOG INFORMATION", 15, 57);
    doc.setFontSize(11);
    doc.text(`Breed : ${selectedBreed}`, 15, 72);
    doc.text(`Dog Name : ${dogName}`, 15, 82);
    doc.text(`Age : ${dogAge} Years`, 110, 72);
    doc.text(`Weight : ${dogWeight} Kg`, 110, 82);
    doc.setFillColor(255, 193, 7);
    doc.roundedRect(10, 95, 190, 10, 2, 2, "F");
    doc.text("AI DIAGNOSIS", 15, 102);
    doc.setFontSize(11);
    doc.text(`Disease : ${prediction}`, 15, 115);
    doc.text(`Confidence : ${confidence}`, 15, 125);
    doc.text(`Severity : ${severity}`, 15, 135);
    doc.setFillColor(255, 193, 7);
    doc.roundedRect(10, 145, 190, 10, 2, 2, "F");
    doc.text("PRESCRIPTION", 15, 152);
    doc.setFontSize(10);
    doc.text(prescription || "Consult veterinarian", 15, 165);
    if (emergency) {
      doc.setFillColor(255, 230, 230);
      doc.roundedRect(10, 185, 190, 25, 2, 2, "F");
      doc.setTextColor(200, 0, 0);
      doc.setFontSize(12);
      doc.text("🚨 EMERGENCY ALERT", 15, 195);
      doc.setFontSize(10);
      doc.text("Please visit the nearest veterinarian immediately!", 15, 205);
    }
    doc.setDrawColor(255, 193, 7);
    doc.line(10, 265, 200, 265);
    doc.setTextColor(120);
    doc.setFontSize(9);
    doc.text("Generated by VetSense AI | This report is for informational purposes only.", 105, 275, { align: "center" });
    doc.save(`VetSense_Report_${dogName}.pdf`);
  };

  return (
    <div className="dashboard-page">
      <Navbar />
      <h1>🩺 Health Dashboards</h1>
      <div className="selected-breed">🐶 Selected Breed: <span>{selectedBreed}</span></div>

      {!showGeneral && !showSick && (
        <div className="dashboard-grid">
          <div className="dashboard-card" onClick={() => { setShowGeneral(true); setShowSick(false); }}>
            <h2>🐶 General Checkup</h2>
            <p>Analyze your dog's normal health condition using AI.</p>
            <button>Open Dashboard</button>
          </div>
          <div className="dashboard-card" onClick={() => { setShowSick(true); setShowGeneral(false); }}>
            <h2>🚨 Sick Checkup</h2>
            <p>Diagnose diseases using symptoms and image analysis.</p>
            <button>Open Dashboard</button>
          </div>
        </div>
      )}

      {/* GENERAL CHECKUP */}
      {showGeneral && (
        <div className="general-checkup-card">
          <button className="back-btn" onClick={() => { setShowGeneral(false); setPrediction(""); }}>← Back to Dashboard</button>
          <h2>🐕 General Health Checkup</h2>
          <input type="text" placeholder="Dog Name" value={dogName} onChange={e => setDogName(e.target.value)} />
          <input type="number" placeholder="Dog Age (years)" value={dogAge} onChange={e => setDogAge(e.target.value)} />
          <input type="number" placeholder="Dog Weight (kg)" value={dogWeight} onChange={e => setDogWeight(e.target.value)} />
          <select value={activityLevel} onChange={e => setActivityLevel(e.target.value)}>
            <option value="low">Low Activity</option>
            <option value="moderate">Moderate Activity</option>
            <option value="high">High Activity</option>
          </select>
          <button onClick={handleGeneralCheckup} disabled={loading}>
            {loading ? "Analyzing..." : "Predict Health Condition"}
          </button>
          {prediction && (
            <div className="prediction-box">
              <h3>AI Prediction Result</h3>
              <p><strong>Status:</strong> {prediction}</p>
              {recommendations.length > 0 && (
                <div>
                  <h3>Recommendations:</h3>
                  {recommendations.map((r, i) => <p key={i}>✅ {r}</p>)}
                </div>
              )}
              <button onClick={generatePDF} style={{ marginTop: "15px", background: "#4CAF50" }}>📄 Download PDF Report</button>
            </div>
          )}
        </div>
      )}

      {/* SICK CHECKUP */}
      {showSick && (
        <div className="general-checkup-card">
          <button className="back-btn" onClick={() => { setShowSick(false); setPrediction(""); setShowVets(false); }}>← Back to Dashboard</button>
          <h2>🚨 Sick Dog Diagnosis</h2>
          <input type="text" placeholder="Dog Name" value={dogName} onChange={e => setDogName(e.target.value)} />
          <input type="number" placeholder="Dog Age" value={dogAge} onChange={e => setDogAge(e.target.value)} />
          <input type="number" placeholder="Dog Weight (kg)" value={dogWeight} onChange={e => setDogWeight(e.target.value)} />
          <input type="text" placeholder="Address" value={address} onChange={e => setAddress(e.target.value)} />

          <h3>Symptoms</h3>
          {symptoms.map(s => (
            <label key={s} style={{ display: "flex", alignItems: "center", gap: "10px", marginTop: "10px" }}>
              <input type="checkbox" checked={selectedSymptoms.includes(s)} onChange={() => toggleSymptom(s)} />
              {symptomLabels[s]}
            </label>
          ))}

          <h3>Upload Dog Image (for skin disease detection)</h3>
          <input type="file" accept="image/*" onChange={(e) => {
            const file = e.target.files[0];
            if (file) { setImageFile(file); setImagePreview(URL.createObjectURL(file)); }
          }} />
          {imagePreview && (
            <div className="image-preview-box">
              <img src={imagePreview} alt="Dog Preview" className="image-preview" />
            </div>
          )}

          <button onClick={handleSickDiagnosis} disabled={loading}>
            {loading ? "Analyzing..." : "Analyze Disease"}
          </button>

          {prediction && (
            <div className="prediction-box">
              <h3>Disease Prediction</h3>
              <p><strong>Disease:</strong> {prediction}</p>
              <p><strong>Confidence:</strong> {confidence}</p>
              <p><strong>Severity:</strong> {severity}</p>
              <h3>Treatment</h3>
              {treatment.map((t, i) => <p key={i}>• {t}</p>)}
              <h3>Prescription</h3>
              <p>{prescription}</p>
              {emergency && (
                <div className="emergency-alert">
                  🚨 Emergency Alert!<br />
                  Visit nearest veterinary clinic immediately!<br />
                  <button onClick={fetchNearbyVets} style={{ background: "red", marginTop: "10px", width: "auto", padding: "10px 20px" }}>
                    📍 Find Nearest Vet Now
                  </button>
                </div>
              )}
              <button onClick={generatePDF} style={{ background: "#4CAF50", marginTop: "15px" }}>📄 Download PDF Report</button>
            </div>
          )}

          {showVets && nearbyVets.length > 0 && (
            <NearbyVetsMap vets={nearbyVets} onClose={() => setShowVets(false)} />
          )}
        </div>
      )}
    </div>
  );
}

// ================= REMINDER PAGE =================
function ReminderPage() {
  const [dogName, setDogName] = React.useState("");
  const [dogAge, setDogAge] = React.useState("");
  const [breed, setBreed] = React.useState("general");
  const [ageMonths, setAgeMonths] = React.useState("");
  const [lastVaccine, setLastVaccine] = React.useState("");
  const [nextVaccine, setNextVaccine] = React.useState("");
  const [alert, setAlert] = React.useState(false);
  const [schedule, setSchedule] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const user_id = localStorage.getItem("user_id") || 1;

  const calculateReminder = async () => {
    if (!lastVaccine) return;
    const lastDate = new Date(lastVaccine);
    const nextDate = new Date(lastDate);
    nextDate.setFullYear(nextDate.getFullYear() + 1);
    setNextVaccine(nextDate.toDateString());
    const today = new Date();
    const diffDays = Math.ceil((nextDate - today) / (1000 * 60 * 60 * 24));
    setAlert(diffDays <= 30);

    // Call vaccination API
    if (ageMonths) {
      setLoading(true);
      try {
        const res = await fetch(`${API}/vaccination-schedule`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ dog_name: dogName, breed, age_months: ageMonths, user_id })
        });
        const data = await res.json();
        setSchedule(data.vaccination_schedule || []);
      } catch (e) {
        console.error(e);
      }
      setLoading(false);
    }
  };

  return (
    <div className="reminder-page">
      <Navbar />
      <div className="reminder-top">
        <h1>💉 Smart Vaccination Reminder</h1>
        <p>VetSense helps dog owners track vaccination schedules intelligently.<br /><br />Enter your dog's details and last vaccination date to automatically calculate the next vaccination schedule.</p>
      </div>
      <div className="reminder-features">
        <div className="reminder-feature-card"><h2>🐶 Health Protection</h2><p>Timely vaccination protects dogs from dangerous viral diseases.</p></div>
        <div className="reminder-feature-card"><h2>⏰ Smart Alerts</h2><p>Get early reminders before the vaccination due date arrives.</p></div>
        <div className="reminder-feature-card"><h2>📅 Auto Scheduling</h2><p>VetSense automatically calculates the next vaccine schedule.</p></div>
      </div>
      {alert && (
        <div className="alert-box">⚠ Vaccination Date is Near! Please visit your veterinarian soon.</div>
      )}
      <div className="reminder-card">
        <h2>Enter Dog Details</h2>
        <input type="text" placeholder="Dog Name" value={dogName} onChange={e => setDogName(e.target.value)} />
        <input type="number" placeholder="Dog Age (years)" value={dogAge} onChange={e => setDogAge(e.target.value)} />
        <input type="number" placeholder="Dog Age in Months (e.g. 6)" value={ageMonths} onChange={e => setAgeMonths(e.target.value)} />
        <select value={breed} onChange={e => setBreed(e.target.value)}>
  <option value="general">General</option>
  <option value="labrador">Labrador Retriever</option>
  <option value="german shepherd">German Shepherd</option>
  <option value="golden retriever">Golden Retriever</option>
  <option value="pug">Pug</option>
  <option value="beagle">Beagle</option>
  <option value="rottweiler">Rottweiler</option>
  <option value="dobermann">Dobermann</option>
  <option value="siberian husky">Siberian Husky</option>
  <option value="shih tzu">Shih Tzu</option>
  <option value="pomeranian">Pomeranian</option>
  <option value="dachshund">Dachshund</option>
  <option value="boxer">Boxer</option>
  <option value="great dane">Great Dane</option>
  <option value="cocker spaniel">Cocker Spaniel</option>
  <option value="saint bernard">Saint Bernard</option>
  <option value="rajapalayam">Rajapalayam</option>
  <option value="kombai">Kombai</option>
  <option value="kanni">Kanni</option>
  <option value="chippiparai">Chippiparai</option>
  <option value="indian pariah">Indian Pariah</option>
  <option value="border collie">Border Collie</option>
  <option value="australian shepherd">Australian Shepherd</option>
  <option value="belgian malinois">Belgian Malinois</option>
  <option value="bull terrier">Bull Terrier</option>
  <option value="basset hound">Basset Hound</option>
  <option value="bloodhound">Bloodhound</option>
  <option value="boston terrier">Boston Terrier</option>
  <option value="chihuahua">Chihuahua</option>
  <option value="dalmatian">Dalmatian</option>
  <option value="english bulldog">English Bulldog</option>
  <option value="french bulldog">French Bulldog</option>
  <option value="akita">Akita</option>
  <option value="american eskimo">American Eskimo Dog</option>
  <option value="bernese mountain">Bernese Mountain Dog</option>
  <option value="bichon frise">Bichon Frise</option>
  <option value="cane corso">Cane Corso</option>
  <option value="chow chow">Chow Chow</option>
  <option value="english cocker spaniel">English Cocker Spaniel</option>
  <option value="english springer spaniel">English Springer Spaniel</option>
  <option value="flat-coated retriever">Flat-Coated Retriever</option>
  <option value="jack russell terrier">Jack Russell Terrier</option>
  <option value="newfoundland">Newfoundland</option>
  <option value="papillon">Papillon</option>
  <option value="pekingese">Pekingese</option>
  <option value="samoyed">Samoyed</option>
  <option value="scottish terrier">Scottish Terrier</option>
  <option value="shar pei">Shar Pei</option>
  <option value="weimaraner">Weimaraner</option>
  <option value="whippet">Whippet</option>
  <option value="yorkshire terrier">Yorkshire Terrier</option>
  <option value="miniature schnauzer">Miniature Schnauzer</option>
  <option value="poodle">Poodle</option>
</select>

<label style={{
  display: "block",
  marginTop: "18px",
  color: "#8d6e63",
  fontWeight: "600",
  fontSize: "15px"
}}>
  📅 Last Vaccine Date:
</label>
<input
  type="date"
  value={lastVaccine}
  onChange={e => setLastVaccine(e.target.value)}
/>
          {loading ? "Calculating..." : "Calculate Next Vaccine"}
        </button>
        {nextVaccine && (
          <div className="result-box">
            <h2>🐶 {dogName}</h2>
            <p>Dog Age : {dogAge} Years</p>
            <p>Last Vaccine : {lastVaccine}</p>
            <p className="next-date">Next Vaccine : {nextVaccine}</p>
            {schedule.length > 0 && (
              <div style={{ marginTop: "20px" }}>
                <h3>📋 Vaccination Schedule:</h3>
                {schedule.map((s, i) => (
                  <div key={i} style={{ background: s.priority === "High" ? "#ffe5e5" : "#f5f5f5", padding: "10px", borderRadius: "8px", marginTop: "8px" }}>
                    <p><strong>💉 {s.vaccine}</strong></p>
                    <p>Due: {s.due} | Priority: {s.priority}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// ================= FEEDBACK PAGE =================
function FeedbackPage() {
  return (
    <div className="simple-page">
      <Navbar />
      <h1>⭐ Feedback</h1>
      <div className="feedback-box">
        <input type="text" placeholder="Your Name" />
        <textarea placeholder="Share your experience..."></textarea>
        <button>Submit Feedback</button>
      </div>
    </div>
  );
}

// ================= APP =================
export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/consult" element={<ConsultPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/reminder" element={<ReminderPage />} />
        <Route path="/feedback" element={<FeedbackPage />} />
      </Routes>
      <style>{`
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');
*{ margin:0; padding:0; box-sizing:border-box; font-family:'Poppins',sans-serif; }
body{ background:#f6f1eb; overflow-x:hidden; }
.video-page{ width:100%; height:100vh; position:relative; display:flex; justify-content:center; align-items:center; overflow:hidden; }
.video-bg{ position:absolute; top:0; left:0; width:100%; height:100%; object-fit:cover; z-index:-2; background:black; }
.overlay{ position:absolute; width:100%; height:100%; background:rgba(0,0,0,0.35); z-index:-1; }
.glass-card{ width:420px; padding:45px; border-radius:25px; background:rgba(255,250,245,0.18); backdrop-filter:blur(12px); color:white; text-align:center; box-shadow:0 8px 32px rgba(0,0,0,0.3); border:1px solid rgba(255,255,255,0.2); }
.glass-card h1{ font-size:42px; margin-bottom:10px; }
.glass-card p{ color:#f1f1f1; margin-bottom:20px; line-height:1.8; }
input,textarea,select{ width:100%; padding:15px; margin-top:18px; border:none; border-radius:12px; outline:none; background:#f1e5d8; color:#4e342e; font-size:16px; }
input::placeholder,textarea::placeholder{ color:#8d6e63; }
button{ width:100%; padding:15px; margin-top:20px; border:none; border-radius:12px; background:#b08968; color:white; font-size:17px; font-weight:600; cursor:pointer; transition:0.3s; }
button:hover{ background:#8d6e63; }
button:disabled{ background:#ccc; cursor:not-allowed; }
a{ color:#ffe0b2; text-decoration:none; }
h3{ margin-top:20px; }
.navbar{ width:100%; padding:22px 70px; display:flex; justify-content:space-between; align-items:center; background:#d8c2b0; border-bottom:1px solid #c7ae98; box-shadow:0 4px 15px rgba(0,0,0,0.05); position:sticky; top:0; z-index:1000; }
.logo{ font-size:42px; font-weight:700; color:#5c3d2e; }
.navbar ul{ display:flex; gap:35px; list-style:none; }
.navbar a{ color:#5c3d2e; font-weight:600; font-size:17px; transition:0.3s; }
.navbar a:hover{ color:#a06b45; }
.logout-btn{ background:#8b5e3c; color:white; border:none; padding:10px 20px; border-radius:10px; cursor:pointer; font-size:15px; font-weight:600; transition:0.3s; }
.logout-btn:hover{ background:#6f472d; transform:scale(1.05); }
.hero-section{ min-height:90vh; display:flex; justify-content:space-between; align-items:center; padding:80px; background:#f6f1eb; color:#4e342e; flex-wrap:wrap; }
.hero-left{ flex:1; }
.hero-left h1{ font-size:65px; line-height:1.2; }
.hero-left p{ margin-top:25px; width:80%; font-size:20px; color:#6d4c41; line-height:1.8; }
.hero-btn{ width:240px; }
.hero-right img{ width:460px; border-radius:25px; box-shadow:0 10px 30px rgba(176,137,104,0.3); }
.features-section{ padding:90px; background:#efe4d6; color:#4e342e; }
.features-section h1{ text-align:center; font-size:50px; margin-bottom:60px; }
.features-grid{ display:grid; grid-template-columns:repeat(auto-fit,minmax(280px,1fr)); gap:30px; }
.feature-card{ background:#fffaf5; padding:35px; border-radius:20px; transition:0.3s; box-shadow:0 5px 15px rgba(0,0,0,0.06); }
.feature-card:hover{ transform:translateY(-10px); }
.feature-card h2{ margin-bottom:20px; color:#5c4033; }
.feature-card p{ color:#6d4c41; line-height:1.8; }
.why-section{ background:#f6f1eb; color:#4e342e; display:flex; justify-content:center; align-items:center; gap:60px; padding:90px; flex-wrap:wrap; }
.why-left img{ width:420px; border-radius:25px; }
.why-right{ max-width:600px; }
.why-right h1{ font-size:55px; margin-bottom:25px; }
.why-right p{ font-size:20px; line-height:2; color:#6d4c41; }
.simple-page{ min-height:100vh; background:#f7f2ec; color:#5c3d2e; width:100%; padding:0 0 90px 0; }
.simple-page h1{ text-align:center; font-size:55px; margin-bottom:40px; }
.about-page{ min-height:100vh; background:#f7f2ec; color:#5c3d2e; }
.about-container{ max-width:1300px; margin:auto; padding:60px 90px; }
.about-container h1{ text-align:center; font-size:68px; margin-bottom:30px; color:#5b3d36; font-weight:700; }
.about-container p{ text-align:center; color:#7b5e57; font-size:22px; line-height:2; max-width:1100px; margin:auto; }
.about-grid{ margin-top:70px; display:grid; grid-template-columns:repeat(auto-fit,minmax(320px,1fr)); gap:35px; }
.about-card{ background:#e7d8cb; padding:35px; border-radius:22px; transition:all 0.4s ease; box-shadow:0 8px 20px rgba(0,0,0,0.08); border:1px solid #d6c1b2; position:relative; overflow:hidden; }
.about-card:hover{ transform:translateY(-10px) scale(1.02); background:#dcc7b6; }
.about-card h2{ margin-bottom:18px; color:#7b5e57; font-size:30px; font-weight:700; }
.about-card p{ text-align:left; font-size:18px; line-height:1.9; color:#6b524b; }
.about-bottom{ margin-top:90px; background:#e7d8cb; padding:55px; border-radius:25px; text-align:center; }
.about-bottom h2{ font-size:42px; margin-bottom:25px; color:#5b3d36; }
.about-bottom p{ color:#6b524b; font-size:20px; line-height:2; }
.consult-page{ min-height:100vh; background:#f7f2ec; color:#5c3d2e; width:100%; padding:0 0 90px 0; }
.consult-page h1{ text-align:center; font-size:55px; margin-bottom:60px; }
.breed-grid{ display:grid; grid-template-columns:repeat(auto-fit,minmax(250px,1fr)); gap:25px; padding:40px; }
.breed-card{ background:rgba(255,255,255,0.15); backdrop-filter:blur(12px); border-radius:20px; padding:20px; text-align:center; transition:0.4s; border:1px solid rgba(255,255,255,0.2); }
.breed-card:hover{ transform:translateY(-10px); box-shadow:0 15px 30px rgba(92,64,51,0.25); }
.breed-image{ width:180px; height:180px; object-fit:contain; margin-bottom:15px; transition:0.4s; }
.breed-card:hover .breed-image{ transform:scale(1.08); }
.breed-card h2{ color:#5c4033; margin:15px 0; }
.breed-card button{ background:#b58b67; color:white; border:none; padding:10px 20px; border-radius:10px; cursor:pointer; }
.dashboard-page{ min-height:100vh; background:#f6f1eb; color:#4e342e; padding:0 0 90px 0; }
.dashboard-page h1{ text-align:center; font-size:55px; margin-bottom:60px; }
.dashboard-grid{ display:flex; justify-content:center; gap:40px; flex-wrap:wrap; }
.dashboard-card{ width:420px; background:#fffaf5; padding:45px; border-radius:25px; text-align:center; cursor:pointer; transition:all 0.3s ease; box-shadow:0 5px 15px rgba(0,0,0,0.06); }
.dashboard-card:hover{ transform:translateY(-10px); }
.dashboard-card p{ color:#6d4c41; line-height:1.8; }
.general-checkup-card{ width:650px; margin:auto; background:#fffaf5; padding:45px; border-radius:25px; box-shadow:0 5px 15px rgba(0,0,0,0.06); }
.general-checkup-card h2{ text-align:center; margin-bottom:30px; }
.prediction-box{ margin-top:35px; background:#f1e5d8; padding:25px; border-radius:18px; text-align:center; }
.prediction-box h3{ margin-bottom:15px; color:#8d6e63; }
.prediction-box p{ font-size:18px; color:#6d4c41; }
.reminder-page{ min-height:100vh; background:#f7f2ec; color:#5c3d2e; width:100%; padding:0 0 90px 0; }
.reminder-top{ text-align:center; max-width:900px; margin:auto; padding:0 90px; }
.reminder-top h1{ font-size:60px; margin-bottom:30px; }
.reminder-features{ margin-top:70px; display:grid; grid-template-columns:repeat(auto-fit,minmax(280px,1fr)); gap:30px; }
.reminder-feature-card{ background:#fffaf5; padding:35px; border-radius:22px; transition:0.3s; box-shadow:0 5px 15px rgba(0,0,0,0.06); }
.reminder-feature-card:hover{ transform:translateY(-10px); }
.reminder-feature-card h2{ margin-bottom:18px; color:#8d6e63; }
.reminder-feature-card p{ color:#6d4c41; line-height:1.8; }
.alert-box{ width:650px; margin:50px auto 30px auto; background:#d84315; color:white; padding:18px; border-radius:12px; text-align:center; font-size:18px; font-weight:600; }
.reminder-card{ width:550px; margin:40px auto; background:#fffaf5; padding:45px; border-radius:25px; box-shadow:0 5px 15px rgba(0,0,0,0.06); }
.result-box{ margin-top:30px; background:#f1e5d8; padding:25px; border-radius:18px; }
.result-box p{ margin-top:12px; color:#6d4c41; font-size:18px; }
.next-date{ color:#8d6e63 !important; font-weight:bold; font-size:20px !important; }
.feedback-box{ max-width:650px; margin:auto; background:#e7d8cb; padding:45px; border-radius:20px; }
textarea{ height:160px; resize:none; }
.footer{ background:#eadbc8; color:#4e342e; text-align:center; padding:40px; }
.stats-section{ display:grid; grid-template-columns:repeat(auto-fit,minmax(220px,1fr)); gap:25px; padding:70px; }
.stat-card{ background:#d9c2b0; padding:35px; border-radius:22px; text-align:center; transition:all 0.4s ease; box-shadow:0 8px 20px rgba(0,0,0,0.08); }
.stat-card:hover{ transform:translateY(-10px) scale(1.04); }
.stat-card h1{ color:#6b4f3d; font-size:50px; }
.workflow-section{ padding:80px; text-align:center; }
.workflow-section h1{ margin-bottom:50px; }
.workflow-grid{ display:grid; grid-template-columns:repeat(auto-fit,minmax(250px,1fr)); gap:25px; }
.workflow-card{ background:#eadccf; padding:30px; border-radius:22px; transition:all 0.4s ease; }
.workflow-card:hover{ transform:translateY(-10px); background:#dcc7b6; }
.search-container{ text-align:center; margin-bottom:40px; }
.search-bar{ width:450px; max-width:90%; padding:15px 20px; border:none; border-radius:30px; font-size:18px; outline:none; background:#f5ede7; box-shadow:0 5px 15px rgba(0,0,0,0.1); transition:0.3s; }
.search-bar:focus{ transform:scale(1.03); }
.not-found{ text-align:center; margin-top:40px; color:#8b0000; }
.selected-breed{ width:fit-content; margin:20px auto; padding:14px 28px; background:#f4e8dc; border:2px solid #d6b89c; border-radius:18px; font-size:20px; font-weight:700; color:#6d4c41; }
.selected-breed span{ color:#c26a2d; margin-left:8px; font-size:22px; font-weight:800; }
.emergency-alert{ margin-top:20px; padding:20px; background:#ffe5e5; border:2px solid red; color:red; border-radius:15px; font-weight:700; text-align:center; }
.back-btn{ background:#8b5e3c; color:white; border:none; padding:12px 22px; border-radius:12px; cursor:pointer; font-weight:600; margin-bottom:20px; transition:0.3s; }
.back-btn:hover{ transform:translateY(-3px); }
.general-checkup-card,.sick-checkup-card{ animation:slideUp 0.5s ease; }
@keyframes slideUp{ from{ opacity:0; transform:translateY(40px); } to{ opacity:1; transform:translateY(0); } }
.image-preview-box{ text-align:center; margin-top:20px; }
.image-preview{ width:250px; height:250px; object-fit:cover; border-radius:20px; border:3px solid #8b5e3c; box-shadow:0 8px 20px rgba(0,0,0,0.15); }
      `}</style>
    </Router>
  );
}