import { useLocation, Link } from "react-router-dom";

export default function CheckoutSuccess() {
  const location = useLocation();
  const orderId = location.state?.orderId;

  return (
    <div style={{ padding: 24, maxWidth: 720, margin: "0 auto" }}>
      <h1>Order placed ✅</h1>
      {orderId && <p><b>Order ID:</b> {orderId}</p>}

      <p>
        We sent you a confirmation email.
        You will be contacted via WhatsApp soon to confirm the order.
      </p>

      <Link to="/">Go home</Link>
    </div>
  );
}