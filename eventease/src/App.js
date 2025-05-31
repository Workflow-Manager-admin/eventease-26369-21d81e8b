import React, { useState } from 'react';
import './App.css';
import { AuthForms } from "./AuthForms";

/*
  Extension for: Category card selection, Travel subcategory modal, Booking Form, My Bookings page.

  - Categories: Movies, Travel (submenu: Train, Flight, Bus, Cab), Events, Sports, Concerts
  - Selecting a category routes to a booking form; submission stores details locally per user, then goes to "My Bookings".
  - My Bookings: list all user's bookings, with cancel (remove) support.
*/

// Travel subcategories
const TRAVEL_SUBCATEGORIES = ["Train", "Flight", "Bus", "Cab"];

// Booking "purposes" for generalization
const CATEGORY_ICONS = {
  Movies: "🎬",
  Travel: "🌍",
  Events: "🎫",
  Sports: "⚽",
  Concerts: "🎵"
};
const CATEGORY_CHOICES = ["Movies", "Travel", "Events", "Sports", "Concerts"];
const TRAVEL_CATEGORY_TITLE = "Travel";
const ALL_PURPOSES = [
  "Movies",
  ...TRAVEL_SUBCATEGORIES.map(t => `Travel:${t}`),
  "Events",
  "Sports",
  "Concerts"
];

/*
  Color palette provided in the requirements (with names matching for later CSS adaptability):
    --primary: #101820;
    --secondary: #0057B8;
    --accent: #00ADEF;
*/

/** Main App with category cards, booking flow, and 'My Bookings' state **/

function App() {
  // State
  const [activePage, setActivePage] = useState('home');
  const [isAdmin, setIsAdmin] = useState(false);
  const [authUser, setAuthUser] = useState(null); // {username}
  const [showTravelModal, setShowTravelModal] = useState(false);
  const [selectedPurpose, setSelectedPurpose] = useState(undefined); // e.g., "Movies", or "Travel:Train"
  const [bookingFormData, setBookingFormData] = useState(undefined);
  // Bookings: { [username]: [booking,...] }
  const [userBookings, setUserBookings] = useState({}); // { [username]: [{ purpose:..., data:..., id:...}, ...] }

  // --- Category Selection and Modal Logic
  function handleCategoryClick(cat) {
    if (cat === TRAVEL_CATEGORY_TITLE) {
      setShowTravelModal(true);
      return;
    } else {
      setSelectedPurpose(cat);
      setActivePage('book');
    }
  }
  function handleTravelSubSelect(sub) {
    setShowTravelModal(false);
    setTimeout(() => {
      setSelectedPurpose(`Travel:${sub}`);
      setActivePage('book');
    }, 150);
  }

  // PUBLIC_INTERFACE
  function BrowseCategories() {
    return (
      <div className="categories-grid">
        {CATEGORY_CHOICES.map((cat) => (
          <div
            className="category-card"
            key={cat}
            role="button"
            tabIndex={0}
            onClick={() => handleCategoryClick(cat)}
            style={{ outline: "none" }}
          >
            <div className="category-icon">{CATEGORY_ICONS[cat]}</div>
            <div className="category-title">{cat}</div>
          </div>
        ))}
        {/* Travel subcategory modal */}
        {showTravelModal &&
          <div className="modal-backdrop" onClick={() => setShowTravelModal(false)}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
              <button className="close-btn" onClick={() => setShowTravelModal(false)} title="Close">&times;</button>
              <div className="modal-title">Choose a Travel type</div>
              <div className="modal-grid">
                {TRAVEL_SUBCATEGORIES.map((sub) => (
                  <button
                    className="btn btn-large"
                    key={sub}
                    style={{ fontWeight: 500, letterSpacing: 0.5, margin: 0 }}
                    onClick={() => handleTravelSubSelect(sub)}
                  >
                    {sub}
                  </button>
                ))}
              </div>
            </div>
          </div>
        }
      </div>
    );
  }

  // PUBLIC_INTERFACE
  function SearchFilter() {
    return (
      <div className="search-filter-panel">
        <input type="text" className="search-input" placeholder="Search by event, location, or date" />
        <select className="filter-select">
          <option>All Prices</option>
          <option>Under $50</option>
          <option>$50-$100</option>
          <option>$100+</option>
        </select>
      </div>
    );
  }

  // --- Booking Form, Varies by selectedPurpose ---
  // PUBLIC_INTERFACE
  function BookingForm({ purpose, onSubmit, onCancel }) {
    // General form fields
    const baseFields = [
      { label: "Name", name: "name", type: "text", required: true, placeholder: "Your name" },
      { label: "Date", name: "date", type: "date", required: true }
    ];
    let extraFields = [];
    if (purpose.startsWith("Travel:")) {
      const travelType = purpose.split(":")[1];
      extraFields.push(
        { label: "From", name: "from", type: "text", placeholder: "Origin city", required: true },
        { label: "To", name: "to", type: "text", placeholder: "Destination city", required: true },
        { label: travelType === "Flight" ? "Flight No" : travelType === "Train" ? "Train No" : travelType === "Bus" ? "Bus No" : "Cab Type", name: "refId", type: "text", placeholder: "Ref/ID", required: false }
      );
    } else if (purpose === "Movies") {
      extraFields.push(
        { label: "Movie Title", name: "movie", type: "text", placeholder: "Movie name", required: true },
        { label: "Seat Count", name: "seats", type: "number", placeholder: "Number of seats", required: true, min: 1 }
      );
    } else if (purpose === "Events" || purpose === "Concerts" || purpose === "Sports") {
      extraFields.push(
        { label: "Event Name", name: "event", type: "text", placeholder: "Name", required: true },
        { label: "Tickets", name: "tickets", type: "number", placeholder: "Tickets", required: true, min: 1 }
      );
    }
    const allFields = [...baseFields, ...extraFields];
    const [form, setForm] = useState({});
    const [error, setError] = useState("");
    function handleFormSubmit(e) {
      e.preventDefault();
      for (let field of allFields) {
        if (field.required && !form[field.name]) {
          setError("Please fill all required fields.");
          return;
        }
      }
      setError("");
      onSubmit({ ...form, purpose });
    }
    return (
      <form className="booking-form-section" onSubmit={handleFormSubmit} autoComplete="off">
        <div className="booking-card-category" style={{ textAlign: "center", marginBottom: 14 }}>
          {CATEGORY_ICONS[purpose.split(":")[0]]} <span>{purpose.replace(":", " - ")}</span>
        </div>
        {allFields.map(field => (
          <div key={field.name}>
            <label htmlFor={field.name}>{field.label}{field.required ? " *" : ""}</label>
            <input
              type={field.type}
              name={field.name}
              id={field.name}
              value={form[field.name] || ""}
              placeholder={field.placeholder || ""}
              min={field.min}
              onChange={e => setForm({ ...form, [field.name]: e.target.value })}
              required={field.required}
            />
          </div>
        ))}
        {error && <div style={{ color: "#E87A41", margin: "6px 0", fontWeight: 500 }}>{error}</div>}
        <button className="btn" style={{ marginTop: 6 }} type="submit">Submit Booking</button>
        {onCancel && (
          <button type="button" className="btn" style={{ marginTop: 7, background: "#24272f", color: "#fff" }} onClick={onCancel}>
            Cancel
          </button>
        )}
      </form>
    );
  }

  // --- My Bookings List; show list for logged-in user, allow cancel
  // PUBLIC_INTERFACE
  function MyBookingsPage({ username, bookings, onCancel }) {
    if (!bookings || bookings.length === 0)
      return (
        <div className="placeholder" style={{marginTop:42}}>
          <h2>No Bookings Yet!</h2>
          <p>You haven't made any bookings. Explore categories and start booking your next ticket!</p>
          <button className="btn btn-large" style={{marginTop:17}} onClick={() => setActivePage('browse')}>Browse Categories</button>
        </div>
      );
    return (
      <div>
        <h2 style={{color:"var(--accent)", marginBottom:22}}>My Bookings</h2>
        <div className="booking-list">
          {bookings.map((booking) => (
            <div className="booking-card" key={booking.id ?? booking._localId}>
              <div className="booking-card-category">
                {CATEGORY_ICONS[booking.purpose.split(":")[0]]} {booking.purpose.replace(":", " - ")}
              </div>
              <div className="booking-card-details">
                {Object.entries(booking.data).filter(([k]) => k !== "purpose" && k !== "id").map(([k,v]) => (
                  <div key={k}><b style={{color:"var(--accent)"}}>{k[0].toUpperCase()+k.slice(1)}:</b> {v}</div>
                ))}
              </div>
              <button className="btn-cancel" onClick={() => onCancel(booking.id ?? booking._localId)}>
                Cancel
              </button>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // --- Booking Submission Logic
  function handleBookingSubmit(data) {
    // data: {...fields, purpose}
    if (!authUser) return;
    const username = authUser.username;
    const newBooking = {
      id: Date.now().toString() + Math.random().toString(16).slice(2),
      purpose: data.purpose,
      data: { ...data }
    };
    setUserBookings(prev => {
      return {
        ...prev,
        [username]: prev[username] ? [newBooking, ...prev[username]] : [newBooking]
      };
    });
    setBookingFormData(undefined);
    setSelectedPurpose(undefined);
    setTimeout(() => {
      setActivePage("mybookings");
    }, 200);
  }

  function handleCancelBooking(bookingId) {
    const username = authUser.username;
    setUserBookings(prev => ({
      ...prev,
      [username]: prev[username]?.filter(b => (b.id ?? b._localId) !== bookingId) || []
    }));
  }

  // --- Page Switches (incorporates category logic)
  function renderPage() {
    if (isAdmin) return <><div className="placeholder"><h2>Admin Event Management</h2>
      <p>Admins can manage users, events, view stats, and approve requests.</p>
    </div></>;
    // Auth check for protected pages
    if (!authUser && (["register", "mybookings", "book", "payment"].includes(activePage))) {
      return (
        <AuthForms
          mode={activePage === "register" ? "register" : "login"}
          onAuth={(user) => {
            setAuthUser(user);
            setActivePage(activePage === "register" ? "browse" : activePage);
          }}
        />
      );
    }

    if (activePage === "register") {
      return <AuthForms
        mode="register"
        onAuth={(user) => {
          setAuthUser(user);
          setActivePage("browse");
        }}
      />;
    }
    if (activePage === "browse") {
      return (
        <>
          <SearchFilter />
          <BrowseCategories />
        </>
      );
    }
    if (activePage === "book") {
      // Require a selectedPurpose! (Mitigate direct nav, fallback to browse)
      if (!selectedPurpose) {
        setActivePage("browse");
        return null;
      }
      // Only allow booking if logged in
      if (!authUser) return <AuthForms mode="login" onAuth={u => { setAuthUser(u); setActivePage("book"); }} />;
      return (
        <BookingForm
          purpose={selectedPurpose}
          onSubmit={handleBookingSubmit}
          onCancel={() => { setActivePage("browse"); setSelectedPurpose(undefined); }}
        />
      );
    }
    if (activePage === "mybookings") {
      if (!authUser) return <AuthForms mode="login" onAuth={u => { setAuthUser(u); setActivePage("mybookings"); }} />;
      const bookings = userBookings[authUser.username] || [];
      return <MyBookingsPage username={authUser.username} bookings={bookings} onCancel={handleCancelBooking} />;
    }
    if (activePage === "payment") {
      if (!authUser) return <AuthForms mode="login" onAuth={u => { setAuthUser(u); setActivePage("payment"); }} />;
      return <div className="placeholder"><h2>Payment Gateway (Coming Soon)</h2></div>;
    }
    if (activePage === "details") {
      return <div className="placeholder"><h2>Event/Travel Details</h2>
        <p>Detailed view of the selected event or travel option displayed here.</p></div>;
    }
    // Home page as default
    return (
      <>
        <div className="hero">
          <div className="subtitle" style={{ color: "var(--accent)" }}>Your Gateway to Entertainment & Travel</div>
          <h1 className="title" style={{ color: "var(--primary)", fontWeight: 700 }}>EventEase</h1>
          <div className="description" style={{ maxWidth: 500, margin: "0 auto", color: "var(--secondary)" }}>
            Seamlessly search, book, and manage your tickets for movies, travel, concerts, and more – all in one place.
          </div>
          <div style={{ marginBottom: 32 }}>
            {authUser ? (
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  fontWeight: 600,
                  fontSize: 18,
                  background: "rgba(0,173,239,0.07)",
                  borderRadius: 10,
                  padding: "8px 16px"
                }}
              >
                <span role="img" aria-label="user">👤</span>Hi, {authUser.username}
              </span>
            ) : (
              <button className="btn btn-large" onClick={() => setActivePage('register')}>
                Register / Login
              </button>
            )}
          </div>
        </div>
        <SearchFilter />
        <BrowseCategories />
      </>
    );
  }

  // --- Navigation bar integration remains as previous, but support state clearing
  const navItems = [
    { label: 'Home', page: 'home' },
    { label: 'Browse', page: 'browse' },
    { label: 'My Bookings', page: 'mybookings', auth: true },
    { label: isAdmin ? 'User View' : 'Admin', page: 'admin', adminOnly: true },
    { label: authUser ? 'Logout' : 'Register/Login', page: authUser ? 'logout' : 'register' }
  ];

  return (
    <div className="app" style={{ background: "var(--primary)" }}>
      <nav className="navbar" style={{ background: "#101820" }}>
        <div className="container" style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div className="logo" style={{ color: "#fff", gap: 8 }}>
            <span className="logo-symbol" style={{ color: "#00ADEF" }}>🎟️</span> EventEase
          </div>
          <div style={{ display: "flex", gap: "18px", alignItems: "center" }}>
            {navItems.map(
              (item, i) => {
                if (item.page === "mybookings" && !authUser) return null;
                if (item.adminOnly && !isAdmin) return null;
                return (
                  <button
                    key={item.page}
                    className={`btn ${activePage === item.page ? 'btn-active' : ''}`}
                    style={{
                      background: activePage === item.page ? "#0057B8" : "#101820",
                      color: "#fff",
                      fontWeight: activePage === item.page ? 700 : 500,
                      border: "1px solid var(--accent)",
                      borderRadius: 4,
                      padding: "7px 16px",
                      marginLeft: i === 0 ? 0 : 8,
                    }}
                    onClick={() => {
                      if (item.page === "admin") {
                        setIsAdmin(val => !val);
                        setActivePage("admin");
                        return;
                      }
                      if (item.page === "logout") {
                        setAuthUser(null);
                        setIsAdmin(false);
                        setActivePage("home");
                        setSelectedPurpose(undefined);
                        return;
                      }
                      setActivePage(item.page);
                      if (item.page !== "admin") setIsAdmin(false);
                    }}
                  >
                    {item.label}
                  </button>
                );
              }
            )}
            {authUser &&
              <span style={{
                display: "inline-flex",
                alignItems: "center",
                background: "rgba(0,173,239,0.12)",
                color: "var(--accent)",
                fontWeight: 500,
                borderRadius: 99,
                fontSize: 16,
                padding: "5px 15px",
                marginLeft: 8
              }}>
                <span role="img" aria-label="user">👤</span> {authUser.username}
              </span>
            }
          </div>
        </div>
      </nav>
      <main style={{ marginTop: 90, flex: 1 }}>
        <div className="container">
          {renderPage()}
        </div>
      </main>
      <footer style={{
        background: '#101820',
        textAlign: 'center',
        padding: '18px 0',
        color: '#888',
        marginTop: 32,
        fontSize: '1rem'
      }}>
        © {new Date().getFullYear()} EventEase. All rights reserved.
      </footer>
    </div>
  );
}

export default App;
