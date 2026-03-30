import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const TEAM = [
  {
    name: 'Dominik',
    role: 'Backend Developer',
    description: 'Zodpovedá za backend aplikácie, REST API, databázovú logiku a hlavné funkcie rezervačného systému.',
    initials: 'DK',
    photo: ''
  },
  {
    name: 'Peter',
    role: 'Frontend Developer',
    description: 'Pracuje na používateľskom rozhraní, React komponentoch a napojení frontendu na backend API.',
    initials: 'PV',
    photo: ''
  },
  {
    name: 'Aurel',
    role: 'Tester',
    description: 'Testuje používateľské scenáre, odhaľuje chyby a prináša spätnú väzbu z pohľadu používateľa.',
    initials: 'AG',
    photo: ''
  },
  {
    name: 'Jakub',
    role: 'Konzultant',
    description: 'Pomáha s koordináciou tímu, prioritizáciou úloh a spracovaním spätnej väzby počas vývoja.',
    initials: 'JJ',
    photo: ''
  },
  {
    name: 'Erik',
    role: 'Dokumentácia',
    description: 'Pripravuje projektovú dokumentáciu, zbiera podklady od tímu a spracováva priebeh vývoja.',
    initials: 'ECH',
    photo: ''
  },
]

function TeamCard({ member }: { member: typeof TEAM[0] }) {
  const [imgError, setImgError] = useState(false)

  return (
    <div className="team-card">
      <div className="team-avatar-wrap">
        <div className="team-avatar">
          {member.photo && !imgError ? (
            <img src={member.photo} alt={member.name} onError={() => setImgError(true)} />
          ) : (
            <span className="team-avatar-initials">{member.initials}</span>
          )}
        </div>
      </div>
      <div className="team-name">{member.name}</div>
      <div className="team-role">{member.role}</div>
      <p className="team-desc">{member.description}</p>
    </div>
  )
}

export default function AboutPage() {
  const navigate = useNavigate()

  return (
    <section className="about-section">
      <div className="about-intro">
        <span className="section-label">Tím</span>
        <h2 className="section-title">O projekte</h2>
        <p>
          Na vývoji rezervačného systému Klára pracoval tím študentov, ktorí sa venovali
          backendu, frontendu, testovaniu aj dokumentácii. Každý člen tímu mal svoju rolu
          a podieľal sa na výslednej podobe aplikácie.
        </p>
      </div>

      <div className="team-grid">
        {TEAM.map(member => (
          <TeamCard key={member.name} member={member} />
        ))}
      </div>

      <div style={{ textAlign: 'center', marginTop: '72px' }}>
        <button className="btn-primary" onClick={() => navigate('/shows')}>
          Pozrieť predstavenia
        </button>
      </div>
    </section>
  )
}