import { useEffect, useMemo, useState } from 'react';
import { Plus, Search } from 'lucide-react';
import { api, authStore } from './api/client';
import { Auth } from './features/Auth';
import { IssueForm } from './features/IssueForm';
import { IssueDetails } from './features/IssueDetails';
import { IssueTable } from './features/IssueTable';
import { Layout } from './components/Layout';
import type { AppRole, Issue, Notification } from './types/domain';
import './styles.css';

export default function App() {
  const [isAuthed, setAuthed] = useState(Boolean(authStore.token));
  const [role, setRole] = useState<AppRole>('GUEST'); const [view, setView] = useState<'list'|'form'|'details'>('list');
  const [issues, setIssues] = useState<Issue[]>([]); const [selected, setSelected] = useState<Issue | null>(null); const [query, setQuery] = useState('');
  const [notifications, setNotifications] = useState<Notification[]>(() => JSON.parse(localStorage.getItem('hgss.notifications') ?? '[]'));
  const persistNotifications = (items: Notification[]) => { setNotifications(items); localStorage.setItem('hgss.notifications', JSON.stringify(items)); };
  const notify = (n: Omit<Notification, 'id'|'createdAt'|'read'>) => persistNotifications([{ ...n, id: crypto.randomUUID(), createdAt: new Date().toISOString(), read: false }, ...notifications].slice(0, 12));
  async function load() { if (!isAuthed) return; try { setIssues(role === 'GUEST' ? await api.userIssues() : await api.techIssues()); } catch { setIssues(demoIssues); } }
  useEffect(() => { load(); }, [isAuthed, role]);
  const filtered = useMemo(() => issues.filter(i => `${i.id} ${i.title} ${i.roomNumber}`.toLowerCase().includes(query.toLowerCase())), [issues, query]);
  async function onLogin(email: string, password: string, register?: { firstName: string; lastName: string }) { if (register) await api.register({ ...register, email, password }); authStore.token = await api.login(email, password); setAuthed(true); notify({ type: 'success', title: 'Zalogowano', message: 'Sesja użytkownika została rozpoczęta.' }); }
  function onCreated(issue: Issue) { setIssues([issue, ...issues]); setSelected(issue); setView('details'); notify({ type: 'success', title: 'Zgłoszenie zostało wysłane', message: `Twoje zgłoszenie nr ${issue.id} zostało zapisane.`, issueId: issue.id }); }
  function onStatusChange(issue: Issue) { setIssues(issues.map(i => i.id === issue.id ? issue : i)); setSelected(issue); notify({ type: issue.status === 'CLOSED' ? 'success' : 'info', title: 'Status zgłoszenia został zmieniony', message: `Zgłoszenie nr ${issue.id}: ${issue.status}.`, issueId: issue.id }); }
  if (!isAuthed) return <Auth onLogin={onLogin}/>;
  const staff = role !== 'GUEST';
  return <Layout role={role} setRole={setRole} technical={staff} onLogout={() => { authStore.token = null; setAuthed(false); }} notifications={notifications} onMarkAllRead={() => persistNotifications(notifications.map(n => ({ ...n, read: true })))}>
    {view === 'form' && <IssueForm onCreated={onCreated} onCancel={() => setView('list')}/>} {view === 'details' && selected && <IssueDetails issue={selected} staff={staff} onBack={() => setView('list')} onStatusChange={onStatusChange}/>} {view === 'list' && <section className="panel"><div className="toolbar"><label><Search size={16}/><input placeholder="Szukaj" value={query} onChange={e => setQuery(e.target.value)}/></label>{role === 'GUEST' && <button onClick={() => setView('form')}><Plus size={16}/> zgłoś problem</button>}</div>{filtered.length ? <IssueTable issues={filtered} onSelect={i => { setSelected(i); setView('details'); }}/> : <div className="empty"><h2>Przykro nam, że napotkałeś problem podczas pobytu...</h2><p>Nie masz jeszcze żadnych zgłoszeń. Gdy dodasz pierwsze, pojawi się w tym miejscu wraz z aktualnym statusem.</p></div>}</section>}
  </Layout>;
}
const demoIssues: Issue[] = [{ id: 12345, type: 'TECHNICAL', title: 'Nie działa klimatyzacja', status: 'NEW', creationDate: '2026-03-01T10:00:00', roomNumber: 63 },{ id: 12346, type: 'TECHNICAL', title: 'Awaria światła', status: 'OPEN', creationDate: '2026-03-01T12:00:00', roomNumber: 52 },{ id: 12347, type: 'RECEPTION', title: 'Brak ręczników', status: 'CLOSED', creationDate: '2026-03-01T13:00:00', roomNumber: 15 }];
