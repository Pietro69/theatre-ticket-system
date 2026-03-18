import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { usersApi, reservationsApi, paymentsApi } from '../api/api'
import type { UserReservation } from '../api/types'
import { formatDate, formatTime } from '../utils'
import Footer from '../components/Footer'

export default function MyReservationsPage() {
  const { user, openLoginModal } = useApp()
  const navigate = useNavigate()
  const [reservations, setReservations] = useState<UserReservation[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [cancelling, setCancelling] = useState<number | null>(null)
  const [paying, setPaying] = useState<number | null>(null)

  useEffect(() => {
    if (!user) {
      setLoading(false)
      return
    }
    usersApi.getReservations(user.id)
      .then(data => setReservations(data.sort((a, b) => b.id - a.id)))
      .catch(() => setError('Nepodarilo sa načítať rezervácie.'))
      .finally(() => setLoading(false))
  }, [user])

  const handlePay = async (id: number) => {
    setPaying(id)
    try {
      const { url } = await paymentsApi.createCheckout(id)
      window.location.href = url
    } catch {
      setError('Nepodarilo sa otvoriť platobnú bránu. Skúste znova.')
      setPaying(null)
    }
  }

  const handleCancel = async (id: number) => {
    if (!window.confirm('Naozaj chcete zrušiť túto rezerváciu?')) return
    setCancelling(id)
    try {
      await reservationsApi.cancel(id)
      setReservations(prev =>
        prev.map(r => r.id === id ? { ...r, status: 'CANCELED' as const } : r)
      )
    } catch {
      setError('Nepodarilo sa zrušiť rezerváciu. Skúste znova.')
    } finally {
      setCancelling(null)
    }
  }

  if (!user) {
    return (
      <div>
        <section className="my-res-section">
          <div className="empty-state">
            <div className="empty-icon">🔒</div>
            <h3>Prihlásenie vyžadované</h3>
            <p>Pre zobrazenie vašich rezervácií sa musíte prihlásiť.</p>
            <button className="btn-primary" onClick={openLoginModal}>Prihlásiť sa</button>
          </div>
        </section>
        <Footer />
      </div>
    )
  }

  if (loading) {
    return (
      <section className="my-res-section">
        <div className="loading-wrap"><div className="spinner" /></div>
      </section>
    )
  }

  const pending = reservations.filter(r => r.status === 'PENDING')
  const active = reservations.filter(r => r.status === 'ACTIVE' || r.status === 'PAID')
  const cancelled = reservations.filter(r => r.status === 'CANCELED' || r.status === 'EXPIRED')

  return (
    <div>
      <section className="my-res-section">
        <div className="section-label">Môj účet</div>
        <div className="my-res-header">
          <h2 className="section-title">Moje rezervácie</h2>
          <div className="my-res-user">
            <span className="my-res-name">{user.name}</span>
            <span className="my-res-email">{user.email}</span>
          </div>
        </div>

        {error && <div className="error-msg" style={{ marginBottom: 24 }}>{error}</div>}

        {reservations.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">🎭</div>
            <h3>Žiadne rezervácie</h3>
            <p>Zatiaľ ste si nevytvorili žiadnu rezerváciu.</p>
            <button className="btn-primary" onClick={() => navigate('/shows')}>
              Prezerať predstavenia
            </button>
          </div>
        ) : (
          <>
            {pending.length > 0 && (
              <div className="my-res-group">
                <div className="my-res-group-label">Čakajúce na platbu ({pending.length})</div>
                <div className="res-list">
                  {pending.map(r => (
                    <ReservationCard
                      key={r.id}
                      reservation={r}
                      onCancel={handleCancel}
                      cancelling={cancelling}
                      onPay={handlePay}
                      paying={paying}
                      onShowDetail={() => navigate(`/shows/${r.performance.show.id}`)}
                    />
                  ))}
                </div>
              </div>
            )}

            {active.length > 0 && (
              <div className="my-res-group">
                <div className="my-res-group-label">Zaplatené ({active.length})</div>
                <div className="res-list">
                  {active.map(r => (
                    <ReservationCard
                      key={r.id}
                      reservation={r}
                      onCancel={handleCancel}
                      cancelling={cancelling}
                      onPay={handlePay}
                      paying={paying}
                      onShowDetail={() => navigate(`/shows/${r.performance.show.id}`)}
                    />
                  ))}
                </div>
              </div>
            )}

            {cancelled.length > 0 && (
              <div className="my-res-group">
                <div className="my-res-group-label">Zrušené ({cancelled.length})</div>
                <div className="res-list">
                  {cancelled.map(r => (
                    <ReservationCard
                      key={r.id}
                      reservation={r}
                      onCancel={handleCancel}
                      cancelling={cancelling}
                      onPay={handlePay}
                      paying={paying}
                      onShowDetail={() => navigate(`/shows/${r.performance.show.id}`)}
                    />
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </section>
      <Footer />
    </div>
  )
}

interface CardProps {
  reservation: UserReservation
  onCancel: (id: number) => void
  cancelling: number | null
  onPay: (id: number) => void
  paying: number | null
  onShowDetail: () => void
}

function ReservationCard({ reservation: r, onCancel, cancelling, onPay, paying, onShowDetail }: CardProps) {
  const isCancelled = r.status === 'CANCELED' || r.status === 'EXPIRED'
  const isPending = r.status === 'PENDING'
  const isPaid = r.status === 'PAID' || r.status === 'ACTIVE'

  const statusLabel = r.status === 'EXPIRED' ? 'Expirovaná' : isCancelled ? 'Zrušená' : isPending ? 'Čakajúca' : 'Zaplatená'
  const statusClass = isCancelled ? 'cancelled' : isPending ? 'pending' : 'paid'

  return (
    <div className={`res-card${isCancelled ? ' res-card--cancelled' : ''}`}>
      <div className="res-card-date">
        <div className="res-day">{new Date(r.performance.startTime).getDate()}</div>
        <div className="res-mon">
          {new Date(r.performance.startTime).toLocaleDateString('sk-SK', { month: 'short' }).replace('.', '').trim().toUpperCase()}
        </div>
      </div>

      <div className="res-card-body">
        <h3 className="res-show-title">{r.performance.show.title}</h3>
        <div className="res-meta">
          <span>{formatDate(r.performance.startTime)} · {formatTime(r.performance.startTime)}</span>
          <span className="res-dot">·</span>
          <span>{r.performance.hall?.name ?? 'Hlavná sála'}</span>
          <span className="res-dot">·</span>
          <span>{r.performance.show.genre}</span>
        </div>
        <div className="res-footer-row">
          <span className="res-id">Rezervácia #{r.id}</span>
          <span className="res-created">Vytvorená: {formatDate(r.createdAt)}</span>
        </div>
      </div>

      <div className="res-card-right">
        <div className={`res-status-badge ${statusClass}`}>
          {statusLabel}
        </div>
        <button className="btn-ghost res-btn-detail" onClick={onShowDetail}>
          Detail predstavenia
        </button>
        {isPending && (
          <button
            className="btn-pay"
            onClick={() => onPay(r.id)}
            disabled={paying === r.id}
          >
            {paying === r.id ? 'Presmerovávam...' : 'Zaplatiť'}
          </button>
        )}
        {!isCancelled && !isPaid && (
          <button
            className="btn-cancel"
            onClick={() => onCancel(r.id)}
            disabled={cancelling === r.id}
          >
            {cancelling === r.id ? 'Ruším...' : 'Zrušiť rezerváciu'}
          </button>
        )}
      </div>
    </div>
  )
}
