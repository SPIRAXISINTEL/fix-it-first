import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setTimeout(() => {
      const result = login(email, password);
      if (result.success) {
        navigate('/dashboard');
      } else {
        setError(result.message);
      }
      setLoading(false);
    }, 500);
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-header">
          <div className="login-logo">
            <div className="login-logo-icon">🚗</div>
            <span className="login-logo-text">MOBILUS</span>
          </div>
          <h2>Système de Gestion Location</h2>
          <p>Connectez-vous pour accéder au tableau de bord</p>
        </div>
        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label>Adresse Email</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)}
              placeholder="admin@admin.ma" required />
          </div>
          <div className="form-group">
            <label>Mot de Passe</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)}
              placeholder="••••••••" required />
          </div>
          <button type="submit" className="btn btn-primary btn-login" disabled={loading}>
            {loading ? 'Connexion en cours...' : '⟶  SE CONNECTER'}
          </button>
          <div className="login-divider"><span>OU</span></div>
          <button type="button" onClick={() => navigate('/agency-wizard')} className="btn btn-outline btn-create">
            CRÉER UNE AGENCE
          </button>
        </form>
        {error && <div className="login-message error">{error}</div>}
        <p className="login-demo-note">Admin : admin@admin.ma / admin</p>
      </div>
    </div>
  );
};

export default Login;
