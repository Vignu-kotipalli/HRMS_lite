import { useState, useEffect } from 'react';
import { CalendarCheck, Save, Users, History } from 'lucide-react';
import { getEmployees, getAttendance, markAttendance } from '../services/api';

const Attendance = () => {
    const [employees, setEmployees] = useState([]);
    const [selectedEmployee, setSelectedEmployee] = useState('');
    const [attendanceHistory, setAttendanceHistory] = useState([]);

    const [loadingEmployees, setLoadingEmployees] = useState(true);
    const [loadingHistory, setLoadingHistory] = useState(false);
    const [error, setError] = useState(null);

    // Form state
    const [formData, setFormData] = useState({
        date: new Date().toISOString().split('T')[0], // YYYY-MM-DD
        status: 'Present'
    });
    const [markError, setMarkError] = useState(null);
    const [filterDate, setFilterDate] = useState('');

    useEffect(() => {
        fetchEmployees();
    }, []);

    useEffect(() => {
        if (selectedEmployee) {
            fetchAttendanceHistory(selectedEmployee);
        } else {
            setAttendanceHistory([]);
        }
    }, [selectedEmployee]);

    const fetchEmployees = async () => {
        try {
            setLoadingEmployees(true);
            const { data } = await getEmployees();
            setEmployees(data);
        } catch (err) {
            setError('Failed to fetch employees. Is the backend running?');
        } finally {
            setLoadingEmployees(false);
        }
    };

    const fetchAttendanceHistory = async (empId) => {
        try {
            setLoadingHistory(true);
            const { data } = await getAttendance(empId);
            // Sort by date descending
            data.sort((a, b) => new Date(b.date) - new Date(a.date));
            setAttendanceHistory(data);
        } catch (err) {
            console.error('Failed to fetch attendance history', err);
        } finally {
            setLoadingHistory(false);
        }
    };

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleMarkAttendance = async (e) => {
        e.preventDefault();
        if (!selectedEmployee) return;

        setMarkError(null);
        try {
            await markAttendance(selectedEmployee, formData);
            fetchAttendanceHistory(selectedEmployee); // Refresh history
            alert('Attendance marked successfully!');
        } catch (err) {
            setMarkError(err.response?.data?.detail || 'Failed to mark attendance.');
        }
    };

    const filteredHistory = filterDate
        ? attendanceHistory.filter(record => record.date === filterDate)
        : attendanceHistory;

    const totalPresentDays = attendanceHistory.filter(record => record.status === 'Present').length;

    const getStatusBadge = (status) => {
        if (status === 'Present') {
            return <span className="badge badge-success">Present</span>;
        }
        return <span className="badge badge-danger">Absent</span>;
    };

    return (
        <div>
            <div className="page-header">
                <div>
                    <h1 className="page-title">Attendance Tracking</h1>
                    <p className="page-subtitle">Mark and review daily employee attendance</p>
                </div>
            </div>

            <div className="flex" style={{ gap: '2rem', flexWrap: 'wrap', alignItems: 'flex-start' }}>
                {/* Left Column: Form */}
                <div style={{ flex: '1 1 350px' }}>
                    <div className="card">
                        <div className="card-header">
                            <h3 style={{ fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <CalendarCheck size={18} /> Mark Attendance
                            </h3>
                        </div>
                        <div className="card-body">
                            {error && <div className="badge badge-danger mb-4" style={{ display: 'block', padding: '0.75rem', borderRadius: '4px' }}>{error}</div>}
                            {markError && <div className="badge badge-danger mb-4" style={{ display: 'block', padding: '0.75rem', borderRadius: '4px' }}>{markError}</div>}

                            <form onSubmit={handleMarkAttendance}>
                                <div className="form-group">
                                    <label className="form-label">Select Employee *</label>
                                    {loadingEmployees ? (
                                        <div style={{ padding: '0.5rem', color: 'var(--text-secondary)' }}>Loading employees...</div>
                                    ) : (
                                        <select
                                            required
                                            className="form-input"
                                            value={selectedEmployee}
                                            onChange={(e) => setSelectedEmployee(e.target.value)}
                                        >
                                            <option value="" disabled>-- Choose an employee --</option>
                                            {employees.map(emp => (
                                                <option value={emp.id} key={emp.id}>
                                                    {emp.emp_id} - {emp.full_name}
                                                </option>
                                            ))}
                                        </select>
                                    )}
                                </div>

                                <div className="form-group">
                                    <label className="form-label">Date *</label>
                                    <input
                                        required
                                        type="date"
                                        name="date"
                                        className="form-input"
                                        value={formData.date}
                                        onChange={handleInputChange}
                                    />
                                </div>

                                <div className="form-group">
                                    <label className="form-label">Status *</label>
                                    <select
                                        required
                                        name="status"
                                        className="form-input"
                                        value={formData.status}
                                        onChange={handleInputChange}
                                    >
                                        <option value="Present">Present</option>
                                        <option value="Absent">Absent</option>
                                    </select>
                                </div>

                                <button
                                    type="submit"
                                    className="btn btn-primary mt-4"
                                    style={{ width: '100%' }}
                                    disabled={!selectedEmployee}
                                >
                                    <Save size={18} /> Save Attendance Record
                                </button>
                            </form>
                        </div>
                    </div>
                </div>

                {/* Right Column: History */}
                <div style={{ flex: '2 1 500px' }}>
                    <div className="card">
                        <div className="card-header" style={{ flexWrap: 'wrap', gap: '1rem' }}>
                            <h3 style={{ fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', flex: '1 1 200px' }}>
                                <History size={18} /> Attendance History
                            </h3>
                            {selectedEmployee && (
                                <div className="flex items-center gap-4">
                                    <span className="badge" style={{ backgroundColor: 'var(--bg-hover)', border: '1px solid var(--border-color)', fontSize: '0.85rem' }}>
                                        Total Present: <strong style={{ marginLeft: '0.25rem' }}>{totalPresentDays}</strong>
                                    </span>
                                    <input
                                        type="date"
                                        className="form-input"
                                        style={{ padding: '0.25rem 0.5rem', fontSize: '0.875rem', width: 'auto' }}
                                        value={filterDate}
                                        onChange={(e) => setFilterDate(e.target.value)}
                                    />
                                </div>
                            )}
                        </div>

                        {!selectedEmployee ? (
                            <div className="status-indicator">
                                <Users size={32} opacity={0.5} />
                                <p>Select an employee to view their attendance history.</p>
                            </div>
                        ) : loadingHistory ? (
                            <div className="status-indicator">
                                <div className="spinner"><History size={32} /></div>
                                <p>Loading records...</p>
                            </div>
                        ) : attendanceHistory.length === 0 ? (
                            <div className="status-indicator">
                                <CalendarCheck size={32} opacity={0.5} />
                                <p>No attendance records found for this employee.</p>
                            </div>
                        ) : filteredHistory.length === 0 ? (
                            <div className="status-indicator">
                                <CalendarCheck size={32} opacity={0.5} />
                                <p>No records found for the selected date.</p>
                            </div>
                        ) : (
                            <div className="table-container">
                                <table className="table">
                                    <thead>
                                        <tr>
                                            <th>Date</th>
                                            <th>Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredHistory.map(record => (
                                            <tr key={record.id}>
                                                <td style={{ fontWeight: 500 }}>
                                                    {new Date(record.date).toLocaleDateString(undefined, {
                                                        weekday: 'short',
                                                        year: 'numeric',
                                                        month: 'short',
                                                        day: 'numeric',
                                                    })}
                                                </td>
                                                <td>{getStatusBadge(record.status)}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Attendance;
