import React, { useState } from 'react';
import './App.css';
import { AuthForms } from "./AuthForms";

/*
  Color palette provided in the requirements (with names matching for later CSS adaptability):
    --primary: #101820;
    --secondary: #0057B8;
    --accent: #00ADEF;
*/

// PUBLIC_INTERFACE
function App() {
  const [activePage, setActivePage] = useState('home');
  const [isAdmin, setIsAdmin] = useState(false); // Change to simulate admin view
  const [authUser, setAuthUser] = useState(null); // {username: string}

  // --- Render main content pages
  const BrowseCategories = () => (
    <div className="categories-grid">
      {["Movies", "Travel", "Events", "Sports", "Concerts"].map(cat => (
        <div className="category-card" key={cat}>
          <div className="category-icon">{cat[0]}</div>
          <div className="category-title">{cat}</div>
        </div>
      ))}
    </div>
  );

  const SearchFilter = () => (
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

  const EventTravelDetails = () => (
    <div className="placeholder">
      <h2>Event/Travel Details</h2>
      <p>Detailed view of the selected event or travel option displayed here.</p>
    </div>
  );

  const BookingConfirmation = () => (
    <div className="placeholder">
      <h2>Ticket Booking & Confirmation</h2>
      <p>Booking form and confirmation details for selected tickets.</p>
    </div>
  );

  const ViewCancelBookings = () => (
    <div className="placeholder">
      <h2>View & Cancel Bookings</h2>
      <p>User's active/past bookings and option to cancel future bookings.</p>
    </div>
  );

  const PaymentGateway = () => (
    <div className="placeholder">
      <h2>Payment Gateway Integration</h2>
      <p>Secure payment form (stub for payment integration) displays here.</p>
    </div>
  );

  const AdminManagement = () => (
    <div className="placeholder">
      <h2>Admin Event Management</h2>
      <p>Admins can manage users, events, view stats, and approve requests.</p>
    </div>
  );

  // Main page rendering switch (stub navigation for now)
  function renderPage() {
    if (isAdmin) {
      return (
        <>
          <AdminManagement />
        </>
      );
    }
    // If not admin, handle auth
    if (!authUser && (activePage === "register" || activePage === "mybookings" || activePage === "book" || activePage === "payment")) {
      // Show login/register page if on protected flows with no user
      return (
        <AuthForms
          mode={activePage === "register" ? "register" : "login"}
          onAuth={(user) => {
            setAuthUser(user);
            // If we explicitly arrived on register route, redirect to browse after login
            setActivePage(activePage === "register" ? "browse" : activePage);
          }}
        />
      );
    }
    switch (activePage) {
      case 'register':
        return (
          <AuthForms
            mode="register"
            onAuth={(user) => {
              setAuthUser(user);
              setActivePage("browse");
            }}
          />
        );
      case 'browse':
        return (
          <>
            <SearchFilter />
            <BrowseCategories />
          </>
        );
      case 'details':
        return <EventTravelDetails />;
      case 'book':
        // Only allow booking if logged in
        if (!authUser) return <AuthForms
          mode="login"
          onAuth={u => { setAuthUser(u); setActivePage("book"); }}
        />;
        return <BookingConfirmation />;
      case 'mybookings':
        if (!authUser) return <AuthForms mode="login" onAuth={u => { setAuthUser(u); setActivePage("mybookings"); }} />;
        return <ViewCancelBookings />;
      case 'payment':
        if (!authUser) return <AuthForms mode="login" onAuth={u => { setAuthUser(u); setActivePage("payment"); }} />;
        return <PaymentGateway />;
      default:
        // Home page: categories grid, search/filter, login/register call-to-action
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
  }

  // --- Navigation bar stub for all main flows
  const navItems = [
    { label: 'Home', page: 'home' },
    { label: 'Browse', page: 'browse' },
    { label: 'My Bookings', page: 'mybookings', auth: true },
    { label: isAdmin ? 'User View' : 'Admin', page: 'admin', adminOnly: true }, // toggle admin
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
