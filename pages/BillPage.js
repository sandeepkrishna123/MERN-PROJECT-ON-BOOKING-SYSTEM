import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/BillPage.css'; // Import your CSS for styling

const BillPage = () => {
  const navigate = useNavigate();
  const seatCost = 1300;
  const gstRate = 0.03; // 3% GST

  // Load selected seats from localStorage
  const selectedSeats = JSON.parse(localStorage.getItem("selectedSeats")) || [];
  const totalCost = selectedSeats.length * seatCost;
  const gstAmount = totalCost * gstRate;
  const finalAmount = totalCost + gstAmount;

  return (
    <div className="bill-page">
      <h1>Booking Summary</h1>
      <div className="summary">
        <h2>Selected Seats</h2>
        <ul>
          {selectedSeats.map(seat => (
            <li key={seat}>Seat {seat}</li>
          ))}
        </ul>
        <h3>Cost per Seat: ₹{seatCost}</h3>
        <h3>Total Cost: ₹{totalCost}</h3>
        <h3>GST (3%): ₹{gstAmount.toFixed(2)}</h3>
        <h3 className="final-amount">Final Amount: ₹{finalAmount.toFixed(2)}</h3>
      </div>
      <div className="buttons">
        <button className="confirm-btn" onClick={() => navigate('/Payment')}>
          Confirm Booking
        </button>
        <button className="back-btn" onClick={() => navigate('/BusSeats')}>
          Back to Seat Selection
        </button>
      </div>
    </div>
  );
};

export default BillPage;
