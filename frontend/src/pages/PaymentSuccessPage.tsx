import { useNavigate } from 'react-router-dom'
import Footer from '../components/Footer'

export default function PaymentSuccessPage() {
  const navigate = useNavigate()

  return (
    <div>
      <section className="my-res-section">
        <div className="empty-state">
          <div className="empty-icon">✓</div>
          <h3>Platba prebehla úspešne</h3>
          <p>Vaša rezervácia bola zaplatená. Potvrdzovací email vám bol odoslaný.</p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <button className="btn-primary" onClick={() => navigate('/my-reservations')}>
              Moje rezervácie
            </button>
            <button className="btn-outline" onClick={() => navigate('/shows')}>
              Prezerať predstavenia
            </button>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  )
}
