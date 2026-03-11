import { useState, useEffect } from 'react';
import { Users, Plus, Trash2, Mail, Briefcase, Hash } from 'lucide-react';
import { getEmployees, addEmployee, deleteEmployee } from '../services/api';

const Dashboard = () => {
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Form state
    const [showAddForm, setShowAddForm] = useState(false);
    const [formData, setFormData] = useState({
        emp_id: '',
        full_name: '',
        email: '',
        department: ''
    });
    const [formError, setFormError] = useState(null);

    useEffect(() => {
        fetchEmployees();
    }, []);

    const fetchEmployees = async () => {
        try {
            setLoading(true);
            const { data } = await getEmployees();
            setEmployees(data);
            setError(null);
        } catch (err) {
            setError('Failed to fetch employees. Is the backend running?');
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setFormError(null);
        try {
            await addEmployee(formData);
            setFormData({ emp_id: '', full_name: '', email: '', department: '' });
            setShowAddForm(false);
            fetchEmployees();
        } catch (err) {
            setFormError(err.response?.data?.detail || 'Failed to add employee. Make sure the email is valid and the ID is unique.');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this employee?')) {
            try {
                await deleteEmployee(id);
                fetchEmployees();
            } catch (err) {
                alert('Failed to delete employee.');
            }
        }
    };

    return (
        <div>
            <div className="page-header">
                <div>
                    <h1 className="page-title">Employee Directory</h1>
                    <p className="page-subtitle">Manage your organization's workforce</p>
                </div>
                <button className="btn btn-primary" onClick={() => setShowAddForm(!showAddForm)}>
                    <Plus size={18} /> Add Employee
                </button>
            </div>

            {/* Dashboard Summary Bonus */}
            {!loading && !error && (
                <div className="flex gap-4 mb-4" style={{ flexWrap: 'wrap' }}>
                    <div className="card" style={{ flex: '1 1 200px' }}>
                        <div className="card-body flex items-center gap-4">
                            <div style={{ padding: '1rem', backgroundColor: 'var(--bg-hover)', borderRadius: 'var(--radius-md)' }}>
                                <Users size={24} color="var(--brand-primary)" />
                            </div>
                            <div>
                                <div style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', fontWeight: 500 }}>Total Employees</div>
                                <div style={{ fontSize: '1.5rem', fontWeight: 700 }}>{employees.length}</div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {showAddForm && (
                <div className="card mb-4">
                    <div className="card-header">
                        <h3 style={{ fontSize: '1rem' }}>Add New Employee</h3>
                    </div>
                    <div className="card-body">
                        {formError && <div className="badge badge-danger mb-4" style={{ display: 'block', padding: '0.75rem', borderRadius: '4px' }}>{formError}</div>}
                        <form onSubmit={handleSubmit} className="flex" style={{ flexWrap: 'wrap', gap: '1rem' }}>
                            <div className="form-group" style={{ flex: '1 1 200px', margin: 0 }}>
                                <label className="form-label">Employee ID *</label>
                                <input required type="text" name="emp_id" className="form-input" value={formData.emp_id} onChange={handleInputChange} placeholder="E.g. EMP001" />
                            </div>
                            <div className="form-group" style={{ flex: '1 1 200px', margin: 0 }}>
                                <label className="form-label">Full Name *</label>
                                <input required type="text" name="full_name" className="form-input" value={formData.full_name} onChange={handleInputChange} placeholder="John Doe" />
                            </div>
                            <div className="form-group" style={{ flex: '1 1 200px', margin: 0 }}>
                                <label className="form-label">Email Address *</label>
                                <input required type="email" name="email" className="form-input" value={formData.email} onChange={handleInputChange} placeholder="john@company.com" />
                            </div>
                            <div className="form-group" style={{ flex: '1 1 200px', margin: 0 }}>
                                <label className="form-label">Department *</label>
                                <input required type="text" name="department" className="form-input" value={formData.department} onChange={handleInputChange} placeholder="Engineering" />
                            </div>
                            <div style={{ flex: '1 1 100%', display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginTop: '1rem' }}>
                                <button type="button" className="btn btn-outline" onClick={() => setShowAddForm(false)}>Cancel</button>
                                <button type="submit" className="btn btn-primary">Save Employee</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <div className="card table-container">
                {loading ? (
                    <div className="status-indicator">
                        <div className="spinner"><Users size={32} /></div>
                        <p>Loading employees...</p>
                    </div>
                ) : error ? (
                    <div className="status-indicator">
                        <div style={{ color: 'var(--brand-danger)' }}><Users size={32} /></div>
                        <p>{error}</p>
                        <button className="btn btn-outline mt-4" onClick={fetchEmployees}>Try Again</button>
                    </div>
                ) : employees.length === 0 ? (
                    <div className="status-indicator">
                        <Users size={48} opacity={0.5} />
                        <p>No employees found. Add one to get started!</p>
                    </div>
                ) : (
                    <table className="table">
                        <thead>
                            <tr>
                                <th><div className="flex items-center gap-2"><Hash size={14} /> ID</div></th>
                                <th><div className="flex items-center gap-2"><Users size={14} /> Employee</div></th>
                                <th><div className="flex items-center gap-2"><Mail size={14} /> Contact</div></th>
                                <th><div className="flex items-center gap-2"><Briefcase size={14} /> Department</div></th>
                                <th className="text-center">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {employees.map((emp) => (
                                <tr key={emp.id}>
                                    <td style={{ fontWeight: 500 }}>{emp.emp_id}</td>
                                    <td>
                                        <div className="flex items-center gap-4">
                                            <div className="avatar" style={{ width: 36, height: 36, fontSize: '0.875rem' }}>
                                                {emp.full_name.charAt(0).toUpperCase()}
                                            </div>
                                            <span style={{ fontWeight: 500 }}>{emp.full_name}</span>
                                        </div>
                                    </td>
                                    <td className="text-secondary">{emp.email}</td>
                                    <td><span className="badge" style={{ backgroundColor: 'var(--bg-hover)', border: '1px solid var(--border-color)' }}>{emp.department}</span></td>
                                    <td>
                                        <div className="flex justify-center">
                                            <button
                                                className="btn btn-outline"
                                                style={{ padding: '0.35rem 0.5rem', color: 'var(--brand-danger)', borderColor: 'transparent' }}
                                                title="Delete Employee"
                                                onClick={() => handleDelete(emp.id)}
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

export default Dashboard;
