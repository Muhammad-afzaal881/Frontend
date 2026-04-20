// TermsPolicies.jsx
import './termpolices.css'

const TermsPolicies = () => {
  return (
    <div className="terms-container" style={{ padding: "2rem", maxWidth: "800px", margin: "0 auto", lineHeight: "1.6" }}>
      <h1 style={{ textAlign: "center", marginBottom: "2rem" }}>Terms & Policies</h1>

      {/* Terms & Conditions */}
      <section style={{ marginBottom: "2rem" }}>
        <h2>1. Terms & Conditions</h2>
        <p>
          By using our website, you agree to follow all rules and guidelines set forth on this platform.
          Users must provide accurate information while creating accounts, respect copyrights, and
          comply with order and payment policies.
        </p>
        <p>
          We reserve the right to update or change these terms at any time without prior notice.
          Continued use of the website constitutes acceptance of the updated terms.
        </p>
      </section>

      {/* Privacy Policy */}
      <section style={{ marginBottom: "2rem" }}>
        <h2>2. Privacy Policy</h2>
        <p>
          We value your privacy. Your personal information such as name, email, and shipping address
          is collected only to process orders and provide better services.
        </p>
        <p>
          We may use cookies for analytics and marketing purposes. Your data will never be sold to
          third parties, except to fulfill orders (like payment gateways or shipping partners).
        </p>
      </section>

      {/* Return / Refund Policy */}
      <section style={{ marginBottom: "2rem" }}>
        <h2>3. Return / Refund Policy</h2>
        <p>
          Returns are accepted within 14 days of delivery. Products must be unused and in original
          packaging. Refunds will be issued to the original payment method once the return is approved.
        </p>
        <p>
          Some items may be non-returnable or have special return conditions, which will be
          mentioned on the product page.
        </p>
      </section>

      {/* Shipping Policy */}
      <section style={{ marginBottom: "2rem" }}>
        <h2>4. Shipping / Delivery Policy</h2>
        <p>
          We ship products domestically and internationally. Delivery times may vary depending on
          location and shipping method. Shipping charges are calculated at checkout.
        </p>
        <p>
          We are not responsible for delays caused by courier services, customs, or natural events.
        </p>
      </section>

      {/* Optional: Cookie Policy */}
      <section style={{ marginBottom: "2rem" }}>
        <h2>5. Cookie Policy</h2>
        <p>
          Our website uses cookies to enhance user experience and analyze website traffic.
          By using this website, you consent to the use of cookies.
        </p>
      </section>

      <p style={{ textAlign: "center", marginTop: "3rem", fontStyle: "italic", color: "#555" }}>
        Last Updated: February 2026
      </p>
    </div>
  );
};

export default TermsPolicies;
