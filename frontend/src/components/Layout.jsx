import { Link, useLocation } from 'react-router-dom';
import { Users, CalendarCheck, Settings, LayoutDashboard } from 'lucide-react';

const Layout = ({ children }) => {
    const location = useLocation();

    const navLinks = [
        { name: 'Dashboard', path: '/employees', icon: <LayoutDashboard size={20} /> },
        { name: 'Attendance', path: '/attendance', icon: <CalendarCheck size={20} /> },
    ];

    return (
        <div className="app-container">
            <aside className="sidebar">
                <div className="sidebar-header">
                    <div className="avatar" style={{ backgroundColor: '#2563eb' }}>H</div>
                    <span>HRMS Lite</span>
                </div>
                <nav className="sidebar-nav">
                    {navLinks.map((link) => (
                        <Link
                            key={link.name}
                            to={link.path}
                            className={`nav-link ${location.pathname === link.path ? 'active' : ''}`}
                        >
                            {link.icon}
                            {link.name}
                        </Link>
                    ))}
                </nav>
            </aside>

            <main className="main-content">
                <header className="topbar">
                    <div className="user-profile">
                        <div className="avatar">A</div>
                        <span>Admin User</span>
                    </div>
                </header>
                <div className="page-content">
                    {children}
                </div>
            </main>
        </div>
    );
};

export default Layout;
