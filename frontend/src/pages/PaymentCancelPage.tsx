import { useNavigate } from 'react-router-dom'
import Footer from '../components/Footer'

export default function PaymentCancelPage() {
  const navigate = useNavigate()

  return (
    <div>
      <section className="my-res-section">
        <div className="empty-state">
          <div className="empty-icon">✕</div>
          <h3>Platba bola zrušená</h3>
          <p>Platba nebola dokončená. Vaša rezervácia zostáva vo stave čakajúca — môžete sa pokúsiť zaplatiť znova.</p>
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
